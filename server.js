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

function searchToLatLong(query){
    const geoData = require('./data/geo.json');
    const location = new Location(geoData.results[0]);
    location.search_query = query;
    return location;
}

function Location(data){
    this.formatted_query = data.formatted_address;
    this.latitude = data.geometry.location.lat;
    this.longitude = data.geometry.location.lng;
}

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
