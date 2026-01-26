import React from 'react';

interface ServiceFormProps {
    formData: {
        name: string;
        serviceType: 'web' | 'mobile' | 'design';
        description: string;
        price: string;
        technologies: string;
        image: File | null;
    };
    isEditing: boolean;
    onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
    onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onSubmit: (e: React.FormEvent) => void;
    onCancel: () => void;
}

const ServiceForm: React.FC<ServiceFormProps> = ({
    formData,
    isEditing,
    onInputChange,
    onFileChange,
    onSubmit,
    onCancel
}) => {
    return (
        <form onSubmit={onSubmit} className="service-form">
            <div className="form-header">
                <h4>{isEditing ? 'Edit Service' : 'Create New Service'}</h4>
                <button 
                    type="button" 
                    className="btn-cancel"
                    onClick={onCancel}
                >
                    Cancel
                </button>
            </div>
            
            <div className="form-group">
                <label>Service Name *</label>
                <input 
                    type="text" 
                    name="name"
                    placeholder="e.g., E-commerce Website"
                    className="form-input"
                    value={formData.name}
                    onChange={onInputChange}
                    required
                />
            </div>
            
            <div className="form-group">
                <label>Service Type *</label>
                <select 
                    name="serviceType"
                    className="form-select"
                    value={formData.serviceType}
                    onChange={onInputChange}
                    required
                >
                    <option value="web">Web Development</option>
                    <option value="mobile">Mobile App</option>
                    <option value="design">Product Design</option>
                </select>
            </div>
            
            <div className="form-group">
                <label>Description *</label>
                <textarea 
                    name="description"
                    placeholder="Describe your service..."
                    className="form-textarea"
                    rows={4}
                    value={formData.description}
                    onChange={onInputChange}
                    required
                ></textarea>
            </div>
            
            <div className="form-row">
                <div className="form-group">
                    <label>Price ($) *</label>
                    <input 
                        type="number" 
                        name="price"
                        placeholder="0.00"
                        className="form-input"
                        value={formData.price}
                        onChange={onInputChange}
                        required
                        min="0"
                        step="0.01"
                    />
                </div>
                
                <div className="form-group">
                    <label>Image (Will be saved in uploads/services folder)</label>
                    <input 
                        type="file"
                        accept="image/*"
                        className="form-file"
                        onChange={onFileChange}
                    />
                    <small>Leave empty to keep current image</small>
                </div>
            </div>
            
            <div className="form-group">
                <label>Technologies</label>
                <input 
                    type="text" 
                    name="technologies"
                    placeholder="React, Node.js, MongoDB (comma separated)"
                    className="form-input"
                    value={formData.technologies}
                    onChange={onInputChange}
                />
                <small>Separate technologies with commas</small>
            </div>
            
            <div className="form-actions">
                <button type="submit" className="btn-primary">
                    {isEditing ? 'Update Service' : 'Create Service'}
                </button>
            </div>
        </form>
    );
};

export default ServiceForm;