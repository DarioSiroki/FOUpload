$("#uploadform").dropzone({
    dictDefaultMessage: "Drag anywhere to upload",
    url: "/api/files/",
    method:"PUT"
});

$.ajax({
    url:"/api/ajax/filelist",
    method:"POST",
    success:function(o)  {
        if(o) {
            $("#filelist").html(o);
        }
        else $("#out").html("You have no files. Drag anywhere to upload.");
    },
    error:function(o) {
        $("#out").html(o);
    }
});

$(document).on("click", ".image-modal", function() {
  let imgPath = $(this).html();
  $(".modal-body").html(imgPath);
});
