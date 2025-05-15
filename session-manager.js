// session-manager-fix.js - Versión corregida para solucionar problemas de autenticación

document.addEventListener("DOMContentLoaded", function() {
  console.log("Inicializando gestor de sesiones mejorado...");
  
  // Verificar si hay un token en localStorage
  const token = localStorage.getItem('authToken');
  
  // Elementos que dependen del estado de la sesión
  const navBar = document.querySelector('nav');
  
  if (token) {
    console.log("Token encontrado, iniciando sesión automática");
    // Usuario con sesión iniciada
    
    // 1. Actualizar la barra de navegación para mostrar el usuario logueado
    if (navBar) {
      // Intentar obtener el nombre de usuario desde el token
      let username = "Usuario";
      try {
        if (token.includes('.')) {
          // Es un JWT (tienen formato: header.payload.signature)
          const payload = token.split('.')[1];
          const decodedPayload = JSON.parse(atob(payload));
          if (decodedPayload.username) {
            username = decodedPayload.username;
          }
        } else {
          // Probablemente es un token simulado en base64
          const decodedPayload = JSON.parse(atob(token));
          if (decodedPayload.username) {
            username = decodedPayload.username;
          }
        }
      } catch (e) {
        console.error("Error al decodificar el token:", e);
      }
      
      // Verificar si ya existe una sección de usuario
      const existingUserSection = navBar.querySelector('.user-section');
      if (!existingUserSection) {
        // Añadir elementos de usuario logueado a la navegación
        const userSection = document.createElement('div');
        userSection.className = 'user-section';
        userSection.innerHTML = `
          <span class="username">Hola, ${username}</span>
          <button id="logout-btn" class="logout-btn">Cerrar sesión</button>
        `;
        
        navBar.appendChild(userSection);
        console.log("Sección de usuario añadida a la barra de navegación");
        
        // Añadir evento de logout
        document.getElementById('logout-btn').addEventListener('click', function() {
          localStorage.removeItem('authToken');
          showMessage("Has cerrado sesión correctamente", "success");
          setTimeout(() => {
            window.location.href = "index.html";
          }, 1000);
        });
      }
    }
    
    // 2. Ocultar el formulario de login si estamos en index.html
    const loginForm = document.getElementById('loginForm');
    if (loginForm && !loginForm.classList.contains('welcome-box')) {
      console.log("Reemplazando formulario de login por mensaje de bienvenida");
      
      // Si estamos en la página de inicio, mostrar mensaje de bienvenida en vez del formulario
      loginForm.innerHTML = `
        <div class="welcome-box">
          <h2>¡Bienvenido de nuevo!</h2>
          <p>Ya has iniciado sesión como <strong>${username || 'Usuario'}</strong>.</p>
          <p>Ahora puedes acceder a todas las funciones de PROTALENTIA:</p>
          <div class="action-buttons">
            <a href="diagnostico.html" class="welcome-btn">Realizar diagnóstico</a>
            <a href="cursos.html" class="welcome-btn">Ver cursos</a>
            <a href="ofertas.html" class="welcome-btn">Explorar ofertas</a>
          </div>
        </div>
      `;
      loginForm.classList.add('welcome-box');
    }
  } else {
    console.log("No se encontró token, usuario no autenticado");
    
    // Configurar el formulario de login para usar el modo alternativo
    const loginForm = document.getElementById('loginForm');
    if (loginForm && !loginForm.classList.contains('welcome-box')) {
      loginForm.addEventListener("submit", function(e) {
        e.preventDefault();
        
        const username = document.getElementById("username").value;
        const password = document.getElementById("password").value;
        
        // Validación básica
        if (!username || !password) {
          showMessage("Por favor completa todos los campos", "error");
          return;
        }
        
        console.log("Intentando login con modo alternativo...");
        
        // Verificar credenciales fijas para modo demo
        if (username === "equipo3" && password === "equipo3") {
          // Crear un token falso
          const fakeToken = btoa(JSON.stringify({id: 1, username: username}));
          
          // Guardar el token en localStorage
          localStorage.setItem('authToken', fakeToken);
          
          // Mostrar mensaje de éxito
          showMessage("¡Inicio de sesión exitoso!", "success");
          
          // Recargar la página después de un breve retraso
          setTimeout(() => {
            window.location.reload();
          }, 1000);
        } else {
          showMessage("Usuario o contraseña incorrectos", "error");
        }
      });
    }
  }
});

// Función para mostrar mensajes flotantes
function showMessage(message, type = "info") {
  // Verificar si ya existe un mensaje
  let messageContainer = document.getElementById("message-container");
  
  if (messageContainer) {
    messageContainer.remove();
  }
  
  // Crear el contenedor
  messageContainer = document.createElement("div");
  messageContainer.id = "message-container";
  messageContainer.style.position = "fixed";
  messageContainer.style.top = "20px";
  messageContainer.style.left = "50%";
  messageContainer.style.transform = "translateX(-50%)";
  messageContainer.style.zIndex = "1000";
  messageContainer.style.padding = "10px 20px";
  messageContainer.style.borderRadius = "5px";
  messageContainer.style.fontWeight = "bold";
  messageContainer.style.boxShadow = "0 2px 10px rgba(0,0,0,0.2)";
  document.body.appendChild(messageContainer);
  
  // Aplicar estilos según el tipo de mensaje
  if (type === "error") {
    messageContainer.style.backgroundColor = "#f44336";
    messageContainer.style.color = "white";
  } else if (type === "success") {
    messageContainer.style.backgroundColor = "#4CAF50";
    messageContainer.style.color = "white";
  } else {
    messageContainer.style.backgroundColor = "#2196F3";
    messageContainer.style.color = "white";
  }
  
  messageContainer.textContent = message;
  
  // Hacer visible el mensaje
  messageContainer.style.display = "block";
  
  // Auto-ocultar después de 3 segundos
  setTimeout(() => {
    messageContainer.remove();
  }, 3000);
}