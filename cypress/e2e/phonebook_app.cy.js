describe('Phonebook app', function() {
  beforeEach(function() {
    cy.request('POST', 'http://localhost:3001/api/testing/reset')
    cy.visit('http://localhost:3001')
  })
  it('front page can be opened', function() {
    cy.contains('Phonebook')
    cy.contains('add a new')
    cy.contains('Numbers')
  })

  it('can create entries', function() {
    cy.get('#name').type('mluukkai')
    cy.get('#number').type('10-123456')

    cy.get('#add-button').click()
    cy.contains('Added mluukkai')

    cy.get('#name').type('bob')
    cy.get('#number').type('10-123456')

    cy.get('#add-button').click()
    cy.contains('Added bob')

    cy.contains('mluukkai 10-123456')
    cy.contains('bob 10-123456')
  })
  describe('Input validation', function() {
    it('Fails on invalid numbers', function() {
      cy.get('#name').type('bob')
      cy.get('#add-button').click()
      cy.contains('Path `number` is required.')

      cy.get('#number').type('10-123')
      cy.get('#add-button').click()
      cy.contains('Person validation failed: number: Path `number` (`10-123`) is shorter than the minimum allowed length (8).')

      cy.get('#number').clear()
      cy.get('#number').type('1-12345678')
      cy.get('#add-button').click()
      cy.contains('Person validation failed: number: 1-12345678 is not a valid phone number!')
    })

    it('Fails on invalid names', function() {
      cy.get('#number').type('10-123456')

      cy.get('#add-button').click()
      cy.contains('Path `name` is required.')

      cy.get('#name').type('bo')
      cy.get('#add-button').click()
      cy.contains('Person validation failed: name: Path `name` (`bo`) is shorter than the minimum allowed length (3).')
    })
  })
})

describe('Phoneboook app - Multiple entries', function() {
  beforeEach(function() {
    cy.request('POST', 'http://localhost:3001/api/testing/reset')
    const person1 = {
      name: 'mluukkai',
      number: '10-123456'
    }
    cy.request('POST', 'http://localhost:3001/api/persons', person1)

    const person2 = {
      name: 'bob',
      number: '10-123456'
    }
    cy.request('POST', 'http://localhost:3001/api/persons', person2)
    cy.visit('http://localhost:3001')
  })

  it('can delete entry', function() {
    cy.contains('mluukkai 10-123456').contains('delete').click()

    cy.contains('mluukkai 10-123456').should('not.exist')
    cy.contains('bob 10-123456')
  })

  it('can filter entries', function() {
    cy.contains('filter shown with')

    cy.get('#filter').type('bob')
    cy.contains('mluukkai 10-123456').should('not.exist')
    cy.contains('bob 10-123456')
  })

  describe('Changing entries', function() {
    beforeEach(function() {
      cy.get('#name').type('bob')
      cy.get('#number').type('10-654321')
      cy.get('#add-button').click()
    })
    it('can cancel change', function() {
      cy.on('window:confirm', (text) => {
        expect(text).to.contains('bob is already added to the phonebook, replace the old number with the new one?')
        return false
      })

      cy.contains('bob 10-123456')
    })
    it('can confirm change', function() {
      cy.on('window:confirm', (text) => {
        expect(text).to.contains('bob is already added to the phonebook, replace the old number with the new one?')
      })

      cy.contains('bob 10-654321')
    })
  })
})