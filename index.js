async function getLocations() {
    const locations = {};
    const url = "https://countriesnow.space/api/v0.1/countries/capital";
    try{
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error();
        }
        const data = await response.json();
        data['data'].forEach((element) => {
            if(element.capital !== "") {
                locations[element.name] = [element.capital];
            }
        });
        return locations;
    } catch(error) {
        console.log(error);
    }
}

let weatherAbortController;

async function getWeather(city) {
    const apiKey = "1e2350233e4e19cb63ccb8a85fd56256";
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;
    if (weatherAbortController) {
        weatherAbortController.abort();
    }
    try{
        weatherAbortController = new AbortController();
        const response = await fetch(url, {
            signal: weatherAbortController.signal
        });
        if (!response.ok) {
            throw new Error("City not found");
        }
        const data = await response.json();
        return data;
    } catch(error) {
        console.log(error);
    }
}

let weatherImageAbortController;

async function getWeatherDescriptiveImage(weather) {
    const apiKey = "NgI3bi3KsP1YtOCj1TJJL7VHjfX3mMsU";
    const url = `https://api.giphy.com/v1/gifs/translate?api_key=${apiKey}&s=${weather}`;
    if( weatherImageAbortController ) {
        weatherImageAbortController.abort();
    }
    try{
        weatherImageAbortController = new AbortController();
        const response = await fetch(url, {
            signal: weatherImageAbortController.signal
        });
        const responseData = await response.json();
        if(responseData.data.length === 0) {
            throw new Error("Image not found");
        }
        return responseData;
    } catch(error) {
        console.log(error);
    }
}

const weatherCard = document.querySelector("#section-weather-details .weather-card");
const descriptionColumn = weatherCard.querySelector(".card-header .details")
const cityName = weatherCard.querySelector(".card-header h2");
const description = weatherCard.querySelector(".description");
const celsiusTemperature = weatherCard.querySelector(".celsius .value");
const fahrenheitTemperature  = weatherCard.querySelector(".fahrenheit .value");
const date = weatherCard.querySelector(".date");
const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const weatherImageContainer = weatherCard.querySelector(".card-body .img-container");
const weatherImage = weatherImageContainer.querySelector("img");
const weatherImageSpinner = weatherImageContainer.querySelector(".spinner-container");
weatherImage.addEventListener("load", () => {
    weatherImage.classList.remove("loading");
    weatherImageSpinner.classList.add("d-none");
});

async function setWeather(city) {
    try{
        const weather = await getWeather(city);
        cityName.textContent = city;
        description.textContent = weather.weather[0].main;
        celsiusTemperature.textContent = Math.round(weather.main.temp * 10) / 10;
        fahrenheitTemperature.textContent = Math.round(celsiusToFahrenheit(weather.main.temp) * 10) / 10;
        const today = new Date();
        const todaySting = today.toDateString();
        date.textContent = days[today.getDay()] + ", " + todaySting.substring(todaySting.indexOf(" ") + 1);
        weatherImageContainer.classList.add("loading");
        weatherImageSpinner.classList.remove("d-none");
        const imageResponse = await getWeatherDescriptiveImage(weather.weather[0].description);
        const image = imageResponse.data.images.downsized.url;
        weatherImage.setAttribute("src", image);
        descriptionColumn.classList.remove("d-none");
    } catch (error) {
        console.log(error);
    }
}

function celsiusToFahrenheit(temperature) {
    return (temperature * 9/5) + 32
}


const cities = document.querySelector(".city-choose select");
cities.addEventListener("change", () => {
    setWeather(cities.value);
})

let locations = getLocations().then((data) => {
    locations = data;
    Object.keys(locations).forEach((country) => {
        cities.append(createCountyOptions(country, locations[country]));
    });
});


function createCountyOptions(country, cities){
    const optGroup = document.createElement("optgroup");
    optGroup.setAttribute("label", country);
    cities.forEach((city) => {
        optGroup.append(createCityOption(city));
    });
    return optGroup;
}

function createCityOption(city){
    const option = document.createElement("option");
    option.setAttribute("value", city);
    option.textContent = city;
    return option;
}



