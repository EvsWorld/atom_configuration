(function() {
  var $, $$, Emitter, ScrollView, TreeNode, TreeView, View, ref,
    bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  ref = require('atom-space-pen-views'), $ = ref.$, $$ = ref.$$, View = ref.View, ScrollView = ref.ScrollView;

  Emitter = require('event-kit').Emitter;

  module.exports = {
    TreeNode: TreeNode = (function(superClass) {
      extend(TreeNode, superClass);

      function TreeNode() {
        this.dblClickItem = bind(this.dblClickItem, this);
        this.clickItem = bind(this.clickItem, this);
        return TreeNode.__super__.constructor.apply(this, arguments);
      }

      TreeNode.content = function(arg) {
        var children, icon, label;
        label = arg.label, icon = arg.icon, children = arg.children;
        if (children) {
          return this.li({
            "class": 'list-nested-item list-selectable-item'
          }, (function(_this) {
            return function() {
              _this.div({
                "class": 'list-item'
              }, function() {
                return _this.span({
                  "class": "icon " + icon
                }, label);
              });
              return _this.ul({
                "class": 'list-tree'
              }, function() {
                var child, i, len, results;
                results = [];
                for (i = 0, len = children.length; i < len; i++) {
                  child = children[i];
                  results.push(_this.subview('child', new TreeNode(child)));
                }
                return results;
              });
            };
          })(this));
        } else {
          return this.li({
            "class": 'list-item list-selectable-item'
          }, (function(_this) {
            return function() {
              return _this.span({
                "class": "icon " + icon
              }, label);
            };
          })(this));
        }
      };

      TreeNode.prototype.initialize = function(item) {
        this.emitter = new Emitter;
        this.item = item;
        this.item.view = this;
        this.on('dblclick', this.dblClickItem);
        return this.on('click', this.clickItem);
      };

      TreeNode.prototype.setCollapsed = function() {
        if (this.item.children) {
          return this.toggleClass('collapsed');
        }
      };

      TreeNode.prototype.setSelected = function() {
        return this.addClass('selected');
      };

      TreeNode.prototype.onDblClick = function(callback) {
        var child, i, len, ref1, results;
        this.emitter.on('on-dbl-click', callback);
        if (this.item.children) {
          ref1 = this.item.children;
          results = [];
          for (i = 0, len = ref1.length; i < len; i++) {
            child = ref1[i];
            results.push(child.view.onDblClick(callback));
          }
          return results;
        }
      };

      TreeNode.prototype.onSelect = function(callback) {
        var child, i, len, ref1, results;
        this.emitter.on('on-select', callback);
        if (this.item.children) {
          ref1 = this.item.children;
          results = [];
          for (i = 0, len = ref1.length; i < len; i++) {
            child = ref1[i];
            results.push(child.view.onSelect(callback));
          }
          return results;
        }
      };

      TreeNode.prototype.clickItem = function(event) {
        var $target, left, right, selected, width;
        if (this.item.children) {
          selected = this.hasClass('selected');
          this.removeClass('selected');
          $target = this.find('.list-item:first');
          left = $target.position().left;
          right = $target.children('span').position().left;
          width = right - left;
          if (event.offsetX <= width) {
            this.toggleClass('collapsed');
          }
          if (selected) {
            this.addClass('selected');
          }
          if (event.offsetX <= width) {
            return false;
          }
        }
        this.emitter.emit('on-select', {
          node: this,
          item: this.item
        });
        return false;
      };

      TreeNode.prototype.dblClickItem = function(event) {
        this.emitter.emit('on-dbl-click', {
          node: this,
          item: this.item
        });
        return false;
      };

      return TreeNode;

    })(View),
    TreeView: TreeView = (function(superClass) {
      extend(TreeView, superClass);

      function TreeView() {
        this.sortByRow = bind(this.sortByRow, this);
        this.sortByName = bind(this.sortByName, this);
        this.toggleTypeVisible = bind(this.toggleTypeVisible, this);
        this.traversal = bind(this.traversal, this);
        this.onSelect = bind(this.onSelect, this);
        return TreeView.__super__.constructor.apply(this, arguments);
      }

      TreeView.content = function() {
        return this.div({
          "class": '-tree-view-'
        }, (function(_this) {
          return function() {
            return _this.ul({
              "class": 'list-tree has-collapsable-children',
              outlet: 'root'
            });
          };
        })(this));
      };

      TreeView.prototype.initialize = function() {
        TreeView.__super__.initialize.apply(this, arguments);
        return this.emitter = new Emitter;
      };

      TreeView.prototype.deactivate = function() {
        return this.remove();
      };

      TreeView.prototype.onSelect = function(callback) {
        return this.emitter.on('on-select', callback);
      };

      TreeView.prototype.setRoot = function(root, ignoreRoot) {
        if (ignoreRoot == null) {
          ignoreRoot = true;
        }
        this.rootNode = new TreeNode(root);
        this.rootNode.onDblClick((function(_this) {
          return function(arg) {
            var item, node;
            node = arg.node, item = arg.item;
            return node.setCollapsed();
          };
        })(this));
        this.rootNode.onSelect((function(_this) {
          return function(arg) {
            var item, node;
            node = arg.node, item = arg.item;
            _this.clearSelect();
            node.setSelected();
            return _this.emitter.emit('on-select', {
              node: node,
              item: item
            });
          };
        })(this));
        this.root.empty();
        return this.root.append($$(function() {
          return this.div((function(_this) {
            return function() {
              var child, i, len, ref1, results;
              if (ignoreRoot) {
                ref1 = root.children;
                results = [];
                for (i = 0, len = ref1.length; i < len; i++) {
                  child = ref1[i];
                  results.push(_this.subview('child', child.view));
                }
                return results;
              } else {
                return _this.subview('root', root.view);
              }
            };
          })(this));
        }));
      };

      TreeView.prototype.traversal = function(root, doing) {
        var child, i, len, ref1, results;
        doing(root.item);
        if (root.item.children) {
          ref1 = root.item.children;
          results = [];
          for (i = 0, len = ref1.length; i < len; i++) {
            child = ref1[i];
            results.push(this.traversal(child.view, doing));
          }
          return results;
        }
      };

      TreeView.prototype.toggleTypeVisible = function(type) {
        return this.traversal(this.rootNode, (function(_this) {
          return function(item) {
            if (item.type === type) {
              return item.view.toggle();
            }
          };
        })(this));
      };

      TreeView.prototype.sortByName = function(ascending) {
        if (ascending == null) {
          ascending = true;
        }
        this.traversal(this.rootNode, (function(_this) {
          return function(item) {
            var ref1;
            return (ref1 = item.children) != null ? ref1.sort(function(a, b) {
              if (ascending) {
                return a.name.localeCompare(b.name);
              } else {
                return b.name.localeCompare(a.name);
              }
            }) : void 0;
          };
        })(this));
        return this.setRoot(this.rootNode.item);
      };

      TreeView.prototype.sortByRow = function(ascending) {
        if (ascending == null) {
          ascending = true;
        }
        this.traversal(this.rootNode, (function(_this) {
          return function(item) {
            var ref1;
            return (ref1 = item.children) != null ? ref1.sort(function(a, b) {
              if (ascending) {
                return a.position.row - b.position.row;
              } else {
                return b.position.row - a.position.row;
              }
            }) : void 0;
          };
        })(this));
        return this.setRoot(this.rootNode.item);
      };

      TreeView.prototype.clearSelect = function() {
        return $('.list-selectable-item').removeClass('selected');
      };

      TreeView.prototype.select = function(item) {
        this.clearSelect();
        return item != null ? item.view.setSelected() : void 0;
      };

      return TreeView;

    })(ScrollView)
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL2V2YW5oZW5kcml4MS8uYXRvbS9wYWNrYWdlcy9zeW1ib2xzLXRyZWUtdmlldy9saWIvdHJlZS12aWV3LmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUFBLE1BQUEseURBQUE7SUFBQTs7OztFQUFBLE1BQTRCLE9BQUEsQ0FBUSxzQkFBUixDQUE1QixFQUFDLFNBQUQsRUFBSSxXQUFKLEVBQVEsZUFBUixFQUFjOztFQUNiLFVBQVcsT0FBQSxDQUFRLFdBQVI7O0VBRVosTUFBTSxDQUFDLE9BQVAsR0FDRTtJQUFBLFFBQUEsRUFBZ0I7Ozs7Ozs7OztNQUNkLFFBQUMsQ0FBQSxPQUFELEdBQVUsU0FBQyxHQUFEO0FBQ1IsWUFBQTtRQURVLG1CQUFPLGlCQUFNO1FBQ3ZCLElBQUcsUUFBSDtpQkFDRSxJQUFDLENBQUEsRUFBRCxDQUFJO1lBQUEsQ0FBQSxLQUFBLENBQUEsRUFBTyx1Q0FBUDtXQUFKLEVBQW9ELENBQUEsU0FBQSxLQUFBO21CQUFBLFNBQUE7Y0FDbEQsS0FBQyxDQUFBLEdBQUQsQ0FBSztnQkFBQSxDQUFBLEtBQUEsQ0FBQSxFQUFPLFdBQVA7ZUFBTCxFQUF5QixTQUFBO3VCQUN2QixLQUFDLENBQUEsSUFBRCxDQUFNO2tCQUFBLENBQUEsS0FBQSxDQUFBLEVBQU8sT0FBQSxHQUFRLElBQWY7aUJBQU4sRUFBNkIsS0FBN0I7Y0FEdUIsQ0FBekI7cUJBRUEsS0FBQyxDQUFBLEVBQUQsQ0FBSTtnQkFBQSxDQUFBLEtBQUEsQ0FBQSxFQUFPLFdBQVA7ZUFBSixFQUF3QixTQUFBO0FBQ3RCLG9CQUFBO0FBQUE7cUJBQUEsMENBQUE7OytCQUNFLEtBQUMsQ0FBQSxPQUFELENBQVMsT0FBVCxFQUFrQixJQUFJLFFBQUosQ0FBYSxLQUFiLENBQWxCO0FBREY7O2NBRHNCLENBQXhCO1lBSGtEO1VBQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUFwRCxFQURGO1NBQUEsTUFB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QVNYLFdBQUEsR0FBYSxTQUFBO2VBQ1gsQ0FBQSxDQUFFLHVCQUFGLENBQTBCLENBQUMsV0FBM0IsQ0FBdUMsVUFBdkM7TUFEVzs7eUJBR2IsTUFBQSxHQUFRLFNBQUMsSUFBRDtRQUNOLElBQUMsQ0FBQSxXQUFELENBQUE7OEJBQ0EsSUFBSSxDQUFFLElBQUksQ0FBQyxXQUFYLENBQUE7TUFGTTs7OztPQWxFdUIsV0EzRGpDOztBQUpGIiwic291cmNlc0NvbnRlbnQiOlsieyQsICQkLCBWaWV3LCBTY3JvbGxWaWV3fSA9IHJlcXVpcmUgJ2F0b20tc3BhY2UtcGVuLXZpZXdzJ1xue0VtaXR0ZXJ9ID0gcmVxdWlyZSAnZXZlbnQta2l0J1xuXG5tb2R1bGUuZXhwb3J0cyA9XG4gIFRyZWVOb2RlOiBjbGFzcyBUcmVlTm9kZSBleHRlbmRzIFZpZXdcbiAgICBAY29udGVudDogKHtsYWJlbCwgaWNvbiwgY2hpbGRyZW59KSAtPlxuICAgICAgaWYgY2hpbGRyZW5cbiAgICAgICAgQGxpIGNsYXNzOiAnbGlzdC1uZXN0ZWQtaXRlbSBsaXN0LXNlbGVjdGFibGUtaXRlbScsID0+XG4gICAgICAgICAgQGRpdiBjbGFzczogJ2xpc3QtaXRlbScsID0+XG4gICAgICAgICAgICBAc3BhbiBjbGFzczogXCJpY29uICN7aWNvbn1cIiwgbGFiZWxcbiAgICAgICAgICBAdWwgY2xhc3M6ICdsaXN0LXRyZWUnLCA9PlxuICAgICAgICAgICAgZm9yIGNoaWxkIGluIGNoaWxkcmVuXG4gICAgICAgICAgICAgIEBzdWJ2aWV3ICdjaGlsZCcsIG5ldyBUcmVlTm9kZShjaGlsZClcbiAgICAgIGVsc2VcbiAgICAgICAgQGxpIGNsYXNzOiAnbGlzdC1pdGVtIGxpc3Qtc2VsZWN0YWJsZS1pdGVtJywgPT5cbiAgICAgICAgICBAc3BhbiBjbGFzczogXCJpY29uICN7aWNvbn1cIiwgbGFiZWxcblxuICAgIGluaXRpYWxpemU6IChpdGVtKSAtPlxuICAgICAgQGVtaXR0ZXIgPSBuZXcgRW1pdHRlclxuICAgICAgQGl0ZW0gPSBpdGVtXG4gICAgICBAaXRlbS52aWV3ID0gdGhpc1xuXG4gICAgICBAb24gJ2RibGNsaWNrJywgQGRibENsaWNrSXRlbVxuICAgICAgQG9uICdjbGljaycsIEBjbGlja0l0ZW1cblxuICAgIHNldENvbGxhcHNlZDogLT5cbiAgICAgIEB0b2dnbGVDbGFzcygnY29sbGFwc2VkJykgaWYgQGl0ZW0uY2hpbGRyZW5cblxuICAgIHNldFNlbGVjdGVkOiAtPlxuICAgICAgQGFkZENsYXNzKCdzZWxlY3RlZCcpXG5cbiAgICBvbkRibENsaWNrOiAoY2FsbGJhY2spIC0+XG4gICAgICBAZW1pdHRlci5vbiAnb24tZGJsLWNsaWNrJywgY2FsbGJhY2tcbiAgICAgIGlmIEBpdGVtLmNoaWxkcmVuXG4gICAgICAgIGZvciBjaGlsZCBpbiBAaXRlbS5jaGlsZHJlblxuICAgICAgICAgIGNoaWxkLnZpZXcub25EYmxDbGljayBjYWxsYmFja1xuXG4gICAgb25TZWxlY3Q6IChjYWxsYmFjaykgLT5cbiAgICAgIEBlbWl0dGVyLm9uICdvbi1zZWxlY3QnLCBjYWxsYmFja1xuICAgICAgaWYgQGl0ZW0uY2hpbGRyZW5cbiAgICAgICAgZm9yIGNoaWxkIGluIEBpdGVtLmNoaWxkcmVuXG4gICAgICAgICAgY2hpbGQudmlldy5vblNlbGVjdCBjYWxsYmFja1xuXG4gICAgY2xpY2tJdGVtOiAoZXZlbnQpID0+XG4gICAgICBpZiBAaXRlbS5jaGlsZHJlblxuICAgICAgICBzZWxlY3RlZCA9IEBoYXNDbGFzcygnc2VsZWN0ZWQnKVxuICAgICAgICBAcmVtb3ZlQ2xhc3MoJ3NlbGVjdGVkJylcbiAgICAgICAgJHRhcmdldCA9IEBmaW5kKCcubGlzdC1pdGVtOmZpcnN0JylcbiAgICAgICAgbGVmdCA9ICR0YXJnZXQucG9zaXRpb24oKS5sZWZ0XG4gICAgICAgIHJpZ2h0ID0gJHRhcmdldC5jaGlsZHJlbignc3BhbicpLnBvc2l0aW9uKCkubGVmdFxuICAgICAgICB3aWR0aCA9IHJpZ2h0IC0gbGVmdFxuICAgICAgICBAdG9nZ2xlQ2xhc3MoJ2NvbGxhcHNlZCcpIGlmIGV2ZW50Lm9mZnNldFggPD0gd2lkdGhcbiAgICAgICAgQGFkZENsYXNzKCdzZWxlY3RlZCcpIGlmIHNlbGVjdGVkXG4gICAgICAgIHJldHVybiBmYWxzZSBpZiBldmVudC5vZmZzZXRYIDw9IHdpZHRoXG5cbiAgICAgIEBlbWl0dGVyLmVtaXQgJ29uLXNlbGVjdCcsIHtub2RlOiB0aGlzLCBpdGVtOiBAaXRlbX1cbiAgICAgIHJldHVybiBmYWxzZVxuXG4gICAgZGJsQ2xpY2tJdGVtOiAoZXZlbnQpID0+XG4gICAgICBAZW1pdHRlci5lbWl0ICdvbi1kYmwtY2xpY2snLCB7bm9kZTogdGhpcywgaXRlbTogQGl0ZW19XG4gICAgICByZXR1cm4gZmFsc2VcblxuXG4gIFRyZWVWaWV3OiBjbGFzcyBUcmVlVmlldyBleHRlbmRzIFNjcm9sbFZpZXdcbiAgICBAY29udGVudDogLT5cbiAgICAgIEBkaXYgY2xhc3M6ICctdHJlZS12aWV3LScsID0+XG4gICAgICAgIEB1bCBjbGFzczogJ2xpc3QtdHJlZSBoYXMtY29sbGFwc2FibGUtY2hpbGRyZW4nLCBvdXRsZXQ6ICdyb290J1xuXG4gICAgaW5pdGlhbGl6ZTogLT5cbiAgICAgIHN1cGVyXG4gICAgICBAZW1pdHRlciA9IG5ldyBFbWl0dGVyXG5cbiAgICBkZWFjdGl2YXRlOiAtPlxuICAgICAgQHJlbW92ZSgpXG5cbiAgICBvblNlbGVjdDogKGNhbGxiYWNrKSA9PlxuICAgICAgQGVtaXR0ZXIub24gJ29uLXNlbGVjdCcsIGNhbGxiYWNrXG5cbiAgICBzZXRSb290OiAocm9vdCwgaWdub3JlUm9vdD10cnVlKSAtPlxuICAgICAgQHJvb3ROb2RlID0gbmV3IFRyZWVOb2RlKHJvb3QpXG5cbiAgICAgIEByb290Tm9kZS5vbkRibENsaWNrICh7bm9kZSwgaXRlbX0pID0+XG4gICAgICAgIG5vZGUuc2V0Q29sbGFwc2VkKClcbiAgICAgIEByb290Tm9kZS5vblNlbGVjdCAoe25vZGUsIGl0ZW19KSA9PlxuICAgICAgICBAY2xlYXJTZWxlY3QoKVxuICAgICAgICBub2RlLnNldFNlbGVjdGVkKClcbiAgICAgICAgQGVtaXR0ZXIuZW1pdCAnb24tc2VsZWN0Jywge25vZGUsIGl0ZW19XG5cbiAgICAgIEByb290LmVtcHR5KClcbiAgICAgIEByb290LmFwcGVuZCAkJCAtPlxuICAgICAgICBAZGl2ID0+XG4gICAgICAgICAgaWYgaWdub3JlUm9vdFxuICAgICAgICAgICAgZm9yIGNoaWxkIGluIHJvb3QuY2hpbGRyZW5cbiAgICAgICAgICAgICAgQHN1YnZpZXcgJ2NoaWxkJywgY2hpbGQudmlld1xuICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgIEBzdWJ2aWV3ICdyb290Jywgcm9vdC52aWV3XG5cbiAgICB0cmF2ZXJzYWw6IChyb290LCBkb2luZykgPT5cbiAgICAgIGRvaW5nKHJvb3QuaXRlbSlcbiAgICAgIGlmIHJvb3QuaXRlbS5jaGlsZHJlblxuICAgICAgICBmb3IgY2hpbGQgaW4gcm9vdC5pdGVtLmNoaWxkcmVuXG4gICAgICAgICAgQHRyYXZlcnNhbChjaGlsZC52aWV3LCBkb2luZylcblxuICAgIHRvZ2dsZVR5cGVWaXNpYmxlOiAodHlwZSkgPT5cbiAgICAgIEB0cmF2ZXJzYWwgQHJvb3ROb2RlLCAoaXRlbSkgPT5cbiAgICAgICAgaWYgaXRlbS50eXBlID09IHR5cGVcbiAgICAgICAgICBpdGVtLnZpZXcudG9nZ2xlKClcblxuICAgIHNvcnRCeU5hbWU6IChhc2NlbmRpbmc9dHJ1ZSkgPT5cbiAgICAgIEB0cmF2ZXJzYWwgQHJvb3ROb2RlLCAoaXRlbSkgPT5cbiAgICAgICAgaXRlbS5jaGlsZHJlbj8uc29ydCAoYSwgYikgPT5cbiAgICAgICAgICBpZiBhc2NlbmRpbmdcbiAgICAgICAgICAgIHJldHVybiBhLm5hbWUubG9jYWxlQ29tcGFyZShiLm5hbWUpXG4gICAgICAgICAgZWxzZVxuICAgICAgICAgICAgcmV0dXJuIGIubmFtZS5sb2NhbGVDb21wYXJlKGEubmFtZSlcbiAgICAgIEBzZXRSb290KEByb290Tm9kZS5pdGVtKVxuXG4gICAgc29ydEJ5Um93OiAoYXNjZW5kaW5nPXRydWUpID0+XG4gICAgICBAdHJhdmVyc2FsIEByb290Tm9kZSwgKGl0ZW0pID0+XG4gICAgICAgIGl0ZW0uY2hpbGRyZW4/LnNvcnQgKGEsIGIpID0+XG4gICAgICAgICAgaWYgYXNjZW5kaW5nXG4gICAgICAgICAgICByZXR1cm4gYS5wb3NpdGlvbi5yb3cgLSBiLnBvc2l0aW9uLnJvd1xuICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgIHJldHVybiBiLnBvc2l0aW9uLnJvdyAtIGEucG9zaXRpb24ucm93XG4gICAgICBAc2V0Um9vdChAcm9vdE5vZGUuaXRlbSlcblxuICAgIGNsZWFyU2VsZWN0OiAtPlxuICAgICAgJCgnLmxpc3Qtc2VsZWN0YWJsZS1pdGVtJykucmVtb3ZlQ2xhc3MoJ3NlbGVjdGVkJylcblxuICAgIHNlbGVjdDogKGl0ZW0pIC0+XG4gICAgICBAY2xlYXJTZWxlY3QoKVxuICAgICAgaXRlbT8udmlldy5zZXRTZWxlY3RlZCgpXG4iXX0=
