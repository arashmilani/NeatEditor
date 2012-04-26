if (typeof Narmand === "undefined") {
    Narmand = {};
}

$.extend(true, Narmand, {
    SanitizationHelper: {
        count: 0,
        SanitizeElementContents: function (Element, WhiteList) {
            WhiteList = this.NormalizeWhiteList(WhiteList);
        
            while (this.HasElementAnyBlackListedContent(Element, WhiteList)) {
                var ElementNodes = this.GetElementNodesContentsOfElement(Element);
                for (var i = 0; i < ElementNodes.length; i++) {
                    this.SanitizeElementContent(ElementNodes[i], WhiteList);
                }
            }
        },

        HasElementAnyBlackListedContent: function (Element, WhiteList) {
            var ElementNodes = this.GetElementNodesContentsOfElement(Element);
            for (var i = 0; i < ElementNodes.length; i++) {
                ElementNodeTagName = ElementNodes[i].tagName;
                if (!this.IsTagNameWhiteListed(ElementNodeTagName, WhiteList)) {
                    return true;
                }

                if (this.HasTagAnyBlackListedAttribute(ElementNodes[i], WhiteList)) {
                    return true;
                }
            }
            return false;
        },

        HasTagAnyBlackListedAttribute: function (ElementContent, WhiteList) {
            ElementContentTagName = ElementContent.tagName;
            var ElementAttributes = this.GetElementAttributes(ElementContent);

            for (var i = 0; i < ElementAttributes.length; i++) {
                if (!this.IsTagAttributeWhiteListed(ElementContentTagName, ElementAttributes[i], WhiteList)) {
                    return true;
                }
            }

            return false;
        },

        GetElementNodesContentsOfElement: function (Element) {
            var ElementNodes = [];
            var Contents = $(Element).contents();
            for (var i = 0; i < Contents.length; i++) {
                if (Contents[i].nodeType === 1) {
                    ElementNodes.push(Contents[i]);
                }
            }
            return ElementNodes;
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