Narmand.NeatEditor.Extend({
    Heading: {
        CreateAdderButton: function () {
            var AdderButton = $("<a>").addClass("SectionAdder Heading").text("Add Heading");
            AdderButton.click(function () {
                var EditorWrapper = $(this).closest(".NarmandNeatEditor");
                Narmand.NeatEditor.SectionProviders.Heading.AddSectionToEditor(
                            $("<span>Replace with your heading</span>"), EditorWrapper);
                return false;
            });
            return AdderButton;
        },
        AddSectionToEditor: function (Content, EditorWrapper) {
            var SectionsWrapper = EditorWrapper.find(".Sections");
            var HeadingText = $("<div>").append(Content).text();

            var HeadingSection = Narmand.NeatEditor.SectionProvidersHelper.CreateSectionElement("Heading");
            HeadingSection.addClass("Heading");
            var EditableSection = $("<input type='text'>").val(HeadingText)
                .keydown(function (Event) {
                    if (Event.which === 13) {
                        return false;
                    }
                })
                .css("width", "100%")
                .appendTo(HeadingSection.find(".Content"));
            HeadingSection.appendTo(SectionsWrapper);
        },

        TagName: "h2",

        ExportSectionHtml: function (SectionElement) {
            var EncodedHeadingValue = this._HtmlEncode(SectionElement.find(".Content > input").val());
            return "<h2>" + EncodedHeadingValue + "</h2>";
        },

        _HtmlEncode: function (HtmlToEncode) {
            return HtmlToEncode.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
        }
    }
});
