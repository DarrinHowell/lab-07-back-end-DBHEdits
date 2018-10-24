'use strict'


const express = require('express');
const cors = require('cors');

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
    const locationData = searchToLatLong(request.query.data);
    response.send(locationData); 
})

// Note: anything dependent on the above code will require a dot then when we query from actual databases
// because this call is asynchronous.

// Takes in the query as an argument. It then brings in the geo.json data via the require method.
// The function then consructs a new locaiton based on the geo.json data at index 0.
// The search query property is added to the object, and then this data is returned.
function searchToLatLong(query){
    const geoData = require('./data/geo.json');
    const location = new Location(geoData.results[0]);
    location.search_query = query;
    console.log(location);
    return location;
}

// Constructs a location object with the geo.json data input above.
function Location(data){
    this.formatted_query = data.formatted_address;
    this.latitude = data.geometry.location.lat;
    this.longitude = data.geometry.location.lng;
}

// This function is essentially the same event listener as the app.get above, and it triggers when it
// sees /weather in the URL. This function receives the location as the request from the front end. 
// We then send this request (which is the location data from the front end) into our getWeatherData  function,
// and we recieve back weather data in the form that we prescribe. 
// We then send the weather data back to the front end client via response.send().
app.get('/weather', (request, response) => {
    const weatherData = getWeatherData(request.query.data);
    response.send(weatherData);
})

function getWeatherData(query){
    const darksky = require('./data/darksky.json');
    const weatherArray = [];
    const weather = darksky.daily.data.forEach((item)=>{
        weatherArray.push(new Weather(item));
    })
    return weatherArray; 
}

function Weather(data){
    this.time = new Date(data.time*1000).toString().slice(0,15);
    this.forecast = data.summary;
    console.log(data.summary);

}



app.listen(PORT, ()=>{
    console.log(`app is running on ${PORT}`)
});
