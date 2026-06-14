const express = require("express");

const router = express.Router();

const embeddingController =
require("../controllers/embeddingController");

router.get(
    "/",
    embeddingController.getEmbeddings
);

router.post(
    "/",
    embeddingController.addEmbedding
);

router.delete(
    "/:id",
    embeddingController.deleteEmbedding
);

module.exports = router;