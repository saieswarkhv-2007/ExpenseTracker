const UserActivity = require("../models/UserActivity");

exports.getActivities = async (req, res) => {
    try {
        const activities = await UserActivity.find();
        res.status(200).json(activities);
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

exports.addActivity = async (req, res) => {
    try {
        const activity = await UserActivity.create(req.body);

        res.status(201).json(activity);
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

exports.deleteActivity = async (req, res) => {
    try {
        await UserActivity.findByIdAndDelete(req.params.id);

        res.json({
            message: "Activity Deleted"
        });
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};