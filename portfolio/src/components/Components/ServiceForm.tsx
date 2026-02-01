import React, { useState, useCallback } from 'react';

interface ImageWithDescription {
    url: string;
    description: string;
    altText?: string;
    order?: number;
    isFeatured?: boolean;
    file?: File;
}

interface ServiceFormData {
    name: string;
    serviceType: 'web' | 'mobile' | 'design';
    description: string;
    price: string;
    technologies: string;
    mainImage: File | null;
    featured: boolean;
    images: ImageWithDescription[];
}

interface ServiceFormProps {
    formData: ServiceFormData;
    isEditing: boolean;
    onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
    onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onImagesChange: (images: ImageWithDescription[]) => void;
    onSubmit: (formData: ServiceFormData, additionalImages: File[]) => Promise<boolean>;
    onCancel: () => void;
}

const ServiceForm: React.FC<ServiceFormProps> = ({
    formData,
    isEditing,
    onInputChange,
    onFileChange,
    onImagesChange,
    onSubmit,
    onCancel
}) => {
    const [additionalImages, setAdditionalImages] = useState<File[]>([]);
    const [imageDescriptions, setImageDescriptions] = useState<string[]>(['']);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    const validateForm = useCallback((): boolean => {
        const newErrors: Record<string, string> = {};

        if (!formData.name.trim()) {
            newErrors.name = 'Service name is required';
        }

        if (!formData.description.trim()) {
            newErrors.description = 'Description is required';
        }

        if (!formData.price || isNaN(parseFloat(formData.price)) || parseFloat(formData.price) <= 0) {
            newErrors.price = 'Valid price is required';
        }

        if (!formData.mainImage && !isEditing) {
            newErrors.mainImage = 'Main image is required';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    }, [formData, isEditing]);

    const handleMultipleImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const filesArray = Array.from(e.target.files);
            
            // Validate file sizes and types
            const validFiles = filesArray.filter(file => {
                const isValidType = file.type.startsWith('image/');
                const isValidSize = file.size <= 5 * 1024 * 1024; // 5MB
                
                if (!isValidType) {
                    console.warn(`File ${file.name} is not an image`);
                }
                if (!isValidSize) {
                    console.warn(`File ${file.name} exceeds 5MB limit`);
                }
                
                return isValidType && isValidSize;
            });
            
            setAdditionalImages(prev => [...prev, ...validFiles]);
            
            // Initialize descriptions for new images
            const newDescriptions = [...imageDescriptions];
            for (let i = 0; i < validFiles.length; i++) {
                newDescriptions.push('');
            }
            setImageDescriptions(newDescriptions);
        }
    };

    const handleImageDescriptionChange = (index: number, value: string) => {
        const newDescriptions = [...imageDescriptions];
        newDescriptions[index] = value;
        setImageDescriptions(newDescriptions);
    };

    const handleRemoveImage = (index: number) => {
        const newImages = [...additionalImages];
        const newDescriptions = [...imageDescriptions];
        
        newImages.splice(index, 1);
        newDescriptions.splice(index, 1);
        
        setAdditionalImages(newImages);
        setImageDescriptions(newDescriptions);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }
        
        setIsSubmitting(true);
        
        try {
            // Create images with descriptions
            const imagesWithDescriptions: ImageWithDescription[] = additionalImages.map((file, index) => ({
                url: URL.createObjectURL(file),
                description: imageDescriptions[index] || '',
                altText: imageDescriptions[index] || file.name,
                order: index,
                isFeatured: index === 0,
                file: file
            }));

            // Combine existing images with new ones
            const allImages = [...formData.images, ...imagesWithDescriptions];

            const updatedFormData = {
                ...formData,
                images: allImages
            };

            const success = await onSubmit(updatedFormData, additionalImages);
            if (success) {
                setAdditionalImages([]);
                setImageDescriptions(['']);
                setErrors({});
            }
        } catch (error) {
            console.error('Error submitting form:', error);
            setErrors({
                submit: 'Failed to submit form. Please try again.'
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="service-form-container">
            <div className="form-header">
                <h3>{isEditing ? 'Edit Service' : 'Create New Service'}</h3>
                {errors.submit && (
                    <div className="alert alert-danger">
                        <i className="fas fa-exclamation-circle"></i> {errors.submit}
                    </div>
                )}
            </div>
            
            <form onSubmit={handleSubmit} className="service-form">
                {/* Basic Information */}
                <div className="form-section">
                    <h4>Basic Information</h4>
                    
                    <div className="form-group">
                        <label htmlFor="name">
                            Service Name *
                            {errors.name && <span className="error-text"> - {errors.name}</span>}
                        </label>
                        <input
                            id="name"
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={onInputChange}
                            placeholder="Enter service name"
                            disabled={isSubmitting}
                            className={errors.name ? 'error' : ''}
                        />
                    </div>
                    
                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="serviceType">Service Type *</label>
                            <select
                                id="serviceType"
                                name="serviceType"
                                value={formData.serviceType}
                                onChange={onInputChange}
                                disabled={isSubmitting}
                            >
                                <option value="web">Web Development</option>
                                <option value="mobile">Mobile Development</option>
                                <option value="design">Product Design</option>
                            </select>
                        </div>
                        
                        <div className="form-group">
                            <label htmlFor="price">
                                Price *
                                {errors.price && <span className="error-text"> - {errors.price}</span>}
                            </label>
                            <input
                                id="price"
                                type="number"
                                name="price"
                                value={formData.price}
                                onChange={onInputChange}
                                placeholder="0.00"
                                step="0.01"
                                min="0"
                                disabled={isSubmitting}
                                className={errors.price ? 'error' : ''}
                            />
                        </div>
                    </div>
                    
                    <div className="form-group">
                        <label htmlFor="technologies">Technologies</label>
                        <input
                            id="technologies"
                            type="text"
                            name="technologies"
                            value={formData.technologies}
                            onChange={onInputChange}
                            placeholder="React, Node.js, MongoDB (comma separated)"
                            disabled={isSubmitting}
                        />
                    </div>
                    
                    <div className="form-group">
                        <label htmlFor="description">
                            Description *
                            {errors.description && <span className="error-text"> - {errors.description}</span>}
                        </label>
                        <textarea
                            id="description"
                            name="description"
                            value={formData.description}
                            onChange={onInputChange}
                            rows={4}
                            placeholder="Describe the service in detail..."
                            disabled={isSubmitting}
                            className={errors.description ? 'error' : ''}
                        />
                    </div>
                </div>
                
                {/* Images Section */}
                <div className="form-section">
                    <h4>Images</h4>
                    
                    <div className="form-group">
                        <label htmlFor="mainImage">
                            Main Image *
                            {errors.mainImage && <span className="error-text"> - {errors.mainImage}</span>}
                        </label>
                        <input
                            id="mainImage"
                            type="file"
                            accept="image/*"
                            onChange={onFileChange}
                            name="mainImage"
                            disabled={isSubmitting}
                            className={errors.mainImage ? 'error' : ''}
                        />
                        <small className="form-text">This will be the thumbnail image. Max 5MB.</small>
                    </div>
                    
                    <div className="form-group">
                        <label>Additional Images with Descriptions</label>
                        <input
                            type="file"
                            accept="image/*"
                            multiple
                            onChange={handleMultipleImagesChange}
                            name="additionalImages"
                            disabled={isSubmitting}
                        />
                        <small className="form-text">Upload up to 10 images. Each image can have a description. Max 5MB per image.</small>
                        
                        {/* Preview uploaded images with description inputs */}
                        {additionalImages.length > 0 && (
                            <div className="image-previews">
                                {additionalImages.map((file, index) => (
                                    <div key={index} className="image-preview-item">
                                        <div className="preview-container">
                                            <img 
                                                src={URL.createObjectURL(file)} 
                                                alt={`Preview ${index}`}
                                                className="preview-image"
                                            />
                                            <button 
                                                type="button"
                                                className="remove-image-btn"
                                                onClick={() => handleRemoveImage(index)}
                                                disabled={isSubmitting}
                                            >
                                                <i className="fas fa-times"></i>
                                            </button>
                                            <div className="image-info">
                                                <span className="image-name">{file.name}</span>
                                                <span className="image-size">{(file.size / 1024 / 1024).toFixed(2)} MB</span>
                                            </div>
                                        </div>
                                        <textarea
                                            placeholder="Image description (optional)..."
                                            value={imageDescriptions[index] || ''}
                                            onChange={(e) => handleImageDescriptionChange(index, e.target.value)}
                                            className="image-description-input"
                                            rows={2}
                                            disabled={isSubmitting}
                                        />
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
                
                {/* Additional Options */}
                <div className="form-section">
                    <h4>Additional Options</h4>
                    
                    <div className="form-group">
                        <label className="checkbox-label">
                            <input
                                type="checkbox"
                                name="featured"
                                checked={formData.featured}
                                onChange={onInputChange}
                                disabled={isSubmitting}
                            />
                            <span>Mark as Featured Service</span>
                        </label>
                        <small className="form-text">Featured services will be highlighted on your profile.</small>
                    </div>
                </div>
                
                {/* Form Actions */}
                <div className="form-actions">
                    <button 
                        type="submit" 
                        className="btn-primary"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? (
                            <>
                                <i className="fas fa-spinner fa-spin"></i> Processing...
                            </>
                        ) : (
                            <>
                                <i className="fas fa-save"></i> {isEditing ? 'Update Service' : 'Create Service'}
                            </>
                        )}
                    </button>
                    <button 
                        type="button" 
                        className="btn-secondary"
                        onClick={onCancel}
                        disabled={isSubmitting}
                    >
                        <i className="fas fa-times"></i> Cancel
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ServiceForm;