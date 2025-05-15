// archivo.js mejorado - Preparado para Netlify (100% offline)

document.addEventListener("DOMContentLoaded", () => {
  // Comprobar si estamos en producción (Netlify)
  const isProduction = window.location.hostname !== 'localhost' && 
                       !window.location.hostname.includes('127.0.0.1');
  
  if (isProduction) {
    console.log("Ejecutando en entorno de producción (Netlify) - Modo offline forzado");
  }
  
  // Login - Delegado a auth-manager.js para modo consistente
  
  // Registro
  const registroForm = document.getElementById("registroForm");
  if (registroForm) {
    registroForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      
      const username = document.getElementById("reg-username").value;
      const password = document.getElementById("reg-password").value;
      const confirmPassword = document.getElementById("reg-confirm-password").value;
      
      // Validación básica
      if (!username || !password || !confirmPassword) {
        showMessage("Por favor completa todos los campos", "error");
        return;
      }
      
      if (password !== confirmPassword) {
        showMessage("Las contraseñas no coinciden", "error");
        return;
      }
      
      // Registrar en modo offline siempre
      registerOffline(username, password, registroForm);
    });
  }
});

// Función para registro offline
function registerOffline(username, password, registroForm) {
  try {
    // Mostrar indicador de carga
    const registerButton = registroForm.querySelector("button");
    registerButton.textContent = "Registrando...";
    registerButton.disabled = true;
    
    setTimeout(() => {
      // Verificar si el usuario ya existe
      const users = JSON.parse(localStorage.getItem('localUsers') || '[]');
      
      if (users.some(u => u.username === username)) {
        showMessage("El nombre de usuario ya está en uso", "error");
        registerButton.textContent = "Registrarme";
        registerButton.disabled = false;
        return;
      }
      
      // Añadir el nuevo usuario
      users.push({
        id: users.length + 1,
        username: username,
        password: password
      });
      
      localStorage.setItem('localUsers', JSON.stringify(users));
      
      showMessage("¡Registro exitoso! Ahora puedes iniciar sesión.", "success");
      
      // Redirigir a la página de inicio después de 2 segundos
      setTimeout(() => {
        window.location.href = "index.html";
      }, 2000);
    }, 800);
  } catch (error) {
    console.error("Error en el registro:", error);
    showMessage("Error en el proceso de registro", "error");
    registroForm.querySelector("button").textContent = "Registrarme";
    registroForm.querySelector("button").disabled = false;
  }
}

// Función para mostrar mensajes de éxito/error
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