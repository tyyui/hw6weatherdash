$(document).ready(function(){
    //current date
    var today = moment();
    $('.todayDate').text(today.format("dddd, MMM Do YYYY"));

    //+5 dates
    var j=1;
    for (j=1; j<6; j++){
        var future = moment().add(j, 'd')
        var section = $(document).find('[data-index='+j+']');
        section.find('.date').text(future.format('MMM Do'));
    };

    //defailt unit
    var city = 'Austin';
    var units = 'imperial';
    var unitSym = '°F';
    var windSym = 'MPH';
    var searched = [];
    var list = 0;
    weather();
    
    //units
    $('.unitBtn').on('click', function() {
      if ($('.unitBtn').text().toLowerCase() === "imperial") {
        units = 'metric';
        $('.unitBtn').text('Metric');
        unitSym = '°C'
        windSym = 'm/s²'
        weather();
      }
      else {
        units = 'imperial';
        unitSym = '°F';
        windSym = 'MPH';
        $('.unitBtn').text('Imperial');
        weather();
      }
    });

    //search city
    $('.searchBtn').on('click', function(){
        if (searchCity !== ""){
            city = $('#citySearch').val();
            var searchCity = $('#citySearch').val();
            searchCity = searchCity.trim().toLowerCase();
            searched.push(searchCity);
            localStorage.setItem("searched", JSON.stringify(searched)); 
            $('#citySearch').val('');
            weather();
        };
        //list cannot be longer than 8
        var max = 8;
        $('ul').each(function(){
            $(this).find('li').each(function(index){
            if(index >= max) $(this).remove
            });
        });
    });
    
    //searched city return
    $(document).on('click', '.stretched-link', function(){
        city = $(this).attr('id');
        weather();
    });

    //delete searched cities
    $(document).on('click', '#clear', function(){
        window.localStorage.removeItem("searched");
        window.location.reload();
        searched = [];
        $(".searchedList").empty();
    });
        
        //retrieve stored user inputs from local storage and populate
        function renderWeather() {
            $(".searchedList").empty();
            $('.searchedList').append('<li class="list-group-item" id="clear"><a href="#" class="stretched-link">Clear History</a><i class="far fa-trash-alt trashBtn"></i></li>');

            let searched = JSON.parse(localStorage.getItem("searched"));
                if (searched === null) {
                    searched = [];
                };
                if (searched.length !== null) {
                    for (var i = 0; i < searched.length; i++){
                        $('.searchedList').prepend('<li class="list-group-item"><a href="#" class="stretched-link" index="'+i+'"id="'+searched[i]+'">'+searched[i]+'</a></li>');
                    }
                };
        };

    //default
    function weather() {
        renderWeather();
        //delcare city
        $('.currentCity').text(city)
    
        var queryURL = "https://api.openweathermap.org/data/2.5/forecast?q=" + city + "&cnt=7&APPID=&units=" + units;

        $.ajax({
            url: queryURL,
            method: "GET"
        }).then(function(response) {

            var start = 0;

            //for loop to show 6 days worth of weather
            for (start=0; start<6; start++) {
                var section = $(document).find('[data-index='+start+']');
                section.find('.temp').text(response.list[start].main.temp + unitSym);
                section.find('.humid').text(response.list[start].main.humidity + '%');
                    
                var iconcode = response.list[start].weather[0].icon;
                var iconurl = "https://openweathermap.org/img/w/" + iconcode + ".png";

                section.find('.icon').attr("src",iconurl);
            };

            //feels like, wind, UV index for only main card (jumbotron)
            $('#feel').text(response.list[0].main.feels_like + unitSym);
            $('#wind').text(response.list[0].wind.speed + windSym);
            //UV index
            var cityLat = response.city.coord.lat;
            var cityLon = response.city.coord.lon;
            var queryURL = "https://api.openweathermap.org/data/2.5/uvi?lat=" + cityLat + "&lon=" + cityLon + "&APPID=2864aec1e6fe0dd5f0a41878fb56f375&units=" + units;
            $.ajax({
                url: queryURL,
                method: "GET"
            }).then(function(response) {
                var uvI = response.value
                $('#uv').text(uvI);
    
                if (uvI<=1.99){
                    $('#uv').addClass('badge-primary')
                }
                else if (uvI>2 && uvI<=5.99){
                    $('#uv').addClass('badge-success')
                }
                else if (uvI>5.99 && uvI<=7.99){
                    $('#uv').addClass('badge-warning')
                }
                else if (uvI>7.99 && uvI<=10.99){
                    $('#uv').addClass('badge-danger')
                }
                else if (uvI>10.99 && uvI<=11.99){
                    $('#uv').addClass('badge-dark')
                }
            });

        })
    };
});