import mongoose from "mongoose";

const TournamentSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    type:{
        type:String,
        enum:['public','private'],
        default:'public'
    },
    sport:{
        type:String,
        required:true,
    },
    startDate:{
        type:Date,
        required:true
    },
    endDate:{
        type:Date,
        required:true
    },
    location: {
        type:String,
        required:true,
    },
    coverImage: {
        type:String,
        required:true
    },
    description: {
        type:String,
        required:true
    },
    status: { 
        type: String, 
        enum: ['upcoming', 'active', 'completed', 'cancelled'], 
        default: 'upcoming' 
    },
    isPublic: { 
        type: Boolean, 
        default: true 
    },
    isVerified: { 
        type: Boolean, 
        default: false 
    },  
    organization: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'organizer', 
        required: true 
    },
    events: [
        {
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'event' 
        }
    ],
    teams: [
        {
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'team' 
        }
    ],
    settings: {
        name:String,
        url: String,
        otp: String,
        seedingOptionInFixtures: Boolean,
        askEmailFromPlayer: Boolean,
        askMobileFromPlayer: Boolean,
        askAdditionalInfo: Boolean,
        showFixtures: Boolean,
        customFields: [{
            fieldName: String,
            hintText: String,
            isMandatory: Boolean,
            displayInFixture: Boolean
        }]
    },
    totalPlayers:{
        type:Number,
        required:true,
        default:0
    },
    // createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    createdAt: { type: Date, default: Date.now }
}, {timestamps:true});


const Tournament = mongoose.model('tournament', TournamentSchema);

export default Tournament;