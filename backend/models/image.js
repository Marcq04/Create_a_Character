const mongoose = require('mongoose');

const imageSchema = new mongoose.Schema({
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    imageUrl: { type: String, required: true },
    publicId: { type: String },
    isProfilePic: { type: Boolean, default: false },
    isBanner: { type: Boolean, default: false },
    uploadedAt: { type: Date, default: Date.now }
});

const Image = mongoose.model('Image', imageSchema);
module.exports = Image;