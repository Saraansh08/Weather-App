import React, { useState, useRef, useEffect } from 'react'
import './Weather.css'
import { FaSearch, FaSun, FaTint, FaWind } from 'react-icons/fa'

const Weather = () => {
  const [weatherData, setWeatherData] = useState(false)
  const [city, setCity] = useState('New York')
  const inputRef = useRef()

  const search = async (cityName) => {
    if (!cityName) return
    try {
      const url = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&units=metric&appid=${import.meta.env.VITE_APP_ID}`
      const response = await fetch(url)
      if (!response.ok) {
        throw new Error("City not found or invalid API key")
      }
      const data = await response.json()
      setWeatherData({
        humidity: data.main.humidity,
        windSpeed: data.wind.speed,
        temprature: Math.floor(data.main.temp),
        location: data.name,
      })
    } catch (error) {
      setWeatherData(false)
      console.error('Error fetching weather data:', error)
    }
  }

  useEffect(() => {
    search(city)
  }, [])

  const handleInputChange = (e) => setCity(e.target.value)

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      search(city)
    }
  }

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
        {weatherData ? `${weatherData.temprature}°C` : '--'}
      </p>
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
  )
}

export default Weather