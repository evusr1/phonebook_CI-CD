const Filter = ({ handleValue,handleChange }) =>
  <div>
    filter shown with <input id="filter" value={handleValue} onChange={handleChange}/>
  </div>

export default Filter