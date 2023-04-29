import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClothesHanger, faPencil, faEnvelope, faShirt, faIceSkate } from "@fortawesome/free-solid-svg-icons";

function SavedItem({ item }) {
    // const { data, error } = useSWRImmutable(item.downloadUrl, imageFetcher);
    // item is the outfitSchema
    // outfitSchema = object({
    //     userId: string().required(),
    //     name: string().required().max(100),
    //     items: array().of(string()).required(),
    //     typeOrder: array().of(string()).required(),
    //     dateAdded: date()
    //         .required()
    //         .default(() => new Date()),
    //     _id: unique id
    return (
        <div className="card columns is-mobile">
            <div className="column">
                <span>
                    <FontAwesomeIcon icon={faShirt} />
                </span>
                {/* show thumbnail */}
                {/* <img src={item.thumbnail} alt={item.name} /> */}
            </div>
            <div className="column">
                <div className="content">
                    <p>Outfit Name: {item.name}</p>
                </div>
            </div>
            <div className="column">
                {/* create a button that links to filter page */}
                <button type="button">
                    <Link href={`../outfits/${item._id}`}>Go to Outfits</Link>
                </button>
            </div>
        </div>
    );
}

export default SavedItem; 
