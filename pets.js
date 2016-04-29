'use strict'

module.exports = function() {
  var seneca = this
  seneca.add('role:pets,cmd:load',load)
  seneca.add('role:pets,cmd:save', save)
  seneca.add('role:pets,cmd:list', list)
  seneca.add('role:pets,cmd:remove', remove)

  return {
    name: 'pets'
  }
}

function save (data, done) {
/*  if (data.store.indexOf(data.toBeSaved) > -1) {
    data.store[data.store.indexOf(data.toBeSaved)] = data.toBeSaved
  }
  else {
    data.store.add(data.toBeSaved)
  }
  done('saved')*/
  console.log(data)
  done('saved')
}
function load (store, toBeLoaded, done) {
  if (store.indexOf(toBeLoaded) > -1) {
    return done(store.indexOf(toBeLoaded))
  }
  else {
    return done('not found')
  }
}
function list (store, done) {
  var string = ''
  for (var i = 0; i < store.size; i++) {
    string = string + store[i].toString()
  }
  done(string)
}
function remove(store, toBeRemoved, done) {
  if (store.indexOf(toBeRemoved) > -1) {
    store[store.indexOf(toBeRemoved)] = toBeRemoved
  }
  else {
    store.splice(store.indexOf(toBeRemoved), 1)
  }
  done()
}
