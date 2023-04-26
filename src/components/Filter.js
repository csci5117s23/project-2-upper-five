/* Filter.js */
import FilterModal from "./FilterModal";
const { useState } = require("react");

function Filter() {
  
  const [isOpen, setIsOpen] = useState(false);
  const [type, setType] = useState("");
  function filterClothes() {
    // filter clothes
  }

  return (
      <div>
        <div classname="filter">
        <button id="filter-button" onClick={() => setIsOpen(!isOpen)}
          className="filter__button">Filter</button>
        </div>
        {isOpen && (
          <FilterModal 
            show={true}
            onConfirm={() => setIsOpen(!isOpen)}
            onCancel={() => setIsOpen(!isOpen)}
          />
        )}
    </div>
  )
}

// function Form(props) {
//   return (
//     <div>
//       <form>
//         <label for="Occasion">Occasion </label>
//         <select name="Occasion" id="Occasion">
//           <option value="Formal">Formal</option>
//           <option value="Casual">Casual</option>
//           <option value="Business Casual">Business Casual</option>
//         </select>
//         <br/>
//         <br/> 
//         <label for="Type">Type </label>
//         <select name="Type" id="Type">
//           <option value="Top">Top</option>
//           <option value="Bottom">Bottom</option>
//           <option value="Shoes">Shoes</option>
//         </select>
//         <br />
//         <br /> 
//         <label for="name">Seach by name:</label><br/>
//         <input type="text" id="outfit-name" name="outfit-name"/>
//       </form>
//     </div>
//   )
// }

export default Filter;