import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
    TextInput,
    PasswordInput,
    Button,
    Paper,
    Title,
    Text,
    Container,
    Anchor,
    Image,
    Checkbox,
    Alert,
    LoadingOverlay
} from '@mantine/core';
import { IconAlertCircle } from '@tabler/icons-react';
import { notifications } from '@mantine/notifications';
import { API_URL } from '../app/config';

const Register = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        password2: '',
        userType: 'learner',
        acceptTerms: false
    });

    const [passwordMismatch, setPasswordMismatch] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const { name, email, password, password2, acceptTerms } = formData;

    const onChange = e => {
        if (e.target.name === 'acceptTerms') {
            setFormData({ ...formData, acceptTerms: e.target.checked });
        } else {
            setFormData({ ...formData, [e.target.name]: e.target.value });
        }
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        if (password !== password2) {
            setPasswordMismatch(true);
            return;
        }

        setPasswordMismatch(false);
        setLoading(true);
        setError(null);

        try {
            // Create request body with the required fields from our backend
            const userData = {
                name,
                email,
                password,
            };

            // Make API call to the backend registration endpoint
            const response = await fetch(`${API_URL}/api/user/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userData)
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Registration failed');
            }

            // Show success notification
            notifications.show({
                title: 'Registration Successful',
                message: 'Your account has been created successfully.',
                color: 'green'
            });

            // Redirect to login page after successful registration
            navigate('/login');

        } catch (err) {
            console.error('Registration error:', err);
            setError(err.message || 'An error occurred during registration');
            notifications.show({
                title: 'Registration Failed',
                message: err.message || 'An error occurred during registration',
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
                        <Link to="/login">
                            <Button variant="subtle" color="indigo">Login</Button>
                        </Link>
                    </div>
                </div>
            </nav>

            <Container size="xl" className="flex flex-1 items-center justify-center pt-16 pb-8 px-4">
                <div className="flex w-full max-w-6xl rounded-xl overflow-hidden shadow-xl">
                    {/* Left side - Image */}
                    <div className="hidden md:block w-1/2 relative bg-indigo-600">
                        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 to-purple-700 opacity-90"></div>
                        <Image
                            src="https://images.unsplash.com/photo-1543269865-cbf427effbad?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80"
                            className="h-full w-full object-cover"
                            alt="Learning illustration"
                        />
                        <div className="absolute inset-0 flex flex-col justify-center items-center text-white p-8">
                            <Title order={2} className="mb-3">Join SkillKart Today</Title>
                            <Text className="mb-6 text-center max-w-xs opacity-85">
                                Start your learning journey with personalized roadmaps
                            </Text>
                            <div className="space-y-4">
                                {[
                                    "Create personalized learning paths",
                                    "Track your progress",
                                    "Access curated resources",
                                    "Connect with other learners"
                                ].map((benefit, index) => (
                                    <div key={index} className="flex items-center gap-2">
                                        <div className="w-5 h-5 rounded-full bg-white/30 flex items-center justify-center">
                                            <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                            </svg>
                                        </div>
                                        <Text size="sm">{benefit}</Text>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right side - Form */}
                    <Paper
                        className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center bg-white overflow-y-auto"
                        radius={0}
                    >
                        <LoadingOverlay visible={loading} overlayBlur={2} />
                        <div className="w-full max-w-md mx-auto">
                            <Title order={2} align="center" className="mb-1 text-gray-900">Create an account</Title>
                            <Text color="dimmed" size="sm" align="center" className="mb-6">
                                Start building your personalized learning roadmap
                            </Text>

                            {passwordMismatch && (
                                <Alert
                                    icon={<IconAlertCircle size={16} />}
                                    title="Error"
                                    color="red"
                                    mb="md"
                                    classNames={{ root: 'bg-red-50' }}
                                >
                                    Passwords do not match
                                </Alert>
                            )}

                            <form onSubmit={onSubmit} className="space-y-4">
                                <TextInput
                                    label="Full Name"
                                    placeholder="John Doe"
                                    name="name"
                                    value={name}
                                    onChange={onChange}
                                    required
                                    size="md"
                                />

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
                                    placeholder="Create a strong password"
                                    name="password"
                                    value={password}
                                    onChange={onChange}
                                    required
                                    size="md"
                                    minLength={6}
                                />

                                <PasswordInput
                                    label="Confirm Password"
                                    placeholder="Confirm your password"
                                    name="password2"
                                    value={password2}
                                    onChange={onChange}
                                    error={passwordMismatch ? "Passwords don't match" : null}
                                    required
                                    size="md"
                                    minLength={6}
                                />

                                <Checkbox
                                    label={
                                        <Text size="sm">
                                            I agree to the{' '}
                                            <Anchor href="#" className="text-indigo-600">
                                                terms and conditions
                                            </Anchor>
                                        </Text>
                                    }
                                    checked={acceptTerms}
                                    onChange={onChange}
                                    name="acceptTerms"
                                    mt="md"
                                />

                                <Button
                                    type="submit"
                                    fullWidth
                                    color="indigo"
                                    size="md"
                                    mt="md"
                                    disabled={!acceptTerms}
                                >
                                    {loading ? 'Creating account...' : 'Create Account'}
                                </Button>
                            </form>

                            <Text align="center" mt="md">
                                Already have an account?{' '}
                                <Anchor
                                    component={Link}
                                    to="/login"
                                    className="text-indigo-600 font-medium hover:text-indigo-800"
                                >
                                    Sign in
                                </Anchor>
                            </Text>
                        </div>
                    </Paper>
                </div>
            </Container>
        </div>
    );
};

export default Register;