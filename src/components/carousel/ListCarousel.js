import { useState } from "react"
import ImageCarousel from "./ImageCarousel"
import { useEffect} from "react";
import { useAuth } from "@clerk/nextjs";
import useSWR from "swr";

export default function ListCarousel({typeList}){
    const { getToken } = useAuth();
	const [token, setToken] = useState(null);
	
    useEffect(() => {
		async function process() {
			const myToken = await getToken({ template: "codehooks" });
			setToken(myToken);
		}
		process();
	}, [getToken]);

    let init_states = {}
    typeList.forEach((type)=>{
        init_states[type] = undefined;
    })
    const [indicies, setIndices] = useState(init_states);
    
    function updateItem(key, id){
        let indiciesCopy = {...indicies};
        indiciesCopy[key] = id;
        setIndices({...indiciesCopy});
    }
    
    useEffect(()=>{
        if(token){
            typeList.forEach((type)=>{
                if(indicies[type]=== undefined){
                    fetch(`${process.env.NEXT_PUBLIC_API_URL}/items?type=${type}&sort=dateAdded&limit=1&offset=0`, {
                        method:"GET",
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'application/json', 
                        },
                    }).then(response => response.json())
                    .then(json =>{
                        console.log(json[0]);
                        updateItem(type,json[0]);
                    });
                }
            })
        }
    },[token]);

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