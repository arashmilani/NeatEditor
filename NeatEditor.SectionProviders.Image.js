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

            this.InitConfigSectionBindings(ConfigSection);

            ConfigSection.find("input.Url").val(ImageUrl);
            ConfigSection.find("input.Description").val(ImageAlternativeText);

            ConfigSection.appendTo(ImageSection.find(".Content"));

            EditorWrapper.find(".SectionAdders").before(ImageSection);
        },

        InitConfigSectionBindings: function (ConfigSectionElement) {
            ConfigSectionElement.find("input").keydown(function (Event) {
                if (Event.which === 13) {
                    return false;
                }
            });

            ConfigSectionElement.find("form input[name=NeatEditorImageFile]").change(function () {
                if ($(this).val() === "") {
                    return;
                }

                var Form = $(this).closest("form");
                Form.ajaxSubmit({
                    type: "POST",
                    dataType: "text",
                    url: "Uploaders/Default.aspx",
                    success: function (result, statusText, xhr, $form) {
                        Form.closest(".Content").find("img.Preview").attr("src", result).end()
                                .find("input[name=Url]").val(result).end()
                                .find("input[name=NeatEditorImageFile]").val("");
                        Narmand.NeatEditor.TrySyncingTextareaWithEditor(Form);
                    },
                    error: function (xhr, ajaxOptions, thrownError) {
                    },
                    complete: function () {

                    }
                });
            });
        },

        TagName: "img",

        ExportSectionHtml: function (SectionElement) {
            var ImageUrl = SectionElement.find("input.Url").val();
            ImageUrl = this._HtmlEncode(ImageUrl);

            var AlternativeText = SectionElement.find("input.Description").val();
            AlternativeText = (AlternativeText === "") ? '' : ' alt="' + AlternativeText + '" ';
            AlternativeText = jQuery.trim(this._HtmlEncode(AlternativeText));

            return '<img src="' + ImageUrl + '" ' + AlternativeText + '/>';
        },

        _SectionTemplate:
            "<img class='Preview' src='' alt='' width='40' height='40' />" +
            "<label>Url:</label><input type='text' name='Url' class='Url'/>" +
            " — OR — " +
            "<form class='ImageUplaodForm' action='#' method='post' enctype='multipart/form-data'>" +
                "<input type='file' name='NeatEditorImageFile' class='FileInput' />" +
                "<input class='FakeFileInput' type='submit' value='Upload' />" +
            "</form>" +
            "<br/>" +
            "<label>Description:</label><input type='text' class='Description' />",

        _HtmlEncode: function (HtmlToEncode) {
            return HtmlToEncode.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
        }
    }
});
