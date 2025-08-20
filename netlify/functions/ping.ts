import type { Handler } from '@netlify/functions'

export const handler: Handler = async (event, context) => {
  const ping = process.env.PING_MESSAGE ?? "ping";
  
  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE'
    },
    body: JSON.stringify({ message: ping })
  }
}
