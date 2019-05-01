$("#ls").click(() => {
  $.ajax({
    url: "/api/users/login",
    type: "POST",
    data: {
      email: $("#lemail").val(),
      password: $("#lpw").val()
    },
    success: () => (location.href = "/"),
    error: e => $("#login-msg").html(e.responseJSON.msg)
  });
});

$("#rs").click(() => {
  if ($("#pw1").val() !== $("#pw2").val()) {
    $("#register-msg").html("Passwords don't match");
    return;
  }
  $.ajax({
    url: "/api/users/register",
    type: "POST",
    data: {
      username: $("#username").val(),
      email: $("#remail").val(),
      password: $("#pw1").val()
    },
    success: () => (location.href = "/"),
    error: e => $("#register-msg").html(e.responseJSON.msg)
  });
});
