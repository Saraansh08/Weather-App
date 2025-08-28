import React, { useState, useRef, useEffect } from 'react';
import './Weather.css';
import { FaSearch, FaSun, FaTint, FaWind } from 'react-icons/fa';

const Weather = () => {
  const [weatherData, setWeatherData] = useState(null);
  const [city, setCity] = useState('New York');
  const [error, setError] = useState(null);
  const inputRef = useRef();

  const search = async (cityName) => {
    if (!cityName) return;
    setError(null);
  
    try {
      const apiKey = import.meta.env.VITE_OPENWEATHER_KEY;
      if (!apiKey) {
        throw new Error("Missing VITE_OPENWEATHER_KEY in .env");
      }
  
      // 1) Geocode city to get lat/lon
      const geoRes = await fetch(
        `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(cityName)}&limit=1&appid=${apiKey}`
      );
      if (!geoRes.ok) throw new Error("Geocoding failed");
      const geo = await geoRes.json();
      if (!geo || !geo.length) throw new Error("City not found");
      const { lat, lon } = geo[0];
  
      // 3) Current Weather call
      const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
const response = await fetch(url);
if (!response.ok) {
  const text = await response.text();
  throw new Error(`Current weather request failed: ${response.status} ${text}`);
}
const data = await response.json();
      // Using current weather response shape
  
      // Map into the keys used by the UI
      setWeatherData({
        location: cityName,
        temperature: data?.main?.temp,
        humidity: data?.main?.humidity,
        // Convert m/s to Km/hr if present
        windSpeed: data?.wind?.speed ? Math.round(data.wind.speed * 3.6) : undefined,
        weather: data?.weather?.[0]?.main || "N/A",
        icon: data?.weather?.[0]?.icon || null,
        raw: data,
      });
    } catch (err) {
      setError(err.message || "Failed to fetch weather");
      setWeatherData(null);
    }
  };

  useEffect(() => {
    search(city);
  }, []);

  const handleInputChange = (e) => setCity(e.target.value);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      search(city);
    }
  };

  return (
    <div className='weather'>
      <div className="search-bar">
        <input
          ref={inputRef}
          type="text"
          placeholder='Search'
          value={city}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
        />
        <FaSearch className="search-icon" onClick={() => search(city)} />
      </div>
      <FaSun className='clear-icon' />
      <p className='temperature'>
        {weatherData && typeof weatherData.temperature !== 'undefined' ? `${weatherData.temperature}°C` : '--'}
      </p>
      {error && (
        <div style={{ color: 'red', marginBottom: '10px' }}>
          {error}
        </div>
      )}
      <p className='location'>
        {weatherData ? weatherData.location : '--'}
      </p>
      <div className="weather-data">
        <div className="col">
          <FaTint className='humidity-icon' />
          <div>
            <p>{weatherData ? `${weatherData.humidity}%` : '--'}</p>
            <span>Humidity</span>
          </div>
        </div>
        <div className="col">
          <FaWind className='wind-icon' />
          <div>
            <p>{weatherData ? `${weatherData.windSpeed} Km/hr` : '--'}</p>
            <span>Wind-Speed</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Weather;
