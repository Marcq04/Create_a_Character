const mongoose = require('mongoose');

const submissionSchema = new mongoose.Schema({
    bounty:     { type: mongoose.Schema.Types.ObjectId, ref: 'Bounty', required: true },
    artist:     { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    imageUrl:   { type: String, required: true }, // store link to image (e.g., S3, Cloudinary)
    isWinner:   { type: Boolean, default: false },
    submittedAt: { type: Date, default: Date.now }
});

const Submission = mongoose.model('Submission', submissionSchema);

module.exports = Submission;
