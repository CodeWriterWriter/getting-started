'use strict';

const Hapi = require('hapi');
var seneca = require('seneca')()
seneca.use('entity')

// Create a server with a host and port
const server = new Hapi.Server();
server.connection({
    host: 'localhost',
    port: 8000
});
var pet = seneca.make('pet')
pet.name = 'Johnathon'
pet.type = 'cat'
var id = null
pet.save$(function (err, foo) {
  id = foo.id
})
// Add the route
server.route({
    method: 'GET',
    path:'/hello',
    handler: function (request, reply) {

        return reply(pet.load$(id));
    }
});

// Start the server
server.start((err) => {

    if (err) {
        throw err;
    }
    console.log('Server running at:', server.info.uri);
});
