$("#uploadform").dropzone({
    dictDefaultMessage: "Drag anywhere to upload",
    url: "/api/files/",
    method:"PUT"

});



$("html").click(function() {
    if(($(event.target).parents(".opensidebar").length == 0) && ($(event.target).parents(".sidebar").length == 0))
        $(".sidebar").hide();
});

$(".opensidebar").click(function() {
    $(".sidebar").show();
});


$(".radiobox").each(function() {
    $inputname = $(this).data("inputname");
    $inputvalue = $(this).data("inputvalue");
    $selected = ($(this).hasClass("selected"))?"checked":"";
    $(this).parents("form").append("<input style='display:none' type='radio' name='"+$inputname+"' value='"+$inputvalue+"' "+$selected+">")
});

$(".radiobox").click(function() {
    $inputname = $(this).data("inputname");
    $inputvalue = $(this).data("inputvalue");
    $(".radiobox[data-inputname="+$inputname+"]").removeClass("selected");
    $(this).addClass("selected");
    $("input[name='"+$inputname+"']").prop("checked",false);
    $("input[name='"+$inputname+"'][value='"+$inputvalue+"']").prop("checked",true);
    $(".searchform").change();
});

$(".checkbox").each(function() {
    $inputname = $(this).data("inputname");
    $inputvalue = $(this).data("inputvalue");
    $selected = ($(this).hasClass("selected"))?"checked":"";
    $(this).parents("form").append("<input style='display:none' type='checkbox' name='"+$inputname+"' value='"+$inputvalue+"' "+$selected+">")
});

$(".checkbox").click(function() {
    $inputname = $(this).data("inputname");
    $inputvalue = $(this).data("inputvalue");
    if($(this).hasClass("selected")) {
        $(this).removeClass("selected");
        $("input[name='"+$inputname+"'][value='"+$inputvalue+"']").prop("checked",false);
    }
    else {
        $(this).addClass("selected");
        $("input[name='"+$inputname+"'][value='"+$inputvalue+"']").prop("checked",true);
    }
    $(".searchform").change();

});

loadAjaxSearch($(".searchform").serialize());

let cooldown;

$(".searchform").change(function() {
    loadAjaxSearch($(".searchform").serialize());
});

$("#search").keydown(function() {
    clearTimeout(cooldown);
    cooldown = setTimeout(function() {
        loadAjaxSearch($(".searchform").serialize());

    }, 200);
})

function loadAjaxSearch(datax) {
    $.ajax({
        url:"/api/ajax/filelist",
        method:"POST",
        data: datax,
        success:function(o)  {
            if(o) {
                $("#filelist").html(o);
                $("#out").html("");
            }
            else {
                $("#filelist").html("");
                $("#out").html("You have no files. Drag anywhere to upload.");
            }
        },
        error:function(o) {
            $("#out").html(o);
        }
    });
}

$(document).on("click", "a.file-name", function(){
  let target = $("div.modal-body");
  let filename = $(this).html();
  let extension = filename.split('.').pop().toLowerCase();
  let imgs = ["png", "jpg", "jpeg", "tiff"];
  let audio = ["mp3", "wav", "ogg"];
  if(imgs.includes(extension)) {
    $.ajax({
      url: `/storage/${filename}`,
      success: data => {
        html = `<img src="${data}"></img>`;
        target.html(html);
      }
    })
  } else if(imgs.includes(extension)){
    console.log("hi");
  } else if(extension==="txt"){
    console.log("hi");
  } else {
    target.html("Sorry but we don't support this type of file yet.")
  }
})
