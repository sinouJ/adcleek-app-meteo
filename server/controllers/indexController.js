const db = require('../database');
const env = require('dotenv').config('../.env').parsed;
const nodefetch = require('node-fetch');

const cities = (req, res) => {
    const query = 'SELECT * FROM city';
    db.all(query)
    .then((rows) => { res.json(rows) })
    .catch((err) => { res.status(500).json({ error: err.message }) });
}

const forecast = (req, res) => {
    const query = `SELECT * FROM forecast WHERE insee = '${req.query.insee}'`;
 
    
    db.get(query)
    .then((row) => { 
        if (row) {
            res.json(row)
        } else {
            nodefetch(`https://api.meteo-concept.com/api/forecast/daily?insee=${req.query.insee}&world=false&token=${env.api}`, {
                headers : {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }
            })
            .then(forecast => {
                console.log(forecast);
                if (forecast.length > 0) {
                    const query_create = `INSERT INTO forecast (insee, details) VALUES ('${req.query.insee}', '${JSON.stringify(forecast)}')`;
                    try {
                        db.run(query_create)
                    }
                    catch (err) {
                        res.status(500).json({ error: err.message })
                    }
                    finally {
                        res.status(200).json({ insee: req.query.insee, details: forecast });
                    }
                } else {
                    res.status(404).json({ error: 'No data found', forecast})
                }
            })
            .catch(err => {
                res.status(500).json({ error: err.message })
            })
        }
    })
    .catch((err) => { res.status(500).json({ error: err.message }) });
}

module.exports = {
    cities,
    forecast
}