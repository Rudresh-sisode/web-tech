const path = require('path');
const {color,log} = require('console-log-colors');
const {red,green,cyan} = color;
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const multer = require('multer');
const cors = require('cors');
require('dotenv').config();
const {graphqlHTTP} = require('express-graphql');
const graphqlSchema = require('./graphql/schema');
const graphqlResolver = require('./graphql/resolvers');

const auth = require('./middleware/is-auth');


const app = express();

const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'images');
  },
  filename: (req, file, cb) => {
    cb(null, new Date().toISOString() + '-' + file.originalname);
  }
});

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === 'image/png' ||
    file.mimetype === 'image/jpg' ||
    file.mimetype === 'image/jpeg'
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

// app.use(bodyParser.urlencoded()); // x-www-form-urlencoded <form>
// app.use(cors());
app.use(bodyParser.json()); // application/json
app.use(
  multer({ storage: fileStorage, fileFilter: fileFilter }).single('image')
);
app.use('/images', express.static(path.join(__dirname, 'images')));

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Methods',
    'OPTIONS, GET, POST, PUT, PATCH, DELETE'
  );

  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if(req.method === 'OPTIONS'){
    return res.sendStatus(200);
  }

  next();
});

app.use(auth);
app.use('/graphql',graphqlHTTP({
  schema:graphqlSchema,
  rootValue:graphqlResolver,
  graphiql:true,
  customFormatErrorFn(err){
    if(!err.originalError){
      return err;
    }
    const data = err.originalError.data;
    const message = err.message;
    const status = "error"
    const code = err.originalError.status || 500
    return { 
      message:message,
      status:code,
      data:data,
      resStatus:status
    }
  }
}))

app.use((error, req, res, next) => {
  console.log(error);
  const status = error.statusCode || 500;
  const message = error.message;
  const data = error.data;
  res.status(status).json({ message: message, data: data });
});

mongoose.connect(`${process.env.URL_PATH}/${process.env.DATABASE}`)
.then(succ=>{
    console.log(cyan("~Database Connected Successfully~"))

    app.listen(8080);
    console.log(cyan("on portal 8080"))
})
.catch(err=>{
    console.log(red("~Database Connection Failed~"+err))
})

