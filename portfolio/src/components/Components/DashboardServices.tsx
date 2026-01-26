import React from 'react';
import ServiceForm from './ServiceForm';

interface Service {
    _id: string;
    name: string;
    serviceType: 'web' | 'mobile' | 'design';
    description: string;
    price: number;
    image: string;
    technologies: string[];
    userId: string;
    createdAt: string;
    updatedAt: string;
}

interface DashboardServicesProps {
    services: Service[];
    isCreatingService: boolean;
    isEditingService: string | null;
    serviceFormData: {
        name: string;
        serviceType: 'web' | 'mobile' | 'design';
        description: string;
        price: string;
        technologies: string;
        image: File | null;
    };
    onServiceInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
    onServiceFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onServiceSubmit: (e: React.FormEvent) => void;
    onServiceEditClick: (service: Service) => void;
    onServiceDelete: (id: string, name: string) => void;
    resetServiceForm: () => void;
}

const DashboardServices: React.FC<DashboardServicesProps> = ({
    services,
    isCreatingService,
    isEditingService,
    serviceFormData,
    onServiceInputChange,
    onServiceFileChange,
    onServiceSubmit,
    onServiceEditClick,
    onServiceDelete,
    resetServiceForm
}) => {
    const getServiceImageUrl = (imagePath: string) => {
        const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4444';
        
        if (!imagePath || imagePath.trim() === '') {
            return `${baseUrl}/uploads/services/default-service.png`;
        }
        
        // If already full URL
        if (imagePath.startsWith('http')) {
            return imagePath;
        }
        
        // Remove any leading slash
        const cleanPath = imagePath.startsWith('/') ? imagePath.substring(1) : imagePath;
        
        // Check if path already contains uploads/services
        if (cleanPath.includes('uploads/services/')) {
            return `${baseUrl}/${cleanPath}`;
        }
        
        // Check if it's just a filename
        if (!cleanPath.includes('/')) {
            return `${baseUrl}/uploads/services/${cleanPath}`;
        }
        
        // Default to uploads/services folder
        const filename = cleanPath.split('/').pop();
        return `${baseUrl}/uploads/services/${filename}`;
    };

    const renderServiceCards = () => (
        <div className="services-grid">
            {services.length === 0 ? (
                <div className="no-services">
                    <i className="fas fa-box-open"></i>
                    <p>No services yet. Create your first service!</p>
                </div>
            ) : (
                services.map(service => (
                    <div key={service._id} className="service-card">
                        <div className="service-image">
                            <img 
                                src={getServiceImageUrl(service.image)}
                                alt={service.name}
                                onError={(e) => {
                                    const img = e.target as HTMLImageElement;
                                    const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4444';
                                    console.log('Service image error for:', service.name, 'Path:', service.image);
                                    
                                    // Try alternative paths
                                    const filename = service.image?.split('/').pop() || '';
                                    
                                    // Try direct filename in services folder
                                    if (filename) {
                                        img.src = `${baseUrl}/uploads/services/${filename}`;
                                    } else {
                                        // Fallback to default
                                        img.src = `${baseUrl}/uploads/services/default-service.png`;
                                    }
                                    
                                    // Log the new URL for debugging
                                    console.log('Trying new URL:', img.src);
                                }}
                            />
                        </div>
                        
                        <div className="service-content">
                            <div className="service-header">
                                <h4>{service.name}</h4>
                                <span className={`service-type ${service.serviceType}`}>
                                    {service.serviceType === 'web' ? 'Web' : 
                                     service.serviceType === 'mobile' ? 'Mobile' : 'Design'}
                                </span>
                            </div>
                            
                            <p className="service-description">
                                {service.description.length > 100 
                                    ? `${service.description.substring(0, 100)}...` 
                                    : service.description}
                            </p>
                            
                            <div className="service-footer">
                                <div className="service-meta">
                                    <span className="service-price">${service.price.toFixed(2)}</span>
                                    {service.technologies && service.technologies.length > 0 && (
                                        <span className="service-tech">
                                            {service.technologies.slice(0, 2).join(', ')}
                                            {service.technologies.length > 2 && '...'}
                                        </span>
                                    )}
                                </div>
                                
                                <div className="service-actions">
                                    <button 
                                        className="btn-edit"
                                        onClick={() => onServiceEditClick(service)}
                                    >
                                        <i className="fas fa-edit"></i> Edit
                                    </button>
                                    <button 
                                        className="btn-delete"
                                        onClick={() => onServiceDelete(service._id, service.name)}
                                    >
                                        <i className="fas fa-trash"></i> Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))
            )}
        </div>
    );

    return (
        <div className="dashboard-services">
            {(isCreatingService || isEditingService) && (
                <ServiceForm
                    formData={serviceFormData}
                    isEditing={!!isEditingService}
                    onInputChange={onServiceInputChange}
                    onFileChange={onServiceFileChange}
                    onSubmit={onServiceSubmit}
                    onCancel={resetServiceForm}
                />
            )}
            
            <div className="services-section">
                <div className="section-header">
                    <h3>My Services ({services.length})</h3>
                    {!isCreatingService && !isEditingService && (
                        <button 
                            className="btn-secondary"
                            onClick={() => {
                                setIsCreatingService(true);
                                resetServiceForm();
                            }}
                        >
                            <i className="fas fa-plus"></i> Add Service
                        </button>
                    )}
                </div>
                {renderServiceCards()}
            </div>
        </div>
    );
};

export default DashboardServices;