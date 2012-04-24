var Narmand = {
    NeatEditor: {
        Init: function (Options) {
            $.extend(true, this.Options, Options);
            this.ConstructEditorElemets();
        },

        Options: {
            Container: null,
            Direction: "ltr"
        },

        ConstructEditorElemets: function () {
            var EditorWrapper = $("<div>").addClass("NarmandNeatEditor");

            if (this.Options.Direction === "rtl") {
                EditorWrapper.addClass("NarmandNeatEditorRightToLeft");
            }

            $("<div>").addClass("Sections").appendTo(EditorWrapper);
            var SectionAdders = $("<div>").addClass("SectionAdders").appendTo(EditorWrapper);

            for (var ProviderName in this.SectionProviders) {
                var Provider = Narmand.NeatEditor.SectionProviders[ProviderName];
                SectionAdders.append(Provider.CreateAdderButton());
            }

            this.ParseHtmlToEditor(this.Options.Container.val(), EditorWrapper);

            this.Options.Container.after(EditorWrapper);
            this.Toolbar.CreateProvidersToolbar(EditorWrapper);
            this.SectionProvidersHelper.MakeSectionsSortable();
        },

        ParseHtmlToEditor: function (HtmlCode, EditorWrapper) {
            var RootElements = $("<div>").html(HtmlCode).children();
            RootElements.each(function () {
                var TagName = this.nodeName;
                var SectionProvider = Narmand.NeatEditor.SectionProviders.HtmlCode;

                try {
                    SectionProvider = Narmand.NeatEditor.GetSectionProviderByTagName(TagName);
                }
                catch (e) {
                }

                SectionProvider.AddSectionToEditor($(this), EditorWrapper);
            });
        },

        Toolbar: {
            CreateProvidersToolbar: function (EditorWrapper) {
                var EditorToolbar = $("<div>").addClass("Toolbar")
                for (var ProviderName in Narmand.NeatEditor.SectionProviders) {
                    var Provider = Narmand.NeatEditor.SectionProviders[ProviderName];
                    this.AppendProviderToolsToEditorToolbar(Provider, EditorToolbar);
                }
                EditorWrapper.append(EditorToolbar);
            },

            AppendProviderToolsToEditorToolbar: function (Provider, EditorToolbar) {
                if (Provider.Tools === undefined) {
                    return;
                }

                for (var ProviderToolName in Provider.Tools) {
                    $("<div>").addClass("Tool").addClass(ProviderToolName)
                        .data("ToolName", ProviderToolName)
                        .data("SectionProvider", Provider)
                        .text(ProviderToolName)
                        .click(function () {
                            Narmand.NeatEditor.Toolbar.ToolSelected($(this));
                        })
                        .appendTo(EditorToolbar);
                }
            },

            ToolSelected: function (ToolElement) {
                var ToolName = ToolElement.data("ToolName");
                var SectionProvider = ToolElement.data("SectionProvider")
                SectionProvider.Tools[ToolName]();
            }
        },

        SectionProviders: {},

        SectionProvidersHelper: {
            CreateSectionElement: function () {
                var SectionToolsWrapper = $("<div>").addClass("ToolsWrapper");

                var CloseButton = $("<div>").addClass("CloseButton").text("x")
                    .click(function () {
                        $(this).closest(".Section").remove();
                        return false;
                    })
                    .appendTo(SectionToolsWrapper);

                var Handle = $("<div>").addClass("Handle").text("::").appendTo(SectionToolsWrapper);
                var Content = $("<div>").addClass("Content");
                return $("<div>").addClass("Section").append(SectionToolsWrapper).append(Content);
            },

            MakeSectionsSortable: function () {
                $(".Sections").sortable({
                    handle: '.ToolsWrapper .Handle',
                    forcePlaceholderSize: true
                });
            }
        },

        Extend: function (Section) {
            $.extend(true, Narmand.NeatEditor.SectionProviders, Section);
        },

        GetSectionProviderByTagName: function (TagName) {
            TagName = TagName.toLowerCase();
            for (var ProviderName in this.SectionProviders) {
                var Provider = this.SectionProviders[ProviderName]
                if (Provider.TagName === TagName) {
                    return Provider;
                }
            }
            throw "There is no section provider controlling [" + TagName + "] tag";
        }

    }
}

Narmand.NeatEditor.Extend({
    HtmlCode: {
        CreateAdderButton: function () {
            var AdderButton = $("<a>").addClass("SectionAdder HtmlCode").text("Add HTML");
            AdderButton.click(function () {
                var EditorWrapper = $(this).closest(".NarmandNeatEditor");
                Narmand.NeatEditor.SectionProviders.HtmlCode.AddSectionToEditor(
                            $("<code>replace with your html code</code>"), EditorWrapper);
                return false;
            });
            return AdderButton;
        },
        AddSectionToEditor: function (Content, EditorWrapper) {
            var SectionsWrapper = EditorWrapper.find(".Sections");
            var HtmlCode = $("<div>").append(Content).html();
            var HtmlCodeSection = Narmand.NeatEditor.SectionProvidersHelper.CreateSectionElement();
            HtmlCodeSection.addClass("HtmlCode");
            var EditableSection = $("<pre>").text(HtmlCode).attr("contentEditable", true)
                        .appendTo(HtmlCodeSection.find(".Content"));
            HtmlCodeSection.appendTo(SectionsWrapper);
        },
        TagName: null,

        EncodeHtml: function (HtmlCode) {
            return HtmlCode.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
        },
        DecodeHtml: function (EncodedHtml) {
            return EncodedHtml.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>');
        }
    }
});

Narmand.NeatEditor.Extend({
    Paragraph: {
        CreateAdderButton: function () {
            var AdderButton = $("<a>").addClass("SectionAdder Paragraph").text("Add Paragraph");
            AdderButton.click(function () {
                var EditorWrapper = $(this).closest(".NarmandNeatEditor");
                Narmand.NeatEditor.SectionProviders.Paragraph.AddSectionToEditor(
                    $("<p>Replace this with you text</p>"), EditorWrapper);
                return false;
            });
            return AdderButton;
        },

        AddSectionToEditor: function (Section, EditorWrapper) {
            var SectionsWrapper = EditorWrapper.find(".Sections");
            var ParagraphSection = Narmand.NeatEditor.SectionProvidersHelper.CreateSectionElement();
            ParagraphSection.addClass("Paragraph");
            var EditableSection = $("<p>").text(Section.html()).attr("contentEditable", true)
                .appendTo(ParagraphSection.find(".Content"));
            ParagraphSection.appendTo(SectionsWrapper);
        },

        TagName: "p",

        Tools: {
            MakeStrong: function () {
                alert("MakeStrong");
            },
            Emphasize: function () {
                alert("Emphasize");
            }
        }
    }
});

$.fn.extend({
    NeatEditor: function (Options) {
        return this.each(function () {
            if (Options === undefined) {
                var Options = {};
            }
            Options.Container = $(this);
            Narmand.NeatEditor.Init(Options);
        });
    }
});