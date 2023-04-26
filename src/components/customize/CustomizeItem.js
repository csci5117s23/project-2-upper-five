import { useState } from "react";
import * as styles from "./Customize.module.scss"

export default function CustomizeItem({ itemName, onChecked, onUnchecked }) {
    const [checked, setChecked] = useState(false)
    async function handleOnChange(e) {
        if (e.target.checked) 
            onChecked(e.target.value)
        else
            onUnchecked(e.target.value)
        setChecked(e.target.checked)
    }
    return (
        <>
            <div className="card checkboxItem">
                <label className="checkbox">
                    <input
                     className="checkbox"
                     type="checkbox"
                     name={itemName}
                     value={itemName}
                     onChange={(e) => handleOnChange(e)} />
                     {itemName}
                </label>
            </div>
        </>
    )
}