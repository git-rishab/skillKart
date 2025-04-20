import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
    AppShell,
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
    Tabs,
    Alert,
    Loader
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
    IconChecklist,
    IconChevronRight,
    IconAlertCircle
} from '@tabler/icons-react';
import RoadmapView from '../components/RoadmapView';
import ActiveRoadmapsView from '../components/ActiveRoadmapsView';
import UserPreferencesModal from '../components/UserPreferencesModal';
import { API_URL } from '../app/config';
import { notifications } from '@mantine/notifications';
import UserStatsGraph from '../components/UserStatsGraph';

// Navigation data
const mainNavLinks = [
    { icon: <IconDashboard size={20} />, color: "blue", label: "Dashboard", path: "/dashboard" },
    { icon: <IconRoad size={20} />, color: "teal", label: "My Roadmap", path: "/roadmap" },
    { icon: <IconMessages size={20} />, color: "violet", label: "Discussions", path: "/discussions" },
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
    const [showPreferencesModal, setShowPreferencesModal] = useState(false);
    const [activeRoadmap, setActiveRoadmap] = useState(null);
    const [showRoadmapList, setShowRoadmapList] = useState(false);
    const [isInitialLoad, setIsInitialLoad] = useState(true);
    const [fetchError, setFetchError] = useState(null);
    const [userData, setUserData] = useState({
        name: "Loading...",
        email: "",
        level: 1,
        xp: 0,
        badges: []
    });
    const [hasActiveRoadmap, setHasActiveRoadmap] = useState([]);
    const [isLoadingRoadmaps, setIsLoadingRoadmaps] = useState(true);
    const navigate = useNavigate();
    const location = useLocation();
    const isSmallScreen = useMediaQuery(`(max-width: ${theme.breakpoints.sm})`);

    // Fetch user data and roadmaps
    const fetchUserRoadmaps = async () => {
        setIsLoadingRoadmaps(true);
        setFetchError(null);
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                navigate("/login");
                notifications.show({
                    title: "Session Expired",
                    message: "Please log in again to continue.",
                    color: "red",
                });
                return;
            }
            const fetchUserDetails = await fetch(`${API_URL}/api/user`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!fetchUserDetails.ok) {
                throw new Error(`Error fetching user details: ${fetchUserDetails.status}`);
            }

            const userDetails = await fetchUserDetails.json();

            // Update user data from backend response
            setUserData({
                name: userDetails.name || "User",
                email: userDetails.email || "",
                level: Math.floor(userDetails.xp / 100) + 1 || 1,
                xp: userDetails.xp || 0,
                badges: userDetails.badges || []
            });

            // Check if the user has any roadmaps followed
            if (userDetails.activeRoadmaps && userDetails.activeRoadmaps.length > 0) {
                setHasActiveRoadmap(userDetails.activeRoadmaps);

                // Initial load should show Dashboard, not roadmaps
                if (isInitialLoad) {
                    setShowRoadmapList(false); // Don't show roadmap list on initial load
                    setActiveLink("/dashboard");
                    setIsInitialLoad(false);
                }
            } else {
                setHasActiveRoadmap([]);
                // If user has no roadmaps, show the preferences modal
                if (isInitialLoad) {
                    setShowPreferencesModal(true);
                    setIsInitialLoad(false);
                }
            }
        } catch (error) {
            console.error("Error checking active roadmaps:", error);
            setFetchError("Failed to load your roadmaps. Please try again later.");
            setHasActiveRoadmap([]);
        } finally {
            setIsLoadingRoadmaps(false);
        }
    };

    useEffect(() => {
        fetchUserRoadmaps();
    }, []);

    // Check if the location state contains activeTab or noRoadmapFollowed flag
    useEffect(() => {
        if (location.state) {
            if (location.state.activeTab) {
                setActiveTab(location.state.activeTab);
            }
            if (location.state.noRoadmapFollowed) {
                setShowPreferencesModal(true);
            }
        }
    }, [location]);

    const handleNavLinkClick = (path) => {
        setActiveLink(path);

        // Set active tab based on navigation
        if (path === "/roadmap") {
            setActiveTab("overview"); // Always show overview first
            setShowRoadmapList(true); // Show roadmap list when My Roadmap is clicked
            // Reset active roadmap to null so the list view is shown
            setActiveRoadmap(null);
        } else if (path === "/discussions") {
            navigate("/discussions");
        } else {
            setActiveTab("overview");
            setShowRoadmapList(false);
        }
    };

    const handleRoadmapProgressUpdate = (progressStats) => {
        // Update active roadmap with new progress stats if needed
        if (activeRoadmap) {
            setActiveRoadmap(prev => ({
                ...prev,
                completionPercentage: progressStats.percentage
            }));
        }
    };

    // Handle closing the modal
    const handleClosePreferencesModal = () => {
        setShowPreferencesModal(false);
        // After closing the modal, refresh roadmaps in case new ones were added
        fetchUserRoadmaps();

        // Don't automatically navigate to roadmaps after closing the modal
        // Let the user stay on the current view
        setFetchError(null);
    };

    const handleLogout = () => {
        try {
            localStorage.removeItem('token');

            // Verify if the token is removed
            if (localStorage.getItem('token')) {
                throw new Error("Failed to remove token from local storage");
            }

            // Redirect to login page
            navigate("/");
            notifications.show({
                title: "Logged Out",
                message: "You have been logged out successfully.",
                color: "green",
            });
        } catch (error) {
            console.error("Error logging out:", error);
            notifications.show({
                title: "Logout Failed",
                message: "An error occurred while logging out. Please try again.",
                color: "red",
            });
        }
    }

    // Handle selecting a specific roadmap
    const handleRoadmapSelect = (roadmap) => {
        setActiveRoadmap(roadmap);
        setActiveTab("roadmap"); // Switch to roadmap tab when a specific roadmap is selected
        setShowRoadmapList(false); // Hide the list view once a roadmap is selected
    };

    // Handle going back to roadmap list
    const handleBackToRoadmapList = () => {
        setActiveRoadmap(null);
        setShowRoadmapList(true);
        setActiveTab("overview");
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
                                    <Box visibleFrom="sm">
                                        <Text size="sm" fw={500}>{userData.name}</Text>
                                    </Box>
                                </UnstyledButton>
                            </Menu.Target>

                            <Menu.Dropdown>
                                <Menu.Label>Account</Menu.Label>
                                <Menu.Item leftSection={<IconUser size={14} />}>Profile</Menu.Item>
                                <Menu.Item leftSection={<IconSettings size={14} />}>Settings</Menu.Item>
                                <Menu.Divider />
                                <Menu.Item onClick={handleLogout} leftSection={<IconLogout size={14} />} color="red">
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
                        onClick={handleLogout}
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
                            <Tabs.Tab value="overview" icon={<IconDashboard size={14} />}>
                                {showRoadmapList ? "My Roadmaps" : "Dashboard Overview"}
                            </Tabs.Tab>
                            {activeRoadmap && (
                                <Tabs.Tab value="roadmap" icon={<IconRoad size={14} />}>Interactive Roadmap</Tabs.Tab>
                            )}
                        </Tabs.List>
                    </Tabs>

                    {/* Display fetch error if any */}
                    {fetchError && (
                        <Alert
                            icon={<IconAlertCircle size={16} />}
                            title="Error"
                            color="red"
                            mb="md"
                            withCloseButton
                            onClose={() => setFetchError(null)}
                        >
                            {fetchError}
                        </Alert>
                    )}

                    {/* Dashboard Overview Tab */}
                    {activeTab === "overview" && !showRoadmapList && (
                        <>
                            {/* Greeting and stats section */}
                            <Grid mb="md">
                                <Grid.Col span={12} md={8}>
                                    <Paper p="md" withBorder radius="md" className="bg-white">
                                        <Title order={2} className="mb-1">Welcome back, {userData.name}!</Title>
                                        <Text c="dimmed" className="mb-4">
                                            You're making great progress on your learning journey.
                                        </Text>
                                        {activeRoadmap && (
                                            <Group justify="space-between" className="flex-wrap">
                                                <div>
                                                    <Text fw={500}>Current Skill Path</Text>
                                                    <Text size="xl" fw={700} className="text-indigo-600">
                                                        {activeRoadmap.roadmapId.title}
                                                    </Text>
                                                </div>
                                                <RingProgress
                                                    size={90}
                                                    roundCaps
                                                    thickness={8}
                                                    sections={[{ value: activeRoadmap.completionPercentage || 0, color: 'blue' }]}
                                                    label={
                                                        <Text c="blue" fw={700} ta="center" size="lg">
                                                            {Math.round(activeRoadmap.completionPercentage || 0)}%
                                                        </Text>
                                                    }
                                                />
                                            </Group>
                                        )}
                                    </Paper>
                                </Grid.Col>
                                <Grid.Col span={12} md={4}>
                                    <Paper p="md" withBorder radius="md" className="bg-white h-full">
                                        <Group justify="space-between" mb="xs">
                                            <Text fw={500}>Earned Badges</Text>
                                            <Badge variant="outline" color="indigo">
                                                {userData.badges ? userData.badges.length : 0} badges
                                            </Badge>
                                        </Group>

                                        <Grid>
                                            {userData.badges && userData.badges.length > 0 ? (
                                                userData.badges.map((badge, index) => (
                                                    <Grid.Col key={index} span={6}>
                                                        <Paper p="sm" className="flex flex-col items-center text-center"
                                                            withBorder radius="md">
                                                            <ThemeIcon
                                                                color={getBadgeColor(badge)}
                                                                size={40}
                                                                radius="xl"
                                                                variant="filled"
                                                            >
                                                                {getBadgeIcon(badge)}
                                                            </ThemeIcon>
                                                            <Text size="xs" mt={5}>{badge}</Text>
                                                        </Paper>
                                                    </Grid.Col>
                                                ))
                                            ) : (
                                                <Grid.Col span={12}>
                                                    <Text align="center" size="sm" color="dimmed">
                                                        Complete tasks to earn badges!
                                                    </Text>
                                                </Grid.Col>
                                            )}
                                        </Grid>
                                    </Paper>
                                </Grid.Col>
                            </Grid>

                            {/* Add User Stats Graph */}
                            <div className="mb-6">
                                <UserStatsGraph />
                            </div>

                            {/* Active Roadmaps Section */}
                            <Title order={3} mt="lg" mb="md">My Roadmaps</Title>
                            {isLoadingRoadmaps ? (
                                <Paper p="xl" withBorder radius="md" className="text-center">
                                    <Loader size="sm" mb="sm" />
                                    <Text>Loading your roadmaps...</Text>
                                </Paper>
                            ) : hasActiveRoadmap && hasActiveRoadmap.length > 0 ? (
                                <>
                                    <ActiveRoadmapsView
                                        roadmaps={hasActiveRoadmap}
                                        onRoadmapSelect={handleRoadmapSelect}
                                    />
                                    <Button
                                        mt="md"
                                        variant="outline"
                                        color="indigo"
                                        onClick={() => {
                                            setActiveLink("/roadmap");
                                            setShowRoadmapList(true);
                                        }}
                                        leftSection={<IconRoad size={16} />}
                                    >
                                        View All My Roadmaps
                                    </Button>
                                </>
                            ) : (
                                <Paper p="xl" withBorder radius="md" className="text-center">
                                    <Text mb="md">You don't have any active roadmaps yet.</Text>
                                    <Button
                                        variant="filled"
                                        color="indigo"
                                        onClick={() => setShowPreferencesModal(true)}
                                    >
                                        Find a Roadmap
                                    </Button>
                                </Paper>
                            )}

                            {/* Weekly stats cards - only show if a roadmap is selected */}
                            {activeRoadmap && activeRoadmap.roadmapId.modules && (
                                <>
                                    <Title order={3} mt="lg" mb="md">Your Progress</Title>
                                    <Grid>
                                        {activeRoadmap.roadmapId.modules.map((module) => {
                                            const completedCount = module.topics.filter(topic => topic.completed).length;
                                            const progressPercentage = Math.round((completedCount / module.topics.length) * 100);

                                            return (
                                                <Grid.Col key={module._id || module.weekNumber} span={{ base: 12, sm: 6, md: 3 }}>
                                                    <Card shadow="sm" p="md" radius="md" withBorder>
                                                        <Card.Section withBorder inheritPadding py="xs" className={
                                                            progressPercentage === 100
                                                                ? 'bg-green-50'
                                                                : progressPercentage > 0
                                                                    ? 'bg-blue-50'
                                                                    : 'bg-gray-50'
                                                        }>
                                                            <Group position="apart">
                                                                <Text fw={500}>Week {module.weekNumber || module.moduleNumber}</Text>
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
                                                            {module.title}
                                                        </Text>

                                                        <Text size="sm" color="dimmed" mb="md">
                                                            {completedCount} of {module.topics.length} topics completed
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
                        </>
                    )}

                    {/* My Roadmaps List View */}
                    {activeTab === "overview" && showRoadmapList && (
                        <>
                            <div className="flex justify-between items-center mb-6">
                                <Title order={2}>My Roadmaps</Title>
                                <div>
                                    <Button
                                        variant="outline"
                                        color="indigo"
                                        onClick={() => setShowPreferencesModal(true)}
                                        mr="md"
                                    >
                                        Browse More Roadmaps
                                    </Button>
                                    <Button
                                        variant="subtle"
                                        color="gray"
                                        onClick={() => {
                                            setShowRoadmapList(false);
                                            setActiveLink("/dashboard");
                                        }}
                                        leftIcon={<IconDashboard size={16} />}
                                    >
                                        Back to Dashboard
                                    </Button>
                                </div>
                            </div>

                            {isLoadingRoadmaps ? (
                                <Paper p="xl" withBorder radius="md" className="text-center">
                                    <Text>Loading your roadmaps...</Text>
                                </Paper>
                            ) : hasActiveRoadmap && hasActiveRoadmap.length > 0 ? (
                                <ActiveRoadmapsView
                                    roadmaps={hasActiveRoadmap}
                                    onRoadmapSelect={handleRoadmapSelect}
                                />
                            ) : (
                                <Paper p="xl" withBorder radius="md" className="text-center">
                                    <Text mb="md">You don't have any active roadmaps yet.</Text>
                                    <Text size="sm" color="dimmed" mb="md">
                                        The roadmaps you selected might not be available yet, or there was an error loading them.
                                    </Text>
                                    <Button
                                        variant="filled"
                                        color="indigo"
                                        onClick={() => setShowPreferencesModal(true)}
                                    >
                                        Find a Roadmap
                                    </Button>
                                </Paper>
                            )}
                        </>
                    )}

                    {/* Interactive Roadmap Tab */}
                    {activeTab === "roadmap" && activeRoadmap && (
                        <div className="roadmap-container">
                            <Paper p="md" radius="md" withBorder mb={16} className="bg-gradient-to-r from-indigo-50 to-blue-50">
                                <Group position="apart">
                                    <div>
                                        <Text size="lg" fw={700}>{activeRoadmap.roadmapId.title}</Text>
                                        <Text size="sm" color="dimmed">{activeRoadmap.roadmapId.description || 'Interactive learning roadmap'}</Text>
                                    </div>
                                    <Button
                                        variant="subtle"
                                        onClick={handleBackToRoadmapList}
                                    >
                                        Back to My Roadmaps
                                    </Button>
                                </Group>
                            </Paper>

                            <RoadmapView
                                roadmapData={activeRoadmap}
                                onProgressUpdate={handleRoadmapProgressUpdate}
                            />
                        </div>
                    )}
                </div>
            </AppShell.Main>
            {/* User Preferences Modal */}
            <UserPreferencesModal
                isOpen={showPreferencesModal}
                onClose={handleClosePreferencesModal}
                token={localStorage.getItem('token')}
                hasActiveRoadmap={hasActiveRoadmap && hasActiveRoadmap.length > 0}
            />
        </AppShell>
    );
};

// Helper function to get badge icon based on badge name
const getBadgeIcon = (badgeName) => {
    switch (badgeName) {
        case "Trailblazer":
            return <IconRoad size={20} />;
        case "Week One Warrior":
            return <IconAward size={20} />;
        case "Mastermind":
            return <IconBook size={20} />;
        case "Knowledge Ninja":
            return <IconArticle size={20} />;
        case "Skill Samurai":
            return <IconAward size={20} />;
        case "Discussion Dynamo":
            return <IconMessages size={20} />;
        case "Curiosity Catalyst":
            return <IconChecklist size={20} />;
        case "Badge Collector":
            return <IconAward size={20} />;
        default:
            return <IconAward size={20} />;
    }
};

// Helper function to get badge color based on badge name
const getBadgeColor = (badgeName) => {
    switch (badgeName) {
        case "Trailblazer":
            return "blue";
        case "Week One Warrior":
            return "green";
        case "Mastermind":
            return "violet";
        case "Knowledge Ninja":
            return "red";
        case "Skill Samurai":
            return "indigo";
        case "Discussion Dynamo":
            return "teal";
        case "Curiosity Catalyst":
            return "yellow";
        case "Badge Collector":
            return "orange";
        default:
            return "gray";
    }
};

export default Dashboard;