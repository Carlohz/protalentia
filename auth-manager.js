// auth-manager-offline.js - Sistema de autenticación completamente offline

document.addEventListener("DOMContentLoaded", function() {
  console.log("Inicializando sistema de autenticación offline...");
  
  // Verificar si existen usuarios en el sistema local
  if (!localStorage.getItem('localUsers')) {
    // Crear usuario predeterminado para facilitar pruebas
    const defaultUsers = [
      {
        id: 1,
        username: "equipo3",
        password: "equipo3"
      }
    ];
    localStorage.setItem('localUsers', JSON.stringify(defaultUsers));
    console.log("Sistema de usuarios inicializado con usuario de prueba");
  }
  
  // Verificar si hay un token y actualizar la interfaz si es necesario
  const token = localStorage.getItem('authToken');
  if (token) {
    showWelcomeMessage();
  }
  
  // Configurar formulario de login
  setupLoginForm();
  
  // Configurar formulario de registro si existe
  setupRegistrationForm();
  
  // Usar delegación de eventos para el botón de cerrar sesión
  document.body.addEventListener('click', function(event) {
    if (event.target && event.target.id === 'logout-btn') {
      console.log("Cerrar sesión activado");
      localStorage.removeItem('authToken');
      showMessage("Has cerrado sesión correctamente", "success");
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    }
  });
});

// Configurar formulario de login
function setupLoginForm() {
  const loginForm = document.getElementById("loginForm");
  if (!loginForm) return;
  
  // Si ya está transformado en mensaje de bienvenida, salir
  if (loginForm.classList.contains('welcome-box')) return;
  
  // Si es un <form>, usar evento submit
  if (loginForm.tagName === 'FORM') {
    loginForm.addEventListener("submit", function(e) {
      e.preventDefault();
      handleLogin();
    });
  } else {
    // Si es un <div>, buscar el botón
    const loginButton = loginForm.querySelector("button");
    if (loginButton) {
      loginButton.addEventListener("click", function() {
        handleLogin();
      });
    }
  }
}

// Manejar el inicio de sesión
function handleLogin() {
  const usernameInput = document.getElementById("username");
  const passwordInput = document.getElementById("password");
  
  if (!usernameInput || !passwordInput) {
    console.error("No se encontraron los campos de usuario o contraseña");
    return;
  }
  
  const username = usernameInput.value;
  const password = passwordInput.value;
  
  // Validación básica
  if (!username || !password) {
    showMessage("Por favor completa todos los campos", "error");
    return;
  }
  
  // Obtener botón para mostrar indicador de carga
  const loginButton = document.querySelector("#loginForm button");
  if (loginButton) {
    loginButton.textContent = "Iniciando sesión...";
    loginButton.disabled = true;
  }
  
  // Simulamos un pequeño delay para que parezca que está procesando
  setTimeout(() => {
    // Autenticar localmente
    const authenticated = authenticateLocal(username, password);
    
    if (authenticated) {
      // Crear token con el nombre de usuario explícitamente
      const userData = {
        id: authenticated.id,
        username: authenticated.username
      };
      const token = btoa(JSON.stringify(userData));
      
      console.log("Usuario autenticado:", userData.username);
      
      // Guardar el token en localStorage
      localStorage.setItem('authToken', token);
      localStorage.setItem('currentUser', userData.username);
      
      // Mostrar mensaje de éxito
      showMessage("¡Inicio de sesión exitoso!", "success");
      
      // Recargar la página después de un breve retraso
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } else {
      // Mostrar error de autenticación
      showMessage("Usuario o contraseña incorrectos", "error");
      
      if (loginButton) {
        loginButton.textContent = "Ingresar";
        loginButton.disabled = false;
      }
    }
  }, 500);
}

// Autenticar con usuarios almacenados localmente
function authenticateLocal(username, password) {
  try {
    const users = JSON.parse(localStorage.getItem('localUsers') || '[]');
    const user = users.find(u => u.username === username && u.password === password);
    
    if (user) {
      console.log("Usuario autenticado localmente:", user.username);
      return user;
    }
    
    return null;
  } catch (e) {
    console.error("Error al autenticar localmente:", e);
    return null;
  }
}

// Configurar formulario de registro
function setupRegistrationForm() {
  const registroForm = document.getElementById("registroForm");
  if (!registroForm) return;
  
  registroForm.addEventListener("submit", function(e) {
    e.preventDefault();
    
    const regUsername = document.getElementById("reg-username")?.value;
    const regPassword = document.getElementById("reg-password")?.value;
    const regConfirmPassword = document.getElementById("reg-confirm-password")?.value;
    
    // Validación básica
    if (!regUsername || !regPassword || !regConfirmPassword) {
      showMessage("Por favor completa todos los campos", "error");
      return;
    }
    
    if (regPassword !== regConfirmPassword) {
      showMessage("Las contraseñas no coinciden", "error");
      return;
    }
    
    // Obtener botón para mostrar indicador de carga
    const registerButton = registroForm.querySelector("button");
    if (registerButton) {
      registerButton.textContent = "Registrando...";
      registerButton.disabled = true;
    }
    
    // Simular procesamiento
    setTimeout(() => {
      // Registrar localmente
      const success = registerLocally(regUsername, regPassword);
      
      if (success) {
        showMessage("¡Registro exitoso! Ahora puedes iniciar sesión.", "success");
        
        // Redirigir a la página de inicio después de 2 segundos
        setTimeout(() => {
          window.location.href = "index.html";
        }, 2000);
      } else {
        if (registerButton) {
          registerButton.textContent = "Registrarme";
          registerButton.disabled = false;
        }
      }
    }, 800);
  });
}

// Registrar localmente
function registerLocally(username, password) {
  try {
    // Verificar si el usuario ya existe
    const users = JSON.parse(localStorage.getItem('localUsers') || '[]');
    
    if (users.some(u => u.username === username)) {
      showMessage("El nombre de usuario ya está en uso", "error");
      return false;
    }
    
    // Crear nuevo usuario
    const newUser = {
      id: users.length + 1,
      username: username,
      password: password
    };
    
    // Añadir a la lista de usuarios
    users.push(newUser);
    localStorage.setItem('localUsers', JSON.stringify(users));
    
    console.log("Usuario registrado localmente:", username);
    return true;
  } catch (e) {
    console.error("Error al registrar localmente:", e);
    showMessage("Error al registrar el usuario", "error");
    return false;
  }
}

// Función para mostrar el mensaje de bienvenida
function showWelcomeMessage() {
  const loginForm = document.getElementById("loginForm");
  if (!loginForm) return;
  
  // Intentar obtener el nombre de usuario
  let username = "Usuario"; // Valor predeterminado
  
  // Primero intentar obtener del respaldo directo
  const currentUser = localStorage.getItem('currentUser');
  if (currentUser) {
    username = currentUser;
  } else {
    // Intentar obtener del token
    try {
      const token = localStorage.getItem('authToken');
      if (token) {
        const userData = JSON.parse(atob(token));
        if (userData && userData.username) {
          username = String(userData.username);
          localStorage.setItem('currentUser', username);
        }
      }
    } catch (e) {
      console.error("Error al decodificar el token:", e);
    }
  }
  
  // Actualizar el formulario con mensaje de bienvenida
  loginForm.innerHTML = `
    <div class="welcome-box">
      <h2>¡Bienvenido de nuevo!</h2>
      <p>Ya has iniciado sesión como <strong>${username}</strong>.</p>
      <p>Ahora puedes acceder a todas las funciones de PROTALENTIA:</p>
      <div class="action-buttons">
        <a href="diagnostico.html" class="welcome-btn">Realizar diagnóstico</a>
        <a href="cursos.html" class="welcome-btn">Ver cursos</a>
        <a href="ofertas.html" class="welcome-btn">Explorar ofertas</a>
      </div>
      <button id="logout-btn" style="margin-top: 20px; background-color: #f44336; color: white; padding: 10px; border: none; border-radius: 5px; cursor: pointer;">Cerrar sesión</button>
    </div>
  `;
  
  loginForm.classList.add('welcome-box');
}

// Función para mostrar mensajes al usuario
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