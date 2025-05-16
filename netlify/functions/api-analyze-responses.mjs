import OpenAI from 'openai';

// Cambiado de 'export default' a 'export const handler'
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
    console.log("Recibiendo solicitud de análisis");
    const data = JSON.parse(event.body);
    
    // Verificar que haya respuestas para analizar
    if (!data.responses) {
      console.log("Error: No se proporcionaron respuestas para analizar");
      return { 
        statusCode: 400,
        headers, 
        body: JSON.stringify({ message: 'No se proporcionaron respuestas para analizar' }) 
      };
    }
    
    // Intentar usar OpenAI
    try {
      // Inicializar cliente de OpenAI con la API key
      console.log("Intentando inicializar OpenAI...");
      const openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY
      });
      
      // Log para verificar la API key (solo primeros y últimos 4 caracteres por seguridad)
      if (process.env.OPENAI_API_KEY) {
        const key = process.env.OPENAI_API_KEY;
        const maskedKey = key.substring(0, 4) + "..." + key.substring(key.length - 4);
        console.log("API Key configurada:", maskedKey);
      } else {
        console.log("ERROR: API Key no encontrada");
        throw new Error("API_KEY_MISSING");
      }
      
      console.log("Enviando solicitud a OpenAI...");
      
      const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: `Eres un sistema de análisis vocacional avanzado. Analizarás respuestas de un cuestionario 
            profesional y determinarás:
            1. El perfil profesional ideal (emprendedor vs. empleado, en porcentajes)
            2. Las tres áreas laborales principales que se adaptan al usuario
            3. Las cinco habilidades clave que el usuario parece poseer
            4. Una profesión específica recomendada
            5. Un consejo personalizado en lenguaje coloquial y motivador
            Responde en formato JSON con las siguientes claves exactas: 
            "perfilLaboral", "porcentajeEmprendedor", "porcentajeEmpleado", "areasPrincipales", 
            "habilidadesClave", "profesionRecomendada", "consejoPersonalizado".`
          },
          {
            role: "user",
            content: `Analiza las siguientes respuestas del cuestionario:
            ${JSON.stringify(data.responses, null, 2)}`
          }
        ],
        temperature: 0.7,
        response_format: { type: "json_object" }
      });

      console.log("Respuesta recibida de OpenAI");
      
      // Extraer y validar la respuesta
      const result = JSON.parse(completion.choices[0].message.content);
      console.log("Análisis completado exitosamente");
      
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify(result)
      };
    } catch (openaiError) {
      console.error("Error detallado con OpenAI:", 
        JSON.stringify({
          message: openaiError.message,
          name: openaiError.name
        })
      );
      
      // Si hay un error con OpenAI, usar respuesta de fallback
      console.log("Usando respuesta de fallback debido a error de OpenAI");
      
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({
          errorCode: 'OPENAI_ERROR',
          message: openaiError.message,
          fallbackResponse: {
            perfilLaboral: "Emprendedor",
            porcentajeEmprendedor: 65,
            porcentajeEmpleado: 35,
            areasPrincipales: ["Tecnología y Programación", "Marketing y Ventas", "Diseño y Artes"],
            habilidadesClave: ["Análisis y resolución de problemas", "Creatividad", "Comunicación", "Liderazgo", "Adaptabilidad"],
            profesionRecomendada: "Desarrollador Full-Stack",
            consejoPersonalizado: "Tu perfil muestra una clara inclinación hacia el emprendimiento tecnológico. Considera desarrollar tus habilidades en programación y marketing digital para crear proyectos propios."
          }
        })
      };
    }
    
  } catch (error) {
    console.error("Error general:", error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        message: 'Error en el análisis', 
        errorCode: 'ANALISIS_ERROR',
        details: error.message
      })
    };
  }
};