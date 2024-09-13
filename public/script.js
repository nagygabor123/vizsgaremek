var map, userMarker, userCircle;

// Alaptérkép hozzáadása (OpenStreetMap)
function initMap() {
    map = L.map('map'); // A térkép inicializálása hely meghatározása után történik
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 18,
    }).addTo(map);
}

initMap();

// Felhasználó pozíciójának meghatározása
function onLocationFound(e) {
    var radius = document.getElementById('radius-slider').value * 1000; // Átalakítás méterbe

    // Kiírjuk a pozíciót a konzolra
    console.log("Lekért lokáció: ", e.latlng);

    // Ha létezik korábbi marker vagy kör, eltávolítjuk őket
    if (userMarker) {
        map.removeLayer(userMarker);
    }
    if (userCircle) {
        map.removeLayer(userCircle);
    }

    // Új marker és kör létrehozása
    userMarker = L.marker(e.latlng).addTo(map);
    userCircle = L.circle(e.latlng, radius).addTo(map);

    // A térkép fókuszának beállítása a kör méretéhez igazítva
    fitMapToCircle(e.latlng, radius);
}

// Hibakezelés
function onLocationError(e) {
    alert("Hiba a helymeghatározás során: " + e.message);
    // Itt érdemes lehet visszaállítani egy biztonságos alapértelmezett helyre
    var defaultLatLng = [46.7126, 19.8454]; // Kiskunfélegyháza koordinátái
    map.setView(defaultLatLng, 13);
}

// A térkép nagyításának igazítása a kör sugara alapján
function fitMapToCircle(latlng, radius) {
    var bounds = latlng.toBounds(radius * 2); // A kör átmérőjét adjuk meg a határnak
    map.fitBounds(bounds); // A térkép zoom-szintjét és pozícióját a határokhoz igazítja
}

// Geolocation API pontosabb helymeghatározással
map.on('locationfound', onLocationFound);
map.on('locationerror', onLocationError);

// Helyzet kérése a felhasználótól pontosabb beállításokkal
map.locate({
    setView: true,
    maxZoom: 100,
    enableHighAccuracy: true, // Pontosabb helymeghatározás bekapcsolása
    timeout: 10000,           // Timeout 10 másodperc
    maximumAge: 0            // Mindig friss helyzetkérés
});

// Csúszka eseménykezelője
document.getElementById('radius-slider').addEventListener('input', function() {
    var radiusValue = this.value;
    document.getElementById('range-value').textContent = radiusValue + ' km';

    if (userCircle) {
        var latlng = userCircle.getLatLng();
        userCircle.setRadius(radiusValue * 1000); // Frissítjük a kör sugarát

        // A térképet ismét a kör teljes láthatóságához igazítjuk
        fitMapToCircle(latlng, radiusValue * 1000);
    }
});
