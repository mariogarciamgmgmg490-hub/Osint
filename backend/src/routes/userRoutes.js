import { Router } from 'express';
import { auth, adminOnly } from '../middleware/auth.js';
import { createUser, listUsers, sendEmail, togglePaid, updateUser } from '../controllers/userController.js';

const router = Router();
router.get('/', auth, adminOnly, listUsers);
router.post('/', auth, adminOnly, createUser);
router.put('/:id', auth, adminOnly, updateUser);
router.patch('/:id/toggle-paid', auth, adminOnly, togglePaid);
router.post('/:id/send-email', auth, sendEmail);
export default router;
