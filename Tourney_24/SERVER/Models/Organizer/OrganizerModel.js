import mongoose from 'mongoose';

const OrganizerSchema = new mongoose.Schema({
    email:{
        type:String,
        required:function() {
            return !this.isOrganization;
        },
        unique:false,
    },
    mobileNumber:{
        type:String,
        
    },
    password:{
        type:String,
        required:true,
    },
    tournament:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'tournament',
    },
    events:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'event',
    },
    isAccountVerified:{
        type:Boolean,
        default:false,
    },
    verifyOtp:{
        type:String,
        default:"",
    },
    verifyOtpExpiredAt:{
        type:Number,
        default:0,
    },
    // Cluster ID to group organizations
    clusterId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'organizer'
    },
    // User's personal organization details
    organizationName: {
        type: String,
        default: ''
    },
    organizationPhone: {
        type: String,
        default: ''
    },
    // Role in the cluster (owner/member)
    role: {
        type: String,
        enum: ['owner', 'member'],
        default: 'member'
    },
    // Track who added this member to the cluster
    addedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'organizer'
    },
    // When this member was added to the cluster
    addedAt: {
        type: Date,
        default: Date.now
    },
    // List of organizations this user has access to within the cluster
    accessibleOrganizations: [
        {
            organizationId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'organizer'
            },
            role: {
                type: String,
                enum: ['owner', 'member'],
                default: 'member'
            },
            grantedAt: {
                type: Date,
                default: Date.now
            },
            grantedBy: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'organizer'
            }
        }
    ],
    // Current active organization context for this user
    currentOrganizationContext: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'organizer'
    },
    // Legacy fields for backward compatibility
    isOrganization: {
        type: Boolean,
        default: false
    },
    ownedOrganizations: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'organizer'
    }],
    parentUser: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'organizer'
    }
}, {
    timestamps: true
})
        
const Organizer = mongoose.model('organizer',OrganizerSchema);

export default Organizer;