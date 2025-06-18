const mongoose = require('mongoose');

const imageSchema = new mongoose.Schema({
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    publicId: { type: String, required: true },
    imageUrl: { type: String, required: true }
});

const Image = mongoose.model('Image', imageSchema);
module.exports = Image;