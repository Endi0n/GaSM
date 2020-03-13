const API_ROOT_URL = 'https://roms.vodafone.ro/sal/webapi/';
const TRUCKS_JSON_URL = API_ROOT_URL + 'getvehicles';
const BINS_JSON_URL = API_ROOT_URL + 'getpois'

const TRUCK_ICON = L.icon({ iconUrl: '/images/truck--green.svg', iconSize: [26, 26], iconAnchor: [13, 13] })
const BIN_ICON = L.icon({ iconUrl: '/images/dumpster--green.svg', iconSize: [26, 26], iconAnchor: [13, 13] })

function initMap() {
    let map = L.map('map', {
        center: [47.162541, 27.583808],
        zoom: 14,
        zoomControl: false,
    })

    map.addControl(new L.Control.Fullscreen({ position: 'bottomright' }))

    L.control.zoom({
        position: "bottomright"
    }).addTo(map)

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map)

    return map
}

function refreshData() {
    $.get(TRUCKS_JSON_URL, drawTrucks)
    $.get(BINS_JSON_URL, drawBins)

    setInterval
}

function drawTrucks(trucks) {
    TRUCKS_LAYER.clearLayers()

    for (let truck of trucks) {
        let truckMarker = L.marker([truck.LastLatitude, truck.LastLongitude], { icon: TRUCK_ICON })
        TRUCKS_LAYER.addLayer(truckMarker)
    }
}

function drawBins(bins) {
    BINS_LAYER.clearLayers()

    for (let bin of bins) {
        let binMarker = L.marker([bin.Latitude, bin.Longitude], { icon: BIN_ICON })
        BINS_LAYER.addLayer(binMarker)
    }
}


var map = initMap()

var TRUCKS_LAYER = L.featureGroup().addTo(map)
var BINS_LAYER = L.markerClusterGroup().addTo(map)

refreshData()
setInterval(refreshData, 12e4) // every 2 minutes
