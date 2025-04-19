import { useState } from "react"
import {
    AppShell,
    Text,
    Title,
    UnstyledButton,
    Group,
    ThemeIcon,
    Avatar,
    Card,
    Button,
    TextInput,
    Select,
    Table,
    ActionIcon,
    Menu,
    Badge,
    Progress,
    Grid,
    Paper,
    RingProgress,
    Burger,
    Box,
    Indicator,
    Tabs,
    useMantineTheme
} from "@mantine/core"
import { useMediaQuery } from '@mantine/hooks';
import {
    IconDashboard,
    IconUpload,
    IconRoute,
    IconBook,
    IconUsers,
    IconSettings,
    IconSearch,
    IconBell,
    IconEdit,
    IconTrash,
    IconLogout,
    IconUser,
    IconAward,
    IconMessageCircle,
    IconMessages,
    IconPlus,
    IconCheck,
    IconX,
    IconVideo,
    IconArticle,
    IconChecklist,
    IconAlertTriangle,
    IconEye
} from "@tabler/icons-react"
import { Link, useNavigate } from 'react-router-dom';

// NavbarLink component for sidebar navigation
function NavbarLink({ icon, label, active, onClick }) {
    return (
        <UnstyledButton
            className={`flex items-center py-3 px-4 rounded-md transition-colors ${active ? "bg-indigo-50 text-indigo-600" : "text-gray-600 hover:bg-gray-100"
                }`}
            onClick={onClick}
        >
            <Group>
                <ThemeIcon color={active ? "indigo" : "gray"} variant={active ? "light" : "subtle"}>
                    {icon}
                </ThemeIcon>
                <Text size="sm" fw={500}>
                    {label}
                </Text>
            </Group>
        </UnstyledButton>
    )
}

// Mock data
const recentResources = [
    {
        id: 1,
        title: "React Hooks Deep Dive",
        type: "video",
        icon: <IconVideo size={16} />,
        color: "red",
        category: "Web Development",
        date: "2025-04-15",
        status: "published"
    },
    {
        id: 2,
        title: "Advanced CSS Techniques",
        type: "article",
        icon: <IconArticle size={16} />,
        color: "blue",
        category: "Web Development",
        date: "2025-04-12",
        status: "published"
    },
    {
        id: 3,
        title: "User Research Methods",
        type: "quiz",
        icon: <IconChecklist size={16} />,
        color: "green",
        category: "UI/UX Design",
        date: "2025-04-10",
        status: "pending"
    },
    {
        id: 4,
        title: "Data Visualization with D3.js",
        type: "video",
        icon: <IconVideo size={16} />,
        color: "red",
        category: "Data Science",
        date: "2025-04-08",
        status: "published"
    },
    {
        id: 5,
        title: "Introduction to Python Pandas",
        type: "article",
        icon: <IconArticle size={16} />,
        color: "blue",
        category: "Data Science",
        date: "2025-04-05",
        status: "published"
    }
];

const flaggedContent = [
    {
        id: 1,
        title: "Machine Learning Ethics",
        type: "article",
        icon: <IconArticle size={16} />,
        color: "blue",
        reason: "Outdated information",
        reportedBy: "Alex Smith",
        date: "2025-04-14"
    },
    {
        id: 2,
        title: "JavaScript Promises Tutorial",
        type: "video",
        icon: <IconVideo size={16} />,
        color: "red",
        reason: "Broken link",
        reportedBy: "Jamie Wong",
        date: "2025-04-11"
    },
    {
        id: 3,
        title: "CSS Grid Layout Quiz",
        type: "quiz",
        icon: <IconChecklist size={16} />,
        color: "green",
        reason: "Incorrect answer key",
        reportedBy: "Chris Davis",
        date: "2025-04-09"
    }
];

export default function AdminDashboard() {
    const theme = useMantineTheme();
    const [opened, setOpened] = useState(false);
    const [activeLink, setActiveLink] = useState("/dashboard");
    const isSmallScreen = useMediaQuery(`(max-width: ${theme.breakpoints.sm})`);
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState("dashboard");

    // Mock admin user data
    const adminUser = {
        name: "Maria Rodriguez",
        role: "Content Curator",
        avatar: "https://i.pravatar.cc/150?img=45"
    };

    // Stats for dashboard
    const stats = [
        { title: "Total Roadmaps", value: "42", icon: <IconRoute size={24} />, color: "indigo" },
        { title: "Total Resources", value: "387", icon: <IconBook size={24} />, color: "blue" },
        { title: "Active Learners", value: "8,492", icon: <IconUsers size={24} />, color: "green" },
        { title: "Unanswered Questions", value: "24", icon: <IconMessageCircle size={24} />, color: "orange" }
    ];

    // Navigation links for sidebar
    const navLinks = [
        { icon: <IconDashboard size={20} />, color: "indigo", label: "Dashboard", path: "/dashboard" },
        { icon: <IconUpload size={20} />, color: "blue", label: "Upload Content", path: "/upload" },
        { icon: <IconRoute size={20} />, color: "teal", label: "Manage Roadmaps", path: "/roadmaps" },
        { icon: <IconMessages size={20} />, color: "violet", label: "User Discussions", path: "/discussions" },
        { icon: <IconAward size={20} />, color: "yellow", label: "Badges & Gamification", path: "/badges" },
        { icon: <IconSettings size={20} />, color: "gray", label: "Settings", path: "/settings" },
    ];

    const handleNavLinkClick = (path) => {
        setActiveLink(path);
        // Navigate would be used in a real app 
        // navigate(path);
        console.log(`Navigating to ${path}`);

        // For demo purposes, map paths to tabs
        if (path === "/dashboard") setActiveTab("dashboard");
        else if (path === "/upload" || path === "/roadmaps") setActiveTab("content");
        else if (path === "/discussions") setActiveTab("discussions");
        else if (path === "/badges") setActiveTab("badges");
        else if (path === "/settings") setActiveTab("settings");
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'published': return 'green';
            case 'pending': return 'yellow';
            default: return 'gray';
        }
    };

    const getStatusBadge = (status) => {
        return (
            <Badge color={getStatusColor(status)}>
                {status.charAt(0).toUpperCase() + status.slice(1)}
            </Badge>
        );
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
                        <Badge ml="md" variant="outline" color="indigo">Admin</Badge>
                    </div>

                    <Group>
                        <TextInput
                            placeholder="Search..."
                            icon={<IconSearch size={16} />}
                            className="hidden md:block"
                            size="xs"
                            w={200}
                        />

                        <Indicator disabled={false} color="red" size={10} offset={2} withBorder>
                            <ActionIcon variant="light" radius="xl" size="lg">
                                <IconBell size={20} />
                            </ActionIcon>
                        </Indicator>

                        <Menu position="bottom-end" shadow="md" width={200}>
                            <Menu.Target>
                                <UnstyledButton className="flex items-center">
                                    <Avatar src={adminUser.avatar} radius="xl" size="sm" />
                                    <Box visibleFrom="sm" ml="xs">
                                        <Text size="sm" fw={500}>{adminUser.name}</Text>
                                    </Box>
                                </UnstyledButton>
                            </Menu.Target>

                            <Menu.Dropdown>
                                <Menu.Label>Account</Menu.Label>
                                <Menu.Item leftSection={<IconUser size={14} />}>Profile</Menu.Item>
                                <Menu.Item leftSection={<IconSettings size={14} />}>Settings</Menu.Item>
                                <Menu.Divider />
                                <Menu.Item leftSection={<IconLogout size={14} />} color="red" onClick={() => navigate("/")}>
                                    Logout
                                </Menu.Item>
                            </Menu.Dropdown>
                        </Menu>
                    </Group>
                </div>
            </AppShell.Header>

            <AppShell.Navbar p="md" className="bg-white">
                {/* User profile section */}
                <div className="mb-6">
                    <Group className="mb-4 pb-4 border-b border-gray-200">
                        <Avatar src={adminUser.avatar} radius="xl" size="md" />
                        <div style={{ flex: 1 }}>
                            <Text size="sm" fw={500}>{adminUser.name}</Text>
                            <Text c="dimmed" size="xs">{adminUser.role}</Text>
                        </div>
                    </Group>
                </div>

                {/* Navigation links */}
                <div className="flex-grow flex flex-col mb-6">
                    <div className="space-y-2">
                        {navLinks.map((link, index) => (
                            <NavbarLink
                                key={index}
                                {...link}
                                active={activeLink === link.path}
                                onClick={() => handleNavLinkClick(link.path)}
                            />
                        ))}
                    </div>
                </div>

                {/* Logout button */}
                <div className="border-t border-gray-200 pt-4 mt-auto">
                    <UnstyledButton
                        className="flex items-center py-3 px-4 rounded-md transition-colors text-red-600 hover:bg-red-50"
                        onClick={() => navigate("/")}
                    >
                        <Group>
                            <ThemeIcon color="red" variant="light">
                                <IconLogout size={18} />
                            </ThemeIcon>
                            <Text size="sm" fw={500}>Logout</Text>
                        </Group>
                    </UnstyledButton>
                </div>
            </AppShell.Navbar>

            <AppShell.Main className="bg-gray-50">
                <div className="min-h-screen p-4">
                    {/* Dashboard content */}
                    {activeTab === "dashboard" && (
                        <>
                            <Paper p="md" withBorder radius="md" className="bg-white mb-6">
                                <Title order={2} className="mb-1">Welcome, Curator 👋</Title>
                                <Text c="dimmed" className="mb-4">
                                    Here's an overview of SkillKart's current stats and recent activities
                                </Text>
                            </Paper>

                            {/* Stats cards */}
                            <Grid mb={24}>
                                {stats.map((stat, index) => (
                                    <Grid.Col key={index} span={{ base: 6, md: 3 }}>
                                        <Card shadow="sm" padding="lg" radius="md" withBorder>
                                            <Group position="apart">
                                                <div>
                                                    <Text c="dimmed" size="sm">{stat.title}</Text>
                                                    <Text fw={700} size="xl">{stat.value}</Text>
                                                </div>
                                                <ThemeIcon size={48} radius="md" color={stat.color} variant="light">
                                                    {stat.icon}
                                                </ThemeIcon>
                                            </Group>
                                        </Card>
                                    </Grid.Col>
                                ))}
                            </Grid>

                            {/* Content Engagement & Resource Uploads */}
                            <Grid mb={24}>
                                <Grid.Col span={{ base: 12, lg: 8 }}>
                                    <Card shadow="sm" padding="lg" radius="md" withBorder className="h-100">
                                        <Group position="apart" mb="md">
                                            <Text fw={600} size="lg">Recently Uploaded Resources</Text>
                                            <Button variant="subtle" color="indigo" size="xs" rightIcon={<IconEye size={14} />}>
                                                View All
                                            </Button>
                                        </Group>

                                        <Table highlightOnHover>
                                            <thead>
                                                <tr>
                                                    <th>Title</th>
                                                    <th>Type</th>
                                                    <th>Category</th>
                                                    <th>Date Uploaded</th>
                                                    <th>Status</th>
                                                    <th>Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {recentResources.map((resource) => (
                                                    <tr key={resource.id}>
                                                        <td>{resource.title}</td>
                                                        <td>
                                                            <Badge leftSection={resource.icon} color={resource.color} variant="light">
                                                                {resource.type}
                                                            </Badge>
                                                        </td>
                                                        <td>{resource.category}</td>
                                                        <td>{resource.date}</td>
                                                        <td>{getStatusBadge(resource.status)}</td>
                                                        <td>
                                                            <Group spacing={4}>
                                                                <ActionIcon color="blue" variant="subtle">
                                                                    <IconEdit size={16} />
                                                                </ActionIcon>
                                                                <ActionIcon color="red" variant="subtle">
                                                                    <IconTrash size={16} />
                                                                </ActionIcon>
                                                            </Group>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </Table>

                                        <Button
                                            leftIcon={<IconPlus size={16} />}
                                            color="indigo"
                                            mt="md"
                                            onClick={() => handleNavLinkClick("/upload")}
                                        >
                                            Add New Resource
                                        </Button>
                                    </Card>
                                </Grid.Col>

                                <Grid.Col span={{ base: 12, lg: 4 }}>
                                    <Card shadow="sm" padding="lg" radius="md" withBorder className="h-100">
                                        <Text fw={600} size="lg" mb="md">Resource Distribution</Text>

                                        <div className="flex justify-center mb-4">
                                            <RingProgress
                                                size={180}
                                                thickness={16}
                                                roundCaps
                                                sections={[
                                                    { value: 45, color: 'red', tooltip: 'Videos' },
                                                    { value: 30, color: 'blue', tooltip: 'Articles' },
                                                    { value: 25, color: 'green', tooltip: 'Quizzes' },
                                                ]}
                                                label={
                                                    <div className="text-center">
                                                        <Text fw={700} size="lg">387</Text>
                                                        <Text size="xs" c="dimmed">Total Resources</Text>
                                                    </div>
                                                }
                                            />
                                        </div>

                                        <div className="space-y-2 mt-4">
                                            <div className="flex justify-between items-center">
                                                <Group spacing={8}>
                                                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                                                    <Text size="sm">Videos</Text>
                                                </Group>
                                                <Text size="sm" fw={500}>174 (45%)</Text>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <Group spacing={8}>
                                                    <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                                                    <Text size="sm">Articles</Text>
                                                </Group>
                                                <Text size="sm" fw={500}>116 (30%)</Text>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <Group spacing={8}>
                                                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                                                    <Text size="sm">Quizzes</Text>
                                                </Group>
                                                <Text size="sm" fw={500}>97 (25%)</Text>
                                            </div>
                                        </div>
                                    </Card>
                                </Grid.Col>
                            </Grid>

                            {/* Pending Approvals & Flagged Content */}
                            <Card shadow="sm" padding="lg" radius="md" withBorder>
                                <Text fw={600} size="lg" mb="md">Pending Approvals & Flagged Content</Text>

                                {flaggedContent.length > 0 ? (
                                    <Table highlightOnHover>
                                        <thead>
                                            <tr>
                                                <th>Title</th>
                                                <th>Type</th>
                                                <th>Issue</th>
                                                <th>Reported By</th>
                                                <th>Date</th>
                                                <th>Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {flaggedContent.map((content) => (
                                                <tr key={content.id}>
                                                    <td>{content.title}</td>
                                                    <td>
                                                        <Badge leftSection={content.icon} color={content.color} variant="light">
                                                            {content.type}
                                                        </Badge>
                                                    </td>
                                                    <td>
                                                        <Group spacing={4}>
                                                            <IconAlertTriangle size={16} className="text-amber-500" />
                                                            <Text size="sm">{content.reason}</Text>
                                                        </Group>
                                                    </td>
                                                    <td>{content.reportedBy}</td>
                                                    <td>{content.date}</td>
                                                    <td>
                                                        <Group spacing={4}>
                                                            <ActionIcon color="green" variant="subtle" title="Approve">
                                                                <IconCheck size={16} />
                                                            </ActionIcon>
                                                            <ActionIcon color="red" variant="subtle" title="Reject">
                                                                <IconX size={16} />
                                                            </ActionIcon>
                                                            <ActionIcon color="blue" variant="subtle" title="Edit">
                                                                <IconEdit size={16} />
                                                            </ActionIcon>
                                                        </Group>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </Table>
                                ) : (
                                    <Text c="dimmed" align="center" py="xl">
                                        No flagged content or pending approvals at this time
                                    </Text>
                                )}
                            </Card>
                        </>
                    )}

                    {/* Content Management tab (placeholder) */}
                    {activeTab === "content" && (
                        <Paper p="md" withBorder radius="md" className="bg-white">
                            <Title order={2} className="mb-4">Content Management</Title>
                            <Tabs defaultValue="upload">
                                <Tabs.List>
                                    <Tabs.Tab value="upload" icon={<IconUpload size={14} />}>Upload Content</Tabs.Tab>
                                    <Tabs.Tab value="roadmaps" icon={<IconRoute size={14} />}>Manage Roadmaps</Tabs.Tab>
                                </Tabs.List>
                            </Tabs>
                            <Text mt="lg">Content management tab has been clicked. Full implementation would go here.</Text>
                        </Paper>
                    )}

                    {/* Discussions tab (placeholder) */}
                    {activeTab === "discussions" && (
                        <Paper p="md" withBorder radius="md" className="bg-white">
                            <Title order={2} className="mb-4">User Discussions</Title>
                            <Text>Discussions management tab has been clicked. Full implementation would go here.</Text>
                        </Paper>
                    )}

                    {/* Badges tab (placeholder) */}
                    {activeTab === "badges" && (
                        <Paper p="md" withBorder radius="md" className="bg-white">
                            <Title order={2} className="mb-4">Badges & Gamification</Title>
                            <Text>Badges and gamification tab has been clicked. Full implementation would go here.</Text>
                        </Paper>
                    )}

                    {/* Settings tab (placeholder) */}
                    {activeTab === "settings" && (
                        <Paper p="md" withBorder radius="md" className="bg-white">
                            <Title order={2} className="mb-4">Settings</Title>
                            <Text>Settings tab has been clicked. Full implementation would go here.</Text>
                        </Paper>
                    )}
                </div>
            </AppShell.Main>
        </AppShell>
    )
}
