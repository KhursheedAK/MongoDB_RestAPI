import express from 'express';
import User from '../models/userModel.js';
import auth from '../middleware/auth.js';

const router = express.Router();

router.get('/users/me', auth.auth, async (req, res) => {
  res.send(req.user);
});

router.post('/users', async (req, res) => {
  try {
    const newUser = new User(req.body);
    await newUser.save();
    const token = await newUser.generateAuthToken();
    res
      .status(201)
      .send({ message: 'User Created successfully', user: newUser, token });
  } catch (e) {
    res.status(400).send(e);
  }
});

router.post('/users/login', async (req, res) => {
  try {
    const user = await User.findByCredentials(
      req.body.email,
      req.body.password,
    );

    const token = await user.generateAuthToken();
    res.status(200).send({ user, token });
  } catch (e) {
    res.status(400).send(e.message);
  }
});

router.post('/users/logout', auth.auth, async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter((token) => {
      return token.token !== req.token;
    });
    await req.user.save();
    res.send(req.user, 'logged Out!');
  } catch (e) {
    res.status(500).send(e.message);
  }
});

router.post('/users/logoutAll', auth.auth, async (req, res) => {
  try {
    req.user.tokens = [];
    await req.user.save();
    console.log(req.user);
    res.status(200).send(req.user, 'Logged out!');
  } catch (e) {
    res.status(500).send(e.message);
  }
});

router.patch('/users/me', auth.auth, async (req, res) => {
  const updates = Object.keys(req.body);
  const validUpdates = ['name', 'password', 'email', 'age'];
  const isValid = updates.every((data) => validUpdates.includes(data));

  if (!isValid) {
    return res.status(400).send({ error: 'Invalid Updates' });
  }

  try {
    updates.forEach((update) => {
      req.user[update] = req.body[update];
    });
    await req.user.save();

    res.status(200).send(req.user);
  } catch (e) {
    res.status(500).send(e);
  }
});

router.delete('/users/me', auth.auth, async (req, res) => {
  try {
    await req.user.deleteOne();
    res.status(200).send(req.user);
  } catch (e) {
    res.status(500).send({ Error: e.message });
  }
});

export default router;
