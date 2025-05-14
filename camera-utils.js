// camera-utils.js
let cameraStream = null;
let mediaDevices = [];

function enableCamera(deviceId = null) {
  const video = document.getElementById('video');

  if (cameraStream) {
    cameraStream.getTracks().forEach(track => track.stop());
    cameraStream = null;
    video.srcObject = null;
    video.style.display = 'none';
  }

  const constraints = deviceId
    ? { video: { deviceId: { exact: deviceId } } }
    : { video: true };

  navigator.mediaDevices.getUserMedia(constraints)
    .then(stream => {
      cameraStream = stream;
      video.srcObject = stream;
      video.style.display = 'block';
    })
    .catch(err => {
      console.error("No se pudo acceder a la cámara", err);
    });
}

function disableCamera() {
  const video = document.getElementById('video');

  if (cameraStream) {
    cameraStream.getTracks().forEach(track => track.stop());
    cameraStream = null;
    video.srcObject = null;
    video.style.display = 'none';
    addMessage("📷 Cámara apagada.");
  } else {
    addMessage("📷 La cámara ya está apagada.");
  }
}

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
