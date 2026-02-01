import React, { useState, useEffect } from 'react';

interface SafeImageProps {
    src?: string | null;
    alt: string;
    className?: string;
    fallbackSrc?: string;
    style?: React.CSSProperties;
}

const SafeImage: React.FC<SafeImageProps> = ({
    src,
    alt,
    className = '',
    fallbackSrc,
    style
}) => {
    const [hasError, setHasError] = useState(false);
    const [currentSrc, setCurrentSrc] = useState<string>('');

    useEffect(() => {
        const baseUrl = import.meta.env.VITE_API_BASE_URL || 'https://lenodev-production.up.railway.app';
        const defaultFallback = `${baseUrl}/uploads/default-service.png`;
        
        // Reset error state when src changes
        setHasError(false);
        
        // Determine the initial source
        let imageSrc = '';
        
        if (!src) {
            imageSrc = fallbackSrc || defaultFallback;
        } else if (typeof src === 'string' && src.startsWith('http')) {
            imageSrc = src;
        } else if (typeof src === 'string' && src.startsWith('/')) {
            imageSrc = `${baseUrl}${src}`;
        } else if (typeof src === 'string' && src.includes('.')) {
            imageSrc = `${baseUrl}/uploads/${src}`;
        } else {
            imageSrc = fallbackSrc || defaultFallback;
        }
        
        setCurrentSrc(imageSrc);
    }, [src, fallbackSrc]);

    const handleError = () => {
        if (!hasError) {
            setHasError(true);
            const baseUrl = import.meta.env.VITE_API_BASE_URL || 'https://lenodev-production.up.railway.app';
            setCurrentSrc(fallbackSrc || `${baseUrl}/uploads/default-service.png`);
        }
    };

    return (
        <img
            src={currentSrc}
            alt={alt}
            className={className}
            onError={handleError}
            loading="lazy"
            style={style}
        />
    );
};

export default SafeImage;