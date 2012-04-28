if (typeof Narmand === "undefined") {
    Narmand = {};
}

$.extend(true, Narmand, {
    RangeHelper: {
        ToggleRangeSurroundingByTag: function (Range, TagName) {
            if (this.DoesRangeContainTag(Range, TagName)) {
                this.CleanRangeByTag(Range, TagName);
                return;
            }

            var TagElement = document.createElement(TagName);
            this.SurroundRangeByElement(Range, TagElement);
        },

        SurroundRangeByElement: function (Range, Element) {
            if (Range.canSurroundContents()) {
                Range.surroundContents(Element);
            }
        },

        DoesRangeContainTag: function (Range, TagName) {
            TagName = TagName.toLowerCase();
            var NodeIterator = Range.createNodeIterator();
            while (NodeIterator.hasNext()) {
                var CurrentNode = NodeIterator.next();
                if (CurrentNode.nodeType === 3 && CurrentNode.parentNode.tagName.toLowerCase() === TagName) {
                    return true;
                }

                if (CurrentNode.nodeType === 1 && CurrentNode.tagName.toLowerCase() === TagName) {
                    return true;
                }
            }
            return false;
        },

        GetTagElementSurroundingRangeByTagName: function (Range, TagName) {
            TagName = TagName.toLowerCase();
            var NodeIterator = Range.createNodeIterator();
            while (NodeIterator.hasNext()) {
                var CurrentNode = NodeIterator.next();
                if (CurrentNode.nodeType === 3 && CurrentNode.parentNode.tagName.toLowerCase() === TagName) {
                    return CurrentNode;
                }

                if (CurrentNode.nodeType === 1 && CurrentNode.tagName.toLowerCase() === TagName) {
                    return CurrentNode;
                }
            }
            return null;
        },

        CleanRangeByTag: function (Range, TagName) {
            TagName = TagName.toLowerCase();
            var NodeIterator = Range.createNodeIterator();
            while (NodeIterator.hasNext()) {
                var CurrentNode = NodeIterator.next();

                if (CurrentNode.nodeType === 3 && CurrentNode.parentNode.tagName.toLowerCase() === TagName) {
                    $(CurrentNode).unwrap();
                }

                if (CurrentNode.nodeType === 1 && CurrentNode.tagName.toLowerCase() === TagName) {
                    $(CurrentNode).contents().unwrap();
                }
            }

            Range.commonAncestorContainer.normalize();
        }

       
    }
});