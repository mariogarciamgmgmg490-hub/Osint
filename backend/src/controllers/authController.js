import jwt from 'jsonwebtoken';
import User from '../models/User.js';

/**
 * Genera un token JWT para el usuario.
 */
function sign(user) {
  return jwt.sign(
    { id: user._id, role: user.role }, 
    process.env.JWT_SECRET, 
    { expiresIn: '7d' }
  );
}

/**
 * Maneja el inicio de sesión con soporte para bcrypt y texto plano.
 */
export async function login(req, res) {
  try {
    const { email, password } = req.body;
    
    console.log('Intento de login con email:', email);

    // 1. Buscar al usuario por email
    const user = await User.findOne({ 
      email: String(email || '').toLowerCase().trim() 
    });

    if (!user) {
      console.log('Usuario no encontrado');
      return res.status(401).json({ message: 'Correo o contraseña incorrectos' });
    }

    // 2. Determinar si la contraseña en DB es un hash de Bcrypt
    // Bcrypt suele empezar con $2a$, $2b$ o $2y$
    const isBcryptHash = user.password.startsWith('$2') && user.password.length > 30;

    let isMatch = false;

    if (isBcryptHash) {
      // Comparación segura con Bcrypt
      isMatch = await user.comparePassword(password);
    } else {
      // Comparación directa (texto plano)
      isMatch = (user.password === password);
    }

    if (!isMatch) {
      console.log('Password no coincide');
      return res.status(401).json({ message: 'Correo o contraseña incorrectos' });
    }

    // 3. MIGRACIÓN AUTOMÁTICA (Opcional pero recomendado)
    // Si entró con texto plano, actualizamos a Bcrypt ahora mismo
    if (!isBcryptHash) {
      user.password = password; // El pre-save de User.js lo encriptará
      await user.save();
      console.log(`Seguridad: Contraseña de ${user.email} migrada a Bcrypt.`);
    }

    console.log('Login exitoso para:', user.email);

    // 4. Enviar respuesta
    res.json({ 
      token: sign(user), 
      user: user.toSafeJSON() 
    });

  } catch (error) {
    console.error('Error en el proceso de login:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
}

/**
 * Retorna los datos del usuario autenticado (extraídos del middleware de auth).
 */
export async function me(req, res) {
  try {
    if (!req.user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }
    res.json({ user: req.user.toSafeJSON() });
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener datos del usuario' });
  }
}