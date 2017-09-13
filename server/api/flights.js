const axios = require('axios');

function getFlights(req, res) {
    const url = 'http://node.locomote.com/code-task/flight_search/QF';
    const {from, to, date} = req.query;
    const args = `date=${date}&from=${from}&to=${to}`;

    console.log(`QUERY IS: ${JSON.stringify(req.query)}`);

    axios.get(encodeURI(`${url}?${args}`))
        .then(results => res.send(results.data))
        .catch(err => console.log(err));
}

module.exports = {getFlights};