require('dotenv').config(); // Environment variables ke liye
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

// 🟢 1. SECURE DATABASE CONNECTION (No Hardcoded Passwords)
const MONGO_URI = process.env.MONGO_URI; 

if (!MONGO_URI) {
    console.error("❌ MONGO_URI is missing! Please add it in Render Environment Variables.");
} else {
    mongoose.connect(MONGO_URI, { serverSelectionTimeoutMS: 5000 })
      .then(() => console.log("✅ Secure MongoDB Connected Successfully!"))
      .catch(err => console.error("❌ DB Error:", err.message));
}

// 🟢 2. DATABASE SCHEMAS (STRUCTURE)

// User Schema (Profile, Balance, Status)
const userSchema = new mongoose.Schema({
  name: { type: String, default: "Player" },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  phone: { type: String, default: "" },
  state: { type: String, default: "" },
  profile_pic: { type: String, default: "" },
  coins: { type: Number, default: 0 },
  balance: { type: Number, default: 0.00 },
  referralCode: String,
  deviceId: String,
  isBanned: { type: Boolean, default: false },
  banReason: { type: String, default: "Policy Violation" },
  completed_daily_tasks: { type: Array, default: [] },
  createdAt: { type: Date, default: Date.now }
});
const User = mongoose.model('User', userSchema);

// Admin Configuration Schema (For Ads, Banners, Nav Links)
const configSchema = new mongoose.Schema({
  key: { type: String, unique: true, default: "global_config" },
  navButtons: Array,
  banners: Array,
  postMatchAdLink: String,
  globalSmartlink: String
});
const AppConfig = mongoose.model('AppConfig', configSchema);


// 🟢 3. USER AUTHENTICATION ROUTES

// Register
app.post('/api/register', async (req, res) => {
  try {
    const { name, email, password, referralCode, deviceId } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ success: false, message: "Email already registered" });

    const newUser = new User({ name, email, password, referralCode, deviceId });
    await newUser.save();
    res.json({ success: true, userId: newUser._id, token: "token_" + newUser._id });
  } catch (err) { res.status(500).json({ success: false, message: "Server Error" }); }
});

// Login
app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email, password });
    
    if (!user) return res.status(400).json({ success: false, message: "Invalid Credentials" });
    if (user.isBanned) return res.status(403).json({ success: false, isBanned: true, message: user.banReason });

    res.json({ success: true, userId: user._id, token: "token_" + user._id, name: user.name });
  } catch (err) { res.status(500).json({ success: false, message: "Server Error" }); }
});


// 🟢 4. USER PROFILE & BALANCE MANAGEMENT ROUTES

// Fetch Full User Profile
app.get('/api/user/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });
    res.json({ success: true, user });
  } catch (err) { res.status(500).json({ success: false, message: "Server Error" }); }
});

// Update Profile (Name, Phone, State, Avatar)
app.post('/api/user/update-profile', async (req, res) => {
  try {
    const { userId, name, phone, state, profile_pic } = req.body;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    if (name) user.name = name;
    if (phone !== undefined) user.phone = phone;
    if (state !== undefined) user.state = state;
    if (profile_pic) user.profile_pic = profile_pic;

    await user.save();
    res.json({ success: true, message: "Profile Updated Successfully", user });
  } catch (err) { res.status(500).json({ success: false, message: "Update Failed" }); }
});

// Update Balance & Coins (For 1v1 Battles, Games, Tasks)
app.post('/api/user/update-balance', async (req, res) => {
  try {
    const { userId, pointsToAdd, action } = req.body; // pointsToAdd can be negative (for entry fee) or positive (for winning)
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ success: false });

    // Update Coins
    user.coins = user.coins + parseInt(pointsToAdd);
    if (user.coins < 0) user.coins = 0; // Prevent negative balance

    // Sync INR Balance (Formula: 100 Coins = 1 INR)
    user.balance = user.coins / 100;

    await user.save();
    res.json({ success: true, newCoins: user.coins, newBalance: user.balance });
  } catch (err) { res.status(500).json({ success: false }); }
});

// Delete Account (Play Store Mandatory Policy)
app.post('/api/user/delete-account', async (req, res) => {
  try {
    const { userId } = req.body;
    await User.findByIdAndDelete(userId);
    res.json({ success: true, message: "Account deleted permanently." });
  } catch (err) { res.status(500).json({ success: false, message: "Deletion Error" }); }
});


// 🟢 5. DYNAMIC ADMIN CONTROL ROUTES (App Config)

// Get Banners & Ads Links for App
app.get('/api/app-config/banners', async (req, res) => {
  try {
    const config = await AppConfig.findOne({ key: "global_config" });
    if (config) {
      res.json({ success: true, banners: config.banners, postMatchAdLink: config.postMatchAdLink, globalSmartlink: config.globalSmartlink });
    } else {
      res.json({ success: false, banners: [] });
    }
  } catch (err) { res.status(500).json({ success: false }); }
});

// Get Bottom Navigation Links
app.get('/api/app-config/nav-buttons', async (req, res) => {
  try {
    const config = await AppConfig.findOne({ key: "global_config" });
    res.json({ success: true, navButtons: config ? config.navButtons : [] });
  } catch (err) { res.status(500).json({ success: false }); }
});

// Admin Route to Update Ads/Banners without touching code
app.post('/api/admin/update-config', async (req, res) => {
  try {
    const { banners, postMatchAdLink, globalSmartlink, navButtons } = req.body;
    
    // Find existing config or create new one
    let config = await AppConfig.findOne({ key: "global_config" });
    if (!config) config = new AppConfig({ key: "global_config" });

    if (banners) config.banners = banners;
    if (postMatchAdLink) config.postMatchAdLink = postMatchAdLink;
    if (globalSmartlink) config.globalSmartlink = globalSmartlink;
    if (navButtons) config.navButtons = navButtons;

    await config.save();
    res.json({ success: true, message: "App Configuration Updated Successfully!" });
  } catch (err) { res.status(500).json({ success: false, message: "Config Update Failed" }); }
});


// 🟢 6. ADMIN SECURITY: BAN / UNBAN USER
app.post('/api/admin/ban-user', async (req, res) => {
  try {
    const { userId, isBanned, banReason } = req.body;
    await User.findByIdAndUpdate(userId, { isBanned, banReason });
    res.json({ success: true, message: `User ban status set to ${isBanned}` });
  } catch (err) { res.status(500).json({ success: false, message: "Ban Action Failed" }); }
});

// 🟢 7. SERVER START
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server Running on Port ${PORT}`));
