"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.disconnectDB = exports.connectDB = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const MONGODB_URI = 'mongodb://aliabbaszounr4:Aliabbas321@cluster0-shard-00-00.ze5uw.mongodb.net:27017,cluster0-shard-00-01.ze5uw.mongodb.net:27017,cluster0-shard-00-02.ze5uw.mongodb.net:27017/medi-com?replicaSet=atlas-bdpqnp-shard-0&ssl=true&authSource=admin';
const connectDB = async () => {
    try {
        const conn = await mongoose_1.default.connect(MONGODB_URI);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
        return conn;
    }
    catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Connection error';
        console.error(`Error: ${errorMessage}`);
        throw new Error(errorMessage);
    }
};
exports.connectDB = connectDB;
const disconnectDB = async () => {
    try {
        await mongoose_1.default.disconnect();
        console.log('MongoDB Disconnected');
    }
    catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Disconnection error';
        console.error(`Error disconnecting from MongoDB: ${errorMessage}`);
        throw new Error(errorMessage);
    }
};
exports.disconnectDB = disconnectDB;
