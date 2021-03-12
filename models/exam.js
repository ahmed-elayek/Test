let mongoose=require('mongoose');

let examSchema=mongoose.Schema({

    examname:{
        type:String,
        required:true
    },
    qstnumberperchapter:{
        type:Number,
        required:true
    },
    simpleqst:{
        type:Number,
        required:true
    },
    difficultqst:{
        type:Number,
        required:true
    },
    remindingqst:{
        type:Number,
        required:true
    },
    understandingqst:{
        type:Number,
        required:true
    },
    creativeqst:{
        type:Number,
        required:true
    }
});
let Exam=module.exports=mongoose.model('Exam',examSchema);
module.exports.getExameByname=function(examname,callback){
   /* Exam.remove().exec(function(error) {
        if(error) {
            console.log('Uh oh: ' + error);
        }
        else {
            console.log('[Existing Collection Deleted]');
        }
     });*/
    var query={examname:examname};
    Exam.findOne(query,callback);

}