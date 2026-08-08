const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

// MongoDB Connection
const MONGO_URI = process.env.MONGO_URI || "mongodb+srv://dudoreward_db_user:DudoPass12345@cluster0.ejzasaj.mongodb.net/dudodb?retryWrites=true&w=majority";

mongoose.connect(MONGO_URI, { serverSelectionTimeoutMS: 5000 })
  .then(() => console.log("✅ MongoDB Connected Successfully!"))
  .catch(err => console.error("❌ DB Error:", err.message));

// User Model
const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  coins: { type: Number, default: 0 },
  referralCode: String,
  createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);

// Base Route
app.get('/', (req, res) => {
  res.send("Dudo Backend Server is Live!");
});

// 🟢 REGISTER ROUTE
app.post('/api/register', async (req, res) => {
  try {
    const { name, email, password, referralCode } = req.body;
    
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: "Email already registered" });
    }

    const newUser = new User({ name, email, password, referralCode });
    await newUser.save();

    res.json({ 
      success: true, 
      message: "Registration Successful", 
      userId: newUser._id,
      token: "user_token_" + newUser._id 
    });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server Error: " + err.message });
  }
});

// 🟢 LOGIN ROUTE
app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const user = await User.findOne({ email, password });
    if (!user) {
      return res.status(400).json({ success: false, message: "Invalid Email or Password" });
    }

    res.json({ 
      success: true, 
      message: "Login Successful", 
      userId: user._id,
      token: "user_token_" + user._id 
    });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server Error: " + err.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server Running on Port ${PORT}`));
