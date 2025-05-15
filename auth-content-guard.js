// auth-content-guard.js - Script para proteger contenido que requiere autenticación

document.addEventListener("DOMContentLoaded", function() {
  // Verificar si el usuario está autenticado
  const token = localStorage.getItem('authToken');
  
  // Obtener la página actual (cursos.html o ofertas.html)
  const currentPage = window.location.pathname.split('/').pop();
  const isCoursesPage = currentPage === 'cursos.html';
  const isOffersPage = currentPage === 'ofertas.html';
  
  // Contenedores principales de contenido
  const mainContentContainer = document.querySelector('.contenedor');
  const perfilInfoDiv = document.getElementById("perfil-info");
  
  // Si no hay token, mostrar mensaje para iniciar sesión
  if (!token) {
    console.log("Usuario no autenticado, ocultando contenido personalizado");
    
    // Guardar el HTML original para restaurarlo si es necesario
    if (mainContentContainer) {
      // Reemplazar todo el contenido con mensaje de login requerido
      mainContentContainer.innerHTML = `
        <div class="mensaje-info" style="margin: 50px auto; max-width: 600px; text-align: center;">
          <h2>Inicio de sesión requerido</h2>
          <p>Para acceder a ${isCoursesPage ? 'cursos recomendados' : 'ofertas laborales'} personalizados, 
          primero debes iniciar sesión.</p>
          <p>Esto nos permite ofrecerte contenido adaptado a tu perfil profesional.</p>
          <a href="index.html" style="display: inline-block; margin-top: 20px; padding: 10px 20px; 
            background-color: #2980b9; color: white; text-decoration: none; border-radius: 5px;">
            Ir al inicio de sesión
          </a>
        </div>
      `;
    }
    return;
  }
  
  // Si hay token pero no hay datos de perfil, sugerir completar el diagnóstico
  const areaLaboral = localStorage.getItem("areaLaboral");
  const profesionRecomendada = localStorage.getItem("profesionRecomendada");
  
  if (!areaLaboral || !profesionRecomendada || areaLaboral === "No definido") {
    console.log("Usuario autenticado pero sin diagnóstico completado");
    
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
    
    // Si estamos en la página de cursos, ocultar los contenedores específicos
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
    
    // Si estamos en la página de ofertas, ocultar los contenedores específicos
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
  }
  
  // Si hay token y datos de perfil, el contenido se mostrará normalmente
  // No necesitamos hacer nada más aquí, ya que el código original se encargará de mostrar los datos
});