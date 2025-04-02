"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.protect = exports.loginAdmin = exports.initAdminUser = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const Admin_1 = __importDefault(require("../models/Admin"));
const JWT_SECRET = 'medishopper-secret-key'; // Still hardcoded - consider moving to config file
const initAdminUser = async () => {
    try {
        const adminCount = await Admin_1.default.countDocuments();
        if (adminCount === 0) {
            const admin = new Admin_1.default({
                username: 'admin',
                password: 'admin123'
            });
            await admin.save();
            console.log('Admin user created successfully');
        }
    }
    catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        console.error('Error initializing admin user:', errorMessage);
    }
};
exports.initAdminUser = initAdminUser;
const loginAdmin = async (req, res) => {
    try {
        const { username, password } = req.body;
        if (!username || !password) {
            return res.status(400).json({ message: 'Please provide username and password' });
        }
        const admin = await Admin_1.default.findOne({ username });
        if (!admin)
            return res.status(401).json({ message: 'Invalid credentials' });
        const isPasswordValid = await admin.comparePassword(password);
        if (!isPasswordValid)
            return res.status(401).json({ message: 'Invalid credentials' });
        const token = jsonwebtoken_1.default.sign({ id: admin._id, username: admin.username }, JWT_SECRET, { expiresIn: '1d' });
        res.json({
            token,
            user: { id: admin._id, username: admin.username }
        });
    }
    catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Server Error';
        console.error('Error during login:', errorMessage);
        res.status(500).json({ message: 'Server Error', error: errorMessage });
    }
};
exports.loginAdmin = loginAdmin;
const protect = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token)
            return res.status(401).json({ message: 'Not authorized, no token' });
        const decoded = jsonwebtoken_1.default.verify(token, JWT_SECRET);
        const admin = await Admin_1.default.findById(decoded.id).select('-password');
        if (!admin)
            return res.status(401).json({ message: 'Not authorized, invalid token' });
        req.user = admin;
        next();
    }
    catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Authentication failed';
        console.error('Auth error:', errorMessage);
        res.status(401).json({ message: 'Not authorized, token failed' });
    }
};
exports.protect = protect;
