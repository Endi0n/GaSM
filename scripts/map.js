const API_ROOT_URL = 'https://roms.vodafone.ro/sal/webapi/';
const TRUCKS_JSON_URL = API_ROOT_URL + 'getvehicles';
const BINS_JSON_URL = API_ROOT_URL + 'getpois'

function initMap() {
    let map = L.map('map', {
        center: [47.162541, 27.583808],
        zoom: 14,
        zoomControl: false,
    })

    map.addControl(new L.Control.Fullscreen({position: 'bottomright'}))

    L.control.zoom({
        position: "bottomright"
    }).addTo(map)
    
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map)

    return map
}


let map = initMap()

