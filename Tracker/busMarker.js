
// ------- How this script works ---------
// Get API data of all buses
// Compare selected trip to "publishedlinename" attribute in https://data.foli.fi/siri/vm/pretty data
// The matches are buses that are currently on the selected route
// Draw the matches

function busCoordinates(){
    let url = "https://data.foli.fi/siri/vm/pretty";
    let xhr = new XMLHttpRequest();
    xhr.open('GET', url);
    xhr.onload = drawMarker;
    xhr.send();
}

function drawMarker() {
    let dropdown = document.getElementById("routes");
    let selected = dropdown.options[dropdown.selectedIndex].text; // The selected route

    if (this.status >= 200 && this.status < 400){
        let data = JSON.parse(this.response);
        let dataLength = Object.keys(data['result']['vehicles']).length;
        let busData = Object.values(data.result.vehicles);
        let busCoords = [];

        let source = map.getLayers()['array_'][1].getSource();
        source.clear();

        for(let i = 0; i < dataLength; i++ ){
            if(busData[i]['monitored'] === true){ // Checks if vehicle is active and can be located.
                if(busData[i]['publishedlinename'] === selected){ // Check for buses on the selected routes
                    source.addFeature(
                        new ol.Feature(
                            new ol.geom.Point(
                                ol.proj.fromLonLat([busData[i]['longitude'], busData[i]['latitude']])
                            )
                        )
                    );
                    busCoords.push( //
                        parseFloat (busData[i]['longitude']),
                        parseFloat (busData[i]['latitude'])
                    );
                }
            }
        }

        if (busCoords.length === 0){ // Show error message if no buses are on the selected route
            alert("No buses are currently on this route.");
            return false;
        }

    }
}