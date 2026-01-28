import Mobile from '../assets/icon/mobile.png';
import Cube from '../assets/icon/cube.png';
import Web from '../assets/icon/web-design (1).png';
import { useEffect, useState } from 'react';
import axios from 'axios';

interface Service {
    _id: string;
    serviceType: 'web' | 'mobile' | 'design';
    // other properties...
}

export default function CardDisplay() {
    const [count, setCount] = useState({ web: 0, mobile: 0, design: 0 });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCounts = async () => {
            try {
                const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://lenodev-production.up.railway.app';
                
                // Option 1: Try the stats endpoint first
                try {
                    const statsResponse = await axios.get(`${API_BASE_URL}/api/user-services/stats/count-by-type`);
                    if (statsResponse.data.success) {
                        const countObj = { web: 0, mobile: 0, design: 0 };
                        statsResponse.data.data.forEach((item: any) => {
                            countObj[item._id] = item.count;
                        });
                        setCount(countObj);
                        setLoading(false);
                        return;
                    }
                } catch (statsError) {
                    console.log('Stats endpoint failed, trying services endpoint...');
                }
                
                // Option 2: Fetch all services and count manually (like dashboard does)
                const servicesResponse = await axios.get(`${API_BASE_URL}/api/user-services`);
                if (servicesResponse.data.success) {
                    const services = servicesResponse.data.data;
                    const calculatedCounts = {
                        web: services.filter((s: Service) => s.serviceType === 'web').length,
                        design: services.filter((s: Service) => s.serviceType === 'design').length,
                        mobile: services.filter((s: Service) => s.serviceType === 'mobile').length
                    };
                    setCount(calculatedCounts);
                }
                
            } catch (error) {
                console.error('Error fetching counts:', error);
            } finally {
                setLoading(false);
            }
        };
        
        fetchCounts();
    }, []);

    if (loading) {
        return (
            <div className="card-display">
                <div className="card">
                    <div className="skeleton-img"></div>
                    <h1>Full-Stack Development</h1>
                    <h3>Loading...</h3>
                </div>
                <div className="card">
                    <div className="skeleton-img"></div>
                    <h1>Product Design</h1>
                    <h3>Loading...</h3>
                </div>
                <div className="card">
                    <div className="skeleton-img"></div>
                    <h1>Mobile App Development</h1>
                    <h3>Loading...</h3>
                </div>
            </div>
        );
    }

    return (
        <div className="card-display">
            <div className="card">
                <img src={Web} alt="Web Development" />
                <h1>Full-Stack Development</h1>
                <h3>{count.web} projects</h3>
            </div>
            <div className="card">
                <img src={Cube} alt="Product Design" />
                <h1>Product Design</h1>
                <h3>{count.design} projects</h3>
            </div>
            <div className="card">
                <img src={Mobile} alt="Mobile Development" />
                <h1>Mobile App Development</h1>
                <h3>{count.mobile} projects</h3>
            </div>
        </div>
    );
}