const api = require('./api');
const express = require('express');
const app = express();

app.use('/', express.static('../web'));

app.get('/api', (req, res) => res.send('API is not ready yet :('));
app.get('/api/airports', (req, res) => res.send(api.getAirports(req, res)));
app.get('/api/flights', (req, res) => res.send(api.getFlights(req, res)));

app.listen(3000, _ => console.log('Example app listening on port 3000!'));
