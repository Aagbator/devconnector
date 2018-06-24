var createError = require('http-errors');
var express = require('express');
const mongoose = require('mongoose');
var path = require('path');

const users = require('./routes/api/users');
const profile = require('./routes/api/profile');
const posts = require('./routes/api/posts');

var app = express();

const db = require('./config/keys').mongoURI;

//connect to mongo db
mongoose
    .connect(db)
    .then(() => console.log('mongoDB connected'))
    .catch(err => console.log('error'));


app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));


app.get('/', (req, res) => res.send('hello world'));

// use routes
app.use('/api/users', users);
app.use('/api/profile', profile);
app.use('/api/posts', posts);

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server running on port ${port} : ${db}`));

