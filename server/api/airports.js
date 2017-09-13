const axios = require('axios');

function getAirports(req, res) {
    const url = 'http://node.locomote.com/code-task/airports';

    console.log(`QUERY IS: ${JSON.stringify(req.query)}`);

    axios.get(encodeURI(`${url}?q=${req.query.q}`))
        .then(results => res.send(results.data))
        .catch(err => console.log(err));
}

module.exports = {getAirports};