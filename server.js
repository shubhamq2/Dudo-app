const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const app = express();
app.use(express.json());
app.use(cors());

const JWT_SECRET = "DUDO_SUPER_SECRET_KEY_2026";

// MongoDB URL (Render Environment Variable se lega)
const MONGO_URI = "mongodb+srv://dudoreward_db_user:B7gqC2r3suuJLAAN@cluster0.ejzasaj.mongodb.net/dudodb?retryWrites=true&w=majority";

mongoose.connect(MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected Successfully!"))
  .catch(err => logSystemError("Database Connection Failed", err));

// Database Schemas
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  balance: { type: Number, default: 0 },
  coins: { type: Number, default: 0 },
  accountStatus: { type: String, default: "ACTIVE" },
  referralCode: { type: String },
  deviceId: { type: String },
  joinedAt: { type: Date, default: Date.now }
});

const errorLogSchema = new mongoose.Schema({
  title: String,
  errorDetails: String,
  timestamp: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);
const SystemErrorLog = mongoose.model('SystemErrorLog', errorLogSchema);

// Admin Diagnostic Logging Function
async function logSystemError(title, error) {
  try {
    const errorText = typeof error === 'object' ? JSON.stringify(error, Object.getOwnPropertyNames(error)) : String(error);
    await SystemErrorLog.create({ title, errorDetails: errorText });
    console.error(`[ADMIN DIAGNOSTIC LOGGED]: ${title}`, error);
  } catch (e) {
    console.error("Failed to write to Error Log DB", e);
  }
}

// 🟢 REGISTER API
app.post('/api/register', async (req, res) => {
  try {
    const { name, email, password, referralCode, deviceId } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: "Email already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      referralCode,
      deviceId
    });

    await newUser.save();
    const token = jwt.sign({ userId: newUser._id }, JWT_SECRET, { expiresIn: '30d' });

    res.json({ success: true, token, userId: newUser._id });
  } catch (error) {
    logSystemError("Registration Failure", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});

// 🟢 LOGIN API
app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ success: false, message: "User not found" });
    }

    if (user.accountStatus === 'BANNED_TERMINATED') {
      return res.status(403).json({ success: false, message: "Account Restricted" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: "Invalid Password" });
    }

    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '30d' });
    res.json({ success: true, token, userId: user._id, balance: user.balance, coins: user.coins });
  } catch (error) {
    logSystemError("Login Failure", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});

// 🟢 ADMIN DIAGNOSTICS & SYSTEM HEALTH ENDPOINT
app.get('/api/admin/system-health-logs', async (req, res) => {
  try {
    const logs = await SystemErrorLog.find().sort({ timestamp: -1 }).limit(50);
    const totalUsers = await User.countDocuments();
    res.json({ success: true, totalUsers, systemLogs: logs });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 DUDO Backend Live on Port ${PORT}`));
