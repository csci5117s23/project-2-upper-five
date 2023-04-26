import { useState } from "react";
import * as styles from "./Customize.module.scss"
import CustomizeItem from "./CustomizeItem";

export default function Customize({ typeList, setTypeList }) {
    const allItems = ["hat", "glasses", "dress", "top", "bottom", "shoes"]
    async function insertIntoTypeList(item) {
        let typeListCopy = [...typeList]
        const index = allItems.indexOf(item)
        if (index >= 0) {
            // typeListCopy.splice(index, 0, item)
            typeListCopy.push(item)
            typeListCopy = [...new Set(typeListCopy)]
            typeListCopy.sort(function(a, b) {
                return allItems.indexOf(b) < allItems.indexOf(a) ? 1 : (allItems.indexOf(b) > allItems.indexOf(a) ? -1 : 0)
            })
            setTypeList(typeListCopy)
        } else {
            typeListCopy.push(item)
            typeListCopy = [...new Set(typeListCopy)]
            typeListCopy.sort(function(a, b) {
                return allItems.indexOf(b) < allItems.indexOf(a) ? 1 : (allItems.indexOf(b) > allItems.indexOf(a) ? -1 : 0)
            })
            setTypeList(typeListCopy)
        }
    }

    async function takeOutOfTypeList(item) {
        let typeListCopy = [...typeList]
        const index = typeListCopy.indexOf(item)
        index >= 0 && typeListCopy.splice(index, 1) && setTypeList(typeListCopy)
    }

    const itemCards = allItems.map((item) => (
        <CustomizeItem key={item} itemName={item} onChecked={insertIntoTypeList} onUnchecked={takeOutOfTypeList} />
    ))
    return (
        <>
            {console.log(typeList)}
            <h2>Customize Your Outfit</h2>
            <div className="cards-container">
                {itemCards}
            </div>
        </>
    )

}