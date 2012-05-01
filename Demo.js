$(document).ready(function () {
    var HtmlCode =
        "<h2>Yet another editor?</h2>" +
        "<p>Representing a portion of an <strong>HTML</strong> " +
        "<img src='images/tets.jpg' alt='XXXXXX'/>"+
        "document and based on the <a href='#' style='color:red'>DOM Level 2</a> Range interface;</p>" +
        "<img src='Images/Paragraph.ClearFormatting.png' alt='Clear Formatting Icon'/>" +
        "<ul><li>My First Item</li><li>My First Item</li></ul>" +
        "<iframe src='http://localhost:2995/NeatEditor/Demo.htm'></iframe>";

    var HtmlCsode =
        "<h2>عنوانی برای شروع یه روز خوب</h2>" +
        "<p>كليه موارد تعرفه هاي برق و شرايط عمومي آنها و آئين نامه تكميلي تعرفه هاي برق ابلاغي از سوي وزارت نيرو" +
        " را قبول و رعايت آنها را براي خود لازم الرعايه مي دانم.</p>" +
        "<img src='Images/Paragraph.ClearFormatting.png' alt='Clear Formatting Icon'/>" +
        "<ul><li>My First Item</li><li>My First Item</li></ul>" +
        "<iframe src='http://localhost:2995/NeatEditor/Demo.htm'></iframe>";

    $("textarea").val(HtmlCode);
    $("textarea").NeatEditor({
        Direction: "ltr"
    });
});