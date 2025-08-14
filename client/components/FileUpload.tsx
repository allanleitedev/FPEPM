import { useState, useRef } from 'react';
import { supabase, Document } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Card, CardContent } from '@/components/ui/card';
import { Upload, X, FileText, AlertCircle, CheckCircle2 } from 'lucide-react';

interface FileUploadProps {
  onFileUploaded: (document: Document) => void;
  category: string;
  maxSizeMs?: number;
  allowedTypes?: string[];
}

const ALLOWED_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'image/jpeg',
  'image/png',
  'image/webp'
];

const DEFAULT_MAX_MB = 10;
const MAX_SIZE = DEFAULT_MAX_MB * 1024 * 1024; // default 10MB

export default function FileUpload({ 
  onFileUploaded, 
  category, 
  maxSizeMs = MAX_SIZE,
  allowedTypes = ALLOWED_TYPES 
}: FileUploadProps) {
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { user } = useAuth();

  const validateFile = (file: File): string | null => {
    if (!allowedTypes.includes(file.type)) {
      return 'Tipo de arquivo não permitido. Use PDF, DOC, DOCX, XLS, XLSX, JPG, PNG ou WEBP.';
    }
    
    if (file.size > maxSizeMs) {
      return `Arquivo muito grande. Tamanho máximo: ${Math.round(maxSizeMs / 1024 / 1024)}MB`;
    }
    
    return null;
  };

  const validateFileWithLimit = (file: File, sizeLimit: number): string | null => {
    if (!allowedTypes.includes(file.type)) {
      return 'Tipo de arquivo não permitido. Use PDF, DOC, DOCX, XLS, XLSX, JPG, PNG ou WEBP.';
    }
    
    if (file.size > sizeLimit) {
      return `Arquivo muito grande. Tamanho máximo: ${Math.round(sizeLimit / 1024 / 1024)}MB`;
    }
    
    return null;
  };

  const uploadDocument = async (file: File, title: string, description: string): Promise<Document> => {
    if (!user) {
      throw new Error('Usuário não autenticado');
    }

    // Check if user exists in admin_users table, if not create it
    const { data: existingUser, error: checkError } = await supabase
      .from('admin_users')
      .select('id')
      .eq('id', user.id)
      .single();

    if (checkError && checkError.code !== 'PGRST116') {
      console.error('❌ [uploadDocument] Erro ao verificar usuário:', checkError);
      throw new Error('Erro ao verificar usuário na base de dados');
    }

    if (!existingUser) {
      console.log('🔧 [uploadDocument] Criando usuário na tabela admin_users');
      console.log('📝 [uploadDocument] Dados do usuário:', {
        id: user.id,
        auth_user_id: user.auth_user_id,
        email: user.email,
        name: user.name,
        role: user.role
      });
      
      const { data: newUser, error: userCreateError } = await supabase
        .from('admin_users')
        .insert({
          id: user.id,
          auth_user_id: user.auth_user_id,
          email: user.email,
          name: user.name,
          role: user.role
        })
        .select()
        .single();
      
      if (userCreateError) {
        console.error('❌ [uploadDocument] Erro ao criar usuário:', userCreateError);
        throw new Error(`Erro ao criar usuário: ${userCreateError.message}`);
      }
      
      console.log('✅ [uploadDocument] Usuário criado com sucesso:', newUser);
    }

    // Create a unique filename
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
    const filePath = `${category}/${fileName}`;

    // Upload file to Supabase Storage
    setProgress(25);
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('documents')
      .upload(filePath, file);

    if (uploadError) {
      throw new Error(`Erro no upload: ${uploadError.message}`);
    }

    setProgress(50);

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('documents')
      .getPublicUrl(filePath);

    setProgress(75);

    // Create document record in database
    const documentData = {
      title,
      description: description || null,
      category: category,
      file_name: file.name,
      file_path: filePath,
      file_size: file.size,
      file_type: file.type,
      uploaded_by: user.id,
      tags: description ? description.split(' ').filter(word => word.length > 3).slice(0, 3) : null
    };

    console.log('📝 [uploadDocument] User ID:', user.id);
    console.log('📝 [uploadDocument] Category:', category);
    console.log('📝 [uploadDocument] Dados sendo enviados:', documentData);

    const { data: document, error: dbError } = await supabase
      .from('documents')
      .insert(documentData)
      .select('*, admin_users(*)')
      .single();

    if (dbError) {
      console.error('❌ [uploadDocument] Erro no banco de dados:', dbError);
      // If database insert fails, cleanup uploaded file
      await supabase.storage
        .from('documents')
        .remove([filePath]);
      throw new Error(`Erro ao salvar documento: ${dbError.message}`);
    }

    setProgress(100);
    return document;
  };

  const handleFileUpload = async (file: File, title: string, description: string = '') => {
    setError('');
    setSuccess('');
    setProgress(0);
    
    // Pegar limite dinâmico do Supabase ANTES da validação
    let dynamicMaxSize = maxSizeMs;
    try {
      const res = await supabase.from('app_settings').select('value').eq('key','max_upload_mb').single();
      const mb = res.data?.value ? parseInt(res.data.value,10) : DEFAULT_MAX_MB;
      if (!isNaN(mb) && mb > 0) {
        dynamicMaxSize = mb * 1024 * 1024;
      }
    } catch {}
    
    // Validação com limite dinâmico
    const validationError = validateFileWithLimit(file, dynamicMaxSize);
    if (validationError) {
      setError(validationError);
      return;
    }
    
    setUploading(true);
    
    try {
      const document = await uploadDocument(file, title, description);
      onFileUploaded(document);
      setSuccess(`Documento "${title}" enviado com sucesso!`);
      setProgress(0);
    } catch (err: any) {
      console.warn('Failed to upload to Supabase:', err);
      setError('Erro ao enviar arquivo. Tente novamente.');
    } finally {
      setUploading(false);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      // For drop, we'll need a modal to get title
      // For now, use filename as title
      const title = file.name.split('.')[0];
      handleFileUpload(file, title);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      // For file select, we'll need a modal to get title
      // For now, use filename as title
      const title = file.name.split('.')[0];
      handleFileUpload(file, title);
    }
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  const categoryLabel = category;

  return (
    <Card className="border-2 border-dashed border-gray-300 hover:border-pentathlon-blue transition-colors">
      <CardContent className="p-6">
        <div
          className={`relative rounded-lg p-8 text-center transition-colors ${
            dragActive 
              ? 'border-2 border-pentathlon-blue bg-pentathlon-blue/5' 
              : 'border-2 border-transparent'
          } ${uploading ? 'pointer-events-none opacity-50' : 'cursor-pointer hover:bg-gray-50'}`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={openFileDialog}
        >
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            accept={allowedTypes.join(',')}
            onChange={handleFileSelect}
            disabled={uploading}
          />
          
          <div className="space-y-4">
            <div className="mx-auto w-16 h-16 bg-pentathlon-blue/10 rounded-full flex items-center justify-center">
              <Upload className="w-8 h-8 text-pentathlon-blue" />
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                {uploading ? 'Enviando arquivo...' : `Enviar documento - ${categoryLabel}`}
              </h3>
              <p className="text-gray-600 mt-1">
                Arraste um arquivo aqui ou clique para selecionar
              </p>
            </div>
            
            <div className="text-sm text-gray-500">
              <p>Arquivos aceitos: PDF, DOC, DOCX, XLS, XLSX, JPG, PNG, WEBP</p>
              <p>Tamanho máximo: {Math.round(maxSizeMs / 1024 / 1024)}MB</p>
            </div>
          </div>
          
          {uploading && (
            <div className="mt-6">
              <Progress value={progress} className="w-full" />
              <p className="text-sm text-gray-600 mt-2">{progress}%</p>
            </div>
          )}
        </div>
        
        {error && (
          <Alert variant="destructive" className="mt-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        {success && (
          <Alert className="mt-4 border-green-200 text-green-800 bg-green-50">
            <CheckCircle2 className="h-4 w-4 text-green-600" />
            <AlertDescription>{success}</AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
}

// Enhanced FileUpload with form for title and description
export function FileUploadWithForm({ 
  onFileUploaded, 
  category, 
  maxSizeMs = MAX_SIZE,
  allowedTypes = ALLOWED_TYPES 
}: FileUploadProps) {
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { user } = useAuth();

  const validateFile = (file: File): string | null => {
    if (!allowedTypes.includes(file.type)) {
      return 'Tipo de arquivo não permitido. Use PDF, DOC, DOCX, XLS, XLSX, JPG, PNG ou WEBP.';
    }
    
    if (file.size > maxSizeMs) {
      return `Arquivo muito grande. Tamanho máximo: ${Math.round(maxSizeMs / 1024 / 1024)}MB`;
    }
    
    return null;
  };

  const validateFileWithLimit = (file: File, sizeLimit: number): string | null => {
    if (!allowedTypes.includes(file.type)) {
      return 'Tipo de arquivo não permitido. Use PDF, DOC, DOCX, XLS, XLSX, JPG, PNG ou WEBP.';
    }
    
    if (file.size > sizeLimit) {
      return `Arquivo muito grande. Tamanho máximo: ${Math.round(sizeLimit / 1024 / 1024)}MB`;
    }
    
    return null;
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      
      // Pegar limite dinâmico antes da validação
      let dynamicMaxSize = maxSizeMs;
      try {
        const res = await supabase.from('app_settings').select('value').eq('key','max_upload_mb').single();
        const mb = res.data?.value ? parseInt(res.data.value,10) : DEFAULT_MAX_MB;
        if (!isNaN(mb) && mb > 0) {
          dynamicMaxSize = mb * 1024 * 1024;
        }
      } catch {}
      
      const validationError = validateFileWithLimit(selectedFile, dynamicMaxSize);
      
      if (validationError) {
        setError(validationError);
        return;
      }
      
      setFile(selectedFile);
      setTitle(selectedFile.name.split('.')[0]);
      setError('');
    }
  };

  const handleUpload = async () => {
    if (!file || !title.trim()) {
      setError('Por favor, selecione um arquivo e preencha o título');
      return;
    }

    if (!user) {
      setError('Usuário não autenticado');
      return;
    }

    setUploading(true);
    setError('');
    setProgress(0);

    try {
      // Check if user exists in admin_users table, if not create it
      const { data: existingUser, error: checkError } = await supabase
        .from('admin_users')
        .select('id')
        .eq('id', user.id)
        .single();

      if (checkError && checkError.code !== 'PGRST116') {
        console.error('❌ [handleUpload] Erro ao verificar usuário:', checkError);
        throw new Error('Erro ao verificar usuário na base de dados');
      }

      if (!existingUser) {
        console.log('🔧 [handleUpload] Criando usuário na tabela admin_users');
        console.log('📝 [handleUpload] Dados do usuário:', {
          id: user.id,
          auth_user_id: user.auth_user_id,
          email: user.email,
          name: user.name,
          role: user.role
        });
        
        const { data: newUser, error: userCreateError } = await supabase
          .from('admin_users')
          .insert({
            id: user.id,
            auth_user_id: user.auth_user_id,
            email: user.email,
            name: user.name,
            role: user.role
          })
          .select()
          .single();
        
        if (userCreateError) {
          console.error('❌ [handleUpload] Erro ao criar usuário:', userCreateError);
          throw new Error(`Erro ao criar usuário: ${userCreateError.message}`);
        }
        
        console.log('✅ [handleUpload] Usuário criado com sucesso:', newUser);
      }

      // Create a unique filename
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `${category}/${fileName}`;

      // Upload file to Supabase Storage
      setProgress(25);
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('documents')
          .upload(filePath, file);

      if (uploadError) {
        throw new Error(`Erro no upload: ${uploadError.message}`);
      }

      setProgress(50);

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('documents')
        .getPublicUrl(filePath);

      setProgress(75);

      // Create document record in database
      const documentData = {
        title: title.trim(),
        description: description.trim() || null,
        category: category,
        file_name: file.name,
        file_path: filePath,
        file_size: file.size,
        file_type: file.type,
        uploaded_by: user.id,
        tags: description ? description.split(' ').filter(word => word.length > 3).slice(0, 3) : null
      };

      console.log('📝 [handleUpload] User ID:', user.id);
      console.log('📝 [handleUpload] Category:', category);
      console.log('📝 [handleUpload] Dados sendo enviados:', documentData);

        const { data: document, error: dbError } = await supabase
          .from('documents')
          .insert(documentData)
          .select('*, admin_users(*)')
          .single();

      if (dbError) {
        console.error('❌ [handleUpload] Erro no banco de dados:', dbError);
        // If database insert fails, cleanup uploaded file
        await supabase.storage
          .from('documents')
          .remove([filePath]);
        throw new Error(`Erro ao salvar documento: ${dbError.message}`);
      }

      setProgress(100);
      onFileUploaded(document);
      // Reset form
      setFile(null);
      setTitle('');
      setDescription('');
      setProgress(0);
    } catch (err: any) {
      console.warn('Failed to upload to Supabase:', err);
      setError('Erro ao enviar arquivo. Tente novamente.');
      // Reset form
      setFile(null);
      setTitle('');
      setDescription('');
      setProgress(0);
    } finally {
      setUploading(false);
    }
  };

  const categoryLabel = category;

  return (
    <div className="space-y-4">
      <div className="text-center">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Enviar documento - {categoryLabel}
        </h3>
        
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          accept={allowedTypes.join(',')}
          onChange={handleFileSelect}
          disabled={uploading}
        />
        
        <Button
          onClick={() => fileInputRef.current?.click()}
          variant="outline"
          disabled={uploading}
          className="mb-4"
        >
          <Upload className="w-4 h-4 mr-2" />
          Selecionar Arquivo
        </Button>
        
        {file && (
          <p className="text-sm text-gray-600">
            Arquivo selecionado: {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
          </p>
        )}
      </div>

      {file && (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Título do Documento *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pentathlon-blue focus:border-pentathlon-blue"
              placeholder="Ex: Relatório de Atividades 2024"
              disabled={uploading}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Descrição
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pentathlon-blue focus:border-pentathlon-blue"
              placeholder="Descrição detalhada do documento..."
              disabled={uploading}
            />
          </div>
          
          {uploading && (
            <div>
              <Progress value={progress} className="w-full mb-2" />
              <p className="text-sm text-gray-600 text-center">{progress}%</p>
            </div>
          )}
          
          <Button
            onClick={handleUpload}
            disabled={!title.trim() || uploading}
            className="w-full bg-gradient-to-r from-pentathlon-green to-pentathlon-green-dark hover:from-pentathlon-green-dark hover:to-pentathlon-green"
          >
            {uploading ? (
              <>
                <Upload className="w-4 h-4 mr-2" />
                Enviando...
              </>
            ) : (
              'Enviar Documento'
            )}
          </Button>
        </div>
      )}
      
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
    </div>
  );
}
