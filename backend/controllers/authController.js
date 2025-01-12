const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const userModel = require('../models/userModel');
const { signupValidation } = require('../validations/userValidation');
const dotenv = require('dotenv');
const shortid = require('shortid');


dotenv.config();

module.exports = {
  async signup(req, res, next) {
    try {
      console.log('req-->body',req.body);
      const { error } = signupValidation.validate(req.body);
      if (error) return res.status(400).json({ message: error.details[0].message });

      const { first_name, last_name, email, password } = req.body;
      const hashedPassword = await bcrypt.hash(password, 10);
      const username = `${first_name} ${last_name}`;
      
      await userModel.createUser({
        first_name,
        last_name,
        email,
        password: hashedPassword,
        username,
      });

      res.status(201).json({ message: 'User created successfully' });
    } catch (err) {
      next(err);
    }
  },

  async login(req, res, next) {
    try {
      console.log(req.body,'req.body');
      const { email, password } = req.body;
      const user = await userModel.findByEmail(email);
      if (!user) return res.status(404).json({ message: 'User not found' });

      const isValidPassword = await bcrypt.compare(password, user.password);
      console.log('isValidPassword:',isValidPassword,);
      if (!isValidPassword) return res.status(401).json({ message: 'Invalid credentials' });

      const token = jwt.sign({ id: user.user_id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' });
      res.status(200).json({ token, user });
    } catch (err) {
      next(err);
    }
  },
  async getUserDetails(req, res, next) {
    try {
      const user = await userModel.findEmail(req.user.email); // Fetch user by email from token
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      // Return only the required fields
      res.status(200).json({
        username: user.username,
        email: user.email,
        profile_pic: user.profile_pic || null,
      });
    } catch (err) {
      next(err);
    }
  },
};
