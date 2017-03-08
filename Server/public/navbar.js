
function myFunction() {
    $(function() {
        $('#nav li a').click(function() {
           $('#nav li').removeClass();
           $($(this).attr('href')).addClass('active');
        });
     });
    var x = document.getElementById("myTopnav");
    if (x.className === "topnav") {
        x.className += " responsive";
    } else {
        x.className = "topnav";
    }
}
