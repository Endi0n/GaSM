am4core.ready(function() {
            
    // Themes begin
    am4core.useTheme(am4themes_frozen);
    am4core.useTheme(am4themes_animated);
    // Themes end
    
    var chart = am4core.create("statistica_sortare", am4charts.PieChart);
    chart.hiddenState.properties.opacity = 0; // this creates initial fade-in
    
    chart.data = [
      {
        waste: "Hartie",
        value: 300
      },
      {
        waste: "Sticla",
        value: 200
      },
      {
        waste: "Plastic",
        value: 600
      },
      {
        waste: "Metal",
        value: 150
      },
      {
        waste: "Menajer",
        value: 900
      }
    ];
    chart.radius = am4core.percent(70);
    chart.innerRadius = am4core.percent(40);
    chart.startAngle = 180;
    chart.endAngle = 360;  
    
    var series = chart.series.push(new am4charts.PieSeries());
    series.dataFields.value = "value";
    series.dataFields.category = "waste";
    
    series.slices.template.cornerRadius = 10;
    series.slices.template.innerCornerRadius = 7;
    series.slices.template.inert = true;
    series.alignLabels = false;
    series.hiddenState.properties.startAngle = 90;
    series.hiddenState.properties.endAngle = 90;
    
    chart.legend = new am4charts.Legend();
    
    }); // end am4core.ready()


function pictorial_chart(data, id) {
    am4core.ready(function() {
    
    // Themes begin
    am4core.useTheme(am4themes_frozen);
    am4core.useTheme(am4themes_animated);
    // Themes end
    
    var iconPath = "M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z";
    
    var chart = am4core.create(id, am4charts.SlicedChart);
    chart.hiddenState.properties.opacity = 0; // this makes initial fade in effect
    chart.paddingLeft = 150;
    
    chart.data = data;
    
    var series = chart.series.push(new am4charts.PictorialStackedSeries());
    series.dataFields.value = "valoare";
    series.dataFields.category = "cartier";
    series.alignLabels = true;
    // this makes only A label to be visible
    series.labels.template.propertyFields.disabled = "disabled";
    series.ticks.template.propertyFields.disabled = "disabled";
    
    
    series.maskSprite.path = iconPath;
    series.ticks.template.locationX = 1;
    series.ticks.template.locationY = 0;
    
    series.labelsContainer.width = 100;
    
    chart.legend = new am4charts.Legend();
    chart.legend.position = "top";
    chart.legend.paddingRight = 160;
    chart.legend.paddingBottom = 40;
    let marker = chart.legend.markers.template.children.getIndex(0);
    chart.legend.markers.template.width = 40;
    chart.legend.markers.template.height = 40;
    marker.cornerRadius(20,20,20,20);
    
    }); // end am4core.ready()
}

pictorial_chart([{
                    "cartier": "Restul cartierelor",
                    "valoare": 40,
                    "disabled":true
                }, {
                    "cartier": "Frumoasa",
                    "valoare": 60
                }, {
                    "cartier": "Pacurari",
                    "valoare": 30
                }]
                , "statistica_top_hartie");
pictorial_chart([{
                    "cartier": "Restul cartierelor",
                    "valoare": 40,
                    "disabled":true
                }, {
                    "cartier": "Dacia",
                    "valoare": 40
                },
                {
                    "cartier": "Frumoasa",
                    "valoare": 50
                }]
                , "statistica_top_metal");
pictorial_chart([{
                    "cartier": "Restul cartierelor",
                    "valoare": 40,
                    "disabled":true
                }, {
                    "cartier": "Alexandru",
                    "valoare": 40
                },
                {
                    "cartier": "Tatarasi",
                    "valoare": 50
                }]
                , "statistica_top_sticla");
pictorial_chart([{
                    "cartier": "Restul cartierelor",
                    "valoare": 20,
                    "disabled":true
                }, {
                    "cartier": "Dacia",
                    "valoare": 70
                },
                {
                    "cartier": "Nicolina",
                    "valoare": 50
                }]
                , "statistica_top_plastic");
pictorial_chart([{
                    "cartier": "Restul cartierelor",
                    "valoare": 320,
                    "disabled":true
                }, {
                    "cartier": "Tatarasi",
                    "valoare": 170
                },
                {
                    "cartier": "Pacurari",
                    "valoare": 150
                }]
                , "statistica_top_menajer");