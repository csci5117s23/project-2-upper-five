import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import * as styles from "./ImageCarousel.module.scss";

export default function ImageCarousel({type,updateItem}){
    const fake_data = {
        top: [ 
            {"url":"https://moodle.com/wp-content/uploads/2021/06/22087-11.jpg", "id":"img1-top"},
            {"url": "https://cdn.pixabay.com/photo/2016/04/19/13/39/store-1338629_1280.jpg", "id":"img2-top"}
        ],
        bottom: [
            {"url":"https://cdn5.vectorstock.com/i/1000x1000/21/49/cartoon-light-brown-jogger-pants-vector-29562149.jpg", "id":"img1"},
            {"url": "https://freesvg.org/img/Basic-Black-Pants.png", "id":"img2"}
        ],
        shoes: [
            {"url": "https://cdn.pixabay.com/photo/2013/07/12/18/20/shoes-153310_1280.png", "id":"shoes1"},
            {"url": "https://cdn.pixabay.com/photo/2016/12/10/16/57/shoes-1897708_1280.jpg", "id":"shoes2"}
        ],
        glasses: [
            {"url": "https://cdn.pixabay.com/photo/2014/04/03/11/38/sunglasses-312051_1280.png", "id":"glasses1"},
            {"url": "https://cdn.pixabay.com/photo/2014/04/02/10/43/sunglasses-304365__480.png", "id":"glasses2"}
        ],
        dress: [
            {"url": "https://cdn.pixabay.com/photo/2013/07/13/12/49/celebration-160402_1280.png", "id":"dress1"},
            {"url": "https://cdn.pixabay.com/photo/2013/07/12/15/40/gown-150290_1280.png", "id":"dress2"}
        ],
        hat: [
            {"url": "https://cdn.pixabay.com/photo/2013/07/13/10/41/hat-157581__480.png", "id":"hat1"},
            {"url": "https://cdn.pixabay.com/photo/2014/04/02/10/38/cap-304059_1280.png", "id":"hat1"}
        ]   
    }

    function handleChange(index, item){
        const element_id = item.props.children[0].key;
        const image_id = element_id.split("img-")[1];
        updateItem(type,image_id);
    }

    return (
        <>
            <h2 className={`title is-2 ${styles.heading}`}>{type}</h2>
            <div className={styles.container} key={`outer-div-${type}`}>
                <div className={styles.containerItem} key={`inner-div-${type}`}>
                    <Carousel id={`carousel-${type}`} showArrows={true} onChange={handleChange} key={`carousel-${type}`}>
                        {fake_data[type].map((item) => {
                            return <div key={`carousel-item-div-${item.id}`}>
                                    <img id={`img-${item.id}`} key={`img-${item.id}`} src={item.url}/>
                                    <p  id={`legend-${item.id}`} key={`legend-${item.id}`} className="legend">{item.name}</p>
                                </div>
                        })}
                    </Carousel>
                </div>
            </div>
        </>
    )
}