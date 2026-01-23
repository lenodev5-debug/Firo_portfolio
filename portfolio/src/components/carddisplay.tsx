import Mobile from '../assets/icon/mobile.png';
import Cube from '../assets/icon/cube.png';
import Web from '../assets/icon/web-design (1).png';
import { useEffect, useState } from 'react';

interface ImportMetaEnv {
    readonly VITE_API_BASE_URL?: string;
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}

export default function CardDisplay() {
    const [count, setCount] = useState({ web: 0, mobile: 0, design: 0 });

    useEffect(() => {
        const fetchCounts = async () => {
            try {
                const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
                
                const response = await fetch(`${API_BASE_URL}/api/user-services/stats/count-by-type`);
                
                if (!response.ok) {
                    throw new Error('Failed to fetch counts');
                }
                
                const result = await response.json();
                
                if (result.success) {
                    const countObj = {};
                    result.data.forEach(item => {
                        countObj[item._id] = item.count;
                    });
                    setCount(countObj);
                }
            } catch (error) {
                console.error('Failed to fetch project counts:', error);
            }
        };
        
        fetchCounts();
    }, []);

    return (
        <div className="card-display">
            <div className="card">
                <img src={Web} alt="" />
                <h1>Full-Stack Development</h1>
                <h3>{count.web || 0} projects</h3>
            </div>
            <div className="card">
                <img src={Cube} alt="" />
                <h1>Product Design</h1>
                <h3>{count.design || 0} projects</h3>
            </div>
            <div className="card">
                <img src={Mobile} alt="" />
                <h1>Mobile App Development</h1>
                <h3>{count.mobile || 0} projects</h3>
            </div>
        </div>
    );
}