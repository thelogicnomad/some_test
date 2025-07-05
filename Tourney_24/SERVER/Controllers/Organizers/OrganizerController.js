import bcrypt from 'bcryptjs';
import cloudinary from '../../Config/cloudinary.js';
import validator from 'validator';


import Organizer from '../../Models/Organizer/OrganizerModel.js';
import Tournament from '../../Models/Organizer/Tournament.js';
import transporter from '../../Config/nodemailer.js';

import { setOrganizerTokenAndCookies } from '../../Middlewares/jwtAuth.js';
import generateSecureOTP from '../../Config/getOTP.js';




const signUp = async (req,res)=>{
    try{

        const { organizationName, email, password, mobileNumber } = req.body;

        if(!organizationName || !email || !password || !mobileNumber){
            return res.json({success:false,message:`All Fields Are Mandatory`});
        }


        if(!validator.isEmail(email)){
            return res.json({success:false,message:`Please Provide The Proper Mail`});
        }

        if(password.length<8){
            return res.json({success:false,message:`Password Must be minimum of length 8`});
        }


        const organizerExists = await Organizer.findOne({email});

        if(organizerExists && organizerExists.isAccountVerified){
            return res.json({success:false,message:`Organizer With Provided Mail Already Exists`});
        }

        const saltRound = await bcrypt.genSalt(10);

        const hashedPassword = await bcrypt.hash(password,saltRound);



        // setUserTokenAndCookie(newUser,res);

        // console.log("New User Created SUccessfully",newUser);


        const {OTP,hashedOTP,expiredAt} = await generateSecureOTP();

        let newUser = "";
        let updatedUser = "";

        if(!organizerExists){

            newUser = await Organizer.create({
                organizationName,
                email,
                mobileNumber,
                password:hashedPassword,
                verifyOtp:hashedOTP, 
                verifyOtpExpiredAt: expiredAt,
                clusterId: null, // Will be set to their own ID after creation
                role: 'owner' // Owner of their own organization
            })
            
            // Set clusterId to the user's own ID for the main organization
            newUser.clusterId = newUser._id;
            // Set themselves as the current organization context
            newUser.currentOrganizationContext = newUser._id;
            await newUser.save();
            
        }else{
            updatedUser = await Organizer.findOneAndUpdate({email},
                {
                    $set:{
                        organizationName,
                        email,
                        password:hashedPassword,
                        verifyOtp:hashedOTP, 
                        verifyOtpExpiredAt: expiredAt
                    }
                },
                { new: true }
            )
            
            // Set clusterId to their own ID if not already set
            if (!updatedUser.clusterId) {
                updatedUser.clusterId = updatedUser._id;
                updatedUser.role = 'owner';
                updatedUser.currentOrganizationContext = updatedUser._id;
                await updatedUser.save();
            }
        }



        try{
           

            const mailOption = {
                from:`Tourney 24 <${process.env.SENDER_EMAIL_SMT}>`,
                to:email,
                subject:`Welcom To Tourney 24`,
                html: `
                  <h1> Hello ${organizationName}</h1>
                  <h2>We Heartly Welcome You as Organizer in Tourney 24 </h2>
                  <p>Enter the OTP  <b> ${OTP} </b> To Create Account With The Provided email: <strong>${email}</strong></p>
                  <p>Enjoy your experience 💖</p>
                  
                `,
            }

            

            const info = await transporter.sendMail(mailOption);
            console.log(`Mail Has been Sent With The message id :- ${info}, ${info.messageId}`); 

        }catch(error){
            console.log(`Error while Generating the mail ${error}, ${error.message}`);
            return res.json({success:false,message:"Error In Sending OTP to Organizer's Email"});
        }



        res.json({success:true,message:`OTP Has Been Sent SuccessFully`});


    }catch(error){
        console.log(`Error In Signup End-Point of (Organizer) ${error}`);
        res.json({success:false,message:`Error In Signup End Point ${error}`});
    }
}




const verifyEmailWithOTP = async (req,res)=>{
    try{

        const { OTP, organizerMail } = req.body;

        console.log(req.body);

        if(!OTP){
            return res.json({sucess:false,message:"Enter the OTP"});
        }

        const organizer = await Organizer.findOne({email:organizerMail});
        console.log(organizer);
        if(!organizer){
            return res.json({success:false,message:"Email Not Found"});
        }

        console.log(organizer);
        
        if(organizer.verifyOtp==""){
            return res.json({success:false,message:`OTP Is Not Found`})
        }

        const isOTPVerified = await bcrypt.compare(String(OTP),organizer.verifyOtp);

        if(organizer.verifyOtp=='' || !isOTPVerified){
            return res.json({success:false,message:`Invalid OTP`});
        }

        if(organizer.verifyOtpExpiredAt < Date.now()){
            return res.json({success:false,message:`OTP Has Been Expired`});
        }

        const newOrganizer = await Organizer.findOneAndUpdate(
            {email:organizerMail},
            {
                $set:{
                    isAccountVerified:true,
                    verifyOtp:"",
                    verifyOtpExpiredAt:0,
                }
            },
            {new:true}
        ) 

        setOrganizerTokenAndCookies(newOrganizer,res);

        return res.json({success:true,message:`Account Has Been Created And Verified Succcessfully, Start Creating the Tournaments`});


    }catch(error){
       console.log(`Error in the verify OTP (BackEnd) ${error}`);
        return res.json({success:false,message:`Error in the verify OTP (BackEnd) ${error}`});
    }
}




const login = async (req,res)=>{
    try{

        const { email, password } = req.body;
        
        if(!email || !password) {
            return res.json({success:true,message:`All Mentioned Fields Are Mandatory To Login`});
        }

        const organizer = await Organizer.findOne({email});

        if(!organizer){
            return res.json({success:false,message:`Organizer With the Provided Mail Doesn't Exist `});
        }
        
        if(!organizer.isAccountVerified){
            return res.json({succes:false,message:`Organizer With the Provided Mail Doesn't Exist, Please Sign Up to continue`});
        }

        const isPassWordCorrect = await bcrypt.compare(password,organizer.password); 

        if(!isPassWordCorrect){
            return res.json({success:false,message:`Incorrect PassWord, Please Try Again`});
        }

        setOrganizerTokenAndCookies(organizer,res);

        return res.json({success:true,message:`Organizer Logged In SuccessFully`});


    }catch(error){
        console.log(`Error in Login End Point of Organizer ${error}`);
        res.json({success:false,message:`Error In Login End Point ${error}`});
    }
}




const createTournament = async (req,res)=>{
    try{
        const organization = req.organizer;

        if(!organization){
            return res.json({success:false,message:"Session Ended Sign In Again Please" });
        }

        const organizer = await Organizer.findById(organization);

        if(!organizer){
            return res.json({success:false,message:"Organizer Not Found"});
        }


        const {tournamentName,description,coverImage,startDate,endDate,location} = req.body;

        if(!tournamentName || !description || !coverImage || !startDate || !endDate || !location){
            return res.json({success:false,message:"All Fields are Mandatory"});
        }

        const image = await cloudinary.uploader.upload(coverImage);

         const uploadURL = image.secure_url;


        const tournament = await Tournament.create({
            name:tournamentName,
            description,
            coverImage:uploadURL,
            startDate,
            endDate,
            location,
            organization
        })

        return res.json({success:true,message:"Tournament Created SuccessFully"});

    }catch(error){
        return res.json({success:false,message:"Error In Creating Tournament in Organizer Controller"});
    }
}

const getAllTournaments = async (req,res)=>{
    try{
        const organization = req.organizer;

        if(!organization){
            return res.json({success:false,message:"Session Ended Sign In Again Please" });
        }

        const organizer = await Organizer.findById(organization);

        if(!organizer){
            return res.json({success:false,message:"Organizer Not Found"});
        }

        const tournaments = await Tournament.find({organization});

        return res.json({success:true,message:tournaments});

    }catch(error){
        return res.json({success:false,message:"Error In Creating Tournament in Organizer Controller"});
    }
}

const getParticularTournament = async (req,res)=>{
    try{
        const organization = req.organizer;

        if(!organization){
            return res.json({success:false,message:"Session Ended Sign In Again Please" });
        }

        const organizer = await Organizer.findById(organization);

        if(!organizer){
            return res.json({success:false,message:"Organizer Not Found"});
        }

        const tournament = await Tournament.findById(req.params.tournamentId); // Pass the Tournament Id in parameter in Route

        if(!tournament){
            return res.json({success:false,message:"Tournament Not Found"});
        }

        // const tournamentDetails = await Tournament.findById(req.params.tournamentId).populate('events').populate('teams');
        return res.json({success:true,message:tournament});
    }catch(error){
        return res.json({success:false,message:"Error In Getting Particular Tournament"});
    }

}


// Get organizer profile
const getProfile = async (req, res) => {
    try {
        const organizerId = req.organizer;
        
        if (!organizerId) {
            return res.json({ success: false, message: "Session ended, please sign in again" });
        }
        
        const organizer = await Organizer.findById(organizerId).select('-password -verifyOtp');
        
        if (!organizer) {
            return res.json({ success: false, message: "Organizer not found" });
        }
        
        return res.json({ 
            success: true, 
            organizer: organizer,
            message: "Profile fetched successfully" 
        });
        
    } catch (error) {
        console.log(`Error in getProfile: ${error}`);
        return res.json({ success: false, message: "Error fetching profile" });
    }
};

// Get dashboard statistics
const getDashboardStats = async (req, res) => {
    try {
        const organizerId = req.organizer;
        
        if (!organizerId) {
            return res.json({ success: false, message: "Session ended, please sign in again" });
        }
        
        // Get organizer details
        const organizer = await Organizer.findById(organizerId);
        if (!organizer) {
            return res.json({ success: false, message: "Organizer not found" });
        }
        
        // Get tournaments count and data
        const tournaments = await Tournament.find({ organization: organizerId });
        const totalTournaments = tournaments.length;
        
        // Calculate active tournaments (upcoming and active status)
        const activeTournaments = tournaments.filter(t => 
            t.status === 'upcoming' || t.status === 'active'
        ).length;
        
        // Calculate completed tournaments
        const completedTournaments = tournaments.filter(t => 
            t.status === 'completed'
        ).length;
        
        // Calculate total participants across all tournaments
        const totalParticipants = tournaments.reduce((sum, tournament) => {
            return sum + (tournament.totalPlayers || 0);
        }, 0);
        
        // Get recent tournaments (last 5)
        const recentTournaments = tournaments
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            .slice(0, 5);
        
        const stats = {
            totalTournaments,
            activeTournaments,
            completedTournaments,
            totalParticipants,
            recentTournaments: recentTournaments.map(t => ({
                _id: t._id,
                name: t.name,
                status: t.status,
                startDate: t.startDate,
                endDate: t.endDate,
                location: t.location,
                totalPlayers: t.totalPlayers || 0,
                createdAt: t.createdAt
            }))
        };
        
        return res.json({ 
            success: true, 
            stats,
            message: "Dashboard stats fetched successfully" 
        });
        
    } catch (error) {
        console.log(`Error in getDashboardStats: ${error}`);
        return res.json({ success: false, message: "Error fetching dashboard statistics" });
    }
};

// Add member to organization cluster
const addMember = async (req, res) => {
    try {
        const organizerId = req.organizer;
        const { email, password } = req.body;
        
        console.log('addMember called by organizerId:', organizerId);
        console.log('Adding member email:', email);
        
        if (!organizerId) {
            return res.json({ success: false, message: "Session ended, please sign in again" });
        }
        
        if (!email || !password) {
            return res.json({ success: false, message: "Email and password are required" });
        }
        
        if (!validator.isEmail(email)) {
            return res.json({ success: false, message: "Please provide a valid email address" });
        }
        
        if (password.length < 8) {
            return res.json({ success: false, message: "Password must be at least 8 characters long" });
        }
        
        // Check if organizer exists
        const organizer = await Organizer.findById(organizerId);
        if (!organizer) {
            return res.json({ success: false, message: "Organizer not found" });
        }
        
        // Check if member already exists with verified account
        let existingMember = await Organizer.findOne({ email, isAccountVerified: true });
        if (existingMember) {
            // Check if member is already in the same cluster
            if (existingMember.clusterId && existingMember.clusterId.toString() === organizer.clusterId.toString()) {
                return res.json({ success: false, message: "Member is already part of this organization cluster" });
            }
            
            // Add existing member to the cluster
            existingMember.clusterId = organizer.clusterId;
            existingMember.addedBy = organizerId;
            existingMember.role = 'member';
            await existingMember.save();
            
            return res.json({ 
                success: true, 
                message: "Existing member added to organization cluster successfully",
                member: {
                    _id: existingMember._id,
                    email: existingMember.email,
                    organizationName: existingMember.organizationName || 'Not set',
                    role: 'member',
                    addedAt: new Date()
                }
            });
        }
        
        // Create new member account
        const saltRound = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, saltRound);
        
        const newMember = await Organizer.create({
            email: email.toLowerCase().trim(),
            password: hashedPassword,
            isAccountVerified: true, // Auto-verify members added by organization
            clusterId: organizer.clusterId, // Add to same cluster
            organizationName: '', // Empty initially
            organizationPhone: '', // Empty initially
            role: 'member', // Set as member
            addedBy: organizerId // Track who added this member
        });
        
        return res.json({ 
            success: true, 
            message: "Member added to organization cluster successfully",
            member: {
                _id: newMember._id,
                email: newMember.email,
                organizationName: newMember.organizationName || 'Not set',
                role: 'member',
                addedAt: new Date()
            }
        });
        
    } catch (error) {
        console.log(`Error in addMember: ${error}`);
        return res.json({ success: false, message: "Error adding member" });
    }
};

// Get all cluster members
const getOrganizationMembers = async (req, res) => {
    try {
        const organizerId = req.organizer;
        
        console.log('getOrganizationMembers called by organizerId:', organizerId);
        
        if (!organizerId) {
            return res.json({ success: false, message: "Session ended, please sign in again" });
        }
        
        const organizer = await Organizer.findById(organizerId);
        if (!organizer) {
            return res.json({ success: false, message: "Organizer not found" });
        }
        
        console.log('Organizer details:', { email: organizer.email, role: organizer.role, clusterId: organizer.clusterId });
        
        // Find all members in the same cluster
        const clusterMembers = await Organizer.find({
            clusterId: organizer.clusterId,
            isAccountVerified: true
        }).select('email mobileNumber organizationName role createdAt').sort({ createdAt: 1 });
        
        // Map cluster members to response format
        const members = clusterMembers.map((member) => ({
            _id: member._id,
            email: member.email,
            organizationName: member.organizationName || 'Not set',
            role: member.role || 'member', // Use the stored role field
            status: 'Active',
            isDefault: member._id.toString() === organizerId.toString(),
            addedAt: member.createdAt || new Date()
        }));
        
        return res.json({ 
            success: true, 
            members,
            message: "Members fetched successfully" 
        });
        
    } catch (error) {
        console.log(`Error in getOrganizationMembers: ${error}`);
        return res.json({ success: false, message: "Error fetching members" });
    }
};

// Get organizations in the same cluster
const getAccessibleOrganizations = async (req, res) => {
    try {
        const userId = req.organizer;
        
        if (!userId) {
            return res.json({ success: false, message: "Session ended, please sign in again" });
        }
        
        const user = await Organizer.findById(userId);
        if (!user) {
            return res.json({ success: false, message: "User not found" });
        }
        
        // Find all organizations in the same cluster
        const clusterOrganizations = await Organizer.find({
            clusterId: user.clusterId,
            isAccountVerified: true
        }).select('_id email organizationName organizationPhone role currentOrganizationContext');
        
        // Filter organizations - only show organizations with names
        const filteredOrganizations = clusterOrganizations.filter(org => {
            return org.organizationName && org.organizationName.trim() !== '';
        });
        
        const organizations = filteredOrganizations.map(org => ({
            _id: org._id,
            name: org.organizationName,
            email: org.email,
            phone: org.organizationPhone || '',
            role: org._id.toString() === userId.toString() ? 'owner' : 'accessible',
            isActive: org._id.toString() === userId.toString()
        }));
        
        return res.json({ 
            success: true, 
            organizations,
            message: "Organizations fetched successfully" 
        });
        
    } catch (error) {
        console.log(`Error in getAccessibleOrganizations: ${error}`);
        return res.json({ success: false, message: "Error fetching organizations" });
    }
};

// Switch organization context within cluster
const switchOrganization = async (req, res) => {
    try {
        const userId = req.organizer;
        const { organizationId } = req.body;
        
        if (!userId || !organizationId) {
            return res.json({ success: false, message: "Invalid request" });
        }
        
        const user = await Organizer.findById(userId);
        if (!user) {
            return res.json({ success: false, message: "User not found" });
        }
        
        // Get the target organization
        const targetOrganization = await Organizer.findById(organizationId);
        if (!targetOrganization) {
            return res.json({ success: false, message: "Organization not found" });
        }
        
        // Check if both users are in the same cluster
        if (!user.clusterId || !targetOrganization.clusterId || 
            user.clusterId.toString() !== targetOrganization.clusterId.toString()) {
            return res.json({ success: false, message: "Access denied to this organization" });
        }
        
        // Update the user's current organization context WITHOUT changing JWT token
        user.currentOrganizationContext = organizationId;
        await user.save();
        
        return res.json({ 
            success: true, 
            message: "Organization switched successfully",
            organization: {
                _id: targetOrganization._id,
                name: targetOrganization.organizationName || targetOrganization.email,
                email: targetOrganization.email
            }
        });
        
    } catch (error) {
        console.log(`Error in switchOrganization: ${error}`);
        return res.json({ success: false, message: "Error switching organization" });
    }
};

// Create/Update current user's organization details within cluster
const createOrganization = async (req, res) => {
    try {
        const userId = req.organizer;
        const { organizationName, organizationPhone } = req.body;
        
        console.log('createOrganization called by userId:', userId);
        console.log('Organization name to set:', organizationName);
        
        if (!userId) {
            return res.json({ success: false, message: "Session ended, please sign in again" });
        }
        
        if (!organizationName || !organizationName.trim()) {
            return res.json({ success: false, message: "Organization name is required" });
        }
        
        // Get the current user
        const user = await Organizer.findById(userId);
        if (!user) {
            return res.json({ success: false, message: "User not found" });
        }
        
        console.log('User found:', { email: user.email, currentOrgName: user.organizationName, role: user.role });
        
        // Update ONLY the current user's organization details
        user.organizationName = organizationName.trim();
        user.organizationPhone = organizationPhone ? organizationPhone.trim() : '';
        await user.save();
        
        console.log('User updated successfully with new org name:', user.organizationName);
        
        return res.json({ 
            success: true, 
            message: "Organization created successfully",
            organization: {
                _id: user._id,
                name: user.organizationName,
                email: user.email,
                phone: user.organizationPhone,
                createdAt: new Date()
            }
        });
        
    } catch (error) {
        console.log(`Error in createOrganization: ${error}`);
        return res.json({ success: false, message: "Error creating organization" });
    }
};

export {signUp,verifyEmailWithOTP,login,createTournament,getAllTournaments,getParticularTournament,getProfile,getDashboardStats,addMember,getOrganizationMembers,getAccessibleOrganizations,switchOrganization,createOrganization};
