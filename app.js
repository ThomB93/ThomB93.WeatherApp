'use strict'
var mapAPIKey = "AIzaSyBShQ1qVW7tMnQSLS2C-8OD1Af6L8ftSL8";
var apixuAPIKey = "97c43ff411204dab94e85856171608";
var displayCelcius = true;
var latlon; //contains coords for current position

function toggleTemp() { //toggles between fahrenheit and celcius
    displayCelcius = !displayCelcius;

    if(displayCelcius) {
        $("#toggleTempBtn").text("Fahrenheit");
    } else {
        $("#toggleTempBtn").text("Celcius");
    }
    showTemp();
}

function showTemp() { //gets current temperature from API based on current location
    $.ajax({
        url: "https://api.apixu.com/v1/current.json?key=" + apixuAPIKey + "&q=" + latlon,
        method: "GET"
    }).then(function (data) {
        var weatherText = data.current.condition.text;
        var weatherIconUrl = data.current.condition.icon;
        var fomattedWeatherIconUrl = "https://" + weatherIconUrl.substr(2, weatherIconUrl.length); //formats image from API
        console.log(weatherIconUrl);
        $("#temp_img").attr("src", fomattedWeatherIconUrl);
        if (displayCelcius) {
            $("#temp").html("The weather is " + weatherText + " and the current temperature is: " + data.current.temp_c + "°C");
        } else {
            $("#temp").html("The weather is " + weatherText + " and the current temperature is: " + data.current.temp_f + "° Fahrenheit");
        }
    });
}

var x = document.getElementById("location");
$(document).ready(function () {
    if (navigator.geolocation) { //if user accepts geolocation prompt
        navigator.geolocation.getCurrentPosition(showPosition); //display location
    } else {
        x.innerHTML = "Geolocation is not supported by this browser.";
    }
    function showPosition(position) {
        latlon = position.coords.latitude + "," + position.coords.longitude; //contains the user's coords
        $(function () {
            var iframe = $('<iframe />', { //Creates an iframe tag with defined attributes
                src: "https://www.google.com/maps/embed/v1/place?q=" + latlon + "&key=" + mapAPIKey,
                width: 200,
                height: 150,
                allowfullscren: true,
                frameborder: 0
            });
            $('#mapholder').html(iframe);

            $.ajax({ //GET request for use reverse geolation to get formatted address from coords
                url: "https://maps.googleapis.com/maps/api/geocode/json?latlng=" + latlon + "&key=" + mapAPIKey,
                method: 'GET'
            }).then(function (data) {
                console.log(data);
                $("#location").html(data.results[0].formatted_address);
                showTemp();
            });
        });
    }
});


