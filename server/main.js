const api = require('./api');
const express = require('express');
const app = express();

app.use('/', express.static('../web'));

app.get('/api', (req, res) => res.send('REST API'));
app.get('/api/airports', (req, res) => api.getAirports(req, res));
app.get('/api/flights', (req, res) => api.getFlights(req, res));

app.listen(3000, _ => console.log('Example app listening on port 3000!'));
