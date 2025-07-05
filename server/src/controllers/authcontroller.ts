
import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/User';



export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password, role, address, secretCode } = req.body;

    if (role === 'admin') {
      if (secretCode !== process.env.ADMIN_SECRET) {
        return res.status(403).json({ message: 'Invalid admin secret code' })
      }
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'User already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ name, email, password: hashedPassword, role, address });
    await newUser.save();

    return res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    return res.status(500).json({ message: 'Registration failed', error: err });
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

    // ✅ Set cookie with token
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // set true in prod
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    // ✅ Send user info only (no token in body)
    return res.status(200).json({ user });

  } catch (err: any) {
    console.error('Login error:', err);
    return res.status(500).json({ message: 'Login failed', error: err.message || err });
  }
};


export const logout = (req: Request, res: Response) => {
  // For stateless JWT auth, logout is handled on the client side by removing the token
  res.clearCookie('token');
  return res.status(200).json({ message: 'Logged out successfully' });
};


export const checkAuth = (req: Request, res: Response) => {
  const token = req.cookies?.token
  if (!token) return res.json({ authenticated: false , message:"no token found"})

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    return res.json({ authenticated: true, user: decoded })
  } catch {
    return res.json({ authenticated: false })
  }
}
