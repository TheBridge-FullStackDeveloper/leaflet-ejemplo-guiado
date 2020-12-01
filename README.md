## Instrucciones para usar Leaflet 🦄

Entre todas las herramientas y librerias que tenemos en el frontend para pintar mapas, **Leaflet** es una librería Open Source que permite integrar gestores de mapas en sus funciones de pintado, convirtiéndola en una librería ideal para aprender a trabajar con mapas y conseguir excelentes resultados en nuestros proyectos.

**Pasos para integrar Leaflet**

1. Añadir link al CSS de Leaflet en `<head></head>` y script al final del `<body></body>`:

```
<!-- Link Leaflet CSS -->
<link
  rel="stylesheet"
  href="https://unpkg.com/leaflet@1.7.1/dist/leaflet.css"
  integrity="sha512-xodZBNTC5n17Xt2atTPuE1HxjVMSvLVW9ocqUKLsCC5CXdbqCmblAshOMAS6/keqq/sMZMZ19scR4PsZChSR7A=="
  crossorigin=""
/>

<!-- Script Leaflet JS -->
<script
  src="https://unpkg.com/leaflet@1.7.1/dist/leaflet.js"
  integrity="sha512-XQoYMqMTK8LvdxXYG3nZ448hOEQiglfqkJs1NOQV44cWnUrBc8PkAOcXy20w0vlaXaVUearIOBhiXZ5V3ynxwA=="
  crossorigin=""
></script>
```

2. Crea un `div` que contenga un `id` única en el que inyectaremos el mapa:

```
<div id="map"></div>
```

3. Dale estilos al `div` para que podamos verlo sin problemas en el navegador:

```
#map {
  height: 400px;
  width: 350px;
  border: 1px solid black;
}
```

4. Inyecta el mapa usando **Leaflet** a través del script que habíamos importado. Para ello crea un archivo `index.js` (o con el nombre que prefieras) y utiliza este código:

```
const mapId = 'map';
const initialCoordinates = [40.4169473, -3.7057172]; // Plaza Sol en Madrid [lat, lng]

const map = L.map(mapId).setView(initialCoordinates, 13);
```

- Ahora verás que el mapa creado es gris y no somos capaces de ver su contenido. Esto se debe a que necesitamos usar una librería de `tiles`, es decir, las piezas que conforman el mapa tal y como lo conocemos.

5. Como librería de `tiles` a añadir, utilizaremos **Mapbox**.

- Crearemos para esto un string al que interpolaremos variables a través de una función de **Leaflet**:

```
const MAPBOX_API = 'https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}'
```

- Ahora iremos a la web de **Mapbox** y nos registraremos para obtener una API key y añadiremos las siguientes variables:

```
const ATTRIBUTION =
  'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>';

// Este token será el que obtengamos en la web de Mapbox
const ACCESS_TOKEN =
  'pk.eyJ1IjoiY2Nhc3RpbGxvMDZtYiIsImEiOiJja2k1eXpybXU3em1mMnRsNjNqajJ0YW12In0.aFQJlFDBDQeUpLHT4EiRYg';
```

- Por último, lanzaremos la siguiente función de **Leaflet** para cargar todos los tiles de **Mapbox** en nuestro mapa:

```
L.tileLayer(MAPBOX_API, {
  attribution: ATTRIBUTION,
  maxZoom: 18,
  id: 'mapbox/streets-v11',
  tileSize: 512,
  zoomOffset: -1,
  accessToken: ACCESS_TOKEN
}).addTo(map);
```

6. Ahora que vemos el mapa correctamente, vamos a añadir un marcador (a lo Google!) para que los usuarios de nuestra web puedan apreciar donde se encuentra el punto que hemos centrado. Para ello, usaremos las coordenadas iniciales (aunque ahora puedes poner tantas como quieras en distintos sitios) e invocaremos a una nueva función de \*+Leaflet\*\*:

```
// Añadimos el marcador a nuestra posición inicial
L.marker(initialCoordinates).addTo(map);

 // Ejemplo añadiendo otras coordenadas:
const plazaMayorCoordinates = [40.4168898,-3.7020553]
L.marker(plazaMayorCoordinates).addTo(map);
```

7. Para terminar con nuestro mapa, añadiremos un popup sobre los marcadores que tenemos para resaltar información sobre ellos. Modifica el código del paso anterior y añade `.bindPopup(...)` a cada marker de la siguiente forma:

```
// Añadimos el marcador a nuestra posición inicial
L.marker(initialCoordinates).bindPopup("<b>Plaza Sol</b><br>Posición inicial del mapa").addTo(map);

// Ejemplo añadiendo otras coordenadas:
const plazaMayorCoordinates = [40.415511, -3.7095896];
L.marker(plazaMayorCoordinates).bindPopup("<b>Plaza Mayor</b><br>Posición adicional").addTo(map);
```

### ¡Ahora podrás ver un mapa con sus marcadores! 🎉

## Instrucciones para usar Mapbox Places API 🚀

Hasta el momento hemos pintado el mapa usando coordenadas que ya conocíamos previamente pero, ¿y si quisiéramos imitar a Google Maps y buscar un lugar para representarlo como un marcador en el mapa?

Para hacer esto realidad podemos utilizar **Mapbox Places**, seguiremos los siguientes pasos y aprenderemos a darle funcionalidad dinámica a nuestros mapas.

1. Crea dos constantes nuevas que representen las que vamos a usar en **Mapbox Places**:

```
const MAPBOX_PLACES_API = 'https://api.mapbox.com/geocoding/v5/mapbox.places/';
const REST_PLACES_URL = `.json?types=place&access_token=${ACCESS_TOKEN}`;
```

2. Prepara los headers para que el `fetch` que vamos a realizar posteriormente sea de tipo `GET`:

```
const FETCH_HEADERS = {
  method: 'GET',
  headers: {
    'Content-Type': 'application/json'
  }
}
```

3. Haz una request usando `fetch` para obtener la posición de un lugar que quieras, en este ejemplo usaremos `Cádiz` para comprobar que nos llegan las coordenadas correctamente.

```
const searchLocation = 'cadiz';

fetch(`${MAPBOX_PLACES_API}${searchLocation}${REST_PLACES_URL}`, FETCH_HEADERS)
  .then(res => res.json())
  .then((apiData) => {
    console.log(apiData)
  })
```

4. Dado el formato de la respuesta obtenida en el `console.log` anterior, podemos observar que la respuesta que buscamos está en `apiData.features[0]`, donde tenemos los campos que buscamos en:

```
  {
    center: [-6.28333, 36.51667], // Están al contrario! Hay que darle la vuelta para que sea [lat, lng]
    place_name: "Cádiz, Cádiz, Spain"
  }
```

- Vamos a sacar por tanto los valores que queremos creando una función para ello:

```
// Con esta función devolvemos un objeto con los campos `coordinates` y `name` dado el lugar encontrado.

function getCoordinates(placesContent) {
  const { center, place_name } = placesContent?.features[0];
  return {
    coordinates: center.reverse(),
    name: place_name
  }
}
```

- Ahora que tenemos la función creada, podemos añadir un nuevo marker a nuestro mapa en ese lugar e incluso cambiar su centro usando las funciones de **Leaflet** que aprendimos previamente:

```
function getCoordinates(placesContent) {
  const { center, place_name } = placesContent?.features[0];
  return {
    coordinates: center.reverse(),
    name: place_name,
  };
}

const searchLocation = 'cadiz';

fetch(`${MAPBOX_PLACES_API}${searchLocation}${REST_PLACES_URL}`, FETCH_HEADERS)
  .then((res) => res.json())
  .then((apiData) => {
    // Obtenemos las coordenadas y el nombre usando apiData
    const { coordinates, name } = getCoordinates(apiData);

    // Centramos el mapa en el nuevo lugar
    map.panTo(coordinates);
    // Añadimos un marker con el nombre del sitio
    L.marker(coordinates).bindPopup(`<b>${name}</b>`).addTo(map);
  });
```

5. Como puede observar, ¡ahora nos vamos a Cádiz nada más recargar! Vamos a arreglarlo añadiendo un botón que nos lleve únicamente cuando lo pulsemos:

- Añade al HTML un botón que invoque a esta función:

```
<button onclick="changeMapCenter('cadiz')">Ir a Cádiz</button>
```

- Y ahora mete todo contenido del `fetch` en la función (eliminando la constante `searchLocation` que creamos previamente):

```
// Esta función centrará el mapa cuando pulsemos el botón
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
      map.panTo(coordinates);
      // Añadimos un marker con el nombre del sitio
      L.marker(coordinates).bindPopup(`<b>${name}</b>`).addTo(map);
    });
}
```

**Bonus**

Si quieres que el mapa cambie de posición mediante una animación, usa:

```
map.flyTo(coordinates)
```

En lugar de:

```
map.panTo(coordinates);
```

### ¡Ahora puedes buscar lugares y reposicionar el mapa! 🎉

---

## Reto propuesto

Para terminar, te proponemos como reto que en lugar de utilizar un botón para reposicionar el mapa, crees un `<input type="text" >` en el que puedas introducir una localización y buscarla posteriormente al hacer `submit` del `form` que lo contenga 🔥

¡Entonces tendrás un mapa tal y como hace Google!

- Recuerda usar tu propia clave de Mapbox, la que utiliza este ejercicio es una API de testeo que soporta pocas requests y puede bloquearse en cualquier momento si se utiliza de forma muy continuada 😜
