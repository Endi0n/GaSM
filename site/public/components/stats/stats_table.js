import Component from '/scripts/bee/Component.js'

class XStatsTable extends Component {
    firstId = null
    lastId = null
    startDate = null
    endDate = null

    updateTable(start, end, lastId, order, newPage) {
        this.startDate = start
        this.endDate = end
        let thisReference = this

        axios.get(`/api/dumpsters/stats/list?dateStart=${start.unix()}&dateEnd=${end.unix()}&lastId=${lastId || 0}&order=${order}`)
        .then(function (response) {
            let table = '<table>\
                            <tr>\
                                <th>Id pubela</th>\
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
        this.updateTable(moment().subtract(29, 'days'), moment(), 0, 'asc')
    }

    next() {
        this.updateTable(this.startDate, this.endDate, this.lastId, 'asc', true)
    }

    back() {
        this.updateTable(this.startDate, this.endDate, this.firstId, 'desc', true)
    }
}

Component.define('x-stats-table', XStatsTable, {})
