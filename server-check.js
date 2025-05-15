// server-check.js - Verificador de estado del servidor

document.addEventListener("DOMContentLoaded", async () => {
  const serverStatusElement = document.createElement('div');
  serverStatusElement.id = 'server-status';
  serverStatusElement.style.position = 'fixed';
  serverStatusElement.style.bottom = '10px';
  serverStatusElement.style.right = '10px';
  serverStatusElement.style.padding = '8px 12px';
  serverStatusElement.style.borderRadius = '4px';
  serverStatusElement.style.fontSize = '12px';
  serverStatusElement.style.fontWeight = 'bold';
  serverStatusElement.style.zIndex = '9999';
  document.body.appendChild(serverStatusElement);

  // Comprobar si estamos en producción (Netlify)
  const isProduction = window.location.hostname !== 'localhost' && 
                      !window.location.hostname.includes('127.0.0.1');

  if (isProduction) {
    serverStatusElement.textContent = '✅ Modo Netlify Activo';
    serverStatusElement.style.backgroundColor = '#4caf50';
    serverStatusElement.style.color = 'white';
    return;
  }

  // Verificar solo en desarrollo
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000);

    const response = await fetch('http://localhost:3000/api/health', {
      signal: controller.signal
    }).catch(() => null);

    clearTimeout(timeoutId);

    if (response && response.ok) {
      serverStatusElement.textContent = '✅ Servidor: Conectado';
      serverStatusElement.style.backgroundColor = '#4caf50';
      serverStatusElement.style.color = 'white';
    } else {
      serverStatusElement.textContent = '✅ Modo Offline Activo';
      serverStatusElement.style.backgroundColor = '#FF9800';
      serverStatusElement.style.color = 'white';
    }
  } catch (error) {
    serverStatusElement.textContent = '✅ Modo Offline Activo';
    serverStatusElement.style.backgroundColor = '#FF9800';
    serverStatusElement.style.color = 'white';
  }
});