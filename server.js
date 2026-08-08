const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

// Naya Connection URL (Render Environment Variable ya Direct Fallback)
const MONGO_URI = process.env.MONGO_URI || "mongodb+srv://dudoreward_db_user:DudoPass12345@cluster0.ejzasaj.mongodb.net/dudodb?retryWrites=true&w=majority";

// MongoDB Connection with Timeout Options
mongoose.connect(MONGO_URI, {
  serverSelectionTimeoutMS: 5000 // 5 second timeout limit
})
.then(() => console.log("✅ MongoDB Connected Successfully!"))
.catch(err => console.error("❌ Database Connection Error:", err.message));

app.get('/', (req, res) => {
  res.send("Dudo Backend Server is Live!");
});

app.get('/api/admin/system-health-logs', (req, res) => {
  const isConnected = mongoose.connection.readyState === 1;
  res.json({
    success: true,
    dbStatus: isConnected ? "CONNECTED" : "DISCONNECTED",
    message: isConnected ? "Database Working Smoothly" : "Database not connected yet"
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server Running on Port ${PORT}`));
