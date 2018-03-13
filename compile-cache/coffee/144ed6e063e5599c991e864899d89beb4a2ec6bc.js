(function() {
  var Grammar, ItemPath, ItemPathGrammar, grammarPath,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  ItemPath = require('../core/item-path');

  grammarPath = atom.config.resourcePath + '/node_modules/first-mate/lib/grammar';

  Grammar = require(grammarPath);

  module.exports = ItemPathGrammar = (function(superClass) {
    extend(ItemPathGrammar, superClass);

    function ItemPathGrammar(registry) {
      ItemPathGrammar.__super__.constructor.call(this, registry, {
        name: 'ItemPath',
        scopeName: "source.itempath"
      });
    }

    ItemPathGrammar.prototype.getScore = function() {
      return 0;
    };

    ItemPathGrammar.prototype.tokenizeLine = function(line, ruleStack, firstLine, compatibilityMode) {
      var each, i, len, location, offset, parsed, ref, tags;
      if (firstLine == null) {
        firstLine = false;
      }
      if (compatibilityMode == null) {
        compatibilityMode = true;
      }
      tags = [this.startIdForScope('source.itempath')];
      parsed = ItemPath.parse(line);
      ruleStack = [];
      location = 0;
      if (parsed.error) {
        offset = parsed.error.offset;
        location = line.length;
        tags.push(this.startIdForScope('invalid.illegal'));
        tags.push(offset);
        tags.push(this.startIdForScope('invalid.illegal.error'));
        tags.push(line.length - offset);
      } else {
        ref = parsed.keywords;
        for (i = 0, len = ref.length; i < len; i++) {
          each = ref[i];
          if (each.offset > location) {
            tags.push(this.startIdForScope('none'));
            tags.push(each.offset - location);
          }
          tags.push(this.startIdForScope(each.label || 'none'));
          tags.push(each.text.length);
          location = each.offset + each.text.length;
        }
      }
      if (location < line.length) {
        tags.push(this.startIdForScope('none'));
        tags.push(line.length - location);
      }
      return {
        line: line,
        tags: tags,
        ruleStack: ruleStack
      };
    };

    return ItemPathGrammar;

  })(Grammar);

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL2V2YW5oZW5kcml4MS8uYXRvbS9wYWNrYWdlcy9mb2xkaW5ndGV4dC1mb3ItYXRvbS9saWIvZXh0ZW5zaW9ucy9pdGVtLXBhdGgtZ3JhbW1hci5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBRUE7QUFBQSxNQUFBLCtDQUFBO0lBQUE7OztFQUFBLFFBQUEsR0FBVyxPQUFBLENBQVEsbUJBQVI7O0VBRVgsV0FBQSxHQUFjLElBQUksQ0FBQyxNQUFNLENBQUMsWUFBWixHQUEyQjs7RUFDekMsT0FBQSxHQUFVLE9BQUEsQ0FBUSxXQUFSOztFQUVWLE1BQU0sQ0FBQyxPQUFQLEdBQ007OztJQUNTLHlCQUFDLFFBQUQ7TUFDWCxpREFBTSxRQUFOLEVBQ0U7UUFBQSxJQUFBLEVBQU0sVUFBTjtRQUNBLFNBQUEsRUFBVyxpQkFEWDtPQURGO0lBRFc7OzhCQUtiLFFBQUEsR0FBVSxTQUFBO2FBQUc7SUFBSDs7OEJBRVYsWUFBQSxHQUFjLFNBQUMsSUFBRCxFQUFPLFNBQVAsRUFBa0IsU0FBbEIsRUFBbUMsaUJBQW5DO0FBQ1osVUFBQTs7UUFEOEIsWUFBVTs7O1FBQU8sb0JBQWtCOztNQUNqRSxJQUFBLEdBQU8sQ0FBQyxJQUFDLENBQUEsZUFBRCxDQUFpQixpQkFBakIsQ0FBRDtNQUNQLE1BQUEsR0FBUyxRQUFRLENBQUMsS0FBVCxDQUFlLElBQWY7TUFDVCxTQUFBLEdBQVk7TUFDWixRQUFBLEdBQVc7TUFFWCxJQUFHLE1BQU0sQ0FBQyxLQUFWO1FBQ0UsTUFBQSxHQUFTLE1BQU0sQ0FBQyxLQUFLLENBQUM7UUFDdEIsUUFBQSxHQUFXLElBQUksQ0FBQztRQUNoQixJQUFJLENBQUMsSUFBTCxDQUFVLElBQUMsQ0FBQSxlQUFELENBQWlCLGlCQUFqQixDQUFWO1FBQ0EsSUFBSSxDQUFDLElBQUwsQ0FBVSxNQUFWO1FBQ0EsSUFBSSxDQUFDLElBQUwsQ0FBVSxJQUFDLENBQUEsZUFBRCxDQUFpQix1QkFBakIsQ0FBVjtRQUNBLElBQUksQ0FBQyxJQUFMLENBQVUsSUFBSSxDQUFDLE1BQUwsR0FBYyxNQUF4QixFQU5GO09BQUEsTUFBQTtBQVFFO0FBQUEsYUFBQSxxQ0FBQTs7VUFDRSxJQUFHLElBQUksQ0FBQyxNQUFMLEdBQWMsUUFBakI7WUFDRSxJQUFJLENBQUMsSUFBTCxDQUFVLElBQUMsQ0FBQSxlQUFELENBQWlCLE1BQWpCLENBQVY7WUFDQSxJQUFJLENBQUMsSUFBTCxDQUFVLElBQUksQ0FBQyxNQUFMLEdBQWMsUUFBeEIsRUFGRjs7VUFHQSxJQUFJLENBQUMsSUFBTCxDQUFVLElBQUMsQ0FBQSxlQUFELENBQWlCLElBQUksQ0FBQyxLQUFMLElBQWMsTUFBL0IsQ0FBVjtVQUNBLElBQUksQ0FBQyxJQUFMLENBQVUsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFwQjtVQUNBLFFBQUEsR0FBVyxJQUFJLENBQUMsTUFBTCxHQUFjLElBQUksQ0FBQyxJQUFJLENBQUM7QUFOckMsU0FSRjs7TUFnQkEsSUFBRyxRQUFBLEdBQVcsSUFBSSxDQUFDLE1BQW5CO1FBQ0UsSUFBSSxDQUFDLElBQUwsQ0FBVSxJQUFDLENBQUEsZUFBRCxDQUFpQixNQUFqQixDQUFWO1FBQ0EsSUFBSSxDQUFDLElBQUwsQ0FBVSxJQUFJLENBQUMsTUFBTCxHQUFjLFFBQXhCLEVBRkY7O2FBSUE7UUFBQyxNQUFBLElBQUQ7UUFBTyxNQUFBLElBQVA7UUFBYSxXQUFBLFNBQWI7O0lBMUJZOzs7O0tBUmM7QUFOOUIiLCJzb3VyY2VzQ29udGVudCI6WyIjIENvcHlyaWdodCAoYykgMjAxNSBKZXNzZSBHcm9zamVhbi4gQWxsIHJpZ2h0cyByZXNlcnZlZC5cblxuSXRlbVBhdGggPSByZXF1aXJlICcuLi9jb3JlL2l0ZW0tcGF0aCdcbiMgY29uc3RydWN0IHBhdGggb24gc2VwYXJhdGUgbGluZSBmb3IgZW5kb2trZW5cbmdyYW1tYXJQYXRoID0gYXRvbS5jb25maWcucmVzb3VyY2VQYXRoICsgJy9ub2RlX21vZHVsZXMvZmlyc3QtbWF0ZS9saWIvZ3JhbW1hcidcbkdyYW1tYXIgPSByZXF1aXJlIGdyYW1tYXJQYXRoXG5cbm1vZHVsZS5leHBvcnRzPVxuY2xhc3MgSXRlbVBhdGhHcmFtbWFyIGV4dGVuZHMgR3JhbW1hclxuICBjb25zdHJ1Y3RvcjogKHJlZ2lzdHJ5KSAtPlxuICAgIHN1cGVyIHJlZ2lzdHJ5LFxuICAgICAgbmFtZTogJ0l0ZW1QYXRoJ1xuICAgICAgc2NvcGVOYW1lOiBcInNvdXJjZS5pdGVtcGF0aFwiXG5cbiAgZ2V0U2NvcmU6IC0+IDBcblxuICB0b2tlbml6ZUxpbmU6IChsaW5lLCBydWxlU3RhY2ssIGZpcnN0TGluZT1mYWxzZSwgY29tcGF0aWJpbGl0eU1vZGU9dHJ1ZSkgLT5cbiAgICB0YWdzID0gW0BzdGFydElkRm9yU2NvcGUoJ3NvdXJjZS5pdGVtcGF0aCcpXVxuICAgIHBhcnNlZCA9IEl0ZW1QYXRoLnBhcnNlKGxpbmUpXG4gICAgcnVsZVN0YWNrID0gW11cbiAgICBsb2NhdGlvbiA9IDBcblxuICAgIGlmIHBhcnNlZC5lcnJvclxuICAgICAgb2Zmc2V0ID0gcGFyc2VkLmVycm9yLm9mZnNldFxuICAgICAgbG9jYXRpb24gPSBsaW5lLmxlbmd0aFxuICAgICAgdGFncy5wdXNoKEBzdGFydElkRm9yU2NvcGUoJ2ludmFsaWQuaWxsZWdhbCcpKVxuICAgICAgdGFncy5wdXNoKG9mZnNldClcbiAgICAgIHRhZ3MucHVzaChAc3RhcnRJZEZvclNjb3BlKCdpbnZhbGlkLmlsbGVnYWwuZXJyb3InKSlcbiAgICAgIHRhZ3MucHVzaChsaW5lLmxlbmd0aCAtIG9mZnNldClcbiAgICBlbHNlXG4gICAgICBmb3IgZWFjaCBpbiBwYXJzZWQua2V5d29yZHNcbiAgICAgICAgaWYgZWFjaC5vZmZzZXQgPiBsb2NhdGlvblxuICAgICAgICAgIHRhZ3MucHVzaChAc3RhcnRJZEZvclNjb3BlKCdub25lJykpXG4gICAgICAgICAgdGFncy5wdXNoKGVhY2gub2Zmc2V0IC0gbG9jYXRpb24pXG4gICAgICAgIHRhZ3MucHVzaChAc3RhcnRJZEZvclNjb3BlKGVhY2gubGFiZWwgb3IgJ25vbmUnKSlcbiAgICAgICAgdGFncy5wdXNoKGVhY2gudGV4dC5sZW5ndGgpXG4gICAgICAgIGxvY2F0aW9uID0gZWFjaC5vZmZzZXQgKyBlYWNoLnRleHQubGVuZ3RoXG5cbiAgICBpZiBsb2NhdGlvbiA8IGxpbmUubGVuZ3RoXG4gICAgICB0YWdzLnB1c2goQHN0YXJ0SWRGb3JTY29wZSgnbm9uZScpKVxuICAgICAgdGFncy5wdXNoKGxpbmUubGVuZ3RoIC0gbG9jYXRpb24pXG5cbiAgICB7bGluZSwgdGFncywgcnVsZVN0YWNrfSJdfQ==
