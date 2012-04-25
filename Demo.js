$(document).ready(function () {
    var HtmlCode = "<p dir='ltr'>Representing a portion of an <strong>HTML</strong> " +
        "document and based on the <a href='#'>DOM Level 2</a> Range interface;</p>" + 
        "<img src='Images/demo.jpg' alt='soem image' />";
    $("textarea").val(HtmlCode);
    $("textarea").NeatEditor();
});