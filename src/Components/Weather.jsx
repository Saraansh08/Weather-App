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
    try {
      const url = `${import.meta.env.VITE_BACKEND_URL}/api/weather?city=${cityName}`;
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("City not found or invalid API key");
      }
      const data = await response.json();
      // Debug: log the full response
      console.log('Weather API response:', data);
      if (typeof data.temperature === 'undefined') {
        setError('Temperature is undefined. Check backend/API response.');
      } else {
        setError(null);
      }
      setWeatherData({
        humidity: data.humidity,
        windSpeed: data.windSpeed,
        temperature: data.temperature,
        location: data.location,
      });
    } catch (error) {
      setWeatherData(null);
      setError(error.message);
      console.error('Error fetching weather data:', error.message);
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
