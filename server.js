'use strict';
var _ = require('lodash');
const Path = require('path');
const Hapi = require('hapi');
const Inert = require('inert');
var seneca = require('seneca')()
seneca.use('entity')


function setupData(cb) {

  var done = _.after(2, cb);

  var pet = seneca.make('pet');
  pet.name = 'john'
  pet.type = 'cat'
  pet.save$(function(err, data) {
    done();
  })


  var pet2 = seneca.make('pet');
  pet2.name = 'frank'
  pet2.type = 'cat'
  pet2.save$(function(err, data) {
    done();
  })


}


// Create a server with a host and port
const server = new Hapi.Server({
    connections: {
        routes: {
            files: {
                relativeTo: Path.join(__dirname, 'public')
            }
        }
    }
});

server.register(Inert, () => {});

server.connection({
    host: 'localhost',
    port: 8000
});


// Add the route


server.route({
  method: 'GET',
  path: '/api/pet/{id}',
  handler: function (request, reply) {
    var pet = seneca.make('pet');

    pet.load$({ id: request.params.id}, function(err, data) {
      console.log(data);
      reply(data);
    })

  }
})
/*
 curl command for list: curl -X GET localhost:8000/api/pet/list
*/
server.route({
  method: 'GET',
  path: '/api/pet/list',
  handler: function (request, reply) {
    var pet = seneca.make('pet');

    pet.list$(function(err, data) {
      console.log(data);
      reply(data);
    })

  }
})
server.route({
  method: 'GET',
  path: '/api/pet/form',
  handler: function (request, reply) {
      file : './public/index.html'
  }
})
/*
curl command: curl -X PUT localhost:8000/api/pet/{id}/{name}/{type}
*/
server.route({
  method: 'PUT',
  path: '/api/pet/{id}/{name}/{type}',
  handler: function (request, reply) {
    var pet = seneca.make('pet');

    pet.load$({ id: request.params.id}, function(err, data) {
      //console.log(data);
      pet.id = request.params.id
      pet.name = request.params.name
      pet.type = request.params.type
      pet.save$(function(err, data) {
        reply(data);
      })
    })

  }
})
/*
curl command: curl -X PUT localhost:8000/api/pet/{id}/{name}
*/
server.route({
  method: 'PUT',
  path: '/api/pet/{id}/{name}',
  handler: function (request, reply) {
    var pet = seneca.make('pet');

    pet.load$({ id: request.params.id}, function(err, data) {
      //console.log(data);
      pet.id = request.params.id
      pet.name = request.params.name
      pet.save$(function(err, data) {
        reply(data);
      })
    })

  }
})
setupData(function() {
  // Start the server
  server.start((err) => {

      if (err) {
          throw err;
      }
      console.log('Server running at:', server.info.uri);
  });

});
