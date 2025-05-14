// utils.js

function addMessage(msg) {
  const msgBox = document.getElementById('messages');
  const div = document.createElement('div');
  div.textContent = msg;
  msgBox.appendChild(div);
  msgBox.scrollTop = msgBox.scrollHeight;
}

function triggerBuzz() {
  const chatSection = document.getElementById('chat-section');
  chatSection.classList.add('shake');
  if (navigator.vibrate) navigator.vibrate([100, 50, 100]);
  setTimeout(() => chatSection.classList.remove('shake'), 300);
}

function showImage(buffer, sender) {
  const blob = new Blob([buffer]);
  const url = URL.createObjectURL(blob);
  const img = document.createElement('img');
  img.src = url;
  img.style.maxWidth = "100%";
  img.style.maxHeight = "200px";

  const container = document.createElement('div');
  container.innerHTML = `<strong>${sender}:</strong><br>`;
  container.appendChild(img);

  const msgBox = document.getElementById('messages');
  msgBox.appendChild(container);
  msgBox.scrollTop = msgBox.scrollHeight;
}
