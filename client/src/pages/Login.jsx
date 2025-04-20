import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
    TextInput,
    PasswordInput,
    Button,
    Paper,
    Title,
    Text,
    Divider,
    Container,
    Group,
    Stack,
    Anchor,
    Box,
    Image,
    Alert,
    LoadingOverlay
} from '@mantine/core';
import { IconAlertCircle } from '@tabler/icons-react';
import { notifications } from '@mantine/notifications';
import { API_URL } from '../app/config';

const Login = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const { email, password } = formData;

    // Check if user is already logged in
    useEffect(() => {
        const token = localStorage.getItem('token');
        const userRole = localStorage.getItem('userRole');

        if (token) {
            // Redirect based on role if already authenticated
            if (userRole === 'admin') {
                navigate('/admin/dashboard');
            } else {
                navigate('/dashboard');
            }
        }
    }, [navigate]);

    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

    const onSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            // Make API call to the backend login endpoint
            const response = await fetch(`${API_URL}/api/user/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Login failed');
            }

            localStorage.setItem('token', data.token);

            // Decode the JWT token to get user information
            const tokenPayload = JSON.parse(atob(data.token.split('.')[1]));

            // Store user role for future checks
            const userRole = tokenPayload.user.role || 'user';
            localStorage.setItem('userRole', userRole);

            // Show success notification
            notifications.show({
                title: 'Login Successful',
                message: data.message || 'You have been logged in successfully.',
                color: 'green'
            });

            // Redirect based on user role and roadmap status
            if (userRole === 'admin') {
                navigate('/admin/dashboard');
            } else {
                navigate('/dashboard');
            }

        } catch (err) {
            console.error('Login error:', err);
            setError(err.message || 'Invalid credentials');
            notifications.show({
                title: 'Login Failed',
                message: err.message || 'Invalid email or password',
                color: 'red'
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col bg-gradient-to-b from-indigo-50 to-blue-50">
            {/* Navigation Bar */}
            <nav className="bg-white/80 backdrop-blur-md shadow-sm px-6 py-4 fixed w-full z-10">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <Link to="/" className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-indigo-600 rounded-md flex items-center justify-center">
                            <span className="text-white font-bold text-lg">S</span>
                        </div>
                        <span className="text-xl font-bold text-indigo-600">SkillKart</span>
                    </Link>
                    <div className="flex items-center space-x-4">
                        <Link to="/register">
                            <Button variant="outline" color="indigo">Sign Up</Button>
                        </Link>
                    </div>
                </div>
            </nav>

            <Container size="xl" className="flex flex-1 items-center justify-center pt-16 pb-8 px-4">
                <div className="flex w-full max-w-6xl rounded-xl overflow-hidden shadow-xl">
                    {/* Left side - Image */}
                    <div className="hidden md:block w-1/2 relative bg-indigo-600">
                        <div className="absolute inset-0 bg-gradient-to-tr from-indigo-900 to-indigo-500 opacity-90"></div>
                        <Image
                            src="https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80"
                            className="h-full w-full object-cover"
                            alt="Learning illustration"
                        />
                        <div className="absolute inset-0 flex flex-col justify-center items-center text-white p-8">
                            <Title order={2} className="mb-3">Welcome back to SkillKart</Title>
                            <Text className="mb-6 text-center max-w-xs opacity-85">
                                Continue your learning journey and track your progress
                            </Text>
                            <div className="bg-white/20 p-6 rounded-lg backdrop-blur-sm">
                                <blockquote className="italic text-sm">
                                    "The beautiful thing about learning is nobody can take it away from you."
                                    <footer className="mt-2 font-medium">— B.B. King</footer>
                                </blockquote>
                            </div>
                        </div>
                    </div>

                    {/* Right side - Form */}
                    <Paper
                        className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center bg-white"
                        radius={0}
                        pos="relative"
                    >
                        <LoadingOverlay visible={loading} overlayBlur={2} />
                        <div className="w-full max-w-md mx-auto">
                            <Title order={2} align="center" className="mb-1 text-gray-900">Sign in to SkillKart</Title>
                            <Text color="dimmed" size="sm" align="center" className="mb-6">
                                Continue your learning journey
                            </Text>

                            {error && (
                                <Alert icon={<IconAlertCircle size={16} />} title="Error" color="red" mb="md">
                                    {error}
                                </Alert>
                            )}

                            <form onSubmit={onSubmit} className="space-y-4">
                                <TextInput
                                    label="Email"
                                    placeholder="your@email.com"
                                    type="email"
                                    name="email"
                                    value={email}
                                    onChange={onChange}
                                    required
                                    size="md"
                                />

                                <PasswordInput
                                    label="Password"
                                    placeholder="Your password"
                                    name="password"
                                    value={password}
                                    onChange={onChange}
                                    required
                                    size="md"
                                />

                                <Group position="apart" mt="md">
                                    <Anchor
                                        size="sm"
                                        component={Link}
                                        to="/forgot-password"
                                        className="text-indigo-600 hover:text-indigo-800"
                                    >
                                        Forgot password?
                                    </Anchor>
                                </Group>

                                <Button
                                    type="submit"
                                    fullWidth
                                    color="indigo"
                                    size="md"
                                    className="mt-4"
                                    loading={loading}
                                >
                                    Sign In
                                </Button>
                            </form>
                            {/* 
                            <Divider
                                label="or continue with"
                                labelPosition="center"
                                my="lg"
                            />

                            <Button
                                fullWidth
                                variant="outline"
                                leftIcon={<IconBrandGoogle />}
                                onClick={handleGoogleLogin}
                                className="border-gray-300"
                            >
                                Google Account
                            </Button> */}

                            <Text align="center" mt="md">
                                Don't have an account?{' '}
                                <Anchor
                                    component={Link}
                                    to="/register"
                                    className="text-indigo-600 font-medium hover:text-indigo-800"
                                >
                                    Sign up
                                </Anchor>
                            </Text>
                        </div>
                    </Paper>
                </div>
            </Container>
        </div>
    );
};

export default Login;