"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createReviewController = createReviewController;
const freight_service_1 = require("../services/freight.service");
const validators_1 = require("../validators");
async function createReviewController(req, res) {
    try {
        if (!req.user?.id) {
            return res.status(401).json({ error: 'Não autenticado' });
        }
        const validatedData = validators_1.CreateReviewSchema.parse(req.body);
        const review = await freight_service_1.FreightService.createReview(validatedData, req.user.id);
        return res.status(201).json(review);
    }
    catch (error) {
        const statusCode = error.statusCode || 400;
        return res.status(statusCode).json({ error: error.message });
    }
}
