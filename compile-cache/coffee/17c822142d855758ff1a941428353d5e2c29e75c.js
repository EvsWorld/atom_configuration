(function() {
  var Constants, UrlUtil, deserializeItems, getMimeTypeForURI, getSerializationsForMimeType, path, readItemsFromDataTransfer, registerSerialization, serializations, serializeItems, writeItemsToDataTransfer,
    indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  Constants = require('./constants');

  UrlUtil = require('./url-util');

  path = require('path');

  serializations = [];

  registerSerialization = function(serialization) {
    if (serialization.priority == null) {
      serialization.priority = Number.Infinity;
    }
    serializations.push(serialization);
    return serializations.sort(function(a, b) {
      return a.priority - b.priority;
    });
  };

  getSerializationsForMimeType = function(mimeType) {
    var each, i, len, results;
    results = [];
    for (i = 0, len = serializations.length; i < len; i++) {
      each = serializations[i];
      if (indexOf.call(each.mimeTypes, mimeType) >= 0) {
        results.push(each);
      }
    }
    return results;
  };

  getMimeTypeForURI = function(uri) {
    var each, extension, i, len;
    if (uri == null) {
      uri = '';
    }
    extension = path.extname(uri).toLowerCase().substr(1);
    for (i = 0, len = serializations.length; i < len; i++) {
      each = serializations[i];
      if (indexOf.call(each.extensions, extension) >= 0) {
        return each.mimeTypes[0];
      }
    }
  };


  /*
  Section: Items
   */

  serializeItems = function(items, editor, mimeType) {
    if (mimeType == null) {
      mimeType = Constants.FTMLMimeType;
    }
    return getSerializationsForMimeType(mimeType)[0].serializeItems(items, editor);
  };

  deserializeItems = function(itemsData, outline, mimeType) {
    if (mimeType == null) {
      mimeType = Constants.FTMLMimeType;
    }
    return getSerializationsForMimeType(mimeType)[0].deserializeItems(itemsData, outline);
  };

  writeItemsToDataTransfer = function(items, editor, dataTransfer, mimeType) {
    var each, i, len, results;
    if (mimeType) {
      return dataTransfer.setData(mimeType, serializeItems(items, editor, mimeType));
    } else {
      results = [];
      for (i = 0, len = serializations.length; i < len; i++) {
        each = serializations[i];
        results.push(dataTransfer.setData(each.mimeTypes[0], serializeItems(items, editor, each.mimeTypes[0])));
      }
      return results;
    }
  };

  readItemsFromDataTransfer = function(editor, dataTransfer, mimeType) {
    var each, eachItem, error, file, fileHREF, fileURL, i, item, items, itemsData, j, len, len1, ref;
    for (i = 0, len = serializations.length; i < len; i++) {
      each = serializations[i];
      if ((indexOf.call(each.mimeTypes, mimeType) >= 0) || !mimeType) {
        itemsData = dataTransfer.getData(each.mimeTypes[0]);
        if (itemsData) {
          try {
            if (items = deserializeItems(itemsData, editor.outline, each.mimeTypes[0])) {
              if (items.length) {
                return items;
              }
            }
          } catch (error1) {
            error = error1;
            console.log(each + " failed reading mimeType " + mimeType + ". Now trying with other serializations.");
          }
        }
      }
    }
    items = [];
    ref = dataTransfer.items;
    for (j = 0, len1 = ref.length; j < len1; j++) {
      eachItem = ref[j];
      file = eachItem.getAsFile();
      if ((file != null ? file.path : void 0) && (file != null ? file.path.length : void 0) > 0) {
        item = editor.outline.createItem(file.name);
        fileURL = UrlUtil.getFileURLFromPathnameAndOptions(file.path);
        fileHREF = UrlUtil.getHREFFromFileURLs(editor.outline.getFileURL(), fileURL);
        item.addElementInBodyTextRange('A', {
          href: fileHREF
        }, 0, file.name.length);
        items.push(item);
      }
    }
    return items;
  };

  registerSerialization({
    priority: 0,
    extensions: ['ftml'],
    mimeTypes: [Constants.FTMLMimeType],
    serializeItems: function(items, editor) {
      return require('./serializations/ftml').serializeItems(items, editor);
    },
    deserializeItems: function(itemsData, outline) {
      return require('./serializations/ftml').deserializeItems(itemsData, outline);
    }
  });

  registerSerialization({
    priority: 1,
    extensions: ['opml'],
    mimeTypes: [Constants.OPMLMimeType],
    serializeItems: function(items, editor) {
      return require('./serializations/opml').serializeItems(items, editor);
    },
    deserializeItems: function(itemsData, outline) {
      return require('./serializations/opml').deserializeItems(itemsData, outline);
    }
  });

  registerSerialization({
    priority: 2,
    extensions: [],
    mimeTypes: [Constants.HTMLMimeType],
    serializeItems: function(items, editor) {
      return require('./serializations/html-fragment').serializeItems(items, editor);
    },
    deserializeItems: function(itemsData, outline) {
      return require('./serializations/html-fragment').deserializeItems(itemsData, outline);
    }
  });

  registerSerialization({
    priority: 3,
    extensions: [],
    mimeTypes: [Constants.URIListMimeType],
    serializeItems: function(items, editor) {
      return require('./serializations/uri-list').serializeItems(items, editor);
    },
    deserializeItems: function(itemsData, outline) {
      return require('./serializations/uri-list').deserializeItems(itemsData, outline);
    }
  });

  registerSerialization({
    priority: 4,
    extensions: [],
    mimeTypes: [Constants.TEXTMimeType],
    serializeItems: function(items, editor) {
      return require('./serializations/text').serializeItems(items, editor);
    },
    deserializeItems: function(itemsData, outline) {
      return require('./serializations/text').deserializeItems(itemsData, outline);
    }
  });

  module.exports = {
    registerSerialization: registerSerialization,
    getMimeTypeForURI: getMimeTypeForURI,
    serializeItems: serializeItems,
    deserializeItems: deserializeItems,
    writeItemsToDataTransfer: writeItemsToDataTransfer,
    readItemsFromDataTransfer: readItemsFromDataTransfer
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL2V2YW5oZW5kcml4MS8uYXRvbS9wYWNrYWdlcy9mb2xkaW5ndGV4dC1mb3ItYXRvbS9saWIvY29yZS9pdGVtLXNlcmlhbGl6ZXIuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUNBO0FBQUEsTUFBQSx1TUFBQTtJQUFBOztFQUFBLFNBQUEsR0FBWSxPQUFBLENBQVEsYUFBUjs7RUFDWixPQUFBLEdBQVUsT0FBQSxDQUFRLFlBQVI7O0VBQ1YsSUFBQSxHQUFPLE9BQUEsQ0FBUSxNQUFSOztFQUVQLGNBQUEsR0FBaUI7O0VBQ2pCLHFCQUFBLEdBQXdCLFNBQUMsYUFBRDs7TUFDdEIsYUFBYSxDQUFDLFdBQVksTUFBTSxDQUFDOztJQUNqQyxjQUFjLENBQUMsSUFBZixDQUFvQixhQUFwQjtXQUNBLGNBQWMsQ0FBQyxJQUFmLENBQW9CLFNBQUMsQ0FBRCxFQUFJLENBQUo7YUFDbEIsQ0FBQyxDQUFDLFFBQUYsR0FBYSxDQUFDLENBQUM7SUFERyxDQUFwQjtFQUhzQjs7RUFNeEIsNEJBQUEsR0FBK0IsU0FBQyxRQUFEO0FBQzdCLFFBQUE7QUFBQztTQUFBLGdEQUFBOztVQUFxQyxhQUFZLElBQUksQ0FBQyxTQUFqQixFQUFBLFFBQUE7cUJBQXJDOztBQUFBOztFQUQ0Qjs7RUFHL0IsaUJBQUEsR0FBb0IsU0FBQyxHQUFEO0FBQ2xCLFFBQUE7O01BQUEsTUFBTzs7SUFDUCxTQUFBLEdBQVksSUFBSSxDQUFDLE9BQUwsQ0FBYSxHQUFiLENBQWlCLENBQUMsV0FBbEIsQ0FBQSxDQUErQixDQUFDLE1BQWhDLENBQXVDLENBQXZDO0FBQ1osU0FBQSxnREFBQTs7TUFDRSxJQUFHLGFBQWEsSUFBSSxDQUFDLFVBQWxCLEVBQUEsU0FBQSxNQUFIO0FBQ0UsZUFBTyxJQUFJLENBQUMsU0FBVSxDQUFBLENBQUEsRUFEeEI7O0FBREY7RUFIa0I7OztBQU9wQjs7OztFQUlBLGNBQUEsR0FBaUIsU0FBQyxL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O0lBRUEsU0FBQSxFQUFXLENBQUMsU0FBUyxDQUFDLGVBQVgsQ0FGWDtJQUdBLGNBQUEsRUFBZ0IsU0FBQyxLQUFELEVBQVEsTUFBUjthQUNkLE9BQUEsQ0FBUSwyQkFBUixDQUFvQyxDQUFDLGNBQXJDLENBQW9ELEtBQXBELEVBQTJELE1BQTNEO0lBRGMsQ0FIaEI7SUFLQSxnQkFBQSxFQUFrQixTQUFDLFNBQUQsRUFBWSxPQUFaO2FBQ2hCLE9BQUEsQ0FBUSwyQkFBUixDQUFvQyxDQUFDLGdCQUFyQyxDQUFzRCxTQUF0RCxFQUFpRSxPQUFqRTtJQURnQixDQUxsQjtHQURGOztFQVNBLHFCQUFBLENBQ0U7SUFBQSxRQUFBLEVBQVUsQ0FBVjtJQUNBLFVBQUEsRUFBWSxFQURaO0lBRUEsU0FBQSxFQUFXLENBQUMsU0FBUyxDQUFDLFlBQVgsQ0FGWDtJQUdBLGNBQUEsRUFBZ0IsU0FBQyxLQUFELEVBQVEsTUFBUjthQUNkLE9BQUEsQ0FBUSx1QkFBUixDQUFnQyxDQUFDLGNBQWpDLENBQWdELEtBQWhELEVBQXVELE1BQXZEO0lBRGMsQ0FIaEI7SUFLQSxnQkFBQSxFQUFrQixTQUFDLFNBQUQsRUFBWSxPQUFaO2FBQ2hCLE9BQUEsQ0FBUSx1QkFBUixDQUFnQyxDQUFDLGdCQUFqQyxDQUFrRCxTQUFsRCxFQUE2RCxPQUE3RDtJQURnQixDQUxsQjtHQURGOztFQVNBLE1BQU0sQ0FBQyxPQUFQLEdBQ0U7SUFBQSxxQkFBQSxFQUF1QixxQkFBdkI7SUFDQSxpQkFBQSxFQUFtQixpQkFEbkI7SUFFQSxjQUFBLEVBQWdCLGNBRmhCO0lBR0EsZ0JBQUEsRUFBa0IsZ0JBSGxCO0lBSUEsd0JBQUEsRUFBMEIsd0JBSjFCO0lBS0EseUJBQUEsRUFBMkIseUJBTDNCOztBQTdHRiIsInNvdXJjZXNDb250ZW50IjpbIiMgQ29weXJpZ2h0IChjKSAyMDE1IEplc3NlIEdyb3NqZWFuLiBBbGwgcmlnaHRzIHJlc2VydmVkLlxuQ29uc3RhbnRzID0gcmVxdWlyZSAnLi9jb25zdGFudHMnXG5VcmxVdGlsID0gcmVxdWlyZSAnLi91cmwtdXRpbCdcbnBhdGggPSByZXF1aXJlICdwYXRoJ1xuXG5zZXJpYWxpemF0aW9ucyA9IFtdXG5yZWdpc3RlclNlcmlhbGl6YXRpb24gPSAoc2VyaWFsaXphdGlvbikgLT5cbiAgc2VyaWFsaXphdGlvbi5wcmlvcml0eSA/PSBOdW1iZXIuSW5maW5pdHlcbiAgc2VyaWFsaXphdGlvbnMucHVzaCBzZXJpYWxpemF0aW9uXG4gIHNlcmlhbGl6YXRpb25zLnNvcnQgKGEsIGIpIC0+XG4gICAgYS5wcmlvcml0eSAtIGIucHJpb3JpdHlcblxuZ2V0U2VyaWFsaXphdGlvbnNGb3JNaW1lVHlwZSA9IChtaW1lVHlwZSkgLT5cbiAgKGVhY2ggZm9yIGVhY2ggaW4gc2VyaWFsaXphdGlvbnMgd2hlbiBtaW1lVHlwZSBpbiBlYWNoLm1pbWVUeXBlcylcblxuZ2V0TWltZVR5cGVGb3JVUkkgPSAodXJpKSAtPlxuICB1cmkgPz0gJydcbiAgZXh0ZW5zaW9uID0gcGF0aC5leHRuYW1lKHVyaSkudG9Mb3dlckNhc2UoKS5zdWJzdHIoMSlcbiAgZm9yIGVhY2ggaW4gc2VyaWFsaXphdGlvbnNcbiAgICBpZiBleHRlbnNpb24gaW4gZWFjaC5leHRlbnNpb25zXG4gICAgICByZXR1cm4gZWFjaC5taW1lVHlwZXNbMF1cblxuIyMjXG5TZWN0aW9uOiBJdGVtc1xuIyMjXG5cbnNlcmlhbGl6ZUl0ZW1zID0gKGl0ZW1zLCBlZGl0b3IsIG1pbWVUeXBlKSAtPlxuICBtaW1lVHlwZSA/PSBDb25zdGFudHMuRlRNTE1pbWVUeXBlXG4gIGdldFNlcmlhbGl6YXRpb25zRm9yTWltZVR5cGUobWltZVR5cGUpWzBdLnNlcmlhbGl6ZUl0ZW1zKGl0ZW1zLCBlZGl0b3IpXG5cbmRlc2VyaWFsaXplSXRlbXMgPSAoaXRlbXNEYXRhLCBvdXRsaW5lLCBtaW1lVHlwZSkgLT5cbiAgbWltZVR5cGUgPz0gQ29uc3RhbnRzLkZUTUxNaW1lVHlwZVxuICBnZXRTZXJpYWxpemF0aW9uc0Zvck1pbWVUeXBlKG1pbWVUeXBlKVswXS5kZXNlcmlhbGl6ZUl0ZW1zKGl0ZW1zRGF0YSwgb3V0bGluZSlcblxud3JpdGVJdGVtc1RvRGF0YVRyYW5zZmVyID0gKGl0ZW1zLCBlZGl0b3IsIGRhdGFUcmFuc2ZlciwgbWltZVR5cGUpIC0+XG4gIGlmIG1pbWVUeXBlXG4gICAgZGF0YVRyYW5zZmVyLnNldERhdGEgbWltZVR5cGUsIHNlcmlhbGl6ZUl0ZW1zKGl0ZW1zLCBlZGl0b3IsIG1pbWVUeXBlKVxuICBlbHNlXG4gICAgZm9yIGVhY2ggaW4gc2VyaWFsaXphdGlvbnNcbiAgICAgIGRhdGFUcmFuc2Zlci5zZXREYXRhIGVhY2gubWltZVR5cGVzWzBdLCBzZXJpYWxpemVJdGVtcyhpdGVtcywgZWRpdG9yLCBlYWNoLm1pbWVUeXBlc1swXSlcblxucmVhZEl0ZW1zRnJvbURhdGFUcmFuc2ZlciA9IChlZGl0b3IsIGRhdGFUcmFuc2ZlciwgbWltZVR5cGUpIC0+XG4gIGZvciBlYWNoIGluIHNlcmlhbGl6YXRpb25zXG4gICAgaWYgKG1pbWVUeXBlIGluIGVhY2gubWltZVR5cGVzKSBvciBub3QgbWltZVR5cGVcbiAgICAgIGl0ZW1zRGF0YSA9IGRhdGFUcmFuc2Zlci5nZXREYXRhIGVhY2gubWltZVR5cGVzWzBdXG4gICAgICBpZiBpdGVtc0RhdGFcbiAgICAgICAgdHJ5XG4gICAgICAgICAgaWYgaXRlbXMgPSBkZXNlcmlhbGl6ZUl0ZW1zKGl0ZW1zRGF0YSwgZWRpdG9yLm91dGxpbmUsIGVhY2gubWltZVR5cGVzWzBdKVxuICAgICAgICAgICAgcmV0dXJuIGl0ZW1zIGlmIGl0ZW1zLmxlbmd0aFxuICAgICAgICBjYXRjaCBlcnJvclxuICAgICAgICAgIGNvbnNvbGUubG9nIFwiI3tlYWNofSBmYWlsZWQgcmVhZGluZyBtaW1lVHlwZSAje21pbWVUeXBlfS4gTm93IHRyeWluZyB3aXRoIG90aGVyIHNlcmlhbGl6YXRpb25zLlwiXG5cbiAgIyBDcmVhdGUgaXRlbXMgd2l0aCBsaW5rcyB0byBwYXN0ZWJvYXJkIGZpbGUgaXRlbXMuXG4gIGl0ZW1zID0gW11cbiAgZm9yIGVhY2hJdGVtIGluIGRhdGFUcmFuc2Zlci5pdGVtc1xuICAgIGZpbGUgPSBlYWNoSXRlbS5nZXRBc0ZpbGUoKVxuICAgIGlmIGZpbGU/LnBhdGggYW5kIGZpbGU/LnBhdGgubGVuZ3RoID4gMFxuICAgICAgaXRlbSA9IGVkaXRvci5vdXRsaW5lLmNyZWF0ZUl0ZW0gZmlsZS5uYW1lXG4gICAgICBmaWxlVVJMID0gVXJsVXRpbC5nZXRGaWxlVVJMRnJvbVBhdGhuYW1lQW5kT3B0aW9ucyhmaWxlLnBhdGgpXG4gICAgICBmaWxlSFJFRiA9IFVybFV0aWwuZ2V0SFJFRkZyb21GaWxlVVJMcyhlZGl0b3Iub3V0bGluZS5nZXRGaWxlVVJMKCksIGZpbGVVUkwpXG4gICAgICBpdGVtLmFkZEVsZW1lbnRJbkJvZHlUZXh0UmFuZ2UgJ0EnLCBocmVmOiBmaWxlSFJFRiwgMCwgZmlsZS5uYW1lLmxlbmd0aFxuICAgICAgaXRlbXMucHVzaCBpdGVtXG4gIGl0ZW1zXG5cbnJlZ2lzdGVyU2VyaWFsaXphdGlvblxuICBwcmlvcml0eTogMFxuICBleHRlbnNpb25zOiBbJ2Z0bWwnXVxuICBtaW1lVHlwZXM6IFtDb25zdGFudHMuRlRNTE1pbWVUeXBlXVxuICBzZXJpYWxpemVJdGVtczogKGl0ZW1zLCBlZGl0b3IpIC0+XG4gICAgcmVxdWlyZSgnLi9zZXJpYWxpemF0aW9ucy9mdG1sJykuc2VyaWFsaXplSXRlbXMoaXRlbXMsIGVkaXRvcilcbiAgZGVzZXJpYWxpemVJdGVtczogKGl0ZW1zRGF0YSwgb3V0bGluZSkgLT5cbiAgICByZXF1aXJlKCcuL3NlcmlhbGl6YXRpb25zL2Z0bWwnKS5kZXNlcmlhbGl6ZUl0ZW1zKGl0ZW1zRGF0YSwgb3V0bGluZSlcblxucmVnaXN0ZXJTZXJpYWxpemF0aW9uXG4gIHByaW9yaXR5OiAxXG4gIGV4dGVuc2lvbnM6IFsnb3BtbCddXG4gIG1pbWVUeXBlczogW0NvbnN0YW50cy5PUE1MTWltZVR5cGVdXG4gIHNlcmlhbGl6ZUl0ZW1zOiAoaXRlbXMsIGVkaXRvcikgLT5cbiAgICByZXF1aXJlKCcuL3NlcmlhbGl6YXRpb25zL29wbWwnKS5zZXJpYWxpemVJdGVtcyhpdGVtcywgZWRpdG9yKVxuICBkZXNlcmlhbGl6ZUl0ZW1zOiAoaXRlbXNEYXRhLCBvdXRsaW5lKSAtPlxuICAgIHJlcXVpcmUoJy4vc2VyaWFsaXphdGlvbnMvb3BtbCcpLmRlc2VyaWFsaXplSXRlbXMoaXRlbXNEYXRhLCBvdXRsaW5lKVxuXG5yZWdpc3RlclNlcmlhbGl6YXRpb25cbiAgcHJpb3JpdHk6IDJcbiAgZXh0ZW5zaW9uczogW11cbiAgbWltZVR5cGVzOiBbQ29uc3RhbnRzLkhUTUxNaW1lVHlwZV1cbiAgc2VyaWFsaXplSXRlbXM6IChpdGVtcywgZWRpdG9yKSAtPlxuICAgIHJlcXVpcmUoJy4vc2VyaWFsaXphdGlvbnMvaHRtbC1mcmFnbWVudCcpLnNlcmlhbGl6ZUl0ZW1zKGl0ZW1zLCBlZGl0b3IpXG4gIGRlc2VyaWFsaXplSXRlbXM6IChpdGVtc0RhdGEsIG91dGxpbmUpIC0+XG4gICAgcmVxdWlyZSgnLi9zZXJpYWxpemF0aW9ucy9odG1sLWZyYWdtZW50JykuZGVzZXJpYWxpemVJdGVtcyhpdGVtc0RhdGEsIG91dGxpbmUpXG5cbnJlZ2lzdGVyU2VyaWFsaXphdGlvblxuICBwcmlvcml0eTogM1xuICBleHRlbnNpb25zOiBbXVxuICBtaW1lVHlwZXM6IFtDb25zdGFudHMuVVJJTGlzdE1pbWVUeXBlXVxuICBzZXJpYWxpemVJdGVtczogKGl0ZW1zLCBlZGl0b3IpIC0+XG4gICAgcmVxdWlyZSgnLi9zZXJpYWxpemF0aW9ucy91cmktbGlzdCcpLnNlcmlhbGl6ZUl0ZW1zKGl0ZW1zLCBlZGl0b3IpXG4gIGRlc2VyaWFsaXplSXRlbXM6IChpdGVtc0RhdGEsIG91dGxpbmUpIC0+XG4gICAgcmVxdWlyZSgnLi9zZXJpYWxpemF0aW9ucy91cmktbGlzdCcpLmRlc2VyaWFsaXplSXRlbXMoaXRlbXNEYXRhLCBvdXRsaW5lKVxuXG5yZWdpc3RlclNlcmlhbGl6YXRpb25cbiAgcHJpb3JpdHk6IDRcbiAgZXh0ZW5zaW9uczogW11cbiAgbWltZVR5cGVzOiBbQ29uc3RhbnRzLlRFWFRNaW1lVHlwZV1cbiAgc2VyaWFsaXplSXRlbXM6IChpdGVtcywgZWRpdG9yKSAtPlxuICAgIHJlcXVpcmUoJy4vc2VyaWFsaXphdGlvbnMvdGV4dCcpLnNlcmlhbGl6ZUl0ZW1zKGl0ZW1zLCBlZGl0b3IpXG4gIGRlc2VyaWFsaXplSXRlbXM6IChpdGVtc0RhdGEsIG91dGxpbmUpIC0+XG4gICAgcmVxdWlyZSgnLi9zZXJpYWxpemF0aW9ucy90ZXh0JykuZGVzZXJpYWxpemVJdGVtcyhpdGVtc0RhdGEsIG91dGxpbmUpXG5cbm1vZHVsZS5leHBvcnRzID1cbiAgcmVnaXN0ZXJTZXJpYWxpemF0aW9uOiByZWdpc3RlclNlcmlhbGl6YXRpb25cbiAgZ2V0TWltZVR5cGVGb3JVUkk6IGdldE1pbWVUeXBlRm9yVVJJXG4gIHNlcmlhbGl6ZUl0ZW1zOiBzZXJpYWxpemVJdGVtc1xuICBkZXNlcmlhbGl6ZUl0ZW1zOiBkZXNlcmlhbGl6ZUl0ZW1zXG4gIHdyaXRlSXRlbXNUb0RhdGFUcmFuc2Zlcjogd3JpdGVJdGVtc1RvRGF0YVRyYW5zZmVyXG4gIHJlYWRJdGVtc0Zyb21EYXRhVHJhbnNmZXI6IHJlYWRJdGVtc0Zyb21EYXRhVHJhbnNmZXIiXX0=
