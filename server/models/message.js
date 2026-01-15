import mongoose from "mongoose";

const messageSchema = mongoose.Schema({
    conversationId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Conversation',
        required: true,
        index: true
    },
    sender: {
        type: String,  // email
        required: true
    },
    content: {
        type: String,
        required: true,
        maxlength: 2000
    },
    // Read status - emails of users who have read
    readBy: {
        type: [String],
        default: []
    },
    createdAt: {
        type: Date,
        default: Date.now,
        index: true
    }
});

// Compound index for efficient pagination queries
messageSchema.index({ conversationId: 1, createdAt: -1 });

const Message = mongoose.model('Message', messageSchema);

export default Message;
