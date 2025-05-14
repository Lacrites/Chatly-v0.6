// camera.js

let cameraStream = null;  // Guarda el flujo de la cámara
let mediaDevices = [];    // Guarda los dispositivos de cámara disponibles

// Función para encender la cámara
function enableCamera(deviceId = null) {
  const video = document.getElementById('video');

  // Primero, detener cualquier flujo de cámara anterior si existe
  if (cameraStream) {
    cameraStream.getTracks().forEach(track => track.stop());
    cameraStream = null;
    video.srcObject = null;
    video.style.display = 'none';  // Ocultamos el video
    console.log("Cámara anterior apagada");
  }

  // Definir restricciones de la cámara (puede ser con o sin deviceId)
  const constraints = deviceId
    ? { video: { deviceId: { exact: deviceId } } }
    : { video: true };

  // Solicitar acceso a la cámara
  navigator.mediaDevices.getUserMedia(constraints)
    .then(stream => {
      cameraStream = stream;  // Guardamos el flujo de la cámara
      video.srcObject = stream;  // Asociamos el flujo al elemento de video
      video.style.display = 'block';  // Mostramos el video
      console.log("Cámara encendida correctamente");
    })
    .catch(err => {
      console.error("Error al intentar acceder a la cámara:", err);
      alert("No se pudo acceder a la cámara. Verifica los permisos.");
    });
}

// Función para apagar la cámara
function disableCamera() {
  const video = document.getElementById('video');

  if (cameraStream) {
    cameraStream.getTracks().forEach(track => track.stop());
    cameraStream = null;
    video.srcObject = null;
    video.style.display = 'none';  // Ocultamos el video
    addMessage("📷 Cámara apagada.");
  } else {
    addMessage("📷 La cámara ya está apagada.");
  }
}

// Función para cambiar entre cámaras disponibles
function switchCamera() {
  navigator.mediaDevices.enumerateDevices()
    .then(devices => {
      mediaDevices = devices.filter(device => device.kind === 'videoinput');

      if (mediaDevices.length === 0) {
        alert("No se encontraron cámaras.");
        return;
      }

      const currentDeviceId = cameraStream ? cameraStream.getTracks()[0].getSettings().deviceId : null;

      const nextDevice = mediaDevices.find(device => device.deviceId !== currentDeviceId);
      if (!nextDevice) return;

      enableCamera(nextDevice.deviceId);
    })
    .catch(err => {
      console.error("Error al enumerar dispositivos", err);
    });
}

// Función para capturar una foto
function capturePhoto() {
  const video = document.getElementById('video');
  const canvas = document.getElementById('canvas');
  const context = canvas.getContext('2d');

  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  context.drawImage(video, 0, 0, canvas.width, canvas.height);

  canvas.toBlob(blob => {
    blob.arrayBuffer().then(buffer => {
      conn.send({ type: "img", value: buffer });
      showImage(buffer, `Yo (${myName})`);
    });
  }, 'image/jpeg');
}

// Función para mostrar la imagen enviada
function showImage(buffer, sender) {
  const img = document.createElement('img');
  const messagesDiv = document.getElementById('messages');
  const reader = new FileReader();

  reader.onloadend = () => {
    img.src = reader.result;
    messagesDiv.appendChild(document.createTextNode(`${sender}: `));
    messagesDiv.appendChild(img);
    messagesDiv.appendChild(document.createElement('br'));
  };

  reader.readAsDataURL(new Blob([buffer]));
}

// Agregar un mensaje a la interfaz de usuario
function addMessage(message) {
  const messagesDiv = document.getElementById('messages');
  const p = document.createElement('p');
  p.textContent = message;
  messagesDiv.appendChild(p);
}
