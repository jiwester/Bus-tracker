
window.onload = function () { //Launches some functions upon loading the window
    makeMap();
    populateDropdown();
};

function refresh(){
    busCoordinates();
}

let map = ""; // Global map variable for busMarker and lineString scripts

function makeMap(){

    // Default map location is set to Turku
    let Lon = 22.26;
    let Lat = 60.45;

    map = new ol.Map({
        target: 'map',
        layers: [
            new ol.layer.Tile({
                source: new ol.source.OSM()
            }),

            new ol.layer.Vector({ //markers layer
                source: new ol.source.Vector(),
                style: new ol.style.Style({
                    image: new ol.style.Icon({
                        src: 'https://maps.google.com/mapfiles/ms/micons/blue.png',
                        anchor: [0.5, 32],
                        anchorXUnits: 'fraction',
                        anchorYUnits: 'pixels',
                        opacity: 1,
                        scale: 1
                    })
                })
            }),

            new ol.layer.Vector({ //lineString layer
                source: new ol.source.Vector(),
                style: new ol.style.Style({
                    stroke: new ol.style.Stroke({
                        color: '#8d0000',
                        width: 5
                    })
                })
            })
        ],
        view: new ol.View({
            center: ol.proj.fromLonLat([Lon, Lat]),
            zoom: 11
        })
    });
}

let routes = []; // Global array for the dropdown menu

function populateDropdown(){ // Populate dropdown menu with the bus routes
    let url = "https://data.foli.fi/gtfs/routes";
    let xhr = new XMLHttpRequest();
    xhr.open('GET', url);
    xhr.send();
    // let routes_name = [];
    // let routes_id = [];
    let dropdown = document.getElementById("routes");

    xhr.onload = function () {

        if (this.status >= 200 && this.status < 400) {
            let data = JSON.parse(this.response);

            for (let i = 0; i < data.length; i++){ // Add route names to an array
                routes.push(data[i]);
            }
        }
        else{
            console.log("Error!")
        }

        for (let i = 0; i < routes.length; i++){// Add route names to the dropdown menu
            let opt = routes[i]["route_short_name"];
            let element = document.createElement("option");
            element.textContent = opt;
            dropdown.appendChild(element);

        }
    };

}

// Button listeners
document.getElementById("busButton").addEventListener("click", busCoordinates);
document.getElementById("refreshButton").addEventListener("click", refresh);
document.getElementById("routeButton").addEventListener("click", getSelectedRouteIdRoute);