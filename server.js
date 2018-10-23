'use strict'


const express = require('express');
const cors = require('cors');

require('dotenv').config();

const PORT = process.env.PORT;

const app = express();

app.use(cors());

console.log('server is starting...');

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
    
    // new Weather(darksky);
    // weather.search_query = query;
    return weatherArray; 
}

function Weather(data){
    this.time = data.time;
    this.forecast = data.summary;
    console.log(data.summary);

}



app.listen(3000, ()=>{
    console.log(`app is running on ${PORT}`)
});
