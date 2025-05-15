exports.handler = async function(event, context) {
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
    
    // Validación simple - aceptamos equipo3/equipo3
    if (username === "equipo3" && password === "equipo3") {
      // Crear un token simple
      const token = Buffer.from(JSON.stringify({id: 1, username: username})).toString('base64');
      
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ token, message: 'Inicio de sesión exitoso' })
      };
    } else {
      return { 
        statusCode: 401, 
        headers,
        body: JSON.stringify({ message: 'Credenciales inválidas' }) 
      };
    }
  } catch (error) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ message: 'Error interno del servidor' })
    };
  }
};