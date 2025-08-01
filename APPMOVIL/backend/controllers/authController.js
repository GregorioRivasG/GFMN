const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs'); 
const User = require('../models/user');

exports.login = async (req, res) => {
  const { correo, password } = req.body;

  if (!correo || !password) {
    return res.status(400).json({ message: 'Correo y contraseña son requeridos' });
  }

  try {
    const user = await User.findOne({ correo });
    if (!user) {
      return res.status(400).json({ message: 'Usuario no encontrado' });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Contraseña incorrecta' });
    }
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );
    const { password: pwd, ...userData } = user.toObject();

    res.json({
      token,
      user: userData,
    });
  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
};
