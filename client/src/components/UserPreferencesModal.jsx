import React, { useState } from 'react';
import {
    Modal,
    Title,
    Text,
    RadioGroup,
    Radio,
    Button,
    Group,
    Stack,
    Select,
    Card,
    Divider,
    Loader,
    Center
} from '@mantine/core';
import { API_URL } from '../app/config';
import { useNavigate } from 'react-router-dom';
import { notifications } from '@mantine/notifications';

const UserPreferencesModal = ({ isOpen, onClose, token, hasActiveRoadmap = false }) => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [interest, setInterest] = useState('');
    const [goal, setGoal] = useState('');
    const [timeRange, setTimeRange] = useState('');
    const [step, setStep] = useState(1);

    // Catchy loading messages
    const loadingMessages = [
        "Crafting your personalized learning journey...",
        "Assembling the perfect roadmap just for you...",
        "Gathering the best resources for your goals...",
        "Optimizing your path to success...",
        "Building your skill development blueprint..."
    ];
    const [currentLoadingMessage, setCurrentLoadingMessage] = useState(0);

    // Change loading message every 3 seconds
    React.useEffect(() => {
        if (loading) {
            const interval = setInterval(() => {
                setCurrentLoadingMessage(prev => (prev + 1) % loadingMessages.length);
            }, 3000);

            return () => clearInterval(interval);
        }
    }, [loading]);

    const interests = [
        'Web Development',
        'UI/UX Design',
        'Data Science',
        'Mobile App Development',
        'DevOps',
        'Cybersecurity',
        'AI/ML',
        'Cloud Computing'
    ];

    const goals = [
        'Get a job',
        'Start freelancing',
        'Build a portfolio project',
        'Learn fundamentals',
        'Crack interviews',
        'Switch career'
    ];

    const timeRanges = [
        { label: '5-10 hours/week', value: '5-10' },
        { label: '10-15 hours/week', value: '10-15' },
        { label: '15-20 hours/week', value: '15-20' },
        { label: '20-30 hours/week', value: '20-30' },
        { label: '30+ hours/week', value: '30-Infinity' }
    ];

    const getTimeRangeValues = (range) => {
        if (!range) return { min: 0, max: 0 };

        const [min, max] = range.split('-');
        return { min: parseInt(min), max: max === 'Infinity' ? "Infinity" : parseInt(max) };
    };

    const handleNext = () => {
        if (step === 1 && !interest) {
            notifications.show({
                title: 'Selection Required',
                message: 'Please select your area of interest',
                color: 'red'
            });
            return;
        }

        if (step === 2 && !goal) {
            notifications.show({
                title: 'Selection Required',
                message: 'Please select your learning goal',
                color: 'red'
            });
            return;
        }

        if (step < 3) {
            setStep(step + 1);
        } else {
            handleSubmit();
        }
    };

    const handleBack = () => {
        if (step > 1) {
            setStep(step - 1);
        }
    };

    const handleSubmit = async () => {
        if (!interest || !goal || !timeRange) {
            notifications.show({
                title: 'Error',
                message: 'Please fill in all fields',
                color: 'red'
            });
            return;
        }

        setLoading(true);

        try {
            const response = await fetch(`${API_URL}/api/roadmap/generate`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    interest,
                    goals: [goal],
                    availableWeeklyTime: getTimeRangeValues(timeRange)
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to generate roadmap');
            }

            // Show success notification
            notifications.show({
                title: 'Roadmap Created!',
                message: 'Your personalized learning roadmap is ready to explore',
                color: 'green'
            });

            // Just close the modal and let parent component handle any updates
            onClose();

            setLoading(false);
        } catch (error) {
            console.error('Error generating roadmap:', error);
            notifications.show({
                title: 'Error',
                message: error.message || 'Failed to generate roadmap',
                color: 'red'
            });
            // Don't close the modal if there was an error
            setLoading(false);
        }
    };

    // Function to handle modal close attempts
    const handleModalClose = () => {
        // Only allow closing if user has active roadmaps or if we're not loading
        if (hasActiveRoadmap && !loading) {
            onClose();
        } else if (!hasActiveRoadmap && !loading) {
            // If user has no roadmaps and tries to close, show notification
            notifications.show({
                title: 'Action Required',
                message: 'Please complete the form to create your roadmap',
                color: 'blue'
            });
        }
    };

    return (
        <Modal
            opened={isOpen}
            onClose={handleModalClose}
            title={null}
            size="lg"
            radius="md"
            centered
            closeOnClickOutside={hasActiveRoadmap && !loading}
            closeOnEscape={hasActiveRoadmap && !loading}
            withCloseButton={hasActiveRoadmap && !loading}
        >
            {loading ? (
                <div className="py-12">
                    <Center>
                        <Stack spacing="lg" align="center">
                            <Loader size="lg" color="indigo" />
                            <Text size="lg" fw={500} ta="center" className="text-indigo-700">
                                {loadingMessages[currentLoadingMessage]}
                            </Text>
                            <Text color="dimmed" size="sm" ta="center" className="max-w-xs">
                                We're creating your personalized learning roadmap based on your preferences. This may take a moment...
                            </Text>
                        </Stack>
                    </Center>
                </div>
            ) : (
                <div className="relative">
                    {/* Progress indicator */}
                    <div className="mb-8">
                        <div className="flex items-center justify-center">
                            <div className="flex items-center">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${step >= 1 ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-600'
                                    }`}>
                                    1
                                </div>
                                <div className={`h-1 w-12 ${step > 1 ? 'bg-indigo-600' : 'bg-gray-200'}`}></div>
                            </div>
                            <div className="flex items-center">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${step >= 2 ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-600'
                                    }`}>
                                    2
                                </div>
                                <div className={`h-1 w-12 ${step > 2 ? 'bg-indigo-600' : 'bg-gray-200'}`}></div>
                            </div>
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${step >= 3 ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-600'
                                }`}>
                                3
                            </div>
                        </div>
                    </div>

                    {/* Step 1: Interest Selection */}
                    {step === 1 && (
                        <div>
                            <Title order={3} className="mb-2">Choose your area of interest</Title>
                            <Text color="dimmed" size="sm" className="mb-6">
                                This will help us personalize your learning journey
                            </Text>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                                {interests.map((item) => (
                                    <Card
                                        key={item}
                                        padding="md"
                                        radius="md"
                                        className={`cursor-pointer transition-all ${interest === item
                                            ? 'border-2 border-indigo-600 bg-indigo-50'
                                            : 'border border-gray-200 hover:border-indigo-300 hover:bg-gray-50'
                                            }`}
                                        onClick={() => setInterest(item)}
                                    >
                                        <Radio
                                            value={item}
                                            checked={interest === item}
                                            onChange={() => setInterest(item)}
                                            label={item}
                                            className="w-full"
                                        />
                                    </Card>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Step 2: Goal Selection */}
                    {step === 2 && (
                        <div>
                            <Title order={3} className="mb-2">What's your primary goal?</Title>
                            <Text color="dimmed" size="sm" className="mb-6">
                                This will help us tailor content to your specific needs
                            </Text>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                                {goals.map((item) => (
                                    <Card
                                        key={item}
                                        padding="md"
                                        radius="md"
                                        className={`cursor-pointer transition-all ${goal === item
                                            ? 'border-2 border-indigo-600 bg-indigo-50'
                                            : 'border border-gray-200 hover:border-indigo-300 hover:bg-gray-50'
                                            }`}
                                        onClick={() => setGoal(item)}
                                    >
                                        <Radio
                                            value={item}
                                            checked={goal === item}
                                            onChange={() => setGoal(item)}
                                            label={item}
                                            className="w-full"
                                        />
                                    </Card>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Step 3: Time Availability */}
                    {step === 3 && (
                        <div>
                            <Title order={3} className="mb-2">How much time can you dedicate weekly?</Title>
                            <Text color="dimmed" size="sm" className="mb-6">
                                We'll adjust the pace of your learning plan accordingly
                            </Text>

                            <div className="grid grid-cols-1 gap-3 mb-8">
                                {timeRanges.map((item) => (
                                    <Card
                                        key={item.value}
                                        padding="md"
                                        radius="md"
                                        className={`cursor-pointer transition-all ${timeRange === item.value
                                            ? 'border-2 border-indigo-600 bg-indigo-50'
                                            : 'border border-gray-200 hover:border-indigo-300 hover:bg-gray-50'
                                            }`}
                                        onClick={() => setTimeRange(item.value)}
                                    >
                                        <Radio
                                            value={item.value}
                                            checked={timeRange === item.value}
                                            onChange={() => setTimeRange(item.value)}
                                            label={item.label}
                                            className="w-full"
                                        />
                                    </Card>
                                ))}
                            </div>
                        </div>
                    )}

                    <Group position="right" mt="xl">
                        {step > 1 && (
                            <Button variant="outline" onClick={handleBack} disabled={loading}>
                                Back
                            </Button>
                        )}
                        <Button
                            onClick={handleNext}
                            loading={loading}
                            color="indigo"
                        >
                            {step === 3 ? 'Submit' : 'Next'}
                        </Button>
                    </Group>
                </div>
            )}
        </Modal>
    );
};

export default UserPreferencesModal;