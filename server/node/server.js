/**
 * Satellizer Node.js Example
 * (c) 2015 Sahat Yalkabov
 * License: MIT
 */

var path = require('path');
var qs = require('querystring');

var async = require('async');
var bcrypt = require('bcryptjs');
var bodyParser = require('body-parser');
var colors = require('colors');
var cors = require('cors');
var express = require('express');
var logger = require('morgan');
var jwt = require('jwt-simple');
var moment = require('moment');
var mongoose = require('mongoose');
var mongojs = require('mongojs');
var request = require('request');
var multer= require('multer');
var crypto = require('crypto');
var mime = require('mime');
var fs = require('fs');

//var imgPath = '/Projects/my_satellizer/examples/server/node/upload/img.jpg';

var config = require('./config');

var userSchema = new mongoose.Schema({
  email: { type: String, unique: true, lowercase: true },
  password: { type: String, select: false },
  displayName: String,
  picture: String,
  bitbucket: String,
  facebook: String,
  foursquare: String,
  google: String,
  github: String,
  instagram: String,
  linkedin: String,
  live: String,
  yahoo: String,
  twitter: String,
  twitch: String
});

var contactlistSchema = new mongoose.Schema({
    
  
    name: {
        type: String,
        unique: true,
        required: true
    },
  email: {
        type: String,
        required: true
    },
  number: {
		type: String,
        required: true
	}
});

var profSchema = new mongoose.Schema({
    
  
    username: {
        type: String,
        unique: true,
        required: true
    },
  designation: {
        type: String,
        required: true
    },
  city: {
		type: String,
        required: true
	}
});


//var reviewSchema = new mongoose.Schema({
//    rating:  {
//        type: Number,
//        min: 1,
//        max: 5,
//        required: true
//    },
//    comment:  {
//        type: String,
//        required: true
//    },
//    author:  {
//        type: String,
//        required: true
//    },
//    date: {
//            type: Date,
//            required: true
//    }
//}, 
//{
//    timestamps: true
//});


var professionalSchema = new mongoose.Schema({
    
  
    username: {
        type: String,
        unique: true,
        required: true
    },
  fname: String,
  lname: String,
  image: String,
  designation: String,
  email: String,
  mobile: String,
  phone: String,
  services: String,
  address: String,
  city: String,
  state: String,
  country: String,
  pincode: String,
  company: String,
  timefrom: String,
  timeto: String,
  days: String,
  workdescription: String,
  reviews :[
      {  
      rating: {
        type: Number,
        min: 1,
        max: 5,
        required: true
    },
    comment:  {
        type: String,
        required: true
    },
    author:  {
        type: String,
        required: true
    },
    date: {
            type: Date,
            required: true
    }
      }
  ]
}
// {
//    timestamps: true
//}                                           
);

var imgSchema = new mongoose.Schema({

    name: String,
    email:String,
    img: { data: Buffer, contentType: String }

});


userSchema.pre('save', function(next) {
  var user = this;
  if (!user.isModified('password')) {
    return next();
  }
  bcrypt.genSalt(10, function(err, salt) {
    bcrypt.hash(user.password, salt, function(err, hash) {
      user.password = hash;
      next();
    });
  });
});

userSchema.methods.comparePassword = function(password, done) {
  bcrypt.compare(password, this.password, function(err, isMatch) {
    done(err, isMatch);
  });
};

var User = mongoose.model('User', userSchema);
var Contactlist = mongoose.model('Contactlist', contactlistSchema);
var Professional = mongoose.model('Professional', professionalSchema);
var Prof = mongoose.model('Prof', profSchema);
var Image = mongoose.model('Image', imgSchema);
//var Review = mongoose.model('Review', reviewSchema);


mongoose.connect(config.MONGO_URI);
mongoose.connection.on('error', function(err) {
  console.log('Error: Could not connect to MongoDB. Did you forget to run `mongod`?'.red);
});

var app = express();

app.set('port', process.env.PORT || 4000);
app.use(cors());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
//app.use(multer({dest: './upload/'}).array('file'));
//app.use(multer({
//  dest: './upload/',
//  rename: function (fieldname, filename) {
//    return filename.replace(/\W+/g, '-').toLowerCase() + Date.now()
//  }
//}).single('file'));

//app.use(multer({ dest: './upload/',
// rename: function (fieldname, filename) {
// return  filename;
//      },
// }).single('file'));

// Force HTTPS on Heroku
if (app.get('env') === 'production') {
  app.use(function(req, res, next) {
    var protocol = req.get('x-forwarded-proto');
    protocol == 'https' ? next() : res.redirect('https://' + req.hostname + req.url);
  });
}
app.use(express.static(path.join(__dirname, '../../client')));

/*
 |--------------------------------------------------------------------------
 | Login Required Middleware
 |--------------------------------------------------------------------------
 */
function ensureAuthenticated(req, res, next) {
  if (!req.header('Authorization')) {
    return res.status(401).send({ message: 'Please make sure your request has an Authorization header' });
  }
  var token = req.header('Authorization').split(' ')[1];

  var payload = null;
  try {
    payload = jwt.decode(token, config.TOKEN_SECRET);
  }
  catch (err) {
    return res.status(401).send({ message: err.message });
  }

  if (payload.exp <= moment().unix()) {
    return res.status(401).send({ message: 'Token has expired' });
  }
  req.user = payload.sub;
  next();
}

/*
 |--------------------------------------------------------------------------
 | Generate JSON Web Token
 |--------------------------------------------------------------------------
 */
function createJWT(user) {
  var payload = {
    sub: user._id,
    iat: moment().unix(),
    exp: moment().add(14, 'days').unix()
  };
    console.log("return jwt payload");
  return jwt.encode(payload, config.TOKEN_SECRET);
}

/*
 |--------------------------------------------------------------------------
 | GET /api/me
 |--------------------------------------------------------------------------
 */
app.get('/api/me', ensureAuthenticated, function(req, res) {
  User.findById(req.user, function(err, user) {
    res.send(user);
  });
});

/*
 |--------------------------------------------------------------------------
 | PUT /api/me
 |--------------------------------------------------------------------------
 */
app.put('/api/me', ensureAuthenticated, function(req, res) {
  User.findById(req.user, function(err, user) {
    if (!user) {
      return res.status(400).send({ message: 'User not found' });
    }
    user.displayName = req.body.displayName || user.displayName;
    user.email = req.body.email || user.email;
    user.save(function(err) {
      res.status(200).end();
    });
  });
});


/*
 |--------------------------------------------------------------------------
 | Log in with Email
 |--------------------------------------------------------------------------
 */
app.post('/auth/login', function(req, res) {
  User.findOne({ email: req.body.email }, '+password', function(err, user) {
      console.log("In server/auth/login");
    if (!user) {
        console.log("User not found");
      return res.status(401).send({ message: 'Invalid email and/or password' });
    }
    user.comparePassword(req.body.password, function(err, isMatch) {
      if (!isMatch) {
          console.log("password not match");
        return res.status(401).send({ message: 'Invalid email and/or password' });
      }
        console.log("send token");
      res.json({success: true, token: createJWT(user) });
    });
  });
});

/*
 |--------------------------------------------------------------------------
 | Create Email and Password Account
 |--------------------------------------------------------------------------
 */
app.post('/auth/signup', function(req, res) {
  User.findOne({ email: req.body.email }, function(err, existingUser) {
    if (existingUser) {
      return res.status(409).send({ message: 'Email is already taken' });
    }
    var user = new User({
      displayName: req.body.displayName,
      email: req.body.email,
      password: req.body.password
    });
    user.save(function(err, result) {
      if (err) {
        res.status(500).send({ message: err.message });
      }
      res.json({success: true, token: createJWT(result) });
    });
  });
});


/*
 |--------------------------------------------------------------------------
 | Create New Prof - Post
 |--------------------------------------------------------------------------
 */
app.post('/prof', function(req, res) {
  if (!req.body.username || !req.body.designation || !req.body.city) {
    res.json({success: false, msg: 'Please pass username, designation and city.'});
  } 
    var newProf = new Prof({
    
      username: req.body.username,
      designation: req.body.designation,
	  city: req.body.city
    });
    
    Prof.findOne({ username: req.body.username }, function(err, existingProf) {
    if (existingProf) {
      req.flash('errors', { msg: 'Prof with that username exists.' });
      return res.redirect('/contactlist');
    }
    // save the contact
    newProf.save(function(err) {
      if (err) {
        res.status(500).send({ message: err.message });
      }
      
        res.redirect('/contactlist');
    });
  })
});



/*
 |--------------------------------------------------------------------------
 | Save Image In uploads folder using multer
 |--------------------------------------------------------------------------
 */

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './upload')
  },
  filename: function (req, file, cb) {
   // crypto.pseudoRandomBytes(16, function (err, raw)
                             {
      cb(null, file.originalname);
                                 
//    filename: function (req, file, cb) {
//        cb(null, file.originalname+ '-' + Date.now()+'.jpg')
//    }                             
        
//         cb(null, raw.toString('hex') + Date.now() + '.' + mime.extension(file.mimetype));
        
    }
      //);
  }
})

var upload = multer({ storage: storage })
//
//app.post('/upload', upload.array('file'), function(req, res){
//    
//console.log('Server:', req.body);
//    console.log('Server:', req.files);
//    res.json({success: true});
//   });

app.post('/upload', upload.single('file'),  function(req, res){
    
console.log('Server:', req.body);
    console.log('Server:', req.file);
 //res.json({success: true});
   
    var newImage = new Image();
    newImage.name = req.body.name;
    newImage.email = req.body.email;
    newImage.img.data =         fs.readFileSync(req.file.path);
    newImage.img.contentType='image/jpg';           newImage.save();
    
    
    
   
    
    

});



//Image.remove(function(err){
// 
//    if (err) throw err;
//
//    console.error('removed old docs');
//
//    // store an img in binary in mongo
//    var newImage = new Image;
//    newImage.img.data = fs.readFileSync(imgPath);
//    newImage.img.contentType = 'image/jpg';
//    newImage.save(function (err, a) {
//      if (err) throw err;
//
//      console.error('saved img to mongo');
//
//    
//});
//});
//    
// app.get('/getcake', function(req, res) {
//        console.log("Get cake function");
//        model.find(function (err, doc) {
//            if (err) return next(err);
//        var base64 = (doc[0].img.data.toString('base64'));
//         res.send(base64);        
//        });
//    });



/*
 |--------------------------------------------------------------------------
 | Create New Contact - Post
 |--------------------------------------------------------------------------
 */


app.post('/contactlist', function(req, res) {
  if (!req.body.name || !req.body.email || !req.body.number) {
    res.json({success: false, msg: 'Please pass name, email and password.'});
  } 
    var newContact = new Contactlist({
    
      name: req.body.name,
      email: req.body.email,
	  number: req.body.number
    });
    
    Contactlist.findOne({ email: req.body.email }, function(err, existingContact) {
    if (existingContact) {
      req.flash('errors', { msg: 'Contact with that email address already exists.' });
      return res.redirect('/contactlist');
    }
    // save the contact
    newContact.save(function(err) {
      if (err) {
        res.status(500).send({ message: err.message });
      }
      
        res.redirect('/contactlist');
    });
  })
});

/*
 |--------------------------------------------------------------------------
 | Get Contacts
 |--------------------------------------------------------------------------
 */

app.get('/contactlist', function(req, res){
console.log("I received a get request")

Contactlist.find(function(err, docs){
console.log(docs);
    res.json(docs);

});
});

/*
 |--------------------------------------------------------------------------
 | Delete Contact from DB
 |--------------------------------------------------------------------------
 */
app.delete('/contactlist/:id', function(req, res){
var id = req.params.id;
    console.log(id);
    
Contactlist.remove({_id: mongojs.ObjectId(id)}, function (err, doc){
    res.json(doc);                
    });
});

/*
 |--------------------------------------------------------------------------
 |Edit Contact 
 |--------------------------------------------------------------------------
 */
app.get('/contactlist/:id', function(req, res){
var id = req.params.id;
    console.log(id);
    Contactlist.findOne({_id: mongojs.ObjectId(id)}, function (err, doc){
    res.json(doc);                
    });
});

/*
 |--------------------------------------------------------------------------
 | Update Contact 
 |--------------------------------------------------------------------------
 */
app.put('/contactlist/:id', function(req, res){
var id = req.params.id;
    var query = {_id: mongojs.ObjectId(id)};
    var update = {$set: {name: req.body.name, email: req.body.email, number: req.body.number}};
    var options =  {new: true};
    console.log(req.body.name);
    Contactlist.findOneAndUpdate(query, update, options, function (err, doc){
        if(err){
        console.log("Something wrong when updating data!");
        }
    res.json(doc); 
        console.log("Alright");
    });
});

/*
 |--------------------------------------------------------------------------
 | Create New Professional - Post
 |--------------------------------------------------------------------------
 */



app.post('/professional', function(req, res) {
    
  if (!req.body.username) {
    res.json({success: false, msg: 'Please Enter Username'});
  } 
    var newProfessional = new Professional({
    
     
  username: req.body.username,
  fname: req.body.fname,
  lname: req.body.lname,
  image: req.body.image,
  designation: req.body.designation,
  email: req.body.email,
  mobile: req.body.mobile,
  phone: req.body.phone,
  services: req.body.services,
  address: req.body.address,
  city: req.body.city,
  state: req.body.state,
  country: req.body.country,
  pincode: req.body.pincode,
  company: req.body.company,
  timefrom: req.body.timefrom,
  timeto: req.body.timeto,
  days: req.body.days,
  workdescription: req.body.workdescription
  // reviews :[reviewSchema]         
    
    });
    
    
    console.log('server.js:', req.body.username);
    console.log('server.js:', req.body.fname);
    console.log('server.js:', req.body.lname);
     console.log('server.js:', req.body.image);
    console.log('server.js:', req.body.designation);
    console.log('server.js:', req.body.email);
     console.log('server.js:', req.body.mobile);
    console.log('server.js:', req.body.phone);
    console.log('server.js:', req.body.services);
     console.log('server.js:', req.body.address);
    console.log('server.js:', req.body.city);
    console.log('server.js:', req.body.state);
     console.log('server.js:', req.body.country);
    console.log('server.js:', req.body.pinode);
    console.log('server.js:', req.body.company);
     console.log('server.js:', req.body.timefrom);
    console.log('server.js:', req.body.timeto);
    console.log('server.js:', req.body.days);
     console.log('server.js:', req.body.workdescription);
    
    
    
    Professional.findOne({ username: req.body.username }, function(err, existingUsername) {
    if (existingUsername) {
      req.flash('errors', { msg: 'Professional with that username  already exists.' });
      return res.redirect('/professional');
    }
    // save the contact
    newProfessional.save(function(err) {
      if (err) {
        res.status(500).send({ message: err.message });
      }
      
        res.redirect('/professional');
    });
  })
});


app.post('/professional/id/', function(req, res, next){
    
    
    console.log('server.js: This is the Comment', req.body.comment);
    console.log('server.js: This is the Date', req.body.date);
    console.log('server.js: This is the Rating', req.body.rating);
    console.log('server.js: This is the Author', req.body.author);
    
//    Professional.update({_id: req.params._id}, {$push: {reviews: {rating: req.body.rating, comment: req.body.comment, author: req.body.author, date: req.body.date}}}, function(err, professional){
//   
////        professional.reviews.push({rating: req.body.rating, comment: req.body.comment, author: req.body.author, date: req.body.date});
//       // reviews.save(function(err){
//        
//            Professional.save(function(err, professional){
//            
//                if(err) {
//console.log('server.js: connot save reviews to professional')
//						} else {
//							res.json('server.js: saved Reviews', professional);
//						}
//            })
//        //})
//    })
    
    
    
  //  if(req.body.hasOwnProperty('reviews')){
    
        Professional.update(
        
            { _id: req.params._id },
            {$push: {reviews: {rating: req.body.rating, comment: req.body.comment, author: req.body.author, date: new Date()}}},
            function(err, data){
                if(err)
                    return res.send(err);
                 console.log('server.js: This is the Comment', req.body.comment);
                
//                data.save(function (err, data){       
//           if(err) next(err);                                       console.log('Updated Reviews');
//            res.json(data);
//        });
               
                Professional.findByIdAndUpdate({_id: req.params._id}, function(err,data){
                if(err)
                    res.send(err);
                    return res.json(data);
                });
            }
        );
    
    
    
    
  //  }
   // else {
    
       // return res.send('Error Error');
   // }
    
    
//    Professional.findById(req.params._id, function(err, professional){
//    
//        if(err) next(err);
//        professional.reviews.push(req.body);
//        professional.save(function (err, professional){
//        
//            if(err) next(err);
//            console.log('Updated Reviews');
//            res.json(professional);
//        });
//    });
//    

});

/*
 |--------------------------------------------------------------------------
 | Get Professionals
 |--------------------------------------------------------------------------
 */

app.get('/professional', function(req, res){
console.log("I received a get request")

Professional.find(function(err, docs){
console.log(docs);
    res.json(docs);

});
});

//app.get('/professional/:professional', function(req, res){
//
//    req.post.populate('review', function(err, doc){
//    console.log(doc);
//        res.json(doc);
//    });
//});





/*
 |--------------------------------------------------------------------------
 | Login with Google
 |--------------------------------------------------------------------------
 */
app.post('/auth/google', function(req, res) {
  var accessTokenUrl = 'https://accounts.google.com/o/oauth2/token';
  var peopleApiUrl = 'https://www.googleapis.com/plus/v1/people/me/openIdConnect';
  var params = {
    code: req.body.code,
    client_id: req.body.clientId,
    client_secret: config.GOOGLE_SECRET,
    redirect_uri: req.body.redirectUri,
    grant_type: 'authorization_code'
  };

  // Step 1. Exchange authorization code for access token.
  request.post(accessTokenUrl, { json: true, form: params }, function(err, response, token) {
    var accessToken = token.access_token;
    var headers = { Authorization: 'Bearer ' + accessToken };

    // Step 2. Retrieve profile information about the current user.
    request.get({ url: peopleApiUrl, headers: headers, json: true }, function(err, response, profile) {
      if (profile.error) {
        return res.status(500).send({message: profile.error.message});
      }
      // Step 3a. Link user accounts.
      if (req.header('Authorization')) {
        User.findOne({ google: profile.sub }, function(err, existingUser) {
          if (existingUser) {
            return res.status(409).send({ message: 'There is already a Google account that belongs to you' });
          }
          var token = req.header('Authorization').split(' ')[1];
          var payload = jwt.decode(token, config.TOKEN_SECRET);
          User.findById(payload.sub, function(err, user) {
            if (!user) {
              return res.status(400).send({ message: 'User not found' });
            }
            user.google = profile.sub;
            user.picture = user.picture || profile.picture.replace('sz=50', 'sz=200');
            user.displayName = user.displayName || profile.name;
            user.save(function() {
              var token = createJWT(user);
              res.send({ token: token });
            });
          });
        });
      } else {
        // Step 3b. Create a new user account or return an existing one.
        User.findOne({ google: profile.sub }, function(err, existingUser) {
          if (existingUser) {
            return res.send({ token: createJWT(existingUser) });
          }
          var user = new User();
          user.google = profile.sub;
          user.picture = profile.picture.replace('sz=50', 'sz=200');
          user.displayName = profile.name;
          user.save(function(err) {
            var token = createJWT(user);
            res.send({ token: token });
          });
        });
      }
    });
  });
});

/*
 |--------------------------------------------------------------------------
 | Login with GitHub
 |--------------------------------------------------------------------------
 */
app.post('/auth/github', function(req, res) {
  var accessTokenUrl = 'https://github.com/login/oauth/access_token';
  var userApiUrl = 'https://api.github.com/user';
  var params = {
    code: req.body.code,
    client_id: req.body.clientId,
    client_secret: config.GITHUB_SECRET,
    redirect_uri: req.body.redirectUri
  };

  // Step 1. Exchange authorization code for access token.
  request.get({ url: accessTokenUrl, qs: params }, function(err, response, accessToken) {
    accessToken = qs.parse(accessToken);
    var headers = { 'User-Agent': 'Satellizer' };

    // Step 2. Retrieve profile information about the current user.
    request.get({ url: userApiUrl, qs: accessToken, headers: headers, json: true }, function(err, response, profile) {

      // Step 3a. Link user accounts.
      if (req.header('Authorization')) {
        User.findOne({ github: profile.id }, function(err, existingUser) {
          if (existingUser) {
            return res.status(409).send({ message: 'There is already a GitHub account that belongs to you' });
          }
          var token = req.header('Authorization').split(' ')[1];
          var payload = jwt.decode(token, config.TOKEN_SECRET);
          User.findById(payload.sub, function(err, user) {
            if (!user) {
              return res.status(400).send({ message: 'User not found' });
            }
            user.github = profile.id;
            user.picture = user.picture || profile.avatar_url;
            user.displayName = user.displayName || profile.name;
            user.save(function() {
              var token = createJWT(user);
              res.send({ token: token });
            });
          });
        });
      } else {
        // Step 3b. Create a new user account or return an existing one.
        User.findOne({ github: profile.id }, function(err, existingUser) {
          if (existingUser) {
            var token = createJWT(existingUser);
            return res.send({ token: token });
          }
          var user = new User();
          user.github = profile.id;
          user.picture = profile.avatar_url;
          user.displayName = profile.name;
          user.save(function() {
            var token = createJWT(user);
            res.send({ token: token });
          });
        });
      }
    });
  });
});

/*
|--------------------------------------------------------------------------
| Login with Instagram
|--------------------------------------------------------------------------
*/
app.post('/auth/instagram', function(req, res) {
  var accessTokenUrl = 'https://api.instagram.com/oauth/access_token';

  var params = {
    client_id: req.body.clientId,
    redirect_uri: req.body.redirectUri,
    client_secret: config.INSTAGRAM_SECRET,
    code: req.body.code,
    grant_type: 'authorization_code'
  };

  // Step 1. Exchange authorization code for access token.
  request.post({ url: accessTokenUrl, form: params, json: true }, function(error, response, body) {

    // Step 2a. Link user accounts.
    if (req.header('Authorization')) {
      User.findOne({ instagram: body.user.id }, function(err, existingUser) {
        if (existingUser) {
          return res.status(409).send({ message: 'There is already an Instagram account that belongs to you' });
        }

        var token = req.header('Authorization').split(' ')[1];
        var payload = jwt.decode(token, config.TOKEN_SECRET);

        User.findById(payload.sub, function(err, user) {
          if (!user) {
            return res.status(400).send({ message: 'User not found' });
          }
          user.instagram = body.user.id;
          user.picture = user.picture || body.user.profile_picture;
          user.displayName = user.displayName || body.user.username;
          user.save(function() {
            var token = createJWT(user);
            res.send({ token: token });
          });
        });
      });
    } else {
      // Step 2b. Create a new user account or return an existing one.
      User.findOne({ instagram: body.user.id }, function(err, existingUser) {
        if (existingUser) {
          return res.send({ token: createJWT(existingUser) });
        }

        var user = new User({
          instagram: body.user.id,
          picture: body.user.profile_picture,
          displayName: body.user.username
        });

        user.save(function() {
          var token = createJWT(user);
          res.send({ token: token, user: user });
        });
      });
    }
  });
});

/*
 |--------------------------------------------------------------------------
 | Login with LinkedIn
 |--------------------------------------------------------------------------
 */
app.post('/auth/linkedin', function(req, res) {
  var accessTokenUrl = 'https://www.linkedin.com/uas/oauth2/accessToken';
  var peopleApiUrl = 'https://api.linkedin.com/v1/people/~:(id,first-name,last-name,email-address,picture-url)';
  var params = {
    code: req.body.code,
    client_id: req.body.clientId,
    client_secret: config.LINKEDIN_SECRET,
    redirect_uri: req.body.redirectUri,
    grant_type: 'authorization_code'
  };

  // Step 1. Exchange authorization code for access token.
  request.post(accessTokenUrl, { form: params, json: true }, function(err, response, body) {
    if (response.statusCode !== 200) {
      return res.status(response.statusCode).send({ message: body.error_description });
    }
    var params = {
      oauth2_access_token: body.access_token,
      format: 'json'
    };

    // Step 2. Retrieve profile information about the current user.
    request.get({ url: peopleApiUrl, qs: params, json: true }, function(err, response, profile) {

      // Step 3a. Link user accounts.
      if (req.header('Authorization')) {
        User.findOne({ linkedin: profile.id }, function(err, existingUser) {
          if (existingUser) {
            return res.status(409).send({ message: 'There is already a LinkedIn account that belongs to you' });
          }
          var token = req.header('Authorization').split(' ')[1];
          var payload = jwt.decode(token, config.TOKEN_SECRET);
          User.findById(payload.sub, function(err, user) {
            if (!user) {
              return res.status(400).send({ message: 'User not found' });
            }
            user.linkedin = profile.id;
            user.picture = user.picture || profile.pictureUrl;
            user.displayName = user.displayName || profile.firstName + ' ' + profile.lastName;
            user.save(function() {
              var token = createJWT(user);
              res.send({ token: token });
            });
          });
        });
      } else {
        // Step 3b. Create a new user account or return an existing one.
        User.findOne({ linkedin: profile.id }, function(err, existingUser) {
          if (existingUser) {
            return res.send({ token: createJWT(existingUser) });
          }
          var user = new User();
          user.linkedin = profile.id;
          user.picture = profile.pictureUrl;
          user.displayName = profile.firstName + ' ' + profile.lastName;
          user.save(function() {
            var token = createJWT(user);
            res.send({ token: token });
          });
        });
      }
    });
  });
});

/*
 |--------------------------------------------------------------------------
 | Login with Windows Live
 |--------------------------------------------------------------------------
 */
app.post('/auth/live', function(req, res) {
  async.waterfall([
    // Step 1. Exchange authorization code for access token.
    function(done) {
      var accessTokenUrl = 'https://login.live.com/oauth20_token.srf';
      var params = {
        code: req.body.code,
        client_id: req.body.clientId,
        client_secret: config.WINDOWS_LIVE_SECRET,
        redirect_uri: req.body.redirectUri,
        grant_type: 'authorization_code'
      };
      request.post(accessTokenUrl, { form: params, json: true }, function(err, response, accessToken) {
        done(null, accessToken);
      });
    },
    // Step 2. Retrieve profile information about the current user.
    function(accessToken, done) {
      var profileUrl = 'https://apis.live.net/v5.0/me?access_token=' + accessToken.access_token;
      request.get({ url: profileUrl, json: true }, function(err, response, profile) {
        done(err, profile);
      });
    },
    function(profile) {
      // Step 3a. Link user accounts.
      if (req.header('Authorization')) {
        User.findOne({ live: profile.id }, function(err, user) {
          if (user) {
            return res.status(409).send({ message: 'There is already a Windows Live account that belongs to you' });
          }
          var token = req.header('Authorization').split(' ')[1];
          var payload = jwt.decode(token, config.TOKEN_SECRET);
          User.findById(payload.sub, function(err, existingUser) {
            if (!existingUser) {
              return res.status(400).send({ message: 'User not found' });
            }
            existingUser.live = profile.id;
            existingUser.displayName = existingUser.displayName || profile.name;
            existingUser.save(function() {
              var token = createJWT(existingUser);
              res.send({ token: token });
            });
          });
        });
      } else {
        // Step 3b. Create a new user or return an existing account.
        User.findOne({ live: profile.id }, function(err, user) {
          if (user) {
            return res.send({ token: createJWT(user) });
          }
          var newUser = new User();
          newUser.live = profile.id;
          newUser.displayName = profile.name;
          newUser.save(function() {
            var token = createJWT(newUser);
            res.send({ token: token });
          });
        });
      }
    }
  ]);
});

/*
 |--------------------------------------------------------------------------
 | Login with Facebook
 |--------------------------------------------------------------------------
 */
app.post('/auth/facebook', function(req, res) {
  var fields = ['id', 'email', 'first_name', 'last_name', 'link', 'name'];
  var accessTokenUrl = 'https://graph.facebook.com/v2.5/oauth/access_token';
  var graphApiUrl = 'https://graph.facebook.com/v2.5/me?fields=' + fields.join(',');
  var params = {
    code: req.body.code,
    client_id: req.body.clientId,
    client_secret: config.FACEBOOK_SECRET,
    redirect_uri: req.body.redirectUri
  };

  // Step 1. Exchange authorization code for access token.
  request.get({ url: accessTokenUrl, qs: params, json: true }, function(err, response, accessToken) {
    if (response.statusCode !== 200) {
      return res.status(500).send({ message: accessToken.error.message });
    }

    // Step 2. Retrieve profile information about the current user.
    request.get({ url: graphApiUrl, qs: accessToken, json: true }, function(err, response, profile) {
      if (response.statusCode !== 200) {
        return res.status(500).send({ message: profile.error.message });
      }
      if (req.header('Authorization')) {
        User.findOne({ facebook: profile.id }, function(err, existingUser) {
          if (existingUser) {
            return res.status(409).send({ message: 'There is already a Facebook account that belongs to you' });
          }
          var token = req.header('Authorization').split(' ')[1];
          var payload = jwt.decode(token, config.TOKEN_SECRET);
          User.findById(payload.sub, function(err, user) {
            if (!user) {
              return res.status(400).send({ message: 'User not found' });
            }
            user.facebook = profile.id;
            user.picture = user.picture || 'https://graph.facebook.com/v2.3/' + profile.id + '/picture?type=large';
            user.displayName = user.displayName || profile.name;
            user.save(function() {
              var token = createJWT(user);
              res.send({ token: token });
            });
          });
        });
      } else {
        // Step 3. Create a new user account or return an existing one.
        User.findOne({ facebook: profile.id }, function(err, existingUser) {
          if (existingUser) {
            var token = createJWT(existingUser);
            return res.send({ token: token });
          }
          var user = new User();
          user.facebook = profile.id;
          user.picture = 'https://graph.facebook.com/' + profile.id + '/picture?type=large';
          user.displayName = profile.name;
          user.save(function() {
            var token = createJWT(user);
            res.send({ token: token });
          });
        });
      }
    });
  });
});

/*
 |--------------------------------------------------------------------------
 | Login with Yahoo
 |--------------------------------------------------------------------------
 */
app.post('/auth/yahoo', function(req, res) {
  var accessTokenUrl = 'https://api.login.yahoo.com/oauth2/get_token';
  var clientId = req.body.clientId;
  var clientSecret = config.YAHOO_SECRET;
  var formData = {
    code: req.body.code,
    redirect_uri: req.body.redirectUri,
    grant_type: 'authorization_code'
  };
  var headers = { Authorization: 'Basic ' + new Buffer(clientId + ':' + clientSecret).toString('base64') };

  // Step 1. Exchange authorization code for access token.
  request.post({ url: accessTokenUrl, form: formData, headers: headers, json: true }, function(err, response, body) {
    var socialApiUrl = 'https://social.yahooapis.com/v1/user/' + body.xoauth_yahoo_guid + '/profile?format=json';
    var headers = { Authorization: 'Bearer ' + body.access_token };

    // Step 2. Retrieve profile information about the current user.
    request.get({ url: socialApiUrl, headers: headers, json: true }, function(err, response, body) {

      // Step 3a. Link user accounts.
      if (req.header('Authorization')) {
        User.findOne({ yahoo: body.profile.guid }, function(err, existingUser) {
          if (existingUser) {
            return res.status(409).send({ message: 'There is already a Yahoo account that belongs to you' });
          }
          var token = req.header('Authorization').split(' ')[1];
          var payload = jwt.decode(token, config.TOKEN_SECRET);
          User.findById(payload.sub, function(err, user) {
            if (!user) {
              return res.status(400).send({ message: 'User not found' });
            }
            user.yahoo = body.profile.guid;
            user.displayName = user.displayName || body.profile.nickname;
            user.save(function() {
              var token = createJWT(user);
              res.send({ token: token });
            });
          });
        });
      } else {
        // Step 3b. Create a new user account or return an existing one.
        User.findOne({ yahoo: body.profile.guid }, function(err, existingUser) {
          if (existingUser) {
            return res.send({ token: createJWT(existingUser) });
          }
          var user = new User();
          user.yahoo = body.profile.guid;
          user.displayName = body.profile.nickname;
          user.save(function() {
            var token = createJWT(user);
            res.send({ token: token });
          });
        });
      }
    });
  });
});

/*
 |--------------------------------------------------------------------------
 | Login with Twitter
 |--------------------------------------------------------------------------
 */
app.post('/auth/twitter', function(req, res) {
  var requestTokenUrl = 'https://api.twitter.com/oauth/request_token';
  var accessTokenUrl = 'https://api.twitter.com/oauth/access_token';
  var profileUrl = 'https://api.twitter.com/1.1/users/show.json?screen_name=';

  // Part 1 of 2: Initial request from Satellizer.
  if (!req.body.oauth_token || !req.body.oauth_verifier) {
    var requestTokenOauth = {
      consumer_key: config.TWITTER_KEY,
      consumer_secret: config.TWITTER_SECRET,
      callback: req.body.redirectUri
    };

    // Step 1. Obtain request token for the authorization popup.
    request.post({ url: requestTokenUrl, oauth: requestTokenOauth }, function(err, response, body) {
      var oauthToken = qs.parse(body);

      // Step 2. Send OAuth token back to open the authorization screen.
      res.send(oauthToken);
    });
  } else {
    // Part 2 of 2: Second request after Authorize app is clicked.
    var accessTokenOauth = {
      consumer_key: config.TWITTER_KEY,
      consumer_secret: config.TWITTER_SECRET,
      token: req.body.oauth_token,
      verifier: req.body.oauth_verifier
    };

    // Step 3. Exchange oauth token and oauth verifier for access token.
    request.post({ url: accessTokenUrl, oauth: accessTokenOauth }, function(err, response, accessToken) {

      accessToken = qs.parse(accessToken);

      var profileOauth = {
        consumer_key: config.TWITTER_KEY,
        consumer_secret: config.TWITTER_SECRET,
        oauth_token: accessToken.oauth_token
      };

      // Step 4. Retrieve profile information about the current user.
      request.get({
        url: profileUrl + accessToken.screen_name,
        oauth: profileOauth,
        json: true
      }, function(err, response, profile) {

        // Step 5a. Link user accounts.
        if (req.header('Authorization')) {
          User.findOne({ twitter: profile.id }, function(err, existingUser) {
            if (existingUser) {
              return res.status(409).send({ message: 'There is already a Twitter account that belongs to you' });
            }

            var token = req.header('Authorization').split(' ')[1];
            var payload = jwt.decode(token, config.TOKEN_SECRET);

            User.findById(payload.sub, function(err, user) {
              if (!user) {
                return res.status(400).send({ message: 'User not found' });
              }

              user.twitter = profile.id;
              user.displayName = user.displayName || profile.name;
              user.picture = user.picture || profile.profile_image_url.replace('_normal', '');
              user.save(function(err) {
                res.send({ token: createJWT(user) });
              });
            });
          });
        } else {
          // Step 5b. Create a new user account or return an existing one.
          User.findOne({ twitter: profile.id }, function(err, existingUser) {
            if (existingUser) {
              return res.send({ token: createJWT(existingUser) });
            }

            var user = new User();
            user.twitter = profile.id;
            user.displayName = profile.name;
            user.picture = profile.profile_image_url.replace('_normal', '');
            user.save(function() {
              res.send({ token: createJWT(user) });
            });
          });
        }
      });
    });
  }
});

/*
 |--------------------------------------------------------------------------
 | Login with Foursquare
 |--------------------------------------------------------------------------
 */
app.post('/auth/foursquare', function(req, res) {
  var accessTokenUrl = 'https://foursquare.com/oauth2/access_token';
  var profileUrl = 'https://api.foursquare.com/v2/users/self';
  var formData = {
    code: req.body.code,
    client_id: req.body.clientId,
    client_secret: config.FOURSQUARE_SECRET,
    redirect_uri: req.body.redirectUri,
    grant_type: 'authorization_code'
  };

  // Step 1. Exchange authorization code for access token.
  request.post({ url: accessTokenUrl, form: formData, json: true }, function(err, response, body) {
    var params = {
      v: '20140806',
      oauth_token: body.access_token
    };

    // Step 2. Retrieve information about the current user.
    request.get({ url: profileUrl, qs: params, json: true }, function(err, response, profile) {
      profile = profile.response.user;

      // Step 3a. Link user accounts.
      if (req.header('Authorization')) {
        User.findOne({ foursquare: profile.id }, function(err, existingUser) {
          if (existingUser) {
            return res.status(409).send({ message: 'There is already a Foursquare account that belongs to you' });
          }
          var token = req.header('Authorization').split(' ')[1];
          var payload = jwt.decode(token, config.TOKEN_SECRET);
          User.findById(payload.sub, function(err, user) {
            if (!user) {
              return res.status(400).send({ message: 'User not found' });
            }
            user.foursquare = profile.id;
            user.picture = user.picture || profile.photo.prefix + '300x300' + profile.photo.suffix;
            user.displayName = user.displayName || profile.firstName + ' ' + profile.lastName;
            user.save(function() {
              var token = createJWT(user);
              res.send({ token: token });
            });
          });
        });
      } else {
        // Step 3b. Create a new user account or return an existing one.
        User.findOne({ foursquare: profile.id }, function(err, existingUser) {
          if (existingUser) {
            var token = createJWT(existingUser);
            return res.send({ token: token });
          }
          var user = new User();
          user.foursquare = profile.id;
          user.picture = profile.photo.prefix + '300x300' + profile.photo.suffix;
          user.displayName = profile.firstName + ' ' + profile.lastName;
          user.save(function() {
            var token = createJWT(user);
            res.send({ token: token });
          });
        });
      }
    });
  });
});

/*
 |--------------------------------------------------------------------------
 | Login with Twitch
 |--------------------------------------------------------------------------
 */
app.post('/auth/twitch', function(req, res) {
  var accessTokenUrl = 'https://api.twitch.tv/kraken/oauth2/token';
  var profileUrl = 'https://api.twitch.tv/kraken/user';
  var formData = {
    code: req.body.code,
    client_id: req.body.clientId,
    client_secret: config.TWITCH_SECRET,
    redirect_uri: req.body.redirectUri,
    grant_type: 'authorization_code'
  };

  // Step 1. Exchange authorization code for access token.
  request.post({ url: accessTokenUrl, form: formData, json: true }, function(err, response, accessToken) {
   var params = {
     oauth_token: accessToken.access_token
   };

    // Step 2. Retrieve information about the current user.
    request.get({ url: profileUrl, qs: params, json: true }, function(err, response, profile) {
      // Step 3a. Link user accounts.
      if (req.header('Authorization')) {
        User.findOne({ twitch: profile._id }, function(err, existingUser) {
          if (existingUser) {
            return res.status(409).send({ message: 'There is already a Twitch account that belongs to you' });
          }
          var token = req.header('Authorization').split(' ')[1];
          var payload = jwt.decode(token, config.TOKEN_SECRET);
          User.findById(payload.sub, function(err, user) {
            if (!user) {
              return res.status(400).send({ message: 'User not found' });
            }
            user.twitch = profile._id;
            user.picture = user.picture || profile.logo;
            user.displayName = user.name || profile.name;
            user.email = user.email || profile.email;
            user.save(function() {
              var token = createJWT(user);
              res.send({ token: token });
            });
          });
        });
      } else {
        // Step 3b. Create a new user account or return an existing one.
        User.findOne({ twitch: profile._id }, function(err, existingUser) {
          if (existingUser) {
            var token = createJWT(existingUser);
            return res.send({ token: token });
          }
          var user = new User();
          user.twitch = profile._id;
          user.picture = profile.logo;
          user.displayName = profile.name;
          user.email = profile.email;
          user.save(function() {
            var token = createJWT(user);
            res.send({ token: token });
          });
        });
      }
    });
  });
});

/*
 |--------------------------------------------------------------------------
 | Login with Bitbucket
 |--------------------------------------------------------------------------
 */
app.post('/auth/bitbucket', function(req, res) {
  var accessTokenUrl = 'https://bitbucket.org/site/oauth2/access_token';
  var userApiUrl = 'https://bitbucket.org/api/2.0/user';
  var emailApiUrl = 'https://bitbucket.org/api/2.0/user/emails';

  var headers = {
    Authorization: 'Basic ' + new Buffer(req.body.clientId + ':' + config.BITBUCKET_SECRET).toString('base64')
  };

  var formData = {
    code: req.body.code,
    redirect_uri: req.body.redirectUri,
    grant_type: 'authorization_code'
  };

  // Step 1. Exchange authorization code for access token.
  request.post({ url: accessTokenUrl, form: formData, headers: headers, json: true }, function(err, response, body) {
    var params = {
      access_token: body.access_token
    };

    // Step 2. Retrieve information about the current user.
    request.get({ url: userApiUrl, qs: params, json: true }, function(err, response, profile) {

      // Step 2.5. Retrieve current user's email.
      request.get({ url: emailApiUrl, qs: params, json: true }, function(err, response, emails) {
        var email = emails.values[0].email;

        // Step 3a. Link user accounts.
        if (req.header('Authorization')) {
          User.findOne({ bitbucket: profile.uuid }, function(err, existingUser) {
            if (existingUser) {
              return res.status(409).send({ message: 'There is already a Bitbucket account that belongs to you' });
            }
            var token = req.header('Authorization').split(' ')[1];
            var payload = jwt.decode(token, config.TOKEN_SECRET);
            User.findById(payload.sub, function(err, user) {
              if (!user) {
                return res.status(400).send({ message: 'User not found' });
              }
              user.bitbucket = profile.uuid;
              user.email = user.email || email;
              user.picture = user.picture || profile.links.avatar.href;
              user.displayName = user.displayName || profile.display_name;
              user.save(function() {
                var token = createJWT(user);
                res.send({ token: token });
              });
            });
          });
        } else {
          // Step 3b. Create a new user account or return an existing one.
          User.findOne({ bitbucket: profile.id }, function(err, existingUser) {
            if (existingUser) {
              var token = createJWT(existingUser);
              return res.send({ token: token });
            }
            var user = new User();
            user.bitbucket = profile.uuid;
            user.email = email;
            user.picture = profile.links.avatar.href;
            user.displayName = profile.display_name;
            user.save(function() {
              var token = createJWT(user);
              res.send({ token: token });
            });
          });
        }
      });
    });
  });
});

/*
 |--------------------------------------------------------------------------
 | Unlink Provider
 |--------------------------------------------------------------------------
 */
app.post('/auth/unlink', ensureAuthenticated, function(req, res) {
  var provider = req.body.provider;
  var providers = ['facebook', 'foursquare', 'google', 'github', 'instagram',
    'linkedin', 'live', 'twitter', 'twitch', 'yahoo'];

  if (providers.indexOf(provider) === -1) {
    return res.status(400).send({ message: 'Unknown OAuth Provider' });
  }

  User.findById(req.user, function(err, user) {
    if (!user) {
      return res.status(400).send({ message: 'User Not Found' });
    }
    user[provider] = undefined;
    user.save(function() {
      res.status(200).end();
    });
  });
});

/*
 |--------------------------------------------------------------------------
 | Start the Server
 |--------------------------------------------------------------------------
 */
app.listen(app.get('port'), function() {
  console.log('Express server listening on port ' + app.get('port'));
});
