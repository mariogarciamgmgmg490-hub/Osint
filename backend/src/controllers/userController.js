import User from '../models/User.js';
import { sendDocumentEmail } from '../services/emailService.js';

export async function listUsers(req, res) {
  const users = await User.find({ role: 'client' }).sort({ createdAt: -1 });
  res.json(users.map(u => u.toSafeJSON()));
}

export async function createUser(req, res) {
  const payload = { ...req.body, role: 'client' };
  const exists = await User.findOne({ email: payload.email });
  if (exists) return res.status(409).json({ message: 'Ese correo ya existe' });
  const user = await User.create(payload);
  res.status(201).json(user.toSafeJSON());
}

export async function updateUser(req, res) {
  const user = await User.findById(req.params.id);
  if (!user || user.role !== 'client') return res.status(404).json({ message: 'Usuario no encontrado' });
  const fields = ['name', 'email', 'dni', 'age', 'amount', 'recoveryAmount', 'process', 'paid'];
  for (const field of fields) if (req.body[field] !== undefined) user[field] = req.body[field];
  if (req.body.password && String(req.body.password).trim().length >= 6) user.password = req.body.password;
  await user.save();
  res.json(user.toSafeJSON());
}

export async function togglePaid(req, res) {
  const user = await User.findById(req.params.id);
  if (!user || user.role !== 'client') return res.status(404).json({ message: 'Usuario no encontrado' });
  user.paid = !user.paid;
  await user.save();
  res.json(user.toSafeJSON());
}

export async function sendEmail(req, res) {
  const user = req.user.role === 'admin' ? await User.findById(req.params.id) : req.user;
  if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });
  await sendDocumentEmail(user);
  res.json({ message: `Documento enviado correctamente a ${user.email}` });
}
