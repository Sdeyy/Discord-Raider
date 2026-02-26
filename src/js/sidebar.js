$(document).ready(() => {
  $("a.sidebar--item").on("click", function (e) {

    if (!$(this).attr("data-target")) return;

    const active = $(".sidebar a.active");
    const newActive = $(this);

    active.removeClass("active");
    $(`.${active.attr("data-target")}`).addClass("hidden");

    newActive.addClass("active");
    $(`.${newActive.attr("data-target")}`).removeClass("hidden");
  });
});