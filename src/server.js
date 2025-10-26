import express from 'express';
import connectDB from './config/connectMongo.js';
import userRouter from './routes/userRoutes.js'; // 💡 Import the default export (the router instance)

const app = express();

const PORT = process.env.PORT || 3000;

// app.use((req, res, next) => {
//   res.status(503).send('Under maintenance mode!');
// });

app.use(express.json());

app.use(userRouter);

const startServer = async () => {
  try {
    await connectDB.connectURI();

    app.listen(PORT, () => {
      console.log('Connected to PORT: ', PORT);
    });
  } catch (e) {
    console.log('Failed Connection: ', e.message);
  }
};

startServer();
