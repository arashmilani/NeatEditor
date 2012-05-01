Narmand.NeatEditor.Extend({
    Paragraph: {
        CreateAdderButton: function (AdderButtonBase) {
            AdderButtonBase.click(function () {
                var EditorWrapper = $(this).closest(".NarmandNeatEditor");
                Narmand.NeatEditor.SectionProviders.Paragraph.AddSectionToEditor(
                    $("<p>Replace this with you text</p>"), EditorWrapper);
                return false;
            }).text("+ Paragraph");
            return AdderButtonBase;
        },

        ExtractAnyDefinedTagsFromSection: function (RootElement) {
            RootElement.find("img").insertBefore(RootElement);
        },

        AddSectionToEditor: function (Section, EditorWrapper) {
            this.Sanitization.Sanitize(Section);

            var SectionsWrapper = EditorWrapper.find(".Sections");
            var ParagraphSection = Narmand.NeatEditor.SectionProvidersHelper.CreateSectionElement("Paragraph");
            ParagraphSection.addClass("Paragraph");
            var EditableSection = $("<div>").html(Section.html())
                .attr("contentEditable", true)
                .bind("paste", function () {
                    Narmand.NeatEditor.SectionProviders.Paragraph.Sanitization.SanitizeWithDelay($(this));
                })
                .appendTo(ParagraphSection.find(".Content"));

            if (Section.attr("dir") !== undefined) {
                EditableSection.attr("dir", Section.attr("dir"));
            }

            EditorWrapper.find(".SectionAdders").before(ParagraphSection);
        },

        TagName: "p",

        Tools: {
            MakeStrong: {
                Title: "Make selection strong",
                Act: function () {
                    var Selection = rangy.getSelection();
                    var Range = Selection.getAllRanges()[0];

                    if (!Narmand.NeatEditor.SectionProviders.Paragraph._CanToolActOnRange(Range)) {
                        return;
                    }

                    Narmand.RangeHelper.ToggleRangeSurroundingByTag(Range, "strong");
                    Selection.removeAllRanges();
                }
            },
            Emphasize: {
                Title: "Emphasize on selection",
                Act: function () {
                    var Selection = rangy.getSelection();
                    var Range = Selection.getAllRanges()[0];

                    if (!Narmand.NeatEditor.SectionProviders.Paragraph._CanToolActOnRange(Range)) {
                        return;
                    }

                    Narmand.RangeHelper.ToggleRangeSurroundingByTag(Range, "em");
                    Selection.removeAllRanges();
                }
            },
            Strikethrough: {
                Title: "Strike selection out",
                Act: function () {
                    var Selection = rangy.getSelection();
                    var Range = Selection.getAllRanges()[0];

                    if (!Narmand.NeatEditor.SectionProviders.Paragraph._CanToolActOnRange(Range)) {
                        return;
                    }

                    Narmand.RangeHelper.ToggleRangeSurroundingByTag(Range, "del");
                    Selection.removeAllRanges();
                }
            },
            CreateLink: {
                Title: "Create or modify link",
                PromptMessage: "Please link target URL",
                Act: function () {
                    var Selection = rangy.getSelection();
                    var Range = Selection.getAllRanges()[0];

                    if (!Narmand.NeatEditor.SectionProviders.Paragraph._CanToolActOnRange(Range)) {
                        return;
                    }

                    if (Narmand.RangeHelper.DoesRangeContainTag(Range, "a")) {
                        this.ModifyExistingLink(Range);
                        return;
                    }

                    var AnchorHref = prompt(this.PromptMessage, "http://");

                    if (AnchorHref === null || AnchorHref === "") {
                        return;
                    }

                    var AnchorElement = $("<a>").attr("href", AnchorHref)[0];
                    Narmand.RangeHelper.SurroundRangeByElement(Range, AnchorElement);
                    Selection.removeAllRanges();
                },

                ModifyExistingLink: function (Range) {
                    SurroundingAnchor = Narmand.RangeHelper.GetTagElementSurroundingRangeByTagName(Range, "a");
                    AnchorHref = $(SurroundingAnchor).attr("href");
                    var AnchorHref = prompt(this.PromptMessage, AnchorHref);
                    if (AnchorHref === null) {
                        return;
                    }

                    AnchorHref = AnchorHref.trim();

                    if (AnchorHref !== "") {
                        $(SurroundingAnchor).attr("href", AnchorHref);
                    }
                    else {
                        Narmand.RangeHelper.CleanRangeByTag(Range, "a");
                    }


                }
            },
            ClearFormatting: {
                Title: "Clear selection formatting",
                Act: function () {
                    var Selection = rangy.getSelection();
                    var Range = Selection.getAllRanges()[0];

                    if (!Narmand.NeatEditor.SectionProviders.Paragraph._CanToolActOnRange(Range)) {
                        return;
                    }

                    Narmand.NeatEditor.SectionProviders.Paragraph._ClearFormattingInRange(Range);
                    Selection.removeAllRanges();
                }
            },
            ChanegeDirectionToLeftToRight: {
                Title: "Change paragraph direction left to right",
                Act: function () {
                    var Selection = rangy.getSelection();
                    var Range = Selection.getAllRanges()[0];
                    var ParentElement = $(Range.commonAncestorContainer);
                    var ParagraphSelector = ".NarmandNeatEditor .Section .Content > div";
                    if (ParentElement.is(ParagraphSelector)) {
                        ParentElement.css("direction", "ltr");
                    }
                    else {
                        ParentElement.closest(ParagraphSelector).attr("dir", "ltr");
                    }
                }
            },
            ChanegeDirectionToRightToLeft: {
                Title: "Change paragraph direction right to left",
                Act: function () {
                    var Selection = rangy.getSelection();
                    var Range = Selection.getAllRanges()[0];
                    var ParentElement = $(Range.commonAncestorContainer);
                    var ParagraphSelector = ".NarmandNeatEditor .Section .Content > div";
                    if (ParentElement.is(ParagraphSelector)) {
                        ParentElement.css("direction", "rtl");
                    }
                    else {
                        ParentElement.closest(ParagraphSelector).attr("dir", "rtl");
                    }
                }
            }
        },

        Sanitization: {
            WhiteList: "strong em del a a[href] a[target] br",
            Sanitize: function (Element) {
                Narmand.SanitizationHelper.SanitizeElementContents(Element, this.WhiteList);
            },
            SanitizeWithDelay: function (Element) {
                setTimeout(function () {
                    var WhiteList = Narmand.NeatEditor.SectionProviders.Paragraph.Sanitization.WhiteList;
                    Narmand.SanitizationHelper.SanitizeElementContents(Element, WhiteList);
                    Narmand.NeatEditor.TrySyncingTextareaWithEditor(Element);
                }, 100);

            }
        },

        _CanToolActOnRange: function (Range) {
            var ParentElement = $(Range.commonAncestorContainer);
            var ParagraphSelector = ".NarmandNeatEditor .Section .Content > div";
            if (ParentElement.is(ParagraphSelector)) {
                return true;
            }

            if (ParentElement.closest(ParagraphSelector).length > 0) {
                return true;
            }

            return false;
        },

        _ClearFormattingInRange: function (Range) {
            var NodeIterator = Range.createNodeIterator();
            while (NodeIterator.hasNext()) {
                var CurrentNode = NodeIterator.next();

                if (CurrentNode.nodeType === 3 && CurrentNode.parentNode.tagName.toLowerCase() !== "div") {
                    $(CurrentNode).unwrap();
                }
            }

            Range.commonAncestorContainer.normalize();
        },

        ExportSectionHtml: function (SectionElement) {
            var ParagraphTag = SectionElement.find(".Content > div");
            var DirectionAttribute = (ParagraphTag.attr("dir") !== undefined) ?
                " dir='" + ParagraphTag.attr("dir") + "'" : "";
            return "<p" + DirectionAttribute + ">" + ParagraphTag.html() + "</p>";
        }
    }
});
