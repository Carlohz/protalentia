export default async function handler(event, context) {
  // Define los headers CORS
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Content-Type": "application/json"
  };
  
  // Maneja las solicitudes OPTIONS (preflight)
  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 200,
      headers,
      body: ""
    };
  }
  
  return {
    statusCode: 200,
    headers,
    body: JSON.stringify({ 
      status: 'ok', 
      message: 'Servidor funcionando correctamente' 
    })
  };
}