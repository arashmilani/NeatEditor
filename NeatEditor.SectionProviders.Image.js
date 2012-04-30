Narmand.NeatEditor.Extend({
    Image: {
        CreateAdderButton: function (AdderButtonBase) {
            AdderButtonBase.click(function () {
                var EditorWrapper = $(this).closest(".NarmandNeatEditor");
                Narmand.NeatEditor.SectionProviders.Image.AddSectionToEditor(
                            $("<img src='' alt=''/>"), EditorWrapper);
                return false;
            }).text("+ Image");
            return AdderButtonBase;
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

            ConfigSection.find("input.Url").val(ImageUrl);
            ConfigSection.find("input.Description").val(ImageAlternativeText);

            ConfigSection.appendTo(ImageSection.find(".Content"));

            EditorWrapper.find(".SectionAdders").before(ImageSection);
        },

        TagName: "img",

        ExportSectionHtml: function (SectionElement) {
            var ImageUrl = SectionElement.find("input.Url").val();
            ImageUrl = this._HtmlEncode(ImageUrl);

            var AlternativeText = SectionElement.find("input.Description").val();
            AlternativeText = (AlternativeText === "") ? '' : ' alt="' + AlternativeText + '" ';
            AlternativeText = jQuery.trim(this._HtmlEncode(AlternativeText));

            return '<img src="' + ImageUrl + '"' + AlternativeText + '/>';
        },

        _SectionTemplate: "<label>Url:</label><input type='text' class='Url'/><br/>" +
            "<label>Description:</label><input type='text' class='Description' />",

        _HtmlEncode: function (HtmlToEncode) {
            return HtmlToEncode.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
        }
    }
});
