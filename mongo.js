const mongoose = require('mongoose')

if(process.argv.length < 3) {
  console.log('Give password as argument')
  process.exit(1)
}

const password = process.argv[2]

const url = `${password}`

mongoose.set('strictQuery', false)
mongoose.connect(url)

const personSchema = new mongoose.Schema({
  number: String,
  name: String
})

const Person = mongoose.model('Person', personSchema)

if(process.argv.length < 4) {
  Person
    .find({})
    .then(persons=> {
      console.log('phonebook:')
      persons.map(person => {
        console.log(`${person.name} ${person.number}`)
      })
      mongoose.connection.close()
      process.exit(1)
    })
} else {
  const name = process.argv[3]
  const number = process.argv[4]

  const person = new Person({
    name: name,
    number: number
  })

  person.save().then(() => {
    console.log(`added ${person.name} ${person.number} to phonebook`)
    mongoose.connection.close()
  })
}