var baseMap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/light-v10",
    accessToken: API_KEY
});

var earthquakeUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson";

var earthquakes = L.layerGroup();

var myMap = L.map("map", {
    center: [39.83, -98.58],
    zoom: 4,
    layers: [baseMap,earthquakes]
});

d3.json(earthquakeUrl), function(data) {
    function magRadius(magnitude) {
        if (magnitude === 0) {
            return 1;
        }

        return magnitude * 4;
    }
    
    function magColor(magnitude) {
        switch(true) {
            case magnitude > 90: return "red";
            case magnitude > 70: return "orangered";
            case magnitude > 50: return "orange";
            case magnitude > 30: return "gold";
            case magnitude > 10: return "greenyellow";
            default: return "lightgreen";
        }
    }

L.geoJSON(data, {
    pointToLayer: function(feature,latlng) {
        return L.circleMarker(latlng,
            {
                color: "black",
                fillColor: magColor(feature.geometry.coordinates[2]),
                opacity: 1,
                fillOpacity: 1,
                radius: magRadius(feature.properties.mag),
                stroke:true,
                weight: 1
            }
        );
    },
    onEachFeature: function(feature,layer) {
        layer.bindPopup("<h3>Location: " + feature.properties.place + "</h3><hr><p>Magnitude: " + feature.properties.mag + "</p>");
    }
}).addTo(earthquakes);
earthquakes.addTo(myMap);

var legend = L.control({position: "bottomright"});

legend.onAdd = function() {
    var div = L.DomUtil.create("div", "info legend");
    var grades = [0, 1, 2, 3, 4, 5];
      var colors = [
        "red",
        "orangered",
        "orange",
        "gold",
        "greenyellow",
        "lightgreen"
      ];
  
      // Looping through
      for (var i = 0; i < grades.length; i++) {
        div.innerHTML +=
          "<i style='background: " + colors[i] + "'></i> " +
          grades[i] + (grades[i + 1] ? "&ndash;" + grades[i + 1] + "<br>" : "+");
      }
      return div;
    };
  
    // Finally, we our legend to the map.
    legend.addTo(myMap);
};
