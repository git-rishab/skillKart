import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
    AppShell,
    // Removing Navbar import as it's not directly exported in Mantine v7
    // Navbar,
    Text,
    Burger,
    useMantineTheme,
    UnstyledButton,
    Group,
    ThemeIcon,
    Avatar,
    Progress,
    Badge,
    Card,
    Image,
    Button,
    Divider,
    ActionIcon,
    Menu,
    Title,
    Paper,
    Grid,
    Collapse,
    Switch,
    RingProgress,
    Box,
    Tabs
} from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import {
    IconDashboard,
    IconRoad,
    IconMessages,
    IconAward,
    IconSettings,
    IconBook,
    IconArticle,
    IconBrandYoutube,
    IconNotebook,
    IconChevronDown,
    IconLogout,
    IconUser,
    IconBell,
    IconChecklist
} from '@tabler/icons-react';
import RoadmapView from '../components/RoadmapView';

// Enhanced roadmap data structure for the interactive roadmap view
const roadmapData = {
    title: "UI/UX Designer Roadmap",
    description: "Master user interface design and user experience principles with this comprehensive learning path",
    difficulty: "Intermediate",
    weeks: [
        {
            weekNumber: 1,
            title: "Introduction to UI/UX Design",
            description: "Learn the fundamental concepts, principles, and differences between UI and UX design.",
            topics: [
                {
                    title: "Understanding UI vs UX",
                    isKey: true,
                    completed: true,
                    description: "Learn the key differences between user interface and user experience design",
                    resources: [
                        {
                            title: "UI vs UX Design",
                            type: "video",
                            url: "https://example.com/ui-vs-ux"
                        },
                        {
                            title: "The Difference Between UI/UX",
                            type: "article",
                            url: "https://example.com/difference-ui-ux"
                        }
                    ]
                },
                {
                    title: "Design Thinking Process",
                    isKey: true,
                    completed: true,
                    description: "Understand the five stages of design thinking: empathize, define, ideate, prototype, test",
                    resources: [
                        {
                            title: "Design Thinking Explained",
                            type: "video",
                            url: "https://example.com/design-thinking"
                        },
                        {
                            title: "Design Thinking Workshop",
                            type: "notebook",
                            url: "https://example.com/design-thinking-workshop"
                        }
                    ]
                },
                {
                    title: "User Research Fundamentals",
                    completed: true,
                    description: "Learn various methods to understand user needs and behaviors",
                    resources: [
                        {
                            title: "User Research Methods",
                            type: "article",
                            url: "https://example.com/user-research"
                        },
                        {
                            title: "User Research Quiz",
                            type: "quiz",
                            url: "https://example.com/user-research-quiz"
                        }
                    ]
                },
                {
                    title: "Understanding the Design Process",
                    completed: true,
                    description: "Overview of the end-to-end design process in modern product teams",
                    resources: [
                        {
                            title: "Modern Design Process",
                            type: "video",
                            url: "https://example.com/design-process"
                        }
                    ]
                }
            ]
        },
        {
            weekNumber: 2,
            title: "User Research Methods",
            description: "Dive deeper into various user research techniques to gather valuable insights.",
            topics: [
                {
                    title: "Conducting User Interviews",
                    isKey: true,
                    completed: true,
                    description: "Learn how to plan, conduct, and analyze user interviews",
                    resources: [
                        {
                            title: "User Interview Techniques",
                            type: "video",
                            url: "https://example.com/user-interviews"
                        },
                        {
                            title: "Interview Question Template",
                            type: "article",
                            url: "https://example.com/interview-template"
                        }
                    ]
                },
                {
                    title: "Creating Effective Surveys",
                    completed: true,
                    description: "Design surveys that generate actionable insights without biases",
                    resources: [
                        {
                            title: "Survey Design Best Practices",
                            type: "article",
                            url: "https://example.com/survey-design"
                        }
                    ]
                },
                {
                    title: "Competitive Analysis",
                    completed: false,
                    description: "Learn to analyze competitors to identify opportunities and threats",
                    resources: [
                        {
                            title: "Competitive Analysis Framework",
                            type: "notebook",
                            url: "https://example.com/competitive-analysis"
                        },
                        {
                            title: "Competitive Analysis Workshop",
                            type: "video",
                            url: "https://example.com/comp-analysis-workshop"
                        }
                    ]
                },
                {
                    title: "Creating User Personas",
                    completed: false,
                    description: "Develop accurate user personas based on research findings",
                    resources: [
                        {
                            title: "User Persona Templates",
                            type: "article",
                            url: "https://example.com/personas"
                        },
                        {
                            title: "Personas in UX Design",
                            type: "video",
                            url: "https://example.com/personas-video"
                        }
                    ]
                },
                {
                    title: "User Journey Mapping",
                    completed: false,
                    description: "Map out the complete user journey to identify pain points and opportunities",
                    resources: [
                        {
                            title: "Journey Mapping Workshop",
                            type: "video",
                            url: "https://example.com/journey-mapping"
                        }
                    ]
                }
            ]
        },
        {
            weekNumber: 3,
            title: "Information Architecture",
            description: "Learn to organize and structure content effectively to improve user experience.",
            topics: [
                {
                    title: "Information Architecture Basics",
                    isKey: true,
                    completed: false,
                    description: "Understand the core principles of organizing information for usability",
                    resources: [
                        {
                            title: "IA Fundamentals",
                            type: "video",
                            url: "https://example.com/ia-basics"
                        }
                    ]
                },
                {
                    title: "Creating Site Maps",
                    completed: false,
                    description: "Learn to create effective site maps for complex applications",
                    resources: [
                        {
                            title: "Site Mapping Techniques",
                            type: "article",
                            url: "https://example.com/site-maps"
                        }
                    ]
                },
                {
                    title: "User Flows and Task Flows",
                    completed: false,
                    description: "Map out user paths through your application for critical tasks",
                    resources: [
                        {
                            title: "User Flow Diagrams",
                            type: "video",
                            url: "https://example.com/user-flows"
                        },
                        {
                            title: "User Flow Workshop",
                            type: "notebook",
                            url: "https://example.com/flow-workshop"
                        }
                    ]
                },
                {
                    title: "Card Sorting",
                    completed: false,
                    description: "Use card sorting techniques to validate information organization",
                    resources: [
                        {
                            title: "Card Sorting Methods",
                            type: "article",
                            url: "https://example.com/card-sorting"
                        },
                        {
                            title: "Card Sorting Quiz",
                            type: "quiz",
                            url: "https://example.com/card-sorting-quiz"
                        }
                    ]
                }
            ]
        },
        {
            weekNumber: 4,
            title: "Wireframing and Prototyping",
            description: "Learn to create low and high-fidelity prototypes to visualize solutions and test ideas.",
            topics: [
                {
                    title: "Wireframing Fundamentals",
                    isKey: true,
                    completed: false,
                    description: "Master the basics of creating effective wireframes",
                    resources: [
                        {
                            title: "Wireframing Basics",
                            type: "video",
                            url: "https://example.com/wireframing-basics"
                        }
                    ]
                },
                {
                    title: "Paper Wireframing",
                    completed: false,
                    description: "Learn quick sketching techniques for rapid idea exploration",
                    resources: [
                        {
                            title: "Paper Prototyping Workshop",
                            type: "notebook",
                            url: "https://example.com/paper-wireframes"
                        }
                    ]
                },
                {
                    title: "Digital Wireframing with Figma",
                    completed: false,
                    description: "Create wireframes using industry-standard tools",
                    resources: [
                        {
                            title: "Figma for Wireframing",
                            type: "video",
                            url: "https://example.com/figma-wireframes"
                        },
                        {
                            title: "Wireframe Templates",
                            type: "article",
                            url: "https://example.com/wireframe-templates"
                        }
                    ]
                },
                {
                    title: "Creating Interactive Prototypes",
                    completed: false,
                    description: "Add interactivity to your wireframes for user testing",
                    resources: [
                        {
                            title: "Interactive Prototyping",
                            type: "video",
                            url: "https://example.com/interactive-prototypes"
                        }
                    ]
                },
                {
                    title: "Usability Testing with Prototypes",
                    completed: false,
                    description: "Plan and conduct usability tests with your prototypes",
                    resources: [
                        {
                            title: "Usability Testing Guide",
                            type: "article",
                            url: "https://example.com/usability-testing"
                        },
                        {
                            title: "Usability Testing Quiz",
                            type: "quiz",
                            url: "https://example.com/testing-quiz"
                        }
                    ]
                }
            ]
        }
    ],
    totalXP: {
        earned: 160,
        total: 440
    },
    badges: [
        { name: "First Week Complete", icon: <IconAward size={18} />, color: "yellow", earned: true },
        { name: "Research Master", icon: <IconBook size={18} />, color: "blue", earned: true },
        { name: "Wireframing Pro", icon: <IconNotebook size={18} />, color: "teal", earned: false },
        { name: "Prototype Expert", icon: <IconUser size={18} />, color: "violet", earned: false }
    ]
};

// Navigation data
const mainNavLinks = [
    { icon: <IconDashboard size={20} />, color: "blue", label: "Dashboard", path: "/dashboard" },
    { icon: <IconRoad size={20} />, color: "teal", label: "My Roadmap", path: "/roadmap" },
    { icon: <IconMessages size={20} />, color: "violet", label: "Discussions", path: "/discussions" },
    { icon: <IconAward size={20} />, color: "yellow", label: "XP & Badges", path: "/badges" },
    { icon: <IconSettings size={20} />, color: "gray", label: "Settings", path: "/settings" },
];

// NavLink component for sidebar
function MainLink({ icon, color, label, path, active, onClick }) {
    return (
        <UnstyledButton
            sx={(theme) => ({
                display: 'block',
                width: '100%',
                padding: theme.spacing.xs,
                borderRadius: theme.radius.sm,
                color: theme.colorScheme === 'dark' ? theme.colors.dark[0] : theme.black,
                backgroundColor: active ? theme.colors[color][0] : 'transparent',
                '&:hover': {
                    backgroundColor: theme.colors[color][0],
                },
            })}
            onClick={() => onClick(path)}
        >
            <Group>
                <ThemeIcon color={color} variant="light" size={30}>
                    {icon}
                </ThemeIcon>
                <Text size="sm" weight={500}>{label}</Text>
            </Group>
        </UnstyledButton>
    );
}

const Dashboard = () => {
    const theme = useMantineTheme();
    const [opened, setOpened] = useState(false);
    const [activeLink, setActiveLink] = useState("/dashboard");
    const [activeTab, setActiveTab] = useState("overview");
    // Using const for userData instead of useState since we don't need to change it yet
    const userData = {
        name: "Alex Johnson",
        email: "alex@example.com",
        avatar: "https://i.pravatar.cc/150?img=35",
        level: 3
    };
    const [roadmap, setRoadmap] = useState(roadmapData);
    const navigate = useNavigate();
    const isSmallScreen = useMediaQuery(`(max-width: ${theme.breakpoints.sm})`);

    const handleNavLinkClick = (path) => {
        setActiveLink(path);

        // Set active tab based on navigation
        if (path === "/roadmap") {
            setActiveTab("roadmap");
        } else {
            setActiveTab("overview");
        }

        // In a real app, you would navigate to the path
        // navigate(path);
        console.log(`Navigation to ${path}`);
    };

    const handleRoadmapProgressUpdate = (progressStats) => {
        // Update the overall progress stats
        const newEarned = Math.round((progressStats.percentage / 100) * roadmap.totalXP.total);

        setRoadmap(prev => ({
            ...prev,
            totalXP: {
                ...prev.totalXP,
                earned: newEarned
            }
        }));
    };

    return (
        <AppShell
            padding="md"
            navbar={{
                width: 300,
                breakpoint: 'sm',
                collapsed: { mobile: !opened }
            }}
            header={{ height: 60 }}
        >
            <AppShell.Header className="bg-white border-b border-gray-200">
                <div style={{ display: 'flex', alignItems: 'center', height: '100%', padding: '0 1rem' }} className="justify-between">
                    {isSmallScreen && (
                        <Burger
                            opened={opened}
                            onClick={() => setOpened((o) => !o)}
                            size="sm"
                            color={theme.colors.gray[6]}
                            mr="xl"
                        />
                    )}

                    <div className="flex items-center">
                        <div className="w-8 h-8 bg-indigo-600 rounded-md flex items-center justify-center mr-2">
                            <span className="text-white font-bold text-lg">S</span>
                        </div>
                        <Title order={3} className="text-indigo-600 hidden sm:block">SkillKart</Title>
                    </div>

                    <Group>
                        <ActionIcon variant="light" radius="xl" size="lg">
                            <IconBell size={20} />
                        </ActionIcon>

                        <Menu position="bottom-end" shadow="md" width={200}>
                            <Menu.Target>
                                <UnstyledButton className="flex items-center">
                                    <Avatar src={userData.avatar} radius="xl" size="sm" />
                                    <Box visibleFrom="sm" ml="xs">
                                        <Text size="sm" fw={500}>{userData.name}</Text>
                                    </Box>
                                </UnstyledButton>
                            </Menu.Target>

                            <Menu.Dropdown>
                                <Menu.Label>Account</Menu.Label>
                                <Menu.Item leftSection={<IconUser size={14} />}>Profile</Menu.Item>
                                <Menu.Item leftSection={<IconSettings size={14} />}>Settings</Menu.Item>
                                <Menu.Divider />
                                <Menu.Item leftSection={<IconLogout size={14} />} color="red">
                                    Logout
                                </Menu.Item>
                            </Menu.Dropdown>
                        </Menu>
                    </Group>
                </div>
            </AppShell.Header>

            <AppShell.Navbar p="md" className="bg-white">
                {/* Changed Navbar.Section to a simple div with appropriate styling */}
                <div className="mb-6">
                    <Group className="mb-4 pb-4 border-b border-gray-200">
                        <Avatar src={userData.avatar} radius="xl" size="md" />
                        <div style={{ flex: 1 }}>
                            <Text size="sm" fw={500}>{userData.name}</Text>
                            <Text c="dimmed" size="xs">{userData.email}</Text>
                        </div>
                        <Badge size="sm" variant="outline" color="indigo">Level {userData.level}</Badge>
                    </Group>
                </div>

                {/* Replacing Navbar.Section with a simple div */}
                <div className="flex-grow flex flex-col mb-6">
                    <div className="space-y-2 flex flex-col">
                        {mainNavLinks.map((link, index) => (
                            <MainLink
                                key={index}
                                {...link}
                                active={activeLink === link.path}
                                onClick={handleNavLinkClick}
                            />
                        ))}
                    </div>
                </div>

                {/* Replacing Navbar.Section with a simple div */}
                <div className="border-t border-gray-200 pt-4 mt-auto">
                    <UnstyledButton
                        sx={(theme) => ({
                            display: 'block',
                            width: '100%',
                            padding: theme.spacing.xs,
                            borderRadius: theme.radius.sm,
                            color: theme.colors.red[6],
                            '&:hover': {
                                backgroundColor: theme.colors.red[0],
                            },
                        })}
                        onClick={() => navigate("/")}
                    >
                        <Group>
                            <ThemeIcon color="red" variant="light">
                                <IconLogout size={18} />
                            </ThemeIcon>
                            <Text size="sm">Logout</Text>
                        </Group>
                    </UnstyledButton>
                </div>
            </AppShell.Navbar>

            <AppShell.Main className="bg-gray-50">
                <div className="min-h-screen p-4">
                    {/* Navigation Tabs */}
                    <Tabs value={activeTab} onChange={setActiveTab} mb="md">
                        <Tabs.List>
                            <Tabs.Tab value="overview" icon={<IconDashboard size={14} />}>Dashboard Overview</Tabs.Tab>
                            <Tabs.Tab value="roadmap" icon={<IconRoad size={14} />}>Interactive Roadmap</Tabs.Tab>
                        </Tabs.List>
                    </Tabs>

                    {/* Dashboard Overview Tab */}
                    {activeTab === "overview" && (
                        <>
                            {/* Greeting and stats section */}
                            <Grid mb="md">
                                <Grid.Col span={12} md={8}>
                                    <Paper p="md" withBorder radius="md" className="bg-white">
                                        <Title order={2} className="mb-1">Welcome back, {userData.name}!</Title>
                                        <Text c="dimmed" className="mb-4">
                                            You're making great progress on your learning journey.
                                        </Text>
                                        <Group justify="space-between" className="flex-wrap">
                                            <div>
                                                <Text fw={500}>Current Skill Path</Text>
                                                <Text size="xl" fw={700} className="text-indigo-600">
                                                    {roadmap.title}
                                                </Text>
                                            </div>
                                            <RingProgress
                                                size={90}
                                                roundCaps
                                                thickness={8}
                                                sections={[{ value: (roadmap.totalXP.earned / roadmap.totalXP.total) * 100, color: 'blue' }]}
                                                label={
                                                    <Text c="blue" fw={700} ta="center" size="lg">
                                                        {Math.round((roadmap.totalXP.earned / roadmap.totalXP.total) * 100)}%
                                                    </Text>
                                                }
                                            />
                                        </Group>
                                    </Paper>
                                </Grid.Col>

                                <Grid.Col span={12} md={4}>
                                    <Paper p="md" withBorder radius="md" className="bg-white h-full">
                                        <Group justify="space-between" mb="xs">
                                            <Text fw={500}>Earned Badges</Text>
                                            <Badge variant="outline" color="indigo">
                                                {roadmap.badges.filter(badge => badge.earned).length}/{roadmap.badges.length}
                                            </Badge>
                                        </Group>

                                        <Grid>
                                            {roadmap.badges.map((badge, index) => (
                                                <Grid.Col key={index} span={6}>
                                                    <Paper p="sm" className={`flex flex-col items-center text-center ${badge.earned ? '' : 'opacity-40'}`} withBorder={badge.earned} radius="md">
                                                        <ThemeIcon
                                                            color={badge.color}
                                                            size={40}
                                                            radius="xl"
                                                            variant={badge.earned ? "filled" : "light"}
                                                        >
                                                            {badge.icon}
                                                        </ThemeIcon>
                                                        <Text size="xs" mt={5}>{badge.name}</Text>
                                                    </Paper>
                                                </Grid.Col>
                                            ))}
                                        </Grid>
                                    </Paper>
                                </Grid.Col>
                            </Grid>

                            {/* XP Progress bar */}
                            <Paper p="md" withBorder radius="md" className="bg-white mb-4">
                                <Group justify="space-between" mb="sm">
                                    <div>
                                        <Text fw={500} size="sm">Overall Progress</Text>
                                        <Text fw={700} size="lg">{roadmap.totalXP.earned} / {roadmap.totalXP.total} XP</Text>
                                    </div>
                                    <Badge size="lg" color="indigo">Level {userData.level}</Badge>
                                </Group>
                                <Progress
                                    size="xl"
                                    radius="sm"
                                    value={(roadmap.totalXP.earned / roadmap.totalXP.total) * 100}
                                    color="indigo"
                                    striped
                                    animated
                                />
                            </Paper>

                            {/* Weekly stats cards */}
                            <Title order={3} mt="lg" mb="md">Your Progress</Title>
                            <Grid>
                                {roadmap.weeks.map((week) => {
                                    const completedCount = week.topics.filter(topic => topic.completed).length;
                                    const progressPercentage = Math.round((completedCount / week.topics.length) * 100);

                                    return (
                                        <Grid.Col key={week.weekNumber} span={{ base: 12, sm: 6, md: 3 }}>
                                            <Card shadow="sm" p="md" radius="md" withBorder>
                                                <Card.Section withBorder inheritPadding py="xs" className={
                                                    progressPercentage === 100
                                                        ? 'bg-green-50'
                                                        : progressPercentage > 0
                                                            ? 'bg-blue-50'
                                                            : 'bg-gray-50'
                                                }>
                                                    <Group position="apart">
                                                        <Text fw={500}>Week {week.weekNumber}</Text>
                                                        <Badge color={
                                                            progressPercentage === 100
                                                                ? 'green'
                                                                : progressPercentage > 0
                                                                    ? 'blue'
                                                                    : 'gray'
                                                        }>
                                                            {progressPercentage}%
                                                        </Badge>
                                                    </Group>
                                                </Card.Section>

                                                <Text mt="md" mb="xs" fw={500}>
                                                    {week.title}
                                                </Text>

                                                <Text size="sm" color="dimmed" mb="md">
                                                    {completedCount} of {week.topics.length} topics completed
                                                </Text>

                                                <Progress
                                                    value={progressPercentage}
                                                    color={progressPercentage === 100 ? 'green' : 'blue'}
                                                    size="sm"
                                                    radius="xl"
                                                    mb="sm"
                                                />

                                                <Button
                                                    variant="light"
                                                    fullWidth
                                                    mt="md"
                                                    color={progressPercentage === 100 ? 'green' : 'blue'}
                                                    onClick={() => {
                                                        setActiveTab("roadmap");
                                                    }}
                                                >
                                                    {progressPercentage === 100 ? 'Review Week' : 'Continue Learning'}
                                                </Button>
                                            </Card>
                                        </Grid.Col>
                                    );
                                })}
                            </Grid>
                        </>
                    )}

                    {/* Interactive Roadmap Tab */}
                    {activeTab === "roadmap" && (
                        <div className="roadmap-container">
                            <Title order={3} mb="md">Interactive Roadmap</Title>
                            <RoadmapView
                                roadmapData={roadmap}
                                onProgressUpdate={handleRoadmapProgressUpdate}
                            />
                        </div>
                    )}
                </div>
            </AppShell.Main>
        </AppShell>
    );
};

export default Dashboard;