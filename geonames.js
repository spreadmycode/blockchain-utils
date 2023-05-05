import { readFileSync, writeFileSync } from "fs";
import fetch from "node-fetch";

async function fetchData() {
  //   const url = `http://api.geonames.org/countryInfoJSON?username=stressfulworking`;
  //   const response = await fetch(url);
  //   if (response.ok) {
  //     const data = await response.json();
  //     const countries = data.geonames.map((country, index) => {
  //       return {
  //         id: index + 1,
  //         code: country.countryCode,
  //         iso: country.countryName,
  //         iso3: country.isoAlpha3,
  //         name: country.countryName,
  //         numcode: country.geonameId,
  //         phonecode: country.isoNumeric,
  //       };
  //     });
  // Save countries CSV
  // const countriesContent = countries
  //   .map((country) => {
  //     return `${country.id},${country.code},${country.iso},${country.iso3},${country.name},${country.numcode},${country.phonecode}`;
  //   })
  //   .join("\n");
  // writeFileSync(`./result/countries.csv`, countriesContent);
  // writeFileSync(`./result/countries.json`, JSON.stringify(countries));

  // let stateId = 1;
  // let states = [];
  // for (let country of countries) {
  //   const url = `http://api.geonames.org/searchJSON?country=${country.code}&featureCode=ADM1&username=stressfulworking`;
  //   const response = await fetch(url);
  //   if (response.ok) {
  //     const data = await response.json();
  //     states.push(
  //       ...data.geonames.map((state) => {
  //         return {
  //           id: stateId++,
  //           countryId: country.id,
  //           geonameId: state.geonameId,
  //           name: state.name,
  //         };
  //       })
  //     );
  //   }
  // }
  // // Save states CSV
  // const statesContent = states
  //   .map((state) => {
  //     return `${state.id},${state.countryId},${state.name}`;
  //   })
  //   .join("\n");
  // writeFileSync(`./result/states.csv`, statesContent);
  // writeFileSync(`./result/states.json`, JSON.stringify(states));

  const content = readFileSync("./result/states.json");
  const states = JSON.parse(content);

  const tempContent = readFileSync("./result/cities.json");
  const cities = JSON.parse(tempContent);

  try {
    let cityId = cities.length > 0 ? cities[cities.length - 1].id + 1 : 1;
    for (let i = 3877; i < states.length; i++) {
      const state = states[i];
      const url = `http://api.geonames.org/childrenJSON?geonameId=${state.geonameId}&featureCode=PPL&maxRows=1000&username=stressfulworking`;
      const response = await fetch(url);
      if (response.ok) {
        console.log(i);
        const data = await response.json();
        cities.push(
          ...data.geonames.map((city) => {
            return {
              id: cityId++,
              stateId: state.id,
              name: city.name,
            };
          })
        );
      } else {
        const msg = await response.text();
        console.log(msg);
      }
    }
    // Save cities CSV
    // const citiesContent = cities
    //   .map((city) => {
    //     return `${city.id},${city.stateId},${city.name}`;
    //   })
    //   .join("\n");
    // writeFileSync(`./result/cities.csv`, citiesContent);
    writeFileSync(`./result/cities.json`, JSON.stringify(cities));
    //   }
  } catch (e) {
    console.log(e);
    writeFileSync(`./result/cities.json`, JSON.stringify(cities));
  }
}

fetchData();
