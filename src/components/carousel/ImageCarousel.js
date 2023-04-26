import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import * as styles from "./ImageCarousel.module.scss";
import { useEffect, useState } from "react";
import { useAuth } from "@clerk/nextjs";
import useSWR from "swr";

export default function ImageCarousel({type,updateItem}){
	const { getToken } = useAuth();
	const [token, setToken] = useState(null);
	const { data, mutate, error } = useSWR(
        `${process.env.NEXT_PUBLIC_API_URL}/items?type=${type}&sort=dateAdded`
	);

	useEffect(() => {
		async function process() {
			const myToken = await getToken({ template: "codehooks" });
			setToken(myToken);
		}
		process();
	}, [getToken]);

    function handleChange(index, item){
        const element_id = item.props.children[0].key;
        const image_id = element_id.split("img-")[1];
        updateItem(type,image_id);
    }

    useEffect(()=>{
        if(data && data.length === 0){ // if there is no data in the category update the attibute to be false
            updateItem(type,false);
        }  
    },[data])

    return (
        <>
            <h2 className={`title is-2 ${styles.heading}`}>{type}</h2>
            {   
                /*This is used for initializing the indicies state in ListCarousel*/
                (data && data.length > 0) && <div className={styles.hide} id={`init-${type}`} key={`key-${data[0]._id}`}>{`init-${data[0]._id}`}</div>
            }
            <div className={styles.container} key={`outer-div-${type}`}>
                <div className={styles.containerItem} key={`inner-div-${type}`}>
                    <Carousel id={`carousel-${type}`} showArrows={true} onChange={handleChange} key={`carousel-${type}`}>
                        { data && data.map((item) => {
                            return <div key={`carousel-item-div-${item._id}`}>
                                    <img id={`img-${item._id}`} key={`img-${item._id}`} src={item.downloadUrl}/>
                                    <p  id={`legend-${item._id}`} key={`legend-${item._id}`} className="legend">{item.name}</p>
                                </div>
                            })
                        }
                    </Carousel>
                    { (data && data.length === 0) && <p className={styles.label}>No images in this category</p>}               
                </div>
            </div>
        </>
    )
}