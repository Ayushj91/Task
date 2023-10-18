import React, { useState } from 'react';
import { Data } from './data'; // Import the data from the Data.js file

const LocationSelector = () => {
  const [selectedCountry, setSelectedCountry] = useState('');
  const [selectedStates, setSelectedStates] = useState([]);
  const [selectedCities, setSelectedCities] = useState([]);
  const [citySearchTerm, setCitySearchTerm] = useState('');

  const handleCountryChange = (countryId) => {
    setSelectedStates([]);
    setSelectedCities([]);

    if (selectedCountry === countryId) {
      setSelectedCountry('');
    } else {
      setSelectedCountry(countryId);

      // Automatically select all states and cities of the country
      const countryData = Data.find((country) => country.id === countryId);
      const stateNames = countryData.state.map((state) => state.state);
      const cityNames = countryData.state.flatMap((state) => state.city.map((city) => city.name));
      setSelectedStates(stateNames);
      setSelectedCities(cityNames);
    }
  };

  const handleStateChange = (stateName) => {
    if (selectedStates.includes(stateName)) {
      setSelectedStates(selectedStates.filter((state) => state !== stateName));
      // Deselect only the cities that belong to the unselected state
      setSelectedCities(selectedCities.filter(city => {
        const cityState = Data.find((country) => selectedCountry === country.id)
          .state.find((state) => state.state === stateName);
        return !cityState.city.map(city => city.name).includes(city);
      }));
    } else {
      setSelectedStates([...selectedStates, stateName]);

      // Automatically select cities of the selected state
      const selectedStateData = Data.find((country) => selectedCountry === country.id).state.find(
        (state) => state.state === stateName
      );
      const cityNames = selectedStateData.city.map((city) => city.name);
      setSelectedCities([...selectedCities, ...cityNames]);
    }
  };

  const handleCityChange = (cityName, stateName) => {
    setSelectedCities((prevCities) => {
      if (prevCities.includes(cityName)) {
        return prevCities.filter((city) => city !== cityName);
      } else {
        return [...prevCities, cityName];
      }
    });

    // Check if at least one city within the state is selected, and if so, select the state
    const stateData = Data.find((country) => selectedCountry === country.id).state.find((state) =>
      state.state === stateName
    );
    const cityNames = stateData.city.map((city) => city.name);
    if (cityNames.some((city) => selectedCities.includes(city))) {
      setSelectedStates((prevStates) => {
        if (!prevStates.includes(stateName)) {
          return [...prevStates, stateName];
        }
        return prevStates;
      });
    }
  };

  const filterCities = (cities) => {
    return cities.filter((city) =>
      city.name.toLowerCase().includes(citySearchTerm.toLowerCase())
    );
  };

  const renderCities = (cities, stateName) => {
    return filterCities(cities).map((city) => (
      <div key={city.id} style={boxStyle}>
        <label>
          <input
            type="checkbox"
            checked={selectedCities.includes(city.name)}
            onChange={() => handleCityChange(city.name, stateName)}
          />
          {city.name}
        </label>
      </div>
    ));
  };

  const handleFormSubmit = (event) => {
    event.preventDefault(); // Prevent the default form submission behavior
    // Log the selected cities and states to the console
    console.log('Selected States:', selectedStates);
    console.log('Selected Cities:', selectedCities);
  };

  const containerStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '10px',
    maxWidth: '100%',
    margin: '10px'
  };

  const boxStyle = {
    border: '1px solid #ccc',
    borderRadius: '4px',
    padding: '10px',
    margin: '20px',
    backgroundColor: '#f0f0f0',
    width: '100%',
  };

  const searchInputStyle = {
    width: '30%', // Adjust the width as needed
    padding: '10px',
  };

  const buttonStyle = {
    margin: '20px',
    padding: '10px 20px',
  };

  return (
    <div style={containerStyle}>
      <input
          type="text"
          placeholder="Search Cities"
          value={citySearchTerm}
          onChange={(e) => setCitySearchTerm(e.target.value)}
          style={{ ...boxStyle, ...searchInputStyle }}
        />
      <form className="form">
        
        {Data.map((country) => (
          <div key={country.id}>
            <label style={boxStyle}>
              <input
                type="checkbox"
                checked={selectedCountry === country.id}
                onChange={() => handleCountryChange(country.id)}
              />
              {country.country}
            </label>
            {selectedCountry === country.id && (
              <ul>
                {country.state.map((state) => (
                  <div key={state.id} style={boxStyle}>
                    <label>
                      <input
                        type="checkbox"
                        checked={selectedStates.includes(state.state)}
                        onChange={() => handleStateChange(state.state)}
                      />
                      {state.state}
                    </label>
                    {selectedStates.includes(state.state) && (
                      <ul style={containerStyle}>
                        {renderCities(state.city, state.state)}
                      </ul>
                    )}
                  </div>
                ))}
              </ul>
            )}
          </div>
        ))}
        
        <button onClick={handleFormSubmit} type="button" style={buttonStyle}>
          Submit
        </button>
      </form>
    </div>
  );
};

export default LocationSelector;
