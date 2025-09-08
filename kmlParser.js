

// Ensure sidebar panel exists
function ensureSidebar() {
	let sidebar = document.getElementById('sidebar');
	if (sidebar) {
		sidebar.style.display = 'block';
		return sidebar;
	}
	return null;
}

function showHouseDetails(house) {
		const sidebar = ensureSidebar();
		if (!sidebar) return;
		sidebar.innerHTML = `
				<div style="display:flex;justify-content:space-between;align-items:center;">
					<h2 style='margin:0 0 8px 0;'>${house.name}</h2>
					<button onclick='document.getElementById("sidebar").innerHTML=""' style='background:#333;color:#fff;border:none;border-radius:4px;width:32px;height:32px;font-size:20px;cursor:pointer;'>×</button>
				</div>
				<div style='margin-bottom:10px;'>
					<span style='font-weight:bold;'>Status:</span> ${house.status || 'Available'}
				</div>
				<div><span style='font-weight:bold;'>Builder:</span> ${house.builder || 'N/A'}</div>
				<div><span style='font-weight:bold;'>Product Type:</span> ${house.productType || 'N/A'}</div>
				<div><span style='font-weight:bold;'>Building Pocket:</span> ${house.buildingPocket || 'N/A'}</div>
				<div><span style='font-weight:bold;'>Legal:</span> ${house.legal || 'N/A'}</div>
				<div style='margin-top:10px;'><a href='https://www.google.com/maps/dir/?api=1&destination=${house.coords[0].lat},${house.coords[0].lng}' target='_blank'>Get Directions</a></div>
		`;
}

// Main function to draw polygons and add click events
function drawPolygonsOnMap(map, polygons) {
	polygons.forEach(house => {
		const polygon = new google.maps.Polygon({
			paths: house.coords,
			map: map,
			strokeColor: '#000',
			strokeOpacity: 0.8,
			strokeWeight: 2,
			fillColor: '#00b100',
			fillOpacity: 0.35
		});
		polygon.addListener('click', () => {
			showHouseDetails(house);
		});
	});
}
// Load and parse the provided KML file, then store polygon coordinates
fetch('data/Meltwater_please_be_final.kml')
	.then(response => response.text())
	.then(kmlText => {
		const polygons = parseKMLPolygons(kmlText);
		// Store as a global variable for easy access
		window.meltwaterPolygons = polygons;
		// Log the result for inspection
		console.log('Extracted polygons:', polygons);
		// Optionally, you can save to localStorage for later use
		// localStorage.setItem('meltwaterPolygons', JSON.stringify(polygons));
	})
	.catch(err => console.error('Failed to load KML:', err));
// Parse KML and extract all polygon coordinates and names
// Usage: parseKMLPolygons(kmlText)
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

The sidebar is successfully added 
but it shows no information 

when i click on a house i want its details to appear on the sidebar 

the sidebar should contain the following details. 

Status: 
Builder: Cira Homes
Product Type: 
Legal: 

Get Directions(an underlined link below)

