import React, { useState, useEffect } from 'react';
import {
    Paper,
    Text,
    Title,
    Group,
    RingProgress,
    Stack,
    Grid,
    Badge,
    Tooltip,
    Skeleton,
    useMantineTheme,
    Progress,
    ThemeIcon
} from '@mantine/core';
import {
    IconFlame,
    IconTrophy,
    IconChartBar,
    IconArrowUpRight,
} from '@tabler/icons-react';
import { API_URL } from '../app/config';

// Colors for the heatmap based on activity intensity
const ACTIVITY_COLORS = ['#EBEDF0', '#9BE9A8', '#40C463', '#30A14E', '#216E39'];

const UserStatsGraph = () => {
    const theme = useMantineTheme();
    const [loading, setLoading] = useState(true);
    const [xpData, setXpData] = useState({
        xp: 0,
        level: 1,
        streak: 0,
        lastActivityDate: null,
        activityData: []
    });
    const [error, setError] = useState(null);

    // Calculate progress to next level
    const progressToNextLevel = xpData.xp % 100;
    const nextLevelXp = 100;

    // Extract current streak value from potentially complex streak object
    const getCurrentStreak = () => {
        if (xpData.streak === null || xpData.streak === undefined) {
            return 0;
        }

        // If streak is an object with currentStreak property
        if (typeof xpData.streak === 'object' && xpData.streak !== null) {
            return xpData.streak.currentStreak || 0;
        }

        // If streak is a simple number
        return xpData.streak;
    };

    useEffect(() => {
        const fetchXpData = async () => {
            setLoading(true);
            try {
                const token = localStorage.getItem('token');
                if (!token) return;

                const response = await fetch(`${API_URL}/api/user/xp-data`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch XP data');
                }

                const data = await response.json();
                setXpData(data);
            } catch (err) {
                console.error('Error fetching XP data:', err);
                setError('Could not load your stats. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        fetchXpData();
    }, []);

    // Generate the days for the past 91 days (including today)
    const generateCalendarDays = () => {
        const days = [];
        const today = new Date(); // Today's date object
        const todayString = today.toISOString().split('T')[0]; // Today's date as YYYY-MM-DD

        const startDate = new Date(today);
        startDate.setDate(startDate.getDate() - 90); // Start 90 days before today

        // Create a map of activity data for quick lookup
        const activityMap = {};
        xpData.activityData?.forEach(day => {
            // Ensure date strings are consistent (YYYY-MM-DD)
            const dateKey = new Date(day._id).toISOString().split('T')[0];
            activityMap[dateKey] = day.count;
        });

        // Generate each day, including today
        for (let i = 0; i <= 90; i++) { // Loop includes today
            const currentDate = new Date(startDate);
            currentDate.setDate(currentDate.getDate() + i);
            const currentDateString = currentDate.toISOString().split('T')[0];

            const count = activityMap[currentDateString] || 0;

            // Determine color intensity based on activity count
            let colorIndex = 0;
            if (count > 0) {
                colorIndex = Math.min(Math.ceil(count / 1.5), ACTIVITY_COLORS.length - 1);
            }

            days.push({
                date: currentDate,
                dateString: currentDateString, // Store the string for easier comparison
                count,
                color: ACTIVITY_COLORS[colorIndex]
            });
        }
        return days;
    };

    const renderHeatmap = () => {
        const days = generateCalendarDays();
        const todayString = new Date().toISOString().split('T')[0]; // Get today's string again for comparison

        // Group days by week for the grid (using the previous flexbox approach)
        const weeks = [];
        let currentWeek = [];
        let firstDayOffset = days[0]?.date.getDay() || 0; // 0=Sun, 6=Sat

        // Add padding for the first week
        for (let i = 0; i < firstDayOffset; i++) {
            currentWeek.push(null);
        }

        days.forEach((day) => {
            currentWeek.push(day);
            if (currentWeek.length === 7) {
                weeks.push(currentWeek);
                currentWeek = [];
            }
        });
        if (currentWeek.length > 0) {
            // Pad the last week if necessary
            while (currentWeek.length < 7) {
                currentWeek.push(null);
            }
            weeks.push(currentWeek);
        }

        return (
            <div className="heatmap-container" style={{ overflowX: 'auto' }}>
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '2px',
                    marginTop: '10px'
                }}>
                    {/* Render weeks using flexbox rows */}
                    {weeks.map((week, weekIndex) => (
                        <div key={weekIndex} style={{ display: 'flex' }}>
                            {week.map((day, dayIndex) => {
                                if (!day) {
                                    return <div key={`empty-${weekIndex}-${dayIndex}`} style={{ width: '14px', height: '14px', margin: '1px' }} />;
                                }
                                const dateStr = day.date.toDateString();
                                const isToday = day.dateString === todayString; // Compare using YYYY-MM-DD strings

                                return (
                                    <Tooltip
                                        key={`${weekIndex}-${dayIndex}`}
                                        label={`${dateStr}: ${day.count} activities`}
                                        position="top"
                                        withArrow
                                    >
                                        <div style={{
                                            width: '14px',
                                            height: '14px',
                                            backgroundColor: day.color,
                                            margin: '1px',
                                            borderRadius: '3px',
                                            border: isToday ? `1.5px solid ${theme.colors.blue[7]}` : 'none', // Thicker border for today
                                            boxSizing: 'border-box'
                                        }} />
                                    </Tooltip>
                                );
                            })}
                        </div>
                    ))}
                </div>
                {/* Legend */}
                <Group mt="sm" spacing="xs">
                    <Text size="xs">Less</Text>
                    {ACTIVITY_COLORS.map((color, i) => (
                        <div
                            key={i}
                            style={{
                                width: '10px',
                                height: '10px',
                                backgroundColor: color,
                                borderRadius: '2px'
                            }}
                        />
                    ))}
                    <Text size="xs">More</Text>
                </Group>
            </div>
        );
    };

    if (loading) {
        return (
            <Paper p="md" withBorder>
                <Title order={3} mb="md">Your Learning Stats</Title>
                <Grid>
                    <Grid.Col span={12} md={4}>
                        <Skeleton height={160} radius="md" />
                    </Grid.Col>
                    <Grid.Col span={12} md={8}>
                        <Skeleton height={160} radius="md" />
                    </Grid.Col>
                </Grid>
            </Paper>
        );
    }

    if (error) {
        return (
            <Paper p="md" withBorder>
                <Title order={3} mb="md">Your Learning Stats</Title>
                <Text color="red">{error}</Text>
            </Paper>
        );
    }

    // Get the current streak value
    const currentStreak = getCurrentStreak();

    return (
        <Paper p="md" withBorder>
            <Title order={3} mb="md">Your Learning Stats</Title>
            <Grid>
                <Grid.Col span={12} md={4}>
                    <Stack spacing="md">
                        <Paper p="md" withBorder radius="md" style={{ backgroundColor: theme.colors.blue[0] }}>
                            <Group position="apart">
                                <div>
                                    <Text size="xs" color="dimmed">CURRENT LEVEL</Text>
                                    <Title order={2} mt={4}>{xpData.level}</Title>
                                    <Group spacing="xs" mt={4}>
                                        <Text size="sm">{xpData.xp} XP total</Text>
                                        <Badge color="blue">{progressToNextLevel}/{nextLevelXp} to next level</Badge>
                                    </Group>
                                </div>
                                <RingProgress
                                    size={80}
                                    roundCaps
                                    thickness={8}
                                    sections={[{ value: (progressToNextLevel / nextLevelXp) * 100, color: theme.colors.blue[6] }]}
                                    label={
                                        <IconTrophy size={24} color={theme.colors.blue[6]} />
                                    }
                                />
                            </Group>
                            <Progress
                                value={(progressToNextLevel / nextLevelXp) * 100}
                                mt="md"
                                size="sm"
                                radius="xl"
                                color="blue"
                            />
                        </Paper>

                        <Paper p="md" withBorder radius="md" style={{ backgroundColor: theme.colors.orange[0] }}>
                            <Group position="apart">
                                <div>
                                    <Text size="xs" color="dimmed">CURRENT STREAK</Text>
                                    <Group spacing="xs" align="flex-end">
                                        <Title order={2}>{currentStreak}</Title>
                                        <Text size="sm" mb={4}>days</Text>
                                    </Group>
                                </div>
                                <ThemeIcon size={52} radius="xl" color="orange">
                                    <IconFlame size={32} />
                                </ThemeIcon>
                            </Group>
                        </Paper>
                    </Stack>
                </Grid.Col>
                <Grid.Col span={12} md={8}>
                    <Paper p="md" withBorder radius="md">
                        <Group position="apart" mb="xs">
                            <Text weight={500}>Activity Graph</Text>
                            <IconChartBar size={20} color={theme.colors.gray[5]} />
                        </Group>
                        {renderHeatmap()}
                    </Paper>
                </Grid.Col>
            </Grid>
        </Paper>
    );
};

export default UserStatsGraph;