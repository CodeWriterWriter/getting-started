var seneca = require('seneca')()
seneca.use('./pets.js')

var pet1 = {
  name: null,
  type: null
}
pet1.name = 'bojack'
pet1.type = 'horse'
var pet2 = {
  name: 'kitty',
  type: 'cat'
}
var pet3 = {
  name: 'doberman',
  type: 'dog'
}
var store = []
seneca.act({role: 'pets', cmd: 'saved', data: pet1},  function (data) {
  console.log(data)
})

seneca.act('role:pets,cmd:list', store, function(data){
  console.log(data)
})
