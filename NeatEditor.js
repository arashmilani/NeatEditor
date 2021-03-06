if (typeof Narmand === "undefined") {
    Narmand = {};
}

$.extend(true, Narmand, {
    NeatEditor: {
        _LastEditorID: 0,

        Init: function (Options) {
            $.extend(true, this.Options, Options);
            this.ConstructEditorElemets();
        },

        Options: {
            Container: null,
            Direction: "ltr",
            AutoSyncTextareaWithEditor: true
        },

        ConstructEditorElemets: function () {
            this._LastEditorID++;

            var EditorWrapper = null;
            if (this.HasTextareaAssociatedEditorWrapper()) {
                EditorWrapper = this.GetAssociatedEditorWrapperOfTextarea();
                EditorWrapper.empty();
            }
            else {
                this.Options.Container.data("NarmandNeatEditorID", this._LastEditorID);
                EditorWrapper = $("<div>").addClass("NarmandNeatEditor")
                    .attr("id", "NarmandNeatEditor_" + this._LastEditorID)
                    .data("Options", this.Options);
            }

            if (this.Options.Direction === "rtl") {
                EditorWrapper.addClass("NarmandNeatEditorRightToLeft");
            }
            else {
                EditorWrapper.removeClass("NarmandNeatEditorRightToLeft");
            }

            var Sections = $("<div>").addClass("Sections").appendTo(EditorWrapper);
            var SectionAdders = $("<div>").addClass("SectionAdders").appendTo(EditorWrapper);
            $("<div>").addClass("Tag").text("+").appendTo(SectionAdders);
            Sections.append(SectionAdders);

            for (var ProviderName in this.SectionProviders) {
                var Provider = Narmand.NeatEditor.SectionProviders[ProviderName];
                var AdderButtonBase = this.CreateAdderButtonBase(ProviderName);
                SectionAdders.append(Provider.CreateAdderButton(AdderButtonBase));
            }

            SectionAdders.find(".SectionAdder").click(function () {
                Narmand.NeatEditor.TrySyncingTextareaWithEditor($(this));
            });

            this.ParseHtmlToEditor(this.Options.Container.val(), EditorWrapper);

            this.Options.Container.after(EditorWrapper);
            this.SectionProvidersHelper.MakeSectionsSortable();
        },

        HasTextareaAssociatedEditorWrapper: function () {
            if (this.Options.Container.data("NarmandNeatEditorID") !== undefined) {
                return true;
            }
            return false;
        },

        GetAssociatedEditorWrapperOfTextarea: function () {
            var TextareaNeatEditorID = this.Options.Container.data("NarmandNeatEditorID");
            if (TextareaNeatEditorID !== undefined) {
                return $("#NarmandNeatEditor_" + TextareaNeatEditorID);
            }
            else {
                throw "There is no editor associated with this textarea";
            }
        },

        CreateAdderButtonBase: function (SectionProviderName) {
            var AdderButtonBase = $("<a>").addClass("SectionAdder")
                .addClass(SectionProviderName).text("+ " + SectionProviderName);
            return AdderButtonBase;
        },

        RelocateSectionAdderBelowSection: function (SectionElement) {
            if (!SectionElement.next().is(".SectionAdders")) {
                var EditorWrapper = SectionElement.closest(".NarmandNeatEditor")
                var SectionAdders = EditorWrapper.find(".SectionAdders");

                EditorHeight = EditorWrapper.height();
                EditorWrapper.height(EditorWrapper.height());

                SectionAdders.children().hide();
                SectionAdders.slideUp("fast", function () {
                    SectionElement.after(SectionAdders);
                    SectionAdders.slideDown("fast", function () {
                        SectionAdders.children().fadeIn("fast");
                        EditorWrapper.css("height", "auto");
                    });
                });
            }
        },

        ParseHtmlToEditor: function (HtmlCode, EditorWrapper) {
            var RootElementsWrapper = $("<div>").html(HtmlCode);

            while (RootElementsWrapper.children()[0] != undefined) {
                var NextRootElement = RootElementsWrapper.children()[0];
                var TagName = NextRootElement.nodeName;

                var SectionProvider = Narmand.NeatEditor.GetSectionProviderByTagName(TagName);

                if (typeof SectionProvider.ExtractAnyDefinedTagsFromSection !== "undefined") {
                    SectionProvider.ExtractAnyDefinedTagsFromSection($(NextRootElement));
                }

                SectionProvider.AddSectionToEditor($(NextRootElement), EditorWrapper);
                $(NextRootElement).remove();
            }

            this.TrySyncingTextareaWithEditor(EditorWrapper.children(":first"));
        },

        TrySyncingTextareaWithEditor: function (EditorInsideElement) {
            var NarmandEditor = EditorInsideElement.closest(".NarmandNeatEditor");
            var Options = NarmandEditor.data("Options");
            if (Options.AutoSyncTextareaWithEditor) {
                this.SyncTextareaWithEditor(NarmandEditor);
            }
        },

        SyncTextareaWithEditor: function (EditorWrapper) {
            var HtmlCode = "";
            $(EditorWrapper).find(".Sections .Section").each(function () {
                var SectionProviderName = $(this).data("SectionProviderName");
                HtmlCode += Narmand.NeatEditor.SectionProviders[SectionProviderName]
                    .ExportSectionHtml($(this)) + "\r\n";
            });
            HtmlCode = HtmlCode.replace(/<\/?[A-Z]+.*?>/g, function (m) { return m.toLowerCase(); });
            EditorWrapper.data("Options").Container.val(HtmlCode);
        },

        SectionProviders: {},

        SectionProvidersHelper: {
            CreateSectionElement: function (SectionProviderName) {
                var SectionToolsWrapper = $("<div>").addClass("ToolsWrapper");

                $("<div>").addClass("CloseButton").text("x")
                    .click(function () {
                        var SectionsWrapper = $(this).closest(".Sections");
                        $(this).closest(".Section").remove();
                        Narmand.NeatEditor.TrySyncingTextareaWithEditor(SectionsWrapper);
                        return false;
                    })
                    .appendTo(SectionToolsWrapper);

                var Content = $("<div>").addClass("Content");
                var SectionTag = $("<div>").addClass("Tag").text(SectionProviderName);
                return $("<div>").addClass("Section")
                    .data("SectionProviderName", SectionProviderName)
                    .append(SectionToolsWrapper)
                    .append(Content)
                    .append(SectionTag)
                    .focusin(function (Event) {
                        if ($(Event.target).is("a.Tool")) {
                            return false;
                        }

                        Narmand.NeatEditor.RelocateSectionAdderBelowSection($(this));
                        Narmand.NeatEditor.Toolbar.CreateToolbarForSection($(this));
                    }).keyup(function () {
                        Narmand.NeatEditor.TrySyncingTextareaWithEditor($(this));
                    });
            },

            MakeSectionsSortable: function () {
                $(".Sections").sortable({
                    handle: '.Tag',
                    forceHelperSize: true,
                    forcePlaceholderSize: true,
                    containment: $(".Sections").parent(),
                    over: function () {
                        Narmand.NeatEditor.Toolbar.Hide();
                    },
                    stop: function (event, ui) {
                        Narmand.NeatEditor.TrySyncingTextareaWithEditor(ui.item);
                    },
                    axis: 'y'
                });
            }
        },

        Extend: function (Section) {
            $.extend(true, Narmand.NeatEditor.SectionProviders, Section);
        },

        GetSectionProviderByTagName: function (TagName) {
            TagName = TagName.toLowerCase();
            for (var ProviderName in this.SectionProviders) {
                var Provider = this.SectionProviders[ProviderName];
                if (Provider.TagName === TagName) {
                    return Provider;
                }
            }
            return Narmand.NeatEditor.SectionProviders.HtmlCode
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
                        .click(function (Event) {
                            try {
                                Narmand.NeatEditor.Toolbar.ToolSelected($(this));
                            }
                            catch (e) { console.info(e); }
                            return false;
                        })
                        .appendTo(EditorToolbar);
                }
            },

            PositionToolbarAccordingToSection: function (ToolbarElement, SectionElement) {
                if (ToolbarElement.children().length === 0) {
                    ToolbarElement.hide();
                    return;
                }
                SectionElement.append(ToolbarElement);
                ToolbarElement.show();
            },

            Hide: function () {
                $(".NarmandNeatEditor .Toolbar").hide();
            },

            ToolSelected: function (ToolElement) {
                var ToolsWrapperElement = ToolElement.parent();
                var ToolName = ToolElement.data("ToolName");
                var SectionProvider = ToolElement.data("SectionProvider");
                SectionProvider.Tools[ToolName].Act();
                Narmand.NeatEditor.TrySyncingTextareaWithEditor(ToolsWrapperElement);
            }
        }

    }
});


$.fn.extend({
    NeatEditor: function (Options) {
        if (Options === undefined) {
            var Options = {};
        }
        return this.each(function () {
            Options.Container = $(this);
            Narmand.NeatEditor.Init(Options);
        });
    }
});