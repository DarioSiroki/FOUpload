$("#uploadform").dropzone({
    previewsContainer: "#asd",
    clickable:false,
    createImageThumbnails:false,
    dictDefaultMessage: "asd",
    url: "/api/files/",
    method: "PUT",
    sending: function(file, xhr, formData) {
      path = $("input#path").val();
      formData.append('path', path);
    },
    uploadprogress: function(file, progress, bytesSent) {
      console.log(progress);
    },
    success: function() {
      loadAjaxSearch("path=" + $("input#path").val());
    }
});



$("html").click(function() {
    if(($(event.target).parents(".opensidebar").length == 0) && ($(event.target).parents(".sidebar").length == 0))
        $(".sidebar").hide();
});

$(".opensidebar").click(function() {
    $(".sidebar").show();
});

var dragTimer;
$(document).on('dragenter', function(e) {
  var dt = e.originalEvent.dataTransfer;
  if (dt.types && (dt.types.indexOf ? dt.types.indexOf('Files') != -1 : dt.types.contains('Files'))) {
    $("#uploadform").show();
    window.clearTimeout(dragTimer);
  }
});
$(document).on('dragleave', function(e) {
  dragTimer = window.setTimeout(function() {
    $("#uploadform").hide();
  }, 1000);
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


$(function() {
  loadAjaxSearch($(".searchform").serialize());

})


let cooldown;

$(".searchform").change(function() {
    loadAjaxSearch($(".searchform").serialize());
});

$("#search,#mbsize").keydown(function() {
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
                $("table td").each(function() {
                    var idx = $(this).parent().find("td:not(.responsive-heading)").index($(this));
                    var text = $(this).closest("table").find("tr th").eq(idx+1).html();
                    if(text != "Filename")
                    $("<td class='responsive-heading'>"+text+"</td>").insertBefore($(this).next());
                });
            }
            else {
                $("#filelist").html("");
                $("#out").html("You have no files. Drag anywhere to upload.");
            }
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
  } else if(extension==="pdf"){
    $.ajax({
      url: `/storage/${filename}`,
      success: data => {
        PDFObject.embed(data, target);
        target.css("width", "100%")
        target.css("height", "800px")
      }
    })
  } else if(extension==="docx"){
    $.ajax({
      url: `/storage/${filename}`,
      success: data => {
        html = `<iframe class="doc" src="https://docs.google.com/gview?url=${window.location + data}"></iframe>`;
        target.html(html);
      }
    })
  } else {
    target.html("Sorry but we don't support this type of file yet.")
  }
})

let handleArrow = () => {
  let folderArrow = $("#folder-arrow");
  path = $("input#path").val();
  if(path!="/"){
    folderArrow.css("display", "inline")
  } else {
    folderArrow.css("display", "none")
  }
}

handleArrow();

$(document).on("click", ".folder-name", function(){
  path = $("input#path").val();
  path = path + $(this).html() + "/";
  $("input#path").val(path);
  loadAjaxSearch("path=" + path);
  handleArrow();
});

$(document).on("click", "#folder-arrow", function(){
  path = $("input#path").val();
  path = path.split("/");
  path.pop();
  path.pop();
  path = path.join("/");
  path = path ? path:"/";
  if(path!="/") path = path[path.length]==="/" ? path:path+="/";
  $("input#path").val(path);
  loadAjaxSearch("path=" + path);
  handleArrow();
});

$(document).on("click", ".stop-playback", function(){
  let target = $("div.modal-body");
  target.html("");
  try{
    document.querySelector("video, audio").pause();
  } catch {}
});

$(document).on("click", ".delete-btn", function(){
  path = $("input#path").val();
  path += $(this).parents("tr").find("td:nth-child(2) a").html();
  console.log(path)
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
  path = $("input#path").val();
  path = path + $(this).parents("tr").find("td:nth-child(2) a").html();
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


$("#usersettings_form").submit(function(e) {
    e.preventDefault();
    $.ajax({
        url:"/api/users/changepassword",
        method:"POST",
        data: $("#usersettings_form").serialize(),
        success:function(o) {
            $("#msg").html(o);
        },
        error:function(o) {
            $("#msg").html("<span style='color:#f00'>"+o.responseJSON.msg+"</span>");
        }
    });
    return false;
});

$(document).on("submit", "#add-folder-form", function(e){
  e.preventDefault();
  path = $("input#path").val();
  path += $("#add-folder-form input").val();
  $.ajax({
    url: "/api/files",
    type: "PUT",
    data: {
      createFolder: true,
      path: path
    },
    success: (data)=> {
      loadAjaxSearch("path=" + $("input#path").val());
    }
  })
  return false;
});

$(document).on("click","#compare",function() {
  $(".comparebox").show();

});

$(document).on("change",".comparebox",function(e) {
  if(this.checked) {
    if($(".comparebox:checked").length >= 2) {
      let file1 = $(".comparebox:checked").eq(0).parents("tr").find("td a.file-name").html();
      let file2 = $(".comparebox:checked").eq(1).parents("tr").find("td a.file-name").html();
      $("#exampleModal .modal-body").html("Comparing...");
      $('#exampleModal').modal("show");
      $(".comparebox").prop("checked",false);
      $(".comparebox").hide();
      $.ajax({
        url: "/api/files/compare",
        method:"POST",
        data: {
          file1: file1,
          file2: file2
        },
        success: function(o) {
          let htmltxt = "";
          let json = JSON.parse(o);
          json.forEach(function(el) {
              if(el.added) {
                htmltxt += "<pre style='background:rgba(0,255,0,.25);margin:0'>+"+el.value+"</pre>";
              }
              else if(el.removed) {
                htmltxt += "<pre style='background:rgba(255,0,0,.25);margin:0'>-"+el.value+"</pre>";
              }
          });
          $("#exampleModal .modal-body").html((htmltxt)?htmltxt:"Files are the same");
        }
      });
    }
  }
});

function hideUploadForm() {
  $("#uploadform").hide();
}