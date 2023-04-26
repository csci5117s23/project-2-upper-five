import { useState } from "react";
import * as styles from "./Customize.module.scss"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
    faHatWizard,
    faGlasses,
    faPersonDress,
    faShirt,
    faQuestion,
    faGhost,
    faShoePrints
} from "@fortawesome/free-solid-svg-icons";




export default function CustomizeItem({ itemName, onChecked, onUnchecked }) {
    const [checked, setChecked] = useState(false)
    async function handleOnChange(e) {
        if (e.target.checked) 
            onChecked(e.target.value)
        else
            onUnchecked(e.target.value)
        setChecked(e.target.checked)
    }

    function getIcon(itemName) {
        if (itemName == "hat") {
            return <FontAwesomeIcon icon={faHatWizard} />
        } else if (itemName == "glasses") {
            return <FontAwesomeIcon icon={faGlasses} />
        } else if (itemName == "dress") {
            return <FontAwesomeIcon icon={faPersonDress} />
        } else if (itemName == "top") {
            return <FontAwesomeIcon icon={faShirt} />
        } else if (itemName == "bottom") {
            return <FontAwesomeIcon icon={faQuestion} />
        } else if (itemName == "shoes") {
            return <FontAwesomeIcon icon={faShoePrints} />
        } else {
            return <FontAwesomeIcon icon={faGhost} />
        }
    }

    return (
        <>
            <div className={`card ${styles.checkboxItem}`}>
                <label className="checkbox">
                    <input
                     className="checkbox"
                     type="checkbox"
                     name={itemName}
                     value={itemName}
                     onChange={(e) => handleOnChange(e)} />
                     &nbsp;&nbsp;
                     {itemName}
                     &nbsp;&nbsp;
                     { getIcon(itemName) }
                </label>
            </div>
        </>
    )
}