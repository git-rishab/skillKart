module.exports = [
    {
        name: "Trailblazer",
        condition: (user) => user.activeRoadmaps.length > 0
    },
    {
        name: "Week One Warrior",
        condition: (user) =>
            user.activeRoadmaps.some(r => r.currentWeek >= 1 && r.progress.some(p => p.status === "Completed"))
    },
    {
        name: "Mastermind",
        condition: (user) =>
            user.activeRoadmaps.some(r =>
                r.progress.every(p => p.status === "Completed")
            )
    },
    {
        name: "Knowledge Ninja",
        condition: (user) => {
            let completedCount = 0;
            user.activeRoadmaps.forEach(r => {
                r.progress.forEach(p => {
                    if (p.status === "Completed") completedCount++;
                });
            });
            return completedCount >= 10;
        }
    },
    {
        name: "Skill Samurai",
        condition: (user) => user.xp >= 500
    },
    {
        name: "Badge Collector",
        condition: (user) => user.badges.length >= 5
    }
];
