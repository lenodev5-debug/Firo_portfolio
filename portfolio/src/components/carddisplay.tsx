import Mobile from '../assets/icon/mobile.png'
import Cube from '../assets/icon/cube.png'
import Web from '../assets/icon/web-design (1).png'

export default function CardDisplay() {
    return (
        <div className="card-display">
            <div className="card">
                <img src={Web} alt="" />
                <h1>Full-Stack developement</h1>
                <h3>{3} projects</h3>
            </div>
            <div className="card">
                <img src={Cube} alt="" />
                <h1>Product Design</h1>
                <h3>{12} projects</h3>
            </div>
            <div className="card">
                <img src={Mobile} alt="" />
                <h1>Mobile App developement</h1>
                <h3>{1} projects</h3>
            </div>
        </div>
    );
}