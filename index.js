// Función helper para los popups con botones
const logName = (name) => {
  console.log('El nombre es:', name);
};

const mapId = 'map';
const initialCoordinates = [40.4169473, -3.7057172]; // Plaza Sol en Madrid [lat, lng]
const map = L.map(mapId).setView(initialCoordinates, 13);

// Paso 5 en README.md => Añadir constantes con variables de acceso y cargar Mapbox en nuestro mapa de Leaflet
const MAPBOX_API =
  'https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}';
const ATTRIBUTION =
  'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>';
const ACCESS_TOKEN =
  'pk.eyJ1IjoiY2Nhc3RpbGxvMDZtYiIsImEiOiJja2k1eXpybXU3em1mMnRsNjNqajJ0YW12In0.aFQJlFDBDQeUpLHT4EiRYg';

L.tileLayer(MAPBOX_API, {
  attribution: ATTRIBUTION,
  maxZoom: 18,
  id: 'mapbox/streets-v11',
  tileSize: 512,
  zoomOffset: -1,
  accessToken: ACCESS_TOKEN,
}).addTo(map);

// Pasos 6 y 7 en README.md => Añadimos markers a las posiciones que queramos
L.marker(initialCoordinates)
  .bindPopup('<b>Plaza Sol</b><br>Posición inicial del mapa')
  .addTo(map);

const plazaMayorCoordinates = [40.415511, -3.7095896];
const name = 'Plaza Mayor';
L.marker(plazaMayorCoordinates)
  .bindPopup(`<b>${name}</b><br>Posición adicional`)
  .addTo(map)
  .on('click', () => logName(name));

// Sección 2. Añadimos Mapbox Places
const MAPBOX_PLACES_API = 'https://api.mapbox.com/geocoding/v5/mapbox.places/';
const REST_PLACES_URL = `.json?types=place&access_token=${ACCESS_TOKEN}`;

const FETCH_HEADERS = {
  method: 'GET',
  headers: {
    'Content-Type': 'application/json',
  },
};

// Sección 2 - Pasos 3, 4 y 5. Buscamos una ciudad usando Mapbox Places.
function getCoordinates(placesContent) {
  const { center, place_name } = placesContent?.features[0];
  return {
    coordinates: center.reverse(),
    name: place_name,
  };
}

function changeMapCenter(searchLocation) {
  fetch(
    `${MAPBOX_PLACES_API}${searchLocation}${REST_PLACES_URL}`,
    FETCH_HEADERS
  )
    .then((res) => res.json())
    .then((apiData) => {
      // Obtenemos las coordenadas y el nombre usando apiData
      const { coordinates, name } = getCoordinates(apiData);

      // Centramos el mapa en el nuevo lugar
      map.flyTo(coordinates);
      // Añadimos un marker con el nombre del sitio
      L.marker(coordinates).bindPopup(`<b>${name}</b>`).addTo(map);
    });
}
