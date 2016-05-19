var assert = require('assert')

var Lab = require('lab')
var lab = exports.lab = Lab.script()
var suite = lab.suite
var test = lab.test
var before = lab.before
var after = lab.after
var server = require('../server.js')


suite("pet-api", function() {
  test("asynchronous test", function(done) {
    server.inject({
      method: 'POST',
      url: '/api/pet/make',
      payload: {
        name: "john",
        type: "fish"
      }
    }, function(response) {
      console.log(response.result)
      assert.equal(JSON.parse(response.payload).name, "john")
      assert.equal(JSON.parse(response.payload).type, 'fish')
      done()
    })
  })
  test("get entry", function(done) {
    server.inject({
      method: 'POST',
      url: '/api/pet/make',
      payload: {
        name: "hank",
        type: 'propane'
      }
    }, function (response) {
      server.inject({
        method: 'GET',
        url: '/api/pet/' + JSON.parse(response.payload).id,
      }, function (resp) {
        assert.equal(JSON.parse(resp.payload.name), 'hank')
        assert.equal(JSON.parse(resp.payload.type), 'propane')
      })
      done()
    })
  })
  test('put command', function(done) {
    server.inject({
      method:'POST',
      url: '/api/pet/make',
      payload : {
        name: 'hank',
        type: 'propane'
      }
    }, function (response) {
      server.inject({
        method: 'PUT',
        url: '/api/pet/update',
        payload: {
          id: JSON.parse(response.payload).id,
          name: 'traitor-hank',
          type: 'charcoal'
        }
      }, function (resp) {
        assert.equal(JSON.parse(resp.payload.name), 'traitor-hank')
        assert.equal(JSON.parse(resp.payload.type), 'charcoal')
      })
    })
    done()
  })
  test('alternative update command', function(done) {
    server.inject({
      method:'POST',
      url: '/api/pet/make',
      payload : {
        name: 'hank',
        type: 'propane'
      }
    }, function (response) {
      server.inject({
        method: 'POST',
        url: '/api/pet/update',
        payload: {
          id: JSON.parse(response.payload).id,
          name: 'traitor-hank',
          type: 'charcoal'
        }
      }, function (resp) {
        assert.equal(JSON.parse(resp.payload.name), 'traitor-hank')
        assert.equal(JSON.parse(resp.payload.type), 'charcoal')
      })
    })
    done()
  })
})
