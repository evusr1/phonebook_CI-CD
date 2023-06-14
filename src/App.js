import { useState, useEffect } from 'react'

import personsService from './services/persons'

import Filter from './components/Filter'
import PersonForm from './components/PersonForm'
import PhoneBook from './components/PhoneBook'


import './index.css'

const Notification = ({ message }) => {

  if(message.message === null)
    return null

  const notificationStyle = {
    color: message.color
  }

  return (
    <div className='notification' style={notificationStyle}>
      {message.message}
    </div>
  )
}

const App = () => {
  const [persons, setPersons] = useState([])

  const [newName, setNewName] = useState('')
  const [newPhone, setNewPhone] = useState('')

  const [searchName, setSearchName] = useState('')

  const [notificationMessage, setNotificationMessage] = useState({
    message: null, color : null
  })

  useEffect(() => {
    personsService
      .getAll()
      .then(initialPersons => setPersons(initialPersons))
  }, [])

  const showNotificationMessage = (message, color) => {
    setNotificationMessage(
      { message, color }
    )
    setTimeout(()=> {
      setNotificationMessage({ ...notificationMessage, message: null })
    }, 5000)
  }

  const addName = (e) => {
    e.preventDefault()

    const oldPerson = persons.find((person) => person.name===newName)
    if(oldPerson) {
      if(window.confirm(`${oldPerson.name} is already added to the phonebook, replace the old number with the new one?`)) {
        const changePerson = { ...oldPerson, number: newPhone }

        personsService
          .update(oldPerson.id, changePerson)
          .then((returnedPerson) => {
            if(!returnedPerson) {
              showNotificationMessage(`Information of ${oldPerson.name} has already been removed from the server.`, 'red')
              setPersons(persons.filter(p => p.id !== oldPerson.id))
              return
            }

            setPersons(persons.map(p => p.id !== oldPerson.id ? p : returnedPerson ))
            setNewName('')
            setNewPhone('')
            showNotificationMessage(`Modified ${returnedPerson.name}`, 'green')
          })
          .catch((e) => {
            if(e.response.status === 400) {
              showNotificationMessage(e.response.data.error, 'red')
              return
            }
            showNotificationMessage(`Information of ${oldPerson.name} has already been removed from the server.`, 'red')
            setPersons(persons.filter(p => p.id !== oldPerson.id))
          })
      }

    } else {
      const nameObject = { name: newName, number: newPhone }

      personsService
        .create(nameObject)
        .then(newPerson => {
          setPersons(persons.concat(newPerson))
          setNewName('')
          setNewPhone('')
          showNotificationMessage(`Added ${newPerson.name}`, 'green')
        })
        .catch(e => {
          showNotificationMessage(e.response.data.error, 'red')
        })

    }
  }

  const removeName = id => {
    const oldPerson = persons.find((person) => person.id===id)

    if(window.confirm(`Delete ${oldPerson.name}?`)) {
      personsService
        .remove(id)
        .then(() => {
          setPersons(persons.filter(p => p.id !== id))
        })
        .catch(() => {
          showNotificationMessage(`Information of ${oldPerson.name} has already been removed from the server.`, 'red')
          setPersons(persons.filter(p => p.id !== id))
        })
    }
  }


  const handleNameChange = (e) =>
    setNewName(e.target.value)

  const handlePhoneChange = (e) =>
    setNewPhone(e.target.value)

  const handleSearchChange = (e) => {
    setSearchName(e.target.value)
  }

  const namesToShow = (searchName==='')
    ? persons
    : persons.filter((person) => person.name.toLowerCase().includes(searchName.toLowerCase()))

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={notificationMessage} />
      <Filter handleValue={searchName} handleChange={handleSearchChange} />

      <h3>add a new</h3>
      <PersonForm
        nameEvent={{
          newName,
          handleNameChange
        }}
        numberEvent={{
          newPhone,
          handlePhoneChange
        }}
        handleSubmit={addName} />

      <h3>Numbers</h3>
      <PhoneBook persons={namesToShow} handleDelete={removeName}/>
    </div>
  )
}

export default App