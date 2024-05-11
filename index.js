 const express = require('express');
 const cors = require('cors');
 const { mongoose } = require('mongoose');
 const bcrypt = require('bcryptjs');
 const jwt = require('jsonwebtoken');
 const User = require("./models/User.js");
 const Place = require('./models/Place.js');
 const Booking = require('./models/Booking.js');
 const cookieParser = require('cookie-parser');
 const imageDownloader = require('image-downloader');
 const multer = require('multer');
 const fs = require('fs');
 const { error } = require('console');

 require('dotenv').config()
 const app = express();

 const bcryptSalt = bcrypt.genSaltSync(10);
 const jwtSecret = 'svhdkkktny8vheruwihgt475'

 //YrWL1N03ceXaq78M
 //MSKT7mWc9iKUCDFH
 app.use(express.json());
 app.use(cookieParser());
 app.use('/uploads', express.static(__dirname+'/uploads'));
 app.use(cors());

//  credentials: true,
//    origin:'https://airbnb-caps.netlify.app/',
//    'Access-Control-Allow-Origin': '*'

 mongoose.connect('mongodb+srv://booking:MSKT7mWc9iKUCDFH@cluster0.sgf6cvw.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0');

// Function to extract user data from request cookies
 function getUserDataFromRequest(request) {
  return new Promise((reslove, reject) => {
    jwt.verify(request.cookies.token, jwtSecret, {}, async (err, userData) => {
      if (err) throw err;
      reslove(userData);
    });
  });
 }

 // Test endpoint
 app.get('/test', (request, response) => {
  try {
    response.json('test ok');
  } catch (error) {
    // This catch block will never be executed in this context
    console.error('Error during test:', error);
    response.status(500).json('Internal server error');
  }
});

// Register endpoint
 app.post('/register', async (request,response) => {
  const {name,email,password} = request.body;
  try { 
  const userDoc = await User.create({
      name,
      email,
      password:bcrypt.hashSync(password, bcryptSalt),
   })

   response.json(userDoc);
  } catch (error) {
    console.error('Error during registration:', error);
    response.status(422).json({ error: 'Internal server error' });
  }
 });

 // Login endpoint
 app.post('/login', async (request, response) => {
  const {email,password} = request.body;
  const userDoc = await User.findOne({email});
  if (userDoc) {
    const passOk = bcrypt.compareSync(password, userDoc.password);
    if (passOk) {
      jwt.sign({
        emai:userDoc.email, 
        id:userDoc._id
      }, jwtSecret, {}, (err,token) => {
        if (err) throw err;
        response.cookie('token', token).json(userDoc);
      });   
    } else {
      response.status(422).json('pass not ok')
    }
  } else {
    response.status(404).json('not found');
  }
 });

// Profile endpoint
app.get('/profile', (request, response) => {
  try {
    const { token } = request.cookies;
    if (token) {
      jwt.verify(token, jwtSecret, {}, async (err, userData) => {
        if (err) {
          throw err;
        }
        const { name, email, _id } = await User.findById(userData.id);
        response.json({ name, email, _id });
      });
    } else {
      response.json(null);
    }
  } catch (error) {
    // Handle any errors that occur during the execution of the route handler
    console.error('Error during profile retrieval:', error);
    response.status(500).json('Internal server error');
  }
});

// Logout endpoint
app.post('/logout', (request, response) => {
  try {
    response.cookie('token', '').json(true);
  } catch (error) {
    // This catch block will never be executed in this context
    console.error('Error during logout:', error);
    response.status(500).json('Internal server error');
  }
});


// Upload image by link endpoint
 app.post('/upload-by-link', async (request, response) => {
  try {
    const { link } = request.body;
    const newName = 'photo' + Date.now() + '.jpg';
    await imageDownloader.image({
      url: link,
      dest: __dirname + '/uploads/' + newName,
    });
    response.json(newName);
  } catch (error) {
    // Handle any errors that occur during the execution of the route handler
    console.error('Error during image upload:', error);
    response.status(500).json('Internal server error');
  }
});

// Upload Image endpoint
 const photosMiddleware = multer({dest:'uploads/'});
 app.post('/upload', photosMiddleware.array('photos',100), (request,response) => {
  try {
    const uploadedFiles = [];
    for (let i = 0; i < request.files.length; i++) {
      const {path,originalname} = request.files[i];
      const parts = originalname.split('.');
      const ext = parts[parts.length -1];
      const newPath = path + '.' + ext;
      fs.renameSync(path, newPath);
      uploadedFiles.push(newPath.replace('uploads',''));
    }
    response.json(uploadedFiles);
  } catch (error) {
    // Handle any errors that occur during the execution of the route handler
    console.error('Error during file upload:', error);
    response.status(500).json('Internal server error');
  }
  });


  // Create place endpoint
 app.post('/places',(request,response) => {
  try {
    const {token} = request.cookies;
    const {
      title,address,addedPhotos,description,
      perks,extraInfo,checkIn,checkOut,maxGuests,price,
    } = request.body;
    jwt.verify(token, jwtSecret, {}, async (err, userData) => {
      if (err) throw err;
      const placeDoc = await Place.create({
        owner:userData.id,
        title,address,photos:addedPhotos,description,
        perks,extraInfo,checkIn,checkOut,maxGuests,price,
      });
      response.json(placeDoc);
    });
  } catch (error) {
    // Handle any errors that occur during the execution of the route handler
    console.error('Error during place creation:', error);
    response.status(500).json('Internal server error');
  }
 });

 // Get user places endpoint
 app.get('/user-places',(request,response) => {
  try {
      const {token} = request.cookies;
      jwt.verify(token, jwtSecret, {}, async (err, userData) => {
        if (err) {
          console.log(err);
          response.json({message:err})
        }
        const {id} = userData;
        response.json( await Place.find({owner:id}) );
      });
    } catch (error) {
      // Handle any errors that occur during the execution of the route handler
      console.error('Error during fetching user places:', error);
      response.status(500).json('Internal server error');
    }
    });

    // Get place by ID endpoint
    app.get('/places/:id', async (request, response) => {
      try {
        const { id } = request.params;
        response.json(await Place.findById(id));
      } catch (error) {
        // Handle any errors that occur during the execution of the route handler
        console.error('Error during fetching place by ID:', error);
        response.status(500).json('Internal server error');
      }
    });
    

// Update place endpoint
 app.put('/places', async (request, response) => {
  try {
    const { token } = request.cookies;
    const {
      id, title, address, addedPhotos, description,
      perks, extraInfo, checkIn, checkOut, maxGuests, price,
    } = request.body;
    
    jwt.verify(token, jwtSecret, {}, async (err, userData) => {
      if (err) {
        throw err;
      }
      const placeDoc = await Place.findById(id);
      if (userData.id === placeDoc.owner.toString()) {
        placeDoc.set({
          title, address, photos: addedPhotos, description,
          perks, extraInfo, checkIn, checkOut, maxGuests, price,
        });
        await placeDoc.save();
        response.json('ok');
      }
    });
  } catch (error) {
    // Handle any errors that occur during the execution of the route handler
    console.error('Error during updating place:', error);
    response.status(500).json('Internal server error');
  }
});

// Get all places endpoint
app.get('/places', async (request, response) => {
  try {
    response.json(await Place.find());
  } catch (error) {
    // Handle any errors that occur during the execution of the route handler
    console.error('Error during fetching places:', error);
    response.status(500).json('Internal server error');
  }
});

// Create booking endpoint
app.post('/bookings', async (request, response) => {
  try {
    const userData = await getUserDataFromRequest(request);
    const { place, checkIn, checkOut, numberOfGuests, name, contact, price } = request.body;
    Booking.create({
      place, checkIn, checkOut,
      numberOfGuests, name, contact, price, user: userData.id,
    }).then((doc) => {
      response.json(doc);
    }).catch((err) => {
      throw err;
    });
  } catch (error) {
    // Handle any errors that occur during the execution of the route handler
    console.error('Error during creating booking:', error);
    response.status(500).json('Internal server error');
  }
});

// Get all bookings endpoint
app.get('/bookings', async (request, response) => {
  try {
    const userData = await getUserDataFromRequest(request);
    response.json(await Booking.find({ user: userData.id }).populate('place'));
  } catch (error) {
    // Handle any errors that occur during the execution of the route handler
    console.error('Error during fetching bookings:', error);
    response.status(500).json('Internal server error');
  }
});


 app.listen(4000);