// Helper function to parse KML polygons
function parseKMLPolygons(kmlText) {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(kmlText, "text/xml");
    const placemarks = xmlDoc.getElementsByTagName("Placemark");
    const polygons = [];
    for (let i = 0; i < placemarks.length; i++) {
        const name = placemarks[i].getElementsByTagName("name")[0]?.textContent.trim();
        const coordsText = placemarks[i].getElementsByTagName("coordinates")[0]?.textContent.trim();
        if (!name || !coordsText) continue;
        const coordsArr = coordsText.split(/\s+/).map(pair => {
            const [lng, lat] = pair.split(",");
            return { lat: parseFloat(lat), lng: parseFloat(lng) };
        });
        polygons.push({ name, coords: coordsArr });
    }
    return polygons;
}

function initMap() {
    // 1. DEFINE MAP OPTIONS
    const mapOptions = {
        zoom: 18,
        center: { lat: 53.421192, lng: -113.406072 },
        mapTypeId: 'satellite'
    };

    // 2. CREATE THE MAP
    const map = new google.maps.Map(document.getElementById("map"), mapOptions);

    // 3. ADD IMAGE OVERLAY
    const imageUrl = "https://cdn.jsdelivr.net/gh/Devansh070805/G@main/Screenshot_2025-08-29_at_4.19.11_AM.png";
    const imageBounds = {
        north: 53.42485917287313,
        south: 53.41753314796038,
        east: -113.3936603109275,
        west: -113.4184601581091
    };
    const groundOverlay = new google.maps.GroundOverlay(imageUrl, imageBounds);
    groundOverlay.setMap(map);

    // 4. LOAD AND PARSE KML, THEN DRAW POLYGONS
    // Load houses.json first
    fetch('data/houses.json')
        .then(response => response.json())
        .then(houseDetails => {
            // Now load and parse KML
            fetch('data/Meltwater_please_be_final.kml')
                .then(response => response.text())
                .then(kmlText => {
                    const polygons = parseKMLPolygons(kmlText);
                    polygons.forEach(house => {
                        // Find matching house details by legal name
                        const details = houseDetails.find(h => h.legal.trim() === house.name.trim());
                        const merged = {
                            ...house,
                            ...(details || {})
                        };
                        // Set color based on status
                        let color = '#00b100'; // green default
                        if (merged.status === 'sold') color = '#ff0000'; // red
                        else if (merged.status === 'reserved') color = '#ffe100'; // yellow
                        else if (merged.status === 'inactive') color = '#888888'; // grey
                        else color = '#00b100'; // available/other
                        const polygon = new google.maps.Polygon({
                            paths: house.coords,
                            map: map,
                            strokeColor: '#000',
                            strokeOpacity: 0.8,
                            strokeWeight: 2,
                            fillColor: color,
                            fillOpacity: 0.35
                        });
                        polygon.addListener('click', function() {
                            showHouseDetails(merged);
                        });
                    });
                })
                .catch(err => console.error('Failed to load KML:', err));
        })
        .catch(err => console.error('Failed to load houses.json:', err));
}
// This function will be called by the Google Maps API script when it has loaded.

// Show house details in sidebar
function showHouseDetails(house) {
    const detailsBox = document.getElementById('details-box');
    const detailsContent = document.getElementById('details-content');
    if (!house || !house.legal) {
        detailsContent.innerHTML = 'Select a house to get details.';
        return;
    }
    detailsContent.innerHTML = `
        <p><strong>Status:</strong> ${house.status || 'Unknown'}</p>
        <p><strong>Builder:</strong> Cira Homes</p>
        <p><strong>Product Type:</strong> ${house.productType || 'Unknown'}</p>
        <p><strong>Legal:</strong> ${house.legal || 'Unknown'}</p>
        <a href="https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(house.address || '')}" target="_blank">Get Directions</a>
    `;
}
    
