import 'dotenv/config';
import { connectDB } from './config/db.js';
import User from './models/User.js';

await connectDB();

const adminExists = await User.findOne({ email: 'admin@app.com' });
if (!adminExists) {
  await User.create({
    role: 'admin',
    name: 'Administrador',
    email: 'admin@app.com',
    password: 'admin123'
  });
  console.log('Admin inicial creado');
} else {
  console.log('Admin inicial ya existe');
}

const clientExists = await User.findOne({ email: 'cliente@app.com' });
if (!clientExists) {
  await User.create({
    role: 'client',
    name: 'Cliente Demo',
    email: 'cliente@app.com',
    dni: '1234567890',
    password: '123456',
    age: 32,
    amount: 75,
    recoveryAmount: 232193,
    process: 'Levantamiento OSINT, verificacion documental y validacion biometrica para expediente de seguridad forense.',
    paid: false
  });
  console.log('Cliente demo creado');
} else {
  console.log('Cliente demo ya existe');
}

console.log('Base inicial verificada');
process.exit(0);
