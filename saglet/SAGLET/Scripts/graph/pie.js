google.load("visualization", "1", { packages: ["corechart"] });

room.drawPieChart = function (displayDiv, rawData, graphTitle) {

    var data = google.visualization.arrayToDataTable(rawData);

    var options = {
        title: graphTitle,
        titleTextStyle: {
            fontSize: 16,
            bold: true,
        },
        legend: 'none',
        chartArea: {
            left: '15%',
            top: 25,
            bottom: 10,
            width: 200,
            height: 200,
        },
        pieHole: 0.4,
        colors: room.colors
    };

    var chart = new google.visualization.PieChart(document.getElementById(displayDiv));

    chart.draw(data, options);
}