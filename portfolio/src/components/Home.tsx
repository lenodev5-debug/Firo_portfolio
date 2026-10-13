
import Html from '../assets/Image/html.jpg';
import Css from '../assets/Image/images (1).png';
import Javascript from '../assets/Image/javascritp.png';
import Python from '../assets/Image/python1.png';
import Nodejs from '../assets/Image/nodejs.jpg';
import Tailwindcss from '../assets/Image/tailwindcss.jpg';
import Arduino from '../assets/Image/arduino.png';
import Github from '../assets/Image/github.jpg';
import Expressjs from '../assets/Image/expressjs.jpg';
import Figma from '../assets/Image/figma.png';
import PSBoth from '../assets/Image/ps ai ps.png';

import StarryNight from './bg/background';

export default function Home() {
  return (
    <section className="home-section">
      <StarryNight />

      <div className="home-content">
        <div className="banner">
          <div
            className="slider"
            style={{ "--quantity": 11 } as React.CSSProperties}
          >
            <div className="item" style={{ "--position": 1 } as React.CSSProperties}>
              <img src={Html} alt="HTML" />
            </div>

            <div className="item" style={{ "--position": 2 } as React.CSSProperties}>
              <img src={Css} alt="CSS" />
            </div>

            <div className="item" style={{ "--position": 3 } as React.CSSProperties}>
              <img src={Python} alt="Python" />
            </div>

            <div className="item" style={{ "--position": 4 } as React.CSSProperties}>
              <img src={Javascript} alt="JavaScript" />
            </div>

            <div className="item" style={{ "--position": 5 } as React.CSSProperties}>
              <img src={Nodejs} alt="Node.js" />
            </div>

            <div className="item" style={{ "--position": 6 } as React.CSSProperties}>
              <img src={Tailwindcss} alt="Tailwind CSS" />
            </div>

            <div className="item" style={{ "--position": 7 } as React.CSSProperties}>
              <img src={Arduino} alt="Arduino" />
            </div>

            <div className="item" style={{ "--position": 8 } as React.CSSProperties}>
              <img src={Github} alt="GitHub" />
            </div>

            <div className="item" style={{ "--position": 9 } as React.CSSProperties}>
              <img src={Expressjs} alt="Express.js" />
            </div>

            <div className="item" style={{ "--position": 10 } as React.CSSProperties}>
              <img src={Figma} alt="Figma" />
            </div>

            <div className="item" style={{ "--position": 11 } as React.CSSProperties}>
              <img src={PSBoth} alt="Photoshop and Illustrator" />
            </div>
          </div>

          <div className="content">
            <div className="author">
              <h1 data-content="Hello i'm firomsa">
                Hello i'm firomsa
              </h1>

              <h2>Web Developer</h2>
            </div>

            <div className="model"></div>

            <div className="section-button">
              <button className="btn">
                <a href="/">Get Projects</a>
              </button>

              <button className="btn">
                <a href="/">Download CV</a>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
