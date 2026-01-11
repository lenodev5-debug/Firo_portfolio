const express = require('express');
const app = express();

// ====== Middleware ======

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// server iploads files
app.use('/uploads', express.static('uploads'));

// ====== import Routes ======

const ownerRoutes = require('./routes/owner');
const userRoutes = require('./routes/user');
const userServiceRoutes = require('./routes/UserService');

// ====== Routes ======

app.use('/api/owners', ownerRoutes);
app.use('/api/users', userRoutes);
app.use('/api/user-services', userServiceRoutes);

module.exports = app;