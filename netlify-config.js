// netlify-config.js
(function() {
  // Detectar si estamos en producción (Netlify)
  const isProduction = window.location.hostname !== 'localhost' && 
                      !window.location.hostname.includes('127.0.0.1');

  if (isProduction) {
    console.log("Entorno detectado: PRODUCCIÓN (Netlify)");
    
    // Configuración específica para Netlify
    window.appConfig = {
      apiUrl: '/.netlify/functions',  // Asegúrate de que sea esta ruta
     offlineMode: false,  // Considera si quieres habilitar el modo online en producción
     debugMode: false
  };
    
    // Sobrescribir fetch para todas las llamadas a API
    const originalFetch = window.fetch;
    window.fetch = function(url, options) {
      // Si intenta acceder a localhost, rechazar inmediatamente
      if (url.includes('localhost') || url.includes('127.0.0.1')) {
        console.log("API inaccesible en producción, usando modo offline");
        return Promise.reject(new Error("OFFLINE_MODE"));
      }
      
      // Para cualquier otra URL, usar fetch normal
      return originalFetch(url, options);
    };
  } else {
    console.log("Entorno detectado: DESARROLLO (Local)");
    
    // Configuración para desarrollo
    window.appConfig = {
      apiUrl: 'http://localhost:3000',
      offlineMode: true, // También usar offline en desarrollo para evitar errores
      debugMode: true 
    };
  }
})();