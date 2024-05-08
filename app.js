const express = require('express');
const User = require('./model/user.js');
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const router = express.Router();

const auth = require("./middleware/auth");

// Create a new user
router.post('/signup', async (req, res) => {
    try {
      const { name, password, email, age } = req.body;
      const oldUser = await User.findOne({email});
      
      if(oldUser) {
        return res.send("User already exists! Please login.");
      }

      // Encrypt user password
      const salt=await bcrypt.genSalt();
      console.log(salt);
      encryptedPassword=await bcrypt.hash(password, salt);
      console.log(encryptedPassword);
      // Create user in database
      const user = await User.create({
        name: name,
        password: encryptedPassword,
        email: email.toLowerCase(),
        age: age,
      });

      //Create token
      const token = jwt.sign(
        { user_id: user._id, email },
      'randomstr', // use a random string, token key
        {
          expiresIn: "5h",
        }
      );

     // Save user token
      user.token = token;
  
      // return new user
      res.json(user);
    } 
    catch (err) {
      console.log(err);
    }
  console.log(req.body);
});

router.post("/login", async (req, res) => {
   try {
    const { email, password } = req.body;

    // Validate if user exist in our database
    const user = await User.findOne({ email });

    if (user && (await bcrypt.compare(password, user.password))) {
      // Create token
      const token = jwt.sign(
        { user_id: user._id, email },
        'randomstr', // again a random string ;)
        {
          expiresIn: "5h",
        }
      );

      // save user token
      user.token = token;
      // user
      return res.json(user);
    }
    return res.send("Invalid Credentials");
  }
  catch(error) {
    console.log(error);
  }
});

router.post("/welcome", auth, (req, res) => {
  res.send("Welcome User");
});

// Get all users
router.get('/users', async (req, res) => {
    try {
      const users = await User.find({});
      res.send(users);
    } 
    catch (error) {
      console.error(error);
      res.send(error);
    }
});
  
// Update a user
router.put('/users/:id', async (req, res) => {
    const { id } = req.params;
    const { name, password, email, age } = req.body;
  
    try {
      const user = await User.findByIdAndUpdate(id, { name, password, email, age }, { new: true });
      res.send(user);
    } 
    catch (error) {
      console.error(error);
      res.send(error);
    }
});
  
// Delete a user
router.delete('/users/:id', async (req, res) => {
    const { id } = req.params;
  
    try {
      const user = await User.findByIdAndDelete(id);
      res.send(user);
    } 
    catch (error) {
      console.error(error);
      res.send(error);
    }
});

module.exports = router;