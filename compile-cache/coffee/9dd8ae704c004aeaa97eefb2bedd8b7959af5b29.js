(function() {
  var Point, TagParser;

  Point = require('atom').Point;

  module.exports = TagParser = (function() {
    function TagParser(tags, grammar) {
      this.tags = tags;
      this.grammar = grammar;
      if (this.grammar === 'source.c++' || this.grammar === 'source.c' || this.grammar === 'source.cpp') {
        this.splitSymbol = '::';
      } else {
        this.splitSymbol = '.';
      }
    }

    TagParser.prototype.splitParentTag = function(parentTag) {
      var index;
      index = parentTag.indexOf(':');
      return {
        type: parentTag.substr(0, index),
        parent: parentTag.substr(index + 1)
      };
    };

    TagParser.prototype.splitNameTag = function(nameTag) {
      var index;
      index = nameTag.lastIndexOf(this.splitSymbol);
      if (index >= 0) {
        return nameTag.substr(index + this.splitSymbol.length);
      } else {
        return nameTag;
      }
    };

    TagParser.prototype.buildMissedParent = function(parents) {
      var i, j, len, name, now, parentTags, pre, ref, ref1, results, type;
      parentTags = Object.keys(parents);
      parentTags.sort((function(_this) {
        return function(a, b) {
          var nameA, nameB, ref, ref1, typeA, typeB;
          ref = _this.splitParentTag(a), typeA = ref.typeA, nameA = ref.parent;
          ref1 = _this.splitParentTag(b), typeB = ref1.typeB, nameB = ref1.parent;
          if (nameA < nameB) {
            return -1;
          } else if (nameA > nameB) {
            return 1;
          } else {
            return 0;
          }
        };
      })(this));
      results = [];
      for (i = j = 0, len = parentTags.length; j < len; i = ++j) {
        now = parentTags[i];
        ref = this.splitParentTag(now), type = ref.type, name = ref.parent;
        if (parents[now] === null) {
          parents[now] = {
            name: name,
            type: type,
            position: null,
            parent: null
          };
          this.tags.push(parents[now]);
          if (i >= 1) {
            pre = parentTags[i - 1];
            ref1 = this.splitParentTag(pre), type = ref1.type, name = ref1.parent;
            if (now.indexOf(name) >= 0) {
              parents[now].parent = pre;
              results.push(parents[now].name = this.splitNameTag(parents[now].name));
            } else {
              results.push(void 0);
            }
          } else {
            results.push(void 0);
          }
        } else {
          results.push(void 0);
        }
      }
      return results;
    };

    TagParser.prototype.parse = function() {
      var j, k, key, l, len, len1, len2, len3, m, parent, parents, ref, ref1, ref2, ref3, ref4, roots, tag, type, types;
      roots = [];
      parents = {};
      types = {};
      this.tags.sort((function(_this) {
        return function(a, b) {
          return a.position.row - b.position.row;
        };
      })(this));
      ref = this.tags;
      for (j = 0, len = ref.length; j < len; j++) {
        tag = ref[j];
        if (tag.parent) {
          parents[tag.parent] = null;
        }
      }
      ref1 = this.tags;
      for (k = 0, len1 = ref1.length; k < len1; k++) {
        tag = ref1[k];
        if (tag.parent) {
          ref2 = this.splitParentTag(tag.parent), type = ref2.type, parent = ref2.parent;
          key = tag.type + ':' + parent + this.splitSymbol + tag.name;
        } else {
          key = tag.type + ':' + tag.name;
        }
        parents[key] = tag;
      }
      this.buildMissedParent(parents);
      ref3 = this.tags;
      for (l = 0, len2 = ref3.length; l < len2; l++) {
        tag = ref3[l];
        if (tag.parent) {
          parent = parents[tag.parent];
          if (!parent.position) {
            parent.position = new Point(tag.position.row - 1);
          }
        }
      }
      this.tags.sort((function(_this) {
        return function(a, b) {
          return a.position.row - b.position.row;
        };
      })(this));
      ref4 = this.tags;
      for (m = 0, len3 = ref4.length; m < len3; m++) {
        tag = ref4[m];
        tag.label = tag.name;
        tag.icon = "icon-" + tag.type;
        if (tag.parent) {
          parent = parents[tag.parent];
          if (parent.children == null) {
            parent.children = [];
          }
          parent.children.push(tag);
        } else {
          roots.push(tag);
        }
        types[tag.type] = null;
      }
      return {
        root: {
          label: 'root',
          icon: null,
          children: roots
        },
        types: Object.keys(types)
      };
    };

    TagParser.prototype.getNearestTag = function(row) {
      var left, mid, midRow, nearest, right;
      left = 0;
      right = this.tags.length - 1;
      while (left <= right) {
        mid = Math.floor((left + right) / 2);
        midRow = this.tags[mid].position.row;
        if (row < midRow) {
          right = mid - 1;
        } else {
          left = mid + 1;
        }
      }
      nearest = left - 1;
      return this.tags[nearest];
    };

    return TagParser;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL2V2YW5oZW5kcml4MS8uYXRvbS9wYWNrYWdlcy9zeW1ib2xzLXRyZWUtdmlldy9saWIvdGFnLXBhcnNlci5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFBQSxNQUFBOztFQUFDLFFBQVMsT0FBQSxDQUFRLE1BQVI7O0VBRVYsTUFBTSxDQUFDLE9BQVAsR0FDUTtJQUNTLG1CQUFDLElBQUQsRUFBTyxPQUFQO01BQ1gsSUFBQyxDQUFBLElBQUQsR0FBUTtNQUNSLElBQUMsQ0FBQSxPQUFELEdBQVc7TUFHWCxJQUFHLElBQUMsQ0FBQSxPQUFELEtBQVksWUFBWixJQUE0QixJQUFDLENBQUEsT0FBRCxLQUFZLFVBQXhDLElBQ0EsSUFBQyxDQUFBLE9BQUQsS0FBWSxZQURmO1FBRUUsSUFBQyxDQUFBLFdBQUQsR0FBZSxLQUZqQjtPQUFBLE1BQUE7UUFJRSxJQUFDLENBQUEsV0FBRCxHQUFlLElBSmpCOztJQUxXOzt3QkFXYixjQUFBLEdBQWdCLFNBQUMsU0FBRDtBQUNkLFVBQUE7TUFBQSxLQUFBLEdBQVEsU0FBUyxDQUFDLE9BQVYsQ0FBa0IsR0FBbEI7YUFFUjtRQUFBLElBQUEsRUFBTSxTQUFTLENBQUMsTUFBVixDQUFpQixDQUFqQixFQUFvQixLQUFwQixDQUFOO1FBQ0EsTUFBQSxFQUFRLFNBQVMsQ0FBQyxNQUFWLENBQWlCLEtBQUEsR0FBTSxDQUF2QixDQURSOztJQUhjOzt3QkFNaEIsWUFBQSxHQUFjLFNBQUMsT0FBRDtBQUNaLFVBQUE7TUFBQSxLQUFBLEdBQVEsT0FBTyxDQUFDLFdBQVIsQ0FBb0IsSUFBQyxDQUFBLFdBQXJCO01BQ1IsSUFBRyxLQUFBLElBQVMsQ0FBWjtBQUNFLGVBQU8sT0FBTyxDQUFDLE1BQVIsQ0FBZSxLQUFBLEdBQU0sSUFBQyxDQUFBLFdBQVcsQ0FBQyxNQUFsQyxFQURUO09BQUEsTUFBQTtBQUdFLGVBQU8sUUFIVDs7SUFGWTs7d0JBT2Qs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QkErQ1AsYUFBQSxHQUFlLFNBQUMsR0FBRDtBQUNiLFVBQUE7TUFBQSxJQUFBLEdBQU87TUFDUCxLQUFBLEdBQVEsSUFBQyxDQUFBLElBQUksQ0FBQyxNQUFOLEdBQWE7QUFDckIsYUFBTSxJQUFBLElBQVEsS0FBZDtRQUNFLEdBQUEsY0FBTSxDQUFDLElBQUEsR0FBTyxLQUFSLElBQWtCO1FBQ3hCLE1BQUEsR0FBUyxJQUFDLENBQUEsSUFBSyxDQUFBLEdBQUEsQ0FBSSxDQUFDLFFBQVEsQ0FBQztRQUU3QixJQUFHLEdBQUEsR0FBTSxNQUFUO1VBQ0UsS0FBQSxHQUFRLEdBQUEsR0FBTSxFQURoQjtTQUFBLE1BQUE7VUFHRSxJQUFBLEdBQU8sR0FBQSxHQUFNLEVBSGY7O01BSkY7TUFTQSxPQUFBLEdBQVUsSUFBQSxHQUFPO0FBQ2pCLGFBQU8sSUFBQyxDQUFBLElBQUssQ0FBQSxPQUFBO0lBYkE7Ozs7O0FBNUduQiIsInNvdXJjZXNDb250ZW50IjpbIntQb2ludH0gPSByZXF1aXJlICdhdG9tJ1xuXG5tb2R1bGUuZXhwb3J0cyA9XG4gIGNsYXNzIFRhZ1BhcnNlclxuICAgIGNvbnN0cnVjdG9yOiAodGFncywgZ3JhbW1hcikgLT5cbiAgICAgIEB0YWdzID0gdGFnc1xuICAgICAgQGdyYW1tYXIgPSBncmFtbWFyXG5cbiAgICAgICNzcGxpdFN5bWJvbCA9ICc6OicgZm9yIGMvYysrLCBhbmQgJy4nIGZvciBvdGhlcnMuXG4gICAgICBpZiBAZ3JhbW1hciA9PSAnc291cmNlLmMrKycgb3IgQGdyYW1tYXIgPT0gJ3NvdXJjZS5jJyBvclxuICAgICAgICAgQGdyYW1tYXIgPT0gJ3NvdXJjZS5jcHAnXG4gICAgICAgIEBzcGxpdFN5bWJvbCA9ICc6OidcbiAgICAgIGVsc2VcbiAgICAgICAgQHNwbGl0U3ltYm9sID0gJy4nXG5cbiAgICBzcGxpdFBhcmVudFRhZzogKHBhcmVudFRhZykgLT5cbiAgICAgIGluZGV4ID0gcGFyZW50VGFnLmluZGV4T2YoJzonKVxuXG4gICAgICB0eXBlOiBwYXJlbnRUYWcuc3Vic3RyKDAsIGluZGV4KVxuICAgICAgcGFyZW50OiBwYXJlbnRUYWcuc3Vic3RyKGluZGV4KzEpXG5cbiAgICBzcGxpdE5hbWVUYWc6IChuYW1lVGFnKSAtPlxuICAgICAgaW5kZXggPSBuYW1lVGFnLmxhc3RJbmRleE9mKEBzcGxpdFN5bWJvbClcbiAgICAgIGlmIGluZGV4ID49IDBcbiAgICAgICAgcmV0dXJuIG5hbWVUYWcuc3Vic3RyKGluZGV4K0BzcGxpdFN5bWJvbC5sZW5ndGgpXG4gICAgICBlbHNlXG4gICAgICAgIHJldHVybiBuYW1lVGFnXG5cbiAgICBidWlsZE1pc3NlZFBhcmVudDogKHBhcmVudHMpIC0+XG4gICAgICBwYXJlbnRUYWdzID0gT2JqZWN0LmtleXMocGFyZW50cylcbiAgICAgIHBhcmVudFRhZ3Muc29ydCAoYSwgYikgPT5cbiAgICAgICAge3R5cGVBLCBwYXJlbnQ6IG5hbWVBfSA9IEBzcGxpdFBhcmVudFRhZyhhKVxuICAgICAgICB7dHlwZUIsIHBhcmVudDogbmFtZUJ9ID0gQHNwbGl0UGFyZW50VGFnKGIpXG5cbiAgICAgICAgaWYgbmFtZUEgPCBuYW1lQlxuICAgICAgICAgIHJldHVybiAtMVxuICAgICAgICBlbHNlIGlmIG5hbWVBID4gbmFtZUJcbiAgICAgICAgICByZXR1cm4gMVxuICAgICAgICBlbHNlXG4gICAgICAgICAgcmV0dXJuIDBcblxuICAgICAgZm9yIG5vdywgaSBpbiBwYXJlbnRUYWdzXG4gICAgICAgIHt0eXBlLCBwYXJlbnQ6IG5hbWV9ID0gQHNwbGl0UGFyZW50VGFnKG5vdylcblxuICAgICAgICBpZiBwYXJlbnRzW25vd10gaXMgbnVsbFxuICAgICAgICAgIHBhcmVudHNbbm93XSA9IHtcbiAgICAgICAgICAgIG5hbWU6IG5hbWUsXG4gICAgICAgICAgICB0eXBlOiB0eXBlLFxuICAgICAgICAgICAgcG9zaXRpb246IG51bGwsXG4gICAgICAgICAgICBwYXJlbnQ6IG51bGxcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBAdGFncy5wdXNoKHBhcmVudHNbbm93XSlcblxuICAgICAgICAgIGlmIGkgPj0gMVxuICAgICAgICAgICAgcHJlID0gcGFyZW50VGFnc1tpLTFdXG4gICAgICAgICAgICB7dHlwZSwgcGFyZW50OiBuYW1lfSA9IEBzcGxpdFBhcmVudFRhZyhwcmUpXG4gICAgICAgICAgICBpZiBub3cuaW5kZXhPZihuYW1lKSA+PSAwXG4gICAgICAgICAgICAgIHBhcmVudHNbbm93XS5wYXJlbnQgPSBwcmVcbiAgICAgICAgICAgICAgcGFyZW50c1tub3ddLm5hbWUgPSBAc3BsaXROYW1lVGFnKHBhcmVudHNbbm93XS5uYW1lKVxuXG4gICAgcGFyc2U6IC0+XG4gICAgICByb290cyA9IFtdXG4gICAgICBwYXJlbnRzID0ge31cbiAgICAgIHR5cGVzID0ge31cblxuICAgICAgIyBzb3J0IHRhZ3MgYnkgcm93IG51bWJlclxuICAgICAgQHRhZ3Muc29ydCAoYSwgYikgPT5cbiAgICAgICAgcmV0dXJuIGEucG9zaXRpb24ucm93IC0gYi5wb3NpdGlvbi5yb3dcblxuICAgICAgIyB0cnkgdG8gZmluZCBvdXQgYWxsIHRhZ3Mgd2l0aCBwYXJlbnQgaW5mb3JtYXRpb25cbiAgICAgIGZvciB0YWcgaW4gQHRhZ3NcbiAgICAgICAgcGFyZW50c1t0YWcucGFyZW50XSA9IG51bGwgaWYgdGFnLnBhcmVudFxuXG4gICAgICAjIHRyeSB0byBidWlsZCB1cCByZWxhdGlvbnNoaXBzIGJldHdlZW4gcGFyZW50IGluZm9ybWF0aW9uIGFuZCB0aGUgcmVhbCB0YWdcbiAgICAgIGZvciB0YWcgaW4gQHRhZ3NcbiAgICAgICAgaWYgdGFnLnBhcmVudFxuICAgICAgICAgIHt0eXBlLCBwYXJlbnR9ID0gQHNwbGl0UGFyZW50VGFnKHRhZy5wYXJlbnQpXG4gICAgICAgICAga2V5ID0gdGFnLnR5cGUgKyAnOicgKyBwYXJlbnQgKyBAc3BsaXRTeW1ib2wgKyB0YWcubmFtZVxuICAgICAgICBlbHNlXG4gICAgICAgICAga2V5ID0gdGFnLnR5cGUgKyAnOicgKyB0YWcubmFtZVxuICAgICAgICBwYXJlbnRzW2tleV0gPSB0YWdcblxuICAgICAgIyB0cnkgdG8gYnVpbGQgdXAgdGhlIG1pc3NlZCBwYXJlbnRcbiAgICAgIEBidWlsZE1pc3NlZFBhcmVudChwYXJlbnRzKVxuXG4gICAgICBmb3IgdGFnIGluIEB0YWdzXG4gICAgICAgIGlmIHRhZy5wYXJlbnRcbiAgICAgICAgICBwYXJlbnQgPSBwYXJlbnRzW3RhZy5wYXJlbnRdXG4gICAgICAgICAgdW5sZXNzIHBhcmVudC5wb3NpdGlvblxuICAgICAgICAgICAgcGFyZW50LnBvc2l0aW9uID0gbmV3IFBvaW50KHRhZy5wb3NpdGlvbi5yb3ctMSlcblxuICAgICAgQHRhZ3Muc29ydCAoYSwgYikgPT5cbiAgICAgICAgcmV0dXJuIGEucG9zaXRpb24ucm93IC0gYi5wb3NpdGlvbi5yb3dcblxuICAgICAgZm9yIHRhZyBpbiBAdGFnc1xuICAgICAgICB0YWcubGFiZWwgPSB0YWcubmFtZVxuICAgICAgICB0YWcuaWNvbiA9IFwiaWNvbi0je3RhZy50eXBlfVwiXG4gICAgICAgIGlmIHRhZy5wYXJlbnRcbiAgICAgICAgICBwYXJlbnQgPSBwYXJlbnRzW3RhZy5wYXJlbnRdXG4gICAgICAgICAgcGFyZW50LmNoaWxkcmVuID89IFtdXG4gICAgICAgICAgcGFyZW50LmNoaWxkcmVuLnB1c2godGFnKVxuICAgICAgICBlbHNlXG4gICAgICAgICAgcm9vdHMucHVzaCh0YWcpXG4gICAgICAgIHR5cGVzW3RhZy50eXBlXSA9IG51bGxcblxuICAgICAgcmV0dXJuIHtyb290OiB7bGFiZWw6ICdyb290JywgaWNvbjogbnVsbCwgY2hpbGRyZW46IHJvb3RzfSwgdHlwZXM6IE9iamVjdC5rZXlzKHR5cGVzKX1cblxuICAgIGdldE5lYXJlc3RUYWc6IChyb3cpIC0+XG4gICAgICBsZWZ0ID0gMFxuICAgICAgcmlnaHQgPSBAdGFncy5sZW5ndGgtMVxuICAgICAgd2hpbGUgbGVmdCA8PSByaWdodFxuICAgICAgICBtaWQgPSAobGVmdCArIHJpZ2h0KSAvLyAyXG4gICAgICAgIG1pZFJvdyA9IEB0YWdzW21pZF0ucG9zaXRpb24ucm93XG5cbiAgICAgICAgaWYgcm93IDwgbWlkUm93XG4gICAgICAgICAgcmlnaHQgPSBtaWQgLSAxXG4gICAgICAgIGVsc2VcbiAgICAgICAgICBsZWZ0ID0gbWlkICsgMVxuXG4gICAgICBuZWFyZXN0ID0gbGVmdCAtIDFcbiAgICAgIHJldHVybiBAdGFnc1tuZWFyZXN0XVxuIl19
