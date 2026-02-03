import React, { useState } from 'react';
import SafeImage from './safeimage';

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
    services?: Service[];
    onEditClick: (service: Service) => void;
    onDeleteClick: (id: string, name: string) => void;
    onBulkDelete: (ids: string[]) => void;
    serviceCounts?: ServiceCounts;
}

const ServiceList: React.FC<ServiceListProps> = (props) => {
    try {
        const {
            services = [],
            onEditClick,
            onDeleteClick,
            onBulkDelete,
            serviceCounts = { web: 0, design: 0, mobile: 0, total: 0 }
        } = props;

        const [selectedServices, setSelectedServices] = useState<string[]>([]);
        const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
        
        // Ensure services is an array
        const safeServices = Array.isArray(services) ? services : [];
        
        // Safely get service counts
        const safeServiceCounts = {
            web: Number(serviceCounts?.web) || 0,
            design: Number(serviceCounts?.design) || 0,
            mobile: Number(serviceCounts?.mobile) || 0,
            total: Number(serviceCounts?.total) || 0
        };

        const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
            if (e.target.checked) {
                const allIds = safeServices
                    .map(service => service._id)
                    .filter(id => id && typeof id === 'string');
                setSelectedServices(allIds);
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

        const getServiceTypeLabel = (type: string) => {
            switch (type) {
                case 'web': return 'Web Development';
                case 'mobile': return 'Mobile Development';
                case 'design': return 'Product Design';
                default: return 'Service';
            }
        };

        if (safeServices.length === 0) {
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
                                checked={selectedServices.length === safeServices.length && safeServices.length > 0}
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
                        <span className="stat-value">{safeServiceCounts.total}</span>
                    </div>
                    <div className="stat-item">
                        <span className="stat-label">Web:</span>
                        <span className="stat-value web">{safeServiceCounts.web}</span>
                    </div>
                    <div className="stat-item">
                        <span className="stat-label">Mobile:</span>
                        <span className="stat-value mobile">{safeServiceCounts.mobile}</span>
                    </div>
                    <div className="stat-item">
                        <span className="stat-label">Design:</span>
                        <span className="stat-value design">{safeServiceCounts.design}</span>
                    </div>
                </div>

                {/* Services Grid/List */}
                <div className={`services-display ${viewMode}`}>
                    {safeServices.map((service, index) => {
                        // Create safe service object with defaults
                        const safeService = {
                            _id: service._id || `service-${index}`,
                            name: service.name || `Service ${index + 1}`,
                            serviceType: service.serviceType || 'web',
                            description: service.description || '',
                            price: Number(service.price) || 0,
                            mainImage: service.mainImage || service.image || '/uploads/default-service.png',
                            images: Array.isArray(service.images) ? service.images : [],
                            technologies: Array.isArray(service.technologies) ? service.technologies : [],
                            userId: service.userId || '',
                            createdAt: service.createdAt || new Date().toISOString(),
                            updatedAt: service.updatedAt || service.createdAt || new Date().toISOString(),
                            featured: Boolean(service.featured)
                        };

                        return (
                            <div key={safeService._id} className={`service-card ${safeService.featured ? 'featured' : ''}`}>
                                {selectedServices.includes(safeService._id) && (
                                    <div className="selected-overlay">
                                        <i className="fas fa-check-circle"></i>
                                    </div>
                                )}
                                
                                <div className="service-card-header">
                                    <input
                                        type="checkbox"
                                        checked={selectedServices.includes(safeService._id)}
                                        onChange={() => handleSelectService(safeService._id)}
                                        className="service-select-checkbox"
                                    />
                                    
                                    {safeService.featured && (
                                        <span className="featured-badge">
                                            <i className="fas fa-star"></i> Featured
                                        </span>
                                    )}
                                </div>
                                
                                <div className="service-image-container">
                                    <SafeImage
                                        src={safeService.mainImage}
                                        alt={safeService.name}
                                        className="service-main-image"
                                        fallbackSrc="/uploads/default-service.png"
                                    />
                                    
                                    {safeService.images && safeService.images.length > 1 && (
                                        <div className="image-count-badge" title={`${safeService.images.length} images`}>
                                            <i className="fas fa-images"></i> {safeService.images.length}
                                        </div>
                                    )}
                                    
                                    <div className={`service-type-badge ${getServiceTypeColor(safeService.serviceType)}`}>
                                        <i className={getServiceTypeIcon(safeService.serviceType)}></i>
                                        {getServiceTypeLabel(safeService.serviceType)}
                                    </div>
                                </div>
                                
                                <div className="service-content">
                                    <h4 className="service-title">{safeService.name}</h4>
                                    <p className="service-description">{safeService.description}</p>
                                    
                                    {/* Additional Images Preview */}
                                    {safeService.images && safeService.images.length > 1 && (
                                        <div className="additional-images-preview">
                                            {safeService.images.slice(0, 3).map((img, imgIndex) => {
                                                const safeImg = {
                                                    url: img?.url || safeService.mainImage,
                                                    description: img?.description || '',
                                                    altText: img?.altText || img?.description || safeService.name
                                                };
                                                
                                                return (
                                                    <div key={imgIndex} className="thumbnail-container" title={safeImg.description}>
                                                        <SafeImage
                                                            src={safeImg.url}
                                                            alt={safeImg.altText}
                                                            className="thumbnail-image"
                                                            fallbackSrc="/uploads/default-service.png"
                                                        />
                                                        {imgIndex === 2 && safeService.images.length > 3 && (
                                                            <div className="more-images">+{safeService.images.length - 3}</div>
                                                        )}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    )}
                                    
                                    {/* Technologies */}
                                    {safeService.technologies && safeService.technologies.length > 0 && (
                                        <div className="service-technologies">
                                            {safeService.technologies.slice(0, 3).map((tech, techIndex) => (
                                                <span key={techIndex} className="tech-tag">{tech}</span>
                                            ))}
                                            {safeService.technologies.length > 3 && (
                                                <span className="more-tech">+{safeService.technologies.length - 3} more</span>
                                            )}
                                        </div>
                                    )}
                                    
                                    <div className="service-footer">
                                        <div className="service-price">
                                            <span className="price-currency">$</span>
                                            <span className="price-amount">{safeService.price.toFixed(2)}</span>
                                        </div>
                                        
                                        <div className="service-actions">
                                            <button 
                                                className="btn-icon btn-edit"
                                                onClick={() => onEditClick(safeService)}
                                                title="Edit"
                                            >
                                                <i className="fas fa-edit"></i>
                                            </button>
                                            <button 
                                                className="btn-icon btn-delete"
                                                onClick={() => onDeleteClick(safeService._id, safeService.name)}
                                                title="Delete"
                                            >
                                                <i className="fas fa-trash"></i>
                                            </button>
                                            <button 
                                                className="btn-icon btn-view"
                                                title="View Details"
                                                onClick={() => {
                                                    console.log('View service:', safeService);
                                                    // Add view details functionality here
                                                }}
                                            >
                                                <i className="fas fa-eye"></i>
                                            </button>
                                        </div>
                                    </div>
                                    
                                    <div className="service-meta">
                                        <span className="created-date">
                                            <i className="fas fa-calendar"></i>
                                            {new Date(safeService.createdAt).toLocaleDateString()}
                                        </span>
                                        {safeService.updatedAt !== safeService.createdAt && (
                                            <span className="updated-badge" title="Updated">
                                                <i className="fas fa-sync"></i>
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Footer Summary */}
                <div className="services-footer">
                    <div className="footer-info">
                        Showing {safeServices.length} of {safeServiceCounts.total} services
                    </div>
                    <div className="footer-actions">
                        <button className="btn-link" onClick={() => window.print()}>
                            <i className="fas fa-print"></i> Print List
                        </button>
                    </div>
                </div>
            </div>
        );
    } catch (error) {
        console.error('Error in ServiceList component:', error);
        return (
            <div className="component-error">
                <i className="fas fa-exclamation-triangle"></i>
                <h3>Error loading services</h3>
                <p>Please refresh the page or contact support if the issue persists.</p>
                <button 
                    className="btn-primary"
                    onClick={() => window.location.reload()}
                >
                    <i className="fas fa-redo"></i> Refresh Page
                </button>
            </div>
        );
    }
};

export default ServiceList;