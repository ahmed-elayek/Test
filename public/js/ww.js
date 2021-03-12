
$(document).ready(function(){
    $('.delete-course').on('click',function(e){
        $target=$(e.target);
        const id=$target.attr('course-id');
        console.log('Cazzzzzo'+id);
        $.ajax({
            type:'DELETE',
            url:'/course/'+id,
            success:function(response){
                alert('Course Deleted Successfully');
                window.location.href='/';
            },
            error:function(err){
                console.log('Errrrrrrrrror');
                console.log(err);
            }
        });
    });
});