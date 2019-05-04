// custom dropdownovi umjesto bootstrapovih jer bootstrapovi nestanu cim kliknes unutar njih, a stopPropagation brejka tabove

$("html").click(function() {
    if(!$(event.target).hasClass("cust-dropdown") && ($(event.target).parents(".cust-dropdown-menu").length == 0))
        $(".cust-dropdown-menu").hide();
});

$(".cust-dropdown").click(function() {
    $(this).parent().find(".cust-dropdown-menu").show();
});



    