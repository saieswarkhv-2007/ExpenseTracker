const ExpenseEmbedding =
require("../models/ExpenseEmbedding");

exports.getEmbeddings =
async (req, res) => {
    try {
        const embeddings =
        await ExpenseEmbedding.find();

        res.json(embeddings);
    }
    catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

exports.addEmbedding =
async (req, res) => {
    try {
        const embedding =
        await ExpenseEmbedding.create(req.body);

        res.status(201).json(embedding);
    }
    catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

exports.deleteEmbedding =
async (req, res) => {
    try {
        await ExpenseEmbedding.findByIdAndDelete(
            req.params.id
        );

        res.json({
            message: "Embedding Deleted"
        });
    }
    catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};