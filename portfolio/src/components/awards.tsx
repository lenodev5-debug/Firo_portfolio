import { useEffect, useState } from 'react';

interface Achievement {
    _id: string;
    title: string;
    description: string;
    image: string;
}

export default function Awards() {
    const [awards, setAwards] = useState<Achievement[]>([]);
    const [loading, setLoading] = useState(false);
    
    useEffect(() => {
        const fetchAwards = async () => {
            setLoading(true);
            try {
                const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4444';
                const response = await fetch(`${API_BASE_URL}/api/achievements`);
                
                if (response.ok) {
                    const result = await response.json();
                    if (result.success && result.data) {
                        // Fix image paths for uploads/general/
                        const fixedAwards = result.data.map(achievement => {
                            let imageUrl = achievement.image;
                            
                            if (imageUrl) {
                                const baseUrl = API_BASE_URL;
                                
                                // Handle different image path formats
                                if (imageUrl.startsWith('/uploads/')) {
                                    // Already has /uploads/ path
                                    imageUrl = `${baseUrl}${imageUrl}`;
                                } else if (imageUrl.startsWith('http')) {
                                    // Already full URL
                                    // Keep as is
                                } else {
                                    // Just filename, assume uploads/general/
                                    imageUrl = `${baseUrl}/uploads/general/${imageUrl}`;
                                }
                            }
                            
                            return {
                                ...achievement,
                                image: imageUrl
                            };
                        });
                        
                        setAwards(fixedAwards);
                    }
                }
            } catch (error) {
                console.log('Could not fetch awards');
            } finally {
                setLoading(false);
            }
        };

        fetchAwards();
    }, []);

    // Handle image loading errors
    const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>, originalSrc: string) => {
        const img = e.target as HTMLImageElement;
        const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4444';
        
        // Extract filename from original src
        let filename = '';
        if (originalSrc.includes('/')) {
            filename = originalSrc.split('/').pop() || '';
        } else {
            filename = originalSrc;
        }
        
        // Try alternative paths
        if (filename) {
            // First try uploads/general/
            img.src = `${baseUrl}/uploads/general/${filename}`;
            
            // If that fails too, hide the image
            img.onerror = () => {
                img.style.display = 'none';
            };
        }
    };

    if (loading) {
        return (
            <section className="awards-container" id="awards">
                <h1>Awards <span>&</span></h1>
                <h1>Achievements</h1>
                <div>
                    <p style={{ color: '#fff', textAlign: 'center' }}>Loading awards...</p>
                </div>
            </section>
        );
    }

    if (awards.length === 0) {
        return (
            <section className="awards-container" id="awards">
                <h1>Awards <span>&</span></h1>
                <h1>Achievements</h1>
                <div>
                    <p style={{ color: '#ccc', textAlign: 'center' }}>No awards available yet</p>
                </div>
            </section>
        );
    }

    return (
        <section className="awards-container" id="awards">
            <h1>Awards <span>&</span></h1>
            <h1>Achievements</h1>
            
            <div>
                {awards.map((award) => (
                    <img 
                        key={award._id}
                        src={award.image}
                        alt={award.title}
                        title={`${award.title}\n${award.description}`}
                        loading="lazy"
                        onError={(e) => handleImageError(e, award.image)}
                    />
                ))}
            </div>
        </section>
    );
}