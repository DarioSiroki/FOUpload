$("#uploadform").dropzone({ 
    dictDefaultMessage: "Drag anywhere to upload",
    url: "/api/files/",
    method:"PUT"

});

loadAjaxSearch($(".searchform").serialize());

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

let cooldown;

$(".searchform").change(function() {
    loadAjaxSearch($(".searchform").serialize());
});

$("#search").keydown(function() {
    clearTimeout(cooldown);
    cooldown = setTimeout(function() {
        loadAjaxSearch($(".searchform").serialize());

    }, 500);
})

function loadAjaxSearch(datax) {
    $.ajax({
        url:"/api/ajax/filelist",
        method:"POST",
        data: datax,
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
}