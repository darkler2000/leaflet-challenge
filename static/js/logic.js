// Initialize the map
var myMap = L.map("map", {
  center: [37.0902, -95.7129], // Set the initial map center
  zoom: 2, // Set the initial zoom level
});

// Add a tile layer (e.g., OpenStreetMap)
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(myMap);

// Load and parse the earthquake data
d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson").then(function (data) {
  // Iterate through the earthquake data
  data.features.forEach(function (earthquake) {
    // Extract earthquake properties
    var magnitude = earthquake.properties.mag;
    var depth = earthquake.geometry.coordinates[2];
    var place = earthquake.properties.place;
    var time = new Date(earthquake.properties.time);

    // Define marker options based on magnitude and depth
    var markerOptions = {
      radius: magnitude * 5, // Adjust the size based on magnitude
      fillColor: getColor(depth), // Customize color based on depth
      color: "#000",
      weight: 1,
      opacity: 1,
      fillOpacity: 0.7,
    };

    // Create a marker with popup
    var marker = L.circleMarker([earthquake.geometry.coordinates[1], earthquake.geometry.coordinates[0]], markerOptions)
      .bindPopup(
        `<strong>Location:</strong> ${place}<br><strong>Magnitude:</strong> ${magnitude}<br><strong>Depth:</strong> ${depth} km<br><strong>Time:</strong> ${time}`
      )
      .addTo(myMap);
  });

  // Create a legend
  var legend = L.control({ position: "bottomright" });

  legend.onAdd = function () {
    var div = L.DomUtil.create("div", "info legend");
    var depthLabels = ["<10 km", "10-50 km", "50-100 km", ">100 km"];
    var colors = ["#FF5733", "#FF9933", "#FFFF33", "#33FF57"];

    for (var i = 0; i < depthLabels.length; i++) {
      div.innerHTML +=
        '<i style="background:' +
        colors[i] +
        '"></i> ' +
        depthLabels[i] +
        (i + 1 < depthLabels.length ? "<br>" : "");
    }
    return div;
  };

  legend.addTo(myMap);
});

// Function to determine the color based on depth
function getColor(depth) {
  if (depth < 10) return "#FF5733";
  else if (depth < 50) return "#FF9933";
  else if (depth < 100) return "#FFFF33";
  else return "#33FF57";
}
