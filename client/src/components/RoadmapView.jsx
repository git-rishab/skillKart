import React, { useState, useEffect } from 'react';
import {
    Box,
    Text,
    Paper,
    Group,
    Checkbox,
    Badge,
    Collapse,
    ActionIcon,
    Tooltip,
    Progress,
    ThemeIcon,
    Divider,
    Stack,
    Button,
    Popover
} from '@mantine/core';
import {
    IconChevronDown,
    IconChevronRight,
    IconBook,
    IconVideo,
    IconArticle,
    IconChecklist,
    IconMessageCircle,
    IconBulb,
    IconBrandYoutube,
    IconNotebook,
    IconCheck,
    IconLock,
    IconExternalLink
} from '@tabler/icons-react';

// Resource type icon mapping
const resourceIcons = {
    video: <IconBrandYoutube size={16} />,
    article: <IconArticle size={16} />,
    quiz: <IconChecklist size={16} />,
    notebook: <IconNotebook size={16} />
};

// Resource type color mapping
const resourceColors = {
    video: 'red',
    article: 'blue',
    quiz: 'green',
    notebook: 'violet'
};

// SubTopic component to render individual topics within a week
const SubTopic = ({ topic, index, weekProgress, onChange, weekNumber, isLocked }) => {
    const [checked, setChecked] = useState(topic.completed);

    useEffect(() => {
        setChecked(topic.completed);
    }, [topic.completed]);

    const handleCheck = (e) => {
        if (isLocked) return;

        setChecked(e.currentTarget.checked);
        onChange(weekNumber, index, e.currentTarget.checked);
    };

    return (
        <Paper
            radius="md"
            p="sm"
            mb="xs"
            className={`border-l-2 transition-all ${checked ? 'border-green-500 bg-green-50' : isLocked ? 'border-gray-300 bg-gray-50 opacity-70' : 'border-blue-300 hover:border-blue-500'
                }`}
        >
            <Group position="apart" noWrap>
                <Group noWrap className="flex-grow">
                    <Checkbox
                        checked={checked}
                        onChange={handleCheck}
                        disabled={isLocked}
                        color="green"
                        radius="xl"
                        size="md"
                    />
                    <Box className="flex-grow">
                        <Text size="sm" fw={500} className={checked ? 'line-through text-gray-500' : ''}>
                            {topic.title}
                            {topic.isKey && (
                                <Badge size="xs" color="yellow" className="ml-2">Key concept</Badge>
                            )}
                        </Text>
                        {topic.description && (
                            <Text size="xs" color="dimmed" className="ml-1 mt-1">
                                {topic.description}
                            </Text>
                        )}
                    </Box>
                </Group>

                {isLocked ? (
                    <ThemeIcon color="gray" variant="light" size="sm">
                        <IconLock size={14} />
                    </ThemeIcon>
                ) : (
                    <Popover width={200} position="bottom-end" shadow="md" withinPortal>
                        <Popover.Target>
                            <ActionIcon color="blue" variant="subtle">
                                <IconBulb size={16} />
                            </ActionIcon>
                        </Popover.Target>
                        <Popover.Dropdown>
                            <Text size="xs" weight={500}>Resources</Text>
                            {topic.resources && topic.resources.length > 0 ? (
                                <div className="space-y-2 mt-1">
                                    {topic.resources.map((resource, idx) => (
                                        <Group key={idx} position="apart" spacing="xs" className="border-l-2 pl-2" style={{ borderColor: `var(--mantine-color-${resourceColors[resource.type]}-6)` }}>
                                            <Group spacing={6}>
                                                <ThemeIcon color={resourceColors[resource.type]} size="xs" variant="light">
                                                    {resourceIcons[resource.type]}
                                                </ThemeIcon>
                                                <Text size="xs">{resource.title}</Text>
                                            </Group>
                                            <ActionIcon size="xs" color="blue" variant="subtle" component="a" href={resource.url} target="_blank">
                                                <IconExternalLink size={12} />
                                            </ActionIcon>
                                        </Group>
                                    ))}
                                </div>
                            ) : (
                                <Text size="xs" color="dimmed" mt={4}>No resources available</Text>
                            )}
                        </Popover.Dropdown>
                    </Popover>
                )}
            </Group>
        </Paper>
    );
};

// WeekSection component to render a week's worth of content
const WeekSection = ({ week, updateProgress, isLocked = false }) => {
    const [expanded, setExpanded] = useState(false);
    const completedCount = week.topics.filter(topic => topic.completed).length;
    const progressPercentage = (completedCount / week.topics.length) * 100;

    const handleTopicChange = (weekNumber, topicIndex, isCompleted) => {
        updateProgress(weekNumber, topicIndex, isCompleted);
    };

    return (
        <Paper
            shadow="sm"
            radius="md"
            withBorder
            className={`mb-6 overflow-hidden ${isLocked ? 'opacity-70' : ''}`}
        >
            {/* Week header */}
            <Box
                className={`p-4 border-b ${progressPercentage === 100
                    ? 'bg-green-50 border-green-200'
                    : progressPercentage > 0
                        ? 'bg-blue-50 border-blue-100'
                        : isLocked
                            ? 'bg-gray-50 border-gray-200'
                            : 'bg-white border-gray-200'
                    }`}
            >
                <Group position="apart">
                    <Group>
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${progressPercentage === 100
                            ? 'bg-green-500 text-white'
                            : progressPercentage > 0
                                ? 'bg-blue-500 text-white'
                                : isLocked
                                    ? 'bg-gray-300 text-gray-600'
                                    : 'bg-indigo-500 text-white'
                            }`}>
                            {isLocked ? <IconLock size={18} /> : week.weekNumber}
                        </div>
                        <div>
                            <Group spacing={8}>
                                <Text fw={600} size="lg">Week {week.weekNumber}</Text>
                                {isLocked && (
                                    <Badge color="gray">Locked</Badge>
                                )}
                                {!isLocked && progressPercentage === 100 && (
                                    <Badge color="green" leftSection={<IconCheck size={14} />}>Completed</Badge>
                                )}
                                {!isLocked && progressPercentage > 0 && progressPercentage < 100 && (
                                    <Badge color="blue">In Progress</Badge>
                                )}
                            </Group>
                            <Text size="sm" color="dimmed">{week.title}</Text>
                        </div>
                    </Group>

                    <Group spacing={16}>
                        {!isLocked && (
                            <Group spacing={6}>
                                <Text size="sm" color="dimmed">{completedCount}/{week.topics.length}</Text>
                                <Text size="sm" color="dimmed">topics</Text>
                            </Group>
                        )}
                        <ActionIcon
                            onClick={() => setExpanded(!expanded)}
                            variant="subtle"
                            className="transition-transform"
                            style={{ transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)' }}
                        >
                            <IconChevronDown size={18} />
                        </ActionIcon>
                    </Group>
                </Group>

                {!isLocked && (
                    <Progress
                        value={progressPercentage}
                        color={progressPercentage === 100 ? 'green' : 'blue'}
                        size="sm"
                        mt="md"
                        radius="xl"
                    />
                )}
            </Box>

            {/* Week content (collapsible) */}
            <Collapse in={expanded}>
                <Box p="md" className={isLocked ? 'opacity-75' : ''}>
                    {/* Week description */}
                    {week.description && (
                        <Text size="sm" mb="md">
                            {week.description}
                        </Text>
                    )}

                    {/* Topics list */}
                    <Box mt={16}>
                        <Group position="apart" mb={8}>
                            <Text size="sm" fw={600}>
                                Topics to master:
                            </Text>
                            {!isLocked && (
                                <Text size="xs" color={progressPercentage === 100 ? 'green' : 'blue'}>
                                    {progressPercentage}% complete
                                </Text>
                            )}
                        </Group>

                        {week.topics.map((topic, index) => (
                            <SubTopic
                                key={index}
                                topic={topic}
                                index={index}
                                weekProgress={progressPercentage}
                                onChange={handleTopicChange}
                                weekNumber={week.weekNumber}
                                isLocked={isLocked}
                            />
                        ))}
                    </Box>

                    {/* Week resources and actions */}
                    {!isLocked && (
                        <>
                            <Divider my="sm" />
                            <Group position="apart">
                                <Button
                                    variant="light"
                                    size="sm"
                                    leftIcon={<IconMessageCircle size={16} />}
                                    color="blue"
                                >
                                    Join Discussion
                                </Button>

                                <Button
                                    variant={progressPercentage === 100 ? "filled" : "outline"}
                                    size="sm"
                                    color={progressPercentage === 100 ? "green" : "blue"}
                                    leftIcon={progressPercentage === 100 ? <IconCheck size={16} /> : null}
                                    disabled={isLocked}
                                >
                                    {progressPercentage === 100 ? "Completed" : "Mark All Complete"}
                                </Button>
                            </Group>
                        </>
                    )}
                </Box>
            </Collapse>
        </Paper>
    );
};

// Main RoadmapView component
const RoadmapView = ({ roadmapData, onProgressUpdate }) => {
    const [roadmap, setRoadmap] = useState(roadmapData);

    const handleProgressUpdate = (weekNumber, topicIndex, isCompleted) => {
        const updatedRoadmap = { ...roadmap };
        const weekIdx = updatedRoadmap.weeks.findIndex(w => w.weekNumber === weekNumber);

        if (weekIdx !== -1) {
            updatedRoadmap.weeks[weekIdx].topics[topicIndex].completed = isCompleted;
            setRoadmap(updatedRoadmap);

            // Calculate new progress stats
            const totalTopics = updatedRoadmap.weeks.reduce((sum, week) => sum + week.topics.length, 0);
            const completedTopics = updatedRoadmap.weeks.reduce((sum, week) => {
                return sum + week.topics.filter(topic => topic.completed).length;
            }, 0);

            // Call parent callback if provided
            if (onProgressUpdate) {
                onProgressUpdate({
                    completedTopics,
                    totalTopics,
                    percentage: Math.round((completedTopics / totalTopics) * 100)
                });
            }
        }
    };

    // Determine if a week should be locked based on previous week completion
    const isWeekLocked = (week) => {
        // First week is always unlocked
        if (week.weekNumber === 1) return false;

        // For subsequent weeks, check if previous week has required progress
        const prevWeek = roadmap.weeks.find(w => w.weekNumber === week.weekNumber - 1);
        if (!prevWeek) return false;

        // Check if the previous week has at least 80% completion
        const prevCompleted = prevWeek.topics.filter(t => t.completed).length;
        const requiredCompletion = Math.ceil(prevWeek.topics.length * 0.8);

        return prevCompleted < requiredCompletion;
    };

    return (
        <div className="interactive-roadmap">
            <Paper p="md" radius="md" withBorder mb={24} className="bg-gradient-to-r from-indigo-50 to-blue-50">
                <Group position="apart">
                    <div>
                        <Text size="xl" fw={700} className="text-indigo-700">{roadmap.title}</Text>
                        <Text size="sm" color="dimmed">{roadmap.description}</Text>
                    </div>
                    <Badge size="lg" color="indigo">
                        {roadmap.difficulty}
                    </Badge>
                </Group>
            </Paper>

            <div className="roadmap-timeline">
                {roadmap.weeks.map((week) => (
                    <WeekSection
                        key={week.weekNumber}
                        week={week}
                        updateProgress={handleProgressUpdate}
                        isLocked={isWeekLocked(week)}
                    />
                ))}
            </div>
        </div>
    );
};

export default RoadmapView;