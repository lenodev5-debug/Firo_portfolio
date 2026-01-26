import React from 'react';

interface AchievementFormProps {
    formData: {
        title: string;
        description: string;
        date: string;
        image: File | null;
    };
    isEditing: boolean;
    onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onSubmit: (e: React.FormEvent) => void;
    onCancel: () => void;
}

const AchievementForm: React.FC<AchievementFormProps> = ({
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
                <h4>{isEditing ? 'Edit Achievement' : 'Create New Achievement'}</h4>
                <button 
                    type="button" 
                    className="btn-cancel"
                    onClick={onCancel}
                >
                    Cancel
                </button>
            </div>
            
            <div className="form-group">
                <label>Title *</label>
                <input 
                    type="text" 
                    name="title"
                    placeholder="e.g., Best Developer Award 2024"
                    className="form-input"
                    value={formData.title}
                    onChange={onInputChange}
                    required
                />
            </div>
            
            <div className="form-group">
                <label>Description *</label>
                <textarea 
                    name="description"
                    placeholder="Describe your achievement..."
                    className="form-textarea"
                    rows={4}
                    value={formData.description}
                    onChange={onInputChange}
                    required
                ></textarea>
            </div>
            
            <div className="form-row">
                <div className="form-group">
                    <label>Date</label>
                    <input 
                        type="date" 
                        name="date"
                        className="form-input"
                        value={formData.date}
                        onChange={onInputChange}
                    />
                </div>
                
                <div className="form-group">
                    <label>Image (Will be saved in uploads/general folder)</label>
                    <input 
                        type="file"
                        accept="image/*"
                        className="form-file"
                        onChange={onFileChange}
                    />
                    <small>Upload achievement image/certificate</small>
                </div>
            </div>
            
            <div className="form-actions">
                <button type="submit" className="btn-primary">
                    {isEditing ? 'Update Achievement' : 'Create Achievement'}
                </button>
            </div>
        </form>
    );
};

export default AchievementForm;