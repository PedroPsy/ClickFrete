"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
require("express-async-errors");
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const routes_1 = require("./routes");
const errorMiddleware_1 = require("./middlewares/errorMiddleware");
const swagger_1 = require("./config/swagger");
const logger_1 = __importDefault(require("./utils/logger"));
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3333;
// Middlewares
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use(express_1.default.static('public'));
// Logging middleware
app.use((req, res, next) => {
    logger_1.default.info(`${req.method} ${req.path}`, {
        method: req.method,
        path: req.path,
        ip: req.ip,
    });
    next();
});
// Swagger documentation
app.use('/api/docs', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swagger_1.swaggerConfig));
// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});
// Routes
app.use(routes_1.router);
// Error handling middleware
app.use(errorMiddleware_1.errorMiddleware);
// Start server
app.listen(PORT, () => {
    logger_1.default.info(`🚀 Server running on port ${PORT}`);
    logger_1.default.info(`📚 Swagger documentation available at http://localhost:${PORT}/api/docs`);
});
exports.default = app;
