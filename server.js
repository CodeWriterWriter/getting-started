'use strict';
var _ = require('lodash');
const Hapi = require('hapi');
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
const server = new Hapi.Server();
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
/*server.route({
  method: 'put',
  path: '/api/pet/{id}/{name}/{type}',
  handler: function (request, reply) {
    var pet = seneca.make('pet');

    pet.load$({ id: request.params.id}, function(err, data) {
      //console.log(data);
      pet.name = name
      pet.type = type
      pet.save$(function(err, data) {
        reply(data);
      })
    })

  }
})
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
})*/
setupData(function() {
  // Start the server
  server.start((err) => {

      if (err) {
          throw err;
      }
      console.log('Server running at:', server.info.uri);
  });

});
