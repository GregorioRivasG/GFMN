const bcrypt = require('bcryptjs');
const User = require('../models/user');
exports.createUser = async (req, res) => {
  try {
    const { password, ...rest } = req.body;

    if (!password) {
      return res.status(400).json({ error: 'La contraseña es obligatoria' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = new User({
      ...rest,
      password: hashedPassword
    });

    await user.save();
    const userWithoutPassword = user.toObject();
    delete userWithoutPassword.password;

    res.status(201).json(userWithoutPassword);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
exports.updateUser = async (req, res) => {
  try {
    if (req.body.password) {
      const salt = await bcrypt.genSalt(10);
      req.body.password = await bcrypt.hash(req.body.password, salt);
    }

    const updated = await User.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!updated) return res.status(404).json({ message: 'Usuario no encontrado' });

    const userWithoutPassword = updated.toObject();
    delete userWithoutPassword.password;

    res.json(userWithoutPassword);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
exports.deleteUser = async (req, res) => {
  try {
    const deleted = await User.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Usuario no encontrado' });
    res.json({ message: 'Usuario eliminado' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
