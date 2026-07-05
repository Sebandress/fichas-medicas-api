import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User';

const JWT_SECRET = process.env.JWT_SECRET || 'changeme';

function getAdminSecret() {
  return process.env.ADMIN_SECRET || '';
}

export async function register(req: Request, res: Response) {
  try {
    const { username, password, role, adminSecret } = req.body;
    if (!username || !password) return res.status(400).json({ error: 'username and password required' });
    const existing = await User.findOne({ username });
    if (existing) return res.status(409).json({ error: 'username exists' });

    let assignedRole = 'user';
    if (role === 'admin') {
      const ADMIN_SECRET = getAdminSecret();
      if (!adminSecret || !ADMIN_SECRET || adminSecret !== ADMIN_SECRET) {
        return res.status(403).json({ error: 'admin role requires valid admin secret' });
      }
      assignedRole = 'admin';
    }

    const hash = await bcrypt.hash(password, 10);
    const user = new User({ username, passwordHash: hash, role: assignedRole });
    await user.save();
    return res.status(201).json({ id: user._id, username: user.username, role: user.role });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
}

export async function login(req: Request, res: Response) {
  try {
    const { username, password } = req.body;
    if (!username || !password) return res.status(400).json({ error: 'username and password required' });
    const user = await User.findOne({ username });
    if (!user) return res.status(401).json({ error: 'invalid credentials' });
    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) return res.status(401).json({ error: 'invalid credentials' });
    const token = jwt.sign({ sub: user._id, username: user.username, role: user.role }, JWT_SECRET, { expiresIn: '8h' });
    return res.json({ token, role: user.role });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
}
