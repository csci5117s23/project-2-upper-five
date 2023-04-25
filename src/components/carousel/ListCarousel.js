import { useState, useEffect } from "react"
import ImageCarousel from "./ImageCarousel"
import { useAuth } from "@clerk/nextjs";
import { postFetcher } from "@/modules/fetcher";
import { useRouter } from "next/router";

export default function ListCarousel({typeList}){
    const { getToken } = useAuth();
	const [token, setToken] = useState(null);
    const router = useRouter();
    var init_states = {}
    typeList.forEach((type)=>{
        init_states[type] = undefined;
    })
    const [indicies, setIndices] = useState(init_states);
	
    useEffect(() => {
		async function process() {
			const myToken = await getToken({ template: "codehooks" });
			setToken(myToken);
		}
		process();
	}, [getToken]);
    
    function updateItem(key, id){
        let indiciesCopy = {...indicies};
        indiciesCopy[key] = id;
        setIndices(()=>indiciesCopy);
    }
    
    async function saveOutfit(e){ 
        e.preventDefault();
        // first remove outfits from type list that don't have data i.e. indicies[type] === false
        const newTypeList =  typeList.filter((type)=> indicies[type] !== false);
        // Lets build a POST request
        let items = [];
	    let typeOrder = []; 
        let outfitName = document.getElementById("outfitName").value;
        newTypeList.forEach((type)=>{
            if(indicies[type] === undefined){
                const element_id = document.getElementById(`init-${type}`).innerHTML;
                const img_id = element_id.split("-")[1];
                items.push(img_id);
                typeOrder.push(type);
            }
            else {
                items.push(indicies[type]);
                typeOrder.push(type);
            }
        });
        const requestBody = {
            userId:"tempVal",           // will be updated correctly by middleware
            items:items,
            typeOrder:typeOrder,
            name:outfitName 
        };

        if(typeOrder.length === 0 || items.length === 0){
            alert("You cannot save outfits until you add wardrobe items");
        } 
        else {
            let response = await postFetcher([
                `${process.env.NEXT_PUBLIC_API_URL}/outfits`,
                token,
                requestBody,
            ]);
            console.log("Response: " + JSON.stringify(response));
    
            router.push("/saved"); // redirect to saved outfit tab
        }
    }
  
    return <>
        <form onSubmit={saveOutfit}>
            <div className="field">
                <label className="label">Outfit Name</label>
                <div className="control">
                    <input className="input" type="text" id="outfitName" required></input>
                </div>
            </div>
            { typeList.map((type) => {
                return <ImageCarousel key={`imageCarousel-${type}`} type={type} updateItem={updateItem}></ImageCarousel>
            })}
            <div className="field">
                <p className="control">
                    <button type="submit" className="button is-success">
                        Finish
                    </button>
                </p>
            </div>
        </form>
    </>
}