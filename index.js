// const express = require('express');
// const jwt = require('jsonwebtoken');

// const app = express();

// app.get('/',(req,res)=>{
//     res.send('Welcome to app')
// });

// app.get('/api',(req,res)=>{
//     res.send('Welcome to the api')
//     console.log('hi');
// });

// app.post('/api/post', verifyToken,(req,res)=>{
//     jwt.verify(req.token, 'secretkey', (err,authdata)=>{
//         if(err){
//             res.sendStatus(403);
//         }else{
//             res.send('post route')
//         }

//     })
// });

// app.post('/api/login',(req,res)=>{
//     //Mock User
//     const user = {
//         id:1,
//         username: 'brad',
//         email: 'email@email.com'
//     }

//     jwt.sign({user:user}, 'secretkey',(err,token)=>{
//         res.json({
//             token:token
//         })
//     });
// })

// function verifyToken(req,res,next){
//     const bearerHeader = req.headers['authorization'];
//     if(typeof bearerHeader !=='undefined'){
//         const bearer = bearerHeader.split(' ');
//         const bearerToken = bearer[1];
//         req.token = bearerToken;
//         next();
//     }else{
//         res.sendStatus(403);
//     }
// }


// app.listen(5000,()=>{console.log('Server started on port:5000');})

//******************************************************** */
//******************************************************** */
//******************************************************** */
//******************************************************** */
//******************************************************** */
//******************************************************** */
//******************************************************** */
//******************************************************** */
//******************************************************** */
//******************************************************** */


// 'use strict';

// var express = require('express'),
//   app = express(),
//   port = process.env.PORT || 3000,


// //   User = require('./models/userModel'),
//   List = require('./models/Model'),
//   bodyParser = require('body-parser'),
//   jsonwebtoken = require("jsonwebtoken");


// const mongoose = require('mongoose');
// const option = {
//     socketTimeoutMS: 30000,
//     keepAlive: true,
//     reconnectTries: 30000
// };

// // const mongoURI = process.env.MONGODB_URI;
// // mongoose.connect('mongodb://127.0.0.1:27017/?compressors=disabled&gssapiServiceName=mongodb', option).then(function(){
// //     //connected successfully
// //     console.log('connected succesfully');
// // }, function(err) {
// //     //err handle
// //     console.log(err);
// // });

// const URI = 'mongodb+srv://rajarshi:pendulum%4023@cluster0.lgotk.mongodb.net/myFirstDatabase?retryWrites=true&w=majority'

// mongoose.connect(URI, {
//    useNewUrlParser: true, 
//    useUnifiedTopology: true, 
   
// }, err => {
//    if(err) {console.log(URI); throw err;}
   
// })


// app.use(bodyParser.urlencoded({ extended: true }));
// app.use(bodyParser.json());

// app.use(function(req, res, next) {
//   if (req.headers && req.headers.authorization && req.headers.authorization.split(' ')[0] === 'JWT') {
//     jsonwebtoken.verify(req.headers.authorization.split(' ')[1], 'RESTFULAPIs', function(err, decode) {
//       if (err) req.user = undefined;
//       req.user = decode;
//       next();
//     });
//   } else {
//     req.user = undefined;
//     next();
//   }
// });

// var userRoutes = require('./routes/userRoute');
// // console.log(routes(app));
// userRoutes(app);

// var groceryRoutes = require('./routes/groceryRoute');
// // console.log(routes(app));
// groceryRoutes(app);


// app.get('/',(req,res)=>{
//     res.send('Welcome to the api')
//     console.log('hi');
// });

// app.use(function(req, res) {
//    res.status(404).send({ url: req.originalUrl + ' not found' })
// //   res.end();
// });

// app.listen(port);

// console.log('Server started on: ' + port);

// module.exports = app;

//******************************************************** */
//******************************************************** */
//******************************************************** */
//******************************************************** */
//******************************************************** */
//******************************************************** */
//******************************************************** */
//******************************************************** */
//******************************************************** */
//******************************************************** */


const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const User = require("./models/User.js");
const bcrypt = require('bcrypt');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const Item = require("./models/Item.js");


const secret = 'secret123';

mongoose.connect('mongodb+srv://rajarshi:pendulum%4023@cluster0.lgotk.mongodb.net/myFirstDatabase?retryWrites=true&w=majority', {useNewUrlParser:true, useUnifiedTopology:true});
const db = mongoose.connection;
db.on('error', console.log);

const app = express();
app.use(cookieParser());
app.use(bodyParser.json({extended:true}));
app.use(cors({
  credentials:true,
  origin: 'http://localhost:3000',
}));

app.get('/', (req, res) => {
  res.send('ok');
});

app.get('/user', (req, res) => {
  if (!req.cookies.token) {
    return res.json({});
  }
  const payload = jwt.verify(req.cookies.token, secret);
  User.findById(payload.id)
    .then(userInfo => {
      if (!userInfo) {
        return res.json({});
      }
      res.json({id:userInfo._id,email:userInfo.email});
    });
});

app.post('/register', (req, res) => {
  console.log(req.body);
  const {email,password} = req.body;
  const hashedPassword = bcrypt.hashSync(password, 10);
  const user = new User({password:hashedPassword,email});
  user.save().then(userInfo => {
    jwt.sign({id:userInfo._id,email:userInfo.email}, secret, (err,token) => {
      if (err) {
        console.log(err);
        res.sendStatus(500);
      } else {
        res.cookie('token', token).json({id:userInfo._id,email:userInfo.email});
      }
    });
  });
});

app.post('/login', (req, res) => {
  const {email,password} = req.body;
  User.findOne({email})
    .then(userInfo => {
      if (!userInfo) {
        return res.sendStatus(401);
      }
      const passOk = bcrypt.compareSync(password, userInfo.password);
      if (passOk) {
        jwt.sign({id:userInfo._id,email},secret, (err,token) => {
          if (err) {
            console.log(err);
            res.sendStatus(500);
          } else {
            res.cookie('token', token).json({id:userInfo._id,email:userInfo.email});
          }
        });
      } else {
        res.sendStatus(401);
      }
    })
});

app.post('/logout', (req, res) => {
  res.cookie('token', '').send('logout succesful');
});

app.get('/items', (req,res) => {
  const payload = jwt.verify(req.cookies.token, secret);
  Item.where({user:new mongoose.Types.ObjectId(payload.id)})
    .find((err,items) => {
      res.json(items);
    })
});

app.put('/items', (req, res) => {
  const payload = jwt.verify(req.cookies.token, secret);
  const item = new Item({
    text:req.body.text,
    done:false,
    user:new mongoose.Types.ObjectId(payload.id),
  });
  item.save().then(item => {
    res.json(item);
  })
});

app.post('/update-item-status', (req,res) => {
  console.log(req.body);
  const payload = jwt.verify(req.cookies.token, secret);
  Item.updateOne({
    _id:new mongoose.Types.ObjectId(req.body.id),
    user:new mongoose.Types.ObjectId(payload.id)
  }, {
    done:req.body.done,
  }).then(() => {
    res.sendStatus(200);
  });
});

app.listen(4000);
console.log('Server started on port: 4000');