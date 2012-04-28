$(document).ready(function () {
    var HtmlCode = "<p dir='ltr'>Representing a portion of an <strong>HTML</strong> " +
        "document and based on the <a href='#' style='color:red'>DOM Level 2</a> Range interface;</p>" +
        "<img src='Images/Paragraph.ClearFormatting.png' alt='Clear Formatting Icon'/>" +
        "<ul><li>My First Item</li><li>My First Item</li></ul>";
    $("textarea").val(HtmlCode);
    $("textarea").NeatEditor();
});