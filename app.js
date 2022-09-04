const express = require('express');
const app = express();
const dotenv = require('dotenv');
app.use(express.json());

dotenv.config({ path: './config/.env' });

const { tokenChecker } = require('./controllers/user');

app.use('/api/1.0/users/', require('./routes/user'));
app.use('/api/1.0/scripts/', tokenChecker, require('./routes/sqlScripts'));

app.listen(3000, () => {
  console.log('listening on http://localhost:3000');
});
