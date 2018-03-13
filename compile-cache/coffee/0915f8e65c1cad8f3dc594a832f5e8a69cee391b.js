(function() {
  var $, $$, CommandsKeystrokeHumanizer, GitInit, GitPaletteView, GitPlusCommands, SelectListView, _, fuzzyFilter, ref,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  _ = require('underscore-plus');

  ref = require('atom-space-pen-views'), $ = ref.$, $$ = ref.$$, SelectListView = ref.SelectListView;

  GitPlusCommands = require('../git-plus-commands');

  GitInit = require('../models/git-init');

  fuzzyFilter = require('fuzzaldrin').filter;

  CommandsKeystrokeHumanizer = require('../command-keystroke-humanizer')();

  module.exports = GitPaletteView = (function(superClass) {
    extend(GitPaletteView, superClass);

    function GitPaletteView() {
      return GitPaletteView.__super__.constructor.apply(this, arguments);
    }

    GitPaletteView.prototype.initialize = function() {
      GitPaletteView.__super__.initialize.apply(this, arguments);
      this.addClass('git-palette');
      return this.toggle();
    };

    GitPaletteView.prototype.getFilterKey = function() {
      return 'description';
    };

    GitPaletteView.prototype.cancelled = function() {
      return this.hide();
    };

    GitPaletteView.prototype.toggle = function() {
      var ref1;
      if ((ref1 = this.panel) != null ? ref1.isVisible() : void 0) {
        return this.cancel();
      } else {
        return this.show();
      }
    };

    GitPaletteView.prototype.show = function() {
      if (this.panel == null) {
        this.panel = atom.workspace.addModalPanel({
          item: this
        });
      }
      this.storeFocusedElement();
      if (this.previouslyFocusedElement[0] && this.previouslyFocusedElement[0] !== document.body) {
        this.commandElement = this.previouslyFocusedElement;
      } else {
        this.commandElement = atom.views.getView(atom.workspace);
      }
      this.keyBindings = atom.keymaps.findKeyBindings({
        target: this.commandElement[0]
      });
      return GitPlusCommands().then((function(_this) {
        return function(commands) {
          var keystrokes;
          keystrokes = CommandsKeystrokeHumanizer.get(commands);
          commands = commands.map(function(c) {
            return {
              name: c[0],
              description: c[1],
              func: c[2],
              keystroke: keystrokes[c[0]]
            };
          });
          commands = _.sortBy(commands, 'description');
          _this.setItems(commands);
          _this.panel.show();
          return _this.focusFilterEditor();
        };
      })(this))["catch"]((function(_this) {
        return function(err) {
          var commands;
          (commands = []).push({
            name: 'git-plus:init',
            description: 'Init',
            func: function() {
              return GitInit();
            }
          });
          _this.setItems(commands);
          _this.panel.show();
          return _this.focusFilterEditor();
        };
      })(this));
    };

    GitPaletteView.prototype.populateList = function() {
      var filterQuery, filteredItems, i, item, itemView, j, options, ref1, ref2, ref3;
      if (this.items == null) {
        return;
      }
      filterQuery = this.getFilterQuery();
      if (filterQuery.length) {
        options = {
          key: this.getFilterKey()
        };
        filteredItems = fuzzyFilter(this.items, filterQuery, options);
      } else {
        filteredItems = this.items;
      }
      this.list.empty();
      if (filteredItems.length) {
        this.setError(null);
        for (i = j = 0, ref1 = Math.min(filteredItems.length, this.maxItems); 0 <= ref1 ? j < ref1 : j > ref1; i = 0 <= ref1 ? ++j : --j) {
          item = (ref2 = filteredItems[i].original) != null ? ref2 : filteredItems[i];
          itemView = $(this.viewForItem(item, (ref3 = filteredItems[i].string) != null ? ref3 : null));
          itemView.data('select-list-item', item);
          this.list.append(itemView);
        }
        return this.selectItemView(this.list.find('li:first'));
      } else {
        return this.setError(this.getEmptyMessage(this.items.length, filteredItems.length));
      }
    };

    GitPaletteView.prototype.hide = function() {
      var ref1;
      return (ref1 = this.panel) != null ? ref1.destroy() : void 0;
    };

    GitPaletteView.prototype.viewForItem = function(arg, matchedStr) {
      var description, keystroke, name;
      name = arg.name, description = arg.description, keystroke = arg.keystroke;
      return $$(function() {
        return this.li({
          "class": 'command',
          'data-command-name': name
        }, (function(_this) {
          return function() {
            if (matchedStr != null) {
              return _this.raw(matchedStr);
            } else {
              _this.span(description);
              if (keystroke != null) {
                return _this.div({
                  "class": 'pull-right'
                }, function() {
                  return _this.kbd({
                    "class": 'key-binding'
                  }, keystroke);
                });
              }
            }
          };
        })(this));
      });
    };

    GitPaletteView.prototype.confirmed = function(arg) {
      var func;
      func = arg.func;
      this.cancel();
      return func();
    };

    return GitPaletteView;

  })(SelectListView);

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL2V2YW5oZW5kcml4MS8uYXRvbS9wYWNrYWdlcy9naXQtcGx1cy9saWIvdmlld3MvZ2l0LXBhbGV0dGUtdmlldy5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFBQSxNQUFBLGdIQUFBO0lBQUE7OztFQUFBLENBQUEsR0FBSSxPQUFBLENBQVEsaUJBQVI7O0VBQ0osTUFBMEIsT0FBQSxDQUFRLHNCQUFSLENBQTFCLEVBQUMsU0FBRCxFQUFJLFdBQUosRUFBUTs7RUFDUixlQUFBLEdBQWtCLE9BQUEsQ0FBUSxzQkFBUjs7RUFDbEIsT0FBQSxHQUFVLE9BQUEsQ0FBUSxvQkFBUjs7RUFDVixXQUFBLEdBQWMsT0FBQSxDQUFRLFlBQVIsQ0FBcUIsQ0FBQzs7RUFDcEMsMEJBQUEsR0FBNkIsT0FBQSxDQUFRLGdDQUFSLENBQUEsQ0FBQTs7RUFDN0IsTUFBTSxDQUFDLE9BQVAsR0FDTTs7Ozs7Ozs2QkFFSixVQUFBLEdBQVksU0FBQTtNQUNWLGdEQUFBLFNBQUE7TUFDQSxJQUFDLENBQUEsUUFBRCxDQUFVLGFBQVY7YUFDQSxJQUFDLENBQUEsTUFBRCxDQUFBO0lBSFU7OzZCQUtaLFlBQUEsR0FBYyxTQUFBO2FBQ1o7SUFEWTs7NkJBR2QsU0FBQSxHQUFXLFNBQUE7YUFBRyxJQUFDLENBQUEsSUFBRCxDQUFBO0lBQUg7OzZCQUVYLE1BQUEsR0FBUSxTQUFBO0FBQ04sVUFBQTtNQUFBLHNDQUFTLENBQUUsU0FBUixDQUFBLFVBQUg7ZUFDRSxJQUFDLENBQUEsTUFBRCxDQUFBLEVBREY7T0FBQSxNQUFBO2VBR0UsSUFBQyxDQUFBLElBQUQsQ0FBQSxFQUhGOztJQURNOzs2QkFNUixJQUFBLEdBQU0sU0FBQTs7UUFDSixJQUFDLENBQUEsUUFBUyxJQUFJLENBQUMsU0FBUyxDQUFDLGFBQWYsQ0FBNkI7VUFBQSxJQUFBLEVBQU0sSUFBTjtTQUE3Qjs7TUFFVixJQUFDLENBQUEsbUJBQUQs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dXJjZXNDb250ZW50IjpbIl8gPSByZXF1aXJlICd1bmRlcnNjb3JlLXBsdXMnXG57JCwgJCQsIFNlbGVjdExpc3RWaWV3fSA9IHJlcXVpcmUgJ2F0b20tc3BhY2UtcGVuLXZpZXdzJ1xuR2l0UGx1c0NvbW1hbmRzID0gcmVxdWlyZSAnLi4vZ2l0LXBsdXMtY29tbWFuZHMnXG5HaXRJbml0ID0gcmVxdWlyZSAnLi4vbW9kZWxzL2dpdC1pbml0J1xuZnV6enlGaWx0ZXIgPSByZXF1aXJlKCdmdXp6YWxkcmluJykuZmlsdGVyXG5Db21tYW5kc0tleXN0cm9rZUh1bWFuaXplciA9IHJlcXVpcmUoJy4uL2NvbW1hbmQta2V5c3Ryb2tlLWh1bWFuaXplcicpKClcbm1vZHVsZS5leHBvcnRzID1cbmNsYXNzIEdpdFBhbGV0dGVWaWV3IGV4dGVuZHMgU2VsZWN0TGlzdFZpZXdcblxuICBpbml0aWFsaXplOiAtPlxuICAgIHN1cGVyXG4gICAgQGFkZENsYXNzKCdnaXQtcGFsZXR0ZScpXG4gICAgQHRvZ2dsZSgpXG5cbiAgZ2V0RmlsdGVyS2V5OiAtPlxuICAgICdkZXNjcmlwdGlvbidcblxuICBjYW5jZWxsZWQ6IC0+IEBoaWRlKClcblxuICB0b2dnbGU6IC0+XG4gICAgaWYgQHBhbmVsPy5pc1Zpc2libGUoKVxuICAgICAgQGNhbmNlbCgpXG4gICAgZWxzZVxuICAgICAgQHNob3coKVxuXG4gIHNob3c6IC0+XG4gICAgQHBhbmVsID89IGF0b20ud29ya3NwYWNlLmFkZE1vZGFsUGFuZWwoaXRlbTogdGhpcylcblxuICAgIEBzdG9yZUZvY3VzZWRFbGVtZW50KClcblxuICAgIGlmIEBwcmV2aW91c2x5Rm9jdXNlZEVsZW1lbnRbMF0gYW5kIEBwcmV2aW91c2x5Rm9jdXNlZEVsZW1lbnRbMF0gaXNudCBkb2N1bWVudC5ib2R5XG4gICAgICBAY29tbWFuZEVsZW1lbnQgPSBAcHJldmlvdXNseUZvY3VzZWRFbGVtZW50XG4gICAgZWxzZVxuICAgICAgQGNvbW1hbmRFbGVtZW50ID0gYXRvbS52aWV3cy5nZXRWaWV3KGF0b20ud29ya3NwYWNlKVxuICAgIEBrZXlCaW5kaW5ncyA9IGF0b20ua2V5bWFwcy5maW5kS2V5QmluZGluZ3ModGFyZ2V0OiBAY29tbWFuZEVsZW1lbnRbMF0pXG5cbiAgICBHaXRQbHVzQ29tbWFuZHMoKVxuICAgICAgLnRoZW4gKGNvbW1hbmRzKSA9PlxuICAgICAgICBrZXlzdHJva2VzID0gQ29tbWFuZHNLZXlzdHJva2VIdW1hbml6ZXIuZ2V0KGNvbW1hbmRzKVxuICAgICAgICBjb21tYW5kcyA9IGNvbW1hbmRzLm1hcCAoYykgLT4geyBuYW1lOiBjWzBdLCBkZXNjcmlwdGlvbjogY1sxXSwgZnVuYzogY1syXSwga2V5c3Ryb2tlOiBrZXlzdHJva2VzW2NbMF1dIH1cbiAgICAgICAgY29tbWFuZHMgPSBfLnNvcnRCeShjb21tYW5kcywgJ2Rlc2NyaXB0aW9uJylcbiAgICAgICAgQHNldEl0ZW1zKGNvbW1hbmRzKVxuICAgICAgICBAcGFuZWwuc2hvdygpXG4gICAgICAgIEBmb2N1c0ZpbHRlckVkaXRvcigpXG4gICAgICAuY2F0Y2ggKGVycikgPT5cbiAgICAgICAgKGNvbW1hbmRzID0gW10pLnB1c2ggeyBuYW1lOiAnZ2l0LXBsdXM6aW5pdCcsIGRlc2NyaXB0aW9uOiAnSW5pdCcsIGZ1bmM6IC0+IEdpdEluaXQoKSB9XG4gICAgICAgIEBzZXRJdGVtcyhjb21tYW5kcylcbiAgICAgICAgQHBhbmVsLnNob3coKVxuICAgICAgICBAZm9jdXNGaWx0ZXJFZGl0b3IoKVxuXG4gIHBvcHVsYXRlTGlzdDogLT5cbiAgICByZXR1cm4gdW5sZXNzIEBpdGVtcz9cblxuICAgIGZpbHRlclF1ZXJ5ID0gQGdldEZpbHRlclF1ZXJ5KClcbiAgICBpZiBmaWx0ZXJRdWVyeS5sZW5ndGhcbiAgICAgIG9wdGlvbnMgPVxuICAgICAgICBrZXk6IEBnZXRGaWx0ZXJLZXkoKVxuICAgICAgZmlsdGVyZWRJdGVtcyA9IGZ1enp5RmlsdGVyKEBpdGVtcywgZmlsdGVyUXVlcnksIG9wdGlvbnMpXG4gICAgZWxzZVxuICAgICAgZmlsdGVyZWRJdGVtcyA9IEBpdGVtc1xuXG4gICAgQGxpc3QuZW1wdHkoKVxuICAgIGlmIGZpbHRlcmVkSXRlbXMubGVuZ3RoXG4gICAgICBAc2V0RXJyb3IobnVsbClcbiAgICAgIGZvciBpIGluIFswLi4uTWF0aC5taW4oZmlsdGVyZWRJdGVtcy5sZW5ndGgsIEBtYXhJdGVtcyldXG4gICAgICAgIGl0ZW0gPSBmaWx0ZXJlZEl0ZW1zW2ldLm9yaWdpbmFsID8gZmlsdGVyZWRJdGVtc1tpXVxuICAgICAgICBpdGVtVmlldyA9ICQoQHZpZXdGb3JJdGVtKGl0ZW0sIGZpbHRlcmVkSXRlbXNbaV0uc3RyaW5nID8gbnVsbCkpXG4gICAgICAgIGl0ZW1WaWV3LmRhdGEoJ3NlbGVjdC1saXN0LWl0ZW0nLCBpdGVtKVxuICAgICAgICBAbGlzdC5hcHBlbmQoaXRlbVZpZXcpXG5cbiAgICAgIEBzZWxlY3RJdGVtVmlldyhAbGlzdC5maW5kKCdsaTpmaXJzdCcpKVxuICAgIGVsc2VcbiAgICAgIEBzZXRFcnJvcihAZ2V0RW1wdHlNZXNzYWdlKEBpdGVtcy5sZW5ndGgsIGZpbHRlcmVkSXRlbXMubGVuZ3RoKSlcblxuICBoaWRlOiAtPlxuICAgIEBwYW5lbD8uZGVzdHJveSgpXG5cbiAgdmlld0Zvckl0ZW06ICh7bmFtZSwgZGVzY3JpcHRpb24sIGtleXN0cm9rZX0sIG1hdGNoZWRTdHIpIC0+XG4gICAgJCQgLT5cbiAgICAgIEBsaSBjbGFzczogJ2NvbW1hbmQnLCAnZGF0YS1jb21tYW5kLW5hbWUnOiBuYW1lLCA9PlxuICAgICAgICBpZiBtYXRjaGVkU3RyPyB0aGVuIEByYXcobWF0Y2hlZFN0cilcbiAgICAgICAgZWxzZVxuICAgICAgICAgIEBzcGFuIGRlc2NyaXB0aW9uXG4gICAgICAgICAgaWYga2V5c3Ryb2tlP1xuICAgICAgICAgICAgQGRpdiBjbGFzczogJ3B1bGwtcmlnaHQnLCA9PlxuICAgICAgICAgICAgICBAa2JkIGNsYXNzOiAna2V5LWJpbmRpbmcnLCBrZXlzdHJva2VcblxuICBjb25maXJtZWQ6ICh7ZnVuY30pIC0+XG4gICAgQGNhbmNlbCgpXG4gICAgZnVuYygpXG4iXX0=
