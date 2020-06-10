import Component from '/scripts/bee/Component.js'
import { DUMPSTERS_ROUTE } from '/scripts/routes.js'
import Cache from '/scripts/cache.js'


class XMap extends Component {
    initXMap() {
        if (XMap.inited) return

        XMap.TRUCKS_JSON_URL = 'https://gps.i-track.ro/sal/webapi/getvehicles'
        XMap.DUMPSTERS_JSON_URL = DUMPSTERS_ROUTE

        XMap.TRUCK_ICON = L.icon({ iconUrl: '/images/truck--green.svg', iconSize: [26, 26], iconAnchor: [13, 13] })
        XMap.DUMPSTER_ICON = L.icon({ iconUrl: '/images/dumpster--green.svg', iconSize: [26, 26], iconAnchor: [13, 13] })
    
        XMap.inited = true
    }

    async componentDidMount() {
        this.initXMap()
        this.initMap()

        this.trucksLayer = L.featureGroup().addTo(this.map)
        this.dumpstersLayer = L.markerClusterGroup({}).addTo(this.map)
    
        L.control.layers(null,
            { 'Vehicule': this.trucksLayer, 'Pubele': this.dumpstersLayer },
            { position: 'bottomleft' }
        ).addTo(this.map)
    
        this.loadData()
        
        this.refreshDataInterval = this.refreshData.bind(this)
        setInterval(this.refreshDataInterval, 60e3) // every minute
    }

    asyncComponentRemoved() {
        clearInterval(this.refreshDataInterval)
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

    loadData() {
        $.get(XMap.TRUCKS_JSON_URL, data => this.drawTrucks(data))
        
        if (Cache.dumpsters) {
            this.drawDumpsters(Cache.dumpsters)
        } else {
            $.get(XMap.DUMPSTERS_JSON_URL, data => {
                Cache.dumpsters = data
                this.drawDumpsters(data)
            })
        }
    }

    refreshData() {
        $.get(XMap.TRUCKS_JSON_URL, (data) => this.drawTrucks(data))
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

    drawDumpsters(dumpsters) {
        this.dumpstersLayer.clearLayers()

        for (let dumpster of dumpsters) {
            let dumpsterMarker = L.marker([dumpster.lat, dumpster.lon], { icon: XMap.DUMPSTER_ICON })

            dumpsterMarker.bindPopup(this.createDumpsterMarker(dumpster.id), {
                minWidth: 250
            })

            this.dumpstersLayer.addLayer(dumpsterMarker)
        }
    }

    createDumpsterMarker(id) {
        return `<x-dumpster id="${id}"></x-dumpster>`
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

        // Leaflet RotatedIcon plugin 
        '/components/map/leaflet-rotated-icon.js'
    ]
})
