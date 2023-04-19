import { useState } from "react"
import ImageCarousel from "./ImageCarousel"

export default function ListCarousel({typeList}){
    const [indicies, setIndices] = useState({});
    function updateItem(key, id){
        let indiciesCopy = {...indicies};
        indiciesCopy[key] = id;
        setIndices({...indiciesCopy});
    }

    function saveOutfit(){
        console.log(indicies);
        // TODO: make a post request to save outfit name and indicies
    }
    return <>
        <div className="field">
            <label className="label">Outfit Name</label>
            <div className="control">
                <input className="input" type="text" id="outfitName"></input>
            </div>
        </div>
        { typeList.map((type) => {
            return <ImageCarousel key={`imageCarousel-${type}`} type={type} updateItem={updateItem}></ImageCarousel>
        })}
        <div className="field">
            <p className="control">
                <button className="button is-success" onClick={saveOutfit}>
                    Finish
                </button>
            </p>
        </div>
    
    </>
}