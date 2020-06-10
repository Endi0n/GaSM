import Component from '/scripts/bee/Component.js'

class XStats extends Component {
    async componentDidLoad() {
        let height = $('x-menu').outerHeight()
        $("#meniu_secundar").css('top', height)

        $(window).scroll(function(){
            if ($( ".daterangepicker" ).css('display') !== 'none') 
                $(".cancelBtn").click()
        });

        const xStatsTable = document.getElementsByTagName('x-stats-table')[0]
        $('#download_csv')[0].addEventListener('click', () => {
            let ranges = $('input[name="daterange"]').val().split(' - ')
            xStatsTable.downloadCSV(moment(ranges[0], 'DD/MM/YYYY'), moment(ranges[1], 'DD/MM/YYYY'))
        })
        $('#download_html')[0].addEventListener('click', () => {
            let ranges = $('input[name="daterange"]').val().split(' - ')
            xStatsTable.downloadHTML(moment(ranges[0], 'DD/MM/YYYY'), moment(ranges[1], 'DD/MM/YYYY'))
        })
        $('#download_pdf')[0].addEventListener('click', () => {
            let ranges = $('input[name="daterange"]').val().split(' - ')
            xStatsTable.downloadPDF(moment(ranges[0], 'DD/MM/YYYY'), moment(ranges[1], 'DD/MM/YYYY'))
        })
    }
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
