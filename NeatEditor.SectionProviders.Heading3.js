Narmand.NeatEditor.Extend({
    Heading3: {
        CreateAdderButton: function (AdderButtonBase) {
            AdderButtonBase.click(function () {
                var EditorWrapper = $(this).closest(".NarmandNeatEditor");
                Narmand.NeatEditor.SectionProviders.Heading3.AddSectionToEditor(
                            $("<span>Replace with your heading 2</span>"), EditorWrapper);
                return false;
            })
            .text("+ Heading 3");
            return AdderButtonBase;
        },
        AddSectionToEditor: function (Content, EditorWrapper) {
            var SectionsWrapper = EditorWrapper.find(".Sections");
            var HeadingText = $("<div>").append(Content).text();

            var HeadingSection = Narmand.NeatEditor.SectionProvidersHelper.CreateSectionElement("Heading3");
            HeadingSection.addClass("Heading3");
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

        TagName: "h2",

        ExportSectionHtml: function (SectionElement) {
            var EncodedHeadingValue = this._HtmlEncode(SectionElement.find(".Content > input").val());
            return "<h3>" + EncodedHeadingValue + "</h3>";
        },

        _HtmlEncode: function (HtmlToEncode) {
            return HtmlToEncode.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
        }
    }
});
