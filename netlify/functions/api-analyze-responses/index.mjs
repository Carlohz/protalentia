export default async function handler(event, context) {
  // Definir headers CORS
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Content-Type": "application/json"
  };
  
  // Manejar solicitudes OPTIONS (preflight)
  if (event.httpMethod === "OPTIONS") {
    return new Response("", { 
      status: 200,
      headers
    });
  }

  // Solo permitir POST
  if (event.httpMethod !== "POST") {
    return new Response(
      JSON.stringify({ message: "Método no permitido" }), 
      { 
        status: 405, 
        headers 
      }
    );
  }
  
  try {
    const data = JSON.parse(event.body);
    
    // Verificar que haya respuestas para analizar
    if (!data.responses) {
      return new Response(
        JSON.stringify({ message: 'No se proporcionaron respuestas para analizar' }), 
        { 
          status: 400, 
          headers 
        }
      );
    }
    
    // Usar fetch para API de OpenAI - SECCIÓN ACTUALIZADA CON DEBUGGING
    try {
      console.log("====== INICIO DEBUGGING OPENAI ======");
      console.log("1. Verificando API Key...");
      
      // Verificar si la API key existe
      const apiKey = process.env.OPENAI_API_KEY;
      if (!apiKey) {
        console.log("ERROR: API Key de OpenAI no encontrada en variables de entorno");
        throw new Error("API_KEY_NOT_FOUND");
      }
      
      console.log("2. API Key encontrada, primeros 5 caracteres:", apiKey.substring(0, 5) + "...");
      console.log("3. Preparando solicitud a OpenAI...");
      
      // Log de lo que estamos enviando
      const requestBody = {
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
      };
      
      console.log("4. Enviando solicitud a OpenAI API...");
      
      const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
      });
      
      console.log("5. Respuesta recibida, status:", openaiResponse.status);
      
      if (!openaiResponse.ok) {
        const errorText = await openaiResponse.text();
        console.log("ERROR: Respuesta no exitosa de OpenAI:", openaiResponse.status);
        console.log("Detalles del error:", errorText);
        throw new Error(`OpenAI API error: ${openaiResponse.status} - ${errorText}`);
      }
      
      console.log("6. Procesando respuesta...");
      const result = await openaiResponse.json();
      
      if (!result.choices || !result.choices[0] || !result.choices[0].message || !result.choices[0].message.content) {
        console.log("ERROR: Formato de respuesta inesperado:", JSON.stringify(result));
        throw new Error("UNEXPECTED_RESPONSE_FORMAT");
      }
      
      console.log("7. Parseando contenido JSON...");
      const content = JSON.parse(result.choices[0].message.content);
      console.log("8. Análisis completado con éxito");
      console.log("====== FIN DEBUGGING OPENAI ======");
      
      return new Response(JSON.stringify(content), {
        status: 200,
        headers
      });
    } catch (openaiError) {
      console.error("====== ERROR OPENAI ======");
      console.error("Tipo de error:", openaiError.name);
      console.error("Mensaje de error:", openaiError.message);
      console.error("Stack trace:", openaiError.stack);
      
      if (openaiError.message === "API_KEY_NOT_FOUND") {
        console.error("⚠️ ALERTA: La API_KEY no está configurada en las variables de entorno de Netlify");
      }
      
      console.error("Utilizando respuesta de fallback debido a error");
      console.error("====== FIN ERROR OPENAI ======");
      
      // Respuesta fallback
      return new Response(JSON.stringify({
        perfilLaboral: "Emprendedor",
        porcentajeEmprendedor: 65,
        porcentajeEmpleado: 35,
        areasPrincipales: ["Tecnología y Programación", "Marketing y Ventas", "Diseño y Artes"],
        habilidadesClave: ["Análisis y resolución de problemas", "Creatividad", "Comunicación", "Liderazgo", "Adaptabilidad"],
        profesionRecomendada: "Desarrollador Full-Stack",
        consejoPersonalizado: "Tu perfil muestra una clara inclinación hacia el emprendimiento tecnológico. Considera desarrollar tus habilidades en programación y marketing digital para crear proyectos propios."
      }), {
        status: 200,
        headers
      });
    }
    
  } catch (error) {
    console.error("Error general:", error);
    return new Response(JSON.stringify({ 
      message: 'Error en el análisis', 
      errorCode: 'ANALISIS_ERROR'
    }), {
      status: 500,
      headers
    });
  }
}