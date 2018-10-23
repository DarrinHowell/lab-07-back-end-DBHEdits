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


function location(data){
    this.formatted_query = data.formatted_address;
    this.latitude = data.geometry.location.lat;
    this.longitude = data.geometry.location.lng;
}









app.listen(3000, ()=>{
    console.log(`app is running on ${PORT}`)
});