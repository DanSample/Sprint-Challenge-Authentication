const router = require('express').Router();
const bcrypt = require('bcryptjs');
const db = require('../database/dbConfig');

router.post('/register', (req, res) => {
  // implement registration
});

router.post('/login', (req, res) => {
  // implement login
});

module.exports = router;
