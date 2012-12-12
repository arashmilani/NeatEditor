
Narmand.NeatEditor.Extend({
    HtmlCode: {
        CreateAdderButton: function (AdderButtonBase) {
            AdderButtonBase.click(function () {
                var EditorWrapper = $(this).closest(".NarmandNeatEditor");
                Narmand.NeatEditor.SectionProviders.HtmlCode.AddSectionToEditor(
                            $("<code>replace with your html code</code>"), EditorWrapper);
                return false;
            }).text("+ HTML Code");
            return AdderButtonBase;
        },
        AddSectionToEditor: function (Content, EditorWrapper) {
            var SectionsWrapper = EditorWrapper.find(".Sections");
            var HtmlCode = $("<div>").append(Content).html();

            if (this._IsLastSectionHtmlCode(SectionsWrapper)) {
                var LastHtmlCodeTextarea = SectionsWrapper.find(".Section:last textarea");
                LastHtmlCodeTextarea.val(LastHtmlCodeTextarea.val() + "\r\n" + HtmlCode);
                return;
            }


            var HtmlCodeSection = Narmand.NeatEditor.SectionProvidersHelper.CreateSectionElement("HtmlCode");
            HtmlCodeSection.addClass("HtmlCode");
            var EditableSection = $("<textarea>").val(HtmlCode)
                .css("width", "100%")
                .appendTo(HtmlCodeSection.find(".Content"));

            EditorWrapper.find(".SectionAdders").before(HtmlCodeSection);
        },

        _IsLastSectionHtmlCode: function (SectionsWrapper) {
            var SectionBeforeSectionAddersElement = SectionsWrapper.find(".SectionAdders").prev();
            if (SectionBeforeSectionAddersElement.length === 0) {
                return false;
            }

            var SectionProviderName = SectionBeforeSectionAddersElement.data("SectionProviderName");
            if (SectionProviderName === "HtmlCode") {
                return true;
            }
            return false;
        },

        TagName: null,

        ExportSectionHtml: function (SectionElement) {
            var EncodedHtml = SectionElement.find(".Content > textarea").val();
            return this._HtmlDecode(EncodedHtml);
        },

        _HtmlDecode: function (HtmlToDecode) {
            return HtmlToDecode.replace(/&amp;/g, '&').replace(/&lt;/g, '<')
                .replace(/&gt;/g, '>');
        },

        _HtmlEncode: function (HtmlToEncode) {
            return HtmlToEncode.replace(/&/g, '&amp;').replace(/</g, '&lt;')
                .replace(/>/g, '&gt;');
        }
    }
});