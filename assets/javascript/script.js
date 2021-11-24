let requestURL = "http://api.openweathermap.org/data/2.5/weather?appid=f310e487a963435a12a4d57a94cd2dff"; //root
let weatherData;
const SEARCHHISTORYKEY = "NR-WDBSearchHistoryData";
let searchHistoryIndex = 0;
DisplaySearchHistory();

$("#Search-Form").on("submit", event=>{
    event.preventDefault();
    FetchLocation($("#Search-Bar").val());
    UpdateSearchHistory($("#Search-Bar").val());
});

$("#Search-History").on("submit", event=>{
    if (event.target.tagName === "BUTTON"){
        FetchLocation(event.target.textContent);
    }
})

function FetchLocation(p_cityName){
    requestURL += "&q=" + p_cityName;
    fetch(requestURL)
    .then(function(response){
        return response.json();
    })
    .then(function(data){
        requestURL = "https://api.openweathermap.org/data/2.5/onecall?exclude=current,minutely,hourly,alerts&appid=f310e487a963435a12a4d57a94cd2dff&units=imperial";
        requestURL += ("&lat=" + data.coord.lat) + ("&lon=" + data.coord.lon);
        fetch(requestURL)
        .then(function(response){
            return response.json();
        })
        .then(function(data){
            weatherData = data;
            DisplayWeatherData();
        });
    });
}

function DisplayWeatherData(){
    if (!weatherData){ console.log("Weather Data Not found"); return; }
    if (!weatherData.daily){ console.log("No weather data returned"); return; }
    //Find and display today's data
    DisplayTodaysData(weatherData.daily[0]);
    for (let i = 1; i < 6; i++){
        DisplayFiveDayData(weatherData.daily[i], i);
    }
}

function DisplayTodaysData(p_weatherData){
    let _todaysDisplay = $("#Todays-Display");
    _todaysDisplay.children("h1").children("time").text(moment.unix(p_weatherData.dt).format('MM-DD-YYYY'));
    _todaysDisplay.children("h1").children("figure").children("img").attr("src", "https://openweathermap.org/img/wn/" + p_weatherData.weather[0].icon + ".png");
    _todaysDisplay.children("p").eq(0).children("span").text(p_weatherData.temp.max);
    _todaysDisplay.children("p").eq(1).children("span").text(p_weatherData.wind_speed);
    _todaysDisplay.children("p").eq(2).children("span").text(p_weatherData.humidity);
    _todaysDisplay.children("p").eq(3).children("mark").text(p_weatherData.uvi);
    //_todaysDisplay.children("p").eq(3).children("mark").attr("class", GetUVColor(p_weatherData.uvi));
}

function DisplayFiveDayData(p_weatherData, p_index){
    let _todaysDisplay = $("#5-Day-Forecast").children("#Day-"+p_index);
    _todaysDisplay.children("time").text(moment.unix(p_weatherData.dt).format('MM-DD-YYYY'));
    _todaysDisplay.children("figure").children("img").attr("src", "https://openweathermap.org/img/wn/" + p_weatherData.weather[0].icon + ".png");
    _todaysDisplay.children("p").eq(0).children("span").text(p_weatherData.temp.max);
    _todaysDisplay.children("p").eq(1).children("span").text(p_weatherData.wind_speed);
    _todaysDisplay.children("p").eq(2).children("span").text(p_weatherData.humidity);
}

// function GetUVColor() {}

function DisplaySearchHistory(){
    if (!localStorage.getItem(SEARCHHISTORYKEY)) { return; }
    let _searchHistory = JSON.parse(localStorage.getItem(SEARCHHISTORYKEY));
    for (let i = _searchHistory.queries.length - 1; i >= 0; i--){
        let listItemEl = $("<li>");
        let buttonEl = $("<button>");
        buttonEl.text(_searchHistory.queries[i]);
        buttonEl.attr("class", "Search-History-Button");
        listItemEl.append(buttonEl);
        $("#Search-History").append(listItemEl);
    }
}

function UpdateSearchHistory(query){
    let _wasPopulated = false;
    //If something existed and matched the query param do nothing
    if (localStorage.getItem(SEARCHHISTORYKEY)){
        _wasPopulated = true;
        let _searchHistory = JSON.parse(localStorage.getItem(SEARCHHISTORYKEY));
        for (let i = 0; i < _searchHistory.queries.numResults; i++){
            if (_searchHistory.queries[i] === query){
                console.log("Item already saved.")
                return;
            }
        }
    }
    // Otherwise save it
    else{
        let _newSearchHistory = {
            numResults: 0,
            queries: []
        }
        if(_wasPopulated){
            _newSearchHistory.queries = JSON.parse(localStorage.getItem(SEARCHHISTORYKEY)).queries;
            _newSearchHistory.numResults = _newSearchHistory.queries.push(query);
        } else {
            _newSearchHistory.numResults = _newSearchHistory.queries.push(query);
        }
        localStorage.setItem(SEARCHHISTORYKEY, JSON.stringify(_newSearchHistory));
    }
}