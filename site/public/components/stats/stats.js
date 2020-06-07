import Component from '/scripts/bee/Component.js'

class XStats extends Component {
    async componentRemoved() {
        document.getElementsByClassName('daterangepicker')[0].remove()
    }
}

Component.define('x-stats', XStats, {
    template: '/components/stats/stats.html',

    styles: [
        'https://cdn.jsdelivr.net/npm/daterangepicker/daterangepicker.css',

        '/components/stats/stats.css'
    ],

    scripts: [
        'https://cdn.jsdelivr.net/momentjs/latest/moment.min.js',
        'https://cdn.jsdelivr.net/npm/daterangepicker/daterangepicker.min.js',
        'https://cdn.jsdelivr.net/npm/chart.js@2.9.3/dist/Chart.min.js',
    ],

    lazyScripts: [
        '/components/stats/stats_ext.js'
    ]
})
