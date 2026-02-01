import React, { useState } from 'react';

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

    const handleMultipleImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const filesArray = Array.from(e.target.files);
            setAdditionalImages(filesArray);
            
            const newDescriptions = [...imageDescriptions];
            for (let i = 0; i < filesArray.length; i++) {
                if (!newDescriptions[i]) {
                    newDescriptions[i] = '';
                }
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
        setIsSubmitting(true);
        
        try {
            const imagesWithDescriptions: ImageWithDescription[] = additionalImages.map((file, index) => ({
                url: URL.createObjectURL(file),
                description: imageDescriptions[index] || '',
                altText: imageDescriptions[index] || file.name,
                order: index,
                isFeatured: index === 0,
                file: file
            }));

            const updatedFormData = {
                ...formData,
                images: [...formData.images, ...imagesWithDescriptions]
            };

            const success = await onSubmit(updatedFormData, additionalImages);
            if (success) {
                setAdditionalImages([]);
                setImageDescriptions(['']);
            }
        } catch (error) {
            console.error('Error submitting form:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="service-form-container">
            <h3>{isEditing ? 'Edit Service' : 'Create New Service'}</h3>
            
            <form onSubmit={handleSubmit} className="service-form">
                {/* Basic fields */}
                <div className="form-group">
                    <label>Service Name *</label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={onInputChange}
                        required
                        placeholder="Enter service name"
                        disabled={isSubmitting}
                    />
                </div>
                
                <div className="form-group">
                    <label>Service Type *</label>
                    <select
                        name="serviceType"
                        value={formData.serviceType}
                        onChange={onInputChange}
                        required
                        disabled={isSubmitting}
                    >
                        <option value="web">Web Development</option>
                        <option value="mobile">Mobile Development</option>
                        <option value="design">Product Design</option>
                    </select>
                </div>
                
                <div className="form-group">
                    <label>Main Image *</label>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={onFileChange}
                        name="mainImage"
                        disabled={isSubmitting}
                    />
                    <small>This will be the thumbnail image</small>
                </div>
                
                {/* Multiple Images Section */}
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
                    <small>Upload up to 10 images. Each image can have a description.</small>
                    
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
                                    </div>
                                    <textarea
                                        placeholder="Image description..."
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
                
                <div className="form-group">
                    <label>Description *</label>
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={onInputChange}
                        required
                        rows={4}
                        placeholder="Describe the service in detail..."
                        disabled={isSubmitting}
                    />
                </div>
                
                <div className="form-row">
                    <div className="form-group">
                        <label>Price *</label>
                        <input
                            type="number"
                            name="price"
                            value={formData.price}
                            onChange={onInputChange}
                            required
                            placeholder="0.00"
                            step="0.01"
                            disabled={isSubmitting}
                        />
                    </div>
                    
                    <div className="form-group">
                        <label>Technologies</label>
                        <input
                            type="text"
                            name="technologies"
                            value={formData.technologies}
                            onChange={onInputChange}
                            placeholder="React, Node.js, MongoDB (comma separated)"
                            disabled={isSubmitting}
                        />
                    </div>
                </div>
                
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
                </div>
                
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
                                {isEditing ? 'Update Service' : 'Create Service'}
                            </>
                        )}
                    </button>
                    <button 
                        type="button" 
                        className="btn-secondary"
                        onClick={onCancel}
                        disabled={isSubmitting}
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ServiceForm;