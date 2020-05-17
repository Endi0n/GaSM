import BBaseComponent from '/scripts/bee/BBaseComponent.js'

const API_ROOT_URL = 'https://gps.i-track.ro/sal/webapi/';
const TRUCKS_JSON_URL = API_ROOT_URL + 'getvehicles';
const BINS_JSON_URL = API_ROOT_URL + 'getpois'

const TRUCK_ICON = L.icon({ iconUrl: '/images/truck--green.svg', iconSize: [26, 26], iconAnchor: [13, 13] })
const BIN_ICON = L.icon({ iconUrl: '/images/dumpster--green.svg', iconSize: [26, 26], iconAnchor: [13, 13] })

class XMap extends BBaseComponent {
    async componentDidMount() {
        this.initMap()

        this.trucksLayer = L.featureGroup().addTo(this.map)
        this.binsLayer = L.markerClusterGroup({}).addTo(this.map)
    
        L.control.layers(null, { 'Vehicule': this.trucksLayer, 'Pubele': this.binsLayer })
            .addTo(this.map);
    
        this.refreshData()
        setInterval(this.refreshData, 60e3) // every minute
    }
    
    initMap(mapDiv) {
        this.map = L.map(this, {
            center: [47.162541, 27.583808],
            zoom: 14,
            zoomControl: false,
        })

        this.map.addControl(new L.Control.Fullscreen({ position: 'bottomright' }))

        L.control.zoom({
            position: "bottomright"
        }).addTo(this.map)

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(this.map)

        return this.map
    }

    refreshData() {
        $.get(TRUCKS_JSON_URL, (data) => this.drawTrucks(data))
        $.get(BINS_JSON_URL, (data) => this.drawBins(data))
    }

    drawTrucks(trucks) {
        console.log(this)
        this.trucksLayer.clearLayers()

        for (let truck of trucks) {
            let truckMarker = L.marker([truck.LastLatitude, truck.LastLongitude], {
                icon: TRUCK_ICON,
                rotationAngle: truck.Heading + 90
            })
            this.trucksLayer.addLayer(truckMarker)
        }
    }

    drawBins(bins) {
        this.binsLayer.clearLayers()

        for (let bin of bins) {
            let binMarker = L.marker([bin.Latitude, bin.Longitude], { icon: BIN_ICON })
            this.binsLayer.addLayer(binMarker)
        }
    }
}

window.customElements.define('x-map', XMap)
