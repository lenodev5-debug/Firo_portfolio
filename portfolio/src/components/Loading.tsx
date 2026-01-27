import { useEffect, useState } from 'react';

export default function Loading({ onLoadingComplete }) {
    const [progress, setProgress] = useState(0);
    
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
        
        fetchData();
        
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