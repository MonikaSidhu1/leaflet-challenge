
var queryUrl = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/significant_month.geojson';


//Perform a GET request to the query URL
d3.json(queryUrl).then(function(data) {

// Once we get a response send the data.features object to the createFeatures function
  createFeatures(data.features);
});
  // Function to define marker size based on magnitude 
    function markerSize(magnitude) {
      if (magnitude === 0) {
        return 1;
      } 
        return magnitude * 3;
    } 
  
    function styleInfo(feature) {
        return {
          opacity: 1,
          fillOpacity: 1,
          fillColor: chooseColor(feature.properties.mag),
          color: "#000000",
          radius: markerSize(feature.properties.mag),
          stroke: true,
          weight: 0.5
        };
    }
  // Function to define marker colour based on magnitude
    function chooseColor(magnitude) {
        switch (true) {
        case magnitude > 5:
            return "#e31a1c";
        case magnitude > 4:
            return "#fc4e2a";
        case magnitude > 3:
            return "#fd8d3c";
        case magnitude > 2:
            return "#fed976";
        case magnitude > 1:
            return "#ffffcc";
        default:
            return "#ffffcc";
        }
    }

// Define a function to run once for each feature in the features array
function createFeatures(earthquakeData) {

// Create a GeoJSON layer containing the features array on the earthquakeData object
  var earthquakes = L.geoJSON(earthquakeData, {
    // Assign each feature to a circleMarker
  pointToLayer: function(feature, latlng) {
    console.log(earthquakeData);
    return L.circleMarker(latlng);
  },
// Assign the style previously defined for each circleMarker 
style: styleInfo,

// Give each feature a popup describing the magnitude, location, date and time of the earthquake
// Run the onEachFeature function once for each piece of data in the array
 onEachFeature: function(feature, layer) {
  layer.bindPopup("Magnitude: " + feature.properties.mag + "<br>Location: " + feature.properties.place + "</h3><hr><p>" + "Date: "+new Date(feature.properties.time) );
}
})

// Sending our earthquakes layer to the createMap function
 createMap(earthquakes);
}

// Define map layers
function createMap(earthquakes) {

   var graymap = L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/light-v10/tiles/{z}/{x}/{y}?access_token={accessToken}', {
   attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='https://docs.mapbox.com/mapbox-gl-js/example/setstyle/'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
   tileSize: 512,
   maxZoom: 18,
   zoomOffset: -1,
   id: "mapbox/light-v10",
   accessToken: API_KEY    
 });
 var satellite_map = L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/satellite-v9/tiles/{z}/{x}/{y}?access_token={accessToken}', {
   attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='https://docs.mapbox.com/mapbox-gl-js/example/setstyle/'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
   tileSize: 512,
   maxZoom: 18,
   zoomOffset: -1,
   id: "mapbox/satellite-v9",
   accessToken: API_KEY
 });

// Define a baseMaps object to hold our base layers
var baseMaps = {
  "Graymap": graymap,
  "Satellite map": satellite_map
  };

// Create overlay object to hold our overlay layer
var overlayMaps = {
  "Earthquakes": earthquakes
};

// Create a map object, giving it the gray map and satellite map layers to display on load
var myMap = L.map("map", {
  center: [15.5994, -28.6731],
  zoom: 3,
  layers: [satellite_map, graymap]
});

L.control.layers(baseMaps, overlayMaps, {
  collapsed: false
}).addTo(myMap);


// Legend
var legend = L.control({ position: "bottomleft" });
legend.onAdd = function() {
    var div = L.DomUtil.create("div", "info legend"), 
    magnitude_levels = [0, 1, 2, 3, 4, 5];

    div.innerHTML += "<h3>Magnitude</h3>"

    for (var i = 0; i < magnitude_levels.length; i++) {
        div.innerHTML +=
            '<i style="background: ' + chooseColor(magnitude_levels[i] + 1) + '"></i> ' +
            magnitude_levels[i] + (magnitude_levels[i + 1] ? '&ndash;' + magnitude_levels[i + 1] + '<br>' : '+');
    }
    return div;
};

legend.addTo(myMap)
}