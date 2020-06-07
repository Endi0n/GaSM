import Component from '/scripts/bee/Component.js'

class XMap extends Component {
    initXMap() {
        if (XMap.inited) return

        const API_ROOT_URL = 'https://gps.i-track.ro/sal/webapi/';

        XMap.TRUCKS_JSON_URL = API_ROOT_URL + 'getvehicles';
        XMap.BINS_JSON_URL = API_ROOT_URL + 'getpois'

        XMap.TRUCK_ICON = L.icon({ iconUrl: '/images/truck--green.svg', iconSize: [26, 26], iconAnchor: [13, 13] })
        XMap.BIN_ICON = L.icon({ iconUrl: '/images/dumpster--green.svg', iconSize: [26, 26], iconAnchor: [13, 13] })
    
        XMap.inited = true
    }

    async componentDidMount() {
        this.initXMap()
        this.initMap()

        this.trucksLayer = L.featureGroup().addTo(this.map)
        this.binsLayer = L.markerClusterGroup({}).addTo(this.map)
    
        L.control.layers(null,
            { 'Vehicule': this.trucksLayer, 'Pubele': this.binsLayer },
            { position: 'bottomleft' }
        ).addTo(this.map)
    
        this.refreshData()
        setInterval(this.refreshData.bind(this), 60e3) // every minute
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
        $.get(XMap.TRUCKS_JSON_URL, (data) => this.drawTrucks(data))
        $.get(XMap.BINS_JSON_URL, (data) => this.drawBins(data))
    }

    drawTrucks(trucks) {
        this.trucksLayer.clearLayers()

        for (let truck of trucks) {
            let truckMarker = L.marker([truck.LastLatitude, truck.LastLongitude], {
                icon: XMap.TRUCK_ICON,
                rotationAngle: truck.Heading + 90
            })
            this.trucksLayer.addLayer(truckMarker)
        }
    }

    drawBins(bins) {
        this.binsLayer.clearLayers()

        for (let bin of bins) {
            let binMarker = L.marker([bin.Latitude, bin.Longitude], { icon: XMap.BIN_ICON })
            this.binsLayer.addLayer(binMarker)
        }
    }
}

Component.define('x-map', XMap, {
    styles: [
        // Leaflet base
        'https://unpkg.com/leaflet@1.6.0/dist/leaflet.css',

        // Leaflet Fullscreen plugin
        'https://api.mapbox.com/mapbox.js/plugins/leaflet-fullscreen/v1.0.1/leaflet.fullscreen.css',

        // Leaflet MarketCuster plugin
        'https://unpkg.com/leaflet.markercluster@1.4.1/dist/MarkerCluster.css',
        'https://unpkg.com/leaflet.markercluster@1.4.1/dist/MarkerCluster.Default.css',

        '/components/map/map.css'
    ],

    scripts: [
        // Leaflet base
        'https://unpkg.com/leaflet@1.6.0/dist/leaflet.js',

        // Leaflet Fullscreen plugin
        'https://api.mapbox.com/mapbox.js/plugins/leaflet-fullscreen/v1.0.1/Leaflet.fullscreen.min.js',

        // Leaflet MarkerCluster plugin 
        'https://unpkg.com/leaflet.markercluster@1.4.1/dist/leaflet.markercluster.js',

        '/components/map/leaflet-rotated-icon.js'
    ]
})
