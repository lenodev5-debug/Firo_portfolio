import React from 'react';
import AchievementForm from './AchievementForm';

interface Achievement {
    _id: string;
    title: string;
    description: string;
    date: string;
    image?: string;
}

interface DashboardAchievementsProps {
    achievements: Achievement[];
    isCreatingAchievement: boolean;
    isEditingAchievement: string | null;
    achievementFormData: {
        title: string;
        description: string;
        date: string;
        image: File | null;
    };
    onAchievementInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    onAchievementFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onAchievementSubmit: (e: React.FormEvent) => void;
    onAchievementEditClick: (achievement: Achievement) => void;
    onAchievementDelete: (id: string, title: string) => void;
    onStartCreatingAchievement: () => void;
    resetAchievementForm: () => void;
}

const DashboardAchievements: React.FC<DashboardAchievementsProps> = ({
    achievements,
    isCreatingAchievement,
    isEditingAchievement,
    achievementFormData,
    onAchievementInputChange,
    onAchievementFileChange,
    onAchievementSubmit,
    onAchievementEditClick,
    onAchievementDelete,
    onStartCreatingAchievement,
    resetAchievementForm
}) => {
    const getAchievementImageUrl = (imagePath?: string): string => {
        const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4444';
        
        if (!imagePath || imagePath.trim() === '') {
            return `${baseUrl}/uploads/general/default-achievement.png`;
        }
        
        // If already full URL
        if (imagePath.startsWith('http')) {
            return imagePath;
        }
        
        // Remove any leading slash
        const cleanPath = imagePath.startsWith('/') ? imagePath.substring(1) : imagePath;
        
        // Check if path already contains uploads/general
        if (cleanPath.includes('uploads/general/')) {
            return `${baseUrl}/${cleanPath}`;
        }
        
        // Check if it's just a filename
        if (!cleanPath.includes('/')) {
            return `${baseUrl}/uploads/general/${cleanPath}`;
        }
        
        // Default to uploads/general folder
        return `${baseUrl}/uploads/general/${cleanPath.split('/').pop()}`;
    };

    const renderAchievementCards = () => (
        <div className="services-grid">
            {achievements.length === 0 ? (
                <div className="no-services">
                    <i className="fas fa-trophy"></i>
                    <p>No achievements yet. Create your first achievement!</p>
                </div>
            ) : (
                achievements.map(achievement => (
                    <div key={achievement._id} className="service-card">
                        <div className="service-image">
                            <img 
                                src={getAchievementImageUrl(achievement.image)}
                                alt={achievement.title}
                                onError={(e) => {
                                    const img = e.target as HTMLImageElement;
                                    const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4444';
                                    console.log('Achievement image error for:', achievement.title, 'Path:', achievement.image);
                                    
                                    // Try alternative paths
                                    const filename = achievement.image?.split('/').pop() || '';
                                    
                                    // Try direct filename in general folder
                                    if (filename) {
                                        img.src = `${baseUrl}/uploads/general/${filename}`;
                                    } else {
                                        // Fallback to default
                                        img.src = `${baseUrl}/uploads/general/default-achievement.png`;
                                    }
                                }}
                            />
                        </div>
                        
                        <div className="service-content">
                            <div className="service-header">
                                <h4>{achievement.title}</h4>
                                <span className="achievement-badge">
                                    <i className="fas fa-award"></i> Achievement
                                </span>
                            </div>
                            
                            <p className="service-description">
                                {achievement.description.length > 100 
                                    ? `${achievement.description.substring(0, 100)}...` 
                                    : achievement.description}
                            </p>
                            
                            <div className="service-footer">
                                <div className="service-meta">
                                    <span className="service-date">
                                        <i className="fas fa-calendar"></i> {new Date(achievement.date).toLocaleDateString()}
                                    </span>
                                </div>
                                
                                <div className="service-actions">
                                    <button 
                                        className="btn-edit"
                                        onClick={() => onAchievementEditClick(achievement)}
                                    >
                                        <i className="fas fa-edit"></i> Edit
                                    </button>
                                    <button 
                                        className="btn-delete"
                                        onClick={() => onAchievementDelete(achievement._id, achievement.title)}
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
        <div className="dashboard-achievements">
            {(isCreatingAchievement || isEditingAchievement) && (
                <AchievementForm
                    formData={achievementFormData}
                    isEditing={!!isEditingAchievement}
                    onInputChange={onAchievementInputChange}
                    onFileChange={onAchievementFileChange}
                    onSubmit={onAchievementSubmit}
                    onCancel={resetAchievementForm}
                />
            )}
            
            <div className="achievements-section">
                <div className="section-header">
                    <h3>My Achievements ({achievements.length})</h3>
                    {!isCreatingAchievement && !isEditingAchievement && (
                        <button 
                            className="btn-secondary"
                            onClick={() => {
                                onStartCreatingAchievement();
                                resetAchievementForm();
                            }}
                        >
                            <i className="fas fa-plus"></i> Add Achievement
                        </button>
                    )}
                </div>
                {renderAchievementCards()}
            </div>
        </div>
    );
};

export default DashboardAchievements;