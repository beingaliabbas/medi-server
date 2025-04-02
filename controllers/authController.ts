import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import Admin from '../models/Admin';

const JWT_SECRET = 'medishopper-secret-key'; // Still hardcoded - consider moving to config file

export const initAdminUser = async () => {
  try {
    const adminCount = await Admin.countDocuments();
    
    if (adminCount === 0) {
      const admin = new Admin({
        username: 'admin',
        password: 'admin123'
      });
      await admin.save();
      console.log('Admin user created successfully');
    }
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Error initializing admin user:', errorMessage);
  }
};

export const loginAdmin = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;
    
    if (!username || !password) {
      return res.status(400).json({ message: 'Please provide username and password' });
    }
    
    const admin = await Admin.findOne({ username });
    if (!admin) return res.status(401).json({ message: 'Invalid credentials' });
    
    const isPasswordValid = await admin.comparePassword(password);
    if (!isPasswordValid) return res.status(401).json({ message: 'Invalid credentials' });
    
    const token = jwt.sign(
      { id: admin._id, username: admin.username },
      JWT_SECRET,
      { expiresIn: '1d' }
    );
    
    res.json({
      token,
      user: { id: admin._id, username: admin.username }
    });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Server Error';
    console.error('Error during login:', errorMessage);
    res.status(500).json({ message: 'Server Error', error: errorMessage });
  }
};

export const protect = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'Not authorized, no token' });
    
    const decoded = jwt.verify(token, JWT_SECRET) as { id: string };
    const admin = await Admin.findById(decoded.id).select('-password');
    
    if (!admin) return res.status(401).json({ message: 'Not authorized, invalid token' });
    
    req.user = admin;
    next();
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Authentication failed';
    console.error('Auth error:', errorMessage);
    res.status(401).json({ message: 'Not authorized, token failed' });
  }
};