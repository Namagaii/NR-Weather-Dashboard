let requestURL = "http://api.openweathermap.org/data/2.5/weather?appid=f310e487a963435a12a4d57a94cd2dff"; //root
let weatherData;
$("#Search-Form").on("submit", event=>{
    event.preventDefault();
    FetchLocation($("#Search-Bar").val());
    UpdateSearchHistory();
})

function FetchLocation(p_cityName){
    requestURL += "&q=" + p_cityName;
    fetch(requestURL)
    .then(function(response){
        return response.json();
    })
    .then(function(data){
        requestURL = "https://api.openweathermap.org/data/2.5/onecall?exclude=current,minutely,hourly,alerts&appid=f310e487a963435a12a4d57a94cd2dff";
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
    let todaysIndex;
    for(let i = 0; i < weatherData.daily.length; i++){
        if (weatherData.daily[i].dt == moment().utc()){
            DisplayTodaysData(weatherData.daily[i]);
            todaysIndex = i;
            return;
        }
    }
    if (!todaysIndex) {console.log("Todays index was not set."); return;}
    for (let i = todaysIndex; i < weatherData.daily.length; i++){
        
    }
}

function DisplayTodaysData(){

}

function UpdateSearchHistory(){
    //Update search history information
}