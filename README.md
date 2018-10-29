# Project Name: City Explorer Backend

**Author**: Darrin Howell, Pablo Rosales
**Version**: 1.1.0 (increment the patch/fix version number if you make more commits past your first submission)

## Overview
Backend app that transports data from google, darksky, and movidb APIs according to an ajax event initaiated in the static front end. 

## Getting Started
In order to make this app work, one must input the heroku app URL into the City Explorer static front end client found 
online. 

## Architecture
Appication utilizes node.js modules to set up a proxy server that receives ajax requests from the front end, gets
data from google, darksky, and movieDB API's via node superagent modules, sending that data back to the front end to be displayed to users. This app is 
written in javascript. 
