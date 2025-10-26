import express from 'express';
import User from '../models/userModel.js';

const router = express.Router();

router.get('/users', async (req, res) => {
  try {
    const users = await User.find({});
    res.status(200).send(users);
  } catch (e) {
    res.status(400).send(e);
  }
});

router.get('/users/:id', async (req, res) => {
  try {
    const user_id = req.params.id;
    const user = await User.findById(user_id);

    if (!user) {
      return res.status(404).send('No user found!');
    }
    res.status(200).send(user);
  } catch (e) {
    res.status(500).send(e);
  }
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

router.delete('/users/:id', async (req, res) => {
  try {
    const user_id = req.params.id;
    const userToDelete = await User.findByIdAndDelete(user_id);
    if (!userToDelete) {
      return res.status(400).send('No user found!');
    }
    res.status(200).send(userToDelete);
  } catch (e) {
    res.status(500).send({ Error: e.message });
  }
});

router.patch('/users/:id', async (req, res) => {
  const updates = Object.keys(req.body);
  const validUpdates = ['name', 'password', 'email', 'age'];
  const isValid = updates.every((data) => validUpdates.includes(data));

  if (!isValid) {
    return res.status(400).send({ error: 'Invalid Updates' });
  }

  try {
    const userUpdate = await User.findById(req.params.id);

    if (!userUpdate) {
      return res.status(400).send('error: No user found');
    }

    updates.forEach((update) => {
      userUpdate[update] = req.body[update];
    });
    await userUpdate.save();

    res.status(200).send(userUpdate);
  } catch (e) {
    res.status(500).send(e);
  }
});

export default router;
