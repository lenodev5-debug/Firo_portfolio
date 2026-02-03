import { useEffect, useState } from 'react';

export default function Loading({ onLoadingComplete }) {
    const [progress, setProgress] = useState(0);
    const [loadedAssets, setLoadedAssets] = useState([]);
    
    useEffect(() => {
        // ✅ CRITICAL FIX: Use environment variable
        const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4444';
        
        document.body.style.backgroundColor = '#000000';
        document.body.style.backgroundImage = 'none';
        document.body.style.overflow = 'hidden';
        
        const startTime = Date.now();
        
        // Progress interval
        const progressInterval = setInterval(() => {
            setProgress(prev => {
                if (prev >= 100) {
                    clearInterval(progressInterval);
                    return 100;
                }
                return prev + 1;
            });
        }, 30);
        
        async function fetchData() {
            try {
                // ✅ CRITICAL FIX: Use environment variable for all endpoints
                const endpoints = [
                    `${API_BASE_URL}/api/user-services`,
                    `${API_BASE_URL}/api/owners`,
                    `${API_BASE_URL}/api/users`,
                    `${API_BASE_URL}/api`
                ];
                
                // ✅ OPTIONAL IMPROVEMENT: Better error handling
                const [userServicesRes, ownersRes, usersRes, achievementsRes] = await Promise.allSettled([
                    fetch(endpoints[0]),
                    fetch(endpoints[1]),
                    fetch(endpoints[2]),
                    fetch(endpoints[3])
                ]);
                
                // Process responses with error tolerance
                const processResponse = (result) => {
                    if (result.status === 'fulfilled') {
                        const response = result.value;
                        if (response.ok) {
                            return response.json();
                        }
                        console.warn('API response not OK:', response.status);
                        return { success: false, status: response.status };
                    }
                    console.warn('Fetch failed:', result.reason);
                    return { success: false, error: result.reason.message };
                };
                
                const [userServices, owners, users, achievements] = [
                    processResponse(userServicesRes),
                    processResponse(ownersRes),
                    processResponse(usersRes),
                    processResponse(achievementsRes)
                ];
                
                // Combine all data
                const allData = {
                    userServices,
                    owners,
                    users,
                    achievements
                };
                
                // Calculate remaining time
                const elapsedTime = Date.now() - startTime;
                const remainingTime = Math.max(0, 3000 - elapsedTime);
                
                // Wait remaining time if needed
                if (remainingTime > 0) {
                    await new Promise(resolve => setTimeout(resolve, remainingTime));
                }
                
                if (onLoadingComplete) {
                    onLoadingComplete(allData);
                }
                
            } catch (error) {
                console.error("Error fetching data:", error);
                const elapsedTime = Date.now() - startTime;
                const remainingTime = Math.max(0, 3000 - elapsedTime);
                
                if (remainingTime > 0) {
                    await new Promise(resolve => setTimeout(resolve, remainingTime));
                }
                
                if (onLoadingComplete) {
                    onLoadingComplete(null);
                }
            }
            
            // Finish loading
            setProgress(100);
            
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
            
            clearInterval(progressInterval);
        }
        
        // Preload all images and videos before fetching data
        async function preloadAssets() {
            // Home page images
            const homeImages = [
                '/src/assets/Image/html.jpg',
                '/src/assets/Image/images (1).png',
                '/src/assets/Image/javascritp.png',
                '/src/assets/Image/python1.png',
                '/src/assets/Image/nodejs.jpg',
                '/src/assets/Image/tailwindcss.jpg',
                '/src/assets/Image/arduino.png',
                '/src/assets/Image/github.jpg',
                '/src/assets/Image/expressjs.jpg',
                '/src/assets/Image/figma.png',
                '/src/assets/Image/ps ai ps.png'
            ];
            
            // CardDisplay icons
            const cardImages = [
                '/src/assets/icon/mobile.png',
                '/src/assets/icon/cube.png',
                '/src/assets/icon/web-design (1).png'
            ];
            
            // About icons
            const aboutIcons = [
                '/src/assets/icon/socialmedia/instagram (1).png',
                '/src/assets/icon/socialmedia/facebook.png',
                '/src/assets/icon/socialmedia/linkedin (1).png'
            ];
            
            // Service icons
            const serviceIcons = [
                '/src/assets/icon/web.png',
                '/src/assets/icon/graphic-design.png',
                '/src/assets/icon/smartphone (2).png',
                '/src/assets/icon/menu.png',
                '/src/assets/icon/ECX_1617_Domain_Hero.png'
            ];
            
            // Contact video
            const video = '/src/assets/video/contact.mp4';
            
            // Background image
            const backgroundImage = '/src/assets/bak/hero-bg.jpg';
            
            // Combine all assets
            const allAssets = [
                ...homeImages,
                ...cardImages,
                ...aboutIcons,
                ...serviceIcons,
                backgroundImage,
                video
            ];
            
            // Preload images
            const imagePromises = allAssets
                .filter(asset => !asset.endsWith('.mp4'))
                .map(asset => {
                    return new Promise((resolve, reject) => {
                        const img = new Image();
                        img.src = asset;
                        img.onload = () => {
                            setLoadedAssets(prev => [...prev, asset]);
                            resolve(asset);
                        };
                        img.onerror = () => {
                            console.warn(`Failed to load image: ${asset}`);
                            resolve(null);
                        };
                    });
                });
            
            // Preload video
            const videoPromise = new Promise((resolve, reject) => {
                const videoElement = document.createElement('video');
                videoElement.preload = 'auto';
                videoElement.src = video;
                videoElement.oncanplaythrough = () => {
                    setLoadedAssets(prev => [...prev, video]);
                    resolve(video);
                };
                videoElement.onerror = () => {
                    console.warn(`Failed to preload video: ${video}`);
                    resolve(null);
                };
                // Trigger video loading
                videoElement.load();
            });
            
            try {
                // Start preloading
                await Promise.all([...imagePromises, videoPromise]);
                console.log('All assets preloaded:', loadedAssets.length, 'items');
                
                // Now fetch API data
                await fetchData();
            } catch (error) {
                console.error('Error in preloading:', error);
                // Continue with loading even if preloading fails
                await fetchData();
            }
        }
        
        preloadAssets();
        
        return () => {
            clearInterval(progressInterval);
            document.body.style.backgroundColor = '';
            document.body.style.backgroundImage = '';
            document.body.style.overflow = '';
        };
    }, [onLoadingComplete]);

    // ✅ KEEP ALL YOUR ORIGINAL STYLES
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
                <div style={{
                    color: "#ffffff", 
                    position: "absolute", 
                    bottom: "10%", 
                    fontSize: "30px", 
                    fontFamily: "ICA Rubrik, sans-serif"
                }}>
                    loading... {progress}%
                </div>
            </div>
        </div>
    );
}