const mongoose = require('mongoose');

const likeSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    image: { type: mongoose.Schema.Types.ObjectId, ref: 'Image', required: true },
    createdAt: { type: Date, default: Date.now }
});

const Like = mongoose.model('Like', likeSchema);
module.exports = Like;
