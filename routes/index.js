const express = require('express');
const router = express.Router();
const userModel = require('./users');
const postModel = require('./posts');
const upload = require('./multer');
const uploadprofile = require('./multerprofile');
const passport = require('passport');
const localStrategy = require('passport-local');
passport.use(new localStrategy(userModel.authenticate()));


router.get('/', async function(req, res, next) {
  const allpost = await postModel.find().populate('userid')     
  const userAuthenticated = req.isAuthenticated();
  res.render("feed",{allpost,userAuthenticated});
});

router.get('/savepost', isLoggedIn, function(req, res, next){
  res.redirect('back')
});
router.get('/likepost', isLoggedIn, function(req, res, next){
  res.redirect('back')
});
router.get('/deletepost', isLoggedIn, function(req, res, next){
  res.redirect('back')
});

router.get('/login', function(req, res, next) {
  res.render('login',{error:req.flash('error')});
});
router.get('/register', function(req, res, next) {
  res.render('index');
});

router.get('/profile',isLoggedIn, async function(req, res, next) {
  const user = await userModel.findOne({username: req.session.passport.user})      //on every login passport session already have stored the users data 
  .populate('posts')
  const usersaved = await userModel.findOne({username: req.session.passport.user})      //on every login passport session already have stored the users data 
  .populate('savedpost')
  const allpost = await postModel.find().populate('userid')
  res.render("profile",{user, allpost, usersaved})             //with rendering the profile, we send the user variable which have contain the data of that specific logined user
  
});


router.get('/profile/feed', async function(req, res, next) {
  const allpost = await postModel.find().populate('userid')     //on every login passport session already have stored the users data 
  const userAuthenticated = req.isAuthenticated();
  const user = await userModel.findOne({username: req.session.passport.user});
  res.render("feed",{allpost,userAuthenticated,user});
});
router.get('/profile/feed/:username', isLoggedIn, async function(req, res, next){
  const user = await userModel.findOne({username: req.session.passport.user});
  const username = req.params.username;
  const visitUser = await userModel.findOne({username}).populate('posts')
  const userAuthenticated = req.isAuthenticated();
  
  if(user.username===username){res.redirect('/profile')}
  else{res.render('visit-profile',{visitUser, user, userAuthenticated})}
  
})


router.post('/register', function(req, res, next){
  const userData = new userModel({
    fullname: req.body.fullname,
    username: req.body.username,
    email: req.body.email,
  })
  userModel.register(userData, req.body.password)
  .then(function(){
    passport.authenticate("local")(req, res, function(){    //here local is a strategy used by passport package, which is generally used in context of username and password
      res.redirect('/profile')
    })
  });
}); 

router.post('/login',passport.authenticate("local",{
  successRedirect: "/profile",
  failureRedirect: "/login",
  failureFlash: true,
}), function(req, res, next) {});

router.get('/logout',function(req, res, next) {
  req.logout(function(err){
    if(err) return next (err);
    res.redirect("/");
  })
});

function isLoggedIn(req, res, next){
  if(req.isAuthenticated()) return next();
  res.redirect("/register");
};

router.post('/upload',isLoggedIn, upload.single('file'),async function (req, res, next) {
  if(!req.file) {
    return res.status(400).send('No Files were uploaded.')
  }
  const user = await userModel.findOne({ username: req.session.passport.user})
  const post = await postModel.create({
    title: req.body.title,
    image: req.file.filename,
    userid: user._id,
  })
  user.posts.push(post._id)
  await user.save()
  res.redirect('/profile')
});

router.post('/uploadprofile',isLoggedIn, uploadprofile.single('profile'),async function (req, res, next) {
  if(!req.file) {
    return res.status(400).send('No Files were uploaded.')
  }
  const user = await userModel.findOne({ username: req.session.passport.user})
  const profileimg = '/images/profilepic/'+req.file.filename;
  try{
    const updateduser = await userModel.findByIdAndUpdate(user._id, {profilepic:profileimg}, {new:true})
  
      if(!updateduser){res.send('user not found')}
      else{res.redirect('/profile')}
    }
  catch (updateErr){res.send('Error updating user profile picture.')}
});

router.post('/savepost', isLoggedIn, async function(req, res, next) {
  try{
  const {postId} = req.body;
  const username = req.session.passport.user;
  const user = await userModel.findOne({username})
  const savedPost = await userModel.findOne({username, savedpost:{ $in: [postId]}});
  if(savedPost){
    user.savedpost.pop(postId)
    await user.save()
    res.redirect('back')
  }
  else{
    user.savedpost.push(postId)
    await user.save()
    res.redirect('back')
  }
  }
  catch(error){
    console.log('save post route error: ',error)
  }
});

router.post('/likepost', isLoggedIn, async function(req, res, next) {
  try{
  const {postId} = req.body;
  const post = await postModel.findOne({_id: postId})
  const user = await userModel.findOne({username: req.session.passport.user})
  const userId = user._id;
  const userLiked = await postModel.findOne({_id:postId, likedby:{ $in: [userId]}});
  if(userLiked){
    post.likedby.pop(userId)
    await post.save()
    res.redirect('back')
  }
  else{
    post.likedby.push(userId)
    await post.save()
    res.redirect('back')
  }
  }
  catch(error){
    console.log('like post route error: ',error)
  }
});

router.post('/deletepost', isLoggedIn, async function(req, res, next) {
  try{
  const {postId} = req.body;
  const username = req.session.passport.user;
  const user = await userModel.findOne({username})
  const userId = user._id 
  const userPosted = await userModel.findOne({_id:userId, posts:{ $in: [postId]}});
  if(userPosted){
    await postModel.findByIdAndDelete(postId)
    res.redirect('back')
    
  }
  else{
    res.redirect('back')
  }
  }
  catch(error){
    console.log('delete post route error: ',error)
  }
});
module.exports = router;
