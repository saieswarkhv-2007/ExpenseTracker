const express = require("express");

const router = express.Router();

const activityController =
require("../controllers/activityController");

router.get(
    "/",
    activityController.getActivities
);

router.post(
    "/",
    activityController.addActivity
);

router.delete(
    "/:id",
    activityController.deleteActivity
);

module.exports = router;