import Link from "next/link";

function SavedItem({ item }) {
    // const { data, error } = useSWRImmutable(item.downloadUrl, imageFetcher);
   
    return (
        <div className="column">
            <div className="card">
                <div className="thumbnail">
                    {/* show thumbnail */}
                    {/* <img src={item.thumbnail} alt={item.name} /> */}
                </div>
                <div className="card-content">
                    <div className="content">
                        <p>Outfit Name: {item.name}</p>
                    </div>
                </div>
                <div className="view-link">
                    {/* create a button that links to filter page */}
                    <button type="button">
                        <Link href={`../outfits`}>Go to Outfits</Link>
                    </button>
                </div>
            </div>
        </div>
    );
}

export default SavedItem; 
