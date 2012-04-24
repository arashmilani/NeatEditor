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
            CreateToolbarForSection: function (SectionElement) {
                var EditorWrapper = SectionElement.closest(".NarmandNeatEditor");
                var EditorToolbar = this.CunstructToolbarElementIfNotExists(EditorWrapper);
                var SectionProviderName = SectionElement.data("SectionProviderName");
                var Provider = Narmand.NeatEditor.SectionProviders[SectionProviderName];
                this.AppendProviderToolsToEditorToolbar(Provider, EditorToolbar);
                this.PositionToolbarAccordingToSection(EditorToolbar, SectionElement);
            },

            CunstructToolbarElementIfNotExists: function (EditorWrapper) {
                var EditorToolbar = EditorWrapper.find(".Toolbar:first");
                if (EditorToolbar.length === 0) {
                    EditorToolbar = $("<div>").addClass("Toolbar").appendTo(EditorWrapper);
                }
                return EditorToolbar.empty();
            },

            AppendProviderToolsToEditorToolbar: function (Provider, EditorToolbar) {
                if (Provider.Tools === undefined) {
                    return;
                }

                for (var ProviderToolName in Provider.Tools) {
                    $("<a>").addClass("Tool")
                        .addClass(ProviderToolName)
                        .data("ToolName", ProviderToolName)
                        .data("SectionProvider", Provider)
                        .attr("title", Provider.Tools[ProviderToolName].Title)
                        .attr("href", "")
                        .click(function () {
                            try {
                                Narmand.NeatEditor.Toolbar.ToolSelected($(this));
                            } catch (e) { alert(e); }
                            return false;
                        })
                        .appendTo(EditorToolbar);
                }
            },

            PositionToolbarAccordingToSection: function (ToolbarElement, SectionElement) {
                if (ToolbarElement.children().length === 0) {
                    ToolbarElement.hide();
                }
                else {
                    ToolbarElement.show();
                }

                var CalculatedTop = SectionElement.offset().top - 20 -
                    SectionElement.closest(".NarmandNeatEditor").offset().top;

                ToolbarElement.animate({ top: CalculatedTop }, "fast");
            },

            ToolSelected: function (ToolElement) {
                var ToolName = ToolElement.data("ToolName");
                var SectionProvider = ToolElement.data("SectionProvider");
                SectionProvider.Tools[ToolName].Act();
            }
        },

        SectionProviders: {},

        SectionProvidersHelper: {
            CreateSectionElement: function (SectionProviderName) {
                var SectionToolsWrapper = $("<div>").addClass("ToolsWrapper");

                var CloseButton = $("<div>").addClass("CloseButton").text("x")
                    .click(function () {
                        $(this).closest(".Section").remove();
                        return false;
                    })
                    .appendTo(SectionToolsWrapper);

                var Handle = $("<div>").addClass("Handle").text("::").appendTo(SectionToolsWrapper);
                var Content = $("<div>").addClass("Content");
                return $("<div>").addClass("Section")
                    .data("SectionProviderName", SectionProviderName)
                    .append(SectionToolsWrapper)
                    .append(Content).click(function () {
                        Narmand.NeatEditor.Toolbar.CreateToolbarForSection($(this));
                    });
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
            var HtmlCodeSection = Narmand.NeatEditor.SectionProvidersHelper.CreateSectionElement("HtmlCode");
            HtmlCodeSection.addClass("HtmlCode");
            var EditableSection = $("<pre>").text(HtmlCode).attr("contentEditable", true)
                        .appendTo(HtmlCodeSection.find(".Content"));
            HtmlCodeSection.appendTo(SectionsWrapper);
        },
        TagName: null
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
            var ParagraphSection = Narmand.NeatEditor.SectionProvidersHelper.CreateSectionElement("Paragraph");
            ParagraphSection.addClass("Paragraph");
            var EditableSection = $("<p>").text(Section.html()).attr("contentEditable", true)
                .appendTo(ParagraphSection.find(".Content"));
            ParagraphSection.appendTo(SectionsWrapper);
        },

        TagName: "p",

        Tools: {
            MakeStrong: {
                Title: "Make selection strong",
                Act: function () {
                    //document.execCommand('removeFormat', false, null);
                    var Selection = rangy.getSelection();
                    Range = Selection.getAllRanges()[0];

                    if ($(Range.commonAncestorContainer.parentNode).css("font-weight") > 400 ||
                        $(Range.commonAncestorContainer.parentNode).css("font-weight") === "bold") {
                        return;
                    }
                    else {
                        var Strong = document.createElement("strong");
                        if (Range.canSurroundContents()) {
                            Range.surroundContents(Strong);
                            return;
                        }
                    }

                    if ($(Range.endContainer.parentNode).css("font-weight") > 400 ||
                            $(Range.endContainer.parentNode).css("font-weight") === "bold") {
                        var SelectedTextInStartContainer = Range.startContainer.data.substr(Range.startOffset);
                        Range.startContainer.data = Range.startContainer.data.substr(0, Range.startOffset);
                        $(Range.endContainer.parentNode).text(SelectedTextInStartContainer +
                                $(Range.endContainer.parentNode).text());
                    }

                    if ($(Range.startContainer.parentNode).css("font-weight") > 400 ||
                            $(Range.startContainer.parentNode).css("font-weight") === "bold") {
                        var SelectedTextInEndContainer = Range.endContainer.data.substr(0, Range.endOffset);
                        Range.endContainer.data = Range.endContainer.data.substr(Range.endOffset);
                        $(Range.startContainer.parentNode).text($(Range.startContainer.parentNode).text() +
                                SelectedTextInEndContainer);
                    }




                }
            },
            Emphasize: {
                Title: "Emphasize on selection",
                Act: function () {
                    document.execCommand('italic', false, null);
                }
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


function MakeBold() {
    var Selection = rangy.getSelection();
    Range = Selection.getAllRanges()[0];


    var Strong = document.createElement("strong");
    $(Range.startContainer).wrap("<strong>");
    $(Range.endContainer).wrap("<strong>");


    return;

    Selection.removeAllRanges();
    Range.deleteContents();

    var container = Range.startContainer;
    var pos = Range.startOffset;
    var NewContent = "<b>hello</b>";


    // make a new range for the new selection
    Range = rangy.createRange();
    container.insertData(pos, NewContent);

    Range.setEnd(container, pos + NewContent.length);
    Range.setStart(container, pos);

    Selection.addRange(Range);
};