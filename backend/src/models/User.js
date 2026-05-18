import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  role: { 
    type: String, 
    enum: ['admin', 'client'], 
    default: 'client' 
  },
  name: { 
    type: String, 
    required: true, 
    trim: true 
  },
  email: { 
    type: String, 
    required: true, 
    unique: true, 
    lowercase: true, 
    trim: true 
  },
  dni: { 
    type: String, 
    trim: true, 
    default: '' 
  },
  password: { 
    type: String, 
    required: true, 
    minlength: 4 
  },
  age: { 
    type: Number, 
    default: 0 
  },
  amount: { 
    type: Number, 
    default: 0 
  },
  recoveryAmount: { 
    type: Number, 
    default: 0 
  },
  process: { 
    type: String, 
    default: '' 
  },
  paid: { 
    type: Boolean, 
    default: false 
  }
}, { timestamps: true });

/**
 * Middleware Pre-save: Encripta la contraseña antes de guardar.
 * Se eliminó el parámetro 'next' para evitar el error "TypeError: next is not a function"
 * al usar funciones asíncronas en versiones modernas de Mongoose.
 */
userSchema.pre('save', async function() {
  if (!this.isModified('password')) return;

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  } catch (error) {
    throw new Error('Error al encriptar la contraseña: ' + error.message);
  }
});

/**
 * Método para comparar contraseñas durante el login.
 */
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

/**
 * Método para limpiar el objeto de usuario antes de enviarlo al frontend.
 * Elimina la contraseña por seguridad.
 */
userSchema.methods.toSafeJSON = function() {
  const userObject = this.toObject();
  delete userObject.password;
  return userObject;
};

const User = mongoose.model('User', userSchema);
export default User;