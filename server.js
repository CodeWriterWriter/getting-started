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
const server = new Hapi.Server();
server.register(require('vision'), (err) => {

server.connection({
    host: 'localhost',
    port: 8000
});

server.views({
  engines: {
    html: require ('handlebars')
  },
  relativeTo: __dirname,
  path: 'public'
})

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
      //console.log(data);
      //reply(data);
      reply.view('./list.html', {list: data})
    })

  }
})
server.route({
  method: 'GET',
  path: '/api/pet/make',
  handler: function (request, reply) {
      reply.view('./make.html')
  }
})

server.route({
  method: 'POST',
  path: '/api/pet/make',
  handler: function (request, reply) {
    var pet = seneca.make('pet');

    pet.name = request.payload.name || 'default'
    pet.type = request.payload.type || 'default'
    pet.save$(function (err, data) {
      //console.log(data);
      reply(data);
    })
  }
})

server.route({
  method: 'POST',
  path: '/api/pet/{name}/{type}',
  handler: function (request, reply) {
    var pet = seneca.make('pet');

    pet.name = request.params.name
    pet.type = request.params.type
    pet.save$(function(err, data) {
      reply(data);
    })

  }
})

server.route({
  method: 'PUT',
  path: '/api/pet/{id}',
  handler: function (request, reply) {
    var pet = seneca.make('pet');
    /*
    curl -d name=tom -d type=hat  -X PUT localhost:8000/api/pet/b2uwe7
    */
    pet.load$({ id: request.params.id}, function(err, data) {
      pet.name = request.payload.name || pet.name
      pet.type = request.payload.type || pet.type
      pet.id = request.params.id
      pet.save$(function (err, data) {
        //console.log(data);
        reply(data);
      })
    })

  }
})

server.route({
  method: 'DELETE',
  path: '/api/pet/{id}',
  handler: function (request, reply) {
    var pet = seneca.make('pet');

    pet.remove$({ id: request.params.id}, function(err, data) {
      console.log("deleted");
      reply(data)
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
})
