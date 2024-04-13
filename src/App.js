import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMagnifyingGlass,
  faTimes,
  faLocationCrosshairs,
  faLocationDot,
  faLocationArrow,
} from "@fortawesome/free-solid-svg-icons";
import "./App.css";
import Clear from "./weather-app-master/Clear.png";
import Hail from "./weather-app-master/Hail.png";
import HeavyCloud from "./weather-app-master/HeavyCloud.png";
import Clouds from "./weather-app-master/HeavyCloud.png";
import HeavyRain from "./weather-app-master/HeavyRain.png";
import Rain from "./weather-app-master/HeavyRain.png";
import LightCloud from "./weather-app-master/LightCloud.png";
import LightRain from "./weather-app-master/LightRain.png";
import Shower from "./weather-app-master/Shower.png";
import Sleet from "./weather-app-master/Sleet.png";
import Snow from "./weather-app-master/Snow.png";
import Thunderstorm from "./weather-app-master/Thunderstorm.png";

function App() {
  const d = new Date();
  const date = d.getDate();
  const month = d.toLocaleString("default", { month: "short" });
  const day = d.toLocaleString("default", { weekday: "short" });

  const [trigger, setTrigger] = useState(false);
  const [location, setLocation] = useState("");
  const [search, setSearch] = useState("London");
  const [data, setData] = useState([]);
  const [dataForecast, setDataForecast] = useState([]);
  const [input, setInput] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isCelsius, setIsCelsius] = useState(true);

  useEffect(() => {
    function askPermission() {
      const permission = window.confirm('Do you want to share your location?');
      if (permission) {
        getLocation();
      } else {
        console.log('User denied location sharing.');
      }
    };

    function getLocation() {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            setLocation({
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
            });
          },
          (error) => {
            console.error('Error getting location:', error);
          }
        );
      } else {
        console.error('Geolocation is not supported by this browser.');
      }
    };
    setSearch("");
    askPermission();
    return;
  }, [trigger]);

  useEffect(() => {
    async function fetchWeather() {
      let url;
      if (search) {
        url = `https://api.openweathermap.org/data/2.5/weather?q=${search}&appid=201f3c9f647f6b713e38fc9c8cb73c15`;
      } else {
        const latitude = location ? location.latitude : 0;
        const longitude = location ? location.longitude : 0; 
        url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=201f3c9f647f6b713e38fc9c8cb73c15`;
      }
      const response = await fetch(url);
      if (response.ok) {
        const weatherData = await response.json();
        setData(weatherData);
      }
    }
    fetchWeather();
  }, [search, location]);

  const weatherDescription = data?.weather ? data.weather[0].main : null;

  const weatherImages = {
    Clear: Clear,
    Hail: Hail,
    Clouds: Clouds,
    "Heavy Cloud": HeavyCloud,
    Rain: Rain,
    "Heavy Rain": HeavyRain,
    "Light Cloud": LightCloud,
    "Light Rain": LightRain,
    Shower: Shower,
    Sleet: Sleet,
    Snow: Snow,
    Thunderstorm: Thunderstorm,
  };

  const weatherImageSrc = weatherImages[weatherDescription];

  const tempInFarenhite = data?.main ? data.main.temp : null;
  const tempInCelsius = tempInFarenhite
    ? Math.round((tempInFarenhite - 273.15).toFixed(2))
    : null;
  const windSpeed = data?.wind ? Math.round(data.wind.speed) : null;
  const humidity = data?.main ? data.main.humidity : null;
  const visibility = data?.visibility;
  const airPressure = data?.main ? data.main.pressure : null;

  function toggleSidebar() {
    setSidebarOpen(!sidebarOpen);
  }

  function handleSubmit(e) {
    e.preventDefault()
    setSearch(input);
    setSidebarOpen(!sidebarOpen);
  }

  useEffect(() => {
    async function fetchWeatherForecast() {
      let url;
      if (search) {
        url = `https://api.openweathermap.org/data/2.5/forecast?q=${search}&appid=201f3c9f647f6b713e38fc9c8cb73c15`;
      } else {
        const latitude = location ? location.latitude : 0;
        const longitude = location ? location.longitude : 0; 
        url = `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=201f3c9f647f6b713e38fc9c8cb73c15`;
      }
      const response = await fetch(url);
      if (response.ok) {
        const weatherDataForecast = await response.json();
        setDataForecast(weatherDataForecast);
      }
    }
    fetchWeatherForecast();
  }, [search, location]);

  let tempInFarenhiteMax = null;
  let tempInCelsiusMax = null;
  let tempInFarenhiteMin = null;
  let tempInCelsiusMin = null;

  const tempInFarenhiteMaxArray = [];
  const tempInCelsiusMaxArray = [];
  const tempInFarenhiteMinArray = [];
  const tempInCelsiusMinArray = [];
  const datesArray = [];

  if (dataForecast && dataForecast.list && dataForecast.list.length > 0) {
    for (let i = 0; i < 5; i++) {
      tempInFarenhiteMax = dataForecast.list[i].main.temp_max;
      tempInCelsiusMax = tempInFarenhiteMax ? Math.round((tempInFarenhiteMax - 273.15).toFixed(2)) : null;
      tempInFarenhiteMin = dataForecast.list[i].main.temp_min;
      tempInCelsiusMin = tempInFarenhiteMin ? Math.round((tempInFarenhiteMin - 273.15).toFixed(2)) : null;
    
      tempInFarenhiteMaxArray.push(tempInFarenhiteMax);
      tempInCelsiusMaxArray.push(tempInCelsiusMax);
      tempInFarenhiteMinArray.push(tempInFarenhiteMin);
      tempInCelsiusMinArray.push(tempInCelsiusMin);

      const currentDate = new Date();
      currentDate.setDate(currentDate.getDate() + i + 1);
      const month = currentDate.toLocaleString("default", { month: "short" });
      const date = currentDate.getDate();
      const day = currentDate.toLocaleString("default", { weekday: "short" });

      datesArray.push(`${day}, ${date} ${month}`);
      datesArray[0] = "Tommorow";
    }
  }

  return (
    <div className="WeatherApp">
      <div className={sidebarOpen ? "Sidebar open" : "Sidebar"}>
        <div className="HeaderCloseDiv">
          <button onClick={toggleSidebar}>
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>
        <form className="SidebarSearch">
          <span>
            <FontAwesomeIcon icon={faMagnifyingGlass} />
          </span>
          <input
            type="search"
            placeholder="search location"
            name="search"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            required
          />
          <button onClick={handleSubmit} >Search</button>
        </form>
      </div>
      <aside className="Aside">
        <div className="WeatherHeader">
          <button className="WeatherHeaderSearchButton" onClick={toggleSidebar}>Search for places</button>
          <button onClick={() => setTrigger(!trigger)} className="WeatherHeaderLocationButton">
            <FontAwesomeIcon icon={faLocationCrosshairs} />
          </button>
        </div>
        <div className="CloudDynamicImage">
          <img src={weatherImageSrc} alt={weatherDescription} />
        </div>
        <div className="Temperature">
          <p className="TemperatureNumber">
            {isCelsius ? tempInCelsius : Math.round(tempInFarenhite)}
            <span className="CelciusFarenhite">{isCelsius ? '°C' : '°F'}</span>
          </p>
          <p className="CloudType">{weatherDescription}</p>
          <p className="Data">
            Today • {day}, {date} {month}
          </p>
          <p className="LocationIcon">
            <FontAwesomeIcon icon={faLocationDot} />
            {" " + data.name}
          </p>
        </div>
      </aside>
      <article className="Article">
        <div className="TemperatureHeader">
          <button className="Celcius" onClick={() => {setIsCelsius(true)}}>℃</button>
          <button className="Farenhite" onClick={() => {setIsCelsius(false)}}>℉</button>
        </div>
        <div className="Container">
          {dataForecast.list && dataForecast.list.slice(0, 5).map((forecast, index) => (
            <div key={index} className="Wrapper">
              <h2>{datesArray[index]}</h2>
              {forecast.weather && (
                <img src={weatherImages[forecast.weather[0].main]} alt={forecast.weather[0].main} />
              )}
              <p className="MaxMinTemperature">
                <span className="MaxTemperature">{isCelsius ? tempInCelsiusMaxArray[index] : Math.round(tempInFarenhiteMaxArray[index])}{isCelsius ? '°C' : '°F'}</span>
                <span className="MinTemperature">{isCelsius ? tempInCelsiusMinArray[index] : Math.round(tempInFarenhiteMinArray[index])}{isCelsius ? '°C' : '°F'}</span>
              </p>
            </div>
          ))}
        </div>
        <div className="HighlightHeading">
          <h1>Today’s Highlights</h1>
          <div className="WindStatusHumidity">
            <div className="WindStatus">
              <h4>Wind Status</h4>
              <p>
                {windSpeed}
                <span className="WindStatusMPH">mph</span>
              </p>
              <div className="WindStatusBottom">
                <span className="WindStatusIcon">
                  <FontAwesomeIcon icon={faLocationArrow} />
                </span>
                <h5>WSW</h5>
              </div>
            </div>
            <div className="Humidity">
              <h4>Humidity</h4>
              <p>
                {humidity}
                <span>%</span>
              </p>
              <div className="HumidityPercentContainer">
                <ul>
                  <li>0</li>
                  <li>50</li>
                  <li>100</li>
                </ul>
                <div className="HumidityPercentRange">
                  <div
                    className="HumidityPercentRangeDiv"
                    style={{ width: `${humidity}%` }}
                  ></div>
                </div>
                <div className="HumidityPercentBottom">
                  <p>%</p>
                </div>
              </div>
            </div>
          </div>
          <div className="VisibilityAirPressure">
            <div className="Visibility">
              <h4>Visibility</h4>
              <p>
                {visibility}
                <span>miles</span>
              </p>
            </div>
            <div className="AirPressure">
              <h4>Air Pressure</h4>
              <p>
                {airPressure}
                <span>mb</span>
              </p>
            </div>
          </div>
        </div>
      </article>
    </div>
  );
}

export default App;
