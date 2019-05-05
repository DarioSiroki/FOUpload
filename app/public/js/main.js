// custom dropdownovi umjesto bootstrapovih jer bootstrapovi nestanu cim kliknes unutar njih, a stopPropagation brejka tabove

$("html").click(function() {
    if(!$(event.target).hasClass("cust-dropdown") && ($(event.target).parents(".cust-dropdown-menu").length == 0))
        $(".cust-dropdown-menu").hide();
});

$(".cust-dropdown").click(function() {
    $(this).parent().find(".cust-dropdown-menu").show();
});

$(document).on('click', 'a[href^="#"]', function (event) {
    event.preventDefault();

    $('html, body').animate({
        scrollTop: $($.attr(this, 'href')).offset().top
    }, 500);
});

    