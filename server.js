'use strict'


const express = require('express');
const cors = require('cors');
const superagent = require('superagent');

require('dotenv').config();

const PORT = process.env.PORT;

const app = express();

app.use(cors());

console.log('server is starting...');

// The variable app is express. Express is a node module containing a library of methods.
// .get is a way to request information when the parameters '/location' is received in the url.
// .get is essentially an event listener waiting for a request including /location.
// Once the event is recieved a callback function with the parameters request and response is activated.
// request is a massive object and in there we want to access query.data and send it into the searchToLatLong function
// Once the searchToLatLong function runs and returns data in the format we desire, we send it back to the client.
app.get('/location', (request, response)=>{
  searchToLatLong(request.query.data)
    .then(locationData => {
      response.send(locationData);
      console.log('location is: ', locationData);

    })

    .catch(error => {
      handleError(error, response);
      console.log('error in app.get is: ', error);
    })

});

app.get('/weather', getWeather);

function handleError(err, res) {
  console.error('err - ', err);
  if(res)res.status(500).send('Sorry, something went wrong');
}





//   const locationData = searchToLatLong(request.query.data);
//   response.send(locationData);
//   console.log('this is our data:', request.query.data);
// });

// Note: anything dependent on the above code will require a dot then when we query from actual databases
// because this call is asynchronous.

// Takes in the query as an argument. It then brings in the geo.json data via the require method.
// The function then consructs a new locaiton based on the geo.json data at index 0.
// The search query property is added to the object, and then this data is returned.
function searchToLatLong(query){
  const _URL = `https://maps.googleapis.com/maps/api/geocode/json?address=${query}&key=${process.env.GOOGLE_GEOCODE}`;
  console.log('query is: ', query);
  return superagent.get(_URL)
    .then(data => {
      if(! data.body.results.length) {throw 'No Data'}
      else {
        let location = new Location(data.body.results[0]);
        location.search_query = query;
        return location;
      }
    });
  // const geoData = require('./data/geo.json');
  // const location = new Location(geoData.results[0]);
  // location.search_query = query;
  // console.log(location);
  // return location;
}

// Constructs a location object with the geo.json data input above.
function Location(data){
  this.formatted_query = data.formatted_address;
  this.latitude = data.geometry.location.lat;
  this.longitude = data.geometry.location.lng;
}


function getWeather(request, response){
  const _URL = `https://api.darksky.net/forecast/${process.env.WEATHER_API_KEY}/${request.query.data.latitude},${request.query.data.longitude}`;

  return superagent.get(_URL)
    .then(result => {
      let weatherSummary = result.body.daily.data.map(day => {
        // console.log('this is the structure of time for each day: ', day.time);
        // console.log('this is the structure of te summary for each day: ', day.summary);
        return new Weather(day);
      })
      console.log('this is our weather summary data', weatherSummary);
      response.send(weatherSummary);
    })

    .catch(error => handleError(error, response));
}


// This function is essentially the same event listener as the app.get above, and it triggers when it
// sees /weather in the URL. This function receives the location as the request from the front end.
// We then send this request (which is the location data from the front end) into our getWeatherData  function,
// and we recieve back weather data in the form that we prescribe.
// We then send the weather data back to the front end client via response.send().
// app.get('/weather', (request, response) => {
//   // const weatherData = getWeatherData(request.query.data);
//   // response.send(weatherData);

// })

// function getWeatherData(query){
//   const darksky = require('./data/darksky.json');
//   // const weatherArray = [];
//   const weather = darksky.daily.data.map((item)=>{
//     return new Weather(item);
//   });
//   return weatherArray;
// }

function Weather(data){
  this.time = new Date(data.time*1000).toString().slice(0,15);
  this.forecast = data.summary;
  console.log(data.summary);

}



app.listen(PORT, ()=>{
  console.log(`app is running on ${PORT}`)
});
