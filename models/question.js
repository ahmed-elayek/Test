let mongoose=require('mongoose');
var express=require('express');

let questionSchema=mongoose.Schema({

    course:{
        type:String,
        required:true
    },
    chapternumber:{
        type:Number,
        required:true
    },
    questiondifficulty:{
        type:String,
        required:true
    },
    questionobjective:{
        type:String,
        required:true
    },
    questiontitle:{
        type:String,
        required:true
    },
    firstanswer:{
        type:String,
        required:true
    },
    secondanswer:{
        type:String,
        required:true
    },
    thirdanswer:{
        type:String,
        required:true
    },
    correctanswer:{
        type:Number,
        required:true
    }


});
var back=0;
let x=0;
let Question=module.exports=mongoose.model('Question',questionSchema);
module.exports.ensurechapterNumber=function(chapternumber,name,difficult,objective,chapternumbers,callback){
    
   /* Question.remove().exec(function(error) {
        if(error) {
            console.log('Uh oh: ' + error);
        }
        else {
            console.log('[Existing Collection Deleted]');
        }
     });*/
    console.log('jkkklkh');
    Question.find()
    .then(function(doc,err) {
        var first=true;
        console.log('jkkklkh222');
        console.log(doc.length);
        if(err)throw err;

        var numberofqst=Question.numberofcurrentquest(chapternumber,name,doc,function(){});
        var numberofdifficulty=Question.numberofcurrentdifficulty(chapternumber,name,difficult,doc,function(){});
        var numberofobjectivity=Question.numberofcurrentobjective(chapternumber,name,objective,doc,function(){});
        var finished=Question.checkFinished(chapternumbers,name,doc,function(){});
       
        if(numberofqst<=1)
        {
            if(numberofdifficulty<=5)
            {
                if(numberofobjectivity<=2)
                {
                  back=1;
                  console.log('the back number '+back);
                  callback(null,back);
                }
                else{
                    back=2;
                    console.log('the back number '+back);
                    callback(null,back);
                }
            }
            else{
                back=3;
                console.log('the back number '+back);
                callback(null,back);
            }
        }
        else{
            if(finished==1)
            {
                back=4;
                console.log('the back number '+back);
                callback(null,back);
            }
            else
            {
                
                back=5;
                console.log('the back number '+back);
                callback(null,back);
            }
        }
       
       console.log('the number is '+numberofqst);
       console.log('the number is numberofdifficulty '+numberofdifficulty);
       console.log('the number is numberofobjectivity'+numberofobjectivity);
       console.log('the number is finished '+finished);


        
    });
        

}
module.exports.numberofcurrentquest=function(chapternumber,name,doc){
    var all=0;
    for (var ques of doc)
  { 
     if(ques.chapternumber==chapternumber&&name==ques.course)
     {
         all++;
     }
 }
 return all;
}
module.exports.numberofcurrentdifficulty=function(chapternumber,name,difficulty,doc){
    var difficultynum=0;
    for (var ques of doc)
  {
     if(ques.chapternumber==chapternumber&&name==ques.course)
     {
       if(ques.questiondifficulty==difficulty)
       {
         difficultynum++;
       }
     }
 }
 return difficultynum;
}
module.exports.numberofcurrentobjective=function(chapternumber,name,objective,doc){
    var objectivenum=0;
    for (var ques of doc)
  {
     if(ques.chapternumber==chapternumber&&name==ques.course)
     {
       if(ques.questionobjective==objective)
       {
         objectivenum++;
       }
     }
 }
 return objectivenum;
}
module.exports.checkFinished=function(chapternumbers,name,doc){

    var allNumbers=chapternumbers*12;
    var all =0;
    for (var ques of doc)
  { 
      
     if(name==ques.course)
     {
         all++;
     }
 }
 if(all>=allNumbers-1)
 {
    return 1;
 }
 else 
 {
    return 1;
 }
}