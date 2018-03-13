(function() {
  var BrowserPlus, Disposable, Emitter, HTMLEditor, Model, fs, path, ref,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty,
    indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  ref = require('atom'), Disposable = ref.Disposable, Emitter = ref.Emitter;

  Model = require('theorist').Model;

  BrowserPlus = require('./browser-plus').BrowserPlus;

  path = require('path');

  fs = require('fs');

  module.exports = HTMLEditor = (function(superClass) {
    extend(HTMLEditor, superClass);

    atom.deserializers.add(HTMLEditor);

    function HTMLEditor(arg) {
      var i, item, j, len, len1, menu, ref1, ref2;
      this.browserPlus = arg.browserPlus, this.url = arg.url, this.opt = arg.opt;
      if (typeof this.browserPlus === 'string') {
        this.browserPlus = JSON.parse(this.browserPlus);
      }
      if (!this.opt) {
        this.opt = {};
      }
      this.disposable = new Disposable();
      this.emitter = new Emitter;
      this.src = this.opt.src;
      this.orgURI = this.opt.orgURI;
      this._id = this.opt._id;
      if (this.browserPlus && !this.browserPlus.setContextMenu) {
        this.browserPlus.setContextMenu = true;
        ref1 = atom.contextMenu.itemSets;
        for (i = 0, len = ref1.length; i < len; i++) {
          menu = ref1[i];
          if (menu.selector === 'atom-pane') {
            ref2 = menu.items;
            for (j = 0, len1 = ref2.length; j < len1; j++) {
              item = ref2[j];
              item.shouldDisplay = function(evt) {
                var ref3, ref4;
                if ((ref3 = evt.target) != null ? (ref4 = ref3.constructor) != null ? ref4.name = 'webview' : void 0 : void 0) {
                  return false;
                }
                return true;
              };
            }
          }
        }
      }
    }

    HTMLEditor.prototype.getViewClass = function() {
      return require('./browser-plus-view');
    };

    HTMLEditor.prototype.setText = function(src) {
      this.src = src;
      if (this.src) {
        return this.view.setSrc(this.src);
      }
    };

    HTMLEditor.prototype.refresh = function(url) {
      return this.view.refreshPage(url);
    };

    HTMLEditor.prototype.destroyed = function() {
      return this.emitter.emit('did-destroy');
    };

    HTMLEditor.prototype.onDidDestroy = function(cb) {
      return this.emitter.on('did-destroy', cb);
    };

    HTMLEditor.prototype.getTitle = function() {
      var ref1;
      if (((ref1 = this.title) != null ? ref1.length : void 0) > 20) {
        this.title = this.title.slice(0, 20) + '...';
      }
      return this.title || path.basename(this.url);
    };

    HTMLEditor.prototype.getIconName = function() {
      return this.iconName;
    };

    HTMLEditor.prototype.getURI = function() {
      if (this.url === 'browser-plus://blank') {
        return false;
      }
      return this.url;
    };

    HTMLEditor.prototype.getGrammar = function() {};

    HTMLEditor.prototype.setTitle = function(title) {
      this.title = title;
      return this.emit('title-changed');
    };

    HTMLEditor.prototype.updateIcon = function(favIcon) {
      this.favIcon = favIcon;
      return this.emit('icon-changed');
    };

    HTMLEditor.prototype.serialize = function() {
      return {
        data: {
          browserPlus: JSON.stringify(this.browserPlus),
          url: this.url,
          opt: {
            src: this.src,
            iconName: this.iconName,
            title: this.title
          }
        },
        deserializer: 'HTMLEditor'
      };
    };

    HTMLEditor.deserialize = function(arg) {
      var data;
      data = arg.data;
      return new HTMLEditor(data);
    };

    HTMLEditor.checkUrl = function(url) {
      if ((this.checkBlockUrl != null) && this.checkBlockUrl(url)) {
        atom.notifications.addSuccess(url + " Blocked~~Maintain Blocked URL in Browser-Plus Settings");
        return false;
      }
      return true;
    };

    HTMLEditor.getEditorForURI = function(url, sameWindow) {
      var a, a1, editor, i, len, panes, ref1, uri, urls;
      if (url.startsWith('file:///')) {
        return;
      }
      a = document.createElement("a");
      a.href = url;
      if (!sameWindow && (urls = atom.config.get('browser-plus.openInSameWindow')).length) {
        sameWindow = (ref1 = a.hostname, indexOf.call(urls, ref1) >= 0);
      }
      if (!sameWindow) {
        return;
      }
      panes = atom.workspace.getPaneItems();
      a1 = document.createElement("a");
      for (i = 0, len = panes.length; i < len; i++) {
        editor = panes[i];
        uri = editor.getURI();
        a1.href = uri;
        if (a1.hostname === a.hostname) {
          return editor;
        }
      }
      return false;
    };

    return HTMLEditor;

  })(Model);

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL2V2YW5oZW5kcml4MS8uYXRvbS9wYWNrYWdlcy9icm93c2VyLXBsdXMvbGliL2Jyb3dzZXItcGx1cy1tb2RlbC5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQ0E7QUFBQSxNQUFBLGtFQUFBO0lBQUE7Ozs7RUFBQSxNQUF1QixPQUFBLENBQVEsTUFBUixDQUF2QixFQUFDLDJCQUFELEVBQVk7O0VBQ1gsUUFBUyxPQUFBLENBQVEsVUFBUjs7RUFDVCxjQUFlLE9BQUEsQ0FBUSxnQkFBUjs7RUFDaEIsSUFBQSxHQUFPLE9BQUEsQ0FBUSxNQUFSOztFQUNQLEVBQUEsR0FBSyxPQUFBLENBQVEsSUFBUjs7RUFDTCxNQUFNLENBQUMsT0FBUCxHQUNROzs7SUFDSixJQUFJLENBQUMsYUFBYSxDQUFDLEdBQW5CLENBQXVCLFVBQXZCOztJQUNhLG9CQUFDLEdBQUQ7QUFDWCxVQUFBO01BRGMsSUFBQyxDQUFBLGtCQUFBLGFBQWEsSUFBQyxDQUFBLFVBQUEsS0FBSSxJQUFDLENBQUEsVUFBQTtNQUNsQyxJQUEyQyxPQUFPLElBQUMsQ0FBQSxXQUFSLEtBQXVCLFFBQWxFO1FBQUEsSUFBQyxDQUFBLFdBQUQsR0FBZSxJQUFJLENBQUMsS0FBTCxDQUFXLElBQUMsQ0FBQSxXQUFaLEVBQWY7O01BQ0EsSUFBQSxDQUFpQixJQUFDLENBQUEsR0FBbEI7UUFBQSxJQUFDLENBQUEsR0FBRCxHQUFPLEdBQVA7O01BQ0EsSUFBQyxDQUFBLFVBQUQsR0FBa0IsSUFBQSxVQUFBLENBQUE7TUFDbEIsSUFBQyxDQUFBLE9BQUQsR0FBVyxJQUFJO01BQ2YsSUFBQyxDQUFBLEdBQUQsR0FBTyxJQUFDLENBQUEsR0FBRyxDQUFDO01BQ1osSUFBQyxDQUFBLE1BQUQsR0FBVSxJQUFDLENBQUEsR0FBRyxDQUFDO01BQ2YsSUFBQyxDQUFBLEdBQUQsR0FBTyxJQUFDLENBQUEsR0FBRyxDQUFDO01BQ1osSUFBRyxJQUFD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R0FBRCxFQUFLLFVBQUw7QUFDaEIsVUFBQTtNQUFBLElBQVUsR0FBRyxDQUFDLFVBQUosQ0FBZSxVQUFmLENBQVY7QUFBQSxlQUFBOztNQUNBLENBQUEsR0FBSSxRQUFRLENBQUMsYUFBVCxDQUF1QixHQUF2QjtNQUNKLENBQUMsQ0FBQyxJQUFGLEdBQVM7TUFDVCxJQUFHLENBQUksVUFBSixJQUFtQixDQUFDLElBQUEsR0FBTyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQVosQ0FBZ0IsK0JBQWhCLENBQVIsQ0FBeUQsQ0FBQyxNQUFoRjtRQUNFLFVBQUEsR0FBYSxRQUFBLENBQUMsQ0FBQyxRQUFGLEVBQUEsYUFBYyxJQUFkLEVBQUEsSUFBQSxNQUFBLEVBRGY7O01BR0EsSUFBQSxDQUFjLFVBQWQ7QUFBQSxlQUFBOztNQUNBLEtBQUEsR0FBUSxJQUFJLENBQUMsU0FBUyxDQUFDLFlBQWYsQ0FBQTtNQUNSLEVBQUEsR0FBSyxRQUFRLENBQUMsYUFBVCxDQUF1QixHQUF2QjtBQUNMLFdBQUEsdUNBQUE7O1FBQ0UsR0FBQSxHQUFNLE1BQU0sQ0FBQyxNQUFQLENBQUE7UUFDTixFQUFFLENBQUMsSUFBSCxHQUFVO1FBQ1YsSUFBaUIsRUFBRSxDQUFDLFFBQUgsS0FBZSxDQUFDLENBQUMsUUFBbEM7QUFBQSxpQkFBTyxPQUFQOztBQUhGO0FBSUEsYUFBTztJQWRTOzs7O0tBNUVLO0FBTjNCIiwic291cmNlc0NvbnRlbnQiOlsiIyBodHRwOi8vd3d3LnNrYW5kYXNvZnQuY29tL1xue0Rpc3Bvc2FibGUsRW1pdHRlcn0gPSByZXF1aXJlICdhdG9tJ1xue01vZGVsfSA9IHJlcXVpcmUgJ3RoZW9yaXN0J1xue0Jyb3dzZXJQbHVzfSA9IHJlcXVpcmUgJy4vYnJvd3Nlci1wbHVzJ1xucGF0aCA9IHJlcXVpcmUgJ3BhdGgnXG5mcyA9IHJlcXVpcmUgJ2ZzJ1xubW9kdWxlLmV4cG9ydHMgPVxuICBjbGFzcyBIVE1MRWRpdG9yIGV4dGVuZHMgTW9kZWxcbiAgICBhdG9tLmRlc2VyaWFsaXplcnMuYWRkKHRoaXMpXG4gICAgY29uc3RydWN0b3I6ICh7IEBicm93c2VyUGx1cyAsQHVybCxAb3B0IH0pIC0+XG4gICAgICBAYnJvd3NlclBsdXMgPSBKU09OLnBhcnNlKEBicm93c2VyUGx1cykgaWYgdHlwZW9mIEBicm93c2VyUGx1cyBpcyAnc3RyaW5nJ1xuICAgICAgQG9wdCA9IHt9IHVubGVzcyBAb3B0XG4gICAgICBAZGlzcG9zYWJsZSA9IG5ldyBEaXNwb3NhYmxlKClcbiAgICAgIEBlbWl0dGVyID0gbmV3IEVtaXR0ZXJcbiAgICAgIEBzcmMgPSBAb3B0LnNyY1xuICAgICAgQG9yZ1VSSSA9IEBvcHQub3JnVVJJXG4gICAgICBAX2lkID0gQG9wdC5faWRcbiAgICAgIGlmIEBicm93c2VyUGx1cyBhbmQgbm90IEBicm93c2VyUGx1cy5zZXRDb250ZXh0TWVudVxuICAgICAgICBAYnJvd3NlclBsdXMuc2V0Q29udGV4dE1lbnUgPSB0cnVlXG4gICAgICAgIGZvciBtZW51IGluIGF0b20uY29udGV4dE1lbnUuaXRlbVNldHNcbiAgICAgICAgICBpZiBtZW51LnNlbGVjdG9yIGlzICdhdG9tLXBhbmUnXG4gICAgICAgICAgICBmb3IgaXRlbSBpbiBtZW51Lml0ZW1zXG4gICAgICAgICAgICAgIGl0ZW0uc2hvdWxkRGlzcGxheSA9IChldnQpLT5cbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2UgaWYgZXZ0LnRhcmdldD8uY29uc3RydWN0b3I/Lm5hbWUgPSAnd2VidmlldydcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZVxuXG4gICAgZ2V0Vmlld0NsYXNzOiAtPlxuICAgICAgcmVxdWlyZSAnLi9icm93c2VyLXBsdXMtdmlldydcblxuICAgIHNldFRleHQ6IChAc3JjKS0+XG4gICAgICBAdmlldy5zZXRTcmMoQHNyYykgaWYgQHNyY1xuXG4gICAgcmVmcmVzaDogKHVybCktPlxuICAgICAgICBAdmlldy5yZWZyZXNoUGFnZSh1cmwpXG5cbiAgICBkZXN0cm95ZWQ6IC0+XG4gICAgICAjIEB1bnN1YnNjcmliZSgpXG4gICAgICBAZW1pdHRlci5lbWl0ICdkaWQtZGVzdHJveSdcblxuICAgIG9uRGlkRGVzdHJveTogKGNiKS0+XG4gICAgICBAZW1pdHRlci5vbiAnZGlkLWRlc3Ryb3knLCBjYlxuXG4gICAgZ2V0VGl0bGU6IC0+XG4gICAgICBpZiBAdGl0bGU/Lmxlbmd0aCA+IDIwXG4gICAgICAgIEB0aXRsZSA9IEB0aXRsZVswLi4uMjBdKycuLi4nXG4gICAgICBAdGl0bGUgb3IgcGF0aC5iYXNlbmFtZShAdXJsKVxuXG4gICAgZ2V0SWNvbk5hbWU6IC0+XG4gICAgICBAaWNvbk5hbWVcblxuICAgIGdldFVSSTogLT5cbiAgICAgIHJldHVybiBmYWxzZSBpZiBAdXJsIGlzICdicm93c2VyLXBsdXM6Ly9ibGFuaydcbiAgICAgIEB1cmxcblxuICAgIGdldEdyYW1tYXI6IC0+XG5cbiAgICBzZXRUaXRsZTogKEB0aXRsZSktPlxuICAgICAgQGVtaXQgJ3RpdGxlLWNoYW5nZWQnXG5cbiAgICB1cGRhdGVJY29uOiAoQGZhdkljb24pLT5cbiAgICAgIEBlbWl0ICdpY29uLWNoYW5nZWQnXG5cbiAgICBzZXJpYWxpemU6IC0+XG4gICAgICBkYXRhOlxuICAgICAgICAjIGJyb3dzZXJQbHVzOiBKU09OLnN0cmluZ2lmeShAYnJvd3NlclBsdXMpXG4gICAgICAgIGJyb3dzZXJQbHVzOiBKU09OLnN0cmluZ2lmeShAYnJvd3NlclBsdXMpXG4gICAgICAgIHVybDogQHVybFxuICAgICAgICBvcHQ6XG4gICAgICAgICAgc3JjOiAgQHNyY1xuICAgICAgICAgIGljb25OYW1lOiBAaWNvbk5hbWVcbiAgICAgICAgICB0aXRsZTogQHRpdGxlXG5cbiAgICAgIGRlc2VyaWFsaXplcjogICdIVE1MRWRpdG9yJ1xuXG4gICAgQGRlc2VyaWFsaXplOiAoe2RhdGF9KSAtPlxuICAgICAgbmV3IEhUTUxFZGl0b3IoZGF0YSlcblxuICAgIEBjaGVja1VybDogKHVybCktPlxuICAgICAgaWYgQGNoZWNrQmxvY2tVcmw/IGFuZCBAY2hlY2tCbG9ja1VybCh1cmwpXG4gICAgICAgIGF0b20ubm90aWZpY2F0aW9ucy5hZGRTdWNjZXNzKFwiI3t1cmx9IEJsb2NrZWR+fk1haW50YWluIEJsb2NrZWQgVVJMIGluIEJyb3dzZXItUGx1cyBTZXR0aW5nc1wiKVxuICAgICAgICByZXR1cm4gZmFsc2VcbiAgICAgIHJldHVybiB0cnVlXG5cbiAgICBAZ2V0RWRpdG9yRm9yVVJJOiAodXJsLHNhbWVXaW5kb3cpLT5cbiAgICAgIHJldHVybiBpZiB1cmwuc3RhcnRzV2l0aCgnZmlsZTovLy8nKVxuICAgICAgYSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJhXCIpXG4gICAgICBhLmhyZWYgPSB1cmxcbiAgICAgIGlmIG5vdCBzYW1lV2luZG93IGFuZCAodXJscyA9IGF0b20uY29uZmlnLmdldCgnYnJvd3Nlci1wbHVzLm9wZW5JblNhbWVXaW5kb3cnKSkubGVuZ3RoXG4gICAgICAgIHNhbWVXaW5kb3cgPSBhLmhvc3RuYW1lIGluIHVybHNcblxuICAgICAgcmV0dXJuIHVubGVzcyBzYW1lV2luZG93XG4gICAgICBwYW5lcyA9IGF0b20ud29ya3NwYWNlLmdldFBhbmVJdGVtcygpXG4gICAgICBhMSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJhXCIpXG4gICAgICBmb3IgZWRpdG9yIGluIHBhbmVzXG4gICAgICAgIHVyaSA9IGVkaXRvci5nZXRVUkkoKVxuICAgICAgICBhMS5ocmVmID0gdXJpXG4gICAgICAgIHJldHVybiBlZGl0b3IgaWYgYTEuaG9zdG5hbWUgaXMgYS5ob3N0bmFtZVxuICAgICAgcmV0dXJuIGZhbHNlXG4iXX0=
