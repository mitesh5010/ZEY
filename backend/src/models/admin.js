const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true }, // stored as plain text
  role: { type: String, default: 'admin' }
});

// Plain text check instead of bcrypt
userSchema.methods.correctPassword = async function (candidatePassword, userPassword) {
  return candidatePassword === userPassword;
};

module.exports = mongoose.model('User', userSchema);
