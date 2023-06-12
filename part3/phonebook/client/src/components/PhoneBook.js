const Person = ({person, handleDelete}) =>
  <div>
    {person.name} {person.number} <button onClick={handleDelete}>delete</button>
  </div>

const PhoneBook = ({persons, handleDelete}) => 
  <div>
    {
      persons.map((person) => 
        <Person key={person.id} person={person} handleDelete={() => {handleDelete(person.id)}} />
      )
    }
  </div>

export default PhoneBook