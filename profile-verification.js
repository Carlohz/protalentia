// profile-verification.js - Verificación estricta de perfil para recomendaciones

document.addEventListener("DOMContentLoaded", function() {
  console.log("Verificando perfil para recomendaciones...");
  
  // Solo ejecutar en páginas de cursos u ofertas
  const currentPage = window.location.pathname.split('/').pop();
  if (currentPage !== 'cursos.html' && currentPage !== 'ofertas.html') {
    return;
  }
  
  const isCoursesPage = currentPage === 'cursos.html';
  const isOffersPage = currentPage === 'ofertas.html';
  
  // Verificar si el usuario está autenticado
  const token = localStorage.getItem('authToken');
  if (!token) {
    console.log("Usuario no autenticado, redirigiendo...");
    window.location.href = "index.html";
    return;
  }
  
  // Verificación estricta de perfil completado
  function isProfileComplete() {
    // Verificamos todas las propiedades necesarias para considerar un perfil como completo
    const requiredProperties = [
      "areaLaboral",
      "profesionRecomendada",
      "porcentajeEmprendedor",
      "porcentajeEmpleado",
      "habilidadesClave"
    ];
    
    // Comprobamos que existan todas las propiedades y que tengan valores válidos
    for (const prop of requiredProperties) {
      const value = localStorage.getItem(prop);
      
      // Si la propiedad no existe o está vacía
      if (!value) {
        console.log(`Perfil incompleto: falta la propiedad "${prop}"`);
        return false;
      }
      
      // Si la propiedad tiene un valor no válido o predeterminado
      if (value === "No definido" || value === "undefined" || value === "null") {
        console.log(`Perfil incompleto: propiedad "${prop}" con valor no válido: "${value}"`);
        return false;
      }
    }
    
    // Verificación adicional para habilidadesClave (debe ser un array con al menos un elemento)
    try {
      const habilidades = JSON.parse(localStorage.getItem("habilidadesClave") || "[]");
      if (!Array.isArray(habilidades) || habilidades.length === 0) {
        console.log("Perfil incompleto: habilidadesClave no es un array válido o está vacío");
        return false;
      }
    } catch (e) {
      console.log("Perfil incompleto: error al analizar habilidadesClave");
      return false;
    }
    
    // Si pasó todas las verificaciones, el perfil está completo
    console.log("Perfil completo: todas las propiedades tienen valores válidos");
    return true;
  }
  
  // Si el perfil no está completo, mostrar mensaje para realizar el diagnóstico
  if (!isProfileComplete()) {
    console.log("Perfil incompleto, mostrando mensaje de diagnóstico...");
    
    // Contenedores principales de contenido
    const mainContentContainer = document.querySelector('.contenedor');
    const perfilInfoDiv = document.getElementById("perfil-info");
    
    // Mostrar mensaje en el área de perfil
    if (perfilInfoDiv) {
      perfilInfoDiv.innerHTML = `
        <div class="mensaje-info">
          <h3>Diagnóstico no completado</h3>
          <p>Para recibir ${isCoursesPage ? 'cursos' : 'ofertas laborales'} personalizados, 
          primero debes completar el <a href="diagnostico.html">diagnóstico profesional</a>.</p>
          <p>Esto nos permitirá entender tu perfil y ofrecerte recomendaciones relevantes.</p>
        </div>
      `;
    }
    
    // Si estamos en la página de cursos, ocultar/reemplazar los contenedores específicos
    if (isCoursesPage) {
      const cursosRecomendadosDiv = document.getElementById("cursos-recomendados");
      const cursosAreaDiv = document.getElementById("cursos-area-principal");
      const cursosHabilidadesDiv = document.getElementById("cursos-habilidades");
      
      if (cursosRecomendadosDiv) {
        cursosRecomendadosDiv.innerHTML = `
          <div class="empty-state" style="text-align: center; padding: 40px 20px; background-color: #f5f5f5; border-radius: 8px; margin: 20px 0;">
            <h2>Realiza tu diagnóstico profesional</h2>
            <p>Completa el diagnóstico para descubrir qué cursos se ajustan mejor a tu perfil.</p>
            <a href="diagnostico.html" style="display: inline-block; margin-top: 20px; padding: 10px 20px; 
              background-color: #2980b9; color: white; text-decoration: none; border-radius: 5px;">
              Ir al diagnóstico
            </a>
          </div>
        `;
      }
      
      // Ocultar otros contenedores de cursos
      if (cursosAreaDiv) cursosAreaDiv.style.display = 'none';
      if (cursosHabilidadesDiv) cursosHabilidadesDiv.style.display = 'none';
    }
    
    // Si estamos en la página de ofertas, ocultar/reemplazar los contenedores específicos
    if (isOffersPage) {
      const ofertasPrincipalesDiv = document.getElementById("ofertas-principales");
      const ofertasSecundariasDiv = document.getElementById("ofertas-secundarias");
      const ofertasRelacionadasDiv = document.getElementById("ofertas-relacionadas");
      
      if (ofertasPrincipalesDiv) {
        ofertasPrincipalesDiv.innerHTML = `
          <div class="empty-state" style="text-align: center; padding: 40px 20px; background-color: #f5f5f5; border-radius: 8px; margin: 20px 0;">
            <h2>Realiza tu diagnóstico profesional</h2>
            <p>Completa el diagnóstico para descubrir qué oportunidades laborales se ajustan mejor a tu perfil.</p>
            <a href="diagnostico.html" style="display: inline-block; margin-top: 20px; padding: 10px 20px; 
              background-color: #2980b9; color: white; text-decoration: none; border-radius: 5px;">
              Ir al diagnóstico
            </a>
          </div>
        `;
      }
      
      // Ocultar otros contenedores de ofertas
      if (ofertasSecundariasDiv) ofertasSecundariasDiv.style.display = 'none';
      if (ofertasRelacionadasDiv) ofertasRelacionadasDiv.style.display = 'none';
    }
    
    // Ocultar también los filtros si existen
    const filtrosDiv = document.querySelector('.filtros');
    if (filtrosDiv) {
      filtrosDiv.style.display = 'none';
    }
  } else {
    console.log("Perfil completo, mostrando recomendaciones personalizadas");
  }
});