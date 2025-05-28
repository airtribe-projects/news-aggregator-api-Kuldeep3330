const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const fs = require('fs');
const path = require('path');
// const {readUsersFromFile,writeUsersToFile} = require('../utils/file')

const JWT_SECRET = 'your_jwt_secret_here';

const filePath = path.join(__dirname, '../user.json');

const readUsersFromFile = () => {
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, JSON.stringify({ users: [] }, null, 2));
  }
  const data = fs.readFileSync(filePath, 'utf-8');
  return JSON.parse(data).users;
};

const writeUsersToFile = (users) => {
  fs.writeFileSync(filePath, JSON.stringify({ users }, null, 2));
};

const registeredUser = async (req, res) => {
  const { name, email, password, preferences } = req.body;

  if (!name || !email || !password || !Array.isArray(preferences)) {
    return res.status(400).json({ error: 'All fields are required and preferences must be an array' });
  }

  const users = readUsersFromFile();

  const existedUser = users.find((u) => u.email === email);
  if (existedUser) {
    return res.status(409).json({ error: 'User already exists' });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const userCreated = {
    id: users.length + 1,
    name,
    email,
    password: hashedPassword,
    preferences
  };

  users.push(userCreated);
  writeUsersToFile(users);

  const token = jwt.sign({ id: userCreated.id, email: userCreated.email }, JWT_SECRET, { expiresIn: '1h' });

  res.status(200).json({ message: 'Signup successful', token });
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  const users = readUsersFromFile();

  const existingUser = users.find((u) => u.email === email);
  if (!existingUser) {
    return res.status(401).json({ error: 'Invalid email or password' });
  }

  const isMatch = await bcrypt.compare(password, existingUser.password);
  if (!isMatch) {
    return res.status(401).json({ error: 'Invalid email or password' });
  }

  const token = jwt.sign({ id: existingUser.id, email: existingUser.email }, JWT_SECRET, { expiresIn: '1h' });

  res.status(200).json({ message: 'Login successful', token });
};

const getUserPreferences = (req, res) => {
  const users = readUsersFromFile();
  const user = users.find(u => u.id === req.user.id);

  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  res.status(200).json({ preferences: user.preferences || [] });
};

const updateUserPreferences = (req, res) => {
  const { preferences } = req.body;

  if (!Array.isArray(preferences)) {
    return res.status(400).json({ error: 'Preferences must be an array' });
  }

  const users = readUsersFromFile();
  const userIndex = users.findIndex(u => u.id === req.user.id);

  if (userIndex === -1) {
    return res.status(404).json({ error: 'User not found' });
  }

  users[userIndex].preferences = preferences;
  writeUsersToFile(users);

  res.status(200).json({ message: 'Preferences updated' });
};

module.exports = {
  registeredUser,
  loginUser,
  getUserPreferences,
  updateUserPreferences
};

