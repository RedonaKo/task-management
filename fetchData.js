const axios = require('axios');
const fs = require('fs');

const API_KEY = 'NHhvOEcyWk50N2Vna3FTE00bFp3MjFKR0ZEOUhkZlg4RTk1MiJlaA==';
const BASE_URL = 'https://api.countrystatecity.in/v1/countries';

const headers = {
  'X-CSCAPI-KEY': API_KEY
};

async function fetchCountries() {
  try {
    const countriesResponse = await axios.get(`${BASE_URL}/countries`, { headers });
    return countriesResponse.data;
  } catch (error) {
    console.error('Error fetching countries:', error);
  }
}

async function fetchStates(countryCode) {
  try {
    const statesResponse = await axios.get(`${BASE_URL}/countries/${countryCode}/states`, { headers });
    return statesResponse.data;
  } catch (error) {
    console.error(`Error fetching states for ${countryCode}:`, error);
  }
}

async function fetchCities(countryCode, stateCode) {
  try {
    const citiesResponse = await axios.get(`${BASE_URL}/countries/${countryCode}/states/${stateCode}/cities`, { headers });
    return citiesResponse.data;
  } catch (error) {
    console.error(`Error fetching cities for ${countryCode}-${stateCode}:`, error);
  }
}

async function main() {
  const countries = await fetchCountries();
  const data = {};

  for (const country of countries) {
    const states = await fetchStates(country.iso2);
    data[country.name] = { states: {} };

    for (const state of states) {
      const cities = await fetchCities(country.iso2, state.iso2);
      data[country.name].states[state.name] = cities;
    }
  }

  
  fs.writeFileSync('countryStateCity.json', JSON.stringify(data, null, 2));
  console.log('Data saved to countryStateCity.json');
}

main();
