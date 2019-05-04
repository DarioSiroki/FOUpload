$("#uploadform").dropzone({
    dictDefaultMessage: "Drag anywhere to upload",
    url: "/api/files/",
    method:"PUT",
    success: function() {
        location.reload();
    }

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
  let video = ["mp4", "webm"];
  if(imgs.includes(extension)) {
    $.ajax({
      url: `/storage/${filename}`,
      success: data => {
        html = `<img src="${data}"></img>`;
        target.html(html);
      }
    })
  } else if(audio.includes(extension)){
    $.ajax({
      url: `/storage/${filename}`,
      success: data => {
        target.html(`
          <audio controls>
            <source src="${data}" type="audio/${extension}">
          </audio>
          `)
      }
    })
  } else if(extension==="txt"){
    $.ajax({
      url: `/storage/${filename}`,
      success: data => {
        $.ajax({
          url: data,
          success: data => {
            target.html(`<pre style="white-space: pre-wrap;">${data}</pre>`);
          }
        })
      }
    })
  } else if(video.includes(extension)) {
    $.ajax({
      url: `/storage/${filename}`,
      success: data => {
            target.html(`
              <video controls>
                <source src="${data}" type="video/${extension}">
              </video>
              `);
      }
    })
  } else {
    target.html("Sorry but we don't support this type of file yet.")
  }
})

$(document).on("click", ".stop-playback", function(){
  let target = $("div.modal-body");
  target.html("");
  try{
    document.querySelector("video, audio").pause();
  } catch {}
});

$(document).on("click", ".delete-btn", function(){
  let path = $(this).parents("tr").find("td:nth-child(1) a").html()
  $.ajax({
    url: "/api/files",
    data: {
      path: `${path}`
    },
    type: "DELETE",
    success: data => {
      $(this).parents("tr").remove();
    }
  });
});

$(document).on("click", ".ocr-btn", function(){
  let target = $("div.modal-body");
  let path = $(this).parents("tr").find("td:nth-child(1) a").html()
  let loader = `
  <div class="spinner-border text-info" role="status">
    <span class="sr-only">Loading...</span>
  </div>`;
  target.html(loader);
  $.ajax({
    url: "/api/ocr",
    data: {
      path: `${path}`
    },
    type: "POST",
    success: data => {
      target.html(`<pre style="
      white-space: pre-wrap;
      font-family: Consolas,Menlo,Monaco,Lucida Console,Liberation Mono,DejaVu Sans Mono,Bitstream Vera Sans Mono,Courier New,monospace,sans-serif;
      background-color: #eff0f1;
      padding: 25px;
      ">${data}</pre>`);
    }
  })
});
