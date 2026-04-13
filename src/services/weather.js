export const fetchWeather = async (city) => {
  try {
    // First, geocode the city to get lat/lon
    const geoRes = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&format=json`);
    const geoData = await geoRes.json();
    
    if (!geoData.results || geoData.results.length === 0) {
      throw new Error("City not found. Please try another city.");
    }
    
    const { latitude, longitude, name, country } = geoData.results[0];
    
    // Now fetch weather
    const weatherRes = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,weather_code&timezone=auto`);
    const weatherData = await weatherRes.json();
    
    const temp = weatherData.current.temperature_2m;
    const weatherCode = weatherData.current.weather_code;
    
    // Simple weather code mapping
    let condition = "Unknown";
    if (weatherCode === 0) condition = "Clear sky";
    else if (weatherCode >= 1 && weatherCode <= 3) condition = "Partly cloudy";
    else if (weatherCode >= 45 && weatherCode <= 48) condition = "Foggy";
    else if (weatherCode >= 51 && weatherCode <= 67) condition = "Rainy";
    else if (weatherCode >= 71 && weatherCode <= 77) condition = "Snowy";
    else if (weatherCode >= 95) condition = "Thunderstorm";
    
    return {
      location: `${name}, ${country}`,
      temperature: temp,
      condition,
    };
  } catch (error) {
    console.error("Weather fetch error:", error);
    throw error;
  }
};
