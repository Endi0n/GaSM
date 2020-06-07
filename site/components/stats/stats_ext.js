function setTopStickyDateRangePicker() {
    let height  = $('x-menu').outerHeight()
    $("#meniu_secundar").css('top', height)
}

setTopStickyDateRangePicker();

$(window).scroll(function(){
    if ($( ".daterangepicker" ).css('display') !== 'none') 
        $(".cancelBtn").click()
});

function semi_doughnut_chart(id, labels, data) {
    var ctx = document.getElementById(id).getContext('2d');
    var myChart = new Chart(ctx, {
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
    });
}



function bar_chart(id, name, labels, data)
{
    var ctx = document.getElementById(id).getContext('2d');
    var myChart = new Chart(ctx, {
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

semi_doughnut_chart('statistica_sortare', ['Hartie', 'Sticla', 'Plastic', 'Metal', 'Menajer'], [300, 200, 600, 150, 900]);
bar_chart('statistica_top_hartie', 'hartie', ['Frumoasa', 'Pacurari', 'Restul cartierelor'], [60, 30, 40]);
bar_chart('statistica_top_metal', 'metal', ['Dacia', 'Frumoasa', 'Restul cartierelor'], [40, 50, 40]);
bar_chart('statistica_top_sticla', 'sticla', ['Alexandru', 'Tatarasi', 'Restul cartierelor'], [40, 50, 40]);
bar_chart('statistica_top_plastic', 'plastic', ['Dacia', 'Nicolina', 'Restul cartierelor'], [70, 50, 20]);
bar_chart('statistica_top_menajer','gunoi menajer', ['Tatarasi', 'Pacurari', 'Restul cartierelor'], [170, 150, 320]);



$('input[name="daterange"]').daterangepicker({
    opens: 'center',
    "locale": {
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
    "startDate": "28/04/2020",
    "endDate": "04/05/2020"
    },
    
    function(start, end, label) {
        console.log('New date range selected: ' + start.format('YYYY-MM-DD') + ' to ' + end.format('YYYY-MM-DD') + ' (predefined range: ' + label + ')');
    }
);
