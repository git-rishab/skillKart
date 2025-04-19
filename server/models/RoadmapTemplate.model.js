const mongoose = require("mongoose");

const ResourceSchema = new mongoose.Schema(
    {
        type: {
            type: String, enum: ["video", "blog", "quiz"],
            required: true
        },
        title: { type: String, required: true },
        url: { type: String, required: true },
    },
);

const TopicSchema = new mongoose.Schema(
    {
        title: { type: String, required: true },
        description: String,
        estimatedTime: { type: Number, default: 1 }, // in hours
        resources: [ResourceSchema],
    },
);

const ModuleSchema = new mongoose.Schema(
    {
        weekNumber: { type: Number, required: true },
        topics: [TopicSchema],
    },
);

const RoadmapTemplateSchema = new mongoose.Schema(
    {
        title: { type: String, required: true }, // e.g., "UI/UX Design"
        interest: { type: String, required: true }, // tag for filtering
        goalTags: [String], // e.g., ['job', 'certification']
        estimatedWeeks: Number, // optional
        createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // admin/curator
        modules: [ModuleSchema],
    },
    { timestamps: true }
);

module.exports = mongoose.model("RoadmapTemplate", RoadmapTemplateSchema);
