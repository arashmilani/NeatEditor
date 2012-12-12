Narmand.NeatEditor.Extend({
    Heading1: {
        CreateAdderButton: function (AdderButtonBase) {
            AdderButtonBase.click(function () {
                var EditorWrapper = $(this).closest(".NarmandNeatEditor");
                Narmand.NeatEditor.SectionProviders.Heading1.AddSectionToEditor(
                            $("<span>Replace with your heading 1</span>"), EditorWrapper);
                return false;
            })
            .text("+ Heading 1");
            return AdderButtonBase;
        },
        AddSectionToEditor: function (Content, EditorWrapper) {
            var SectionsWrapper = EditorWrapper.find(".Sections");
            var HeadingText = $("<div>").append(Content).text();

            var HeadingSection = Narmand.NeatEditor.SectionProvidersHelper.CreateSectionElement("Heading1");
            HeadingSection.addClass("Heading1");
            var EditableSection = $("<input type='text'>").val(HeadingText)
                .keydown(function (Event) {
                    if (Event.which === 13) {
                        return false;
                    }
                })
                .css("width", "100%")
                .appendTo(HeadingSection.find(".Content"));

            EditorWrapper.find(".SectionAdders").before(HeadingSection);
        },

        TagName: "h1",

        ExportSectionHtml: function (SectionElement) {
            var EncodedHeadingValue = this._HtmlEncode(SectionElement.find(".Content > input").val());
            return "<h1>" + EncodedHeadingValue + "</h1>";
        },

        _HtmlEncode: function (HtmlToEncode) {
            return HtmlToEncode.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
        }
    }
});
