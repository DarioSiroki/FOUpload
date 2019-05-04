$("#uploadform").dropzone({ 
    dictDefaultMessage: "Drag anywhere to upload",
    url: "/api/files/",
    method:"PUT"

});