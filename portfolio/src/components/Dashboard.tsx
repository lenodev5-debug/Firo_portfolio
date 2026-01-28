// Dashboard.tsx - Complete Optimized Version
import { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios, { AxiosInstance, CancelTokenSource } from 'axios';
import Header from './Header';
import Profile from '../assets/bak/lenodevprofile.jpg';
import WebIcon from '../assets/icon/web-design (1).png';
import CubeIcon from '../assets/icon/cube.png';
import MobileIcon from '../assets/icon/mobile.png';

import DashboardMessages from './Components/DashboardMessages';
import DashboardServices from './Components/DashboardServices';
import DashboardAchievements from './Components/DashboardAchievements';

// Interfaces
interface UserProfile {
    _id: string;
    username: string;
    email: string;
    role: string;
    createdAt: string;
    avatar?: string;
}

interface Notification {
    id: string;
    type: 'success' | 'error' | 'info' | 'warning';
    title: string;
    message: string;
    timestamp: string;
    read: boolean;
    autoClose?: boolean;
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
    fileImages?: string[];
}

interface Achievement {
    _id: string;
    title: string;
    description: string;
    date: string;
    image?: string;
    tags?: string[];
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
    featured?: boolean;
}

interface ServiceCounts {
    web: number;
    design: number;
    mobile: number;
    total: number;
}

interface DashboardStats {
    totalMessages: number;
    totalServices: number;
    totalAchievements: number;
    unreadMessages: number;
    recentActivity: string;
}

// Custom Hooks
const useApi = () => {
    const navigate = useNavigate();
    
    const getAuthToken = () => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/auth/user/login');
            throw new Error('No authentication token found');
        }
        return token;
    };

    const createApi = (): AxiosInstance => {
        const token = getAuthToken();
        const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://lenodev-production.up.railway.app';
        
        return axios.create({
            baseURL: `${API_BASE_URL}/api`,
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            timeout: 10000
        });
    };

    const createFormDataApi = (): AxiosInstance => {
        const token = getAuthToken();
        const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://lenodev-production.up.railway.app';
        
        return axios.create({
            baseURL: `${API_BASE_URL}/api`,
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'multipart/form-data'
            },
            timeout: 15000
        });
    };

    return { createApi, createFormDataApi };
};

const useNotifications = () => {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [activeNotification, setActiveNotification] = useState<Notification | null>(null);

    const addNotification = useCallback((notification: Notification) => {
        const newNotification = {
            ...notification,
            id: Date.now().toString(),
            timestamp: new Date().toLocaleTimeString(),
            read: false
        };
        
        setNotifications(prev => [newNotification, ...prev]);
        setActiveNotification(newNotification);

        if (notification.autoClose !== false) {
            setTimeout(() => {
                setActiveNotification(null);
            }, 5000);
        }
    }, []);

    const removeNotification = useCallback((id: string) => {
        setNotifications(prev => prev.filter(notif => notif.id !== id));
        setActiveNotification(null);
    }, []);

    const markAsRead = useCallback((id: string) => {
        setNotifications(prev => prev.map(notif => 
            notif.id === id ? { ...notif, read: true } : notif
        ));
    }, []);

    const markAllAsRead = useCallback(() => {
        setNotifications(prev => prev.map(notif => ({ ...notif, read: true })));
    }, []);

    const clearAll = useCallback(() => {
        setNotifications([]);
        setActiveNotification(null);
    }, []);

    return {
        notifications,
        activeNotification,
        addNotification,
        removeNotification,
        markAsRead,
        markAllAsRead,
        clearAll,
        setActiveNotification
    };
};

const useDashboardData = () => {
    const [user, setUser] = useState<UserProfile | null>(null);
    const [dashboardLoading, setDashboardLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();
    const { createApi } = useApi();

    const fetchDashboardData = useCallback(async () => {
        try {
            setDashboardLoading(true);
            const token = localStorage.getItem('token');
            
            if (!token) {
                navigate('/auth/user/login');
                return;
            }

            const api = createApi();
            const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://lenodev-production.up.railway.app';

            // Fetch all data in parallel
            const [profileRes, servicesRes, achievementsRes, messagesRes] = await Promise.allSettled([
                api.get('/owners/profile'),
                api.get('/user-services'),
                api.get('/achievements'),
                axios.get(`${API_BASE_URL}/api/users/contact/messages`)
            ]);

            // Handle profile data
            if (profileRes.status === 'fulfilled' && profileRes.value.data.success) {
                setUser(profileRes.value.data.owner);
            }

            // Handle services data
            if (servicesRes.status === 'fulfilled' && servicesRes.value.data.success) {
                // Return services and counts for the parent component
                return {
                    services: servicesRes.value.data.data,
                    serviceCounts: calculateServiceCounts(servicesRes.value.data.data)
                };
            }

            // Handle achievements data
            if (achievementsRes.status === 'fulfilled' && achievementsRes.value.data.success) {
                return {
                    achievements: achievementsRes.value.data.data
                };
            }

            // Handle messages data
            if (messagesRes.status === 'fulfilled' && messagesRes.value.data.success) {
                const messagesWithStatus = (messagesRes.value.data.data || []).map((msg: any) => ({
                    ...msg,
                    status: msg.status || 'new',
                    read: msg.read || false
                }));
                return { messages: messagesWithStatus };
            }

        } catch (error: any) {
            console.error('Error in dashboard setup:', error);
            setError('Failed to load dashboard data. Some features may be unavailable.');
            throw error;
        } finally {
            setDashboardLoading(false);
        }
    }, [navigate]);

    return {
        user,
        dashboardLoading,
        error,
        fetchDashboardData,
        setDashboardLoading,
        setError
    };
};

const calculateServiceCounts = (services: Service[]): ServiceCounts => {
    const counts = { web: 0, design: 0, mobile: 0, total: 0 };
    
    services.forEach(service => {
        counts[service.serviceType]++;
        counts.total++;
    });
    
    return counts;
};

// Main Dashboard Component
const Dashboard = () => {
    const navigate = useNavigate();
    const { createApi, createFormDataApi } = useApi();
    
    // State Management
    const [user, setUser] = useState<UserProfile | null>(null);
    const [dashboardLoading, setDashboardLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    
    const [messages, setMessages] = useState<Message[]>([]);
    const [achievements, setAchievements] = useState<Achievement[]>([]);
    const [services, setServices] = useState<Service[]>([]);
    
    const [serviceCounts, setServiceCounts] = useState<ServiceCounts>({ 
        web: 0, 
        design: 0, 
        mobile: 0,
        total: 0 
    });
    
    const [selectedOption, setSelectedOption] = useState<string>('messages');
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;
    
    // CRUD States
    const [isCreatingService, setIsCreatingService] = useState(false);
    const [isEditingService, setIsEditingService] = useState<string | null>(null);
    const [serviceFormData, setServiceFormData] = useState({
        name: '',
        serviceType: 'web' as 'web' | 'mobile' | 'design',
        description: '',
        price: '',
        technologies: '',
        image: null as File | null,
        featured: false
    });
    
    const [isCreatingAchievement, setIsCreatingAchievement] = useState(false);
    const [isEditingAchievement, setIsEditingAchievement] = useState<string | null>(null);
    const [achievementFormData, setAchievementFormData] = useState({
        title: '',
        description: '',
        date: new Date().toISOString().split('T')[0],
        image: null as File | null,
        tags: ''
    });
    
    // Custom Hooks
    const {
        notifications,
        activeNotification,
        addNotification,
        removeNotification,
        markAsRead,
        markAllAsRead,
        clearAll,
        setActiveNotification
    } = useNotifications();

    const dashboardData = useDashboardData();

    // Computed values
    const unreadMessagesCount = useMemo(() => 
        messages.filter(msg => !msg.read).length, 
        [messages]
    );

    const unreadNotificationsCount = useMemo(() => 
        notifications.filter(notif => !notif.read).length, 
        [notifications]
    );

    const dashboardStats: DashboardStats = useMemo(() => ({
        totalMessages: messages.length,
        totalServices: serviceCounts.total,
        totalAchievements: achievements.length,
        unreadMessages: unreadMessagesCount,
        recentActivity: new Date().toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        })
    }), [messages, serviceCounts, achievements, unreadMessagesCount]);

    // Filtered and paginated data
    const filteredMessages = useMemo(() => {
        if (!searchTerm) return messages;
        
        const term = searchTerm.toLowerCase();
        return messages.filter(msg =>
            msg.username.toLowerCase().includes(term) ||
            msg.email.toLowerCase().includes(term) ||
            msg.message.toLowerCase().includes(term) ||
            msg.project_Type?.toLowerCase().includes(term)
        );
    }, [messages, searchTerm]);

    const filteredServices = useMemo(() => {
        if (!searchTerm) return services;
        
        const term = searchTerm.toLowerCase();
        return services.filter(service =>
            service.name.toLowerCase().includes(term) ||
            service.description.toLowerCase().includes(term) ||
            service.technologies.some(tech => tech.toLowerCase().includes(term))
        );
    }, [services, searchTerm]);

    const paginatedMessages = useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        return filteredMessages.slice(startIndex, startIndex + itemsPerPage);
    }, [filteredMessages, currentPage]);

    // Helper Functions
    const getAchievementImageUrl = useCallback((imagePath?: string): string => {
        const baseUrl = import.meta.env.VITE_API_BASE_URL || 'https://lenodev-production.up.railway.app';
        
        if (!imagePath) {
            return `${baseUrl}/uploads/default-achievement.png`;
        }
        
        if (imagePath.startsWith('http')) {
            return imagePath;
        }
        
        if (imagePath.startsWith('/uploads/')) {
            return `${baseUrl}${imagePath}`;
        }
        
        return `${baseUrl}/uploads/general/${imagePath}`;
    }, []);

    const handleApiError = useCallback((error: any, context: string): Notification => {
        console.error(`Error in ${context}:`, error);
        
        const errorMessage = error.response?.data?.message || 
                            error.message || 
                            'An unexpected error occurred';
        
        return {
            id: Date.now().toString(),
            type: 'error',
            title: `${context} Failed`,
            message: errorMessage,
            timestamp: new Date().toLocaleTimeString(),
            read: false
        };
    }, []);

    // Data Fetching
    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    navigate('/auth/user/login');
                    return;
                }

                setDashboardLoading(true);
                const api = createApi();
                const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://lenodev-production.up.railway.app';

                // Fetch all data in parallel
                const [profileRes, servicesRes, achievementsRes, messagesRes] = await Promise.allSettled([
                    api.get('/owners/profile'),
                    api.get('/user-services'),
                    api.get('/achievements'),
                    axios.get(`${API_BASE_URL}/api/users/contact/messages`)
                ]);

                // Process profile
                if (profileRes.status === 'fulfilled' && profileRes.value.data.success) {
                    setUser(profileRes.value.data.owner);
                }

                // Process services
                if (servicesRes.status === 'fulfilled' && servicesRes.value.data.success) {
                    const servicesData = servicesRes.value.data.data;
                    setServices(servicesData);
                    setServiceCounts(calculateServiceCounts(servicesData));
                }

                // Process achievements
                if (achievementsRes.status === 'fulfilled' && achievementsRes.value.data.success) {
                    setAchievements(achievementsRes.value.data.data);
                }

                // Process messages
                if (messagesRes.status === 'fulfilled' && messagesRes.value.data.success) {
                    const messagesWithStatus = (messagesRes.value.data.data || []).map((msg: any) => ({
                        ...msg,
                        status: msg.status || 'new',
                        read: msg.read || false
                    }));
                    setMessages(messagesWithStatus);
                }

                // Handle rejected promises
                const rejected = [profileRes, servicesRes, achievementsRes, messagesRes]
                    .filter(result => result.status === 'rejected')
                    .map(result => (result as PromiseRejectedResult).reason);

                if (rejected.length > 0) {
                    const errorNotif = handleApiError(rejected[0], 'Loading data');
                    addNotification({
                        ...errorNotif,
                        message: 'Partial data loaded. Some features may be limited.'
                    });
                }

            } catch (error: any) {
                const errorNotif = handleApiError(error, 'Dashboard initialization');
                addNotification(errorNotif);
                setError('Failed to load dashboard data');
            } finally {
                setDashboardLoading(false);
            }
        };

        fetchData();
    }, [navigate]);

    // Service CRUD Operations
    const handleServiceInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        
        if (type === 'checkbox') {
            const checked = (e.target as HTMLInputElement).checked;
            setServiceFormData(prev => ({
                ...prev,
                [name]: checked
            }));
        } else {
            setServiceFormData(prev => ({
                ...prev,
                [name]: value
            }));
        }
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
            image: null,
            featured: false
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
            image: null,
            featured: service.featured || false
        });
    };

    const handleServiceSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        try {
            const api = createFormDataApi();
            
            const formDataToSend = new FormData();
            formDataToSend.append('name', serviceFormData.name.trim());
            formDataToSend.append('serviceType', serviceFormData.serviceType);
            formDataToSend.append('description', serviceFormData.description.trim());
            formDataToSend.append('price', serviceFormData.price);
            formDataToSend.append('featured', serviceFormData.featured.toString());
            
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
                const updatedService = response.data.data;
                
                if (isEditingService) {
                    setServices(prev => prev.map(service => 
                        service._id === isEditingService ? updatedService : service
                    ));
                } else {
                    setServices(prev => [updatedService, ...prev]);
                }
                
                // Update counts
                const updatedCounts = calculateServiceCounts(
                    isEditingService 
                        ? services.map(s => s._id === isEditingService ? updatedService : s)
                        : [updatedService, ...services]
                );
                setServiceCounts(updatedCounts);
                
                // Add success notification
                addNotification({
                    id: Date.now().toString(),
                    type: 'success',
                    title: `Service ${isEditingService ? 'Updated' : 'Created'}`,
                    message: `Service "${updatedService.name}" ${isEditingService ? 'updated' : 'created'} successfully`,
                    timestamp: new Date().toLocaleTimeString(),
                    read: false
                });
                
                resetServiceForm();
            }
            
        } catch (error: any) {
            const errorNotif = handleApiError(error, isEditingService ? 'Updating service' : 'Creating service');
            addNotification(errorNotif);
        }
    };

    const handleServiceDelete = async (id: string, name: string) => {
        if (!window.confirm(`Are you sure you want to delete "${name}"? This action cannot be undone.`)) {
            return;
        }
        
        try {
            const api = createApi();
            const serviceToDelete = services.find(s => s._id === id);
            
            const response = await api.delete(`/user-services/${id}`);
            
            if (response.data.success) {
                setServices(prev => prev.filter(service => service._id !== id));
                
                // Update counts
                const updatedCounts = calculateServiceCounts(
                    services.filter(s => s._id !== id)
                );
                setServiceCounts(updatedCounts);
                
                addNotification({
                    id: Date.now().toString(),
                    type: 'success',
                    title: 'Service Deleted',
                    message: `Service "${name}" deleted successfully`,
                    timestamp: new Date().toLocaleTimeString(),
                    read: false
                });
            }
            
        } catch (error: any) {
            const errorNotif = handleApiError(error, 'Deleting service');
            addNotification(errorNotif);
        }
    };

    const handleBulkDeleteServices = async (ids: string[]) => {
        if (!window.confirm(`Are you sure you want to delete ${ids.length} services? This action cannot be undone.`)) {
            return;
        }
        
        try {
            const api = createApi();
            
            // You might want to implement a bulk delete endpoint
            // For now, delete one by one
            const deletePromises = ids.map(id => api.delete(`/user-services/${id}`));
            await Promise.all(deletePromises);
            
            setServices(prev => prev.filter(service => !ids.includes(service._id)));
            
            // Update counts
            const updatedCounts = calculateServiceCounts(
                services.filter(s => !ids.includes(s._id))
            );
            setServiceCounts(updatedCounts);
            
            addNotification({
                id: Date.now().toString(),
                type: 'success',
                title: 'Services Deleted',
                message: `${ids.length} services deleted successfully`,
                timestamp: new Date().toLocaleTimeString(),
                read: false
            });
            
        } catch (error: any) {
            const errorNotif = handleApiError(error, 'Bulk deleting services');
            addNotification(errorNotif);
        }
    };

    // Achievement CRUD Operations
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
            image: null,
            tags: ''
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
            image: null,
            tags: achievement.tags?.join(', ') || ''
        });
    };

    const handleAchievementSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        try {
            const api = createFormDataApi();
            
            const formDataToSend = new FormData();
            formDataToSend.append('title', achievementFormData.title.trim());
            formDataToSend.append('description', achievementFormData.description.trim());
            
            const dateToSend = achievementFormData.date || new Date().toISOString().split('T')[0];
            formDataToSend.append('date', dateToSend);
            
            if (achievementFormData.tags) {
                formDataToSend.append('tags', achievementFormData.tags);
            }
            
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
                const updatedAchievement = response.data.data;
                
                if (isEditingAchievement) {
                    setAchievements(prev => prev.map(achievement => 
                        achievement._id === isEditingAchievement ? updatedAchievement : achievement
                    ));
                } else {
                    setAchievements(prev => [updatedAchievement, ...prev]);
                }
                
                addNotification({
                    id: Date.now().toString(),
                    type: 'success',
                    title: `Achievement ${isEditingAchievement ? 'Updated' : 'Created'}`,
                    message: `Achievement "${updatedAchievement.title}" ${isEditingAchievement ? 'updated' : 'created'} successfully`,
                    timestamp: new Date().toLocaleTimeString(),
                    read: false
                });
                
                resetAchievementForm();
            }
            
        } catch (error: any) {
            const errorNotif = handleApiError(error, isEditingAchievement ? 'Updating achievement' : 'Creating achievement');
            addNotification(errorNotif);
        }
    };

    const handleAchievementDelete = async (id: string, title: string) => {
        if (!window.confirm(`Are you sure you want to delete "${title}"? This action cannot be undone.`)) {
            return;
        }
        
        try {
            const api = createApi();
            
            const response = await api.delete(`/achievements/${id}`);
            
            if (response.data.success) {
                setAchievements(prev => prev.filter(achievement => achievement._id !== id));
                
                addNotification({
                    id: Date.now().toString(),
                    type: 'success',
                    title: 'Achievement Deleted',
                    message: `Achievement "${title}" deleted successfully`,
                    timestamp: new Date().toLocaleTimeString(),
                    read: false
                });
            }
            
        } catch (error: any) {
            const errorNotif = handleApiError(error, 'Deleting achievement');
            addNotification(errorNotif);
        }
    };

    // Message Operations
    const handleMarkAsRead = useCallback((messageId: string) => {
        setMessages(prev => prev.map(msg => 
            msg._id === messageId ? { ...msg, read: true } : msg
        ));
    }, []);

    const handleMarkAllAsRead = useCallback(() => {
        setMessages(prev => prev.map(msg => ({ ...msg, read: true })));
        
        addNotification({
            id: Date.now().toString(),
            type: 'success',
            title: 'All Messages Read',
            message: 'All messages have been marked as read',
            timestamp: new Date().toLocaleTimeString(),
            read: false
        });
    }, []);

    const handleDeleteMessage = useCallback((messageId: string) => {
        setMessages(prev => prev.filter(msg => msg._id !== messageId));
    }, []);

    const handleBulkDeleteMessages = useCallback((messageIds: string[]) => {
        if (!window.confirm(`Are you sure you want to delete ${messageIds.length} messages?`)) {
            return;
        }
        
        setMessages(prev => prev.filter(msg => !messageIds.includes(msg._id)));
        
        addNotification({
            id: Date.now().toString(),
            type: 'success',
            title: 'Messages Deleted',
            message: `${messageIds.length} messages deleted successfully`,
            timestamp: new Date().toLocaleTimeString(),
            read: false
        });
    }, []);

    const handleUpdateMessageStatus = useCallback((messageId: string, status: string) => {
        setMessages(prev => prev.map(msg => 
            msg._id === messageId ? { ...msg, status: status as any } : msg
        ));
    }, []);

    // Export functionality
    const exportData = useCallback((dataType: 'messages' | 'services' | 'achievements') => {
        let data: any[] = [];
        let filename = '';
        
        switch (dataType) {
            case 'messages':
                data = messages;
                filename = 'messages_export.json';
                break;
            case 'services':
                data = services;
                filename = 'services_export.json';
                break;
            case 'achievements':
                data = achievements;
                filename = 'achievements_export.json';
                break;
        }
        
        const jsonString = JSON.stringify(data, null, 2);
        const blob = new Blob([jsonString], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        addNotification({
            id: Date.now().toString(),
            type: 'success',
            title: 'Export Successful',
            message: `${data.length} ${dataType} exported successfully`,
            timestamp: new Date().toLocaleTimeString(),
            read: false
        });
    }, [messages, services, achievements]);

    // Logout handler
    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/auth/user/login');
        
        addNotification({
            id: Date.now().toString(),
            type: 'info',
            title: 'Logged Out',
            message: 'You have been successfully logged out',
            timestamp: new Date().toLocaleTimeString(),
            read: false,
            autoClose: false
        });
    };

    return (
        <div className="dashboard-dark">
            <Header onLogout={handleLogout} />
            
            {/* Notification Popup */}
            {activeNotification && (
                <div className={`notification-popup notification-${activeNotification.type}`}>
                    <div className="notification-icon">
                        {activeNotification.type === 'success' && <i className="fas fa-check-circle"></i>}
                        {activeNotification.type === 'error' && <i className="fas fa-exclamation-triangle"></i>}
                        {activeNotification.type === 'info' && <i className="fas fa-info-circle"></i>}
                        {activeNotification.type === 'warning' && <i className="fas fa-exclamation-circle"></i>}
                    </div>
                    <div className="notification-content">
                        <h4 className="notification-title">{activeNotification.title}</h4>
                        <p className="notification-text">{activeNotification.message}</p>
                        <small className="notification-time">{activeNotification.timestamp}</small>
                    </div>
                    <button 
                        className="notification-close" 
                        onClick={() => setActiveNotification(null)}
                        aria-label="Close notification"
                    >
                        <i className="fas fa-times"></i>
                    </button>
                </div>
            )}
            
            {/* Profile Header */}
            <div className='profile-header'>
                <img 
                    src={user?.avatar || Profile} 
                    alt={user?.username || 'Profile'} 
                    className="profile-avatar"
                    onError={(e) => {
                        (e.target as HTMLImageElement).src = Profile;
                    }}
                />
                <div className="profile-info">
                    <h1>{user?.username || 'Lenodev'}</h1>
                    <h2>{user?.email || 'Loading...'}</h2>
                    <p className="profile-role">{user?.role || 'Administrator'}</p>
                    <p className="profile-joined">
                        Member since: {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                    </p>
                </div>
                <div className="profile-stats">
                    <div className="stat-item">
                        <span className="stat-number">{dashboardStats.totalMessages}</span>
                        <span className="stat-label">Messages</span>
                    </div>
                    <div className="stat-item">
                        <span className="stat-number">{dashboardStats.totalServices}</span>
                        <span className="stat-label">Services</span>
                    </div>
                    <div className="stat-item">
                        <span className="stat-number">{dashboardStats.totalAchievements}</span>
                        <span className="stat-label">Achievements</span>
                    </div>
                </div>
                <hr />
            </div>
            
            {/* Main Dashboard Card */}
            <div className='dashboard-card'>
                {/* Stats Cards */}
                <div className='card-cont'>
                    <div className="dash-cards">
                        <img src={WebIcon} alt="Web Development" />
                        <h1>Full-Stack Development</h1>
                        <h3>{serviceCounts.web} projects</h3>
                        {unreadMessagesCount > 0 && (
                            <div className="card-notification-badge">
                                <i className="fas fa-envelope"></i>
                                {unreadMessagesCount} new
                            </div>
                        )}
                    </div>
                    <div className="dash-cards">
                        <img src={CubeIcon} alt="Product Design" />
                        <h1>Product Design</h1>
                        <h3>{serviceCounts.design} projects</h3>
                        {filteredServices.filter(s => s.featured).length > 0 && (
                            <div className="card-featured-badge">
                                <i className="fas fa-star"></i>
                                {filteredServices.filter(s => s.featured).length} featured
                            </div>
                        )}
                    </div>
                    <div className="dash-cards">
                        <img src={MobileIcon} alt="Mobile Development" />
                        <h1>Mobile App Development</h1>
                        <h3>{serviceCounts.mobile} projects</h3>
                        {unreadNotificationsCount > 0 && (
                            <div className="card-notification-badge">
                                <i className="fas fa-bell"></i>
                                {unreadNotificationsCount}
                            </div>
                        )}
                    </div>
                </div>
                
                {/* Main Content Area */}
                <div className='dashboard-content'>
                    {/* Controls */}
                    <div className="dashboard-controls">
                        <div className="control-left">
                            <select 
                                value={selectedOption}
                                onChange={(e) => {
                                    setSelectedOption(e.target.value);
                                    setCurrentPage(1);
                                    resetServiceForm();
                                    resetAchievementForm();
                                }}
                                className="content-select"
                                aria-label="Select dashboard section"
                            >
                                <option value="messages">
                                    Messages ({messages.length})
                                    {unreadMessagesCount > 0 && ` • ${unreadMessagesCount} unread`}
                                </option>
                                <option value="services">
                                    Services ({serviceCounts.total})
                                    {serviceCounts.web > 0 && ` • Web: ${serviceCounts.web}`}
                                </option>
                                <option value="achievements">
                                    Achievements ({achievements.length})
                                </option>
                                <option value="analytics">
                                    Analytics
                                </option>
                            </select>
                            
                            {/* Search Bar */}
                            <div className="search-container">
                                <i className="fas fa-search"></i>
                                <input
                                    type="text"
                                    placeholder={`Search ${selectedOption}...`}
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="search-input"
                                    aria-label={`Search ${selectedOption}`}
                                />
                                {searchTerm && (
                                    <button
                                        className="search-clear"
                                        onClick={() => setSearchTerm('')}
                                        aria-label="Clear search"
                                    >
                                        <i className="fas fa-times"></i>
                                    </button>
                                )}
                            </div>
                        </div>
                        
                        <div className="control-right">
                            {/* Export Button */}
                            <button 
                                className="btn-secondary"
                                onClick={() => exportData(selectedOption as any)}
                                title={`Export ${selectedOption}`}
                            >
                                <i className="fas fa-download"></i> Export
                            </button>
                            
                            {/* Action Buttons */}
                            {selectedOption === 'messages' && unreadMessagesCount > 0 && (
                                <button 
                                    className="btn-primary"
                                    onClick={handleMarkAllAsRead}
                                >
                                    <i className="fas fa-check-double"></i> Mark All Read
                                </button>
                            )}
                            
                            {selectedOption === 'services' && !isCreatingService && (
                                <button 
                                    className="btn-primary"
                                    onClick={() => setIsCreatingService(true)}
                                >
                                    <i className="fas fa-plus"></i> Create Service
                                </button>
                            )}
                            
                            {selectedOption === 'achievements' && !isCreatingAchievement && (
                                <button 
                                    className="btn-primary"
                                    onClick={() => setIsCreatingAchievement(true)}
                                >
                                    <i className="fas fa-plus"></i> Create Achievement
                                </button>
                            )}
                            
                            {/* Notifications Badge */}
                            <div className="notifications-container">
                                <button 
                                    className="btn-icon"
                                    onClick={() => {/* Open notifications panel */}}
                                    aria-label={`Notifications (${unreadNotificationsCount} unread)`}
                                >
                                    <i className="fas fa-bell"></i>
                                    {unreadNotificationsCount > 0 && (
                                        <span className="notifications-badge">
                                            {unreadNotificationsCount}
                                        </span>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                    
                    {/* Main Content */}
                    <div className="dashboard-main-area">
                        <div className="main-content">
                            {dashboardLoading ? (
                                <div className="loading-content">
                                    <div className="loading-spinner"></div>
                                    <p>Loading dashboard data...</p>
                                    <small>Please wait while we fetch your information</small>
                                </div>
                            ) : error ? (
                                <div className="error-content">
                                    <i className="fas fa-exclamation-triangle"></i>
                                    <h4>Connection Error</h4>
                                    <p>{error}</p>
                                    <button 
                                        className="btn-primary"
                                        onClick={() => window.location.reload()}
                                    >
                                        <i className="fas fa-redo"></i> Retry
                                    </button>
                                </div>
                            ) : (
                                <div className="content-area">
                                    {selectedOption === 'messages' && (
                                        <DashboardMessages
                                            messages={paginatedMessages}
                                            totalMessages={filteredMessages.length}
                                            currentPage={currentPage}
                                            itemsPerPage={itemsPerPage}
                                            onPageChange={setCurrentPage}
                                            onMarkAsRead={handleMarkAsRead}
                                            onDeleteMessage={handleDeleteMessage}
                                            onBulkDeleteMessages={handleBulkDeleteMessages}
                                            onUpdateMessageStatus={handleUpdateMessageStatus}
                                            searchTerm={searchTerm}
                                            onSearchChange={setSearchTerm}
                                        />
                                    )}
                                    
                                    {selectedOption === 'services' && (
                                        <DashboardServices
                                            services={filteredServices}
                                            isCreatingService={isCreatingService}
                                            isEditingService={isEditingService}
                                            serviceFormData={serviceFormData}
                                            onServiceInputChange={handleServiceInputChange}
                                            onServiceFileChange={handleServiceFileChange}
                                            onServiceSubmit={handleServiceSubmit}
                                            onServiceEditClick={handleServiceEditClick}
                                            onServiceDelete={handleServiceDelete}
                                            onBulkDeleteServices={handleBulkDeleteServices}
                                            resetServiceForm={resetServiceForm}
                                            serviceCounts={serviceCounts}
                                        />
                                    )}
                                    
                                    {selectedOption === 'achievements' && (
                                        <DashboardAchievements
                                            achievements={achievements}
                                            isCreatingAchievement={isCreatingAchievement}
                                            isEditingAchievement={isEditingAchievement}
                                            achievementFormData={achievementFormData}
                                            onAchievementInputChange={handleAchievementInputChange}
                                            onAchievementFileChange={handleAchievementFileChange}
                                            onAchievementSubmit={handleAchievementSubmit}
                                            onAchievementEditClick={handleAchievementEditClick}
                                            onAchievementDelete={handleAchievementDelete}
                                            resetAchievementForm={resetAchievementForm}
                                            getAchievementImageUrl={getAchievementImageUrl}
                                        />
                                    )}
                                    
                                    {selectedOption === 'analytics' && (
                                        <div className="analytics-section">
                                            <h3>Analytics Dashboard</h3>
                                            <div className="analytics-grid">
                                                <div className="analytics-card">
                                                    <h4>Activity Summary</h4>
                                                    <p>Last updated: {dashboardStats.recentActivity}</p>
                                                    <div className="activity-stats">
                                                        <div className="activity-item">
                                                            <span className="activity-label">Unread Messages:</span>
                                                            <span className="activity-value">{dashboardStats.unreadMessages}</span>
                                                        </div>
                                                        <div className="activity-item">
                                                            <span className="activity-label">Total Services:</span>
                                                            <span className="activity-value">{dashboardStats.totalServices}</span>
                                                        </div>
                                                        <div className="activity-item">
                                                            <span className="activity-label">Total Achievements:</span>
                                                            <span className="activity-value">{dashboardStats.totalAchievements}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                                
                                                <div className="analytics-card">
                                                    <h4>Service Distribution</h4>
                                                    <div className="service-distribution">
                                                        <div className="distribution-item">
                                                            <span className="distribution-label">Web Development:</span>
                                                            <div className="distribution-bar">
                                                                <div 
                                                                    className="distribution-fill web-fill"
                                                                    style={{ width: `${(serviceCounts.web / serviceCounts.total) * 100 || 0}%` }}
                                                                ></div>
                                                            </div>
                                                            <span className="distribution-value">{serviceCounts.web}</span>
                                                        </div>
                                                        <div className="distribution-item">
                                                            <span className="distribution-label">Product Design:</span>
                                                            <div className="distribution-bar">
                                                                <div 
                                                                    className="distribution-fill design-fill"
                                                                    style={{ width: `${(serviceCounts.design / serviceCounts.total) * 100 || 0}%` }}
                                                                ></div>
                                                            </div>
                                                            <span className="distribution-value">{serviceCounts.design}</span>
                                                        </div>
                                                        <div className="distribution-item">
                                                            <span className="distribution-label">Mobile Development:</span>
                                                            <div className="distribution-bar">
                                                                <div 
                                                                    className="distribution-fill mobile-fill"
                                                                    style={{ width: `${(serviceCounts.mobile / serviceCounts.total) * 100 || 0}%` }}
                                                                ></div>
                                                            </div>
                                                            <span className="distribution-value">{serviceCounts.mobile}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            
            {/* Footer with Stats */}
            <footer className="dashboard-footer">
                <div className="footer-stats">
                    <span>Last updated: {new Date().toLocaleString()}</span>
                    <span>•</span>
                    <span>Total items: {messages.length + services.length + achievements.length}</span>
                    <span>•</span>
                    <span>Unread: {unreadMessagesCount + unreadNotificationsCount}</span>
                </div>
                <div className="footer-actions">
                    <button 
                        className="btn-link"
                        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                    >
                        <i className="fas fa-arrow-up"></i> Back to top
                    </button>
                </div>
            </footer>
        </div>
    );
};

export default Dashboard;