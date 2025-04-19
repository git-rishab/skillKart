import React, { useState } from 'react';
import { Link } from 'react-router-dom';
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
} from '@mantine/core';
import { IconBrandGoogle } from '@tabler/icons-react';

const Login = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    const { email, password } = formData;

    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

    const onSubmit = e => {
        e.preventDefault();
        console.log('Login attempt with:', formData);
        // In a real app, you would dispatch a login action here
    };

    const handleGoogleLogin = () => {
        console.log('Google login attempt');
        // Handle Google authentication
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
                    >
                        <div className="w-full max-w-md mx-auto">
                            <Title order={2} align="center" className="mb-1 text-gray-900">Sign in to SkillKart</Title>
                            <Text color="dimmed" size="sm" align="center" className="mb-6">
                                Continue your learning journey
                            </Text>

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
                                >
                                    Sign In
                                </Button>
                            </form>

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
                            </Button>

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