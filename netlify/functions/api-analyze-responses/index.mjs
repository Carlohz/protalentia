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
    
    // Verificar que haya respuestas para analizar
    if (!data.responses) {
      return { 
        statusCode: 400,
        headers, 
        body: JSON.stringify({ message: 'No se proporcionaron respuestas para analizar' }) 
      };
    }
    
    // Analizar respuestas de forma básica (sin OpenAI)
    const respuestas = data.responses;
    
    // Determinar perfil emprendedor vs empleado basado en la respuesta objetivo
    let porcentajeEmprendedor = 65;
    let porcentajeEmpleado = 35;
    
    if (respuestas.objetivo === 'empleo_estable') {
      porcentajeEmprendedor = 30;
      porcentajeEmpleado = 70;
    } else if (respuestas.objetivo === 'crecimiento_profesional') {
      porcentajeEmprendedor = 45;
      porcentajeEmpleado = 55;
    } else if (respuestas.objetivo === 'negocio_propio') {
      porcentajeEmprendedor = 80;
      porcentajeEmpleado = 20;
    } else if (respuestas.objetivo === 'freelance') {
      porcentajeEmprendedor = 75;
      porcentajeEmpleado = 25;
    }
    
    // Generar un resultado basado en respuestas básicas
    const resultado = {
      perfilLaboral: porcentajeEmprendedor > 50 ? "Emprendedor" : "Empleado",
      porcentajeEmprendedor: porcentajeEmprendedor,
      porcentajeEmpleado: porcentajeEmpleado,
      areasPrincipales: ["Tecnología y Programación", "Marketing y Ventas", "Diseño y Artes"],
      habilidadesClave: ["Análisis y resolución de problemas", "Creatividad", "Comunicación", "Liderazgo", "Adaptabilidad"],
      profesionRecomendada: "Desarrollador Full-Stack",
      consejoPersonalizado: "Tu perfil muestra una clara inclinación hacia el " + 
        (porcentajeEmprendedor > 50 ? "emprendimiento tecnológico. Considera desarrollar tus habilidades en programación y marketing digital para crear proyectos propios." 
        : "desarrollo profesional en empresas tecnológicas. Enfócate en fortalecer tus habilidades técnicas y de trabajo en equipo.")
    };
    
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(resultado)
    };
    
  } catch (error) {
    console.error("Error general:", error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        message: 'Error en el análisis', 
        errorCode: 'ANALISIS_ERROR'
      })
    };
  }
}