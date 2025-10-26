import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';

const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization').replace('Bearer ', '');
    const decode = jwt.verify(token, 'mykey');
    const user = await User.findOne({ _id: decode._id, 'tokens.token': token });

    if (!user) {
      throw new Error();
    }
    req.user = user;
    next();
  } catch (e) {
    res.status(503).send('please authenticate!');
  }
};

export default { auth };
