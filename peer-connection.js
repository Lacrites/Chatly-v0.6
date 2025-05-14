// peer-connection.js
let peer;
let conn;
let myName = "";
let remoteName = "Desconocido";

function start() {
  const myId = document.getElementById('myId').value;
  myName = document.getElementById('myName').value;

  if (!myId || !myName) {
    alert("Escribí un ID y un nombre para mostrar");
    return;
  }

  peer = new Peer(myId);

  peer.on('open', id => {
    document.getElementById('peer-id').textContent = id;
    document.getElementById('start-section').style.display = 'none';
    document.getElementById('chat-section').style.display = 'block';
  });

  peer.on('connection', connection => {
    conn = connection;
    addMessage(`✅ Sistema: Usuario conectado.`);
    setupConnection();
  });

  document.getElementById('message').addEventListener('keydown', e => {
    if (e.key === 'Enter') sendMessage();
  });
}

function connect() {
  const otherId = document.getElementById('connectId').value;
  if (!peer) {
    alert("Primero iniciá tu Peer con un ID.");
    return;
  }

  addMessage(`⌛ Sistema: Esperando conexión con ${otherId}...`);
  conn = peer.connect(otherId);
  conn.on('open', () => {
    conn.send({ type: "name", value: myName });
  });
  setupConnection();
}

function setupConnection() {
  conn.on('data', data => {
    if (data.type === "name") {
      remoteName = data.value;
      addMessage(`✅ Sistema: Conectado con ${remoteName}`);
    } else if (data.type === "msg") {
      addMessage(`${remoteName}: ${data.value}`);
    } else if (data.type === "buzz") {
      triggerBuzz();
    } else if (data.type === "img") {
      showImage(data.value, remoteName);
    } else if (data.type === "end") {
      addMessage(data.value);
    } else if (data.type === "location") {
      remoteLocation = data.value;
      addMessage(`📍 ${remoteName} envió su ubicación.`);
      checkDistance();
    } else if (data.type === "status") {
      const statusText = data.value === "online" ? "🟢 En línea" : "🔴 Desconectado";
      const statusIndicator = document.getElementById("status-indicator");
      statusIndicator.textContent = statusText;
      statusIndicator.style.color = data.value === "online" ? "green" : "red";
    }
  });

  conn.on('open', () => {
    conn.send({ type: "status", value: "online" });
    conn.send({ type: "name", value: myName });
  });
}

function sendMessage() {
  const msgInput = document.getElementById('message');
  const msg = msgInput.value;
  if (conn && msg.trim() !== '') {
    conn.send({ type: "msg", value: msg });
    addMessage(`Yo (${myName}): ${msg}`);
    msgInput.value = '';
  }
}

function sendBuzz() {
  if (conn) {
    conn.send({ type: "buzz" });
    triggerBuzz();
  }
}

function disconnect() {
  if (conn && conn.open) {
    conn.send({ type: "end", value: "⚠️ Sistema: El chat ha sido finalizado por el otro usuario." });
    conn.send({ type: "status", value: "offline" });
    conn.close();
    conn = null;
    addMessage(`⚠️ Sistema: Desconectado.`);
  }

  if (cameraStream) {
    cameraStream.getTracks().forEach(track => track.stop());
    cameraStream = null;
    document.getElementById('video').srcObject = null;
    document.getElementById('video').style.display = 'none';
  }

  if (peer) {
    peer.destroy();
    peer = null;
  }

  myLocation = null;
  remoteLocation = null;
  remoteName = "Desconocido";

  document.getElementById('chat-section').style.display = 'none';
  document.getElementById('start-section').style.display = 'block';

  addMessage(`⌛ Sistema: Esperando conexión...`);
}
