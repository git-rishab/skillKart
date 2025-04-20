import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {
    AppShell,
    Title,
    Accordion,
    Button,
    Modal,
    Stack,
    Group,
    TextInput,
    Burger,
    useMantineTheme,
    UnstyledButton,
    ThemeIcon,
    Text,
    Box,
    ActionIcon,
    Menu,
    Select, // Import Select component
    Grid,   // Import Grid for layout
    Paper,   // Import Paper for visual grouping
    Divider // Import Divider
} from '@mantine/core';
import { IconTrash, IconPlus, IconRoad, IconLogout, IconSettings, IconUser, IconBell, IconPencil, IconChevronRight, IconBook } from '@tabler/icons-react'; // Add IconPencil, IconChevronRight, IconBook
import { showNotification, notifications } from '@mantine/notifications'; // Correct import
import { useMediaQuery } from '@mantine/hooks';
import { API_URL } from '../app/config'; // Assuming config is needed for API calls

// Simplified NavLink for Admin Sidebar
function AdminNavLink({ icon, color, label, active, onClick }) {
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
            onClick={onClick}
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


export default function AdminDashboard() {
    const theme = useMantineTheme();
    const [opened, setOpened] = useState(false);
    const [roadmaps, setRoadmaps] = useState([]);
    const [selected, setSelected] = useState(null);
    const [adminName, setAdminName] = useState("Admin"); // Placeholder for admin name
    const navigate = useNavigate();
    const isSmallScreen = useMediaQuery(`(max-width: ${theme.breakpoints.sm})`);

    // Fetch admin details (optional, could be hardcoded or fetched)
    // useEffect(() => {
    //   // Fetch admin user details if needed
    //   // Example: setAdminName(fetchedAdminDetails.name);
    // }, []);

    useEffect(() => { fetchRoadmaps(); }, []);

    const fetchRoadmaps = async () => {
        try {
            const token = localStorage.getItem('token'); // Assuming admin needs token
            if (!token) {
                navigate("/login"); // Redirect if not logged in
                return;
            }
            const { data } = await axios.get(`${API_URL}/api/roadmap/admin/all`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            setRoadmaps(data);
        } catch (error) {
            console.error("Failed to load roadmaps:", error);
            showNotification({ title: 'Error', message: 'Failed to load roadmaps', color: 'red' });
            if (error.response && error.response.status === 401) {
                navigate("/login"); // Redirect on auth error
            }
        }
    };

    const openModal = (roadmapId, moduleIndex, topicIndex, resources) => {
        setSelected({ roadmapId, moduleIndex, topicIndex, resources: [...resources] });
    };

    const handleSave = async () => {
        if (!selected) return;
        try {
            const token = localStorage.getItem('token');
            const { roadmapId, moduleIndex, topicIndex, resources } = selected;
            await axios.put(`${API_URL}/api/roadmap/${roadmapId}/module/${moduleIndex}/topic/${topicIndex}/resources`,
                { resources },
                { headers: { 'Authorization': `Bearer ${token}` } }
            );
            showNotification({ title: 'Success', message: 'Resources updated', color: 'green' });
            setSelected(null);
            fetchRoadmaps(); // Refresh list after save
        } catch (error) {
            console.error("Failed to update resources:", error);
            showNotification({ title: 'Error', message: 'Update failed', color: 'red' });
        }
    };

    const handleLogout = () => {
        try {
            localStorage.removeItem('token');
            navigate("/"); // Redirect to landing or login page
            notifications.show({
                title: "Logged Out",
                message: "You have been logged out successfully.",
                color: "green",
            });
        } catch (error) {
            console.error("Error logging out:", error);
            notifications.show({
                title: "Logout Failed",
                message: "An error occurred while logging out.",
                color: "red",
            });
        }
    };

    return (
        <AppShell
            padding="md"
            navbar={{
                width: 250, // Adjusted width
                breakpoint: 'sm',
                collapsed: { mobile: !opened }
            }}
            header={{ height: 60 }}
        >
            <AppShell.Header className="bg-white border-b border-gray-200">
                <div style={{ display: 'flex', alignItems: 'center', height: '100%', padding: '0 1rem' }} className="justify-between">
                    <Group>
                        {isSmallScreen && (
                            <Burger
                                opened={opened}
                                onClick={() => setOpened((o) => !o)}
                                size="sm"
                                color={theme.colors.gray[6]}
                                mr="xl"
                            />
                        )}
                        {/* Reusing SkillKart Title */}
                        <div className="flex items-center">
                            <div className="w-8 h-8 bg-indigo-600 rounded-md flex items-center justify-center mr-2">
                                <span className="text-white font-bold text-lg">S</span>
                            </div>
                            <Title order={3} className="text-indigo-600 hidden sm:block">SkillKart</Title>
                        </div>
                        <Text size="lg" fw={500} ml="md">Admin Panel</Text>
                    </Group>

                    {/* Simplified Header Right Section */}
                    <Group>
                        <ActionIcon variant="light" radius="xl" size="lg">
                            <IconBell size={20} />
                        </ActionIcon>
                        <Menu position="bottom-end" shadow="md" width={200}>
                            <Menu.Dropdown>
                                <Menu.Label>Account</Menu.Label>
                                {/* Add relevant admin actions if needed */}
                                {/* <Menu.Item leftSection={<IconUser size={14} />}>Profile</Menu.Item> */}
                                {/* <Menu.Item leftSection={<IconSettings size={14} />}>Settings</Menu.Item> */}
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
                {/* Simplified Navbar */}
                <div className="flex-grow flex flex-col mb-6">
                    <div className="space-y-2 flex flex-col">
                        <AdminNavLink
                            icon={<IconRoad size={20} />}
                            color="blue"
                            label="Manage Roadmaps"
                            active={true} // Always active as it's the main view
                            onClick={() => { }} // No action needed for now
                        />
                        {/* Add other admin links here if needed */}
                    </div>
                </div>

                {/* Logout Button at the bottom */}
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
                <div className="p-4 bg-white rounded-md shadow-md">
                    <Title order={2} mb="xl">Manage Roadmap Resources</Title> {/* Increased bottom margin */}
                    <Accordion variant="separated" radius="md"> {/* Changed variant and added radius */}
                        {roadmaps.map((rm) => (
                            <Accordion.Item key={rm._id} value={rm._id}>
                                <Accordion.Control>
                                    <Group>
                                        <ThemeIcon color="indigo" variant="light" size="lg" radius="md">
                                            <IconRoad size={20} />
                                        </ThemeIcon>
                                        <Text fw={500}>{rm.title}</Text>
                                    </Group>
                                </Accordion.Control>
                                <Accordion.Panel>
                                    {rm.modules.map((mod, mi) => (
                                        <Paper key={mi} p="md" mb="md" withBorder radius="sm"> {/* Wrap module in Paper */}
                                            <Title order={4} mb="sm">Week {mod.weekNumber || mod.moduleNumber}</Title>
                                            <Stack spacing="xs"> {/* Use Stack for topics */}
                                                {mod.topics.map((topic, ti) => (
                                                    <Paper key={topic._id || ti} p="sm" withBorder radius="xs"> {/* Wrap topic in Paper */}
                                                        <Group justify="space-between">
                                                            <Group>
                                                                <ThemeIcon color="gray" variant="light" size="sm">
                                                                    <IconBook size={14} />
                                                                </ThemeIcon>
                                                                <Text size="sm">{topic.title}</Text>
                                                            </Group>
                                                            <Button
                                                                size="xs"
                                                                variant="light" // Changed variant
                                                                leftSection={<IconPencil size={14} />} // Added icon
                                                                onClick={() => openModal(rm._id, mi, ti, topic.resources)}
                                                            >
                                                                Edit Resources
                                                            </Button>
                                                        </Group>
                                                    </Paper>
                                                ))}
                                            </Stack>
                                        </Paper>
                                    ))}
                                </Accordion.Panel>
                            </Accordion.Item>
                        ))}
                    </Accordion>

                    {/* Resource Edit Modal - Enhanced UI */}
                    <Modal opened={!!selected} onClose={() => setSelected(null)} title="Edit Topic Resources" size="xl"> {/* Increased size slightly */}
                        {selected && (
                            <form onSubmit={(e) => { e.preventDefault(); handleSave(); }}>
                                <Stack spacing="lg"> {/* Increased spacing */}
                                    {selected.resources.map((res, idx) => (
                                        <Paper key={idx} p="md" withBorder radius="md" shadow="xs"> {/* Wrap each resource in Paper */}
                                            <Grid align="flex-end" gutter="md">
                                                <Grid.Col span={{ base: 12, sm: 4 }}>
                                                    <TextInput
                                                        label="Title"
                                                        required
                                                        value={res.title}
                                                        onChange={(e) => {
                                                            const resources = [...selected.resources];
                                                            resources[idx].title = e.target.value;
                                                            setSelected({ ...selected, resources });
                                                        }}
                                                    />
                                                </Grid.Col>
                                                <Grid.Col span={{ base: 12, sm: 5 }}>
                                                    <TextInput
                                                        label="URL"
                                                        required
                                                        value={res.url}
                                                        onChange={(e) => {
                                                            const resources = [...selected.resources];
                                                            resources[idx].url = e.target.value;
                                                            setSelected({ ...selected, resources });
                                                        }}
                                                    />
                                                </Grid.Col>
                                                <Grid.Col span={{ base: 12, sm: 2 }}>
                                                    <Select
                                                        label="Type"
                                                        required
                                                        data={['video', 'blog', 'quiz']}
                                                        value={res.type}
                                                        onChange={(value) => {
                                                            const resources = [...selected.resources];
                                                            resources[idx].type = value;
                                                            setSelected({ ...selected, resources });
                                                        }}
                                                    />
                                                </Grid.Col>
                                                <Grid.Col span={{ base: 12, sm: 1 }}>
                                                    <ActionIcon color="red" variant="light" onClick={() => {
                                                        const resources = selected.resources.filter((_, i) => i !== idx);
                                                        setSelected({ ...selected, resources });
                                                    }} title="Remove Resource">
                                                        <IconTrash size={18} />
                                                    </ActionIcon>
                                                </Grid.Col>
                                            </Grid>
                                        </Paper>
                                    ))}
                                    <Button
                                        variant="light"
                                        leftSection={<IconPlus size={16} />}
                                        onClick={() => setSelected({
                                            ...selected,
                                            // Default new resource includes type
                                            resources: [...selected.resources, { type: 'video', title: '', url: '' }]
                                        })}
                                        fullWidth // Make button wider
                                        mt="sm"
                                    >
                                        Add Another Resource
                                    </Button>
                                    <Group justify="right" mt="md"> {/* Added margin top */}
                                        <Button variant="default" onClick={() => setSelected(null)}>Cancel</Button>
                                        <Button type="submit">Save Changes</Button>
                                    </Group>
                                </Stack>
                            </form>
                        )}
                    </Modal>
                </div>
            </AppShell.Main>
        </AppShell>
    );
}
