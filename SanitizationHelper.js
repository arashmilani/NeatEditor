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

                this.count++;
                if (this.count > 100) {
                    break;
                }

                var CurrentElement = ElementNodes[0];

                while (CurrentElement !== undefined) {
                    var NextElement = $(CurrentElement).next()[0];

                    this.SanitizeElementContent(CurrentElement, WhiteList);

                    CurrentElement = NextElement;
                }

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

        GetElementNodesContentsOfElement: function (Element) {
            var ElementNodes = [];
            var Contents = $(Element).contents();
            for (var i = 0; i < Contents.length; i++) {
                switch(Contents[i].nodeType){
                    case 1:
                        ElementNodes.push(Contents[i]);
                    break;

                    case 8:
                       this.ClearCommentNode(Contents[i]);
                    break;
                }
            }
            return ElementNodes;
        },

        ClearCommentNode: function(CommentNode) {
            $(CommentNode).remove();
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


        SanitizeElementContent: function (ElementContent, WhiteList) {
            ElementContentTagName = ElementContent.tagName;

            if (!this.IsTagNameWhiteListed(ElementContentTagName, WhiteList)) {
                var TagContents = $(ElementContent).contents();
                if (TagContents.length > 0) {
                    TagContents.fixedUnwrap();
                }
                else {
                    $(ElementContent).remove();
                }

                return;
            }

            this.SanitizeElementAttributes(ElementContent, WhiteList);

            try{
                $(ElementContent).text($(ElementContent).text());
            }
            catch(e){}
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
            var ElementAttributeNames = [];
            var ElementAttributes = ElementContent.attributes;
            for (var i = 0; i < ElementAttributes.length; i++) {
                ElementAttributeNames.push(ElementAttributes.item(i).nodeName);
            }
            return ElementAttributeNames;
        },

        IsTagAttributeWhiteListed: function (TagName, TagAttribute, WhiteList) {
            TagName = TagName.toLowerCase();
            TagAttribute = TagAttribute.toLowerCase();

            // IE create an imaginary 'shape' attribute that is impossble to remove it
            if (TagAttribute === "shape") {
                return true;
            }

            if (WhiteList.indexOf(" " + TagName + "[" + TagAttribute + "] ") > -1) {
                return true;
            }
            return false;
        }
    }
});

$.fn.fixedUnwrap = function () {
    this.parent(':not(body)')
    .each(function () {
        $(this).replaceWith(this.childNodes);
    });

    return this;
};
