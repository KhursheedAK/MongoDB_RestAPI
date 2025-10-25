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
    res
      .status(201)
      .send({ message: 'User Created successfully', user: newUser });
  } catch (e) {
    res.status(400).send(e);
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
  const update = Object.keys(req.body);
  const validUpdates = ['name', 'email', 'age'];
  const isValid = update.every((data) => validUpdates.includes(data));

  if (!isValid) {
    return res.status(400).send({ error: 'Invalid Updates' });
  }

  try {
    const userUpdate = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!userUpdate) {
      return res.status(400).send('error: No user found');
    }
    res.status(200).send(userUpdate);
  } catch (e) {
    res.status(500).send(e);
  }
});

export default router;
