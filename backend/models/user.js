const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: { type: String, unique: true, required: true },
    email:    { type: String, unique: true, required: true },
    password: { type: String, required: true },
    honor:    { type: Number, default: 0 }, // optional: track points
    role:     { type: String, enum: ['user', 'admin'], default: 'user' }, // optional: for admins later
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);

module.exports = User;
