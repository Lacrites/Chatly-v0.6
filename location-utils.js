// location-utils.js

let myLocation = null;
let remoteLocation = null;

function sendLocation(conn, myName) {
  if (!navigator.geolocation) {
    addMessage("🌍 Geolocalización no soportada por este navegador.");
    return;
  }

  navigator.geolocation.getCurrentPosition(position => {
    myLocation = {
      latitude: position.coords.latitude,
      longitude: position.coords.longitude
    };
    conn.send({ type: "location", value: myLocation });
    addMessage("📍 Ubicación enviada.");
  }, error => {
    addMessage("⚠️ Error al obtener ubicación: " + error.message);
  });
}

function checkDistance() {
  if (!myLocation || !remoteLocation) return;

  const distance = getDistanceFromLatLonInKm(
    myLocation.latitude, myLocation.longitude,
    remoteLocation.latitude, remoteLocation.longitude
  );

  addMessage(`📏 Están a aproximadamente ${distance.toFixed(2)} km de distancia.`);
}

function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
  const R = 6371; // Radio de la Tierra en km
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function deg2rad(deg) {
  return deg * (Math.PI / 180);
}
