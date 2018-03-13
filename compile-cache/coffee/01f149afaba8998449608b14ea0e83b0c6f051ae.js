(function() {
  var CompositeDisposable, Disposable, FoldingTextService, TextInputElement, fuzzyFilter, ref,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  FoldingTextService = require('../../foldingtext-service');

  ref = require('atom'), Disposable = ref.Disposable, CompositeDisposable = ref.CompositeDisposable;

  fuzzyFilter = null;

  TextInputElement = (function(superClass) {
    extend(TextInputElement, superClass);

    function TextInputElement() {
      return TextInputElement.__super__.constructor.apply(this, arguments);
    }

    TextInputElement.prototype.textEditor = null;

    TextInputElement.prototype.accessoryPanel = null;

    TextInputElement.prototype.cancelling = false;

    TextInputElement.prototype.cancelOnBlur = true;

    TextInputElement.prototype.delegate = null;

    TextInputElement.prototype.createdCallback = function() {
      this.textEditorElement = document.createElement('atom-text-editor');
      this.textEditorElement.setAttribute('mini', true);
      this.textEditor = this.textEditorElement.getModel();
      this.appendChild(this.textEditorElement);
      this.leftAddons = [];
      this.rightAddons = [];
      this.message = document.createElement('div');
      this.appendChild(this.message);
      this.textEditor.onDidChangeSelectionRange((function(_this) {
        return function(e) {
          var ref1;
          if (!_this.cancelling) {
            return (ref1 = _this.delegate) != null ? typeof ref1.didChangeSelectionRange === "function" ? ref1.didChangeSelectionRange(e) : void 0 : void 0;
          }
        };
      })(this));
      this.textEditor.onDidChangeSelectionRange((function(_this) {
        return function(e) {
          var ref1;
          if (!_this.cancelling) {
            return (ref1 = _this.delegate) != null ? typeof ref1.didChangeSelectionRange === "function" ? ref1.didChangeSelectionRange(e) : void 0 : void 0;
          }
        };
      })(this));
      this.textEditor.onWillInsertText((function(_this) {
        return function(e) {
          var ref1;
          if (!_this.cancelling) {
            return (ref1 = _this.delegate) != null ? typeof ref1.willInsertText === "function" ? ref1.willInsertText(e) : void 0 : void 0;
          }
        };
      })(this));
      this.textEditor.onDidInsertText((function(_this) {
        return function(e) {
          var ref1;
          if (!_this.cancelling) {
            return (ref1 = _this.delegate) != null ? typeof ref1.didInsertText === "function" ? ref1.didInsertText(e) : void 0 : void 0;
          }
        };
      })(this));
      this.textEditor.onDidChange((function(_this) {
        return function(e) {
          var ref1;
          if (_this.sizeToFit) {
            _this.scheduleLayout();
          }
          if (!_this.cancelling) {
            return (ref1 = _this.delegate) != null ? typeof ref1.didChangeText === "function" ? ref1.didChangeText(e) : void 0 : void 0;
          }
        };
      })(this));
      return this.textEditorElement.addEventListener('blur', (function(_this) {
        return function(e) {
          if (_this.cancelOnBlur) {
            if (!_this.cancelling) {
              return _this.cancel(e);
            }
          }
        };
      })(this));
    };

    TextInputElement.prototype.attachedCallback = function() {};

    TextInputElement.prototype.detachedCallback = function() {};

    TextInputElement.prototype.attributeChangedCallback = function(attrName, oldVal, newVal) {};


    /*
    Section: Messages to the user
     */

    TextInputElement.prototype.getPlaceholderText = function() {
      return this.textEditor.getPlaceholderText();
    };

    TextInputElement.prototype.setPlaceholderText = function(placeholderText) {
      return this.textEditor.setPlaceholderText(placeholderText);
    };

    TextInputElement.prototype.setMessage = function(message) {
      if (message == null) {
        message = '';
      }
      this.message.innerHTML = '';
      if (message.length === 0) {
        return this.message.style.display = 'none';
      } else {
        this.message.textContent = message;
        return this.message.style.display = null;
      }
    };

    TextInputElement.prototype.setHTMLMessage = function(htmlMessage) {
      if (htmlMessage == null) {
        htmlMessage = '';
      }
      this.message.innerHTML = '';
      if (htmlMessage.length === 0) {
        return this.message.style.display = 'none';
      } else {
        this.message.innerHTML = htmlMessage;
        return this.message.style.display = null;
      }
    };


    /*
    Section: Accessory Elements
     */

    TextInputElement.prototype.addAddon = function(element, priority, addOnCollection) {
      var addon;
      if (priority == null) {
        priority = 0;
      }
      addon = {
        element: element,
        priority: priority
      };
      addOnCollection.push(addon);
      addOnCollection.sort(function(a, b) {
        return a.priority - b.priority;
      });
      element.classList.add('ft-text-input-addon');
      element.style.position = 'absolute';
      element.style.fontSize = 'inherit';
      element.style.lineHeight = 'inherit';
      this.appendChild(element);
      this.scheduleLayout();
      return new Disposable((function(_this) {
        return function() {
          addOnCollection.slice(addOnCollection.indexOf(addon), 1);
          element.parentElement.removeChild(element);
          return _this.scheduleLayout();
        };
      })(this));
    };

    TextInputElement.prototype.addLeftAddonElement = function(element, priority) {
      if (priority == null) {
        priority = 0;
      }
      return this.addAddon(element, priority, this.leftAddons);
    };

    TextInputElement.prototype.addRightAddonElement = function(element, priority) {
      if (priority == null) {
        priority = 0;
      }
      return this.addAddon(element, priority, this.rightAddons);
    };

    TextInputElement.prototype.addAccessoryElement = function(element) {
      if (!this.accessoryPanel) {
        this.accessoryPanel = document.createElement('atom-panel');
        this.insertBefore(this.accessoryPanel, this.textEditorElement.nextSibling);
      }
      this.accessoryPanel.appendChild(element);
      return new Disposable(function() {
        var ref1;
        return (ref1 = element.parentNode) != null ? ref1.removeChild(element) : void 0;
      });
    };


    /*
    Section: Text
     */

    TextInputElement.prototype.getText = function() {
      return this.textEditor.getText();
    };

    TextInputElement.prototype.setText = function(text) {
      return this.textEditor.setText(text || '');
    };

    TextInputElement.prototype.isCursorAtStart = function() {
      var range;
      range = this.textEditor.getSelectedBufferRange();
      return range.isEmpty() && range.containsPoint([0, 0]);
    };

    TextInputElement.prototype.setGrammar = function(grammar) {
      return this.textEditor.setGrammar(grammar);
    };


    /*
    Section: Layout
     */

    TextInputElement.prototype.scheduleLayout = function() {
      if (!this.scheduleLayoutFrameID) {
        return this.scheduleLayoutFrameID = window.requestAnimationFrame((function(_this) {
          return function() {
            return _this.performLayout();
          };
        })(this));
      }
    };

    TextInputElement.prototype.performLayout = function() {
      var borderLeft, borderRight, cursor, defaultPaddingLeft, defaultPaddingRight, each, eachRect, editorHeight, element, firstLine, i, j, left, len, len1, paddingLeft, paddingRight, placeHolder, ref1, ref2, ref3, ref4, right, rightAddonsWidth, style, width;
      this.scheduleLayoutFrameID = null;
      this.textEditorElement.style.paddingLeft = null;
      this.textEditorElement.style.paddingRight = null;
      style = window.getComputedStyle(this.textEditorElement);
      defaultPaddingLeft = parseFloat(style.paddingLeft, 10);
      defaultPaddingRight = parseFloat(style.paddingRight, 10);
      paddingLeft = defaultPaddingLeft;
      paddingRight = defaultPaddingRight;
      editorHeight = this.textEditorElement.getBoundingClientRect().height;
      if (this.leftAddons.length) {
        ref1 = this.leftAddons;
        for (i = 0, len = ref1.length; i < len; i++) {
          each = ref1[i];
          element = each.element;
          eachRect = element.getBoundingClientRect();
          element.style.left = paddingLeft + 'px';
          element.style.top = ((editorHeight - eachRect.height) / 2) + 'px';
          paddingLeft += eachRect.width;
          if (eachRect.width) {
            paddingLeft += defaultPaddingLeft;
          }
        }
      }
      rightAddonsWidth = defaultPaddingRight;
      ref2 = this.rightAddons;
      for (j = 0, len1 = ref2.length; j < len1; j++) {
        each = ref2[j];
        element = each.element;
        eachRect = element.getBoundingClientRect();
        element.style.right = paddingRight + 'px';
        element.style.top = ((editorHeight - eachRect.height) / 2) + 'px';
        paddingRight += eachRect.width;
        if (eachRect.width) {
          paddingRight += defaultPaddingLeft;
        }
      }
      this.textEditorElement.style.paddingLeft = paddingLeft + 'px';
      this.textEditorElement.style.paddingRight = paddingRight + 'px';
      if (this.sizeToFit) {
        firstLine = (ref3 = this.textEditorElement.shadowRoot) != null ? ref3.querySelector('.line') : void 0;
        width = void 0;
        if (firstLine != null ? firstLine.firstElementChild : void 0) {
          left = firstLine.firstElementChild.getBoundingClientRect().left;
          right = firstLine.lastElementChild.getBoundingClientRect().right;
          width = right - left;
        } else if (placeHolder = (ref4 = this.textEditorElement.shadowRoot) != null ? ref4.querySelector('.placeholder-text') : void 0) {
          width = placeHolder.getBoundingClientRect().width;
        }
        if (width != null) {
          borderLeft = parseFloat(style.borderLeftWidth);
          paddingLeft = parseFloat(style.paddingLeft);
          paddingRight = parseFloat(style.paddingRight);
          borderRight = parseFloat(style.borderRightWidth);
          cursor = 2;
          return this.textEditorElement.style.width = Math.ceil(borderLeft + paddingLeft + width + paddingRight + borderRight + cursor) + 'px';
        }
      }
    };

    TextInputElement.prototype.setSizeToFit = function(sizeToFit) {
      var ref1, ref2, ref3, ref4, ref5, ref6, ref7, ref8;
      this.sizeToFit = sizeToFit;
      if (this.sizeToFit) {
        this.textEditorElement.getModel().setSoftWrapped(false);
        if ((ref1 = this.textEditorElement.component) != null) {
          if ((ref2 = ref1.presenter) != null) {
            ref2.constrainScrollLeft = function() {
              return 0;
            };
          }
        }
        if ((ref3 = this.textEditorElement.component) != null) {
          if ((ref4 = ref3.presenter) != null) {
            ref4.setScrollLeft = function() {
              return 0;
            };
          }
        }
      } else {
        if ((ref5 = this.textEditorElement.component) != null) {
          if ((ref6 = ref5.presenter) != null) {
            delete ref6.constrainScrollLeft;
          }
        }
        if ((ref7 = this.textEditorElement.component) != null) {
          if ((ref8 = ref7.presenter) != null) {
            delete ref8.setScrollLeft;
          }
        }
      }
      return this.scheduleLayout();
    };


    /*
    Section: Delegate
     */

    TextInputElement.prototype.getDelegate = function() {
      return this.delegate;
    };

    TextInputElement.prototype.setDelegate = function(delegate) {
      this.delegate = delegate;
    };


    /*
    Section: Element Actions
     */

    TextInputElement.prototype.focusTextEditor = function() {
      return this.textEditorElement.focus();
    };

    TextInputElement.prototype.cancel = function(e) {
      var ref1, ref2, ref3, textEditorElementFocused;
      if (!this.cancelling) {
        if (((ref1 = this.delegate) != null ? ref1.shouldCancel : void 0) != null) {
          if (!this.delegate.shouldCancel()) {
            if (e != null) {
              e.stopPropagation();
            }
            return;
          }
        }
      }
      this.cancelling = true;
      textEditorElementFocused = this.textEditorElement.hasFocus();
      if (!this.confirming) {
        if ((ref2 = this.delegate) != null) {
          if (typeof ref2.cancelled === "function") {
            ref2.cancelled();
          }
        }
      }
      this.textEditor.setText('');
      if (textEditorElementFocused) {
        if ((ref3 = this.delegate) != null) {
          if (typeof ref3.restoreFocus === "function") {
            ref3.restoreFocus();
          }
        }
      }
      return this.cancelling = false;
    };

    TextInputElement.prototype.confirm = function() {
      var ref1;
      this.confirming = true;
      if ((ref1 = this.delegate) != null) {
        if (typeof ref1.confirm === "function") {
          ref1.confirm();
        }
      }
      return this.confirming = false;
    };

    return TextInputElement;

  })(HTMLElement);

  atom.commands.add('ft-text-input > atom-text-editor[mini]', {
    'core:confirm': function(e) {
      return this.parentElement.confirm(e);
    },
    'core:cancel': function(e) {
      return this.parentElement.cancel(e);
    }
  });

  module.exports = document.registerElement('ft-text-input', {
    prototype: TextInputElement.prototype
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL2V2YW5oZW5kcml4MS8uYXRvbS9wYWNrYWdlcy9mb2xkaW5ndGV4dC1mb3ItYXRvbS9saWIvZXh0ZW5zaW9ucy91aS90ZXh0LWlucHV0LWVsZW1lbnQuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUVBO0FBQUEsTUFBQSx1RkFBQTtJQUFBOzs7RUFBQSxrQkFBQSxHQUFxQixPQUFBLENBQVEsMkJBQVI7O0VBQ3JCLE1BQW9DLE9BQUEsQ0FBUSxNQUFSLENBQXBDLEVBQUMsMkJBQUQsRUFBYTs7RUFFYixXQUFBLEdBQWM7O0VBRVI7Ozs7Ozs7K0JBRUosVUFBQSxHQUFZOzsrQkFDWixjQUFBLEdBQWdCOzsrQkFDaEIsVUFBQSxHQUFZOzsrQkFDWixZQUFBLEdBQWM7OytCQUNkLFFBQUEsR0FBVTs7K0JBRVYsZUFBQSxHQUFpQixTQUFBO01BQ2YsSUFBQyxDQUFBLGlCQUFELEdBQXFCLFFBQVEsQ0FBQyxhQUFULENBQXVCLGtCQUF2QjtNQUNyQixJQUFDLENBQUEsaUJBQWlCLENBQUMsWUFBbkIsQ0FBZ0MsTUFBaEMsRUFBd0MsSUFBeEM7TUFDQSxJQUFDLENBQUEsVUFBRCxHQUFjLElBQUMsQ0FBQSxpQkFBaUIsQ0FBQyxRQUFuQixDQUFBO01BQ2QsSUFBQyxDQUFBLFdBQUQsQ0FBYSxJQUFDLENBQUEsaUJBQWQ7TUFFQSxJQUFDLENBQUEsVUFBRCxHQUFjO01BQ2QsSUFBQyxDQUFBLFdBQUQsR0FBZTtNQUVmLElBQUMsQ0FBQSxPQUFELEdBQVcsUUFBUSxDQUFDLGFBQVQsQ0FBdUIsS0FBdkI7TUFDWCxJQUFDLENBQUEsV0FBRCxDQUFhLElBQUMsQ0FBQSxPQUFkO01BRUEsSUFBQyxDQUFBLFVBQVUsQ0FBQyx5QkFBWixDQUFzQyxDQUFBLFNBQUEsS0FBQTtlQUFBLFNBQUMsQ0FBRDtBQUNwQyxjQUFBO1VBQUEsSUFBQSxDQUE4QyxLQUFDLENBQUEsVUFBL0M7OEdBQVMsQ0FBRSx3QkFBeUIscUJBQXBDOztRQURvQztNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBdEM7TUFHQSxJQUFDLENBQUEsVUFBVSxDQUFDLHlCQUFaLENBQXNDLENBQUEsU0FBQSxLQUFBO2VBQUEsU0FBQyxDQUFEO0FBQ3BDLGNBQUE7VUFBQSxJQUFBLENBQThDLEtBQUMsQ0FBQSxVQUEvQzs4R0FBUyxDQUFFLHdCQUF5QixxQkFBcEM7O1FBRG9DO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUF0QztNQUdBLElBQUMsQ0FBQSxVQUFVLENBQUMsZ0JBQVosQ0FBNkIsQ0FBQSxTQUFBLEtBQUE7ZUFBQSxTQUFDLENBQUQ7QUFDM0IsY0FBQTtVQUFBLElBQUEsQ0FBcUMsS0FBQyxDQUFBLFVBQXRDO3FHQUFTLENBQUUsZUFBZ0IscUJBQTNCOztRQUQyQjtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBN0I7TUFHQSxJQUFDLENBQUEsVUFBVSxDQUFDLGVBQVosQ0FBNEIsQ0FBQSxTQUFBLEtBQUE7ZUFBQSxTQUFDLENBQUQ7QUFDMUIsY0FBQTtVQUFBLElBQUEsQ0FBb0MsS0FBQyxDQUFBLFVBQXJDO29HQUFTLENBQUUsY0FBZSxxQkFBMUI7O1FBRDBCO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUE1QjtNQUdBLElBQUMsQ0FBQSxVQUFVLENBQUMsV0FBWixDQUF3QixDQUFBLFNBQUEsS0FBQTtlQUFBLFNBQUMsQ0FBRDtBQUN0QixjQUFBO1VBQUEsSUFBRyxLQUFDLENBQUEsU0FBSjtZQUNFLEtBQUMsQ0FBQSxjQUFELENBQUEsRUFERjs7VUFFQSxJQUFBLENBQW9DLEtBQUMsQ0FBQSxVQUFyQztvR0FBUyxDQUFFLGNBQWUscUJBQTFCOztRQUhzQjtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBeEI7YUFLQSxJQUFDLENBQUEsaUJBQWlCLENBQUMsZ0JBQW5CLENBQW9DLE1BQXBDLEVBQTRDLENBQUEsU0FBQSxLQUFBO2VBQUEsU0FBQyxDQUFEO1VBQzFDLElBQUcsS0FBQyxDQUFBLFlBQUo7WUFDRSxJQUFBLENBQWtCLEtBQUMsQ0FBQSxVQUFuQjtxQkFBQSxLQUFDLENBQUEsTUFBRCxDQUFRLENBQVIsRUFBQTthQURGOztRQUQwQztNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBNUM7SUE3QmU7OytCQWlDakIsZ0JBQUEsR0FBa0IsU0FBQSxHQUFBOzsrQkFFbEIsZ0JBQUEsR0FBa0IsU0FBQSxHQUFBOzsrQkFFbEIsd0JBQUEsR0FBMEIsU0FBQyxRQUFELEVBQVcsTUFBWCxFQUFtQixNQUFuQixHQUFBOzs7QUFFMUI7Ozs7K0JBSUEsa0JBQUEsR0FBb0IsU0FBQTthQUNsQixJQUFDLENBQUEsVUFBVSxDQUFDLGtCQUFaLENBQUE7SUFEa0I7OytCQUdwQixrQkFBQSxHQUFvQixTQUFDLGVBQUQ7YUFDbEIsSUFBQyxDQUFBLFVBQVUsQ0FBQyxrQkFBWixDQUErQixlQUEvQjtJQURrQjs7K0JBR3BCLFVBQUEsR0FBWSxTQUFDLE9BQUQ7O1FBQUMsVUFBUTs7TUFDbkIsSUFBQyxDQUFBLE9BQU8sQ0FBQyxTQUFULEdBQXFCO01BQ3JCLElBQUcsT0FBTyxDQUFDLE1BQVIsS0FBa0IsQ0FBckI7ZUFDRSxJQUFDLENBQUEsT0FBTyxDQUFDLEtBQUssQ0FBQyxPQUFmLEdBQXlCLE9BRDNCO09BQUEsTUFBQTtRQUdFLElBQUMsQ0FBQSxPQUFPLENBQUMsV0FBVCxHQUF1QjtlQUN2QixJQUFDLENBQUEsT0FBTyxDQUFDLEtBQUssQ0FBQyxPQUFmLEdBQXlCLEtBSjNCOztJQUZVOzsrQkFRWixjQUFBLEdBQWdCLFNBQUMsV0FBRDs7UUFBQyxjQUFZOztNQUMzQixJQUFDLENBQUEsT0FBTyxDQUFDLFNBQVQsR0FBcUI7TUFDckIsSUFBRyxXQUFXLENBQUMsTUFBWixLQUFzQixDQUF6QjtlQUNFLElBQUMsQ0FBQSxPQUFPLENBQUMsS0FBSyxDQUFDLE9BQWYsR0FBeUIsT0FEM0I7T0FBQSxNQUFBO1FBR0UsSUFBQyxDQUFBLE9BQU8sQ0FBQyxTQUFULEdBQXFCO2VBQ3JCLElBQUMsQ0FBQSxPQUFPLENBQUMsS0FBSyxDQUFDLE9BQWYsR0FBeUIsS0FKM0I7O0lBRmM7OztBQVFoQjs7OzsrQkFJQSxRQUFBLEdBQVUsU0FBQyxPQUFELEVBQVUsUUFBVixFQUFzQixlQUF0QjtBQUNSLFVBQUE7O1FBRGtCLFdBQVM7O01BQzNCLEtBQUEsR0FDRTtRQUFBLE9BQUEsRUFBUyxPQUFUO1FBQ0EsUUFBQSxFQUFVLFFBRFY7O01BR0YsZUFBZSxDQUFDLElBQWhCLENBQXFCLEtBQXJCO01BQ0EsZUFBZSxDQUFDLElBQWhCLENBQXFCLFNBQUMsQ0FBRCxFQUFJLENBQUo7ZUFDbkIsQ0FBQyxDQUFDLFFBQUYsR0FBYSxDQUFDLENBQUM7TUFESSxDQUFyQjtNQUVBLE9BQU8sQ0FBQyxTQUFTLENBQUMsR0FBbEIsQ0FBc0IscUJBQXRCO01BQ0EsT0FBTyxDQUFDLEtBQUssQ0FBQyxRQUFkLEdBQXlCO01BQ3pCLE9BQU8sQ0FBQyxLQUFLLENBQUMsUUFBZCxHQUF5QjtNQUN6QixPQUFPLENBQUMsS0FBSyxDQUFDLFVBQWQsR0FBMkI7TUFDM0IsSUFBQyxDQUFBLFdBQUQsQ0FBYSxPQUFiO01BQ0EsSUFBQyxDQUFBLGNBQUQsQ0FBQTthQUVJLElBQUEsVUFBQSxDQUFXLENBQUEsU0FBQSxLQUFBO2VBQUEsU0FBQTtVQUNiLGVBQWUsQ0FBQyxLQUFoQixDQUFzQixlQUFlLENBQUMsT0FBaEIsQ0FBd0IsS0FBeEIsQ0FBdEIsRUFBc0QsQ0FBdEQ7VUFDQSxPQUFPLENBQUMsYUFBYSxDQUFDLFdBQXRCLENBQWtDLE9BQWxDO2lCQUNBLEtBQUMsQ0FBQSxjQUFELENBQUE7UUFIYTtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBWDtJQWZJOzsrQkFvQlYsbUJBQUEsR0FBcUIsU0FBQyxPQUFELEVBQVUsUUFBVjs7UUFBVSxXQUFTOzthQUN0QyxJQUFDLENBQUEsUUFBRCxDQUFVLE9BQVYsRUFBbUIsUUFBbkIsRUFBNkIsSUFBQyxDQUFBLFVBQTlCO0lBRG1COzsrQkFHckIsb0JBQUEsR0FBc0IsU0FBQyxPQUFELEVBQVUsUUFBVjs7UUFBVSxXQUFTOzthQUN2QyxJQUFDLENBQUEsUUFBRCxDQUFVLE9BQVYsRUFBbUIsUUFBbkIsRUFBNkIsSUFBQyxDQUFBLFdBQTlCO0lBRG9COzsrQkFHdEIsbUJBQUEsR0FBcUIsU0FBQyxPQUFEO01BQ25CLElBQUEsQ0FBTyxJQUFDLENBQUEsY0FBUjtRQUNFLElBQUMsQ0FBQSxjQUFELEdBQWtCLFFBQVEsQ0FBQyxhQUFULENBQXVCLFlBQXZCO1FBQ2xCLElBQUMsQ0FBQSxZQUFELENBQWMsSUFBQyxDQUFBLGNBQWYsRUFBK0IsSUFBQyxDQUFBLGlCQUFpQixDQUFDLFdBQWxELEVBRkY7O01BR0EsSUFBQyxDQUFBLGNBQWMsQ0FBQyxXQUFoQixDQUE0QixPQUE1QjthQUNJLElBQUEsVUFBQSxDQUFXLFNBQUE7QUFDYixZQUFBO3lEQUFrQixDQUFFLFdBQXBCLENBQWdDLE9BQWhDO01BRGEsQ0FBWDtJQUxlOzs7QUFRckI7Ozs7K0JBSUEsT0FBQSxHQUFTLFNBQUE7YUFDUCxJQUFDLENBQUEsVUFBVSxDQUFDLE9BQVosQ0FBQTtJQURPOzsrQkFHVCxPQUFBLEdBQVMsU0FBQyxJQUFEO2FBQ1AsSUFBQyxDQUFBLFVBQVUsQ0FBQyxPQUFaLENBQW9CLElBQUEsSUFBUSxFQUE1QjtJQURPOzsrQkFHVCxlQUFBLEdBQWlCLFNBQUE7QUFDZixVQUFBO01BQUEsS0FBQSxHQUFRLElBQUMsQ0FBQSxVQUFVLENBQUMsc0JBQVosQ0FBQTthQUNSLEtBQUssQ0FBQyxPQUFOLENBQUEsQ0FBQSxJQUFvQixLQUFLLENBQUMsYUFBTixDQUFvQixDQUFDLENBQUQsRUFBSSxDQUFKLENBQXBCO0lBRkw7OytCQUlqQixVQUFBLEdBQVksU0FBQyxPQUFEO2FBQ1YsSUFBQyxDQUFBLFVBQVUsQ0FBQyxVQUFaLENBQXVCLE9BQXZCO0lBRFU7OztBQUdaOzs7OytCQUlBLGNBQUEsR0FBZ0IsU0FBQTtNQUNkLElBQUEsQ0FBTyxJQUFDLENBQUEscUJBQVI7ZUFDRSxJQUFDLENBQUEscUJBQUQsR0FBeUIsTUFBTSxDQUFDLHFCQUFQLENBQTZCLENBQUEsU0FBQSxLQUFBO2lCQUFBLFNBQUE7bUJBQ3BELEtBQUMsQ0FBQSxhQUFELENBQUE7VUFEb0Q7UUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQTdCLEVBRDNCOztJQURjOzsrQkFLaEIsYUFBQSxHQUFlLFNBQUE7QUFDYixVQUFBO01BQUEsSUFBQyxDQUFBLHFCQUFELEdBQXlCO01BRXpCLElBQUMsQ0FBQSxpQkFBaUIsQ0FBQyxLQUFLLENBQUMsV0FBekIsR0FBdUM7TUFDdkMsSUFBQyxDQUFBLGlCQUFpQixDQUFDLEtBQUssQ0FBQyxZQUF6QixHQUF3QztNQUN4QyxLQUFBLEdBQVEsTUFBTSxDQUFDLGdCQUFQLENBQXdCLElBQUMsQ0FBQSxpQkFBekI7TUFDUixrQkFBQSxHQUFxQixVQUFBLENBQVcsS0FBSyxDQUFDLFdBQWpCLEVBQThCLEVBQTlCO01BQ3JCLG1CQUFBLEdBQXNCLFVBQUEsQ0FBVyxLQUFLLENBQUMsWUFBakIsRUFBK0IsRUFBL0I7TUFDdEIsV0FBQSxHQUFjO01BQ2QsWUFBQSxHQUFlO01BQ2YsWUFBQSxHQUFlLElBQUMsQ0FBQSxpQkFBaUIsQ0FBQyxxQkFBbkIsQ0FBQSxDQUEwQyxDQUFDO01BRzFELElBQUcsSUFBQyxDQUFBLFVBQVUsQ0FBQyxNQUFmO0FBQ0U7QUFBQSxhQUFBLHNDQUFBOztVQUNFLE9BQUEsR0FBVSxJQUFJLENBQUM7VUFDZixRQUFBLEdBQVcsT0FBTyxDQUFDLHFCQUFSLENBQUE7VUFDWCxPQUFPLENBQUMsS0FBSyxDQUFDLElBQWQsR0FBcUIsV0FBQSxHQUFjO1VBQ25DLE9BQU8sQ0FBQyxLQUFLLENBQUMsR0FBZCxHQUFvQixDQUFDLENBQUMsWUFBQSxHQUFlLFFBQVEsQ0FBQyxNQUF6QixDQUFBLEdBQW1DLENBQXBDLENBQUEsR0FBeUM7VUFDN0QsV0FBQSxJQUFlLFFBQVEsQ0FBQztVQUN4QixJQUFHLFFBQVEsQ0FBQyxLQUFaO1lBQ0UsV0FBQSxJQUFlLG1CQURqQjs7QUFORixTQURGOztNQVVBLGdCQUFBLEdBQW1CO0FBQ25CO0FBQUEsV0FBQSx3Q0FBQTs7UUFDRSxPQUFBLEdBQVUsSUFBSSxDQUFDO1FBQ2YsUUFBQSxHQUFXLE9BQU8sQ0FBQyxxQkFBUixDQUFBO1FBQ1gsT0FBTyxDQUFDLEtBQUssQ0FBQyxLQUFkLEdBQXNCLFlBQUEsR0FBZTtRQUNyQyxPQUFPLENBQUMsS0FBSyxDQUFDLEdBQWQsR0FBb0IsQ0FBQyxDQUFDLFlBQUEsR0FBZSxRQUFRLENBQUMsTUFBekIsQ0FBQSxHQUFtQyxDQUFwQyxDQUFBLEdBQXlDO1FBQzdELFlBQUEsSUFBZ0IsUUFBUSxDQUFDO1FBQ3pCLElBQUcsUUFBUSxDQUFDLEtBQVo7VUFDRSxZQUFBLElBQWdCLG1CQURsQjs7QUFORjtNQVNBLElBQUMsQ0FBQSxpQkFBaUIsQ0FBQyxLQUFLLENBQUMsV0FBekIsR0FBdUMsV0FBQSxHQUFjO01BQ3JELElBQUMsQ0FBQSxpQkFBaUIsQ0FBQyxLQUFLLENBQUMsWUFBekIsR0FBd0MsWUFBQSxHQUFlO01BRXZELElBQUcsSUFBQyxDQUFBLFNBQUo7UUFDRSxTQUFBLDREQUF5QyxDQUFFLGFBQS9CLENBQTZDLE9BQTdDO1FBQ1osS0FBQSxHQUFRO1FBRVIsd0JBQUcsU0FBUyxDQUFFLDBCQUFkO1VBQ0UsSUFBQSxHQUFPLFNBQVMsQ0FBQyxpQkFBaUIsQ0FBQyxxQkFBNUIsQ0FBQSxDQUFtRCxDQUFDO1VBQzNELEtBQUEsR0FBUSxTQUFTLENBQUMsZ0JBQWdCLENBQUMscUJBQTNCLENBQUEsQ0FBa0QsQ0FBQztVQUMzRCxLQUFBLEdBQVEsS0FBQSxHQUFRLEtBSGxCO1NBQUEsTUFJSyxJQUFHLFdBQUEsNERBQTJDLENBQUUsYUFBL0IsQ0FBNkMsbUJBQTdDLFVBQWpCO1VBQ0gsS0FBQSxHQUFRLFdBQVcsQ0FBQyxxQkFBWixDQUFBLENBQW1DLENBQUMsTUFEekM7O1FBR0wsSUFBRyxhQUFIO1VBQ0UsVUFBQSxHQUFhLFVBQUEsQ0FBVyxLQUFLLENBQUMsZUFBakI7VUFDYixXQUFBLEdBQWMsVUFBQSxDQUFXLEtBQUssQ0FBQyxXQUFqQjtVQUNkLFlBQUEsR0FBZSxVQUFBLENBQVcsS0FBSyxDQUFDLFlBQWpCO1VBQ2YsV0FBQSxHQUFjLFVBQUEsQ0FBVyxLQUFLLENBQUMsZ0JBQWpCO1VBQ2QsTUFBQSxHQUFTO2lCQUNULElBQUMsQ0FBQSxpQkFBaUIsQ0FBQyxLQUFLLENBQUMsS0FBekIsR0FBaUMsSUFBSSxDQUFDLElBQUwsQ0FBVSxVQUFBLEdBQWEsV0FBYixHQUEyQixLQUEzQixHQUFtQyxZQUFuQyxHQUFrRCxXQUFsRCxHQUFnRSxNQUExRSxDQUFBLEdBQW9GLEtBTnZIO1NBWEY7O0lBcENhOzsrQkF1RGYsWUFBQSxHQUFjLFNBQUMsU0FBRDtBQUNaLFVBQUE7TUFEYSxJQUFDLENBQUEsWUFBRDtNQUNiLElBQUcsSUFBQyxDQUFBLFNBQUo7UUFFRSxJQUFDLENBQUEsaUJBQWlCLENBQUMsUUFBbkIsQ0FBQSxDQUE2QixDQUFDLGNBQTlCLENBQTZDLEtBQTdDOzs7Z0JBQ3VDLENBQUUsbUJBQXpDLEdBQStELFNBQUE7cUJBQUc7WUFBSDs7Ozs7Z0JBQ3hCLENBQUUsYUFBekMsR0FBeUQsU0FBQTtxQkFBRztZQUFIOztTQUozRDtPQUFBLE1BQUE7OztZQU1FLFdBQThDLENBQUU7Ozs7O1lBQ2hELFdBQThDLENBQUU7O1NBUGxEOzthQVNBLElBQUMsQ0FBQSxjQUFELENBQUE7SUFWWTs7O0FBWWQ7Ozs7K0JBSUEsV0FBQSxHQUFhLFNBQUE7YUFDWCxJQUFDLENBQUE7SUFEVTs7K0JBR2IsV0FBQSxHQUFhLFNBQUMsUUFBRDtNQUFDLElBQUMsQ0FBQSxXQUFEO0lBQUQ7OztBQUViOzs7OytCQUlBLGVBQUEsR0FBaUIsU0FBQTthQUNmLElBQUMsQ0FBQSxpQkFBaUIsQ0FBQyxLQUFuQixDQUFBO0lBRGU7OytCQUdqQixNQUFBLEdBQVEsU0FBQyxDQUFEO0FBQ04sVUFBQTtNQUFBLElBQUEsQ0FBTyxJQUFDLENBQUEsVUFBUjtRQUNFLElBQUcscUVBQUg7VUFDRSxJQUFBLENBQU8sSUFBQyxDQUFBLFFBQVEsQ0FBQyxZQUFWLENBQUEsQ0FBUDs7Y0FDRSxDQUFDLENBQUUsZUFBSCxDQUFBOztBQUNBLG1CQUZGO1dBREY7U0FERjs7TUFNQSxJQUFDLENBQUEsVUFBRCxHQUFjO01BQ2Qsd0JBQUEsR0FBMkIsSUFBQyxDQUFBLGlCQUFpQixDQUFDLFFBQW5CLENBQUE7TUFDM0IsSUFBQSxDQUErQixJQUFDLENBQUEsVUFBaEM7OztnQkFBUyxDQUFFOztTQUFYOztNQUNBLElBQUMsQ0FBQSxVQUFVLENBQUMsT0FBWixDQUFvQixFQUFwQjtNQUNBLElBQThCLHdCQUE5Qjs7O2dCQUFTLENBQUU7O1NBQVg7O2FBQ0EsSUFBQyxDQUFBLFVBQUQsR0FBYztJQVpSOzsrQkFjUixPQUFBLEdBQVMsU0FBQTtBQUNQLFVBQUE7TUFBQSxJQUFDLENBQUEsVUFBRCxHQUFjOzs7Y0FDTCxDQUFFOzs7YUFDWCxJQUFDLENBQUEsVUFBRCxHQUFjO0lBSFA7Ozs7S0ExT29COztFQStPL0IsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFkLENBQWtCLHdDQUFsQixFQUNFO0lBQUEsY0FBQSxFQUFnQixTQUFDLENBQUQ7YUFBTyxJQUFDLENBQUEsYUFBYSxDQUFDLE9BQWYsQ0FBdUIsQ0FBdkI7SUFBUCxDQUFoQjtJQUNBLGFBQUEsRUFBZSxTQUFDLENBQUQ7YUFBTyxJQUFDLENBQUEsYUFBYSxDQUFDLE1BQWYsQ0FBc0IsQ0FBdEI7SUFBUCxDQURmO0dBREY7O0VBSUEsTUFBTSxDQUFDLE9BQVAsR0FBaUIsUUFBUSxDQUFDLGVBQVQsQ0FBeUIsZUFBekIsRUFBMEM7SUFBQSxTQUFBLEVBQVcsZ0JBQWdCLENBQUMsU0FBNUI7R0FBMUM7QUF4UGpCIiwic291cmNlc0NvbnRlbnQiOlsiIyBDb3B5cmlnaHQgKGMpIDIwMTUgSmVzc2UgR3Jvc2plYW4uIEFsbCByaWdodHMgcmVzZXJ2ZWQuXG5cbkZvbGRpbmdUZXh0U2VydmljZSA9IHJlcXVpcmUgJy4uLy4uL2ZvbGRpbmd0ZXh0LXNlcnZpY2UnXG57RGlzcG9zYWJsZSwgQ29tcG9zaXRlRGlzcG9zYWJsZX0gPSByZXF1aXJlICdhdG9tJ1xuXG5mdXp6eUZpbHRlciA9IG51bGwgIyBkZWZlciB1bnRpbCB1c2VkXG5cbmNsYXNzIFRleHRJbnB1dEVsZW1lbnQgZXh0ZW5kcyBIVE1MRWxlbWVudFxuXG4gIHRleHRFZGl0b3I6IG51bGxcbiAgYWNjZXNzb3J5UGFuZWw6IG51bGxcbiAgY2FuY2VsbGluZzogZmFsc2VcbiAgY2FuY2VsT25CbHVyOiB0cnVlXG4gIGRlbGVnYXRlOiBudWxsXG5cbiAgY3JlYXRlZENhbGxiYWNrOiAtPlxuICAgIEB0ZXh0RWRpdG9yRWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQgJ2F0b20tdGV4dC1lZGl0b3InXG4gICAgQHRleHRFZGl0b3JFbGVtZW50LnNldEF0dHJpYnV0ZSAnbWluaScsIHRydWVcbiAgICBAdGV4dEVkaXRvciA9IEB0ZXh0RWRpdG9yRWxlbWVudC5nZXRNb2RlbCgpXG4gICAgQGFwcGVuZENoaWxkIEB0ZXh0RWRpdG9yRWxlbWVudFxuXG4gICAgQGxlZnRBZGRvbnMgPSBbXVxuICAgIEByaWdodEFkZG9ucyA9IFtdXG5cbiAgICBAbWVzc2FnZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQgJ2RpdidcbiAgICBAYXBwZW5kQ2hpbGQgQG1lc3NhZ2VcblxuICAgIEB0ZXh0RWRpdG9yLm9uRGlkQ2hhbmdlU2VsZWN0aW9uUmFuZ2UgKGUpID0+XG4gICAgICBAZGVsZWdhdGU/LmRpZENoYW5nZVNlbGVjdGlvblJhbmdlPyhlKSB1bmxlc3MgQGNhbmNlbGxpbmdcblxuICAgIEB0ZXh0RWRpdG9yLm9uRGlkQ2hhbmdlU2VsZWN0aW9uUmFuZ2UgKGUpID0+XG4gICAgICBAZGVsZWdhdGU/LmRpZENoYW5nZVNlbGVjdGlvblJhbmdlPyhlKSB1bmxlc3MgQGNhbmNlbGxpbmdcblxuICAgIEB0ZXh0RWRpdG9yLm9uV2lsbEluc2VydFRleHQgKGUpID0+XG4gICAgICBAZGVsZWdhdGU/LndpbGxJbnNlcnRUZXh0PyhlKSB1bmxlc3MgQGNhbmNlbGxpbmdcblxuICAgIEB0ZXh0RWRpdG9yLm9uRGlkSW5zZXJ0VGV4dCAoZSkgPT5cbiAgICAgIEBkZWxlZ2F0ZT8uZGlkSW5zZXJ0VGV4dD8oZSkgdW5sZXNzIEBjYW5jZWxsaW5nXG5cbiAgICBAdGV4dEVkaXRvci5vbkRpZENoYW5nZSAoZSkgPT5cbiAgICAgIGlmIEBzaXplVG9GaXRcbiAgICAgICAgQHNjaGVkdWxlTGF5b3V0KClcbiAgICAgIEBkZWxlZ2F0ZT8uZGlkQ2hhbmdlVGV4dD8oZSkgdW5sZXNzIEBjYW5jZWxsaW5nXG5cbiAgICBAdGV4dEVkaXRvckVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lciAnYmx1cicsIChlKSA9PlxuICAgICAgaWYgQGNhbmNlbE9uQmx1clxuICAgICAgICBAY2FuY2VsKGUpIHVubGVzcyBAY2FuY2VsbGluZ1xuXG4gIGF0dGFjaGVkQ2FsbGJhY2s6IC0+XG5cbiAgZGV0YWNoZWRDYWxsYmFjazogLT5cblxuICBhdHRyaWJ1dGVDaGFuZ2VkQ2FsbGJhY2s6IChhdHRyTmFtZSwgb2xkVmFsLCBuZXdWYWwpIC0+XG5cbiAgIyMjXG4gIFNlY3Rpb246IE1lc3NhZ2VzIHRvIHRoZSB1c2VyXG4gICMjI1xuXG4gIGdldFBsYWNlaG9sZGVyVGV4dDogLT5cbiAgICBAdGV4dEVkaXRvci5nZXRQbGFjZWhvbGRlclRleHQoKVxuXG4gIHNldFBsYWNlaG9sZGVyVGV4dDogKHBsYWNlaG9sZGVyVGV4dCkgLT5cbiAgICBAdGV4dEVkaXRvci5zZXRQbGFjZWhvbGRlclRleHQgcGxhY2Vob2xkZXJUZXh0XG5cbiAgc2V0TWVzc2FnZTogKG1lc3NhZ2U9JycpIC0+XG4gICAgQG1lc3NhZ2UuaW5uZXJIVE1MID0gJydcbiAgICBpZiBtZXNzYWdlLmxlbmd0aCBpcyAwXG4gICAgICBAbWVzc2FnZS5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnXG4gICAgZWxzZVxuICAgICAgQG1lc3NhZ2UudGV4dENvbnRlbnQgPSBtZXNzYWdlXG4gICAgICBAbWVzc2FnZS5zdHlsZS5kaXNwbGF5ID0gbnVsbFxuXG4gIHNldEhUTUxNZXNzYWdlOiAoaHRtbE1lc3NhZ2U9JycpIC0+XG4gICAgQG1lc3NhZ2UuaW5uZXJIVE1MID0gJydcbiAgICBpZiBodG1sTWVzc2FnZS5sZW5ndGggaXMgMFxuICAgICAgQG1lc3NhZ2Uuc3R5bGUuZGlzcGxheSA9ICdub25lJ1xuICAgIGVsc2VcbiAgICAgIEBtZXNzYWdlLmlubmVySFRNTCA9IGh0bWxNZXNzYWdlXG4gICAgICBAbWVzc2FnZS5zdHlsZS5kaXNwbGF5ID0gbnVsbFxuXG4gICMjI1xuICBTZWN0aW9uOiBBY2Nlc3NvcnkgRWxlbWVudHNcbiAgIyMjXG5cbiAgYWRkQWRkb246IChlbGVtZW50LCBwcmlvcml0eT0wLCBhZGRPbkNvbGxlY3Rpb24pIC0+XG4gICAgYWRkb24gPVxuICAgICAgZWxlbWVudDogZWxlbWVudFxuICAgICAgcHJpb3JpdHk6IHByaW9yaXR5XG5cbiAgICBhZGRPbkNvbGxlY3Rpb24ucHVzaCBhZGRvblxuICAgIGFkZE9uQ29sbGVjdGlvbi5zb3J0IChhLCBiKSAtPlxuICAgICAgYS5wcmlvcml0eSAtIGIucHJpb3JpdHlcbiAgICBlbGVtZW50LmNsYXNzTGlzdC5hZGQgJ2Z0LXRleHQtaW5wdXQtYWRkb24nXG4gICAgZWxlbWVudC5zdHlsZS5wb3NpdGlvbiA9ICdhYnNvbHV0ZSdcbiAgICBlbGVtZW50LnN0eWxlLmZvbnRTaXplID0gJ2luaGVyaXQnXG4gICAgZWxlbWVudC5zdHlsZS5saW5lSGVpZ2h0ID0gJ2luaGVyaXQnXG4gICAgQGFwcGVuZENoaWxkIGVsZW1lbnRcbiAgICBAc2NoZWR1bGVMYXlvdXQoKVxuXG4gICAgbmV3IERpc3Bvc2FibGUgPT5cbiAgICAgIGFkZE9uQ29sbGVjdGlvbi5zbGljZShhZGRPbkNvbGxlY3Rpb24uaW5kZXhPZihhZGRvbiksIDEpXG4gICAgICBlbGVtZW50LnBhcmVudEVsZW1lbnQucmVtb3ZlQ2hpbGQgZWxlbWVudFxuICAgICAgQHNjaGVkdWxlTGF5b3V0KClcblxuICBhZGRMZWZ0QWRkb25FbGVtZW50OiAoZWxlbWVudCwgcHJpb3JpdHk9MCkgLT5cbiAgICBAYWRkQWRkb24gZWxlbWVudCwgcHJpb3JpdHksIEBsZWZ0QWRkb25zXG5cbiAgYWRkUmlnaHRBZGRvbkVsZW1lbnQ6IChlbGVtZW50LCBwcmlvcml0eT0wKSAtPlxuICAgIEBhZGRBZGRvbiBlbGVtZW50LCBwcmlvcml0eSwgQHJpZ2h0QWRkb25zXG5cbiAgYWRkQWNjZXNzb3J5RWxlbWVudDogKGVsZW1lbnQpIC0+XG4gICAgdW5sZXNzIEBhY2Nlc3NvcnlQYW5lbFxuICAgICAgQGFjY2Vzc29yeVBhbmVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCAnYXRvbS1wYW5lbCdcbiAgICAgIEBpbnNlcnRCZWZvcmUgQGFjY2Vzc29yeVBhbmVsLCBAdGV4dEVkaXRvckVsZW1lbnQubmV4dFNpYmxpbmdcbiAgICBAYWNjZXNzb3J5UGFuZWwuYXBwZW5kQ2hpbGQgZWxlbWVudFxuICAgIG5ldyBEaXNwb3NhYmxlIC0+XG4gICAgICBlbGVtZW50LnBhcmVudE5vZGU/LnJlbW92ZUNoaWxkIGVsZW1lbnRcblxuICAjIyNcbiAgU2VjdGlvbjogVGV4dFxuICAjIyNcblxuICBnZXRUZXh0OiAtPlxuICAgIEB0ZXh0RWRpdG9yLmdldFRleHQoKVxuXG4gIHNldFRleHQ6ICh0ZXh0KSAtPlxuICAgIEB0ZXh0RWRpdG9yLnNldFRleHQgdGV4dCBvciAnJ1xuXG4gIGlzQ3Vyc29yQXRTdGFydDogLT5cbiAgICByYW5nZSA9IEB0ZXh0RWRpdG9yLmdldFNlbGVjdGVkQnVmZmVyUmFuZ2UoKVxuICAgIHJhbmdlLmlzRW1wdHkoKSBhbmQgcmFuZ2UuY29udGFpbnNQb2ludChbMCwgMF0pXG5cbiAgc2V0R3JhbW1hcjogKGdyYW1tYXIpIC0+XG4gICAgQHRleHRFZGl0b3Iuc2V0R3JhbW1hciBncmFtbWFyXG5cbiAgIyMjXG4gIFNlY3Rpb246IExheW91dFxuICAjIyNcblxuICBzY2hlZHVsZUxheW91dDogLT5cbiAgICB1bmxlc3MgQHNjaGVkdWxlTGF5b3V0RnJhbWVJRFxuICAgICAgQHNjaGVkdWxlTGF5b3V0RnJhbWVJRCA9IHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUgPT5cbiAgICAgICAgQHBlcmZvcm1MYXlvdXQoKVxuXG4gIHBlcmZvcm1MYXlvdXQ6IC0+XG4gICAgQHNjaGVkdWxlTGF5b3V0RnJhbWVJRCA9IG51bGxcblxuICAgIEB0ZXh0RWRpdG9yRWxlbWVudC5zdHlsZS5wYWRkaW5nTGVmdCA9IG51bGxcbiAgICBAdGV4dEVkaXRvckVsZW1lbnQuc3R5bGUucGFkZGluZ1JpZ2h0ID0gbnVsbFxuICAgIHN0eWxlID0gd2luZG93LmdldENvbXB1dGVkU3R5bGUoQHRleHRFZGl0b3JFbGVtZW50KVxuICAgIGRlZmF1bHRQYWRkaW5nTGVmdCA9IHBhcnNlRmxvYXQoc3R5bGUucGFkZGluZ0xlZnQsIDEwKVxuICAgIGRlZmF1bHRQYWRkaW5nUmlnaHQgPSBwYXJzZUZsb2F0KHN0eWxlLnBhZGRpbmdSaWdodCwgMTApXG4gICAgcGFkZGluZ0xlZnQgPSBkZWZhdWx0UGFkZGluZ0xlZnRcbiAgICBwYWRkaW5nUmlnaHQgPSBkZWZhdWx0UGFkZGluZ1JpZ2h0XG4gICAgZWRpdG9ySGVpZ2h0ID0gQHRleHRFZGl0b3JFbGVtZW50LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLmhlaWdodFxuXG4gICAgIyBwb3NpdGlvbnMgYWRkb25zXG4gICAgaWYgQGxlZnRBZGRvbnMubGVuZ3RoXG4gICAgICBmb3IgZWFjaCBpbiBAbGVmdEFkZG9uc1xuICAgICAgICBlbGVtZW50ID0gZWFjaC5lbGVtZW50XG4gICAgICAgIGVhY2hSZWN0ID0gZWxlbWVudC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKVxuICAgICAgICBlbGVtZW50LnN0eWxlLmxlZnQgPSBwYWRkaW5nTGVmdCArICdweCdcbiAgICAgICAgZWxlbWVudC5zdHlsZS50b3AgPSAoKGVkaXRvckhlaWdodCAtIGVhY2hSZWN0LmhlaWdodCkgLyAyKSArICdweCdcbiAgICAgICAgcGFkZGluZ0xlZnQgKz0gZWFjaFJlY3Qud2lkdGhcbiAgICAgICAgaWYgZWFjaFJlY3Qud2lkdGhcbiAgICAgICAgICBwYWRkaW5nTGVmdCArPSBkZWZhdWx0UGFkZGluZ0xlZnRcblxuICAgIHJpZ2h0QWRkb25zV2lkdGggPSBkZWZhdWx0UGFkZGluZ1JpZ2h0XG4gICAgZm9yIGVhY2ggaW4gQHJpZ2h0QWRkb25zXG4gICAgICBlbGVtZW50ID0gZWFjaC5lbGVtZW50XG4gICAgICBlYWNoUmVjdCA9IGVsZW1lbnQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KClcbiAgICAgIGVsZW1lbnQuc3R5bGUucmlnaHQgPSBwYWRkaW5nUmlnaHQgKyAncHgnXG4gICAgICBlbGVtZW50LnN0eWxlLnRvcCA9ICgoZWRpdG9ySGVpZ2h0IC0gZWFjaFJlY3QuaGVpZ2h0KSAvIDIpICsgJ3B4J1xuICAgICAgcGFkZGluZ1JpZ2h0ICs9IGVhY2hSZWN0LndpZHRoXG4gICAgICBpZiBlYWNoUmVjdC53aWR0aFxuICAgICAgICBwYWRkaW5nUmlnaHQgKz0gZGVmYXVsdFBhZGRpbmdMZWZ0XG5cbiAgICBAdGV4dEVkaXRvckVsZW1lbnQuc3R5bGUucGFkZGluZ0xlZnQgPSBwYWRkaW5nTGVmdCArICdweCdcbiAgICBAdGV4dEVkaXRvckVsZW1lbnQuc3R5bGUucGFkZGluZ1JpZ2h0ID0gcGFkZGluZ1JpZ2h0ICsgJ3B4J1xuXG4gICAgaWYgQHNpemVUb0ZpdFxuICAgICAgZmlyc3RMaW5lID0gQHRleHRFZGl0b3JFbGVtZW50LnNoYWRvd1Jvb3Q/LnF1ZXJ5U2VsZWN0b3IoJy5saW5lJylcbiAgICAgIHdpZHRoID0gdW5kZWZpbmVkXG5cbiAgICAgIGlmIGZpcnN0TGluZT8uZmlyc3RFbGVtZW50Q2hpbGRcbiAgICAgICAgbGVmdCA9IGZpcnN0TGluZS5maXJzdEVsZW1lbnRDaGlsZC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS5sZWZ0XG4gICAgICAgIHJpZ2h0ID0gZmlyc3RMaW5lLmxhc3RFbGVtZW50Q2hpbGQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkucmlnaHRcbiAgICAgICAgd2lkdGggPSByaWdodCAtIGxlZnRcbiAgICAgIGVsc2UgaWYgcGxhY2VIb2xkZXIgPSBAdGV4dEVkaXRvckVsZW1lbnQuc2hhZG93Um9vdD8ucXVlcnlTZWxlY3RvcignLnBsYWNlaG9sZGVyLXRleHQnKVxuICAgICAgICB3aWR0aCA9IHBsYWNlSG9sZGVyLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLndpZHRoXG5cbiAgICAgIGlmIHdpZHRoP1xuICAgICAgICBib3JkZXJMZWZ0ID0gcGFyc2VGbG9hdCBzdHlsZS5ib3JkZXJMZWZ0V2lkdGhcbiAgICAgICAgcGFkZGluZ0xlZnQgPSBwYXJzZUZsb2F0IHN0eWxlLnBhZGRpbmdMZWZ0XG4gICAgICAgIHBhZGRpbmdSaWdodCA9IHBhcnNlRmxvYXQgc3R5bGUucGFkZGluZ1JpZ2h0XG4gICAgICAgIGJvcmRlclJpZ2h0ID0gcGFyc2VGbG9hdCBzdHlsZS5ib3JkZXJSaWdodFdpZHRoXG4gICAgICAgIGN1cnNvciA9IDIgIyBsaXR0bGUgZXh0cmEgc28gY3Vyc29yIGlzbid0IGNsaXBwZWQgaW4gaGFsZlxuICAgICAgICBAdGV4dEVkaXRvckVsZW1lbnQuc3R5bGUud2lkdGggPSBNYXRoLmNlaWwoYm9yZGVyTGVmdCArIHBhZGRpbmdMZWZ0ICsgd2lkdGggKyBwYWRkaW5nUmlnaHQgKyBib3JkZXJSaWdodCArIGN1cnNvcikgKyAncHgnXG5cbiAgc2V0U2l6ZVRvRml0OiAoQHNpemVUb0ZpdCkgLT5cbiAgICBpZiBAc2l6ZVRvRml0XG4gICAgICAjIEhhY2sgc28gdGhhdCBtaW5pIGVkaXRvciBjYW4gbmV2ZXIgc2Nyb2xsIGJhY2t3YXJkcy5cbiAgICAgIEB0ZXh0RWRpdG9yRWxlbWVudC5nZXRNb2RlbCgpLnNldFNvZnRXcmFwcGVkKGZhbHNlKVxuICAgICAgQHRleHRFZGl0b3JFbGVtZW50LmNvbXBvbmVudD8ucHJlc2VudGVyPy5jb25zdHJhaW5TY3JvbGxMZWZ0ID0gLT4gMFxuICAgICAgQHRleHRFZGl0b3JFbGVtZW50LmNvbXBvbmVudD8ucHJlc2VudGVyPy5zZXRTY3JvbGxMZWZ0ID0gLT4gMFxuICAgIGVsc2VcbiAgICAgIGRlbGV0ZSBAdGV4dEVkaXRvckVsZW1lbnQuY29tcG9uZW50Py5wcmVzZW50ZXI/LmNvbnN0cmFpblNjcm9sbExlZnRcbiAgICAgIGRlbGV0ZSBAdGV4dEVkaXRvckVsZW1lbnQuY29tcG9uZW50Py5wcmVzZW50ZXI/LnNldFNjcm9sbExlZnRcblxuICAgIEBzY2hlZHVsZUxheW91dCgpXG5cbiAgIyMjXG4gIFNlY3Rpb246IERlbGVnYXRlXG4gICMjI1xuXG4gIGdldERlbGVnYXRlOiAtPlxuICAgIEBkZWxlZ2F0ZVxuXG4gIHNldERlbGVnYXRlOiAoQGRlbGVnYXRlKSAtPlxuXG4gICMjI1xuICBTZWN0aW9uOiBFbGVtZW50IEFjdGlvbnNcbiAgIyMjXG5cbiAgZm9jdXNUZXh0RWRpdG9yOiAtPlxuICAgIEB0ZXh0RWRpdG9yRWxlbWVudC5mb2N1cygpXG5cbiAgY2FuY2VsOiAoZSkgLT5cbiAgICB1bmxlc3MgQGNhbmNlbGxpbmdcbiAgICAgIGlmIEBkZWxlZ2F0ZT8uc2hvdWxkQ2FuY2VsP1xuICAgICAgICB1bmxlc3MgQGRlbGVnYXRlLnNob3VsZENhbmNlbCgpXG4gICAgICAgICAgZT8uc3RvcFByb3BhZ2F0aW9uKClcbiAgICAgICAgICByZXR1cm5cblxuICAgIEBjYW5jZWxsaW5nID0gdHJ1ZVxuICAgIHRleHRFZGl0b3JFbGVtZW50Rm9jdXNlZCA9IEB0ZXh0RWRpdG9yRWxlbWVudC5oYXNGb2N1cygpXG4gICAgQGRlbGVnYXRlPy5jYW5jZWxsZWQ/KCkgdW5sZXNzIEBjb25maXJtaW5nXG4gICAgQHRleHRFZGl0b3Iuc2V0VGV4dCgnJylcbiAgICBAZGVsZWdhdGU/LnJlc3RvcmVGb2N1cz8oKSBpZiB0ZXh0RWRpdG9yRWxlbWVudEZvY3VzZWRcbiAgICBAY2FuY2VsbGluZyA9IGZhbHNlXG5cbiAgY29uZmlybTogLT5cbiAgICBAY29uZmlybWluZyA9IHRydWVcbiAgICBAZGVsZWdhdGU/LmNvbmZpcm0/KClcbiAgICBAY29uZmlybWluZyA9IGZhbHNlXG5cbmF0b20uY29tbWFuZHMuYWRkICdmdC10ZXh0LWlucHV0ID4gYXRvbS10ZXh0LWVkaXRvclttaW5pXScsXG4gICdjb3JlOmNvbmZpcm0nOiAoZSkgLT4gQHBhcmVudEVsZW1lbnQuY29uZmlybShlKVxuICAnY29yZTpjYW5jZWwnOiAoZSkgLT4gQHBhcmVudEVsZW1lbnQuY2FuY2VsKGUpXG5cbm1vZHVsZS5leHBvcnRzID0gZG9jdW1lbnQucmVnaXN0ZXJFbGVtZW50ICdmdC10ZXh0LWlucHV0JywgcHJvdG90eXBlOiBUZXh0SW5wdXRFbGVtZW50LnByb3RvdHlwZSJdfQ==
