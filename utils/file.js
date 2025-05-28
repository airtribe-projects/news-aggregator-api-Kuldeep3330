const fs = require('fs');
const path = require('path');

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

module.exports={readUsersFromFile, writeUsersToFile}