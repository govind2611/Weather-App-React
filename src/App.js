import hotBG from "./assets/hot.jpg";
import coldBG from "./assets/cold.jpg";
import Description from "./components/description";
import { useEffect, useState } from "react";
import { getFormattedWeatherData } from "./WeatherService";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  const [weather, setWeather] = useState(null);
  const [units, setUnits] = useState("metric");
  const [city, setCity] = useState('Latur');
  const [bg, setBg] = useState(hotBG);

  useEffect(() => {
    const fetchWeatherData = async () => {
      try {
        const data = await getFormattedWeatherData(city, units);
        setWeather(data);
        //bg
        const threshold = units === 'metric' ? 20 : 60;
        if (data.temp <= threshold) {
          setBg(coldBG);
        } else {
          setBg(hotBG);
        }
       
        toast.success('Weather data fetched successfully!', {
          position: 'top-right',
        });
      } catch (error) {
      
        toast.error('Invalid city name. Please try again.', {
          position: 'top-right',
        });
      }
    };
    fetchWeatherData();
  }, [units, city]);

  const handleUnitsClick = (e) => {
    const button = e.currentTarget;
    const currentUnit = button.innerText.slice(1);
    const isCelsius = currentUnit === "C";
    button.innerText = isCelsius ? "°F" : "°C";
    setUnits(isCelsius ? "metric" : "imperial");
  };

  const enterKeyPressed = (e) => {
      if(e.keyCode === 13){
        setCity(e.currentTarget.value);
        e.currentTarget.blur();
      }
  }

  return (
    <div className="app" style={{ backgroundImage: `url(${bg})` }}>
    
       <ToastContainer />
      <div className="overlay">
        {weather && (
          <div className="container">
            <h1 className="logo section section__inputs">Weather App</h1>
            <div className="section section__inputs">
              <input type="text" name="city" placeholder="Enter City" onKeyDown={enterKeyPressed}/>
              <button onClick={(e) => handleUnitsClick(e)}>°F</button>
            </div>
            <div className="section section__temperature">
              <div className="icon">
                <h3>{`${weather.name}, ${weather.country}`}</h3>
                <img src={weather.iconURL} alt="weatherIcon" />
                <h3>{weather.description}</h3>
              </div>
              <div className="temperature">
                <h1>
                  {`${weather.temp.toFixed()} °${
                    units === "metric" ? "C" : "F"
                  }`}{" "}
                </h1>
              </div>
            </div>

            {/* bottom info */}
            <Description weather={weather} units={units} />
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
