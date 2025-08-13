import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Card, CardContent } from '@/components/ui/card';
import { Upload, X, FileText, AlertCircle, CheckCircle2 } from 'lucide-react';

interface FileUploadProps {
  onFileUploaded: (file: UploadedFile) => void;
  category: string;
  maxSizeMs?: number;
  allowedTypes?: string[];
}

interface UploadedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  category: string;
  url: string;
  uploadDate: string;
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

const MAX_SIZE = 10 * 1024 * 1024; // 10MB

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

  const validateFile = (file: File): string | null => {
    if (!allowedTypes.includes(file.type)) {
      return 'Tipo de arquivo não permitido. Use PDF, DOC, DOCX, XLS, XLSX, JPG, PNG ou WEBP.';
    }
    
    if (file.size > maxSizeMs) {
      return `Arquivo muito grande. Tamanho máximo: ${Math.round(maxSizeMs / 1024 / 1024)}MB`;
    }
    
    return null;
  };

  const simulateUpload = async (file: File): Promise<UploadedFile> => {
    return new Promise((resolve) => {
      const interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            return 100;
          }
          return prev + 10;
        });
      }, 200);

      setTimeout(() => {
        const uploadedFile: UploadedFile = {
          id: Math.random().toString(36).substr(2, 9),
          name: file.name,
          size: file.size,
          type: file.type,
          category,
          url: URL.createObjectURL(file), // Em produção, seria a URL do servidor
          uploadDate: new Date().toISOString()
        };
        resolve(uploadedFile);
      }, 2000);
    });
  };

  const handleFileUpload = async (file: File) => {
    setError('');
    setSuccess('');
    setProgress(0);
    
    const validationError = validateFile(file);
    if (validationError) {
      setError(validationError);
      return;
    }
    
    setUploading(true);
    
    try {
      const uploadedFile = await simulateUpload(file);
      onFileUploaded(uploadedFile);
      setSuccess(`Arquivo "${file.name}" enviado com sucesso!`);
      setProgress(0);
    } catch (err) {
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
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileUpload(e.target.files[0]);
    }
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

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
                {uploading ? 'Enviando arquivo...' : 'Enviar documento'}
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
