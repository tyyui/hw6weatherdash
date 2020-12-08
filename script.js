$("#clear").click( function () { // clear btn clears the storage and deletes li's
    localStorage.clear();
    $(".city-list").empty();
})
let cityArray = [];

function savecitytolist(cityInput) {
    cityArray.push(cityInput);
    localStorage.setItem('cityKey', JSON.stringify(cityArray));
    $(".city-list").prepend( $("<a>").addClass("list-group-item list-group-item-action").text(cityInput))
}

//Ajax part
const APIkey = "78244aeb7fca6683e6a91e3953c941ac";
$("#submit").click(function(event){
    event.preventDefault();
    var cityInput = $("#cityInput").val();
    if (cityInput==""){
        return
    } else {
        savecitytolist(cityInput);
        var Lon = "";
        var Lat = "";
        var queryURL = `https://api.openweathermap.org/data/2.5/weather?q=${cityInput}&units=metric&appid=${APIkey}`;
        $("#cityInput").val("");
        $.ajax({
            url: queryURL,
            method: "GET"
        }).then(function(response) {
            console.log("Current Weather:");
            console.log(response);

            var dateObject = new Date(response.dt*1000);
            var yearDate =  dateObject.toLocaleString("en-US", {year: "numeric"});
            var monthDate =  dateObject.toLocaleString("en-US", {month: "numeric"});
            var dayDate =  dateObject.toLocaleString("en-US", {day: "numeric"});

            $("#cityName").text(response.name);
            $("#date").text(` ${monthDate}/${dayDate}/${yearDate}`);
            $("#weatherIcon").attr("src",`http://openweathermap.org/img/wn/${response.weather[0].icon}@2x.png`);
            $("#temp").text(response.main.temp+" C");
            $("#hum").text(response.main.humidity+"%");
            $("#windSpeed").text(response.wind.speed+" m/s");
            Lon = response.coord.lon;
            console.log("lon: "+Lon);
            Lat = response.coord.lat;
            console.log("lat: "+Lat);

            //api for uv
            var UVIqueryURL =`https://api.openweathermap.org/data/2.5/uvi?lat=${Lat}&lon=${Lon}&appid=${APIkey}`;
            console.log(UVIqueryURL);
            $.ajax({
                url: UVIqueryURL,
                method: "GET"
            }).then(function(UVIresponse) {
                console.log(UVIresponse);
                $("#UVindex").text(UVIresponse.value);
                var color = "";
                if (UVIresponse.value <= 3.0) {color="green";}
                else if (UVIresponse.value < 6.0) {color="yellow";}
                else if (UVIresponse.value >= 6.0) {color="red";}
                $("#UVindex").css("background-color", color);
            });
        });
        // 5 Day forecast api call
        var forecastURL = `https://api.openweathermap.org/data/2.5/forecast?q=${cityInput}&units=metric&appid=${APIkey}`;
        $.ajax({
            url: forecastURL,
            method: "GET"
        }).then(function(response) {
            console.log("5 day fc:");
            console.log(response);
            $(".forecast-boxes").empty();
            for (i=4; i<40; i+=8 ){
                var datetext = response.list[i].dt_txt 
                var date = datetext.slice(0,-9) 
                
                $(".forecast-boxes").append($("<div>").addClass("box"+i));
                $(".box"+i).append($("<h4>").addClass("fc-date").text(date));   
                $(".box"+i).append($("<img>").attr("src",`http://openweathermap.org/img/wn/${response.list[i].weather[0].icon}@2x.png`));
                $(".box"+i).append($("<p>").addClass("fc-temp").text("Temp: "+response.list[i].main.temp+" C"));   
                $(".box"+i).append($("<p>").addClass("fc-hum").text("Humidity: "+response.list[i].main.humidity+"%"));
            }   
        })
    }
});

