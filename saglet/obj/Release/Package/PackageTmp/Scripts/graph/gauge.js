google.load("visualization", "1", { packages: ["gauge"] });

room.initDrawRoomGauges = function() {
    this.initAtmosphereGauge();
    this.initStrGauge();
}


room.initAtmosphereGauge = function() {
    var data = google.visualization.arrayToDataTable([
        ['Label', 'Value'],
        ['Atmosphere', 50]
    ]);    

    var atmOptions = {
        width: 400, height: 120,
        greenFrom: 60, greenTo: 100,
        yellowFrom: 40, yellowTo: 60,
        redFrom: 0, redTo: 40,
        minorTicks: 5
    };

    var chart = new google.visualization.Gauge(document.getElementById('gauge-atmosphere'));
    chart.draw(data, atmOptions);

    room.updateAtmosphere = function(value) {
        data.setValue(0, 1, value.toFixed(2));
        chart.draw(data, atmOptions);
    }
}


room.initStrGauge = function() {
    var data = google.visualization.arrayToDataTable([
        ['Label', 'Value'],
        ['STR', 1.5],
    ]);

    var StrOptions = {
        width: 400, height: 120,
        greenFrom: 2, greenTo: 3,
        yellowFrom: 1, yellowTo: 2,
        redFrom: 0, redTo: 1,
        minorTicks: 1,
        min: 0,
        max: 3
    };

    var chart = new google.visualization.Gauge(document.getElementById('gauge-str'));
    chart.draw(data, StrOptions);

    room.updateStr = function(value) {
        data.setValue(0, 1, value.toFixed(2));
        chart.draw(data, StrOptions);
    }
}