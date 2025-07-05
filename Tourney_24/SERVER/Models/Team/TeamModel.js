import mongoose from "mongoose";

const TeamSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    logo: {
        type: String,
    },
    players: [{
        type: String, // For now we store player names as strings; can be ref to PlayerModel later
    }],
    tournament: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'tournament',
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
}, {timestamps:true});

const Team = mongoose.model('team', TeamSchema);

export default Team;
