var map, userMarker, userCircle;

// Initialize map
function initMap() {
    map = L.map('map').setView([47.497912, 19.040235], 7); // Center map on Hungary
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 18,
    }).addTo(map);

    fetchRestaurants(); // Fetch and display restaurants
}

initMap();

// Fetch restaurants from the server and display them with red markers
function fetchRestaurants() {
    fetch('http://localhost:3000/restaurants')
        .then(response => response.json())
        .then(data => {
            data.forEach(restaurant => {
                // Extract latitude and longitude from the location string
                const [lat, lng] = restaurant.restlocation.replace('lat: ', '').replace('lng: ', '').split(',').map(Number);

                // Use an external red marker icon
                const redIcon = new L.Icon({
                    iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
                    iconSize: [25, 41],    // Default size for the red marker
                    iconAnchor: [12, 41],  // Anchor point for the marker
                    popupAnchor: [1, -34], // Offset for the popup
                    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
                    shadowSize: [41, 41]   // Shadow size
                });

                // Create the marker with the red icon and bind the restaurant name as a popup
                L.marker([lat, lng], { icon: redIcon })
                    .addTo(map)
                    .bindPopup(`<b>${restaurant.restname}</b>`);
            });
        })
        .catch(error => console.error('Error fetching restaurant data:', error));
}



// Update user location
function onLocationFound(e) {
    var radius = document.getElementById('radius-slider').value * 1000;

    if (userMarker) {
        map.removeLayer(userMarker);
    }
    if (userCircle) {
        map.removeLayer(userCircle);
    }

    userMarker = L.marker(e.latlng).addTo(map);
    userCircle = L.circle(e.latlng, radius).addTo(map);

    fitMapToCircle(e.latlng, radius);
}

map.on('locationfound', onLocationFound);
map.locate({
    setView: true,
    maxZoom: 100,
    enableHighAccuracy: true,
    timeout: 10000,
    maximumAge: 0
});

// Fit map to circle
function fitMapToCircle(latlng, radius) {
    var bounds = latlng.toBounds(radius * 2);
    map.fitBounds(bounds);
}

// Update circle when radius slider changes
document.getElementById('radius-slider').addEventListener('input', function() {
    var radiusValue = this.value;
    document.getElementById('range-value').textContent = radiusValue + ' km';

    if (userCircle) {
        var latlng = userCircle.getLatLng();
        userCircle.setRadius(radiusValue * 1000);
        fitMapToCircle(latlng, radiusValue * 1000);
    }
});
