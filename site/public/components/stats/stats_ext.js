function setTopStickyDateRangePicker() {
    let height  = $('x-menu').outerHeight()
    $("#meniu_secundar").css('top', height)
}

setTopStickyDateRangePicker();

$(window).scroll(function(){
    if ($( ".daterangepicker" ).css('display') !== 'none') 
        $(".cancelBtn").click()
});

function semiDoughnutChart(id, labels, data) {
    var ctx = document.getElementById(id).getContext('2d');
    return new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: labels,
            datasets: [{
                label: '# of Votes',
                data: data,
                backgroundColor: [
                    'rgb(199, 134, 253)',
                    'rgb(178, 86, 254)',
                    'rgb(154, 33, 254)',
                    'rgb(104, 0, 190)',
                    'rgb(75, 25, 116)'

                ],
                borderColor: [
                    'rgb(199, 134, 253)',
                    'rgb(178, 86, 254)',
                    'rgb(154, 33, 254)',
                    'rgb(104, 0, 190)',
                    'rgb(75, 25, 116)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true
                    }
                }]
            },
            circumference: Math.PI,
            rotation: -Math.PI
        }
    })
}



function barChart(id, name, labels, data)
{
    var ctx = document.getElementById(id).getContext('2d');
    return new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Kg ' + name,
                data: data,
                backgroundColor: [
                    'rgb(173, 123, 255)',
                    'rgb(173, 123, 255)',
                    'rgb(173, 123, 255)'
                ],
                borderColor: [
                    'rgb(173, 123, 255)',
                    'rgb(173, 123, 255)',
                    'rgb(173, 123, 255)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true
                    }
                }]
            }
        }
    });
}
function newStats(){
    let doughnutChart = semiDoughnutChart('statistica_sortare', ['Hartie', 'Sticla', 'Plastic', 'Metal', 'Menajer'], []);
    let barChartHartie = barChart('statistica_top_hartie', 'hartie', ['Frumoasa', 'Pacurari', 'Restul cartierelor'], [60, 30, 40]);
    let barChartSetal = barChart('statistica_top_metal', 'metal', ['Dacia', 'Frumoasa', 'Restul cartierelor'], [40, 50, 40]);
    let barChartSticla = barChart('statistica_top_sticla', 'sticla', ['Alexandru', 'Tatarasi', 'Restul cartierelor'], [40, 50, 40]);
    let barChartPlastic = barChart('statistica_top_plastic', 'plastic', ['Dacia', 'Nicolina', 'Restul cartierelor'], [70, 50, 20]);
    let barChartMenajer = barChart('statistica_top_menajer','gunoi menajer', ['Tatarasi', 'Pacurari', 'Restul cartierelor'], [170, 150, 320]);

    function newRange(start, end) {
        axios.get(`/api/dumpsters/stats?dateStart=${start.unix()*1000}&dateEnd=${end.unix()*1000}`)
        .then(function (response) {
            doughnutChart.data.datasets[0].data = [response.data['hârtie'] || 0, response.data['sticlă'] || 0,
                                                   response.data['plastic'] || 0, response.data['metal'] || 0,
                                                   response.data['menajer'] || 0]
                                            
            doughnutChart.update()
        })
        .catch(function (error) {
            console.log(error);
        })
    }

    newRange(moment().subtract(29, 'days'), moment())

    $('input[name="daterange"]').daterangepicker({
        opens: 'center',
        locale: {
            "format": "DD/MM/YYYY",
            "separator": " - ",
            "applyLabel": "Ok",
            "cancelLabel": "Cancel",
            "fromLabel": "From",
            "toLabel": "To",
            "customRangeLabel": "Custom",
            "weekLabel": "W",
            "daysOfWeek": [
                "Du",
                "Lu",
                "Ma",
                "Mi",
                "Jo",
                "Vi",
                "Sa"
            ],
            "monthNames": [
                "Ianuarie",
                "Februarie",
                "Martie",
                "Aprilie",
                "Mai",
                "Iunie",
                "Iulie",
                "August",
                "Septembrie",
                "Octombrie",
                "Noiembrie",
                "Decembrie"
            ],
            "firstDay": 1
        },
        ranges: {
            'Azi': [moment(), moment()],
            'Ieri': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
            'Ultimele 7 zile': [moment().subtract(6, 'days'), moment()],
            'Ultimele 30 zile': [moment().subtract(29, 'days'), moment()],
            'Luna aceasta': [moment().startOf('month'), moment().endOf('month')],
            'Luna trecuta': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
            },
        startDate: moment().subtract(29, 'days').format('DD/MM/YYYY'),
        endDate: moment().format('DD/MM/YYYY')
        },
        newRange
        
    );
}

newStats()