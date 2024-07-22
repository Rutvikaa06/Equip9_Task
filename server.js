const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');
const path = require('path');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const app = express();
const PORT = 8081;

// Middleware
app.use(bodyParser.json());

// Multer setup for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Destination folder
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // File name
  }
});
const upload = multer({ storage });

// Mock database for demonstration
let users = [
  // Example user
  { mobile: '1234567890', passwordHash: bcrypt.hashSync('Password1', 10), profilePic: 'default.jpg' }
];

// Signup endpoint
app.post('/signup', upload.single('profilePic'), (req, res) => {
  const { name, mobile, password } = req.body;
  const profilePic = req.file ? req.file.filename : 'default.jpg'; // Handle profile picture

  // Check if user already exists
  if (users.find(user => user.mobile === mobile)) {
    return res.status(400).json({ message: 'User already exists' });
  }

  // Create new user
  const hashedPassword = bcrypt.hashSync(password, 10);
  users.push({ name, mobile, passwordHash: hashedPassword, profilePic });

  res.status(201).json({ message: 'User created successfully', profilePic });
});

// Login endpoint
app.post('/login', upload.single('profilePic'), (req, res) => {
  const { mobile, password } = req.body;
  const profilePic = req.file ? req.file.filename : 'default.jpg'; // Handle profile picture

  // Find user by mobile number
  const user = users.find(user => user.mobile === mobile);

  if (!user) {
    return res.status(401).json({ message: 'Invalid mobile number or password' });
  }

  // Check password
  const isPasswordValid = bcrypt.compareSync(password, user.passwordHash);

  if (!isPasswordValid) {
    return res.status(401).json({ message: 'Invalid mobile number or password' });
  }

  // Update profile picture if provided
  if (req.file) {
    user.profilePic = profilePic;
  }

  // Generate token (optional)
  const token = jwt.sign({ mobile: user.mobile }, 'your_jwt_secret', { expiresIn: '1h' });

  res.json({ message: 'Login successful', token, profilePic: user.profilePic });
});

// Serve static files (profile pictures)
app.use('/uploads', express.static('uploads'));

// Start server
app.listen(8081, () => {
  console.log(`Server is running on http://localhost:${8081}`);
});
