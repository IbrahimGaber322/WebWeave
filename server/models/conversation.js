import mongoose from "mongoose";

const conversationSchema = mongoose.Schema({
    // Array of exactly 2 participant emails (sorted alphabetically for consistency)
    participants: {
        type: [String],
        required: true,
        validate: {
            validator: function(arr) {
                return arr.length === 2;
            },
            message: 'Conversation must have exactly 2 participants'
        }
    },
    // Last message preview for conversation list
    lastMessage: {
        content: { type: String, default: '' },
        sender: { type: String, default: '' },
        timestamp: { type: Date, default: Date.now }
    },
    // Unread counts per participant: [{ email: "user@email.com", count: 5 }, ...]
    unreadCounts: {
        type: [{
            email: { type: String, required: true },
            count: { type: Number, default: 0 }
        }],
        default: []
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

// Index for fast lookup by participants
conversationSchema.index({ participants: 1 });
conversationSchema.index({ updatedAt: -1 });

const Conversation = mongoose.model('Conversation', conversationSchema);

export default Conversation;
