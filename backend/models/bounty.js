const mongoose = require('mongoose');

const bountySchema = new mongoose.Schema({
    character:    { type: mongoose.Schema.Types.ObjectId, ref: 'Character', required: true },
    client:       { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    description:  { type: String },
    deadline:     { type: Date, required: true },
    aiAllowed:    { type: Boolean, default: false },
    isCompleted:  { type: Boolean, default: false },
    winner:       { type: mongoose.Schema.Types.ObjectId, ref: 'Submission' }, // optional
    created_at:   { type: Date, default: Date.now },
    updated_at:   { type: Date, default: Date.now }
});

const Bounty = mongoose.model('Bounty', bountySchema);
module.exports = Bounty;
