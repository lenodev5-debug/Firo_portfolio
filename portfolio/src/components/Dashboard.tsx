import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Header from './Header';
import Profile from '../assets/bak/lenodevprofile.jpg';

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
    serviceType: string;
    description: string;
    price: number;
    image: string;
}

const Dashboard = () => {
    const [user, setUser] = useState<UserProfile | null>(null);
    const [stats, setStats] = useState<DashboardStats>({
        achievementsCount: 0,
        servicesCount: 0,
        messagesCount: 0,
        totalVisitors: 1245 // Static for now
    });
    const [dashboardLoading, setDashboardLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();
    
    // Messages and notifications state
    const [messages, setMessages] = useState<Message[]>([]);
    const [achievements, setAchievements] = useState<Achievement[]>([]);
    const [services, setServices] = useState<Service[]>([]);
    
    const [notifications, setNotifications] = useState<Notification[]>([
        {
            id: '1',
            type: 'info',
            title: 'Welcome to Dashboard',
            message: 'Your dashboard is now connected to the backend',
            timestamp: 'Just now',
            read: false
        }
    ]);
    
    const [activeMessage, setActiveMessage] = useState<Message | null>(null);
    const [showNotifications, setShowNotifications] = useState(false);
    const [showMessages, setShowMessages] = useState(false);
    const [newNotification, setNewNotification] = useState<Notification | null>(null);
    const [selectedOption, setSelectedOption] = useState<string>('Project');
    const [isCreating, setIsCreating] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        serviceType: 'web',
        price: '',
        name: '',
        technologies: '',
        status: 'active'
    });

    // Create axios instance with auth token
    const createApi = () => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/auth/user/login');
            throw new Error('No token found');
        }
        
        return axios.create({
            baseURL: 'http://localhost:4444/api',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            timeout: 8000 // Reduced from 10s to 8s
        });
    };

    // Fetch user profile and dashboard data
    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                setDashboardLoading(true);
                const token = localStorage.getItem('token');
                
                if (!token) {
                    navigate('/auth/user/login');
                    return;
                }

                // Create API instance for authenticated requests
                const api = createApi();

                // Fetch user profile with better error handling
                try {
                    const profileResponse = await api.get('/owners/profile');
                    if (profileResponse.data.success) {
                        setUser(profileResponse.data.owner);
                    }
                } catch (profileErr: any) {
                    console.log('Profile fetch error:', profileErr.message);
                    // Continue even if profile fetch fails
                }

                // Try to fetch data with fallbacks
                try {
                    // Fetch messages (public endpoint - no auth needed)
                    const messagesRes = await axios.get('http://localhost:4444/api/contact/messages', {
                        timeout: 5000
                    }).catch(() => ({
                        data: { success: false, data: [] }
                    }));

                    if (messagesRes.data.success && messagesRes.data.data) {
                        const formattedMessages: Message[] = messagesRes.data.data.map((msg: any) => ({
                            _id: msg._id,
                            username: msg.username || 'Unknown',
                            email: msg.email,
                            project_Type: msg.project_Type,
                            message: msg.message,
                            createdAt: new Date(msg.createdAt).toLocaleString(),
                            read: false,
                            status: 'new',
                            phone: msg.phone,
                            budget: msg.budget,
                            timeline: msg.timeline
                        }));
                        
                        setMessages(formattedMessages);
                        setStats(prev => ({ ...prev, messagesCount: formattedMessages.length }));
                    }

                    // Fetch achievements
                    const achievementsRes = await api.get('/achievements').catch(() => ({
                        data: { success: false, data: [] }
                    }));

                    if (achievementsRes.data.success && achievementsRes.data.data) {
                        setAchievements(achievementsRes.data.data);
                        setStats(prev => ({ ...prev, achievementsCount: achievementsRes.data.data.length }));
                    }

                    // Fetch services
                    const servicesRes = await api.get('/user-services').catch(() => ({
                        data: { success: false, data: [] }
                    }));

                    if (servicesRes.data.success && servicesRes.data.data) {
                        setServices(servicesRes.data.data);
                        setStats(prev => ({ ...prev, servicesCount: servicesRes.data.data.length }));
                    }

                } catch (dataErr: any) {
                    console.log('Data fetch error:', dataErr.message);
                    // Use mock data if backend fails
                    if (messages.length === 0) {
                        const mockMessages: Message[] = [
                            {
                                _id: '1',
                                username: 'John Doe',
                                email: 'john@example.com',
                                project_Type: 'Web Design',
                                message: 'Hi, I would like to discuss a potential web project...',
                                createdAt: new Date().toLocaleString(),
                                read: false,
                                status: 'new'
                            },
                            {
                                _id: '2',
                                username: 'Sarah Smith',
                                email: 'sarah@design.co',
                                project_Type: 'Mobile App',
                                message: 'Looking to collaborate on a mobile app design project...',
                                createdAt: new Date().toLocaleString(),
                                read: true,
                                status: 'replied'
                            }
                        ];
                        setMessages(mockMessages);
                        setStats(prev => ({ ...prev, messagesCount: mockMessages.length }));
                    }
                }

            } catch (error: any) {
                console.error('Error in dashboard setup:', error);
                
                // Check for auth errors
                if (error.response?.status === 401 || error.message === 'No token found') {
                    localStorage.removeItem('token');
                    localStorage.removeItem('user');
                    navigate('/auth/user/login');
                } else {
                    setError('Failed to load dashboard data. Some features may be unavailable.');
                    
                    // Show error notification
                    const errorNotif: Notification = {
                        id: Date.now().toString(),
                        type: 'error',
                        title: 'Connection Error',
                        message: 'Unable to connect to server. Using demo data.',
                        timestamp: 'Just now',
                        read: false
                    };
                    
                    setNewNotification(errorNotif);
                    setTimeout(() => setNewNotification(null), 5000);
                }
            } finally {
                setDashboardLoading(false);
            }
        };

        fetchDashboardData();
        
        // Set up polling for new data (only if connection is working)
        let notificationInterval: NodeJS.Timeout;
        
        const startPolling = () => {
            notificationInterval = setInterval(() => {
                fetchDashboardData();
            }, 60000); // Poll every 60 seconds
        };
        
        startPolling();

        return () => {
            if (notificationInterval) {
                clearInterval(notificationInterval);
            }
        };
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/auth/user/login');
    };

    const handleMessageClick = (message: Message) => {
        setActiveMessage(message);
        // Mark as read
        setMessages(prev => prev.map(msg => 
            msg._id === message._id ? {...msg, read: true} : msg
        ));
    };

    const handleNotificationClick = (notification: Notification) => {
        // Mark as read
        setNotifications(prev => prev.map(notif => 
            notif.id === notification.id ? {...notif, read: true} : notif
        ));
    };

    const markAllAsRead = () => {
        setNotifications(prev => prev.map(notif => ({...notif, read: true})));
        setMessages(prev => prev.map(msg => ({...msg, read: true})));
    };

    const unreadMessagesCount = messages.filter(msg => !msg.read).length;
    const unreadNotificationsCount = notifications.filter(notif => !notif.read).length;

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!isCreating) {
            setIsCreating(true);
            return;
        }
        
        try {
            const api = createApi();
            let response;
            
            switch(selectedOption) {
                case 'Project':
                case 'Service':
                    response = await api.post('/user-services', {
                        name: formData.name || formData.title,
                        serviceType: formData.serviceType,
                        description: formData.description,
                        price: parseFloat(formData.price) || 0,
                        technologies: formData.technologies ? formData.technologies.split(',').map((t: string) => t.trim()) : []
                    });
                    break;
                    
                case 'Achievement':
                    response = await api.post('/achievements', {
                        title: formData.title,
                        description: formData.description,
                        date: new Date().toISOString()
                    });
                    break;
                    
                default:
                    throw new Error('Invalid option selected');
            }
            
            if (response.data.success) {
                const newNotif: Notification = {
                    id: Date.now().toString(),
                    type: 'success',
                    title: `${selectedOption} Created`,
                    message: `${selectedOption} created successfully`,
                    timestamp: 'Just now',
                    read: false
                };
                
                setNewNotification(newNotif);
                setNotifications(prev => [newNotif, ...prev]);
                
                // Refresh the specific data
                if (selectedOption === 'Achievement') {
                    const res = await api.get('/achievements');
                    setAchievements(res.data.data || []);
                } else {
                    const res = await api.get('/user-services');
                    setServices(res.data.data || []);
                }
                
                setFormData({
                    title: '',
                    description: '',
                    serviceType: 'web',
                    price: '',
                    name: '',
                    technologies: '',
                    status: 'active'
                });
                
                setIsCreating(false);
                
                setTimeout(() => {
                    setNewNotification(null);
                }, 5000);
            }
            
        } catch (error: any) {
            console.error('Error creating item:', error);
            const errorNotif: Notification = {
                id: Date.now().toString(),
                type: 'error',
                title: 'Creation Failed',
                message: error.response?.data?.message || 'Failed to create item. Check server connection.',
                timestamp: 'Just now',
                read: false
            };
            
            setNewNotification(errorNotif);
            setNotifications(prev => [errorNotif, ...prev]);
            
            setTimeout(() => {
                setNewNotification(null);
            }, 5000);
        }
    };

    const handleDelete = async (id: string, type: string) => {
        if (!window.confirm(`Are you sure you want to delete this ${type.toLowerCase()}?`)) {
            return;
        }
        
        try {
            const api = createApi();
            let endpoint = '';
            
            switch(type) {
                case 'Project':
                case 'Service':
                    endpoint = `/user-services/${id}`;
                    break;
                case 'Achievement':
                    endpoint = `/achievements/${id}`;
                    break;
                case 'Message':
                    endpoint = `/contact/${id}`;
                    break;
            }
            
            const response = await api.delete(endpoint);
            
            if (response.data.success) {
                // Remove from state
                switch(type) {
                    case 'Project':
                    case 'Service':
                        setServices(prev => prev.filter(item => item._id !== id));
                        break;
                    case 'Achievement':
                        setAchievements(prev => prev.filter(item => item._id !== id));
                        break;
                    case 'Message':
                        setMessages(prev => prev.filter(item => item._id !== id));
                        break;
                }
                
                const newNotif: Notification = {
                    id: Date.now().toString(),
                    type: 'success',
                    title: `${type} Deleted`,
                    message: `${type} deleted successfully`,
                    timestamp: 'Just now',
                    read: false
                };
                
                setNewNotification(newNotif);
                setNotifications(prev => [newNotif, ...prev]);
                
                setTimeout(() => {
                    setNewNotification(null);
                }, 5000);
            }
            
        } catch (error: any) {
            console.error('Error deleting item:', error);
            const errorNotif: Notification = {
                id: Date.now().toString(),
                type: 'error',
                title: 'Deletion Failed',
                message: error.response?.data?.message || 'Failed to delete item',
                timestamp: 'Just now',
                read: false
            };
            
            setNewNotification(errorNotif);
            setNotifications(prev => [errorNotif, ...prev]);
            
            setTimeout(() => {
                setNewNotification(null);
            }, 5000);
        }
    };

    const renderContentBasedOnOption = () => {
        const activeProjects = services.filter(s => s.serviceType === 'web' || s.serviceType === 'mobile');
        const designProjects = services.filter(s => s.serviceType === 'design');
        
        switch(selectedOption) {
            case 'Project':
                return (
                    <div className="option-content">
                        <h3>Projects Management ({services.length})</h3>
                        
                        {isCreating ? (
                            <form onSubmit={handleSubmit} className="creation-form">
                                <h4>Create New Project</h4>
                                <div className="form-group">
                                    <input 
                                        type="text" 
                                        name="name"
                                        placeholder="Project Name" 
                                        className="form-input"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <textarea 
                                        name="description"
                                        placeholder="Project Description" 
                                        className="form-textarea"
                                        value={formData.description}
                                        onChange={handleInputChange}
                                        required
                                    ></textarea>
                                </div>
                                <div className="form-row">
                                    <div className="form-group">
                                        <select 
                                            name="serviceType"
                                            className="form-select"
                                            value={formData.serviceType}
                                            onChange={handleInputChange}
                                            required
                                        >
                                            <option value="web">Web Development</option>
                                            <option value="mobile">Mobile App</option>
                                            <option value="design">Design</option>
                                        </select>
                                    </div>
                                    <div className="form-group">
                                        <input 
                                            type="number" 
                                            name="price"
                                            placeholder="Price" 
                                            className="form-input"
                                            value={formData.price}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="form-group">
                                    <input 
                                        type="text" 
                                        name="technologies"
                                        placeholder="Technologies (comma separated)" 
                                        className="form-input"
                                        value={formData.technologies}
                                        onChange={handleInputChange}
                                    />
                                </div>
                                <div className="form-actions">
                                    <button type="submit" className="btn-create">
                                        Create Project
                                    </button>
                                    <button 
                                        type="button" 
                                        className="btn-cancel"
                                        onClick={() => setIsCreating(false)}
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        ) : null}
                        
                        <div className="content-grid">
                            {services.map(service => (
                                <div key={service._id} className="content-card">
                                    <h4>{service.name}</h4>
                                    <p>{service.description.substring(0, 100)}...</p>
                                    <div className="card-meta">
                                        <span className={`service-type ${service.serviceType}`}>
                                            {service.serviceType}
                                        </span>
                                        <span className="service-price">${service.price}</span>
                                    </div>
                                    <div className="card-actions">
                                        <button className="btn-view">Edit</button>
                                        <button 
                                            className="btn-delete"
                                            onClick={() => handleDelete(service._id, 'Service')}
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                );
                
            case 'Achievement':
                return (
                    <div className="option-content">
                        <h3>Achievements ({achievements.length})</h3>
                        
                        {isCreating ? (
                            <form onSubmit={handleSubmit} className="creation-form">
                                <h4>Create New Achievement</h4>
                                <div className="form-group">
                                    <input 
                                        type="text" 
                                        name="title"
                                        placeholder="Achievement Title" 
                                        className="form-input"
                                        value={formData.title}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <textarea 
                                        name="description"
                                        placeholder="Achievement Description" 
                                        className="form-textarea"
                                        value={formData.description}
                                        onChange={handleInputChange}
                                        required
                                    ></textarea>
                                </div>
                                <div className="form-actions">
                                    <button type="submit" className="btn-create">
                                        Create Achievement
                                    </button>
                                    <button 
                                        type="button" 
                                        className="btn-cancel"
                                        onClick={() => setIsCreating(false)}
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        ) : null}
                        
                        <div className="content-list">
                            {achievements.map(achievement => (
                                <div key={achievement._id} className="achievement-item">
                                    <span className="achievement-icon">🏆</span>
                                    <div>
                                        <h4>{achievement.title}</h4>
                                        <p>{achievement.description}</p>
                                        <small>{new Date(achievement.date).toLocaleDateString()}</small>
                                    </div>
                                    <button 
                                        className="btn-delete"
                                        onClick={() => handleDelete(achievement._id, 'Achievement')}
                                    >
                                        Delete
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                );
                
            case 'Service':
                return (
                    <div className="option-content">
                        <h3>Services ({services.length})</h3>
                        
                        {isCreating ? (
                            <form onSubmit={handleSubmit} className="creation-form">
                                <h4>Create New Service</h4>
                                <div className="form-group">
                                    <input 
                                        type="text" 
                                        name="name"
                                        placeholder="Service Name" 
                                        className="form-input"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <textarea 
                                        name="description"
                                        placeholder="Service Description" 
                                        className="form-textarea"
                                        value={formData.description}
                                        onChange={handleInputChange}
                                        required
                                    ></textarea>
                                </div>
                                <div className="form-row">
                                    <div className="form-group">
                                        <select 
                                            name="serviceType"
                                            className="form-select"
                                            value={formData.serviceType}
                                            onChange={handleInputChange}
                                            required
                                        >
                                            <option value="web">Web Development</option>
                                            <option value="mobile">Mobile App</option>
                                            <option value="design">Design</option>
                                        </select>
                                    </div>
                                    <div className="form-group">
                                        <input 
                                            type="number" 
                                            name="price"
                                            placeholder="Price" 
                                            className="form-input"
                                            value={formData.price}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="form-group">
                                    <input 
                                        type="text" 
                                        name="technologies"
                                        placeholder="Technologies (comma separated)" 
                                        className="form-input"
                                        value={formData.technologies}
                                        onChange={handleInputChange}
                                    />
                                </div>
                                <div className="form-actions">
                                    <button type="submit" className="btn-create">
                                        Create Service
                                    </button>
                                    <button 
                                        type="button" 
                                        className="btn-cancel"
                                        onClick={() => setIsCreating(false)}
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        ) : null}
                        
                        <div className="services-list">
                            {services.map(service => (
                                <div key={service._id} className="service-item">
                                    <div>
                                        <h4>{service.name}</h4>
                                        <p>{service.description.substring(0, 100)}...</p>
                                        <small>Type: {service.serviceType} | Price: ${service.price}</small>
                                    </div>
                                    <div className="service-actions">
                                        <span className="service-status active">Active</span>
                                        <button 
                                            className="btn-delete"
                                            onClick={() => handleDelete(service._id, 'Service')}
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                );
                
            case 'Client':
                return (
                    <div className="option-content">
                        <h3>Clients ({messages.length})</h3>
                        <div className="clients-grid">
                            <div className="client-card">
                                <h4>Total Messages</h4>
                                <p>{messages.length} client messages</p>
                            </div>
                            <div className="client-card">
                                <h4>Recent Contacts</h4>
                                <p>{Math.min(messages.length, 5)} recent clients</p>
                            </div>
                        </div>
                        {messages.length > 0 ? (
                            <div className="recent-messages">
                                <h4>Recent Messages from Clients</h4>
                                {messages.slice(0, 5).map(message => (
                                    <div key={message._id} className="client-message">
                                        <strong>{message.username}</strong>
                                        <p>{message.message.substring(0, 80)}...</p>
                                        <small>{message.email} • {message.project_Type}</small>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="no-data">
                                <i className="fas fa-comments"></i>
                                <p>No client messages yet</p>
                            </div>
                        )}
                    </div>
                );
                
            case 'Display Projects':
                return (
                    <div className="option-content">
                        <h3>Display Projects ({services.length})</h3>
                        <div className="display-controls">
                            <button className="display-btn active">Grid View</button>
                            <button className="display-btn">List View</button>
                        </div>
                        <div className="projects-display">
                            {services.map(service => (
                                <div key={service._id} className="project-display-card">
                                    <div className="project-image">
                                        {service.image ? (
                                            <img 
                                                src={`http://localhost:4444/${service.image}`} 
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
                                    <div className="project-info">
                                        <h4>{service.name}</h4>
                                        <p className="project-type">{service.serviceType}</p>
                                        <p className="project-price">${service.price}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                );
                
            default:
                return <div className="option-content">Select an option to view content</div>;
        }
    };

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
            
            {/* Dashboard Cards */}
            <div className='dashboard-card'>
                <div className='card-cont'>
                    <div className="dash-cards">
                        <img src="../src/assets/icon/web-design (1).png" alt="Web Development" />
                        <h1>Full-Stack Development</h1>
                        <h3>{services.filter(s => s.serviceType === 'web').length} projects</h3>
                        {unreadMessagesCount > 0 && (
                            <div className="card-notification-badge">
                                {unreadMessagesCount} new message{unreadMessagesCount > 1 ? 's' : ''}
                            </div>
                        )}
                    </div>
                    <div className="dash-cards">
                        <img src="../src/assets/icon/cube.png" alt="Product Design" />
                        <h1>Product Design</h1>
                        <h3>{services.filter(s => s.serviceType === 'design').length} projects</h3>
                    </div>
                    <div className="dash-cards">
                        <img src="../src/assets/icon/mobile-development.png" alt="Mobile Development" />
                        <h1>Mobile App Development</h1>
                        <h3>{services.filter(s => s.serviceType === 'mobile').length} projects</h3>
                        {unreadNotificationsCount > 0 && (
                            <div className="card-notification-badge">
                                {unreadNotificationsCount} notification{unreadNotificationsCount > 1 ? 's' : ''}
                            </div>
                        )}
                    </div>
                </div>
                
                {/* Main Dashboard Content Area */}
                <div className='dashboard-content'>
                    <div className="dashboard-controls">
                        <button 
                            className={`dashboard-btn ${showMessages ? 'active' : ''}`}
                            onClick={() => {
                                setShowMessages(!showMessages);
                                setShowNotifications(false);
                            }}
                        >
                            <i className="fas fa-envelope"></i>
                            Messages
                            {unreadMessagesCount > 0 && (
                                <span className="badge">{unreadMessagesCount}</span>
                            )}
                        </button>
                        <button 
                            className={`dashboard-btn ${showNotifications ? 'active' : ''}`}
                            onClick={() => {
                                setShowNotifications(!showNotifications);
                                setShowMessages(false);
                            }}
                        >
                            <i className="fas fa-bell"></i>
                            Notifications
                            {unreadNotificationsCount > 0 && (
                                <span className="badge">{unreadNotificationsCount}</span>
                            )}
                        </button>
                        {(unreadMessagesCount > 0 || unreadNotificationsCount > 0) && (
                            <button 
                                className="dashboard-btn"
                                onClick={markAllAsRead}
                            >
                                <i className="fas fa-check-double"></i>
                                Mark All as Read
                            </button>
                        )}
                    </div>
                    
                    <div className="dashboard-main-area">
                        {/* Left Side - Messages/Notifications Panel */}
                        {(showMessages || showNotifications) && (
                            <div className="side-panel">
                                <div className="panel-header">
                                    <h3>
                                        {showMessages ? 'Messages' : 'Notifications'}
                                        {showMessages && ` (${messages.length})`}
                                    </h3>
                                    <button 
                                        className="close-panel-btn"
                                        onClick={() => {
                                            setShowMessages(false);
                                            setShowNotifications(false);
                                        }}
                                    >
                                        <i className="fas fa-times"></i>
                                    </button>
                                </div>
                                
                                {showMessages ? (
                                    <div className="messages-container">
                                        <div className="messages-list">
                                            {messages.length > 0 ? (
                                                messages.map(message => (
                                                    <div 
                                                        key={message._id} 
                                                        className={`message-item message-${message.status} ${!message.read ? 'unread' : ''} ${activeMessage?._id === message._id ? 'active' : ''}`}
                                                        onClick={() => handleMessageClick(message)}
                                                    >
                                                        <div className="message-sender">
                                                            <strong>{message.username}</strong>
                                                            <span className="message-status">{message.status}</span>
                                                        </div>
                                                        <div className="message-subject">{message.project_Type} Inquiry</div>
                                                        <div className="message-preview">
                                                            {message.message.substring(0, 60)}...
                                                        </div>
                                                        <div className="message-time">{message.createdAt}</div>
                                                        {!message.read && <div className="unread-dot"></div>}
                                                    </div>
                                                ))
                                            ) : (
                                                <div className="no-messages">
                                                    <i className="fas fa-inbox"></i>
                                                    <p>No messages yet</p>
                                                </div>
                                            )}
                                        </div>
                                        
                                        {activeMessage && (
                                            <div className="message-detail-overlay">
                                                <div className="message-detail-header">
                                                    <h4>{activeMessage.project_Type} Inquiry</h4>
                                                    <button 
                                                        className="close-message-btn"
                                                        onClick={() => setActiveMessage(null)}
                                                    >
                                                        <i className="fas fa-times"></i>
                                                    </button>
                                                </div>
                                                <div className="message-detail-content">
                                                    <div className="message-meta">
                                                        <span><strong>From:</strong> {activeMessage.username}</span>
                                                        <span><strong>Email:</strong> {activeMessage.email}</span>
                                                        {activeMessage.phone && <span><strong>Phone:</strong> {activeMessage.phone}</span>}
                                                        <span><strong>Budget:</strong> {activeMessage.budget || 'Not specified'}</span>
                                                        <span><strong>Timeline:</strong> {activeMessage.timeline || 'Not specified'}</span>
                                                        <span><strong>Time:</strong> {activeMessage.createdAt}</span>
                                                    </div>
                                                    <div className="message-body">
                                                        <p>{activeMessage.message}</p>
                                                    </div>
                                                    <div className="message-actions">
                                                        <button className="btn-reply">
                                                            <i className="fas fa-reply"></i> Reply
                                                        </button>
                                                        <button 
                                                            className="btn-delete"
                                                            onClick={() => handleDelete(activeMessage._id, 'Message')}
                                                        >
                                                            <i className="fas fa-trash"></i> Delete
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <div className="notifications-container">
                                        <div className="notifications-list">
                                            {notifications.map(notification => (
                                                <div 
                                                    key={notification.id} 
                                                    className={`notification-item notification-${notification.type} ${!notification.read ? 'unread' : ''}`}
                                                    onClick={() => handleNotificationClick(notification)}
                                                >
                                                    <div className="notification-icon">
                                                        {notification.type === 'success' && <i className="fas fa-check-circle"></i>}
                                                        {notification.type === 'error' && <i className="fas fa-exclamation-triangle"></i>}
                                                        {notification.type === 'info' && <i className="fas fa-info-circle"></i>}
                                                        {notification.type === 'warning' && <i className="fas fa-exclamation-circle"></i>}
                                                    </div>
                                                    <div className="notification-content">
                                                        <h4>{notification.title}</h4>
                                                        <p>{notification.message}</p>
                                                        <span className="notification-time">{notification.timestamp}</span>
                                                    </div>
                                                    {!notification.read && <div className="unread-dot"></div>}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                        
                        {/* Right Side - Main Content Area */}
                        <div className={`main-content ${showMessages || showNotifications ? 'with-side-panel' : ''}`}>
                            <div className="content-controls">
                                <select 
                                    value={selectedOption}
                                    onChange={(e) => {
                                        setSelectedOption(e.target.value);
                                        setIsCreating(false);
                                        setFormData({
                                            title: '',
                                            description: '',
                                            serviceType: 'web',
                                            price: '',
                                            name: '',
                                            technologies: '',
                                            status: 'active'
                                        });
                                    }}
                                    className="content-select"
                                >
                                    <option value="Project">Projects</option>                                
                                    <option value="Achievement">Achievements</option>                                
                                    <option value="Service">Services</option>                                
                                    <option value="Client">Clients</option>                                
                                    <option value="Display Projects">Display Projects</option>                                
                                </select>
                                {selectedOption !== 'Display Projects' && selectedOption !== 'Client' && (
                                    <button 
                                        className={`action-btn ${isCreating ? 'cancel' : ''}`}
                                        onClick={() => setIsCreating(!isCreating)}
                                    >
                                        <i className={`fas ${isCreating ? 'fa-times' : 'fa-plus'}`}></i> 
                                        {isCreating ? 'Cancel' : 'Create New'}
                                    </button>
                                )}
                            </div>
                            
                            <div className="dash-content">
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
                                        <p className="error-note">Using demo data. Check your server connection.</p>
                                    </div>
                                ) : (
                                    renderContentBasedOnOption()
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;