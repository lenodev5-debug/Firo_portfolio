import React, { useState } from 'react';

interface ImageWithDescription {
    url: string;
    description: string;
    altText?: string;
    order?: number;
    isFeatured?: boolean;
}

interface Service {
    _id: string;
    name: string;
    serviceType: 'web' | 'mobile' | 'design';
    description: string;
    price: number;
    mainImage: string;
    images: ImageWithDescription[];
    technologies: string[];
    userId: string;
    createdAt: string;
    updatedAt: string;
    featured?: boolean;
}

interface ServiceCounts {
    web: number;
    design: number;
    mobile: number;
    total: number;
}

interface ServiceListProps {
    services: Service[];
    onEditClick: (service: Service) => void;
    onDeleteClick: (id: string, name: string) => void;
    onBulkDelete: (ids: string[]) => void;
    serviceCounts: ServiceCounts;
}

const ServiceList: React.FC<ServiceListProps> = ({
    services,
    onEditClick,
    onDeleteClick,
    onBulkDelete,
    serviceCounts
}) => {
    const [selectedServices, setSelectedServices] = useState<string[]>([]);
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

    const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.checked) {
            setSelectedServices(services.map(service => service._id));
        } else {
            setSelectedServices([]);
        }
    };

    const handleSelectService = (id: string) => {
        setSelectedServices(prev => 
            prev.includes(id) 
                ? prev.filter(serviceId => serviceId !== id)
                : [...prev, id]
        );
    };

    const handleBulkDeleteClick = () => {
        if (selectedServices.length > 0) {
            onBulkDelete(selectedServices);
            setSelectedServices([]);
        }
    };

    const getServiceTypeIcon = (type: string) => {
        switch (type) {
            case 'web': return 'fas fa-globe';
            case 'mobile': return 'fas fa-mobile-alt';
            case 'design': return 'fas fa-palette';
            default: return 'fas fa-cube';
        }
    };

    const getServiceTypeColor = (type: string) => {
        switch (type) {
            case 'web': return 'web-color';
            case 'mobile': return 'mobile-color';
            case 'design': return 'design-color';
            default: return '';
        }
    };

    const getFullImageUrl = (imagePath: string) => {
        const baseUrl = 'https://lenodev-production.up.railway.app';
        
        if (imagePath.startsWith('http')) {
            return imagePath;
        }
        
        if (imagePath.startsWith('/uploads/')) {
            return `${baseUrl}${imagePath}`;
        }
        
        return `${baseUrl}/uploads/${imagePath}`;
    };

    if (services.length === 0) {
        return (
            <div className="empty-state">
                <i className="fas fa-box-open fa-3x"></i>
                <h3>No Services Found</h3>
                <p>Create your first service to get started!</p>
            </div>
        );
    }

    return (
        <div className="service-list-container">
            {/* Header Controls */}
            <div className="list-controls">
                <div className="control-left">
                    <div className="bulk-select">
                        <input
                            type="checkbox"
                            checked={selectedServices.length === services.length && services.length > 0}
                            onChange={handleSelectAll}
                            id="select-all"
                        />
                        <label htmlFor="select-all">
                            {selectedServices.length > 0 
                                ? `${selectedServices.length} selected` 
                                : 'Select All'}
                        </label>
                    </div>
                    
                    {selectedServices.length > 0 && (
                        <button 
                            className="btn-danger btn-sm"
                            onClick={handleBulkDeleteClick}
                        >
                            <i className="fas fa-trash"></i> Delete Selected ({selectedServices.length})
                        </button>
                    )}
                </div>
                
                <div className="control-right">
                    <div className="view-toggle">
                        <button 
                            className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
                            onClick={() => setViewMode('grid')}
                            title="Grid View"
                        >
                            <i className="fas fa-th"></i>
                        </button>
                        <button 
                            className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
                            onClick={() => setViewMode('list')}
                            title="List View"
                        >
                            <i className="fas fa-list"></i>
                        </button>
                    </div>
                </div>
            </div>

            {/* Stats Summary */}
            <div className="service-stats-summary">
                <div className="stat-item">
                    <span className="stat-label">Total Services:</span>
                    <span className="stat-value">{serviceCounts.total}</span>
                </div>
                <div className="stat-item">
                    <span className="stat-label">Web:</span>
                    <span className="stat-value web">{serviceCounts.web}</span>
                </div>
                <div className="stat-item">
                    <span className="stat-label">Mobile:</span>
                    <span className="stat-value mobile">{serviceCounts.mobile}</span>
                </div>
                <div className="stat-item">
                    <span className="stat-label">Design:</span>
                    <span className="stat-value design">{serviceCounts.design}</span>
                </div>
            </div>

            {/* Services Grid/List */}
            <div className={`services-display ${viewMode}`}>
                {services.map((service) => (
                    <div key={service._id} className={`service-card ${service.featured ? 'featured' : ''}`}>
                        {selectedServices.includes(service._id) && (
                            <div className="selected-overlay">
                                <i className="fas fa-check-circle"></i>
                            </div>
                        )}
                        
                        <div className="service-card-header">
                            <input
                                type="checkbox"
                                checked={selectedServices.includes(service._id)}
                                onChange={() => handleSelectService(service._id)}
                                className="service-select-checkbox"
                            />
                            
                            {service.featured && (
                                <span className="featured-badge">
                                    <i className="fas fa-star"></i> Featured
                                </span>
                            )}
                        </div>
                        
                        <div className="service-image-container">
                            <img 
                                src={getFullImageUrl(service.mainImage)} 
                                alt={service.name}
                                className="service-main-image"
                                onError={(e) => {
                                    (e.target as HTMLImageElement).src = 'https://lenodev-production.up.railway.app/uploads/default-service.png';
                                }}
                            />
                            
                            {service.images && service.images.length > 1 && (
                                <div className="image-count-badge" title={`${service.images.length} images`}>
                                    <i className="fas fa-images"></i> {service.images.length}
                                </div>
                            )}
                            
                            <div className={`service-type-badge ${getServiceTypeColor(service.serviceType)}`}>
                                <i className={getServiceTypeIcon(service.serviceType)}></i>
                                {service.serviceType}
                            </div>
                        </div>
                        
                        <div className="service-content">
                            <h4 className="service-title">{service.name}</h4>
                            <p className="service-description">{service.description}</p>
                            
                            {/* Additional Images Preview */}
                            {service.images && service.images.length > 1 && (
                                <div className="additional-images-preview">
                                    {service.images.slice(0, 3).map((img, index) => (
                                        <div key={index} className="thumbnail-container" title={img.description}>
                                            <img 
                                                src={getFullImageUrl(img.url)} 
                                                alt={img.altText || img.description}
                                                className="thumbnail-image"
                                                onError={(e) => {
                                                    (e.target as HTMLImageElement).src = 'https://lenodev-production.up.railway.app/uploads/default-service.png';
                                                }}
                                            />
                                            {index === 2 && service.images.length > 3 && (
                                                <div className="more-images">+{service.images.length - 3}</div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                            
                            {/* Technologies */}
                            {service.technologies && service.technologies.length > 0 && (
                                <div className="service-technologies">
                                    {service.technologies.slice(0, 3).map((tech, index) => (
                                        <span key={index} className="tech-tag">{tech}</span>
                                    ))}
                                    {service.technologies.length > 3 && (
                                        <span className="more-tech">+{service.technologies.length - 3} more</span>
                                    )}
                                </div>
                            )}
                            
                            <div className="service-footer">
                                <div className="service-price">
                                    <span className="price-currency">$</span>
                                    <span className="price-amount">{service.price.toFixed(2)}</span>
                                </div>
                                
                                <div className="service-actions">
                                    <button 
                                        className="btn-icon btn-edit"
                                        onClick={() => onEditClick(service)}
                                        title="Edit"
                                    >
                                        <i className="fas fa-edit"></i>
                                    </button>
                                    <button 
                                        className="btn-icon btn-delete"
                                        onClick={() => onDeleteClick(service._id, service.name)}
                                        title="Delete"
                                    >
                                        <i className="fas fa-trash"></i>
                                    </button>
                                    <button 
                                        className="btn-icon btn-view"
                                        title="View Details"
                                        onClick={() => {/* Add view details functionality */}}
                                    >
                                        <i className="fas fa-eye"></i>
                                    </button>
                                </div>
                            </div>
                            
                            <div className="service-meta">
                                <span className="created-date">
                                    <i className="fas fa-calendar"></i>
                                    {new Date(service.createdAt).toLocaleDateString()}
                                </span>
                                {service.updatedAt !== service.createdAt && (
                                    <span className="updated-badge" title="Updated">
                                        <i className="fas fa-sync"></i>
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Footer Summary */}
            <div className="services-footer">
                <div className="footer-info">
                    Showing {services.length} of {serviceCounts.total} services
                </div>
                <div className="footer-actions">
                    <button className="btn-link">
                        <i className="fas fa-file-export"></i> Export All
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ServiceList;