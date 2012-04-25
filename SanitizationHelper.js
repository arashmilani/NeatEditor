if (typeof Narmand === "undefined") {
    Narmand = {};
}

$.extend(true, Narmand, {
    SanitizationHelper: {
        SanitizeElementContents: function (Element, WhiteList) {
            WhiteList = this.NormalizeWhiteList(WhiteList);

            var Contents = $(Element).contents();
            for (var i = 0; i < Contents.length; i++) {
                if (!this.IsElementContentElementNode(Contents[i])) {
                    continue;
                }

                this.SanitizeElementContent(Contents[i], WhiteList);
            }
        },

        NormalizeWhiteList: function (WhiteList) {
            if (WhiteList === undefined) {
                return "";
            }

            if (WhiteList[0] !== " ") {
                WhiteList = " " + WhiteList;
            }

            if (WhiteList[WhiteList.length - 1] !== " ") {
                WhiteList = WhiteList + " ";
            }

            return WhiteList.toLowerCase();
        },

        IsElementContentElementNode: function (ElementContent) {
            if (ElementContent.nodeType === 1) {
                return true;
            }
            return false;
        },

        SanitizeElementContent: function (ElementContent, WhiteList) {
            ElementContentTagName = ElementContent.tagName;

            if (!this.IsTagNameWhiteListed(ElementContentTagName, WhiteList)) {
                $(ElementContent).contents().unwrap();
                return;
            }

            this.SanitizeElementAttributes(ElementContent, WhiteList);
        },

        IsTagNameWhiteListed: function (TagName, WhiteList) {
            TagName = TagName.toLowerCase();
            if (WhiteList.indexOf(" " + TagName + " ") > -1) {
                return true;
            }
            return false;
        },

        SanitizeElementAttributes: function (ElementContent, WhiteList) {
            ElementContentTagName = ElementContent.tagName;
            var ElementAttributes = this.GetElementAttributes(ElementContent);

            for (var i = 0; i < ElementAttributes.length; i++) {
                if (!this.IsTagAttributeWhiteListed(ElementContentTagName, ElementAttributes[i], WhiteList)) {
                    $(ElementContent).removeAttr(ElementAttributes[i]);
                }
            }
        },

        GetElementAttributes: function (ElementContent) {
            var ElementAttributes = [];
            for (var i = 0, attrs = ElementContent.attributes, l = attrs.length; i < l; i++) {
                ElementAttributes.push(attrs.item(i).nodeName);
            }
            return ElementAttributes;
        },

        IsTagAttributeWhiteListed: function (TagName, TagAttribute, WhiteList) {
            TagName = TagName.toLowerCase();
            TagAttribute = TagAttribute.toLowerCase();
            if (WhiteList.indexOf(" " + TagName + "[" + TagAttribute + "] ") > -1) {
                return true;
            }
            return false;
        }
    }
});