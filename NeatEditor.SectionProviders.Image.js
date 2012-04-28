Narmand.NeatEditor.Extend({
    Image: {
        CreateAdderButton: function () {
            var AdderButton = $("<a>").addClass("SectionAdder Image").text("Add Image");
            AdderButton.click(function () {
                var EditorWrapper = $(this).closest(".NarmandNeatEditor");
                Narmand.NeatEditor.SectionProviders.Image.AddSectionToEditor(
                            $("<img src='' alt=''/>"), EditorWrapper);
                return false;
            });
            return AdderButton;
        },
        AddSectionToEditor: function (Content, EditorWrapper) {
            var SectionsWrapper = EditorWrapper.find(".Sections");
            var ImageElement = $("<div>").append(Content);
            var ImageUrl = ImageElement.find("img").attr("src");
            var ImageAlternativeText = ImageElement.find("img").attr("alt");



            var ImageSection = Narmand.NeatEditor.SectionProvidersHelper.CreateSectionElement("Image");
            ImageSection.addClass("Image");
            var ConfigSection = $("<div>").html(this._SectionTemplate);

            ConfigSection.find("input").keydown(function (Event) {
                if (Event.which === 13) {
                    return false;
                }
            });

            ConfigSection.find("input[name=Url]").val(ImageUrl);
            ConfigSection.find("input[name=Description]").val(ImageAlternativeText);

            ConfigSection.appendTo(ImageSection.find(".Content"));
            ImageSection.appendTo(SectionsWrapper);
        },

        TagName: "img",

        ExportSectionHtml: function (SectionElement) {
            var ImageUrl = SectionElement.find("input[name=Url]").val();
            ImageUrl = this._HtmlEncode(ImageUrl);

            var AlternativeText = SectionElement.find("input[name=Description]").val();
            AlternativeText = (AlternativeText === "") ? '' : ' alt="' + AlternativeText + '" ';
            AlternativeText = jQuery.trim(this._HtmlEncode(AlternativeText));

            return '<img src="' + ImageUrl + '"' + AlternativeText + '/>';
        },

        _SectionTemplate: "<label>Image Url:</label><input type='text' name='Url'/><br/>" +
            "<label>Image Description:</label><input type='text' name='Description' />",

        _HtmlEncode: function (HtmlToEncode) {
            return HtmlToEncode.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
        }
    }
});
