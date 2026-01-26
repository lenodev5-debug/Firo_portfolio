import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Header from './Header';
import Profile from '../assets/bak/lenodevprofile.jpg';
import WebIcon from '../assets/icon/web-design (1).png';
import CubeIcon from '../assets/icon/cube.png';
import MobileIcon from '../assets/icon/mobile.png';

interface UserProfile {
    _id: string;
    username: string;
    email: string;
    role: string;
    createdAt: string;
}

interface Notification {
    id: string;
    type: 'success' | 'error' | 'info' | 'warning';
    title: string;
    message: string;
    timestamp: string;
    read: boolean;
}

interface Message {
    _id: string;
    username: string;
    email: string;
    project_Type: string;
    message: string;
    createdAt: string;
    read: boolean;
    status: 'new' | 'replied' | 'archived';
    phone?: string;
    budget?: string;
    timeline?: string;
}

interface Achievement {
    _id: string;
    title: string;
    description: string;
    date: string;
    image?: string;
}

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

const Dashboard = () => {
    const [user, setUser] = useState<UserProfile | null>(null);
    const [dashboardLoading, setDashboardLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();
    
    const [messages, setMessages] = useState<Message[]>([]);
    const [achievements, setAchievements] = useState<Achievement[]>([]);
    const [services, setServices] = useState<Service[]>([]);
    
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [newNotification, setNewNotification] = useState<Notification | null>(null);
    const [selectedOption, setSelectedOption] = useState<string>('Project');
    
    // Service CRUD State
    const [isCreatingService, setIsCreatingService] = useState(false);
    const [isEditingService, setIsEditingService] = useState<string | null>(null);
    const [serviceFormData, setServiceFormData] = useState({
        name: '',
        serviceType: 'web' as 'web' | 'mobile' | 'design',
        description: '',
        price: '',
        technologies: '',
        image: null as File | null
    });
    
    // Achievement CRUD State
    const [isCreatingAchievement, setIsCreatingAchievement] = useState(false);
    const [isEditingAchievement, setIsEditingAchievement] = useState<string | null>(null);
    const [achievementFormData, setAchievementFormData] = useState({
        title: '',
        description: '',
        date: '',
        image: null as File | null
    });
    
    const [serviceCounts, setServiceCounts] = useState({ 
        web: 0, 
        design: 0, 
        mobile: 0 
    });

    const getAuthToken = () => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/auth/user/login');
            throw new Error('No authentication token found');
        }
        return token;
    };

    const createApi = () => {
        const token = getAuthToken();
        const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4444';
        
        return axios.create({
            baseURL: `${API_BASE_URL}/api`,
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            timeout: 8000
        });
    };

    const createFormDataApi = () => {
        const token = getAuthToken();
        const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4444';
        
        return axios.create({
            baseURL: `${API_BASE_URL}/api`,
            headers: {
                'Authorization': `Bearer ${token}`,
            },
            timeout: 10000
        });
    };

    // Helper function to get achievement image URL
    const getAchievementImageUrl = (imagePath?: string): string => {
        const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4444';
        
        if (!imagePath) {
            return `${baseUrl}/uploads/default-achievement.png`;
        }
        
        // If already full URL
        if (imagePath.startsWith('http')) {
            return imagePath;
        }
        
        // If starts with /uploads/
        if (imagePath.startsWith('/uploads/')) {
            return `${baseUrl}${imagePath}`;
        }
        
        // If it's just a filename, assume it's in uploads/general/
        return `${baseUrl}/uploads/general/${imagePath}`;
    };

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                setDashboardLoading(true);
                const token = localStorage.getItem('token');
                
                if (!token) {
                    navigate('/auth/user/login');
                    return;
                }

                const api = createApi();
                const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4444';

                try {
                    const profileResponse = await api.get('/owners/profile');
                    if (profileResponse.data.success) {
                        setUser(profileResponse.data.owner);
                    }
                } catch (profileErr: any) {
                    console.log('Profile fetch error:', profileErr.message);
                }

                try {
                    const countsRes = await axios.get(`${API_BASE_URL}/api/user-services/stats/count-by-type`);
                    if (countsRes.data.success) {
                        const countObj = { web: 0, design: 0, mobile: 0 };
                        countsRes.data.data.forEach((item: any) => {
                            countObj[item._id] = item.count;
                        });
                        setServiceCounts(countObj);
                    }
                } catch (countsErr) {
                    console.log('Counts fetch error:', countsErr);
                }

                try {
                    const servicesRes = await api.get('/user-services');
                    if (servicesRes.data.success) {
                        setServices(servicesRes.data.data);
                        
                        if (Object.values(serviceCounts).every(count => count === 0)) {
                            const servicesData = servicesRes.data.data;
                            const calculatedCounts = {
                                web: servicesData.filter((s: Service) => s.serviceType === 'web').length,
                                design: servicesData.filter((s: Service) => s.serviceType === 'design').length,
                                mobile: servicesData.filter((s: Service) => s.serviceType === 'mobile').length
                            };
                            setServiceCounts(calculatedCounts);
                        }
                    }
                } catch (serviceErr) {
                    console.log('Services fetch error:', serviceErr.message);
                }

                try {
                    const achievementsRes = await api.get('/achievements');
                    if (achievementsRes.data.success) {
                        console.log('Achievements loaded:', achievementsRes.data.data);
                        if (achievementsRes.data.data.length > 0) {
                            console.log('First achievement image path:', achievementsRes.data.data[0].image);
                        }
                        setAchievements(achievementsRes.data.data);
                    }
                } catch (achievementErr) {
                    console.log('Achievements fetch error:', achievementErr.message);
                }

                try {
                    const messagesRes = await axios.get(`${API_BASE_URL}/api/contact/messages`);
                    if (messagesRes.data.success) {
                        setMessages(messagesRes.data.data || []);
                    }
                } catch (messageErr) {
                    console.log('Messages fetch error:', messageErr.message);
                }

            } catch (error: any) {
                console.error('Error in dashboard setup:', error);
                setError('Failed to load dashboard data. Some features may be unavailable.');
                
                const errorNotif: Notification = {
                    id: Date.now().toString(),
                    type: 'error',
                    title: 'Connection Error',
                    message: 'Unable to connect to server. Using demo data.',
                    timestamp: new Date().toLocaleTimeString(),
                    read: false
                };
                
                setNewNotification(errorNotif);
                setTimeout(() => setNewNotification(null), 5000);
            } finally {
                setDashboardLoading(false);
            }
        };

        fetchDashboardData();
    }, [navigate]);

    // ========== SERVICE CRUD FUNCTIONS ==========
    const handleServiceInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setServiceFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleServiceFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setServiceFormData(prev => ({
                ...prev,
                image: e.target.files![0]
            }));
        }
    };

    const resetServiceForm = () => {
        setServiceFormData({
            name: '',
            serviceType: 'web',
            description: '',
            price: '',
            technologies: '',
            image: null
        });
        setIsCreatingService(false);
        setIsEditingService(null);
    };

    const handleServiceEditClick = (service: Service) => {
        setIsEditingService(service._id);
        setIsCreatingService(true);
        setServiceFormData({
            name: service.name,
            serviceType: service.serviceType,
            description: service.description,
            price: service.price.toString(),
            technologies: service.technologies?.join(', ') || '',
            image: null
        });
    };

    const handleServiceSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        try {
            const api = createFormDataApi();
            
            const formDataToSend = new FormData();
            formDataToSend.append('name', serviceFormData.name);
            formDataToSend.append('serviceType', serviceFormData.serviceType);
            formDataToSend.append('description', serviceFormData.description);
            formDataToSend.append('price', serviceFormData.price);
            
            if (serviceFormData.technologies) {
                formDataToSend.append('technologies', serviceFormData.technologies);
            }
            
            if (serviceFormData.image) {
                formDataToSend.append('image', serviceFormData.image);
            }

            let response;
            
            if (isEditingService) {
                response = await api.put(`/user-services/${isEditingService}`, formDataToSend);
            } else {
                response = await api.post('/user-services', formDataToSend);
            }
            
            if (response.data.success) {
                if (isEditingService) {
                    setServices(prev => prev.map(service => 
                        service._id === isEditingService ? response.data.data : service
                    ));
                } else {
                    setServices(prev => [response.data.data, ...prev]);
                }
                
                const updatedCounts = { ...serviceCounts };
                if (isEditingService) {
                    const oldService = services.find(s => s._id === isEditingService);
                    const newService = response.data.data;
                    
                    if (oldService && oldService.serviceType !== newService.serviceType) {
                        updatedCounts[oldService.serviceType] = Math.max(0, updatedCounts[oldService.serviceType] - 1);
                        updatedCounts[newService.serviceType] = (updatedCounts[newService.serviceType] || 0) + 1;
                    }
                } else {
                    updatedCounts[response.data.data.serviceType] = (updatedCounts[response.data.data.serviceType] || 0) + 1;
                }
                setServiceCounts(updatedCounts);
                
                const newNotif: Notification = {
                    id: Date.now().toString(),
                    type: 'success',
                    title: `Service ${isEditingService ? 'Updated' : 'Created'}`,
                    message: `Service "${response.data.data.name}" ${isEditingService ? 'updated' : 'created'} successfully`,
                    timestamp: new Date().toLocaleTimeString(),
                    read: false
                };
                
                setNewNotification(newNotif);
                setNotifications(prev => [newNotif, ...prev]);
                
                resetServiceForm();
                
                setTimeout(() => {
                    setNewNotification(null);
                }, 5000);
            }
            
        } catch (error: any) {
            console.error('Error saving service:', error);
            
            const errorNotif: Notification = {
                id: Date.now().toString(),
                type: 'error',
                title: isEditingService ? 'Update Failed' : 'Creation Failed',
                message: error.response?.data?.message || 'Failed to save service. Please try again.',
                timestamp: new Date().toLocaleTimeString(),
                read: false
            };
            
            setNewNotification(errorNotif);
            setNotifications(prev => [errorNotif, ...prev]);
            
            setTimeout(() => {
                setNewNotification(null);
            }, 5000);
        }
    };

    const handleServiceDelete = async (id: string, name: string) => {
        if (!window.confirm(`Are you sure you want to delete "${name}"?`)) {
            return;
        }
        
        try {
            const api = createApi();
            const serviceToDelete = services.find(s => s._id === id);
            
            const response = await api.delete(`/user-services/${id}`);
            
            if (response.data.success) {
                setServices(prev => prev.filter(service => service._id !== id));
                
                if (serviceToDelete) {
                    const updatedCounts = { ...serviceCounts };
                    updatedCounts[serviceToDelete.serviceType] = Math.max(0, updatedCounts[serviceToDelete.serviceType] - 1);
                    setServiceCounts(updatedCounts);
                }
                
                const newNotif: Notification = {
                    id: Date.now().toString(),
                    type: 'success',
                    title: 'Service Deleted',
                    message: `Service "${name}" deleted successfully`,
                    timestamp: new Date().toLocaleTimeString(),
                    read: false
                };
                
                setNewNotification(newNotif);
                setNotifications(prev => [newNotif, ...prev]);
                
                setTimeout(() => {
                    setNewNotification(null);
                }, 5000);
            }
            
        } catch (error: any) {
            console.error('Error deleting service:', error);
            
            const errorNotif: Notification = {
                id: Date.now().toString(),
                type: 'error',
                title: 'Deletion Failed',
                message: error.response?.data?.message || 'Failed to delete service',
                timestamp: new Date().toLocaleTimeString(),
                read: false
            };
            
            setNewNotification(errorNotif);
            setNotifications(prev => [errorNotif, ...prev]);
            
            setTimeout(() => {
                setNewNotification(null);
            }, 5000);
        }
    };

    // ========== ACHIEVEMENT CRUD FUNCTIONS ==========
    const handleAchievementInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setAchievementFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleAchievementFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setAchievementFormData(prev => ({
                ...prev,
                image: e.target.files![0]
            }));
        }
    };

    const resetAchievementForm = () => {
        setAchievementFormData({
            title: '',
            description: '',
            date: new Date().toISOString().split('T')[0],
            image: null
        });
        setIsCreatingAchievement(false);
        setIsEditingAchievement(null);
    };

    const handleAchievementEditClick = (achievement: Achievement) => {
        setIsEditingAchievement(achievement._id);
        setIsCreatingAchievement(true);
        setAchievementFormData({
            title: achievement.title,
            description: achievement.description,
            date: achievement.date ? new Date(achievement.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
            image: null
        });
    };

    const handleAchievementSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        try {
            const api = createFormDataApi();
            
            const formDataToSend = new FormData();
            formDataToSend.append('title', achievementFormData.title);
            formDataToSend.append('description', achievementFormData.description);
            
            // Always send date, use current date if empty
            const dateToSend = achievementFormData.date || new Date().toISOString().split('T')[0];
            formDataToSend.append('date', dateToSend);
            
            if (achievementFormData.image) {
                formDataToSend.append('image', achievementFormData.image);
            }

            let response;
            
            if (isEditingAchievement) {
                response = await api.put(`/achievements/${isEditingAchievement}`, formDataToSend);
            } else {
                response = await api.post('/achievements', formDataToSend);
            }
            
            if (response.data.success) {
                if (isEditingAchievement) {
                    setAchievements(prev => prev.map(achievement => 
                        achievement._id === isEditingAchievement ? response.data.data : achievement
                    ));
                } else {
                    setAchievements(prev => [response.data.data, ...prev]);
                }
                
                const newNotif: Notification = {
                    id: Date.now().toString(),
                    type: 'success',
                    title: `Achievement ${isEditingAchievement ? 'Updated' : 'Created'}`,
                    message: `Achievement "${response.data.data.title}" ${isEditingAchievement ? 'updated' : 'created'} successfully`,
                    timestamp: new Date().toLocaleTimeString(),
                    read: false
                };
                
                setNewNotification(newNotif);
                setNotifications(prev => [newNotif, ...prev]);
                
                resetAchievementForm();
                
                setTimeout(() => {
                    setNewNotification(null);
                }, 5000);
            }
            
        } catch (error: any) {
            console.error('Error saving achievement:', error);
            
            const errorNotif: Notification = {
                id: Date.now().toString(),
                type: 'error',
                title: isEditingAchievement ? 'Update Failed' : 'Creation Failed',
                message: error.response?.data?.message || 'Failed to save achievement. Please try again.',
                timestamp: new Date().toLocaleTimeString(),
                read: false
            };
            
            setNewNotification(errorNotif);
            setNotifications(prev => [errorNotif, ...prev]);
            
            setTimeout(() => {
                setNewNotification(null);
            }, 5000);
        }
    };

    const handleAchievementDelete = async (id: string, title: string) => {
        if (!window.confirm(`Are you sure you want to delete "${title}"?`)) {
            return;
        }
        
        try {
            const api = createApi();
            
            const response = await api.delete(`/achievements/${id}`);
            
            if (response.data.success) {
                setAchievements(prev => prev.filter(achievement => achievement._id !== id));
                
                const newNotif: Notification = {
                    id: Date.now().toString(),
                    type: 'success',
                    title: 'Achievement Deleted',
                    message: `Achievement "${title}" deleted successfully`,
                    timestamp: new Date().toLocaleTimeString(),
                    read: false
                };
                
                setNewNotification(newNotif);
                setNotifications(prev => [newNotif, ...prev]);
                
                setTimeout(() => {
                    setNewNotification(null);
                }, 5000);
            }
            
        } catch (error: any) {
            console.error('Error deleting achievement:', error);
            
            const errorNotif: Notification = {
                id: Date.now().toString(),
                type: 'error',
                title: 'Deletion Failed',
                message: error.response?.data?.message || 'Failed to delete achievement',
                timestamp: new Date().toLocaleTimeString(),
                read: false
            };
            
            setNewNotification(errorNotif);
            setNotifications(prev => [errorNotif, ...prev]);
            
            setTimeout(() => {
                setNewNotification(null);
            }, 5000);
        }
    };

    // ========== RENDER FUNCTIONS ==========
    const renderServiceForm = () => (
        <form onSubmit={handleServiceSubmit} className="service-form">
            <div className="form-header">
                <h4>{isEditingService ? 'Edit Service' : 'Create New Service'}</h4>
                <button 
                    type="button" 
                    className="btn-cancel"
                    onClick={resetServiceForm}
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
                    value={serviceFormData.name}
                    onChange={handleServiceInputChange}
                    required
                />
            </div>
            
            <div className="form-group">
                <label>Service Type *</label>
                <select 
                    name="serviceType"
                    className="form-select"
                    value={serviceFormData.serviceType}
                    onChange={handleServiceInputChange}
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
                    value={serviceFormData.description}
                    onChange={handleServiceInputChange}
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
                        value={serviceFormData.price}
                        onChange={handleServiceInputChange}
                        required
                        min="0"
                        step="0.01"
                    />
                </div>
                
                <div className="form-group">
                    <label>Image</label>
                    <input 
                        type="file"
                        accept="image/*"
                        className="form-file"
                        onChange={handleServiceFileChange}
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
                    value={serviceFormData.technologies}
                    onChange={handleServiceInputChange}
                />
                <small>Separate technologies with commas</small>
            </div>
            
            <div className="form-actions">
                <button type="submit" className="btn-primary">
                    {isEditingService ? 'Update Service' : 'Create Service'}
                </button>
            </div>
        </form>
    );

    const renderAchievementForm = () => (
        <form onSubmit={handleAchievementSubmit} className="service-form">
            <div className="form-header">
                <h4>{isEditingAchievement ? 'Edit Achievement' : 'Create New Achievement'}</h4>
                <button 
                    type="button" 
                    className="btn-cancel"
                    onClick={resetAchievementForm}
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
                    value={achievementFormData.title}
                    onChange={handleAchievementInputChange}
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
                    value={achievementFormData.description}
                    onChange={handleAchievementInputChange}
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
                        value={achievementFormData.date}
                        onChange={handleAchievementInputChange}
                    />
                </div>
                
                <div className="form-group">
                    <label>Image</label>
                    <input 
                        type="file"
                        accept="image/*"
                        className="form-file"
                        onChange={handleAchievementFileChange}
                    />
                    <small>Upload achievement image/certificate</small>
                </div>
            </div>
            
            <div className="form-actions">
                <button type="submit" className="btn-primary">
                    {isEditingAchievement ? 'Update Achievement' : 'Create Achievement'}
                </button>
            </div>
        </form>
    );

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
                            {service.image ? (
                                <img 
                                    src={`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:4444'}/uploads/services/${service.image.replace('/uploads/', '')}`}
                                    alt={service.name}
                                    onError={(e) => {
                                        const fallbackUrl = `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:4444'}${service.image}`;
                                        (e.target as HTMLImageElement).src = fallbackUrl;
                                    }}
                                />
                            ) : (
                                <div className="image-placeholder">
                                    {service.name.charAt(0)}
                                </div>
                            )}
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
                                        onClick={() => handleServiceEditClick(service)}
                                    >
                                        <i className="fas fa-edit"></i> Edit
                                    </button>
                                    <button 
                                        className="btn-delete"
                                        onClick={() => handleServiceDelete(service._id, service.name)}
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
                            {achievement.image ? (
                                <img 
                                    src={getAchievementImageUrl(achievement.image)}
                                    alt={achievement.title}
                                    onError={(e) => {
                                        const img = e.target as HTMLImageElement;
                                        const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4444';
                                        
                                        // Try alternative paths
                                        const currentSrc = img.src;
                                        const filename = currentSrc.split('/').pop();
                                        
                                        if (filename) {
                                            // Try uploads/general/ first
                                            img.src = `${baseUrl}/uploads/general/${filename}`;
                                            
                                            // If that fails, try uploads/achievements/
                                            img.onerror = () => {
                                                img.src = `${baseUrl}/uploads/achievements/${filename}`;
                                                
                                                // If that also fails, show trophy icon
                                                img.onerror = () => {
                                                    img.style.display = 'none';
                                                    const parent = img.parentElement;
                                                    if (parent) {
                                                        const placeholder = document.createElement('div');
                                                        placeholder.className = 'image-placeholder';
                                                        placeholder.innerHTML = '<i class="fas fa-trophy"></i>';
                                                        parent.appendChild(placeholder);
                                                    }
                                                };
                                            };
                                        }
                                    }}
                                />
                            ) : (
                                <div className="image-placeholder">
                                    <i className="fas fa-trophy"></i>
                                </div>
                            )}
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
                                        onClick={() => handleAchievementEditClick(achievement)}
                                    >
                                        <i className="fas fa-edit"></i> Edit
                                    </button>
                                    <button 
                                        className="btn-delete"
                                        onClick={() => handleAchievementDelete(achievement._id, achievement.title)}
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

    const unreadMessagesCount = messages.filter(msg => !msg.read).length;
    const unreadNotificationsCount = notifications.filter(notif => !notif.read).length;

    return (
        <div className="dashboard-dark">
            <Header />
            
            {newNotification && (
                <div className={`notification-popup notification-${newNotification.type}`}>
                    <div className="notification-icon">
                        {newNotification.type === 'success' && <i className="fas fa-check-circle"></i>}
                        {newNotification.type === 'error' && <i className="fas fa-exclamation-triangle"></i>}
                        {newNotification.type === 'info' && <i className="fas fa-info-circle"></i>}
                        {newNotification.type === 'warning' && <i className="fas fa-exclamation-circle"></i>}
                    </div>
                    <div className="notification-content">
                        <h4 className="notification-title">{newNotification.title}</h4>
                        <p className="notification-text">{newNotification.message}</p>
                    </div>
                    <button 
                        className="notification-close" 
                        onClick={() => setNewNotification(null)}
                    >
                        <i className="fas fa-times"></i>
                    </button>
                </div>
            )}
            
            <div className='profile-header'>
                <img src={Profile} alt="Profile" />
                <h1>{user?.username || 'Lenodev'}</h1>
                <h2>{user?.email || 'Loading...'}</h2>
                <hr />
            </div>
            
            <div className='dashboard-card'>
                <div className='card-cont'>
                    <div className="dash-cards">
                        <img src={WebIcon} alt="Web Development" />
                        <h1>Full-Stack Development</h1>
                        <h3>{serviceCounts.web} projects</h3>
                        {unreadMessagesCount > 0 && (
                            <div className="card-notification-badge">
                                {unreadMessagesCount} new message{unreadMessagesCount > 1 ? 's' : ''}
                            </div>
                        )}
                    </div>
                    <div className="dash-cards">
                        <img src={CubeIcon} alt="Product Design" />
                        <h1>Product Design</h1>
                        <h3>{serviceCounts.design} projects</h3>
                    </div>
                    <div className="dash-cards">
                        <img src={MobileIcon} alt="Mobile Development" />
                        <h1>Mobile App Development</h1>
                        <h3>{serviceCounts.mobile} projects</h3>
                        {unreadNotificationsCount > 0 && (
                            <div className="card-notification-badge">
                                {unreadNotificationsCount} notification{unreadNotificationsCount > 1 ? 's' : ''}
                            </div>
                        )}
                    </div>
                </div>
                
                <div className='dashboard-content'>
                    <div className="dashboard-controls">
                        <div className="control-left">
                            <select 
                                value={selectedOption}
                                onChange={(e) => {
                                    setSelectedOption(e.target.value);
                                    resetServiceForm();
                                    resetAchievementForm();
                                }}
                                className="content-select"
                            >
                                <option value="Project">Projects</option>                                
                                <option value="Achievement">Achievements</option>                                
                                <option value="Service">Services</option>                                
                                <option value="Client">Clients</option>                                
                            </select>
                        </div>
                        
                        <div className="control-right">
                            {selectedOption === 'Service' && !isCreatingService && (
                                <button 
                                    className="btn-primary"
                                    onClick={() => setIsCreatingService(true)}
                                >
                                    <i className="fas fa-plus"></i> Create Service
                                </button>
                            )}
                            {selectedOption === 'Achievement' && !isCreatingAchievement && (
                                <button 
                                    className="btn-primary"
                                    onClick={() => setIsCreatingAchievement(true)}
                                >
                                    <i className="fas fa-plus"></i> Create Achievement
                                </button>
                            )}
                        </div>
                    </div>
                    
                    <div className="dashboard-main-area">
                        <div className="main-content">
                            {dashboardLoading ? (
                                <div className="loading-content">
                                    <div className="loading-spinner"></div>
                                    <p>Loading dashboard data...</p>
                                </div>
                            ) : error ? (
                                <div className="error-content">
                                    <i className="fas fa-exclamation-triangle"></i>
                                    <h4>Connection Error</h4>
                                    <p>{error}</p>
                                </div>
                            ) : (
                                <div className="content-area">
                                    {selectedOption === 'Service' && (
                                        <>
                                            {(isCreatingService || isEditingService) && renderServiceForm()}
                                            <div className="services-section">
                                                <div className="section-header">
                                                    <h3>My Services ({services.length})</h3>
                                                    {!isCreatingService && !isEditingService && (
                                                        <button 
                                                            className="btn-secondary"
                                                            onClick={() => setIsCreatingService(true)}
                                                        >
                                                            <i className="fas fa-plus"></i> Add Service
                                                        </button>
                                                    )}
                                                </div>
                                                {renderServiceCards()}
                                            </div>
                                        </>
                                    )}
                                    
                                    {selectedOption === 'Project' && (
                                        <div className="projects-section">
                                            <h3>Projects Management</h3>
                                            <p>This is where your project management content goes.</p>
                                        </div>
                                    )}
                                    
                                    {selectedOption === 'Achievement' && (
                                        <>
                                            {(isCreatingAchievement || isEditingAchievement) && renderAchievementForm()}
                                            <div className="achievements-section">
                                                <div className="section-header">
                                                    <h3>My Achievements ({achievements.length})</h3>
                                                    {!isCreatingAchievement && !isEditingAchievement && (
                                                        <button 
                                                            className="btn-secondary"
                                                            onClick={() => setIsCreatingAchievement(true)}
                                                        >
                                                            <i className="fas fa-plus"></i> Add Achievement
                                                        </button>
                                                    )}
                                                </div>
                                                {renderAchievementCards()}
                                            </div>
                                        </>
                                    )}
                                    
                                    {selectedOption === 'Client' && (
                                        <div className="clients-section">
                                            <h3>Clients ({messages.length})</h3>
                                            {messages.length === 0 ? (
                                                <div className="no-messages">
                                                    <i className="fas fa-comments"></i>
                                                    <p>No client messages yet</p>
                                                </div>
                                            ) : (
                                                <div className="messages-list">
                                                    {messages.slice(0, 5).map(message => (
                                                        <div key={message._id} className="message-item">
                                                            <strong>{message.username}</strong>
                                                            <p>{message.message.substring(0, 100)}...</p>
                                                            <small>{message.email} • {message.project_Type}</small>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;