const { readUsersFromFile } = require('../utils/file');

const getNews = (req, res) => {
  try {
    const users = readUsersFromFile();
    const user = users.find(u => u.id === req.user.id);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const preferences = user.preferences || [];   

    res.status(200).json({ news: preferences });
  } catch (err) {
    console.error('Error in getNews:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = { getNews };
