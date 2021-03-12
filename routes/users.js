var express =require('express');
var router=express.Router();
var session=require('express-session');
var passport=require('passport');
var LocalStartegy=require('passport-local').Strategy;
var User=require('../models/user');
// Register

router.get('/register',function(req,res){

    res.render('register');
});

// Login

router.get('/login',function(req,res){
  res.render('login');
});

// Register User
router.post('/register',function(req,res){
    var name =req.body.name;
    var email=req.body.email;
    var username=req.body.username;
    var password=req.body.password;
    var password2=req.body.password2;
    var carrier=req.body.radioname;
    // validation
    req.checkBody('name','Name is required').notEmpty();
    req.checkBody('email','Email is required').notEmpty();
    req.checkBody('email','Email is not valid').isEmail();
    req.checkBody('username','Username is required').notEmpty();
    req.checkBody('password','Password is required').notEmpty();
    req.checkBody('password','password do not match').equals(req.body.password);
    var errors=req.validationErrors();
    if(errors)
    {
       res.render('register',{
           errors:errors
       });
    }
    else{
       var newUser=new User({
           username:username,
           name:name,
           email:email,
           password:password,
           carrier:carrier

       });
      User.creatUser(newUser,function(err,user){
        if(err) throw err;
        console.log(user);
       });
       req.flash('success_msg','You are registered and can now login');
       res.redirect('/users/login');
    }
});

passport.use(new LocalStartegy(
    function(username, password, done) {
     User.getUserByUsername(username,function(err,user)
     {
         if(err) throw err;
         if(!user)
         {
             return done(null,false,{message:'Unkown User'});
         }
         User.comparePassword(password,user.password,function(err,isMatch){
             if(err)throw err;
             if(isMatch)
             {
                 return done(null,user)
                 
             }else{
                 return done(null,false,{message:'Invalid password'});

             }

         });
     });
    }));

    passport.serializeUser(function(user, done) {
        done(null, user.id);
      });
      
      passport.deserializeUser(function(id, done) {
        User.getUserByUserId(id, function(err, user) {
          done(err, user);
        });
      });
      /*
      router.post('/login', (req, res) => {
        try {
            passport.authenticate('local', function (err, user, info) {      
                if (err) {
                    
                    return res.status(401).json(err);
                    
                }
                if (user) {
                   
                    const token = user.generateJwt();
                    return res.status(200).json({
                        "token": token
                    });
                } else {
                    
                    res.status(401).json(info);
                }
            })(req, res)
        } catch (reason) {
            res.status(501).json({
                message: reason.message
            })
        }
    })*/

    /*  router.post('/login', (req, res) => {
        passport.authenticate('local', function (err, user, info) {      
            if (err) {
                
                return res.status(401).json(err);
                
            }
            if (user) {
             
                const token = user.generateJwt();
                return res.status(200).json({
                    "token": token
                });
            } else {
             
                res.status(401).json(info);
            }
        })(req, res)
    })*/
/*
      router.post('/login', function(req, res, next) {
        console.log(req.body);
        passport.authenticate('local', function(err, user, info) {
            console.log(err.body);
          if (err) { return next(err) }
          if (!user) {
            // *** Display message using Express 3 locals
            req.session.message = info.message;
            return res.redirect('login');
          }
          req.logIn(user, function(err) {
            if (err) { return next(err); }
            return res.redirect('/' + user.username);
          });
        })(req, res, next);
      });*/
   /*   router.post('/login', function(req, res, next) {
        console.log(req.body);
        passport.authenticate('local', function(err, user, info) {
          if (err) { return next(err); }
          if (!user) { return res.redirect('/login'); }
          req.logIn(user, function(err) {
            if (err) { return next(err); }
            return res.redirect('/' + user.username);
          });
        })(req, res, next);
      });*/

router.post('/login',
  passport.authenticate('local'),
  function(req, res) {
    console.log(req.body.username);
    User.getUserByUsername(req.body.username,function(err,user)
    {
        if(err) throw err;
        console.log(user.carrier);
        if(user.carrier=='teacher')
        {
            req.session.carrier='teacher';
            res.redirect('/');
        }
            else
            {
                req.session.carrier='student';
            res.redirect('/student');
            }

       
    });
  });
router.get('/logout',function(req,res){
    req.logout();
    req.flash('success_msg' ,'You are logged out');
    res.redirect('/users/login');
})
 

module.exports=router;