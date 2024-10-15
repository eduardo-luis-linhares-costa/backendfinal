import express from 'express';
import { registerUser, loginUser } from '../services/authService';
import User from '../models/User';
import { authenticateJWT } from '../middleware/authMiddleware';

const router = express.Router();

router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const user = await registerUser(name, email, password);
    res.status(201).json(user);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const token = await loginUser(email, password);
    res.status(200).json({ token });
  } catch (error: any) {
    res.status(401).json({ error: error.message });
  }
});

// @ts-ignore
router.get('/users', authenticateJWT, async (req, res) => {
  try {
    // @ts-ignore
    const users = await User.find();
    res.status(200).json(users);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// @ts-ignore
router.put('/users/:id', authenticateJWT, async (req, res) => {
  const userId = req.params.id;
  const { name, email, role } = req.body;
  try {
    // @ts-ignore
    const updatedUser = await User.findByIdAndUpdate(userId, { name, email, role }, { new: true }); // Atualiza o usuário
    res.status(200).json(updatedUser);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

// @ts-ignore
router.delete('/users/:id', authenticateJWT, async (req, res) => {
  const userId = req.params.id;
  try {
    // @ts-ignore
    await User.findByIdAndDelete(userId);
    res.status(204).json({ message: 'Usuário deletado com sucesso.' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
