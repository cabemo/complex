const redis = require('redis');

const keys = require('./keys');


const client = redis.createClient({
    host: keys.host,
    port: keys.port,
    retry_strategy: () => 100
});

const sub = client.duplicate();

const fib = (index) => {
    if(index < 2) return  1;
    return fib(index - 1) + fib(index - 2)
};

sub.on('message', (channel, message) => {
    console.log(`Parsing ${message}`)
    client.hset('values', message, fib(parseInt(message)));
});

sub.subscribe('insert');