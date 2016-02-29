var browsergeoinfo = document.getElementById("latlong");
var position_lat;
var position_long;
var map;
var marker;
var infowindow;

function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.watchPosition(setPosition);
    } else {
        browsergeoinfo.innerHTML = "Geolocation is not supported by " + navigator.userAgent;
    }
}

function setPosition(position) {
    position_lat = position.coords.latitude;
    position_long = position.coords.longitude;
    marker = new google.maps.Marker({
        map: map,
        optimized: false,
        position: {
            lat: position_lat,
            lng: position_long
        }
    });
    getServerData(position_lat, position_long);
}

function loadmap() {
    var opts;

    getLocation();
    infowindow = new google.maps.InfoWindow();

    if (position_lat != null && position_long != null) {
        opts = {
            'center': new google.maps.LatLng(position_lat, position_long),
            'zoom': 4,
            'mapTypeId': google.maps.MapTypeId.ROADMAP
        }

    } else {
        opts = {
            'center': new google.maps.LatLng(23.026325, 72.5621783),
            'zoom': 4,
            'mapTypeId': google.maps.MapTypeId.ROADMAP
        }
    }

    map = new google.maps.Map(document.getElementById('mapdiv'), opts);


    google.maps.event.addListener(map, 'click', function(event) {


        google.maps.event.addListener(infowindow, 'closeclick', function() {
            if (marker != null) {
                marker.setMap(null);
                marker.setVisible(false);
                marker = null;
            }
        });

        if (marker != undefined) {
            marker.setMap(null);
            marker.setVisible(false);
            marker = null;
        }

        marker = new google.maps.Marker({
            map: map,
            optimized: false,
            position: {
                lat: event.latLng.lat(),
                lng: event.latLng.lng()
            }
        });

        getServerData(event.latLng.lat(), event.latLng.lng());

    })

    google.maps.event.addListener(map, 'mousemove', function(event) {
        document.getElementById('latspan').innerHTML = parseFloat(event.latLng.lat()).toFixed(5);
        document.getElementById('lngspan').innerHTML = parseFloat(event.latLng.lng()).toFixed(5);
    });

    if (position_lat == undefined || position_long == undefined) {
        position_lat = 0;
        position_long = 0;
    }

}

function getServerData(latitude, longitude) {
    var xhttp_owm = new XMLHttpRequest()
    xhttp_owm.open("GET", "http://api.openweathermap.org/data/2.5/weather?lat=" + latitude + "&lon=" + longitude + "&appid=44db6a862fba0b067b1930da0d769e98&units=metric");
    xhttp_owm.send();
    var xhttp_geonames = new XMLHttpRequest()
    xhttp_owm.onreadystatechange = function() {
        if (this.readyState === XMLHttpRequest.DONE) {
            if (this.status === 200/*HTTP OK*/ && xhttp_owm.readyState == XMLHttpRequest.DONE) {
                success = true;
                var response = JSON.parse(xhttp_owm.responseText);
                xhttp_geonames.open("GET", "http://api.geonames.org/timezoneJSON?lat=" + latitude + "&lng=" + longitude + "&username=techup")
                xhttp_geonames.send();
                xhttp_geonames.onreadystatechange = function() {
                    if (xhttp_geonames.status === 200 /*HTTP OK*/ && xhttp_geonames.readyState === XMLHttpRequest.DONE) {
                        var response_geonames = JSON.parse(xhttp_geonames.responseText);

                        var style = "<div class=\"infowindowclass\">"

                        var place = "Place Name = " + response.name + "<br>"
                        var country;
                        if (response_geonames.countryName != undefined) {
                            country = "Country Name = " + response_geonames.countryName;
                        } else {
                            country = "Country Code = " + response.sys.country;
                        }
                        country = country + "<br>"
                        var gmtoffset = "GMT Offset = " + response_geonames.gmtOffset + " hrs <br>";
                        var datapointlocaltime = "Datapoint Time (DD-MM-YYYY hr:min) = " + moment.utc(response.dt * 1000).utcOffset(response_geonames.gmtOffset).format('DD-MM-YYYY HH:mm') + "<br>"
                        var lat = "Latitude: " + parseFloat(latitude).toFixed(5) + "<br>"
                        var long = "Longitude: " + parseFloat(longitude).toFixed(5) + "<br>"
                        var currentlocaltime = "Current Local Time (DD-MM-YYYY hr:min) = " + response_geonames.time + "<br>"
                        var sunriseutc = "Sunrise (hr:min) = " + moment.utc(response.sys.sunrise * 1000).utcOffset(response_geonames.gmtOffset).format('HH:mm') + "<br>";
                        var sunsetutc = "Sunset (hr:min) = " + moment.utc(response.sys.sunset * 1000).utcOffset(response_geonames.gmtOffset).format('HH:mm') + "<br>";
                        var temperature = "Current Temperature = " + response.main.temp + " &#8451" + "<br>";
                        var pressure = "Pressure = " + response.main.pressure + " hPa" + "<br>";
                        var humidity = "Humidity = " + response.main.humidity + "%" + "<br>";
                        var windspeed = "Windspeed (m/s) = " + response.wind.speed + " m/s" + "<br>"
                        var winddirection = "Wind Direction (deg) = " + response.wind.deg + " degree" + "<br>"
                        var weatherdesc = "Weather Desc1 = " + response.weather[0].main + ", " + response.weather[0].description + " <br>"
                        var weatherdesc2 = "Weather = " + capitalize(response.weather[0].description) + " <br>"
                        var weathericon = "<img style=\"margin-left:10%\" height=50px; width=50px  src=\"http://openweathermap.org/img/w/" + response.weather[0].icon + ".png\">" + "<br>"

                        var content = style + place + country + lat + long + "<hr>" + currentlocaltime + gmtoffset + datapointlocaltime +
                            sunriseutc + sunsetutc + "<hr>" + temperature + weatherdesc2 + weathericon + pressure + humidity + windspeed +
                            winddirection + "<br>Detailed View</div>";
                        var content_short = style + place + country + temperature + weatherdesc2 + weathericon + "<br>Short View</div>";

                        if (document.documentElement.clientWidth > 1000) {
                            infowindow.setContent(content);
                        } else {
                            infowindow.setContent(content_short);
                        }

                        infowindow.open(map, marker);
                    }
                }
            }
        }
    };

}

function capitalize(s) {
    return s[0].toUpperCase() + s.substr(1);
}

window.onload = loadmap
