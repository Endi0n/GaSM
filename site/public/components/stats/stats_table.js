import Component from '/scripts/bee/Component.js'
import { DUMPSTERS_STATS_LIST_ROUTE } from '/scripts/routes.js'

class XStatsTable extends Component {
    firstId = null
    lastId = null
    startDate = null
    endDate = null

    updateTable(start, end, lastId, order, newPage) {
        this.startDate = start
        this.endDate = end
        let thisReference = this
        
        axios.get(DUMPSTERS_STATS_LIST_ROUTE(start.unix(), end.unix(), lastId || 0, order))
        .then(function (response) {
            let table = '<table>\
                            <tr>\
                                <th>Id</th>\
                                <th>Locatie</th>\
                                <th>Menajer</th>\
                                <th>Plastic</th>\
                                <th>Sticla</th>\
                                <th>Hartie</th>\
                                <th>Metal</th>\
                            </tr>'
            let ths = ['id', 'address', 'menajer', 'plastic', 'sticlă', 'hârtie', 'metal']
            if(!response.data[0])
                return false
            if(newPage)
            {
                if(order === 'asc')
                    $('#page_nr').html(Number($('#page_nr').html()) + 1)
                else
                    $('#page_nr').html(Number($('#page_nr').html()) - 1)
            }
            thisReference.firstId = response.data[0].id
            thisReference.lastId = response.data[response.data.length - 1].id
            for(const row of response.data) {
                table += '<tr>'
                for(let i=0; i < ths.length; ++i) {
                    table += `<td> ${row[ths[i]] || 0} </td>`
                }
                table += '</tr>'
            }
            table += '</table>'
            $('.table').html(table)
        })
        .catch(function (error) {
            console.log(error);
        })
        return true
    }

    async componentDidMount() {
        $('#page_nr').html("1");
    }

    next() {
        this.updateTable(this.startDate, this.endDate, this.lastId, 'asc', true)
    }

    back() {
        this.updateTable(this.startDate, this.endDate, this.firstId, 'desc', true)
    }

    _download(data, filename, type) {
        var file = new Blob([data], {type: type});
        if (window.navigator.msSaveOrOpenBlob)
            window.navigator.msSaveOrOpenBlob(file, filename);
        else {
            var a = document.createElement("a"),
                    url = URL.createObjectURL(file);
            a.href = url;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            setTimeout(function() {
                document.body.removeChild(a);
                window.URL.revokeObjectURL(url);  
            }, 0); 
        }
    }

    downloadCSV(start, end) {
        let thisReference = this

        axios.get(DUMPSTERS_STATS_LIST_ROUTE(start.unix(), end.unix(), 0, 'asc', 'false'))
        .then(function (response) {
            let table = 'Id,Locatie,Menajer,Plastic,Sticla,Hartie,Metal\n'

            let ths = ['id', 'address', 'menajer', 'plastic', 'sticlă', 'hârtie', 'metal']
            if(!response.data[0])
                return false
            for(const row of response.data) {
                for(let i=0; i < ths.length - 1; ++i) 
                    if(i === 1)
                        table += `"${row[ths[i]] || 0}",`
                    else
                        table += `${row[ths[i]] || 0},`
                
                table += `${row[ths[ths.length - 1]] || 0}\n`
            }
            thisReference._download(table, 'file.csv', 'CSV')
        })
        .catch(function (error) {
            console.log(error)
        })
    }

    downloadHTML(start, end) {
        let thisReference = this

        axios.get(DUMPSTERS_STATS_LIST_ROUTE(start.unix(), end.unix(), 0, 'asc', 'false'))
        .then(function (response) {
            let table = '<table>\
                            <tr>\
                                <th>Id</th>\
                                <th>Locatie</th>\
                                <th>Menajer</th>\
                                <th>Plastic</th>\
                                <th>Sticla</th>\
                                <th>Hartie</th>\
                                <th>Metal</th>\
                            </tr>'

            let ths = ['id', 'address', 'menajer', 'plastic', 'sticlă', 'hârtie', 'metal']
            if(!response.data[0])
                return false
            for(const row of response.data) {
                table += '<tr>'
                for(let i=0; i < ths.length; ++i) {
                    table += `<td> ${row[ths[i]] || 0} </td>`
                }
                table += '</tr>'
            }
            table += '</table>'

            thisReference._download(table, 'stats.html', 'html')
        })
        .catch(function (error) {
            console.log(error)
        })
    }

    downloadPDF(start, end) {
        axios.get(DUMPSTERS_STATS_LIST_ROUTE(start.unix(), end.unix(), 0, 'asc', 'false'))
        .then(function (response) {
            let table = '<table>\
                            <tr>\
                                <th>Id</th>\
                                <th>Locatie</th>\
                                <th>Menajer</th>\
                                <th>Plastic</th>\
                                <th>Sticla</th>\
                                <th>Hartie</th>\
                                <th>Metal</th>\
                            </tr>'

            let ths = ['id', 'address', 'menajer', 'plastic', 'sticlă', 'hârtie', 'metal']
            if(!response.data[0])
                return false
            for(const row of response.data) {
                table += '<tr>'
                for(let i=0; i < ths.length; ++i) {
                    table += `<td> ${row[ths[i]] || 0} </td>`
                }
                table += '</tr>'
            }
            table += '</table>'

            var pdf = new jsPDF('p', 'pt', 'letter');
            let specialElementHandlers = {
                '#bypassme': function (element, renderer) {
                    return true
                }
            }
            let margins = {
                top: 80,
                bottom: 60,
                left: 10,
                width: 700
            }
            pdf.fromHTML(
                table,
                margins.left,
                margins.top, {
                    'width': margins.width,
                    'elementHandlers': specialElementHandlers
            },

            function (dispose) {
                pdf.save('stats.pdf');
            }, margins);

        })
        .catch(function (error) {
            console.log(error)
        })
    }
}

Component.define('x-stats-table', XStatsTable, {
    scripts: ['https://cdnjs.cloudflare.com/ajax/libs/jspdf/1.2.61/jspdf.min.js']
})