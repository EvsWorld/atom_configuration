(function() {
  var $, $$, SymbolsContextMenu, View, ref,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  ref = require('atom-space-pen-views'), $ = ref.$, $$ = ref.$$, View = ref.View;

  module.exports = SymbolsContextMenu = (function(superClass) {
    extend(SymbolsContextMenu, superClass);

    function SymbolsContextMenu() {
      return SymbolsContextMenu.__super__.constructor.apply(this, arguments);
    }

    SymbolsContextMenu.content = function() {
      return this.div({
        "class": 'symbols-context-menu'
      }, (function(_this) {
        return function() {
          return _this.div({
            "class": 'select-list popover-list'
          }, function() {
            _this.input({
              type: 'text',
              "class": 'hidden-input',
              outlet: 'hiddenInput'
            });
            return _this.ol({
              "class": 'list-group mark-active',
              outlet: 'menus'
            });
          });
        };
      })(this));
    };

    SymbolsContextMenu.prototype.initialize = function() {
      return this.hiddenInput.on('focusout', (function(_this) {
        return function() {
          return _this.hide();
        };
      })(this));
    };

    SymbolsContextMenu.prototype.clear = function() {
      return this.menus.empty();
    };

    SymbolsContextMenu.prototype.addMenu = function(name, active, callback) {
      var menu;
      menu = $$(function() {
        return this.li({
          "class": (active ? 'active' : '')
        }, name);
      });
      menu.on('mousedown', (function(_this) {
        return function() {
          menu.toggleClass('active');
          _this.hiddenInput.blur();
          return callback(name);
        };
      })(this));
      return this.menus.append(menu);
    };

    SymbolsContextMenu.prototype.toggle = function(type) {
      var i, len, menu, ref1, results;
      ref1 = this.menus.find('li');
      results = [];
      for (i = 0, len = ref1.length; i < len; i++) {
        menu = ref1[i];
        if ($(menu).text() === type) {
          results.push($(menu).toggleClass('active'));
        } else {
          results.push(void 0);
        }
      }
      return results;
    };

    SymbolsContextMenu.prototype.addSeparator = function() {
      return this.menus.append($$(function() {
        return this.li({
          "class": 'separator'
        });
      }));
    };

    SymbolsContextMenu.prototype.show = function() {
      if (this.menus.children().length > 0) {
        SymbolsContextMenu.__super__.show.apply(this, arguments);
        return this.hiddenInput.focus();
      }
    };

    SymbolsContextMenu.prototype.attach = function() {
      return atom.views.getView(atom.workspace).appendChild(this.element);
    };

    return SymbolsContextMenu;

  })(View);

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL2V2YW5oZW5kcml4MS8uYXRvbS9wYWNrYWdlcy9zeW1ib2xzLXRyZWUtdmlldy9saWIvc3ltYm9scy1jb250ZXh0LW1lbnUuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQUEsTUFBQSxvQ0FBQTtJQUFBOzs7RUFBQSxNQUFnQixPQUFBLENBQVEsc0JBQVIsQ0FBaEIsRUFBQyxTQUFELEVBQUksV0FBSixFQUFROztFQUVSLE1BQU0sQ0FBQyxPQUFQLEdBQ1E7Ozs7Ozs7SUFDSixrQkFBQyxDQUFBLE9BQUQsR0FBVSxTQUFBO2FBQ1IsSUFBQyxDQUFBLEdBQUQsQ0FBSztRQUFBLENBQUEsS0FBQSxDQUFBLEVBQU8sc0JBQVA7T0FBTCxFQUFvQyxDQUFBLFNBQUEsS0FBQTtlQUFBLFNBQUE7aUJBQ2xDLEtBQUMsQ0FBQSxHQUFELENBQUs7WUFBQSxDQUFBLEtBQUEsQ0FBQSxFQUFPLDBCQUFQO1dBQUwsRUFBd0MsU0FBQTtZQUN0QyxLQUFDLENBQUEsS0FBRCxDQUFPO2NBQUEsSUFBQSxFQUFNLE1BQU47Y0FBYyxDQUFBLEtBQUEsQ0FBQSxFQUFPLGNBQXJCO2NBQXFDLE1BQUEsRUFBUSxhQUE3QzthQUFQO21CQUNBLEtBQUMsQ0FBQSxFQUFELENBQUk7Y0FBQSxDQUFBLEtBQUEsQ0FBQSxFQUFPLHdCQUFQO2NBQWlDLE1BQUEsRUFBUSxPQUF6QzthQUFKO1VBRnNDLENBQXhDO1FBRGtDO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUFwQztJQURROztpQ0FNVixVQUFBLEdBQVksU0FBQTthQUNWLElBQUMsQ0FBQSxXQUFXLENBQUMsRUFBYixDQUFnQixVQUFoQixFQUE0QixDQUFBLFNBQUEsS0FBQTtlQUFBLFNBQUE7aUJBQzFCLEtBQUMsQ0FBQSxJQUFELENBQUE7UUFEMEI7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQTVCO0lBRFU7O2lDQUlaLEtBQUEsR0FBTyxTQUFBO2FBQ0wsSUFBQyxDQUFBLEtBQUssQ0FBQyxLQUFQLENBQUE7SUFESzs7aUNBR1AsT0FBQSxHQUFTLFNBQUMsSUFBRCxFQUFPLE1BQVAsRUFBZSxRQUFmO0FBQ1AsVUFBQTtNQUFBLElBQUEsR0FBTyxFQUFBLENBQUcsU0FBQTtlQUNSLElBQUMsQ0FBQSxFQUFELENBQUk7VUFBQSxDQUFBLEtBQUEsQ0FBQSxFQUFPLENBQUksTUFBSCxHQUFlLFFBQWYsR0FBNkIsRUFBOUIsQ0FBUDtTQUFKLEVBQThDLElBQTlDO01BRFEsQ0FBSDtNQUdQLElBQUksQ0FBQyxFQUFMLENBQVEsV0FBUixFQUFxQixDQUFBLFNBQUEsS0FBQTtlQUFBLFNBQUE7VUFDbkIsSUFBSSxDQUFDLFdBQUwsQ0FBaUIsUUFBakI7VUFDQSxLQUFDLENBQUEsV0FBVyxDQUFDLElBQWIsQ0FBQTtpQkFDQSxRQUFBLENBQVMsSUFBVDtRQUhtQjtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBckI7YUFLQSxJQUFDLENBQUEsS0FBSyxDQUFDLE1BQVAsQ0FBYyxJQUFkO0lBVE87O2lDQVdULE1BQUEsR0FBUSxTQUFDLElBQUQ7QUFDTixVQUFBO0FBQUE7QUFBQTtXQUFBLHNDQUFBOztRQUNFLElBQUcsQ0FBQSxDQUFFLElBQUYsQ0FBTyxDQUFDLElBQVIsQ0FBQSxDQUFBLEtBQWtCLElBQXJCO3VCQUNFLENBQUEsQ0FBRSxJQUFGLENBQU8sQ0FBQyxXQUFSLENBQW9CLFFBQXBCLEdBREY7U0FBQSxNQUFBOytCQUFBOztBQURGOztJQURNOztpQ0FLUixZQUFBLEdBQWMsU0FBQTthQUNaLElBQUMsQ0FBQSxLQUFLLENBQUMsTUFBUCxDQUFjLEVBQUEsQ0FBRyxTQUFBO2VBQ2YsSUFBQyxDQUFBLEVBQUQsQ0FBSTtVQUFBLENBQUEsS0FBQSxDQUFBLEVBQU8sV0FBUDtTQUFKO01BRGUsQ0FBSCxDQUFkO0lBRFk7O2lDQUlkLElBQUEsR0FBTSxTQUFBO01BQ0osSUFBRyxJQUFDLENBQUEsS0FBSyxDQUFDLFFBQVAsQ0FBQSxDQUFpQixDQUFDLE1BQWxCLEdBQTJCLENBQTlCO1FBQ0UsOENBQUEsU0FBQTtlQUNBLElBQUMsQ0FBQSxXQUFXLENBQUMsS0FBYixDQUFBLEVBRkY7O0lBREk7O2lDQUtOLE1BQUEsR0FBUSxTQUFBO2FBQ04sSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFYLENBQW1CLElBQUksQ0FBQyxTQUF4QixDQUFrQyxDQUFDLFdBQW5DLENBQStDLElBQUMsQ0FBQSxPQUFoRDtJQURNOzs7O0tBdkN1QjtBQUhuQyIsInNvdXJjZXNDb250ZW50IjpbInskLCAkJCwgVmlld30gPSByZXF1aXJlICdhdG9tLXNwYWNlLXBlbi12aWV3cydcblxubW9kdWxlLmV4cG9ydHMgPVxuICBjbGFzcyBTeW1ib2xzQ29udGV4dE1lbnUgZXh0ZW5kcyBWaWV3XG4gICAgQGNvbnRlbnQ6IC0+XG4gICAgICBAZGl2IGNsYXNzOiAnc3ltYm9scy1jb250ZXh0LW1lbnUnLCA9PlxuICAgICAgICBAZGl2IGNsYXNzOiAnc2VsZWN0LWxpc3QgcG9wb3Zlci1saXN0JywgPT5cbiAgICAgICAgICBAaW5wdXQgdHlwZTogJ3RleHQnLCBjbGFzczogJ2hpZGRlbi1pbnB1dCcsIG91dGxldDogJ2hpZGRlbklucHV0J1xuICAgICAgICAgIEBvbCBjbGFzczogJ2xpc3QtZ3JvdXAgbWFyay1hY3RpdmUnLCBvdXRsZXQ6ICdtZW51cydcblxuICAgIGluaXRpYWxpemU6IC0+XG4gICAgICBAaGlkZGVuSW5wdXQub24gJ2ZvY3Vzb3V0JywgPT5cbiAgICAgICAgQGhpZGUoKVxuXG4gICAgY2xlYXI6IC0+XG4gICAgICBAbWVudXMuZW1wdHkoKVxuXG4gICAgYWRkTWVudTogKG5hbWUsIGFjdGl2ZSwgY2FsbGJhY2spIC0+XG4gICAgICBtZW51ID0gJCQgLT5cbiAgICAgICAgQGxpIGNsYXNzOiAoaWYgYWN0aXZlIHRoZW4gJ2FjdGl2ZScgZWxzZSAnJyksIG5hbWVcblxuICAgICAgbWVudS5vbiAnbW91c2Vkb3duJywgPT5cbiAgICAgICAgbWVudS50b2dnbGVDbGFzcygnYWN0aXZlJylcbiAgICAgICAgQGhpZGRlbklucHV0LmJsdXIoKVxuICAgICAgICBjYWxsYmFjayhuYW1lKVxuXG4gICAgICBAbWVudXMuYXBwZW5kKG1lbnUpXG5cbiAgICB0b2dnbGU6ICh0eXBlKSAtPlxuICAgICAgZm9yIG1lbnUgaW4gQG1lbnVzLmZpbmQoJ2xpJylcbiAgICAgICAgaWYgJChtZW51KS50ZXh0KCkgPT0gdHlwZVxuICAgICAgICAgICQobWVudSkudG9nZ2xlQ2xhc3MoJ2FjdGl2ZScpXG5cbiAgICBhZGRTZXBhcmF0b3I6IC0+XG4gICAgICBAbWVudXMuYXBwZW5kICQkIC0+XG4gICAgICAgIEBsaSBjbGFzczogJ3NlcGFyYXRvcidcblxuICAgIHNob3c6IC0+XG4gICAgICBpZiBAbWVudXMuY2hpbGRyZW4oKS5sZW5ndGggPiAwXG4gICAgICAgIHN1cGVyXG4gICAgICAgIEBoaWRkZW5JbnB1dC5mb2N1cygpXG5cbiAgICBhdHRhY2g6IC0+XG4gICAgICBhdG9tLnZpZXdzLmdldFZpZXcoYXRvbS53b3Jrc3BhY2UpLmFwcGVuZENoaWxkKEBlbGVtZW50KVxuIl19
