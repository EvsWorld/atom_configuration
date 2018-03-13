Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _atom = require("atom");

var InputView = (function () {
  function InputView(_ref, onConfirmed) {
    var _this = this;

    var prompt = _ref.prompt;
    var defaultText = _ref.defaultText;
    var allowCancel = _ref.allowCancel;

    _classCallCheck(this, InputView);

    this.onConfirmed = onConfirmed;

    this.element = document.createElement("div");
    this.element.classList.add("hydrogen", "input-view");
    var label = document.createElement("div");
    label.classList.add("label", "icon", "icon-arrow-right");
    label.textContent = prompt || "Kernel requires input";

    this.miniEditor = new _atom.TextEditor({ mini: true });
    if (defaultText) this.miniEditor.setText(defaultText);

    this.element.appendChild(label);
    this.element.appendChild(this.miniEditor.element);

    if (allowCancel) {
      atom.commands.add(this.element, {
        "core:confirm": function coreConfirm() {
          return _this.confirm();
        },
        "core:cancel": function coreCancel() {
          return _this.close();
        }
      });
      this.miniEditor.element.addEventListener("blur", function () {
        if (document.hasFocus()) _this.close();
      });
    } else {
      atom.commands.add(this.element, {
        "core:confirm": function coreConfirm() {
          return _this.confirm();
        }
      });
    }
  }

  _createClass(InputView, [{
    key: "confirm",
    value: function confirm() {
      var text = this.miniEditor.getText();
      if (this.onConfirmed) this.onConfirmed(text);
      this.close();
    }
  }, {
    key: "close",
    value: function close() {
      if (this.panel) this.panel.destroy();
      this.panel = null;
      this.element.remove();
      if (this.previouslyFocusedElement) this.previouslyFocusedElement.focus();
    }
  }, {
    key: "attach",
    value: function attach() {
      this.previouslyFocusedElement = document.activeElement;
      this.panel = atom.workspace.addModalPanel({ item: this.element });
      this.miniEditor.element.focus();
      this.miniEditor.scrollToCursorPosition();
    }
  }]);

  return InputView;
})();

exports["default"] = InputView;
module.exports = exports["default"];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9ldmFuaGVuZHJpeDEvLmF0b20vcGFja2FnZXMvSHlkcm9nZW4vbGliL2lucHV0LXZpZXcuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7b0JBRTJCLE1BQU07O0lBS1osU0FBUztBQU1qQixXQU5RLFNBQVMsQ0FNaEIsSUFBMEMsRUFBRSxXQUFlLEVBQUU7OztRQUEzRCxNQUFNLEdBQVIsSUFBMEMsQ0FBeEMsTUFBTTtRQUFFLFdBQVcsR0FBckIsSUFBMEMsQ0FBaEMsV0FBVztRQUFFLFdBQVcsR0FBbEMsSUFBMEMsQ0FBbkIsV0FBVzs7MEJBTjNCLFNBQVM7O0FBTzFCLFFBQUksQ0FBQyxXQUFXLEdBQUcsV0FBVyxDQUFDOztBQUUvQixRQUFJLENBQUMsT0FBTyxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDLENBQUM7QUFDN0MsUUFBSSxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLFVBQVUsRUFBRSxZQUFZLENBQUMsQ0FBQztBQUNyRCxRQUFNLEtBQUssR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDLEtBQUssQ0FBQyxDQUFDO0FBQzVDLFNBQUssQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLE9BQU8sRUFBRSxNQUFNLEVBQUUsa0JBQWtCLENBQUMsQ0FBQztBQUN6RCxTQUFLLENBQUMsV0FBVyxHQUFHLE1BQU0sSUFBSSx1QkFBdUIsQ0FBQzs7QUFFdEQsUUFBSSxDQUFDLFVBQVUsR0FBRyxxQkFBZSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDO0FBQ2pELFFBQUksV0FBVyxFQUFFLElBQUksQ0FBQyxVQUFVLENBQUMsT0FBTyxDQUFDLFdBQVcsQ0FBQyxDQUFDOztBQUV0RCxRQUFJLENBQUMsT0FBTyxDQUFDLFdBQVcsQ0FBQyxLQUFLLENBQUMsQ0FBQztBQUNoQyxRQUFJLENBQUMsT0FBTyxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLE9BQU8sQ0FBQyxDQUFDOztBQUVsRCxRQUFJLFdBQVcsRUFBRTtBQUNmLFVBQUksQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUU7QUFDOUIsc0JBQWMsRUFBRTtpQkFBTSxNQUFLLE9BQU8sRUFBRTtTQUFBO0FBQ3BDLHFCQUFhLEVBQUU7aUJBQU0sTUFBSyxLQUFLLEVBQUU7U0FBQTtPQUNsQyxDQUFDLENBQUM7QUFDSCxVQUFJLENBQUMsVUFBVSxDQUFDLE9BQU8sQ0FBQyxnQkFBZ0IsQ0FBQyxNQUFNLEVBQUUsWUFBTTtBQUNyRCxZQUFJLFFBQVEsQ0FBQyxRQUFRLEVBQUUsRUFBRSxNQUFLLEtBQUssRUFBRSxDQUFDO09BQ3ZDLENBQUMsQ0FBQztLQUNKLE1BQU07QUFDTCxVQUFJLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFO0FBQzlCLHNCQUFjLEVBQUU7aUJBQU0sTUFBSyxPQUFPLEVBQUU7U0FBQTtPQUNyQyxDQUFDLENBQUM7S0FDSjtHQUNGOztlQWxDa0IsU0FBUzs7V0FvQ3JCLG1CQUFHO0FBQ1IsVUFBTSxJQUFJLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQyxPQUFPLEVBQUUsQ0FBQztBQUN2QyxVQUFJLElBQUksQ0FBQyxXQUFXLEVBQUUsSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUM3QyxVQUFJLENBQUMsS0FBSyxFQUFFLENBQUM7S0FDZDs7O1dBRUksaUJBQUc7QUFDTixVQUFJLElBQUksQ0FBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLEVBQUUsQ0FBQztBQUNyQyxVQUFJLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQztBQUNsQixVQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sRUFBRSxDQUFDO0FBQ3RCLFVBQUksSUFBSSxDQUFDLHdCQUF3QixFQUFFLElBQUksQ0FBQyx3QkFBd0IsQ0FBQyxLQUFLLEVBQUUsQ0FBQztLQUMxRTs7O1dBRUssa0JBQUc7QUFDUCxVQUFJLENBQUMsd0JBQXdCLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBQztBQUN2RCxVQUFJLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsYUFBYSxDQUFDLEVBQUUsSUFBSSxFQUFFLElBQUksQ0FBQyxPQUFPLEVBQUUsQ0FBQyxDQUFDO0FBQ2xFLFVBQUksQ0FBQyxVQUFVLENBQUMsT0FBTyxDQUFDLEtBQUssRUFBRSxDQUFDO0FBQ2hDLFVBQUksQ0FBQyxVQUFVLENBQUMsc0JBQXNCLEVBQUUsQ0FBQztLQUMxQzs7O1NBdERrQixTQUFTOzs7cUJBQVQsU0FBUyIsImZpbGUiOiIvVXNlcnMvZXZhbmhlbmRyaXgxLy5hdG9tL3BhY2thZ2VzL0h5ZHJvZ2VuL2xpYi9pbnB1dC12aWV3LmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyogQGZsb3cgKi9cblxuaW1wb3J0IHsgVGV4dEVkaXRvciB9IGZyb20gXCJhdG9tXCI7XG5cbnR5cGUgb3B0cyA9IHsgcHJvbXB0OiBzdHJpbmcsIGRlZmF1bHRUZXh0Pzogc3RyaW5nLCBhbGxvd0NhbmNlbD86IGJvb2xlYW4gfTtcbnR5cGUgY2IgPSAoczogc3RyaW5nKSA9PiB2b2lkO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBJbnB1dFZpZXcge1xuICBvbkNvbmZpcm1lZDogY2I7XG4gIGVsZW1lbnQ6IEhUTUxFbGVtZW50O1xuICBtaW5pRWRpdG9yOiBhdG9tJFRleHRFZGl0b3I7XG4gIHBhbmVsOiA/YXRvbSRQYW5lbDtcbiAgcHJldmlvdXNseUZvY3VzZWRFbGVtZW50OiA/SFRNTEVsZW1lbnQ7XG4gIGNvbnN0cnVjdG9yKHsgcHJvbXB0LCBkZWZhdWx0VGV4dCwgYWxsb3dDYW5jZWwgfTogb3B0cywgb25Db25maXJtZWQ6IGNiKSB7XG4gICAgdGhpcy5vbkNvbmZpcm1lZCA9IG9uQ29uZmlybWVkO1xuXG4gICAgdGhpcy5lbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgICB0aGlzLmVsZW1lbnQuY2xhc3NMaXN0LmFkZChcImh5ZHJvZ2VuXCIsIFwiaW5wdXQtdmlld1wiKTtcbiAgICBjb25zdCBsYWJlbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gICAgbGFiZWwuY2xhc3NMaXN0LmFkZChcImxhYmVsXCIsIFwiaWNvblwiLCBcImljb24tYXJyb3ctcmlnaHRcIik7XG4gICAgbGFiZWwudGV4dENvbnRlbnQgPSBwcm9tcHQgfHwgXCJLZXJuZWwgcmVxdWlyZXMgaW5wdXRcIjtcblxuICAgIHRoaXMubWluaUVkaXRvciA9IG5ldyBUZXh0RWRpdG9yKHsgbWluaTogdHJ1ZSB9KTtcbiAgICBpZiAoZGVmYXVsdFRleHQpIHRoaXMubWluaUVkaXRvci5zZXRUZXh0KGRlZmF1bHRUZXh0KTtcblxuICAgIHRoaXMuZWxlbWVudC5hcHBlbmRDaGlsZChsYWJlbCk7XG4gICAgdGhpcy5lbGVtZW50LmFwcGVuZENoaWxkKHRoaXMubWluaUVkaXRvci5lbGVtZW50KTtcblxuICAgIGlmIChhbGxvd0NhbmNlbCkge1xuICAgICAgYXRvbS5jb21tYW5kcy5hZGQodGhpcy5lbGVtZW50LCB7XG4gICAgICAgIFwiY29yZTpjb25maXJtXCI6ICgpID0+IHRoaXMuY29uZmlybSgpLFxuICAgICAgICBcImNvcmU6Y2FuY2VsXCI6ICgpID0+IHRoaXMuY2xvc2UoKVxuICAgICAgfSk7XG4gICAgICB0aGlzLm1pbmlFZGl0b3IuZWxlbWVudC5hZGRFdmVudExpc3RlbmVyKFwiYmx1clwiLCAoKSA9PiB7XG4gICAgICAgIGlmIChkb2N1bWVudC5oYXNGb2N1cygpKSB0aGlzLmNsb3NlKCk7XG4gICAgICB9KTtcbiAgICB9IGVsc2Uge1xuICAgICAgYXRvbS5jb21tYW5kcy5hZGQodGhpcy5lbGVtZW50LCB7XG4gICAgICAgIFwiY29yZTpjb25maXJtXCI6ICgpID0+IHRoaXMuY29uZmlybSgpXG4gICAgICB9KTtcbiAgICB9XG4gIH1cblxuICBjb25maXJtKCkge1xuICAgIGNvbnN0IHRleHQgPSB0aGlzLm1pbmlFZGl0b3IuZ2V0VGV4dCgpO1xuICAgIGlmICh0aGlzLm9uQ29uZmlybWVkKSB0aGlzLm9uQ29uZmlybWVkKHRleHQpO1xuICAgIHRoaXMuY2xvc2UoKTtcbiAgfVxuXG4gIGNsb3NlKCkge1xuICAgIGlmICh0aGlzLnBhbmVsKSB0aGlzLnBhbmVsLmRlc3Ryb3koKTtcbiAgICB0aGlzLnBhbmVsID0gbnVsbDtcbiAgICB0aGlzLmVsZW1lbnQucmVtb3ZlKCk7XG4gICAgaWYgKHRoaXMucHJldmlvdXNseUZvY3VzZWRFbGVtZW50KSB0aGlzLnByZXZpb3VzbHlGb2N1c2VkRWxlbWVudC5mb2N1cygpO1xuICB9XG5cbiAgYXR0YWNoKCkge1xuICAgIHRoaXMucHJldmlvdXNseUZvY3VzZWRFbGVtZW50ID0gZG9jdW1lbnQuYWN0aXZlRWxlbWVudDtcbiAgICB0aGlzLnBhbmVsID0gYXRvbS53b3Jrc3BhY2UuYWRkTW9kYWxQYW5lbCh7IGl0ZW06IHRoaXMuZWxlbWVudCB9KTtcbiAgICB0aGlzLm1pbmlFZGl0b3IuZWxlbWVudC5mb2N1cygpO1xuICAgIHRoaXMubWluaUVkaXRvci5zY3JvbGxUb0N1cnNvclBvc2l0aW9uKCk7XG4gIH1cbn1cbiJdfQ==