"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const morgan_1 = __importDefault(require("morgan"));
const db_1 = require("./utils/db");
const orderRoutes_1 = __importDefault(require("./routes/orderRoutes"));
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
// Initialize express app
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5000;
// Middleware
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use((0, morgan_1.default)('dev'));
// Routes
app.use('/api/orders', orderRoutes_1.default);
app.use('/api/auth', authRoutes_1.default);
// Root route
app.get('/', (req, res) => {
    res.send('API is running');
});
// Connect to MongoDB and start server
(0, db_1.connectDB)()
    .then(() => {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
})
    .catch((error) => {
    console.error('Failed to connect to MongoDB', error);
    process.exit(1);
});
