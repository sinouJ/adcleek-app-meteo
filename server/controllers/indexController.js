const db = require('../database');
const env = require('dotenv').config('../.env').parsed;
const fetch = require('node-fetch');

const cities = (req, res) => {
    const query = 'SELECT * FROM city';
    db.all(query)
    .then((rows) => { res.json(rows) })
    .catch((err) => { res.status(500).json({ error: err.message }) });
}

const forecast = (req, res) => {
    let query = `SELECT * FROM forecast WHERE insee = '${req.query.insee}'`;
 
    
    db.get(query)
    .then((row) => { 
        if (row) {
            res.json(row)
        } else {
            db.get(`SELECT name FROM city WHERE insee = '${req.query.insee}'`)
            .then((row) => {
                if (row) {
                    fetch(`https://api.meteo-concept.com/api/location/cities?token=${env.api}&search=${row.name}`, {
                        headers : {
                            'Content-Type': 'application/json',
                            'Accept': 'application/json'
                        }
                    })
                        .then(forecast => {
                            if (forecast.length > 0) {
                                const query_create = `INSERT INTO forecast (insee, details) VALUES ('${req.query.insee}', '${JSON.stringify(forecast)}')`;
                                db.run(query_create)
                                res.status(200).json({ insee: req.query.insee, details: forecast });
                            } else {
                                res.status(404).json({ error: 'No data found', forecast})
                            }
                        })
                } else {
                    res.status(404).json({ error: 'City not found' });
                }
            })
            .catch((err) => { res.status(500).json({ error: err.message }) });
        }
    })
    .catch((err) => { res.status(500).json({ error: err.message }) });
}

module.exports = {
    cities,
    forecast
}