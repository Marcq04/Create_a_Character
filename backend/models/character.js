const mongoose = require('mongoose');

const characterSchema = new mongoose.Schema({
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // link to user
    name: { type: String, required: true },
    nickname: { type: String },
    age: { type: Number },
    gender: { type: String },
    origin: { type: String },
    background: { type: String },
    goal: { type: String },
    weakness: { type: String },
    personality: { type: String },
    powers: { type: [String] }, // array of powers
    skills: { type: [String] }, // array of skills
    appearance: { type: String },
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now }
});

const Character = mongoose.model('Character', characterSchema);

module.exports = Character;
