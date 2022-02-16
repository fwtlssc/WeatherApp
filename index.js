async function getLocations() {
    const locations = {};
    const url = "https://countriesnow.space/api/v0.1/countries";
    try{
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error();
        }
        const data = await response.json();
        data['data'].forEach((element) => {
            locations[element.country] = element.cities;
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
        return data;
    } catch(error) {
        console.log(error);
    }
}

async function setWeather(city) {
    try{
        /*  Todo
                set city element
                set weather description element
                set image element source
                set temperature elements
        */
        const weather = await getWeather(city);
        const imageResponse = await getWeatherDescriptiveImage(weather.weather[0].description);
        const image = imageResponse.data.images.downsized.url;
        const celsiusTemperature = weather.main.temp;
        const fahrenheitTemperature = celsiusToFahrenheit(celsiusTemperature);
    } catch (error) {
        console.log(error);
    }
}

function celsiusToFahrenheit(temperature) {
    return (temperature * 9/5) + 32
}
