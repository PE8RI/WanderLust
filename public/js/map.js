mapboxgl.accessToken = mapToken;

// Convert string → array
const coords = JSON.parse(coordinates);

const map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/mapbox/streets-v12',
  center: coords,
  zoom: 9
});

new mapboxgl.Marker({color:"red"})
  .setLngLat(coords)
  .addTo(map);
