const express = require('express')
var morgan = require('morgan')
var cors = require('cors')
require('dotenv').config()

const app = express()
const Person = require('./models/person')

app.use(express.json())
app.use(express.static('build'))
app.use(cors())

app.use(morgan((tokens, req, res) => {
  let body = req.method==='POST' ? JSON.stringify(req.body) : null
  return [
    tokens.method(req, res),
    tokens.url(req, res),
    tokens.status(req, res),
    tokens.res(req, res, 'content-length'), '-',
    tokens['response-time'](req, res), 'ms',
    body
  ].join(' ')
}))

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error:'malformed id' })
  } else if(error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }

  next(error)
}

app.post('/api/persons', (request, response, next) => {
  const body = request.body
  const person = new Person({
    name: body.name,
    number: body.number
  })

  person.save().then(savedPerson => {
    console.log('person saved!')
    response.json(savedPerson)
  })
    .catch(error => next(error))
})

app.get('/api/persons', (request, response) => {
  Person.find({}).then(persons => {
    response.json(persons)
  })
})

app.get('/api/persons/:id',(request, response, next) => {
  Person.findById(request.params.id).then(person => {
    if(person)
      response.json(person)
    else
      response.status(404).end()
  })
    .catch(error => next(error))
})

app.put('/api/persons/:id', (request, response, next) => {
  const body = request.body

  const person = {
    name: body.name,
    number: body.number
  }

  Person.findByIdAndUpdate(request.params.id, person, { new: true, runValidators: true, context: 'query' })
    .then(updatedPerson => {
      response.json(updatedPerson)
    })
    .catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndRemove(request.params.id)
    .then(() => {
      response.status(204).end()
    })
    .catch(error => next(error))
})

app.get('/info', (request, response) => {
  Person.find({}).then(persons => {
    response.send(`Phonebook has info for ${persons.length} people </br> ${Date(Date.now()).toString()}`)
  })
})

if (process.env.NODE_ENV === 'test') {
  app.post('/api/testing/reset', async (request, response) => {
    await Person.deleteMany({})
    response.status(204).end()
  })
}

app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`server running on port ${PORT}`)
})


