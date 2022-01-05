async function main() {
    function init() {
        let map = initMap();
        let searchResultLayer = L.layerGroup();
        window.addEventListener('DOMContentLoaded', function(){
            // we will add event listners here later
            document.querySelector('#search-btn').addEventListener('click', async function(){
                let query = document.querySelector('#search-input').value;
                let center = map.getBounds().getCenter();
                let data = await search(center.lat, center.lng, query);

                // remove all the markers from the search result layer
                searchResultLayer.clearLayers();

                let searchResultElement =  document.querySelector('#search-results');
                
                // remove from search result div
                searchResultElement.innerHTML = "";

                for (let eachVenue of data.results) {
                    let coordinate = [ eachVenue.geocodes.main.latitude, eachVenue.geocodes.main.longitude ];
                    let marker = L.marker(coordinate);
                    marker.bindPopup(`<div><h1>${eachVenue.name}</h1></div>`)
                    // searchResultLayer.addLayer(marker)
                    marker.addTo(searchResultLayer);

                    // add the search result to #search-results
                    let resultElement = document.createElement('div');
                    resultElement.className="search-result";
                    resultElement.innerHTML = eachVenue.name;

                    resultElement.addEventListener('click', function(){
                        map.flyTo(coordinate, 16);
                        marker.openPopup();
                    })

                    searchResultElement.appendChild(resultElement);
                }

                map.addLayer(searchResultLayer);
            })

            document.querySelector("#toggle-search-btn").addEventListener('click', function(){
                let searchContainer =  document.querySelector("#search-container");
                // if the search container is not being displayed at the moment, show it
                if (searchContainer.style.display == 'none' || !searchContainer.style.display) {
                    searchContainer.style.display='block';
                } else {
                    searchContainer.style.display='none';
                }
            
            })
        })

    }

    init();
}

const API_BASE_URL="https://api.foursquare.com/v3";
const API_KEY="fsq36vWuvzc4ASQhuuv+TktgLmcCAI4WKFykx0ewzgChlkQ="
const headers = {
    Accept: 'application/json',
    Authorization: API_KEY    
}

async function search(lat, lng, query) {
    let ll = lat + "," + lng;
    let response = await axios.get(API_BASE_URL + "/places/search",{
        headers: {
            ...headers
        },
        params: {
            'll': ll,
            'v': '20210903',  // YYYYMMDD format
            'query': query
        }
    })
    return response.data;
}

main();

