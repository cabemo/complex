const keys = require('./keys');
// Express setup
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}))


// Postgres Setup
const { Pool } = require('pg');

const pgClient = new Pool({
    host: keys.pgHost,
    user: keys.pgUser,
    password: keys.pgPass,
});

pgClient.on('error', err => console.log(err));

pgClient.query(`
CREATE TABLE IF NOT EXISTS queries (index INT);
`).catch(err => console.log(err));


// Redis setup
const redis = require('redis');

const redisClient = redis.createClient({
    host: keys.redisHost,
    port: keys.redisPort,
    retry_strategy: () => 1000
})

const redisPublisher = redisClient.duplicate();

app.get('/test', (req, res) => {
    res.status(200).send('Workin!');
})


app.get('/values/all', async (req, res, next) => {
    try {
        const values = await pgClient.query('SELECT * from queries;')
        console.log(values.rows);
        res.status(200).send(values.rows);
    } catch(err) {
        next(err);
    }
})

app.get('/values/cache', (req, res, next) => {
    redisClient.hgetall('values', (err, reply) => {
        if(err) {
            next(err);
        } else {
            res.status(200).send(reply);
        }
    })
})

app.post('/values', (req, res) => {
    const index = req.body.index;

    redisClient.hset('values', index, 'Nothin\' yet');
    redisPublisher.publish('insert', index);

    pgClient.query(`INSERT INTO queries (index) VALUES (${index});`)
    

})


app.listen(5000 || process.env.PORT);