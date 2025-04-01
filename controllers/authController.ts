
import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import Admin from '../models/Admin';

const JWT_SECRET = 'medishopper-secret-key'; // In production, use environment variable

// Initialize admin user
export const initAdminUser = async () => {
  try {
    const adminCount = await Admin.countDocuments();
    
    if (adminCount === 0) {
      const admin = new Admin({
        username: 'admin',
        password: 'admin123' // Will be hashed by pre-save hook
      });
      
      await admin.save();
      console.log('Admin user created successfully');
    }
  } catch (error) {
    console.error('Error initializing admin user:', error);
  }
};

// Admin login
export const loginAdmin = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;
    
    // Validation
    if (!username || !password) {
      return res.status(400).json({ message: 'Please provide username and password' });
    }
    
    // Find admin by username
    const admin = await Admin.findOne({ username });
    
    if (!admin) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    // Compare password
    const isPasswordValid = await admin.comparePassword(password);
    
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    // Generate JWT token
    const token = jwt.sign(
      { id: admin._id, username: admin.username },
      JWT_SECRET,
      { expiresIn: '1d' }
    );
    
    res.json({
      token,
      user: {
        id: admin._id,
        username: admin.username
      }
    });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// Verify JWT middleware
export const protect = async (req: Request, res: Response, next: Function) => {
  try {
    let token;
    
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }
    
    if (!token) {
      return res.status(401).json({ message: 'Not authorized, no token' });
    }
    
    // Verify token
    const decoded = jwt.verify(token, JWT_SECRET) as { id: string };
    
    // Get admin user
    const admin = await Admin.findById(decoded.id).select('-password');
    
    if (!admin) {
      return res.status(401).json({ message: 'Not authorized, invalid token' });
    }
    
    req.user = admin;
    next();
  } catch (error) {
    console.error('Auth error:', error);
    res.status(401).json({ message: 'Not authorized, token failed' });
  }
};
