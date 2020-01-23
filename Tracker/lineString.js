
// ------- How this script works ---------
// Get id of selected trip
// Load http://data.foli.fi/gtfs/trips/route/<route_id> with the correct id
// Get the shape_id value for selected trip
// Insert value into url http://data.foli.fi/gtfs/shapes/0_195
// Draw the route

function getSelectedRouteIdRoute() { //Get the id of the route selected in the dropdown menu
    let dropdown = document.getElementById("routes");
    let selected = dropdown.selectedIndex;
    let selected_id = routes[selected]["route_id"];

    let url = "https://data.foli.fi/gtfs/trips/route/"+selected_id;
    let xhr = new XMLHttpRequest();
    xhr.open('GET', url);
    xhr.onload = getLineStringCoords;
    xhr.send();
}

function getLineStringCoords() {
    let data = JSON.parse(this.response);
    let shape = data[0]["shape_id"]; // Get the shape of the route to make a linestring
    let url = "https://data.foli.fi/gtfs/shapes/"+shape;
    let xhr = new XMLHttpRequest();
    xhr.open('GET', url);
    xhr.onload = drawLineString;
    xhr.send();
}

function drawLineString() {
    if (this.status >= 200 && this.status < 400){
        let data = JSON.parse(this.response);
        let coords = [];
        let i = 0;

        for(i; i < data.length; i++ ){
            coords.push(
                new ol.proj.fromLonLat([
                    data[i]['lon'],
                    data[i]['lat']
                ])
            )
        }


        let source = map.getLayers()['array_'][2].getSource();

        source.clear();
        source.addFeature(
            new ol.Feature(
                new ol.geom.LineString(coords)

            )
        )
    }

}
