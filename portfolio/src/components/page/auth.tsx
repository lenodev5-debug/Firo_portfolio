import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const navigate = useNavigate();

    // Redirect if already logged in
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            navigate('/dashboard');
        }
    }, [navigate]);

    // Floating animation effect
    useEffect(() => {
        const createFloatingShapes = () => {
            const container = document.querySelector('.auth-bg-animation');
            if (!container) return;

            container.innerHTML = '';

            const shapeTypes = ['circle', 'square', 'triangle', 'hexagon'];
            
            for (let i = 0; i < 15; i++) {
                const shape = document.createElement('div');
                const shapeType = shapeTypes[Math.floor(Math.random() * shapeTypes.length)];
                shape.className = `floating-shape shape-${shapeType}`;
                
                const size = Math.random() * 60 + 20;
                shape.style.width = `${size}px`;
                shape.style.height = `${size}px`;
                shape.style.left = `${Math.random() * 100}%`;
                shape.style.top = `${Math.random() * 100}%`;
                
                const duration = Math.random() * 20 + 10;
                const delay = Math.random() * 5;
                const direction = Math.random() > 0.5 ? 'normal' : 'reverse';
                
                shape.style.animation = `
                    floatAnimation ${duration}s ease-in-out ${delay}s infinite ${direction},
                    rotateAnimation ${duration * 1.5}s linear ${delay}s infinite
                `;
                
                const colors = [
                    'rgba(0, 217, 255, 0.1)',
                    'rgba(0, 150, 255, 0.08)',
                    'rgba(100, 0, 255, 0.06)',
                    'rgba(255, 100, 0, 0.05)'
                ];
                shape.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
                shape.style.opacity = `${Math.random() * 0.3 + 0.1}`;
                
                container.appendChild(shape);
            }

            for (let i = 0; i < 8; i++) {
                const line = document.createElement('div');
                line.className = 'floating-line';
                
                const length = Math.random() * 200 + 100;
                const thickness = Math.random() * 3 + 1;
                line.style.width = `${length}px`;
                line.style.height = `${thickness}px`;
                line.style.left = `${Math.random() * 100}%`;
                line.style.top = `${Math.random() * 100}%`;
                
                const duration = Math.random() * 25 + 15;
                const delay = Math.random() * 10;
                
                line.style.animation = `
                    floatLine ${duration}s ease-in-out ${delay}s infinite,
                    linePulse ${duration / 2}s ease-in-out ${delay}s infinite alternate
                `;
                
                line.style.background = `linear-gradient(90deg, 
                    rgba(0, 217, 255, 0.1) 0%,
                    rgba(0, 217, 255, 0.3) 50%,
                    rgba(0, 217, 255, 0.1) 100%
                )`;
                
                container.appendChild(line);
            }
        };

        createFloatingShapes();
        
        const handleResize = () => createFloatingShapes();
        window.addEventListener('resize', handleResize);
        
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);
        setSuccess(null);

        // Validation
        if (!formData.email || !formData.password) {
            setError('Please fill in all fields');
            setIsLoading(false);
            return;
        }

        if (!/\S+@\S+\.\S+/.test(formData.email)) {
            setError('Please enter a valid email address');
            setIsLoading(false);
            return;
        }

        if (formData.password.length < 6) {
            setError('Password must be at least 6 characters');
            setIsLoading(false);
            return;
        }

        try {
            // Call your backend login API
            const response = await fetch('http://localhost:4444/api/owners/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: formData.email,
                    password: formData.password
                }),
                credentials: 'include'
            });

            const data = await response.json();

            if (!response.ok) {
                // Check for specific error messages
                if (data.message && (data.message.toLowerCase().includes('invalid') ||
                    data.message.toLowerCase().includes('incorrect') ||
                    data.message.toLowerCase().includes('not found'))) {
                    setError('Invalid email or password. Please try again.');
                } else {
                    throw new Error(data.message || 'Login failed');
                }
                setIsLoading(false);
                return;
            }

            // Success - Store token and user data
            if (data.token && data.owner) {
                localStorage.setItem('token', data.token);
                localStorage.setItem('user', JSON.stringify(data.owner));
                
                setSuccess('Login successful! Redirecting to dashboard...');
                
                // Clear form
                setFormData({ email: '', password: '' });

                // Redirect to dashboard after 2 seconds
                setTimeout(() => {
                    navigate('/dashboard');
                }, 2000);
            } else {
                throw new Error('No token received from server');
            }

        } catch (error) {
            console.error('Login error:', error);
            const errorMessage = error instanceof Error ? error.message : 'Login failed. Please try again.';
            setError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-bg-animation"></div>
            
            <div className="auth-content">
                <div className="auth-card">
                    {/* Header */}
                    <div className="auth-header">
                        <h1 className="auth-title"> {`</>`} leno, dev</h1>
                        <p className="auth-subtitle">Sign in to access your portfolio dashboard</p>
                    </div>

                    {/* Error/Success Messages */}
                    {error && (
                        <div className="auth-message auth-error">
                            <i className="fas fa-exclamation-circle"></i>
                            <span>{error}</span>
                            <button className="message-close" onClick={() => setError(null)}>
                                <i className="fas fa-times"></i>
                            </button>
                        </div>
                    )}

                    {success && (
                        <div className="auth-message auth-success">
                            <i className="fas fa-check-circle"></i>
                            <span>{success}</span>
                            <button className="message-close" onClick={() => setSuccess(null)}>
                                <i className="fas fa-times"></i>
                            </button>
                        </div>
                    )}

                    {/* Login Form */}
                    <div className="auth-form-wrapper">
                        <form className="auth-form" onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label className="form-label">Email Address</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    className="form-input"
                                    placeholder="Enter your email"
                                    required
                                    disabled={isLoading}
                                    autoComplete="email"
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label">Password</label>
                                <input
                                    type="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    className="form-input"
                                    placeholder="Enter your password"
                                    required
                                    disabled={isLoading}
                                    autoComplete="current-password"
                                    minLength={6}
                                />
                            </div>

                            <button 
                                type="submit" 
                                className="auth-btn"
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <>
                                        <span className="auth-loading"></span>
                                        Signing In...
                                    </>
                                ) : (
                                    <>
                                        <i className="fas fa-sign-in-alt"></i>
                                        Sign In
                                    </>
                                )}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;