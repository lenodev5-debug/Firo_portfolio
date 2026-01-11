import { useEffect } from 'react';

export default function Loading() {
    useEffect(() => {
        document.body.style.backgroundColor = '#000000';
        document.body.style.backgroundImage = 'none';
        document.body.style.overflow = 'hidden';
        
        const timer = setTimeout(() => {
            document.body.style.backgroundColor = '#333333';
            document.body.style.backgroundImage = "url('../assets/bak/hero-bg.jpg')";
            document.body.style.overflow = '';
            
            const loadingElement = document.querySelector('.loading-wrapper');
            if (loadingElement instanceof HTMLElement) {
                loadingElement.style.opacity = '0';
                loadingElement.style.visibility = 'hidden';
                
                setTimeout(() => {
                    loadingElement.remove();
                }, 500);
            }
        }, 3000); 

        return () => {
            clearTimeout(timer);
            document.body.style.backgroundColor = '';
            document.body.style.backgroundImage = '';
            document.body.style.overflow = '';
        };
    }, []);

    return (
        <div className="loading-wrapper">
            <div className="main">
                <div className="up">
                    <div className="loaders">
                        <div className="loader"></div>
                        <div className="loader"></div>
                        <div className="loader"></div>
                        <div className="loader"></div>
                        <div className="loader"></div>
                        <div className="loader"></div>
                        <div className="loader"></div>
                        <div className="loader"></div>
                        <div className="loader"></div>
                        <div className="loader"></div>
                    </div>
                    <div className="loadersB">
                        <div className="loaderA">
                            <div className="ball0"></div>
                        </div>
                        <div className="loaderA">
                            <div className="ball1"></div>
                        </div>
                        <div className="loaderA">
                            <div className="ball2"></div>
                        </div>
                        <div className="loaderA">
                            <div className="ball3"></div>
                        </div>
                        <div className="loaderA">
                            <div className="ball4"></div>
                        </div>
                        <div className="loaderA">
                            <div className="ball5"></div>
                        </div>
                        <div className="loaderA">
                            <div className="ball6"></div>
                        </div>
                        <div className="loaderA">
                            <div className="ball7"></div>
                        </div>
                        <div className="loaderA">
                            <div className="ball8"></div>
                        </div>
                    </div>
                </div>
                  <div style={{color: "#ffffff", position: "absolute", bottom: "10%", fontSize:"30px", fontFamily: "ICA Rubrik, sans-serif"}}>
                  loading...  
                  </div>         
            </div>
        </div>
    );
}