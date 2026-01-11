export default function ProjectDisplay(){
    return(
        <div className="continier-project">
            <div className="display-card">
    <div className='display-img-one'>
        <img src="../src/assets/uplaods/Travel.jpg" alt="Travel destination" />
        <h1>25k Visitors Trust Us</h1>
        <h1>For Memorable Journeys</h1>
        <button>Explore Destinations</button>
        <p>Discover the best travel experiences tailored for you and your family. Unforgettable adventures await.</p>
    </div>
    <div className='display-img-two'>
        <img src="../src/assets/uplaods/Adventure.jpg" alt="Featured adventure" />
        <div className="image-overlay">
            <h3>Featured Destination</h3>
            <p>Top rated by our community</p>
        </div>
    </div>
</div>
            
            <div className="display-card-two">
                <div className="pro-items i1">
                    <img src="../src/assets/uplaods/clothes.jpg" alt="Tropical getaway" />
                    <div className="dips-desc">
                        <h4>Clothes Shpoe</h4>
                        <p>Beachfront resorts & crystal waters</p>
                    </div>
                </div>
                <div className="pro-items i2">
                    <img src="../src/assets/uplaods/comsmotice.jpg" alt="Mountain adventure" />
                    <div className="dips-desc">
                        <h4>Cosmotice shope</h4>
                        <p>Breathtaking hikes & cozy lodges</p>
                    </div>
                </div>
                <div className="pro-items i3">
                    <img src="../src/assets/uplaods/travel.jpg" alt="Cultural experience" />
                    <div className="dips-desc">
                        <h4>Travel website</h4>
                        <p>Historical sites & local traditions</p>
                    </div>
                </div>
                <div className="pro-items i4">
                    <img src="../src/assets/uplaods/shoes.jpg" alt="City exploration" />
                    <div className="dips-desc">
                        <h4>Shoes shope</h4>
                        <p>City lights & vibrant nightlife</p>
                    </div>
                </div>
                <div className="pro-items i5">
                    <img src="../src/assets/uplaods/student.png" alt="Romantic getaway" />
                    <div className="dips-desc">
                        <h4>SChool App</h4>
                        <p>Intimate settings & special moments</p>
                    </div>
                </div>
            </div>
        </div>
    )
}