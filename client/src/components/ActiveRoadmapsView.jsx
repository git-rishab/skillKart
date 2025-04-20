import React from 'react';
import { Card, Text, Group, Badge, Button, Title, Grid } from '@mantine/core';
import { IconCalendar, IconChevronRight } from '@tabler/icons-react';

/**
 * ActiveRoadmapsView Component
 * 
 * Displays a list of user's active roadmaps with their details
 * Each roadmap is clickable to view its interactive roadmap
 * 
 * @param {Object} props
 * @param {Array} props.roadmaps - Array of user's active roadmaps
 * @param {Function} props.onRoadmapSelect - Function to handle roadmap selection
 */
export const ActiveRoadmapsView = ({ roadmaps, onRoadmapSelect }) => {
    if (!roadmaps || roadmaps.length === 0) {
        return (
            <Card p="lg" radius="md" withBorder>
                <Text align="center" size="lg" weight={500} color="dimmed">
                    You don't have any active roadmaps yet.
                </Text>
            </Card>
        );
    }

    return (
        <div>
            <Title order={3} mb="md">Your Active Roadmaps</Title>

            <Grid>
                {roadmaps.map((roadmap, index) => (
                    <Grid.Col key={roadmap._id || index} span={12}>
                        <Card
                            p="lg"
                            radius="md"
                            withBorder
                            mb="md"
                            sx={(theme) => ({
                                cursor: 'pointer',
                                transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                                '&:hover': {
                                    transform: 'translateY(-3px)',
                                    boxShadow: theme.shadows.md,
                                }
                            })}
                            onClick={() => onRoadmapSelect(roadmap)}
                        >
                            <Group position="apart">
                                <Text weight={700} size="lg">{roadmap.roadmapId.title}</Text>
                                <Badge size="lg" color={roadmap.category ? "blue" : "gray"}>
                                    {roadmap.roadmapId.interest || "General"}
                                </Badge>
                            </Group>

                            <Text color="dimmed" size="sm" mt="sm">
                                {roadmap.roadmapId.description || "Personalized learning path to help you master this subject"}
                            </Text>

                            <Group position="apart" mt="md">
                                <Group spacing="xs">
                                    <IconCalendar size={16} />
                                    <Text size="sm" color="dimmed">
                                        {roadmap.roadmapId.estimatedWeeks || roadmap.weeks?.length || "4-6"} weeks
                                    </Text>
                                </Group>

                                <Button variant="light">
                                    View Roadmap
                                </Button>
                            </Group>
                        </Card>
                    </Grid.Col>
                ))}
            </Grid>
        </div>
    );
};

export default ActiveRoadmapsView;