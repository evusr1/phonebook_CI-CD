const PersonForm = ({ handleSubmit, nameEvent, numberEvent }) =>
  <form onSubmit={handleSubmit}>
    <div>
      name: <input id="name" value={nameEvent.newName} onChange={nameEvent.handleNameChange}/>
    </div>
    <div>
      number: <input id="number" value={numberEvent.newPhone} onChange={numberEvent.handlePhoneChange}/>
    </div>
    <div>
      <button id="add-button" type="submit">add</button>
    </div>
  </form>

export default PersonForm