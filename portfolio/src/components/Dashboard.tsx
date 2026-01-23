import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Header from './Header';
import Profile from '../assets/bak/lenodevprofile.jpg';
// ✅ Correct image imports
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

interface DashboardStats {
    achievementsCount: number;
    servicesCount: number;
    messagesCount: number;
    totalVisitors: number;
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
    
    // State for data
    const [messages, setMessages] = useState<Message[]>([]);
    const [achievements, setAchievements] = useState<Achievement[]>([]);
    const [services, setServices] = useState<Service[]>([]);
    
    // UI State
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [activeMessage, setActiveMessage] = useState<Message | null>(null);
    const [showNotifications, setShowNotifications] = useState(false);
    const [showMessages, setShowMessages] = useState(false);
    const [newNotification, setNewNotification] = useState<Notification | null>(null);
    const [selectedOption, setSelectedOption] = useState<string>('Project');
    
    // Service CRUD State
    const [isCreating, setIsCreating] = useState(false);
    const [isEditing, setIsEditing] = useState<string | null>(null); // Service ID being edited
    const [formData, setFormData] = useState({
        name: '',
        serviceType: 'web' as 'web' | 'mobile' | 'design',
        description: '',
        price: '',
        technologies: '',
        image: null as File | null
    });
    
    // Dynamic counts for cards
    const [serviceCounts, setServiceCounts] = useState({ 
        web: 0, 
        design: 0, 
        mobile: 0 
    });

    // ✅ Create axios instance with environment variable
    const createApi = () => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/auth/user/login');
            throw new Error('No token found');
        }
        
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

    // ✅ Fetch dashboard data including service counts
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

                // Fetch user profile
                try {
                    const profileResponse = await api.get('/owners/profile');
                    if (profileResponse.data.success) {
                        setUser(profileResponse.data.owner);
                    }
                } catch (profileErr: any) {
                    console.log('Profile fetch error:', profileErr.message);
                }

                // Fetch service counts by type
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
                    console.log('Counts fetch error, will calculate from services list');
                }

                // Fetch all services
                try {
                    const servicesRes = await api.get('/user-services');
                    if (servicesRes.data.success) {
                        setServices(servicesRes.data.data);
                        
                        // If counts endpoint failed, calculate manually
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

                // Fetch achievements
                try {
                    const achievementsRes = await api.get('/achievements');
                    if (achievementsRes.data.success) {
                        setAchievements(achievementsRes.data.data);
                    }
                } catch (achievementErr) {
                    console.log('Achievements fetch error:', achievementErr.message);
                }

                // Fetch messages
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

    // ✅ Handle form input changes
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // ✅ Handle file input for image upload
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFormData(prev => ({
                ...prev,
                image: e.target.files![0]
            }));
        }
    };

    // ✅ Reset form to default values
    const resetForm = () => {
        setFormData({
            name: '',
            serviceType: 'web',
            description: '',
            price: '',
            technologies: '',
            image: null
        });
        setIsCreating(false);
        setIsEditing(null);
    };

    // ✅ Set form data for editing a service
    const handleEditClick = (service: Service) => {
        setIsEditing(service._id);
        setIsCreating(true);
        setFormData({
            name: service.name,
            serviceType: service.serviceType,
            description: service.description,
            price: service.price.toString(),
            technologies: service.technologies?.join(', ') || '',
            image: null
        });
    };

    // ✅ Handle service creation/update
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        try {
            const api = createApi();
            const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4444';
            
            // Prepare form data (including file)
            const formDataToSend = new FormData();
            formDataToSend.append('name', formData.name);
            formDataToSend.append('serviceType', formData.serviceType);
            formDataToSend.append('description', formData.description);
            formDataToSend.append('price', formData.price);
            if (formData.technologies) {
                formDataToSend.append('technologies', formData.technologies);
            }
            if (formData.image) {
                formDataToSend.append('image', formData.image);
            }

            let response;
            
            if (isEditing) {
                // Update existing service
                response = await api.put(`/user-services/${isEditing}`, formDataToSend, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                });
            } else {
                // Create new service
                response = await api.post('/user-services', formDataToSend, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                });
            }
            
            if (response.data.success) {
                // Update local services state
                if (isEditing) {
                    setServices(prev => prev.map(service => 
                        service._id === isEditing ? response.data.data : service
                    ));
                } else {
                    setServices(prev => [response.data.data, ...prev]);
                }
                
                // Update counts
                const updatedCounts = { ...serviceCounts };
                if (isEditing) {
                    // If editing, we need to check if service type changed
                    const oldService = services.find(s => s._id === isEditing);
                    const newService = response.data.data;
                    
                    if (oldService && oldService.serviceType !== newService.serviceType) {
                        updatedCounts[oldService.serviceType] = Math.max(0, updatedCounts[oldService.serviceType] - 1);
                        updatedCounts[newService.serviceType] = (updatedCounts[newService.serviceType] || 0) + 1;
                    }
                } else {
                    // For new service, increment the count
                    updatedCounts[response.data.data.serviceType] = (updatedCounts[response.data.data.serviceType] || 0) + 1;
                }
                setServiceCounts(updatedCounts);
                
                // Show success notification
                const newNotif: Notification = {
                    id: Date.now().toString(),
                    type: 'success',
                    title: `Service ${isEditing ? 'Updated' : 'Created'}`,
                    message: `Service "${response.data.data.name}" ${isEditing ? 'updated' : 'created'} successfully`,
                    timestamp: new Date().toLocaleTimeString(),
                    read: false
                };
                
                setNewNotification(newNotif);
                setNotifications(prev => [newNotif, ...prev]);
                
                // Reset form
                resetForm();
                
                setTimeout(() => {
                    setNewNotification(null);
                }, 5000);
            }
            
        } catch (error: any) {
            console.error('Error saving service:', error);
            
            const errorNotif: Notification = {
                id: Date.now().toString(),
                type: 'error',
                title: isEditing ? 'Update Failed' : 'Creation Failed',
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

    // ✅ Handle service deletion
    const handleDelete = async (id: string, name: string) => {
        if (!window.confirm(`Are you sure you want to delete "${name}"?`)) {
            return;
        }
        
        try {
            const api = createApi();
            const serviceToDelete = services.find(s => s._id === id);
            
            const response = await api.delete(`/user-services/${id}`);
            
            if (response.data.success) {
                // Remove from state
                setServices(prev => prev.filter(service => service._id !== id));
                
                // Update counts
                if (serviceToDelete) {
                    const updatedCounts = { ...serviceCounts };
                    updatedCounts[serviceToDelete.serviceType] = Math.max(0, updatedCounts[serviceToDelete.serviceType] - 1);
                    setServiceCounts(updatedCounts);
                }
                
                // Show success notification
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

    // ✅ Service creation/editing form
    const renderServiceForm = () => (
        <form onSubmit={handleSubmit} className="service-form">
            <div className="form-header">
                <h4>{isEditing ? 'Edit Service' : 'Create New Service'}</h4>
                <button 
                    type="button" 
                    className="btn-cancel"
                    onClick={resetForm}
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
                    onChange={handleInputChange}
                    required
                />
            </div>
            
            <div className="form-group">
                <label>Service Type *</label>
                <select 
                    name="serviceType"
                    className="form-select"
                    value={formData.serviceType}
                    onChange={handleInputChange}
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
                    onChange={handleInputChange}
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
                        onChange={handleInputChange}
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
                        onChange={handleFileChange}
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
                    onChange={handleInputChange}
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

    // ✅ Render service cards
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
                                    src={`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:4444'}${service.image}`} 
                                    alt={service.name}
                                    onError={(e) => {
                                        (e.target as HTMLImageElement).style.display = 'none';
                                        const parent = (e.target as HTMLImageElement).parentElement;
                                        if (parent) {
                                            const placeholder = document.createElement('div');
                                            placeholder.className = 'image-placeholder';
                                            placeholder.textContent = service.name.charAt(0);
                                            parent.appendChild(placeholder);
                                        }
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
                            
                            <p className="service-description">{service.description}</p>
                            
                            <div className="service-footer">
                                <div className="service-meta">
                                    <span className="service-price">${service.price}</span>
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
                                        onClick={() => handleEditClick(service)}
                                    >
                                        <i className="fas fa-edit"></i> Edit
                                    </button>
                                    <button 
                                        className="btn-delete"
                                        onClick={() => handleDelete(service._id, service.name)}
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

    // Calculate unread counts
    const unreadMessagesCount = messages.filter(msg => !msg.read).length;
    const unreadNotificationsCount = notifications.filter(notif => !notif.read).length;

    return (
        <div className="dashboard-dark">
            <Header />
            
            {/* Notification Popup */}
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
            
            {/* ✅ Dynamic Dashboard Cards */}
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
                
                {/* Main Dashboard Content */}
                <div className='dashboard-content'>
                    <div className="dashboard-controls">
                        <div className="control-left">
                            <select 
                                value={selectedOption}
                                onChange={(e) => {
                                    setSelectedOption(e.target.value);
                                    resetForm();
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
                            {selectedOption === 'Service' && !isCreating && (
                                <button 
                                    className="btn-primary"
                                    onClick={() => setIsCreating(true)}
                                >
                                    <i className="fas fa-plus"></i> Create Service
                                </button>
                            )}
                        </div>
                    </div>
                    
                    <div className="dashboard-main-area">
                        {/* Main Content Area */}
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
                                            {isCreating || isEditing ? renderServiceForm() : null}
                                            <div className="services-section">
                                                <div className="section-header">
                                                    <h3>My Services ({services.length})</h3>
                                                    {!isCreating && !isEditing && (
                                                        <button 
                                                            className="btn-secondary"
                                                            onClick={() => setIsCreating(true)}
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
                                        <div className="achievements-section">
                                            <h3>Achievements ({achievements.length})</h3>
                                            {achievements.length === 0 ? (
                                                <div className="no-achievements">
                                                    <i className="fas fa-trophy"></i>
                                                    <p>No achievements yet</p>
                                                </div>
                                            ) : (
                                                <div className="achievements-list">
                                                    {achievements.map(achievement => (
                                                        <div key={achievement._id} className="achievement-item">
                                                            <span className="achievement-icon">🏆</span>
                                                            <div>
                                                                <h4>{achievement.title}</h4>
                                                                <p>{achievement.description}</p>
                                                                <small>{new Date(achievement.date).toLocaleDateString()}</small>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
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