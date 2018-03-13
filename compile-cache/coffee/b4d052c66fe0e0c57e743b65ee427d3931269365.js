(function() {
  var CompositeDisposable, MinimapPigmentsBinding,
    indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  CompositeDisposable = require('atom').CompositeDisposable;

  module.exports = MinimapPigmentsBinding = (function() {
    function MinimapPigmentsBinding(arg) {
      this.editor = arg.editor, this.minimap = arg.minimap, this.colorBuffer = arg.colorBuffer;
      this.displayedMarkers = [];
      this.decorationsByMarkerId = {};
      this.subscriptionsByMarkerId = {};
      this.subscriptions = new CompositeDisposable;
      this.colorBuffer.initialize().then((function(_this) {
        return function() {
          return _this.updateMarkers();
        };
      })(this));
      if (this.colorBuffer.editor.onDidTokenize != null) {
        this.subscriptions.add(this.colorBuffer.editor.onDidTokenize((function(_this) {
          return function() {
            return _this.updateMarkers();
          };
        })(this)));
      } else {
        this.subscriptions.add(this.colorBuffer.editor.displayBuffer.onDidTokenize((function(_this) {
          return function() {
            return _this.updateMarkers();
          };
        })(this)));
      }
      this.subscriptions.add(this.colorBuffer.onDidUpdateColorMarkers((function(_this) {
        return function() {
          return _this.updateMarkers();
        };
      })(this)));
      this.decorations = [];
    }

    MinimapPigmentsBinding.prototype.updateMarkers = function() {
      var decoration, i, j, len, len1, m, markers, ref, ref1, ref2;
      markers = this.colorBuffer.findValidColorMarkers();
      ref = this.displayedMarkers;
      for (i = 0, len = ref.length; i < len; i++) {
        m = ref[i];
        if (indexOf.call(markers, m) < 0) {
          if ((ref1 = this.decorationsByMarkerId[m.id]) != null) {
            ref1.destroy();
          }
        }
      }
      for (j = 0, len1 = markers.length; j < len1; j++) {
        m = markers[j];
        if (!(((ref2 = m.color) != null ? ref2.isValid() : void 0) && indexOf.call(this.displayedMarkers, m) < 0)) {
          continue;
        }
        decoration = this.minimap.decorateMarker(m.marker, {
          type: 'highlight',
          color: m.color.toCSS(),
          plugin: 'pigments'
        });
        this.decorationsByMarkerId[m.id] = decoration;
        this.subscriptionsByMarkerId[m.id] = decoration.onDidDestroy((function(_this) {
          return function() {
            var ref3;
            if ((ref3 = _this.subscriptionsByMarkerId[m.id]) != null) {
              ref3.dispose();
            }
            delete _this.subscriptionsByMarkerId[m.id];
            return delete _this.decorationsByMarkerId[m.id];
          };
        })(this));
      }
      return this.displayedMarkers = markers;
    };

    MinimapPigmentsBinding.prototype.destroy = function() {
      this.destroyDecorations();
      return this.subscriptions.dispose();
    };

    MinimapPigmentsBinding.prototype.destroyDecorations = function() {
      var decoration, id, ref, ref1, sub;
      ref = this.subscriptionsByMarkerId;
      for (id in ref) {
        sub = ref[id];
        if (sub != null) {
          sub.dispose();
        }
      }
      ref1 = this.decorationsByMarkerId;
      for (id in ref1) {
        decoration = ref1[id];
        if (decoration != null) {
          decoration.destroy();
        }
      }
      this.decorationsByMarkerId = {};
      return this.subscriptionsByMarkerId = {};
    };

    return MinimapPigmentsBinding;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL2V2YW5oZW5kcml4MS8uYXRvbS9wYWNrYWdlcy9taW5pbWFwLXBpZ21lbnRzL2xpYi9taW5pbWFwLXBpZ21lbnRzLWJpbmRpbmcuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQUEsTUFBQSwyQ0FBQTtJQUFBOztFQUFDLHNCQUF1QixPQUFBLENBQVEsTUFBUjs7RUFFeEIsTUFBTSxDQUFDLE9BQVAsR0FDTTtJQUNTLGdDQUFDLEdBQUQ7TUFBRSxJQUFDLENBQUEsYUFBQSxRQUFRLElBQUMsQ0FBQSxjQUFBLFNBQVMsSUFBQyxDQUFBLGtCQUFBO01BQ2pDLElBQUMsQ0FBQSxnQkFBRCxHQUFvQjtNQUNwQixJQUFDLENBQUEscUJBQUQsR0FBeUI7TUFDekIsSUFBQyxDQUFBLHVCQUFELEdBQTJCO01BRTNCLElBQUMsQ0FBQSxhQUFELEdBQWlCLElBQUk7TUFFckIsSUFBQyxDQUFBLFdBQVcsQ0FBQyxVQUFiLENBQUEsQ0FBeUIsQ0FBQyxJQUExQixDQUErQixDQUFBLFNBQUEsS0FBQTtlQUFBLFNBQUE7aUJBQUcsS0FBQyxDQUFBLGFBQUQsQ0FBQTtRQUFIO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUEvQjtNQUVBLElBQUcsNkNBQUg7UUFDRSxJQUFDLENBQUEsYUFBYSxDQUFDLEdBQWYsQ0FBbUIsSUFBQyxDQUFBLFdBQVcsQ0FBQyxNQUFNLENBQUMsYUFBcEIsQ0FBa0MsQ0FBQSxTQUFBLEtBQUE7aUJBQUEsU0FBQTttQkFDbkQsS0FBQyxDQUFBLGFBQUQsQ0FBQTtVQURtRDtRQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBbEMsQ0FBbkIsRUFERjtPQUFBLE1BQUE7UUFJRSxJQUFDLENBQUEsYUFBYSxDQUFDLEdBQWYsQ0FBbUIsSUFBQyxDQUFBLFdBQVcsQ0FBQyxNQUFNLENBQUMsYUFBYSxDQUFDLGFBQWxDLENBQWdELENBQUEsU0FBQSxLQUFBO2lCQUFBLFNBQUE7bUJBQ2pFLEtBQUMsQ0FBQSxhQUFELENBQUE7VUFEaUU7UUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQWhELENBQW5CLEVBSkY7O01BT0EsSUFBQyxDQUFBLGFBQWEsQ0FBQyxHQUFmLENBQW1CLElBQUMsQ0FBQSxXQUFXLENBQUMsdUJBQWIsQ0FBcUMsQ0FBQSxTQUFBLEtBQUE7ZUFBQSxTQUFBO2lCQUN0RCxLQUFDLENBQUEsYUFBRCxDQUFBO1FBRHNEO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUFyQyxDQUFuQjtNQUdBLElBQUMsQ0FBQSxXQUFELEdBQWU7SUFuQko7O3FDQXFCYixhQUFBLEdBQWUsU0FBQTtBQUNiLFVBQUE7TUFBQSxPQUFBLEdBQVUsSUFBQyxDQUFBLFdBQVcsQ0FBQyxxQkFBYixDQUFBO0FBRVY7QUFBQSxXQUFBLHFDQUFBOztZQUFnQyxhQUFTLE9BQVQsRUFBQSxDQUFBOztnQkFDRixDQUFFLE9BQTlCLENBQUE7OztBQURGO0FBR0EsV0FBQSwyQ0FBQTs7OENBQTZCLENBQUUsT0FBVCxDQUFBLFdBQUEsSUFBdUIsYUFBUyxJQUFDLENBQUEsZ0JBQVYsRUFBQSxDQUFBOzs7UUFDM0MsVUFBQSxHQUFhLElBQUMsQ0FBQSxPQUFPLENBQUMsY0FBVCxDQUF3QixDQUFDLENBQUMsTUFBMUIsRUFBa0M7VUFBQSxJQUFBLEVBQU0sV0FBTjtVQUFtQixLQUFBLEVBQU8sQ0FBQyxDQUFDLEtBQUssQ0FBQyxLQUFSLENBQUEsQ0FBMUI7VUFBMkMsTUFBQSxFQUFRLFVBQW5EO1NBQWxDO1FBRWIsSUFBQyxDQUFBLHFCQUFzQixDQUFBLENBQUMsQ0FBQyxFQUFGLENBQXZCLEdBQStCO1FBQy9CLElBQUMsQ0FBQSx1QkFBd0IsQ0FBQSxDQUFDLENBQUMsRUFBRixDQUF6QixHQUFpQyxVQUFVLENBQUMsWUFBWCxDQUF3QixDQUFBLFNBQUEsS0FBQTtpQkFBQSxTQUFBO0FBQ3ZELGdCQUFBOztrQkFBOEIsQ0FBRSxPQUFoQyxDQUFBOztZQUNBLE9BQU8sS0FBQyxDQUFBLHVCQUF3QixDQUFBLENBQUMsQ0FBQyxFQUFGO21CQUNoQyxPQUFPLEtBQUMsQ0FBQSxxQkFBc0IsQ0FBQSxDQUFDLENBQUMsRUFBRjtVQUh5QjtRQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBeEI7QUFKbkM7YUFTQSxJQUFDLENBQUEsZ0JBQUQsR0FBb0I7SUFmUDs7cUNBaUJmLE9BQUEsR0FBUyxTQUFBO01BQ1AsSUFBQyxDQUFBLGtCQUFELENBQUE7YUFDQSxJQUFDLENBQUEsYUFBYSxDQUFDLE9BQWYsQ0FBQTtJQUZPOztxQ0FJVCxrQkFBQSxHQUFvQixTQUFBO0FBQ2xCLFVBQUE7QUFBQTtBQUFBLFdBQUEsU0FBQTs7O1VBQUEsR0FBRyxDQUFFLE9BQUwsQ0FBQTs7QUFBQTtBQUNBO0FBQUEsV0FBQSxVQUFBOzs7VUFBQSxVQUFVLENBQUUsT0FBWixDQUFBOztBQUFBO01BRUEsSUFBQyxDQUFBLHFCQUFELEdBQXlCO2FBQ3pCLElBQUMsQ0FBQSx1QkFBRCxHQUEyQjtJQUxUOzs7OztBQTlDdEIiLCJzb3VyY2VzQ29udGVudCI6WyJ7Q29tcG9zaXRlRGlzcG9zYWJsZX0gPSByZXF1aXJlICdhdG9tJ1xuXG5tb2R1bGUuZXhwb3J0cyA9XG5jbGFzcyBNaW5pbWFwUGlnbWVudHNCaW5kaW5nXG4gIGNvbnN0cnVjdG9yOiAoe0BlZGl0b3IsIEBtaW5pbWFwLCBAY29sb3JCdWZmZXJ9KSAtPlxuICAgIEBkaXNwbGF5ZWRNYXJrZXJzID0gW11cbiAgICBAZGVjb3JhdGlvbnNCeU1hcmtlcklkID0ge31cbiAgICBAc3Vic2NyaXB0aW9uc0J5TWFya2VySWQgPSB7fVxuXG4gICAgQHN1YnNjcmlwdGlvbnMgPSBuZXcgQ29tcG9zaXRlRGlzcG9zYWJsZVxuXG4gICAgQGNvbG9yQnVmZmVyLmluaXRpYWxpemUoKS50aGVuID0+IEB1cGRhdGVNYXJrZXJzKClcblxuICAgIGlmIEBjb2xvckJ1ZmZlci5lZGl0b3Iub25EaWRUb2tlbml6ZT9cbiAgICAgIEBzdWJzY3JpcHRpb25zLmFkZCBAY29sb3JCdWZmZXIuZWRpdG9yLm9uRGlkVG9rZW5pemUgPT5cbiAgICAgICAgQHVwZGF0ZU1hcmtlcnMoKVxuICAgIGVsc2VcbiAgICAgIEBzdWJzY3JpcHRpb25zLmFkZCBAY29sb3JCdWZmZXIuZWRpdG9yLmRpc3BsYXlCdWZmZXIub25EaWRUb2tlbml6ZSA9PlxuICAgICAgICBAdXBkYXRlTWFya2VycygpXG5cbiAgICBAc3Vic2NyaXB0aW9ucy5hZGQgQGNvbG9yQnVmZmVyLm9uRGlkVXBkYXRlQ29sb3JNYXJrZXJzID0+XG4gICAgICBAdXBkYXRlTWFya2VycygpXG5cbiAgICBAZGVjb3JhdGlvbnMgPSBbXVxuXG4gIHVwZGF0ZU1hcmtlcnM6IC0+XG4gICAgbWFya2VycyA9IEBjb2xvckJ1ZmZlci5maW5kVmFsaWRDb2xvck1hcmtlcnMoKVxuXG4gICAgZm9yIG0gaW4gQGRpc3BsYXllZE1hcmtlcnMgd2hlbiBtIG5vdCBpbiBtYXJrZXJzXG4gICAgICBAZGVjb3JhdGlvbnNCeU1hcmtlcklkW20uaWRdPy5kZXN0cm95KClcblxuICAgIGZvciBtIGluIG1hcmtlcnMgd2hlbiBtLmNvbG9yPy5pc1ZhbGlkKCkgYW5kIG0gbm90IGluIEBkaXNwbGF5ZWRNYXJrZXJzXG4gICAgICBkZWNvcmF0aW9uID0gQG1pbmltYXAuZGVjb3JhdGVNYXJrZXIobS5tYXJrZXIsIHR5cGU6ICdoaWdobGlnaHQnLCBjb2xvcjogbS5jb2xvci50b0NTUygpLCBwbHVnaW46ICdwaWdtZW50cycpXG5cbiAgICAgIEBkZWNvcmF0aW9uc0J5TWFya2VySWRbbS5pZF0gPSBkZWNvcmF0aW9uXG4gICAgICBAc3Vic2NyaXB0aW9uc0J5TWFya2VySWRbbS5pZF0gPSBkZWNvcmF0aW9uLm9uRGlkRGVzdHJveSA9PlxuICAgICAgICBAc3Vic2NyaXB0aW9uc0J5TWFya2VySWRbbS5pZF0/LmRpc3Bvc2UoKVxuICAgICAgICBkZWxldGUgQHN1YnNjcmlwdGlvbnNCeU1hcmtlcklkW20uaWRdXG4gICAgICAgIGRlbGV0ZSBAZGVjb3JhdGlvbnNCeU1hcmtlcklkW20uaWRdXG5cbiAgICBAZGlzcGxheWVkTWFya2VycyA9IG1hcmtlcnNcblxuICBkZXN0cm95OiAtPlxuICAgIEBkZXN0cm95RGVjb3JhdGlvbnMoKVxuICAgIEBzdWJzY3JpcHRpb25zLmRpc3Bvc2UoKVxuXG4gIGRlc3Ryb3lEZWNvcmF0aW9uczogLT5cbiAgICBzdWI/LmRpc3Bvc2UoKSBmb3IgaWQsc3ViIG9mIEBzdWJzY3JpcHRpb25zQnlNYXJrZXJJZFxuICAgIGRlY29yYXRpb24/LmRlc3Ryb3koKSBmb3IgaWQsZGVjb3JhdGlvbiBvZiBAZGVjb3JhdGlvbnNCeU1hcmtlcklkXG5cbiAgICBAZGVjb3JhdGlvbnNCeU1hcmtlcklkID0ge31cbiAgICBAc3Vic2NyaXB0aW9uc0J5TWFya2VySWQgPSB7fVxuIl19
