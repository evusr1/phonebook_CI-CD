const PersonForm = ({ handleSubmit, nameEvent, numberEvent }) =>
  <form onSubmit={handleSubmit}>
    <div>
      name: <input value={nameEvent.newName} onChange={nameEvent.handleNameChange}/>
    </div>
    <div>
      number: <input value={numberEvent.newPhone} onChange={numberEvent.handlePhoneChange}/>
    </div>
    <div>
      <button type="submit">add</button>
    </div>
  </form>

export default PersonForm