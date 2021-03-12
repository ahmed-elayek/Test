var express=require('express');
var router=express.Router();
var course=require('../models/course');
var Question=require('../models/question');
var Exam=require('../models/exam');

// get homepage 

router.get('/',ensureAuthenticated,function(req,res){
    if(req.session.carrier=='student')
    res.render('student');
    else
    res.render('index');
});
router.get('/student',ensureAuthenticated,function(req,res){
    if(req.session.carrier!='teacher'){
    res.render('student');
    }
    else{
        res.redirect('/');  
    }
});

router.get('/get-courses',function(req,res){
    if(req.session.carrier=='teacher'){
course=require('../models/course');
course.find()
.then(function(doc) {
  res.render('index', {items: doc});
});
    }
    else{
        res.redirect('/');
    }
});
router.get('/get-exams',function(req,res){
if(req.session.carrier!='teacher'){
Exam=require('../models/exam');
Exam.find()
.then(function(doc) {
  res.render('student', {items: doc});
});
    }
    else{
        res.redirect('/');
    }
});

router.get('/users/examqst',function(req,res){
    var questt=req.session.questions;
res.render('examqst', {items:questt});
});
router.get('/users/question',function(req,res){

    if(req.session.carrier=='teacher'){
    var coursename = req.session.coursename;
    var all=new Array(req.session.number);
    for(var i=0;i<req.session.number;i++)
    {
        all[i]=i+1;
    }
    var course={
        name:coursename,
        num:all
    }
    res.render('question',{data:course});
   }
   else
   res.redirect('/');
    
    //req.session.valid = null;
    //req.session.a = null;
});

router.post('/addexam',function(req,res){
    let exam1=new Exam();
    exam1.examname=req.body.name;
    exam1.qstnumberperchapter=req.body.questionsnumber;
    exam1.simpleqst=req.body.simplenumbers;
    exam1.difficultqst=req.body.difficultnumbers;
    exam1.remindingqst=req.body.remindingnumbers;
    exam1.understandingqst=req.body.understandingnumbers;
    exam1.creativeqst=req.body.creativenumbers;

    req.checkBody('questionsnumber','please insert number of question for ogni chapter').notEmpty();
    req.checkBody('simplenumbers','please insert  simplenumber of question ').notEmpty();
    req.checkBody('difficultnumbers','please insert  difficultnumbers of question ').notEmpty();
    req.checkBody('remindingnumbers','please insert  remindingnumbers of question ').notEmpty();
    req.checkBody('understandingnumbers','please insert  understandingnumbers of question ').notEmpty();
    req.checkBody('creativenumbers','please insert  creativenumbers of question ').notEmpty();
    var errors=req.validationErrors();
    if(errors)
    {
       res.render('exam',{
        errors:errors,
        examnamedata:req.session.coursename
       });
    }else{
        var total=req.session.number;
        if(req.body.questionsnumber<=12){

            if((req.body.simplenumbers<=total*6 ||req.body.difficultnumbers<=total*6) &&
                (req.body.simplenumbers<req.body.questionsnumber*total ||req.body.difficultnumbers<req.body.questionsnumber*total ))
            {
                if((req.body.remindingnumbers<=total*3 ||req.body.understandingnumbers<=total*3 
                    || req.body.creativenumbers<=total*3)&&(req.body.remindingnumbers<req.body.questionsnumber*total
                        ||req.body.understandingnumbers<req.body.questionsnumber*total ||req.body.creativenumbers<req.body.questionsnumber*total ))
                {
                    exam1.save(function(err){
                        if(err){
                            console.log(err);
                            return;
                        }
                        else
                        {
                            req.flash('success_msg','The exam added successuflly');
                            res.redirect('/');
                        }
                    })
                }
                else{
                    req.flash('error','reminding , understanding and creative should be less than '+total*3);
                    res.redirect('/users/exam');
                }
            }
            else{
                req.flash('error','simple and difficult should be less than '+total*6);
                res.redirect('/users/exam');
            }


        }
        else{
            req.flash('error','number of Question should be less than 12 ');
           
            res.redirect('/users/exam');
        }

    
}


});

router.get('/users/exam',function(req,res){


    res.render('exam',{examnamedata:req.session.coursename});
});

router.post('/addquestion',function(req,res)
{
    let question1=new Question();
    question1.course=req.body.name;
    question1.chapternumber=req.body.chanumb;
    question1.questiondifficulty=req.body.difficulty;
    question1.questionobjective=req.body.objective;
    question1.questiontitle=req.body.questiontitle;
    question1.firstanswer=req.body.firstanswer;
    question1.secondanswer=req.body.secondanswer;
    question1.thirdanswer=req.body.thirdanswer;
    question1.correctanswer=req.body.correct;

    // validation
    req.checkBody('questiontitle','please insert name').notEmpty();
    req.checkBody('firstanswer','please insert first answer').notEmpty();
    req.checkBody('secondanswer','please insert second answer').notEmpty();
    req.checkBody('thirdanswer','please insert third answer').notEmpty();

    var coursename = req.session.coursename;
    var all=new Array(req.session.number);
    for(var i=0;i<req.session.number;i++)
    {
        all[i]=i+1;
    }
    var course={
        name:coursename,
        num:all
    }
    var errors=req.validationErrors();
    if(errors)
    {
       res.render('question',{
           errors:errors,
           data:course
       });
    }
    else
    {
    Question.ensurechapterNumber(req.body.chanumb,req.body.name,req.body.difficulty,req.body.objective,req.session.number, function(err,back) {
        
        if(back==1)
        {
            console.log('back return in '+back);
            if(err)
        {
            res.redirect('/users/question');   
        }
        else
        {
            question1.save(function(err){
                if(err){
                    console.log(err);
                    return;
                }
                else
                {
                    res.redirect('/users/question');
                }
            })

        }
            return;
        }
        if(back==2)
        {
            console.log('back return in '+back);
            req.flash('error','Check your Question objectives its 3 for each one');
            res.redirect('/users/question');   
            return;
        }
        if(back==3)
        {
            console.log('back return in '+back);
            req.flash('error','check your Question difficulty they are 6 for each one');
            res.redirect('/users/question');   
            return;
        }
        if(back==4)
        {
            console.log('back return in '+back);
            // all question added Redirect to creat exam
            res.redirect('/users/exam');
            return;
        }
        if(back==5)
        {
            console.log('back return in '+back);
            req.flash('error','check your Question chapter number selection they are 12 for each one');
            res.redirect('/users/question');   
            return;
        }
    
      });
    }
});

router.post('/addcourse',function(req,res){
let course1=new course();
course1.name=req.body.name;
course1.chapternumber=req.body.chapternumber;

req.checkBody('name','please insert name').notEmpty();
req.checkBody('chapternumber','please insert chapter numbers').notEmpty();

var errors=req.validationErrors();
    if(errors)
    {
       res.render('index',{
           errors:errors,
       });
    }
    else
    {
      course.getCourseByUsername(req.body.name,function(err,user){ 

        if(!user)
        {
            course1.save(function(err){
                if(err){
                    console.log(err);
                    return;
                }
                else
                {
                    console.log(req.body.name);
                    req.session.coursename = req.body.name
                    req.session.number=req.body.chapternumber;
                    res.redirect('/users/question');
                    
                   // res.render('question');
                    
                }
            })
        }
        else{
          
               req.flash('error','This Course added before !!! ');
               res.redirect('/');
        }
      });
    
    }
});
router.get('/redirect/:name/:num',function(req,res){
    let name={_name:req.params.name};
    let num={_num:req.params.num};
    
    res.render('question');
});

router.get('/redirecttoexam/:name',function(req,res){
    //course=require('../models/course');
    var n=req.params.name;
    console.log('the exam name'+req.params.name);
    var totalnumberperchapter;
    var simplenumber;
    var difficultnumber;
    var remindidngnumber;
    var understandingnumber;
    var creativenumber;

    var chapternumbers;
    var questions;
    var i=0;
     course.getCourseByUsername(n,function(err,user) {
         if(!user){
            console.log('hiiiiii'+n+user.chapternumber);
         }
         else{
            chapternumbers=user.chapternumber; 
            console.log('name'+user.name);
            console.log('number'+user.chapternumber);
            Exam.getExameByname(n, function(err, user) {
                if(!user){}
                else{
                totalnumberperchapter=user.qstnumberperchapter;
                simplenumber=user.simpleqst;
                difficultnumber=user.difficultqst;
                remindidngnumber=user.remindingqst;
                understandingnumber=user.understandingqst;
                creativenumber=user.creativeqst;
                console.log('number'+user.qstnumberperchapter);
                console.log(chapternumbers);
                console.log(totalnumberperchapter);
                var xx=chapternumbers*totalnumberperchapter;
                console.log(xx);
                questions=new Array(totalnumberperchapter*chapternumbers);
                Question.find()
                .then(function(doc) {
                    for (var ques of doc)
                    { 
                      if(ques.course==req.params.name)
                      {
                          questions[i]=ques.questiontitle;
                          i++;
                      }
                    }
                 
                    console.log('Whaaaaat');
                    req.session.questions=questions;
                    res.redirect('/users/examqst');
                }); 
                }
              });
         }
     
      });
    //res.render('question');
});




router.delete('/course/:id',function(req,res){
    console.log('called');
    let id={_id:req.params.id};

    course.getCourseByUserId(id, function(err, user) {
        console.log("Deleted "+user.name);
      });

    course.findOneAndDelete(id).exec(function(err){
        if(err){     
            console.log(err);
        }
        res.send('Success');  
    });
    /*remove(query,function(err){
       if(err){
           console.log(err);
       }
       res.send('Success');
    });*/
});

function ensureAuthenticated(req,res,next){
    if(req.isAuthenticated())
    {
        return next();
    }
    else
    {
        res.redirect('/users/login');
    }

}
module.exports = router;
module.express=router;