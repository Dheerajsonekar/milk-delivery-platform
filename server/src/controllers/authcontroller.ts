
import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { JwtPayload} from 'jsonwebtoken';
import User from '../models/User';

interface CustomJwtPayload extends JwtPayload {
  id: string
  role: string
}


export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password, role, address, phone, secretCode } = req.body;

    if (role === 'admin') {
      if (secretCode !== process.env.ADMIN_SECRET) {
        return res.status(403).json({ message: 'Invalid admin secret code' })
      }
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'User already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ name, email, password: hashedPassword, role, address, phone });
    await newUser.save();

    return res.status(201).json({ message: 'User registered successfully' });
  } catch (err: any) {
    return res.status(500).json({ message: 'Registration failed', error: err.message });
  }
};



export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    if (!process.env.JWT_SECRET) {
      throw new Error('JWT_SECRET is not defined');
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Updated cookie settings for production
    res.cookie('token', token, {
      httpOnly: true,
      secure: true, // Always true for production HTTPS
      sameSite: 'none', // Required for cross-origin cookies
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      domain: undefined // Don't set domain for cross-origin
    });

    console.log(' Cookie set for production:', token ? 'Token exists' : 'No token');

    //  Send user info only (no token in body)
    return res.status(200).json({ user });

  } catch (err: any) {
    console.error('Login error:', err);
    return res.status(500).json({ message: 'Login failed', error: err.message || err });
  }
};


export const logout = (req: Request, res: Response) => {
  try {
    
    res.clearCookie('token', {
      httpOnly: true,
      secure: true, // Match the secure setting from login
      sameSite: 'none', // Match the sameSite setting from login
      domain: undefined, // Match the domain setting from login
      path: '/' // Explicitly set path to ensure proper clearing
    });

    console.log(' Cookie cleared successfully');
    
    return res.status(200).json({ 
      message: 'Logged out successfully',
      success: true 
    });
  } catch (error) {
    console.error('Logout error:', error);
    return res.status(500).json({ 
      message: 'Logout failed', 
      error: error instanceof Error ? error.message : 'Unknown error' 
    });
  }
};


export const checkAuth = (req: Request, res: Response) => {
  const token = req.cookies?.token
  if (!token) return res.json({ authenticated: false, message: "no token found" })

  // Check if JWT_SECRET exists
  const jwtSecret = process.env.JWT_SECRET
  if (!jwtSecret) {
    console.error('JWT_SECRET is not defined in environment variables')
    return res.status(500).json({ authenticated: false, message: "Server configuration error" })
  }

  try {
    // Verify and properly type the decoded token
    const decoded = jwt.verify(token, jwtSecret) as CustomJwtPayload
    
    // Additional validation to ensure required fields exist
    if (!decoded.id || !decoded.role) {
      return res.json({ authenticated: false, message: "Invalid token payload" })
    }

    return res.json({
      authenticated: true,
      role: decoded.role, 
      user: decoded,       
    })
  } catch (error) {
    console.error('JWT verification failed:', error)
    return res.json({ authenticated: false, message: "Invalid token" })
  }
}


export const getProfile = async (req: Request, res: Response) => {
  try {

    if (!req.user) {
      return res.status(401).json({ message: 'User not authenticated' })
    }

    const user = await User.findById(req.user.id).select('-password')
    if (!user) return res.status(404).json({ message: 'User not found' })
    res.json(user)
  } catch (err: any) {
    res.status(500).json({ message: 'Failed to fetch profile', error: err.message })
  }
}
