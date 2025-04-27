import mongoose from "mongoose"

const MessageSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    usermessage:{
        type: String,
        required: true
    },
    botmessage:{
        type: String,
        required: true
    }
}, {timestamps: true});

export const Message = mongoose.model('Chat', MessageSchema)