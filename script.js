// Starter cities
var cities = ["Seattle", "Chicago", "Miami"];


  // currentWeather function displays the current weather conditions for the city that was clicked
  function displayCurrentWeather(prevCity) {
  
    $("#currentWeather").empty();

    var cityName = prevCity || $("#cityInput").val().trim();
    var queryURL = "http://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&units=imperial&appid=1c8da99a33ddaf628d6ec8b6277d71b0";

    // AJAX call for the weather for the specific city button that was clicked
    $.ajax({
      url: queryURL,
      method: "GET"
    }).then(function(response) {
      console.log(response);

      var lon = response.coord.lon;
      var lat = response.coord.lat;
      
      var iconCode = response.weather[0].icon;
      var iconUrl = "https://openweathermap.org/img/wn/" + iconCode + ".png";
      var realIcon = $("<div>").append($("<img>").attr("src", iconUrl).attr("class", "card-img-sm"));
      
      // var futureImg = $("<img>").attr("class", "card-img-top").attr("src", "https://openweathermap.org/img/wn/" + fiveDay.list[i].weather[0].icon + "@2x.png");

      var header = $("<div>").html($("<h3>").text(response.name + " (" + (moment().format("M" + "/" + "D" + "/" + "YYYY")) + ") "));
      $("#currentWeather").append(header);
      $("#currentWeather").append(realIcon);

      var tempEl = $("<p>").text("Temperature: " + response.main.temp + "\xB0" + "F");
      $("#currentWeather").append(tempEl);

      var humidityEl = $("<p>").text("Humidity: " + response.main.humidity + "%");
      $("#currentWeather").append(humidityEl);

      var windEl = $("<p>").text("Wind Speed: " + response.wind.speed + " MPH");
      $("#currentWeather").append(windEl);

      // AJAX call for UV Index
      var uvURL = "https://api.openweathermap.org/data/2.5/uvi?appid=1c8da99a33ddaf628d6ec8b6277d71b0&lat=" + lat + "&lon=" + lon;

      $.ajax({
        url: uvURL,
        method: "GET"
      }).then(function(uvInfo) {
        console.log(uvInfo);

        var uvIndex = uvInfo.value;
        console.log(uvIndex);
        var uvColor;

        //conditionals for UV Index colors
        if (uvIndex <= 4) {
          uvColor = "green";
        } 
        else if (uvIndex > 4 && uvIndex < 7) {
          uvColor = "yellow";
        }
        else if (uvIndex >= 7 && uvIndex < 9) {
          uvColor = "orange";
        }
        else {
          uvColor = "red";
        }
        // Adds the UV line to the rest of the currentWeather div
        var uvDiv = $("<p>").text("UV Index: ");
        uvDiv.append($("<span>").attr("style", ("background-color:" + uvColor)).text(uvIndex));
        $("#currentWeather").append($(uvDiv));
       
      }); 
    });
  }

  // displayFiveDay function displays the five day forecast for the city that was clicked
  function displayFiveDay(prevCity) {
    $("#future").empty();

    var cityName = prevCity || $("#cityInput").val().trim();
    // AJAX call for the five-day forecast
    var fiveQuery = "https://api.openweathermap.org/data/2.5/forecast?q=" + cityName + "&appid=1c8da99a33ddaf628d6ec8b6277d71b0&units=imperial";

    $.ajax({
      url: fiveQuery,
      method: "GET"
    }).then(function(fiveDay) {
      console.log(fiveDay);
      
    //Adds five-day forecast cards to a div
    var futureDiv = $("#future").attr("class", "futureDiv");
    
      for (i = 0; i < fiveDay.list.length; i++) {
        if (fiveDay.list[i].dt_txt.indexOf("12:00:00") !==-1) {
          var addCol = $("<div>").attr("class", "littleCard");
          futureDiv.append(addCol);

          var futureCard = $("<div>").attr("class", "futureCard");
          addCol.append(futureCard);

          var cardTitle = $("<div>").text(moment(fiveDay.list[i].dt, "X").format("M" + "/" + "D" + "/" + "YYYY"));
          futureCard.append(cardTitle);

          var futureImg = $("<img>").attr("class", "card-img-sm").attr("src", "https://openweathermap.org/img/wn/" + fiveDay.list[i].weather[0].icon + "@2x.png");
          futureCard.append(futureImg);

          var futureTemp = $("<p>").text("Temperature: " + fiveDay.list[i].main.temp + "\xB0" + "F");
          futureCard.append(futureTemp);

          var futureHumidity = $("<p>").text("Humidity: " + fiveDay.list[i].main.humidity + "%");
          futureCard.append(futureHumidity);
        }
      }
    });
  }

  init();
  // Function for displaying cities
  function renderCities() {

    // Deleting the city buttons prior to adding new city buttons
    $("#buttons-view").empty();

    // Looping through the array of cities and dynamically generating buttons for each city in the array
    for (var i = 0; i < cities.length; i++) {
      var button = $("<button>");
      button.addClass("city");
      button.attr("data-name", cities[i]); 
      button.text(cities[i]);
      $("#buttons-view").addClass("btn-group-vertical");
      $("#buttons-view").append(button);
      }
    }

    // Retrieves button list from local storage
    function init() {
    var storedCities = JSON.parse(localStorage.getItem("cities"));
      if (storedCities !== null) {
        cities = storedCities;
      }
      renderCities();
    }

    //Sets button list into local storage
    function storeCities() {
      localStorage.setItem("cities", JSON.stringify(cities));
    }

      // Event listener for the search button
    $("#button-addon2").on("click", function(event) {
      event.preventDefault();
      // This line gets text from the input box
      var cityName = $("#cityInput").val().trim();
      // This will add the user's input into the array of cities
      cities.push(cityName);

      storeCities();
      renderCities();
      displayCurrentWeather();
      displayFiveDay();
    });

    // Event listener for the city buttons
    $("#buttons-view").on("click", "button", function(event) {
      var buttonCity = $(this).data("name");
      event.preventDefault();
      storeCities(buttonCity);
      displayCurrentWeather(buttonCity);
      displayFiveDay(buttonCity);
    });

      renderCities();
     