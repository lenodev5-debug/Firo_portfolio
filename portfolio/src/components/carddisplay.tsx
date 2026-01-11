export default function CardDisplay() {
    return (
        <div className="card-display">
            <div className="card">
                <img src="../src/assets/icon/web-design (1).png" alt="" />
                <h1>Full-Stack developement</h1>
                <h3>{3} projects</h3>
            </div>
            <div className="card">
                <img src="../src/assets/icon/cube.png" alt="" />
                <h1>Product Design</h1>
                <h3>{12} projects</h3>
            </div>
            <div className="card">
                <img src="../src/assets/icon/mobile-development.png" alt="" />
                <h1>Mobile App developement</h1>
                <h3>{1} projects</h3>
            </div>
        </div>
    );
}