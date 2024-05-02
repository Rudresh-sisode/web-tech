import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';

import embedRoutes from './routes/embed.routes';
import botRoutes from './routes/retr-aug-gen.routes';

// import userRoutes from './routes/user.routes';


const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
var corsOptions = {
  origin: '*', // Or specify origins
  methods: 'GET,POST,PUT,DELETE,OPTIONS',
  allowedHeaders: 'Origin, X-Requested-With, Content-Type, Accept, Authorization'
}

app.use(cors(corsOptions));

app.use('/embedding', embedRoutes);
app.use('/bot', botRoutes);
// app.use('/auth', userRoutes);

// app.get('/testi-api', (req, res) => {
//     res.send({ express: 'Hello From Express' });
// });


export default app;