import mongoose from "mongoose";

const SentimentSchema = new mongoose.Schema({
    messageId:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'Message',
        required: true
    },
    sentimentLabel:{
        type: String,
        enum: ['Positive', 'Negative', 'Neutral'],
        required: true
    },
    score:{
        type: Number,
        required: true
    }

},{timestamps: true})

export const Sentiment = mongoose.model('Sentiment',SentimentSchema)