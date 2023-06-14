const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Person = require('../models/person')
const api = supertest(app)

test('persons are returned as json', async () => {
  await api
    .get('/api/persons')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

const newTestPerson = {
  name: 'Testman',
  number: '10-123456'
}

const sanitizePhonebook = (phonebook) => {
  return phonebook.body.map(entry => {
    const newEntry = { ...entry }
    delete newEntry.id
    return newEntry
  })
}

const peopleInDb = async () => {
  const book = await Person.find({})
  return book.map(person => person.toJSON())
}

beforeEach(async () => {
  await Person.deleteMany({})
})


describe('CRUD', () => {
  beforeEach(async () => {
    const newPerson = new Person(newTestPerson)
    await newPerson.save()
  })

  test('CREATE entry', async () => {
    const createTestPerson = {
      name: 'CreateTest',
      number: '10-654321'
    }

    const initialBook = await peopleInDb()

    await api
      .post('/api/persons')
      .send(createTestPerson)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const responsePhonebook = await api
      .get('/api/persons')

    expect(responsePhonebook.body).toHaveLength(initialBook.length + 1)

    const contentObjects = sanitizePhonebook(responsePhonebook)
    expect(contentObjects).toContainEqual(createTestPerson)
  })

  test('RETRIEVE entry', async () => {
    const responsePhonebook = await api
      .get('/api/persons')
      .expect(200)

    const contentObjects = sanitizePhonebook(responsePhonebook)

    expect(contentObjects).toContainEqual(newTestPerson)

  })

  test('UPDATE entry', async () => {
    const initialBook = await peopleInDb()
    const blogToUpdate = {
      ...initialBook[0], number: '10-654321'
    }

    const response = await api
      .put(`/api/persons/${blogToUpdate.id}`)
      .send(blogToUpdate)
      .expect('Content-Type', /application\/json/)

    expect(response.body.number).toBe('10-654321')
  })

  test('DELETE entry', async () => {
    const initialBook = await peopleInDb()
    const blogToDelete = initialBook[0]

    await api
      .delete(`/api/persons/${blogToDelete.id}`)
      .expect(204)

    const responsePhonebook = await api
      .get('/api/persons')

    expect(responsePhonebook.body).toHaveLength(initialBook.length - 1)

    const contentObjects = sanitizePhonebook(responsePhonebook)
    expect(contentObjects).not.toContainEqual(blogToDelete)
  })
})

describe('Input validation', () => {
  test('fail less than 3 name', async () => {
    const createTestPerson = {
      name: 'bo',
      number: '10-654321'
    }

    await api
      .post('/api/persons')
      .send(createTestPerson)
      .expect(400)
  })

  test('fail less than 8 number', async () => {
    const createTestPerson = {
      name: 'CreateTest',
      number: '10-1234'
    }

    await api
      .post('/api/persons')
      .send(createTestPerson)
      .expect(400)
  })

  test('fail number with less than 2 on first section', async () => {
    const createTestPerson = {
      name: 'CreateTest',
      number: '1-123456'
    }

    await api
      .post('/api/persons')
      .send(createTestPerson)
      .expect(400)
  })

  test('fail number with more than 3 on first section', async () => {
    const createTestPerson = {
      name: 'CreateTest',
      number: '1000-123456'
    }

    await api
      .post('/api/persons')
      .send(createTestPerson)
      .expect(400)
  })
})

afterAll(async () => {
  await mongoose.connection.close()
})