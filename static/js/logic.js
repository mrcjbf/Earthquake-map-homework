function createMap(earthquakes) {
  
  // Create tile layer
  var satmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/satellite-v9/tiles/256/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"http://openstreetmap.org\">OpenStreetMap</a> contributors, <a href=\"http://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"http://mapbox.com\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.light",
    accessToken: API_KEY
  });

  // create light map
  var lightmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/light-v9/tiles/256/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"http://openstreetmap.org\">OpenStreetMap</a> contributors, <a href=\"http://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"http://mapbox.com\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.light",
    accessToken: API_KEY
  });

  // Create a baseMaps
  var baseMaps = {
    "Light Map": lightmap,
    "Satellite Map": satmap
  };

  // Create an overlayMaps object
  var overlayMaps = {
    "Earthquakes": earthquakes
  };

  // Create the map object with options
  var map = L.map("map-id", {
    center: [36.74, -110],
    zoom: 4,
    layers: [lightmap,satmap,earthquakes]
  });

  // Create layer control, add to map
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(map);

  legend.addTo(map);
}

function magColor(mag) {
  return mag > 5 ? '#581845' :
          mag > 4  ? '#900C3F' :
          mag > 3  ? '#C70039' :
          mag > 2  ? '#FF5733' :
          mag > 1  ? '#FFC300' :
          mag > 0  ? '#DAF7A6' :
                     '#BBFFAD';
};

var legend = L.control({position: 'bottomright'});

legend.onAdd = function (map) {

    var div = L.DomUtil.create('div', 'info legend'),
        grades = [0, 1, 2, 3, 4, 5],
        labels = [];

    for (var i = 0; i < grades.length; i++) {
        div.innerHTML +=
            ' <i style="background:' + magColor(grades[i] + 1) + '"></i> ' +
            grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '  <br>' : '+  ');
    }

    return div;
};

function createMarkers(response) {

  var quakes = response.features;
  var quakeMarkers = [];

  for (var index = 0; index < quakes.length; index++) {
    var quake = quakes[index];
    
    var quakeMarker = L.circleMarker([quake.geometry.coordinates[1], quake.geometry.coordinates[0]],
      {radius: quake.properties.mag * 3,
      color: magColor(quake.properties.mag),
      weight: 1,
      fillOpacity: .8
      })
      .bindPopup("<b>Location:</b> " + quake.properties.place + 
      "<br><b>Magnitude:</b> " + quake.properties.mag);

    quakeMarkers.push(quakeMarker);
  }

  createMap(L.layerGroup(quakeMarkers));
}

d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson", createMarkers);
