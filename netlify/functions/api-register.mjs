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
  
  // Solo permitir POST
  if (event.httpMethod !== "POST") {
    return { 
      statusCode: 405, 
      headers,
      body: JSON.stringify({ message: "Método no permitido" }) 
    };
  }
  
  try {
    const data = JSON.parse(event.body);
    const { username, password } = data;
    
    // Validación básica
    if (!username || !password) {
      return { 
        statusCode: 400, 
        headers,
        body: JSON.stringify({ message: 'Se requieren todos los campos' }) 
      };
    }
    
    // En una app real esto se guardaría en una base de datos
    // Aquí simplemente simulamos éxito
    return {
      statusCode: 201,
      headers,
      body: JSON.stringify({ message: 'Usuario registrado exitosamente' })
    };
    
  } catch (error) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ message: 'Error interno del servidor' })
    };
  }
}