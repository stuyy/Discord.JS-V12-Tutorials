const mongoose = require('mongoose');
const MessageSchema = new mongoose.Schema({
    messageId: { type: String, required: true },
    emojiRoleMappings: { type: mongoose.Schema.Types.Mixed }
});

const MessageModel = module.exports = mongoose.model('message', MessageSchema);