
const fs = require('fs');
const path = require('path');
const xml2js = require('xml2js');

const kmlPath = path.join(__dirname, 'data', 'Meltwater_please_be_final.kml');
const jsonPath = path.join(__dirname, 'data', 'houses.json');

fs.readFile(kmlPath, 'utf8', (err, kmlText) => {
    if (err) throw err;
    xml2js.parseString(kmlText, (err, result) => {
        if (err) throw err;
        // Find all Placemark nodes
        const placemarks = result.kml.Document[0].Folder[0].Placemark || [];
        const houses = placemarks.map(pm => {
            const name = (pm.name && pm.name[0]) ? pm.name[0].trim() : '';
            return {
                legal: name,
                status: '',
                builder: 'Cira Homes',
                productType: ''
            };
        });
        fs.writeFile(jsonPath, JSON.stringify(houses, null, 2), err => {
            if (err) throw err;
            console.log('houses.json updated with house details from KML.');
        });
    });
});
