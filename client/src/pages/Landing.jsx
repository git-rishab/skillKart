import React from 'react';
import { Link } from 'react-router-dom';
import {
    Button,
    Card,
    Container,
    Title,
    Text,
    Badge,
    Grid,
    Image,
    Avatar,
    Group,
    Paper,
    // Divider
} from '@mantine/core';
import {
    IconCode,
    IconPalette,
    IconChartBar,
    IconChecklist,
    IconMapPin,
    IconProgress,
    IconBrandGithub,
    IconBrandTwitter,
    IconBrandLinkedin
} from '@tabler/icons-react';

const Landing = () => {
    return (
        <div className="min-h-screen flex flex-col bg-gradient-to-b from-blue-50 to-indigo-100">
            {/* Navigation Bar */}
            <nav className="bg-white/80 backdrop-blur-md shadow-sm px-6 py-4 fixed w-full z-100">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-indigo-600 rounded-md flex items-center justify-center">
                            <span className="text-white font-bold text-lg">S</span>
                        </div>
                        <span className="text-xl font-bold text-indigo-600">SkillKart</span>
                    </div>
                    <div className="hidden md:flex items-center space-x-6">
                        <a href="#features" className="text-gray-700 hover:text-indigo-600 transition-colors">Features</a>
                        <a href="#how-it-works" className="text-gray-700 hover:text-indigo-600 transition-colors">How It Works</a>
                        <a href="#testimonials" className="text-gray-700 hover:text-indigo-600 transition-colors">Testimonials</a>
                        <a href="#about" className="text-gray-700 hover:text-indigo-600 transition-colors">About</a>
                    </div>
                    <div className="flex items-center space-x-4">
                        <Link to="/login">
                            <Button variant="subtle" color="indigo">Login</Button>
                        </Link>
                        <Link to="/register">
                            <Button color="indigo">Sign Up</Button>
                        </Link>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <Container size="xl" className="pt-32 pb-16">
                <Grid gutter={48}>
                    <Grid.Col span={{ base: 12, md: 7 }} className="flex flex-col justify-center">
                        <Badge color="indigo" size="lg" radius="sm" className="mb-4 w-fit">New Platform</Badge>
                        <Title className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-gray-900">
                            Build Your Personalized Learning <span className="text-indigo-600">Roadmap</span>
                        </Title>
                        <Text className="text-xl text-gray-600 mb-8 leading-relaxed max-w-2xl">
                            Master in-demand skills with customized learning paths. SkillKart helps you create structured roadmaps to achieve your learning goals efficiently.
                        </Text>
                        <div className="flex flex-wrap gap-4">
                            <Link to="/register">
                                <Button size="lg" color="indigo" radius="md" className="px-8">
                                    Get Started
                                </Button>
                            </Link>
                            <Link to="/explore">
                                <Button size="lg" variant="outline" color="indigo" radius="md" className="px-8">
                                    Explore Skills
                                </Button>
                            </Link>
                        </div>
                        <div className="mt-8 flex items-center gap-4">
                            <div className="flex -space-x-2">
                                {[1, 2, 3, 4].map((i) => (
                                    <Avatar key={i} radius="xl" size="md" src={`https://i.pravatar.cc/150?img=${i + 10}`} className="border-2 border-white" />
                                ))}
                            </div>
                            <Text className="text-gray-600 font-medium">
                                Joined by 2,000+ learners in the last month
                            </Text>
                        </div>
                    </Grid.Col>
                    <Grid.Col span={{ base: 12, md: 5 }} className="flex items-center justify-center">
                        <div className="relative w-full max-w-md">
                            <div className="absolute -top-6 -right-6 w-full h-full rounded-2xl bg-indigo-200 transform rotate-3"></div>
                            <div className="absolute -bottom-6 -left-6 w-full h-full rounded-2xl bg-blue-200 transform -rotate-3"></div>
                            <Image
                                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80"
                                radius="xl"
                                className="relative z-10 shadow-xl"
                                alt="Students learning together"
                            />
                        </div>
                    </Grid.Col>
                </Grid>
            </Container>

            {/* Featured Skills Section */}
            <div id="features" className="bg-white py-20">
                <Container size="xl">
                    <Title align="center" className="text-3xl md:text-4xl font-bold mb-3 text-gray-900">
                        Explore Skills
                    </Title>
                    <Text align="center" className="text-gray-600 text-lg mb-12 max-w-2xl mx-auto">
                        Choose from popular skill paths or create your own custom learning journey
                    </Text>

                    <Grid>
                        {[
                            {
                                title: 'Web Development',
                                description: 'From HTML/CSS basics to advanced React/Node.js full-stack applications',
                                icon: <IconCode size={28} />,
                                color: 'blue',
                                weeks: 16
                            },
                            {
                                title: 'UI/UX Design',
                                description: 'Master design principles, wireframing, prototyping, and user research',
                                icon: <IconPalette size={28} />,
                                color: 'pink',
                                weeks: 12
                            },
                            {
                                title: 'Data Science',
                                description: 'Learn data analysis, visualization, and machine learning techniques',
                                icon: <IconChartBar size={28} />,
                                color: 'green',
                                weeks: 18
                            }
                        ].map((skill, index) => (
                            <Grid.Col key={index} span={{ base: 12, sm: 6, md: 4 }}>
                                <Card shadow="sm" padding="lg" radius="md" withBorder className="h-full transition-all hover:shadow-lg transform hover:-translate-y-1">
                                    <Card.Section className={`bg-${skill.color}-100 p-4 flex justify-center`}>
                                        <div className={`w-14 h-14 rounded-full bg-${skill.color}-500 flex items-center justify-center text-white`}>
                                            {skill.icon}
                                        </div>
                                    </Card.Section>
                                    <div className="pt-4">
                                        <Group position="apart" mb="xs">
                                            <Title order={4}>{skill.title}</Title>
                                            <Badge color={skill.color}>{skill.weeks} weeks</Badge>
                                        </Group>
                                        <Text size="sm" color="dimmed" mb="xl">{skill.description}</Text>
                                        <Button variant="light" color={skill.color} fullWidth mt="auto">
                                            View Roadmap
                                        </Button>
                                    </div>
                                </Card>
                            </Grid.Col>
                        ))}
                    </Grid>
                </Container>
            </div>

            {/* How It Works Section */}
            <div id="how-it-works" className="py-20 bg-gray-50">
                <Container size="xl">
                    <Title align="center" className="text-3xl md:text-4xl font-bold mb-3 text-gray-900">
                        How It Works
                    </Title>
                    <Text align="center" className="text-gray-600 text-lg mb-12 max-w-2xl mx-auto">
                        Three simple steps to building your personalized learning path
                    </Text>

                    <Grid gutter={40}>
                        {[
                            {
                                title: 'Choose Your Skill',
                                description: 'Browse through various skills and select one that aligns with your career goals or interests',
                                icon: <IconChecklist size={40} />,
                                color: 'blue'
                            },
                            {
                                title: 'Follow Your Roadmap',
                                description: 'Get a customized week-by-week curriculum with curated resources and learning materials',
                                icon: <IconMapPin size={40} />,
                                color: 'indigo'
                            },
                            {
                                title: 'Track Your Progress',
                                description: 'Mark completed topics, earn XP, and celebrate your journey with achievement badges',
                                icon: <IconProgress size={40} />,
                                color: 'violet'
                            }
                        ].map((step, index) => (
                            <Grid.Col key={index} span={{ base: 12, sm: 4 }}>
                                <Paper withBorder p="xl" radius="md" className="h-full flex flex-col items-center text-center">
                                    <div className={`w-20 h-20 rounded-full bg-${step.color}-100 flex items-center justify-center text-${step.color}-500 mb-4`}>
                                        {step.icon}
                                    </div>
                                    <Title order={3} className="mb-3">{step.title}</Title>
                                    <Text color="dimmed">{step.description}</Text>
                                </Paper>
                            </Grid.Col>
                        ))}
                    </Grid>
                </Container>
            </div>

            {/* Testimonials Section */}
            <div id="testimonials" className="py-20 bg-indigo-50">
                <Container size="xl">
                    <Title align="center" className="text-3xl md:text-4xl font-bold mb-3 text-gray-900">
                        Success Stories
                    </Title>
                    <Text align="center" className="text-gray-600 text-lg mb-12 max-w-2xl mx-auto">
                        See what our learners have achieved with SkillKart roadmaps
                    </Text>

                    <Grid gutter={32}>
                        {[
                            {
                                name: 'Sarah Johnson',
                                role: 'Frontend Developer',
                                text: 'SkillKart helped me transition from marketing to web development in just 4 months. The structured roadmap made learning React so much easier than trying to piece together random tutorials.',
                                avatar: 'https://i.pravatar.cc/150?img=32'
                            },
                            {
                                name: 'Michael Chen',
                                role: 'UX Designer',
                                text: 'The UI/UX roadmap gave me exactly what I needed to build my portfolio and land my first design job. I appreciated how each week built upon the previous knowledge.',
                                avatar: 'https://i.pravatar.cc/150?img=60'
                            },
                            {
                                name: 'Priya Sharma',
                                role: 'Data Analyst',
                                text: 'I was overwhelmed by all the data science resources out there. SkillKart curated the best materials and organized them perfectly. The progress tracking kept me motivated!',
                                avatar: 'https://i.pravatar.cc/150?img=28'
                            }
                        ].map((testimonial, index) => (
                            <Grid.Col key={index} span={{ base: 12, md: 6, lg: 4 }}>
                                <Card shadow="sm" padding="lg" radius="md" withBorder className="h-full">
                                    <div className="flex flex-col h-full">
                                        <div className="mb-4">
                                            <svg width="45" height="36" className="text-indigo-300" viewBox="0 0 45 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M13.5 0C6.04416 0 0 6.04416 0 13.5C0 20.9558 6.04416 27 13.5 27H18V22.5C18 16.9772 13.5228 12.5 8 12.5V9C15.4558 9 21.5 15.0442 21.5 22.5V31.5C21.5 33.9853 19.4853 36 17 36H4C1.51472 36 -0.5 33.9853 -0.5 31.5V27.5H13.5V0ZM40.5 0C33.0442 0 27 6.04416 27 13.5C27 20.9558 33.0442 27 40.5 27H45V22.5C45 16.9772 40.5228 12.5 35 12.5V9C42.4558 9 48.5 15.0442 48.5 22.5V31.5C48.5 33.9853 46.4853 36 44 36H31C28.5147 36 26.5 33.9853 26.5 31.5V27.5H40.5V0Z" fill="currentColor" />
                                            </svg>
                                        </div>
                                        <Text size="md" className="italic flex-grow">{testimonial.text}</Text>
                                        <div className="flex items-center mt-6">
                                            <Avatar src={testimonial.avatar} radius="xl" size="lg" />
                                            <div className="ml-3">
                                                <Text weight={600}>{testimonial.name}</Text>
                                                <Text size="sm" color="dimmed">{testimonial.role}</Text>
                                            </div>
                                        </div>
                                    </div>
                                </Card>
                            </Grid.Col>
                        ))}
                    </Grid>
                </Container>
            </div>

            {/* Stats Section */}
            <div className="py-16 bg-white">
                <Container size="xl">
                    <Grid gutter={40}>
                        {[
                            { value: '200+', label: 'Skill Roadmaps' },
                            { value: '10,000+', label: 'Active Learners' },
                            { value: '85%', label: 'Completion Rate' },
                            { value: '4.8/5', label: 'User Satisfaction' }
                        ].map((stat, index) => (
                            <Grid.Col key={index} span={{ base: 6, md: 3 }} className="text-center">
                                <Title className="text-3xl md:text-4xl font-bold text-indigo-600 mb-2">{stat.value}</Title>
                                <Text color="dimmed">{stat.label}</Text>
                            </Grid.Col>
                        ))}
                    </Grid>
                </Container>
            </div>

            {/* CTA Section */}
            <div className="bg-indigo-600 py-16 text-white">
                <Container size="md" className="text-center">
                    <Title className="text-3xl md:text-4xl font-bold mb-4">Ready to start your learning journey?</Title>
                    <Text size="xl" className="mb-8 opacity-90">Join thousands of learners building their future with SkillKart</Text>
                    <div className="flex justify-center gap-4 flex-wra mt-4">
                        <Link to="/register">
                            <Button size="lg" variant="outline" color="white" radius="md">
                                Get Started
                            </Button>
                        </Link>
                        <Link to="/explore">
                            <Button size="lg" variant="outline" color="white" radius="md">
                                Explore Skills
                            </Button>
                        </Link>
                    </div>
                </Container>
            </div>

            {/* Footer Section */}
            <footer id="about" className="bg-gray-900 text-gray-300 pt-16 pb-8">
                <Container size="xl">
                    <Grid>
                        <Grid.Col span={{ base: 12, sm: 6, md: 3 }} className="mb-8">
                            <div className="flex items-center gap-2 mb-4">
                                <div className="w-8 h-8 bg-indigo-500 rounded-md flex items-center justify-center">
                                    <span className="text-white font-bold text-lg">S</span>
                                </div>
                                <span className="text-xl font-bold text-white">SkillKart</span>
                            </div>
                            <Text size="sm" className="mb-6">
                                Empowering learners worldwide with structured, personalized roadmaps to master new skills.
                            </Text>
                            <div className="flex space-x-4">
                                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                                    <IconBrandTwitter size={22} />
                                </a>
                                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                                    <IconBrandGithub size={22} />
                                </a>
                                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                                    <IconBrandLinkedin size={22} />
                                </a>
                            </div>
                        </Grid.Col>

                        <Grid.Col span={{ base: 6, sm: 6, md: 3 }} className="mb-8">
                            <Title order={4} className="mb-4 text-white">Platform</Title>
                            <div className="flex flex-col space-y-2">
                                <a href="#" className="hover:text-white transition-colors">How it works</a>
                                <a href="#" className="hover:text-white transition-colors">Pricing</a>
                                <a href="#" className="hover:text-white transition-colors">FAQ</a>
                                <a href="#" className="hover:text-white transition-colors">Roadmaps</a>
                            </div>
                        </Grid.Col>

                        <Grid.Col span={{ base: 6, sm: 6, md: 3 }} className="mb-8">
                            <Title order={4} className="mb-4 text-white">Company</Title>
                            <div className="flex flex-col space-y-2">
                                <a href="#" className="hover:text-white transition-colors">About Us</a>
                                <a href="#" className="hover:text-white transition-colors">Careers</a>
                                <a href="#" className="hover:text-white transition-colors">Blog</a>
                                <a href="#" className="hover:text-white transition-colors">Contact</a>
                            </div>
                        </Grid.Col>

                        <Grid.Col span={{ base: 12, sm: 6, md: 3 }} className="mb-8">
                            <Title order={4} className="mb-4 text-white">Legal</Title>
                            <div className="flex flex-col space-y-2">
                                <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
                                <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
                                <a href="#" className="hover:text-white transition-colors">Cookie Policy</a>
                            </div>
                        </Grid.Col>
                    </Grid>

                    {/* <Divider my="md" color="gray.700" /> */}

                    <div className="flex flex-col md:flex-row justify-between items-center pt-4">
                        <Text size="sm" className="mb-4 md:mb-0">© 2025 SkillKart. All rights reserved.</Text>
                        <Text size="sm">Made with ❤️ for learners worldwide</Text>
                    </div>
                </Container>
            </footer>
        </div>
    );
};

export default Landing;