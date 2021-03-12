let mongoose=require('mongoose');

let courseSchema=mongoose.Schema({

    name:{
        type:String,
        required:true
    },
    chapternumber:{
        type:Number,
        required:true
    }
});

let Course=module.exports=mongoose.model('Course',courseSchema);
module.exports.getCourseByUsername=function(name,callback){
    var query={name:name};
    Course.findOne(query,callback);

}
module.exports.getCourseByUserId=function(id,callback){
    Course.findById(id,callback);

}