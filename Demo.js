$(document).ready(function () {
    var HtmlCode = "<p>Hello his is my paragraph</p>" + 
        "<img src='Images/demo.jpg' alt='soem image' />";
    $("textarea").val(HtmlCode);
    $("textarea").NeatEditor();
});