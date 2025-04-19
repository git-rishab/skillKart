const mongoose = require("mongoose");
const RoadmapTemplate = require("../RoadmapTemplate.model");
const config = require("../../config/default");

mongoose.connect(config.mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const patchMissingTopicIds = async () => {
    try {
        const roadmaps = await RoadmapTemplate.find();

        for (const roadmap of roadmaps) {
            let isModified = false;

            roadmap.modules.forEach((module) => {
                module.topics.forEach((topic) => {
                    // if (!topic._id) {
                    topic._id = new mongoose.Types.ObjectId(); // or use uuidv4() if you prefer string ids
                    isModified = true;
                    // }
                });
            });

            if (isModified) {
                await roadmap.save();
                console.log(`Updated roadmap: ${roadmap._id}`);
            }
        }

        console.log("✅ All missing topic IDs have been patched.");
        process.exit(0);
    } catch (err) {
        console.error("Error updating topics:", err);
        process.exit(1);
    }
};

patchMissingTopicIds();
