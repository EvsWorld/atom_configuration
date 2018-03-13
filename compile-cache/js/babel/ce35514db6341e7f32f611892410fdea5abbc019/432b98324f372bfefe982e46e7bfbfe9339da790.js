Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { var callNext = step.bind(null, "next"); var callThrow = step.bind(null, "throw"); function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(callNext, callThrow); } } callNext(); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _atomSelectList = require("atom-select-list");

var _atomSelectList2 = _interopRequireDefault(_atomSelectList);

var _lodash = require("lodash");

var _lodash2 = _interopRequireDefault(_lodash);

var _tildify = require("tildify");

var _tildify2 = _interopRequireDefault(_tildify);

var _uuidV4 = require("uuid/v4");

var _uuidV42 = _interopRequireDefault(_uuidV4);

var _ws = require("ws");

var _ws2 = _interopRequireDefault(_ws);

var _xmlhttprequest = require("xmlhttprequest");

var _xmlhttprequest2 = _interopRequireDefault(_xmlhttprequest);

var _url = require("url");

var _jupyterlabServices = require("@jupyterlab/services");

var _config = require("./config");

var _config2 = _interopRequireDefault(_config);

var _wsKernel = require("./ws-kernel");

var _wsKernel2 = _interopRequireDefault(_wsKernel);

var _inputView = require("./input-view");

var _inputView2 = _interopRequireDefault(_inputView);

var _store = require("./store");

var _store2 = _interopRequireDefault(_store);

var CustomListView = (function () {
  function CustomListView() {
    var _this = this;

    _classCallCheck(this, CustomListView);

    this.onConfirmed = null;
    this.onCancelled = null;

    this.previouslyFocusedElement = document.activeElement;
    this.selectListView = new _atomSelectList2["default"]({
      itemsClassList: ["mark-active"],
      items: [],
      filterKeyForItem: function filterKeyForItem(item) {
        return item.name;
      },
      elementForItem: function elementForItem(item) {
        var element = document.createElement("li");
        element.textContent = item.name;
        return element;
      },
      didConfirmSelection: function didConfirmSelection(item) {
        if (_this.onConfirmed) _this.onConfirmed(item);
      },
      didCancelSelection: function didCancelSelection() {
        _this.cancel();
        if (_this.onCancelled) _this.onCancelled();
      }
    });
  }

  _createClass(CustomListView, [{
    key: "show",
    value: function show() {
      if (!this.panel) {
        this.panel = atom.workspace.addModalPanel({ item: this.selectListView });
      }
      this.panel.show();
      this.selectListView.focus();
    }
  }, {
    key: "destroy",
    value: function destroy() {
      this.cancel();
      return this.selectListView.destroy();
    }
  }, {
    key: "cancel",
    value: function cancel() {
      if (this.panel != null) {
        this.panel.destroy();
      }
      this.panel = null;
      if (this.previouslyFocusedElement) {
        this.previouslyFocusedElement.focus();
        this.previouslyFocusedElement = null;
      }
    }
  }]);

  return CustomListView;
})();

var WSKernelPicker = (function () {
  function WSKernelPicker(onChosen) {
    _classCallCheck(this, WSKernelPicker);

    this._onChosen = onChosen;
    this.listView = new CustomListView();
  }

  _createClass(WSKernelPicker, [{
    key: "toggle",
    value: _asyncToGenerator(function* (_kernelSpecFilter) {
      this.listView.previouslyFocusedElement = document.activeElement;
      this._kernelSpecFilter = _kernelSpecFilter;
      var gateways = _config2["default"].getJson("gateways") || [];
      if (_lodash2["default"].isEmpty(gateways)) {
        atom.notifications.addError("No remote kernel gateways available", {
          description: "Use the Hydrogen package settings to specify the list of remote servers. Hydrogen can use remote kernels on either a Jupyter Kernel Gateway or Jupyter notebook server."
        });
        return;
      }

      this._path = (_store2["default"].filePath || "unsaved") + "-" + (0, _uuidV42["default"])();

      this.listView.onConfirmed = this.onGateway.bind(this);

      yield this.listView.selectListView.update({
        items: gateways,
        infoMessage: "Select a gateway",
        emptyMessage: "No gateways available",
        loadingMessage: null
      });

      this.listView.show();
    })
  }, {
    key: "promptForText",
    value: _asyncToGenerator(function* (prompt) {
      var previouslyFocusedElement = this.listView.previouslyFocusedElement;
      this.listView.cancel();

      var inputPromise = new Promise(function (resolve, reject) {
        var inputView = new _inputView2["default"]({ prompt: prompt }, resolve);
        atom.commands.add(inputView.element, {
          "core:cancel": function coreCancel() {
            inputView.close();
            reject();
          }
        });
        inputView.attach();
      });

      var response = undefined;
      try {
        response = yield inputPromise;
        if (response === "") {
          return null;
        }
      } catch (e) {
        return null;
      }

      // Assume that no response to the prompt will cancel the entire flow, so
      // only restore listView if a response was received
      this.listView.show();
      this.listView.previouslyFocusedElement = previouslyFocusedElement;
      return response;
    })
  }, {
    key: "promptForCookie",
    value: _asyncToGenerator(function* (options) {
      var cookie = yield this.promptForText("Cookie:");
      if (cookie === null) {
        return false;
      }

      if (options.requestHeaders === undefined) {
        options.requestHeaders = {};
      }
      options.requestHeaders.Cookie = cookie;
      options.xhrFactory = function () {
        var request = new _xmlhttprequest2["default"].XMLHttpRequest();
        // Disable protections against setting the Cookie header
        request.setDisableHeaderCheck(true);
        return request;
      };
      options.wsFactory = function (url, protocol) {
        // Authentication requires requests to appear to be same-origin
        var parsedUrl = new _url.URL(url);
        if (parsedUrl.protocol == "wss:") {
          parsedUrl.protocol = "https:";
        } else {
          parsedUrl.protocol = "http:";
        }
        var headers = { Cookie: cookie };
        var origin = parsedUrl.origin;
        var host = parsedUrl.host;
        return new _ws2["default"](url, protocol, { headers: headers, origin: origin, host: host });
      };
      return true;
    })
  }, {
    key: "promptForToken",
    value: _asyncToGenerator(function* (options) {
      var token = yield this.promptForText("Token:");
      if (token === null) {
        return false;
      }

      options.token = token;
      return true;
    })
  }, {
    key: "promptForCredentials",
    value: _asyncToGenerator(function* (options) {
      var _this2 = this;

      yield this.listView.selectListView.update({
        items: [{
          name: "Authenticate with a token",
          action: "token"
        }, {
          name: "Authenticate with a cookie",
          action: "cookie"
        }, {
          name: "Cancel",
          action: "cancel"
        }],
        infoMessage: "Connection to gateway failed. Your settings may be incorrect, the server may be unavailable, or you may lack sufficient privileges to complete the connection.",
        loadingMessage: null,
        emptyMessage: null
      });

      var action = yield new Promise(function (resolve, reject) {
        _this2.listView.onConfirmed = function (item) {
          return resolve(item.action);
        };
        _this2.listView.onCancelled = function () {
          return resolve("cancel");
        };
      });
      if (action === "token") {
        return yield this.promptForToken(options);
      } else if (action === "cookie") {
        return yield this.promptForCookie(options);
      } else {
        // action === "cancel"
        this.listView.cancel();
        return false;
      }
    })
  }, {
    key: "onGateway",
    value: _asyncToGenerator(function* (gatewayInfo) {
      var _this3 = this;

      this.listView.onConfirmed = null;
      yield this.listView.selectListView.update({
        items: [],
        infoMessage: null,
        loadingMessage: "Loading sessions...",
        emptyMessage: "No sessions available"
      });

      var gatewayOptions = Object.assign({
        xhrFactory: function xhrFactory() {
          return new _xmlhttprequest2["default"].XMLHttpRequest();
        },
        wsFactory: function wsFactory(url, protocol) {
          return new _ws2["default"](url, protocol);
        }
      }, gatewayInfo.options);

      var serverSettings = _jupyterlabServices.ServerConnection.makeSettings(gatewayOptions);
      var specModels = undefined;

      try {
        specModels = yield _jupyterlabServices.Kernel.getSpecs(serverSettings);
      } catch (error) {
        // The error types you get back at this stage are fairly opaque. In
        // particular, having invalid credentials typically triggers ECONNREFUSED
        // rather than 403 Forbidden. This does some basic checks and then assumes
        // that all remaining error types could be caused by invalid credentials.
        if (!error.xhr || !error.xhr.responseText) {
          throw error;
        } else if (error.xhr.responseText.includes("ETIMEDOUT")) {
          atom.notifications.addError("Connection to gateway failed");
          this.listView.cancel();
          return;
        } else {
          var promptSucceeded = yield this.promptForCredentials(gatewayOptions);
          if (!promptSucceeded) {
            return;
          }
          serverSettings = _jupyterlabServices.ServerConnection.makeSettings(gatewayOptions);
          yield this.listView.selectListView.update({
            items: [],
            infoMessage: null,
            loadingMessage: "Loading sessions...",
            emptyMessage: "No sessions available"
          });
        }
      }

      try {
        yield* (function* () {
          if (!specModels) {
            specModels = yield _jupyterlabServices.Kernel.getSpecs(serverSettings);
          }

          var kernelSpecs = _lodash2["default"].filter(specModels.kernelspecs, function (spec) {
            return _this3._kernelSpecFilter(spec);
          });

          var kernelNames = _lodash2["default"].map(kernelSpecs, function (specModel) {
            return specModel.name;
          });

          try {
            var sessionModels = yield _jupyterlabServices.Session.listRunning(serverSettings);
            sessionModels = sessionModels.filter(function (model) {
              var name = model.kernel ? model.kernel.name : null;
              return name ? kernelNames.includes(name) : true;
            });
            var items = sessionModels.map(function (model) {
              var name = undefined;
              if (model.notebook && model.notebook.path) {
                name = (0, _tildify2["default"])(model.notebook.path);
              } else {
                name = "Session " + model.id;
              }
              return { name: name, model: model, options: serverSettings };
            });
            items.unshift({
              name: "[new session]",
              model: null,
              options: serverSettings,
              kernelSpecs: kernelSpecs
            });
            _this3.listView.onConfirmed = _this3.onSession.bind(_this3, gatewayInfo.name);
            yield _this3.listView.selectListView.update({
              items: items,
              loadingMessage: null
            });
          } catch (error) {
            if (!error.xhr || error.xhr.status !== 403) throw error;
            // Gateways offer the option of never listing sessions, for security
            // reasons.
            // Assume this is the case and proceed to creating a new session.
            _this3.onSession(gatewayInfo.name, {
              name: "[new session]",
              model: null,
              options: serverSettings,
              kernelSpecs: kernelSpecs
            });
          }
        })();
      } catch (e) {
        atom.notifications.addError("Connection to gateway failed");
        this.listView.cancel();
      }
    })
  }, {
    key: "onSession",
    value: _asyncToGenerator(function* (gatewayName, sessionInfo) {
      var _this4 = this;

      if (!sessionInfo.model) {
        if (!sessionInfo.name) {
          yield this.listView.selectListView.update({
            items: [],
            errorMessage: "This gateway does not support listing sessions",
            loadingMessage: null,
            infoMessage: null
          });
        }
        var items = _lodash2["default"].map(sessionInfo.kernelSpecs, function (spec) {
          var options = {
            serverSettings: sessionInfo.options,
            kernelName: spec.name,
            path: _this4._path
          };
          return {
            name: spec.display_name,
            options: options
          };
        });

        this.listView.onConfirmed = this.startSession.bind(this, gatewayName);
        yield this.listView.selectListView.update({
          items: items,
          emptyMessage: "No kernel specs available",
          infoMessage: "Select a session",
          loadingMessage: null
        });
      } else {
        this.onSessionChosen(gatewayName, (yield _jupyterlabServices.Session.connectTo(sessionInfo.model.id, sessionInfo.options)));
      }
    })
  }, {
    key: "startSession",
    value: function startSession(gatewayName, sessionInfo) {
      _jupyterlabServices.Session.startNew(sessionInfo.options).then(this.onSessionChosen.bind(this, gatewayName));
    }
  }, {
    key: "onSessionChosen",
    value: _asyncToGenerator(function* (gatewayName, session) {
      this.listView.cancel();
      var kernelSpec = yield session.kernel.getSpec();
      if (!_store2["default"].grammar) return;

      var kernel = new _wsKernel2["default"](gatewayName, kernelSpec, _store2["default"].grammar, session);
      this._onChosen(kernel);
    })
  }]);

  return WSKernelPicker;
})();

exports["default"] = WSKernelPicker;
module.exports = exports["default"];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9ldmFuaGVuZHJpeDEvLmF0b20vcGFja2FnZXMvSHlkcm9nZW4vbGliL3dzLWtlcm5lbC1waWNrZXIuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7OzhCQUUyQixrQkFBa0I7Ozs7c0JBQy9CLFFBQVE7Ozs7dUJBQ0YsU0FBUzs7OztzQkFDZCxTQUFTOzs7O2tCQUNULElBQUk7Ozs7OEJBQ0gsZ0JBQWdCOzs7O21CQUNaLEtBQUs7O2tDQUN5QixzQkFBc0I7O3NCQUVyRCxVQUFVOzs7O3dCQUNSLGFBQWE7Ozs7eUJBQ1osY0FBYzs7OztxQkFDbEIsU0FBUzs7OztJQUVyQixjQUFjO0FBT1AsV0FQUCxjQUFjLEdBT0o7OzswQkFQVixjQUFjOztTQUNsQixXQUFXLEdBQWMsSUFBSTtTQUM3QixXQUFXLEdBQWMsSUFBSTs7QUFNM0IsUUFBSSxDQUFDLHdCQUF3QixHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUM7QUFDdkQsUUFBSSxDQUFDLGNBQWMsR0FBRyxnQ0FBbUI7QUFDdkMsb0JBQWMsRUFBRSxDQUFDLGFBQWEsQ0FBQztBQUMvQixXQUFLLEVBQUUsRUFBRTtBQUNULHNCQUFnQixFQUFFLDBCQUFBLElBQUk7ZUFBSSxJQUFJLENBQUMsSUFBSTtPQUFBO0FBQ25DLG9CQUFjLEVBQUUsd0JBQUEsSUFBSSxFQUFJO0FBQ3RCLFlBQU0sT0FBTyxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDN0MsZUFBTyxDQUFDLFdBQVcsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDO0FBQ2hDLGVBQU8sT0FBTyxDQUFDO09BQ2hCO0FBQ0QseUJBQW1CLEVBQUUsNkJBQUEsSUFBSSxFQUFJO0FBQzNCLFlBQUksTUFBSyxXQUFXLEVBQUUsTUFBSyxXQUFXLENBQUMsSUFBSSxDQUFDLENBQUM7T0FDOUM7QUFDRCx3QkFBa0IsRUFBRSw4QkFBTTtBQUN4QixjQUFLLE1BQU0sRUFBRSxDQUFDO0FBQ2QsWUFBSSxNQUFL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LFdBQVcsQ0FBQyxPQUFPLENBQUMsQ0FBQyxJQUFJLENBQ3hDLElBQUksQ0FBQyxlQUFlLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxXQUFXLENBQUMsQ0FDN0MsQ0FBQztLQUNIOzs7NkJBRW9CLFdBQUMsV0FBbUIsRUFBRSxPQUFZLEVBQUU7QUFDdkQsVUFBSSxDQUFDLFFBQVEsQ0FBQyxNQUFNLEVBQUUsQ0FBQztBQUN2QixVQUFNLFVBQVUsR0FBRyxNQUFNLE9BQU8sQ0FBQyxNQUFNLENBQUMsT0FBTyxFQUFFLENBQUM7QUFDbEQsVUFBSSxDQUFDLG1CQUFNLE9BQU8sRUFBRSxPQUFPOztBQUUzQixVQUFNLE1BQU0sR0FBRywwQkFDYixXQUFXLEVBQ1gsVUFBVSxFQUNWLG1CQUFNLE9BQU8sRUFDYixPQUFPLENBQ1IsQ0FBQztBQUNGLFVBQUksQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLENBQUM7S0FDeEI7OztTQWxUa0IsY0FBYzs7O3FCQUFkLGNBQWMiLCJmaWxlIjoiL1VzZXJzL2V2YW5oZW5kcml4MS8uYXRvbS9wYWNrYWdlcy9IeWRyb2dlbi9saWIvd3Mta2VybmVsLXBpY2tlci5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qIEBmbG93ICovXG5cbmltcG9ydCBTZWxlY3RMaXN0VmlldyBmcm9tIFwiYXRvbS1zZWxlY3QtbGlzdFwiO1xuaW1wb3J0IF8gZnJvbSBcImxvZGFzaFwiO1xuaW1wb3J0IHRpbGRpZnkgZnJvbSBcInRpbGRpZnlcIjtcbmltcG9ydCB2NCBmcm9tIFwidXVpZC92NFwiO1xuaW1wb3J0IHdzIGZyb20gXCJ3c1wiO1xuaW1wb3J0IHhociBmcm9tIFwieG1saHR0cHJlcXVlc3RcIjtcbmltcG9ydCB7IFVSTCB9IGZyb20gXCJ1cmxcIjtcbmltcG9ydCB7IEtlcm5lbCwgU2Vzc2lvbiwgU2VydmVyQ29ubmVjdGlvbiB9IGZyb20gXCJAanVweXRlcmxhYi9zZXJ2aWNlc1wiO1xuXG5pbXBvcnQgQ29uZmlnIGZyb20gXCIuL2NvbmZpZ1wiO1xuaW1wb3J0IFdTS2VybmVsIGZyb20gXCIuL3dzLWtlcm5lbFwiO1xuaW1wb3J0IElucHV0VmlldyBmcm9tIFwiLi9pbnB1dC12aWV3XCI7XG5pbXBvcnQgc3RvcmUgZnJvbSBcIi4vc3RvcmVcIjtcblxuY2xhc3MgQ3VzdG9tTGlzdFZpZXcge1xuICBvbkNvbmZpcm1lZDogP0Z1bmN0aW9uID0gbnVsbDtcbiAgb25DYW5jZWxsZWQ6ID9GdW5jdGlvbiA9IG51bGw7XG4gIHByZXZpb3VzbHlGb2N1c2VkRWxlbWVudDogP0hUTUxFbGVtZW50O1xuICBzZWxlY3RMaXN0VmlldzogU2VsZWN0TGlzdFZpZXc7XG4gIHBhbmVsOiA/YXRvbSRQYW5lbDtcblxuICBjb25zdHJ1Y3RvcigpIHtcbiAgICB0aGlzLnByZXZpb3VzbHlGb2N1c2VkRWxlbWVudCA9IGRvY3VtZW50LmFjdGl2ZUVsZW1lbnQ7XG4gICAgdGhpcy5zZWxlY3RMaXN0VmlldyA9IG5ldyBTZWxlY3RMaXN0Vmlldyh7XG4gICAgICBpdGVtc0NsYXNzTGlzdDogW1wibWFyay1hY3RpdmVcIl0sXG4gICAgICBpdGVtczogW10sXG4gICAgICBmaWx0ZXJLZXlGb3JJdGVtOiBpdGVtID0+IGl0ZW0ubmFtZSxcbiAgICAgIGVsZW1lbnRGb3JJdGVtOiBpdGVtID0+IHtcbiAgICAgICAgY29uc3QgZWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJsaVwiKTtcbiAgICAgICAgZWxlbWVudC50ZXh0Q29udGVudCA9IGl0ZW0ubmFtZTtcbiAgICAgICAgcmV0dXJuIGVsZW1lbnQ7XG4gICAgICB9LFxuICAgICAgZGlkQ29uZmlybVNlbGVjdGlvbjogaXRlbSA9PiB7XG4gICAgICAgIGlmICh0aGlzLm9uQ29uZmlybWVkKSB0aGlzLm9uQ29uZmlybWVkKGl0ZW0pO1xuICAgICAgfSxcbiAgICAgIGRpZENhbmNlbFNlbGVjdGlvbjogKCkgPT4ge1xuICAgICAgICB0aGlzLmNhbmNlbCgpO1xuICAgICAgICBpZiAodGhpcy5vbkNhbmNlbGxlZCkgdGhpcy5vbkNhbmNlbGxlZCgpO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgc2hvdygpIHtcbiAgICBpZiAoIXRoaXMucGFuZWwpIHtcbiAgICAgIHRoaXMucGFuZWwgPSBhdG9tLndvcmtzcGFjZS5hZGRNb2RhbFBhbmVsKHsgaXRlbTogdGhpcy5zZWxlY3RMaXN0VmlldyB9KTtcbiAgICB9XG4gICAgdGhpcy5wYW5lbC5zaG93KCk7XG4gICAgdGhpcy5zZWxlY3RMaXN0Vmlldy5mb2N1cygpO1xuICB9XG5cbiAgZGVzdHJveSgpIHtcbiAgICB0aGlzLmNhbmNlbCgpO1xuICAgIHJldHVybiB0aGlzLnNlbGVjdExpc3RWaWV3LmRlc3Ryb3koKTtcbiAgfVxuXG4gIGNhbmNlbCgpIHtcbiAgICBpZiAodGhpcy5wYW5lbCAhPSBudWxsKSB7XG4gICAgICB0aGlzLnBhbmVsLmRlc3Ryb3koKTtcbiAgICB9XG4gICAgdGhpcy5wYW5lbCA9IG51bGw7XG4gICAgaWYgKHRoaXMucHJldmlvdXNseUZvY3VzZWRFbGVtZW50KSB7XG4gICAgICB0aGlzLnByZXZpb3VzbHlGb2N1c2VkRWxlbWVudC5mb2N1cygpO1xuICAgICAgdGhpcy5wcmV2aW91c2x5Rm9jdXNlZEVsZW1lbnQgPSBudWxsO1xuICAgIH1cbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBXU0tlcm5lbFBpY2tlciB7XG4gIF9vbkNob3NlbjogKGtlcm5lbDogS2VybmVsKSA9PiB2b2lkO1xuICBfa2VybmVsU3BlY0ZpbHRlcjogKGtlcm5lbFNwZWM6IEtlcm5lbHNwZWMpID0+IGJvb2xlYW47XG4gIF9wYXRoOiBzdHJpbmc7XG4gIGxpc3RWaWV3OiBDdXN0b21MaXN0VmlldztcblxuICBjb25zdHJ1Y3RvcihvbkNob3NlbjogKGtlcm5lbDogS2VybmVsKSA9PiB2b2lkKSB7XG4gICAgdGhpcy5fb25DaG9zZW4gPSBvbkNob3NlbjtcbiAgICB0aGlzLmxpc3RWaWV3ID0gbmV3IEN1c3RvbUxpc3RWaWV3KCk7XG4gIH1cblxuICBhc3luYyB0b2dnbGUoX2tlcm5lbFNwZWNGaWx0ZXI6IChrZXJuZWxTcGVjOiBLZXJuZWxzcGVjKSA9PiBib29sZWFuKSB7XG4gICAgdGhpcy5saXN0Vmlldy5wcmV2aW91c2x5Rm9jdXNlZEVsZW1lbnQgPSBkb2N1bWVudC5hY3RpdmVFbGVtZW50O1xuICAgIHRoaXMuX2tlcm5lbFNwZWNGaWx0ZXIgPSBfa2VybmVsU3BlY0ZpbHRlcjtcbiAgICBjb25zdCBnYXRld2F5cyA9IENvbmZpZy5nZXRKc29uKFwiZ2F0ZXdheXNcIikgfHwgW107XG4gICAgaWYgKF8uaXNFbXB0eShnYXRld2F5cykpIHtcbiAgICAgIGF0b20ubm90aWZpY2F0aW9ucy5hZGRFcnJvcihcIk5vIHJlbW90ZSBrZXJuZWwgZ2F0ZXdheXMgYXZhaWxhYmxlXCIsIHtcbiAgICAgICAgZGVzY3JpcHRpb246XG4gICAgICAgICAgXCJVc2UgdGhlIEh5ZHJvZ2VuIHBhY2thZ2Ugc2V0dGluZ3MgdG8gc3BlY2lmeSB0aGUgbGlzdCBvZiByZW1vdGUgc2VydmVycy4gSHlkcm9nZW4gY2FuIHVzZSByZW1vdGUga2VybmVscyBvbiBlaXRoZXIgYSBKdXB5dGVyIEtlcm5lbCBHYXRld2F5IG9yIEp1cHl0ZXIgbm90ZWJvb2sgc2VydmVyLlwiXG4gICAgICB9KTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB0aGlzLl9wYXRoID0gYCR7c3RvcmUuZmlsZVBhdGggfHwgXCJ1bnNhdmVkXCJ9LSR7djQoKX1gO1xuXG4gICAgdGhpcy5saXN0Vmlldy5vbkNvbmZpcm1lZCA9IHRoaXMub25HYXRld2F5LmJpbmQodGhpcyk7XG5cbiAgICBhd2FpdCB0aGlzLmxpc3RWaWV3LnNlbGVjdExpc3RWaWV3LnVwZGF0ZSh7XG4gICAgICBpdGVtczogZ2F0ZXdheXMsXG4gICAgICBpbmZvTWVzc2FnZTogXCJTZWxlY3QgYSBnYXRld2F5XCIsXG4gICAgICBlbXB0eU1lc3NhZ2U6IFwiTm8gZ2F0ZXdheXMgYXZhaWxhYmxlXCIsXG4gICAgICBsb2FkaW5nTWVzc2FnZTogbnVsbFxuICAgIH0pO1xuXG4gICAgdGhpcy5saXN0Vmlldy5zaG93KCk7XG4gIH1cblxuICBhc3luYyBwcm9tcHRGb3JUZXh0KHByb21wdDogc3RyaW5nKSB7XG4gICAgY29uc3QgcHJldmlvdXNseUZvY3VzZWRFbGVtZW50ID0gdGhpcy5saXN0Vmlldy5wcmV2aW91c2x5Rm9jdXNlZEVsZW1lbnQ7XG4gICAgdGhpcy5saXN0Vmlldy5jYW5jZWwoKTtcblxuICAgIGNvbnN0IGlucHV0UHJvbWlzZSA9IG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgIGNvbnN0IGlucHV0VmlldyA9IG5ldyBJbnB1dFZpZXcoeyBwcm9tcHQgfSwgcmVzb2x2ZSk7XG4gICAgICBhdG9tLmNvbW1hbmRzLmFkZChpbnB1dFZpZXcuZWxlbWVudCwge1xuICAgICAgICBcImNvcmU6Y2FuY2VsXCI6ICgpID0+IHtcbiAgICAgICAgICBpbnB1dFZpZXcuY2xvc2UoKTtcbiAgICAgICAgICByZWplY3QoKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICBpbnB1dFZpZXcuYXR0YWNoKCk7XG4gICAgfSk7XG5cbiAgICBsZXQgcmVzcG9uc2U7XG4gICAgdHJ5IHtcbiAgICAgIHJlc3BvbnNlID0gYXdhaXQgaW5wdXRQcm9taXNlO1xuICAgICAgaWYgKHJlc3BvbnNlID09PSBcIlwiKSB7XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgICAgfVxuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIC8vIEFzc3VtZSB0aGF0IG5vIHJlc3BvbnNlIHRvIHRoZSBwcm9tcHQgd2lsbCBjYW5jZWwgdGhlIGVudGlyZSBmbG93LCBzb1xuICAgIC8vIG9ubHkgcmVzdG9yZSBsaXN0VmlldyBpZiBhIHJlc3BvbnNlIHdhcyByZWNlaXZlZFxuICAgIHRoaXMubGlzdFZpZXcuc2hvdygpO1xuICAgIHRoaXMubGlzdFZpZXcucHJldmlvdXNseUZvY3VzZWRFbGVtZW50ID0gcHJldmlvdXNseUZvY3VzZWRFbGVtZW50O1xuICAgIHJldHVybiByZXNwb25zZTtcbiAgfVxuXG4gIGFzeW5jIHByb21wdEZvckNvb2tpZShvcHRpb25zOiBhbnkpIHtcbiAgICBjb25zdCBjb29raWUgPSBhd2FpdCB0aGlzLnByb21wdEZvclRleHQoXCJDb29raWU6XCIpO1xuICAgIGlmIChjb29raWUgPT09IG51bGwpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICBpZiAob3B0aW9ucy5yZXF1ZXN0SGVhZGVycyA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICBvcHRpb25zLnJlcXVlc3RIZWFkZXJzID0ge307XG4gICAgfVxuICAgIG9wdGlvbnMucmVxdWVzdEhlYWRlcnMuQ29va2llID0gY29va2llO1xuICAgIG9wdGlvbnMueGhyRmFjdG9yeSA9ICgpID0+IHtcbiAgICAgIGxldCByZXF1ZXN0ID0gbmV3IHhoci5YTUxIdHRwUmVxdWVzdCgpO1xuICAgICAgLy8gRGlzYWJsZSBwcm90ZWN0aW9ucyBhZ2FpbnN0IHNldHRpbmcgdGhlIENvb2tpZSBoZWFkZXJcbiAgICAgIHJlcXVlc3Quc2V0RGlzYWJsZUhlYWRlckNoZWNrKHRydWUpO1xuICAgICAgcmV0dXJuIHJlcXVlc3Q7XG4gICAgfTtcbiAgICBvcHRpb25zLndzRmFjdG9yeSA9ICh1cmwsIHByb3RvY29sKSA9PiB7XG4gICAgICAvLyBBdXRoZW50aWNhdGlvbiByZXF1aXJlcyByZXF1ZXN0cyB0byBhcHBlYXIgdG8gYmUgc2FtZS1vcmlnaW5cbiAgICAgIGxldCBwYXJzZWRVcmwgPSBuZXcgVVJMKHVybCk7XG4gICAgICBpZiAocGFyc2VkVXJsLnByb3RvY29sID09IFwid3NzOlwiKSB7XG4gICAgICAgIHBhcnNlZFVybC5wcm90b2NvbCA9IFwiaHR0cHM6XCI7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBwYXJzZWRVcmwucHJvdG9jb2wgPSBcImh0dHA6XCI7XG4gICAgICB9XG4gICAgICBjb25zdCBoZWFkZXJzID0geyBDb29raWU6IGNvb2tpZSB9O1xuICAgICAgY29uc3Qgb3JpZ2luID0gcGFyc2VkVXJsLm9yaWdpbjtcbiAgICAgIGNvbnN0IGhvc3QgPSBwYXJzZWRVcmwuaG9zdDtcbiAgICAgIHJldHVybiBuZXcgd3ModXJsLCBwcm90b2NvbCwgeyBoZWFkZXJzLCBvcmlnaW4sIGhvc3QgfSk7XG4gICAgfTtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuXG4gIGFzeW5jIHByb21wdEZvclRva2VuKG9wdGlvbnM6IGFueSkge1xuICAgIGNvbnN0IHRva2VuID0gYXdhaXQgdGhpcy5wcm9tcHRGb3JUZXh0KFwiVG9rZW46XCIpO1xuICAgIGlmICh0b2tlbiA9PT0gbnVsbCkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIG9wdGlvbnMudG9rZW4gPSB0b2tlbjtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuXG4gIGFzeW5jIHByb21wdEZvckNyZWRlbnRpYWxzKG9wdGlvbnM6IGFueSkge1xuICAgIGF3YWl0IHRoaXMubGlzdFZpZXcuc2VsZWN0TGlzdFZpZXcudXBkYXRlKHtcbiAgICAgIGl0ZW1zOiBbXG4gICAgICAgIHtcbiAgICAgICAgICBuYW1lOiBcIkF1dGhlbnRpY2F0ZSB3aXRoIGEgdG9rZW5cIixcbiAgICAgICAgICBhY3Rpb246IFwidG9rZW5cIlxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgbmFtZTogXCJBdXRoZW50aWNhdGUgd2l0aCBhIGNvb2tpZVwiLFxuICAgICAgICAgIGFjdGlvbjogXCJjb29raWVcIlxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgbmFtZTogXCJDYW5jZWxcIixcbiAgICAgICAgICBhY3Rpb246IFwiY2FuY2VsXCJcbiAgICAgICAgfVxuICAgICAgXSxcbiAgICAgIGluZm9NZXNzYWdlOlxuICAgICAgICBcIkNvbm5lY3Rpb24gdG8gZ2F0ZXdheSBmYWlsZWQuIFlvdXIgc2V0dGluZ3MgbWF5IGJlIGluY29ycmVjdCwgdGhlIHNlcnZlciBtYXkgYmUgdW5hdmFpbGFibGUsIG9yIHlvdSBtYXkgbGFjayBzdWZmaWNpZW50IHByaXZpbGVnZXMgdG8gY29tcGxldGUgdGhlIGNvbm5lY3Rpb24uXCIsXG4gICAgICBsb2FkaW5nTWVzc2FnZTogbnVsbCxcbiAgICAgIGVtcHR5TWVzc2FnZTogbnVsbFxuICAgIH0pO1xuXG4gICAgY29uc3QgYWN0aW9uID0gYXdhaXQgbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgdGhpcy5saXN0Vmlldy5vbkNvbmZpcm1lZCA9IGl0ZW0gPT4gcmVzb2x2ZShpdGVtLmFjdGlvbik7XG4gICAgICB0aGlzLmxpc3RWaWV3Lm9uQ2FuY2VsbGVkID0gKCkgPT4gcmVzb2x2ZShcImNhbmNlbFwiKTtcbiAgICB9KTtcbiAgICBpZiAoYWN0aW9uID09PSBcInRva2VuXCIpIHtcbiAgICAgIHJldHVybiBhd2FpdCB0aGlzLnByb21wdEZvclRva2VuKG9wdGlvbnMpO1xuICAgIH0gZWxzZSBpZiAoYWN0aW9uID09PSBcImNvb2tpZVwiKSB7XG4gICAgICByZXR1cm4gYXdhaXQgdGhpcy5wcm9tcHRGb3JDb29raWUob3B0aW9ucyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIGFjdGlvbiA9PT0gXCJjYW5jZWxcIlxuICAgICAgdGhpcy5saXN0Vmlldy5jYW5jZWwoKTtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gIH1cblxuICBhc3luYyBvbkdhdGV3YXkoZ2F0ZXdheUluZm86IGFueSkge1xuICAgIHRoaXMubGlzdFZpZXcub25Db25maXJtZWQgPSBudWxsO1xuICAgIGF3YWl0IHRoaXMubGlzdFZpZXcuc2VsZWN0TGlzdFZpZXcudXBkYXRlKHtcbiAgICAgIGl0ZW1zOiBbXSxcbiAgICAgIGluZm9NZXNzYWdlOiBudWxsLFxuICAgICAgbG9hZGluZ01lc3NhZ2U6IFwiTG9hZGluZyBzZXNzaW9ucy4uLlwiLFxuICAgICAgZW1wdHlNZXNzYWdlOiBcIk5vIHNlc3Npb25zIGF2YWlsYWJsZVwiXG4gICAgfSk7XG5cbiAgICBjb25zdCBnYXRld2F5T3B0aW9ucyA9IE9iamVjdC5hc3NpZ24oXG4gICAgICB7XG4gICAgICAgIHhockZhY3Rvcnk6ICgpID0+IG5ldyB4aHIuWE1MSHR0cFJlcXVlc3QoKSxcbiAgICAgICAgd3NGYWN0b3J5OiAodXJsLCBwcm90b2NvbCkgPT4gbmV3IHdzKHVybCwgcHJvdG9jb2wpXG4gICAgICB9LFxuICAgICAgZ2F0ZXdheUluZm8ub3B0aW9uc1xuICAgICk7XG5cbiAgICBsZXQgc2VydmVyU2V0dGluZ3MgPSBTZXJ2ZXJDb25uZWN0aW9uLm1ha2VTZXR0aW5ncyhnYXRld2F5T3B0aW9ucyk7XG4gICAgbGV0IHNwZWNNb2RlbHM7XG5cbiAgICB0cnkge1xuICAgICAgc3BlY01vZGVscyA9IGF3YWl0IEtlcm5lbC5nZXRTcGVjcyhzZXJ2ZXJTZXR0aW5ncyk7XG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgIC8vIFRoZSBlcnJvciB0eXBlcyB5b3UgZ2V0IGJhY2sgYXQgdGhpcyBzdGFnZSBhcmUgZmFpcmx5IG9wYXF1ZS4gSW5cbiAgICAgIC8vIHBhcnRpY3VsYXIsIGhhdmluZyBpbnZhbGlkIGNyZWRlbnRpYWxzIHR5cGljYWxseSB0cmlnZ2VycyBFQ09OTlJFRlVTRURcbiAgICAgIC8vIHJhdGhlciB0aGFuIDQwMyBGb3JiaWRkZW4uIFRoaXMgZG9lcyBzb21lIGJhc2ljIGNoZWNrcyBhbmQgdGhlbiBhc3N1bWVzXG4gICAgICAvLyB0aGF0IGFsbCByZW1haW5pbmcgZXJyb3IgdHlwZXMgY291bGQgYmUgY2F1c2VkIGJ5IGludmFsaWQgY3JlZGVudGlhbHMuXG4gICAgICBpZiAoIWVycm9yLnhociB8fCAhZXJyb3IueGhyLnJlc3BvbnNlVGV4dCkge1xuICAgICAgICB0aHJvdyBlcnJvcjtcbiAgICAgIH0gZWxzZSBpZiAoZXJyb3IueGhyLnJlc3BvbnNlVGV4dC5pbmNsdWRlcyhcIkVUSU1FRE9VVFwiKSkge1xuICAgICAgICBhdG9tLm5vdGlmaWNhdGlvbnMuYWRkRXJyb3IoXCJDb25uZWN0aW9uIHRvIGdhdGV3YXkgZmFpbGVkXCIpO1xuICAgICAgICB0aGlzLmxpc3RWaWV3LmNhbmNlbCgpO1xuICAgICAgICByZXR1cm47XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjb25zdCBwcm9tcHRTdWNjZWVkZWQgPSBhd2FpdCB0aGlzLnByb21wdEZvckNyZWRlbnRpYWxzKGdhdGV3YXlPcHRpb25zKTtcbiAgICAgICAgaWYgKCFwcm9tcHRTdWNjZWVkZWQpIHtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgc2VydmVyU2V0dGluZ3MgPSBTZXJ2ZXJDb25uZWN0aW9uLm1ha2VTZXR0aW5ncyhnYXRld2F5T3B0aW9ucyk7XG4gICAgICAgIGF3YWl0IHRoaXMubGlzdFZpZXcuc2VsZWN0TGlzdFZpZXcudXBkYXRlKHtcbiAgICAgICAgICBpdGVtczogW10sXG4gICAgICAgICAgaW5mb01lc3NhZ2U6IG51bGwsXG4gICAgICAgICAgbG9hZGluZ01lc3NhZ2U6IFwiTG9hZGluZyBzZXNzaW9ucy4uLlwiLFxuICAgICAgICAgIGVtcHR5TWVzc2FnZTogXCJObyBzZXNzaW9ucyBhdmFpbGFibGVcIlxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICB0cnkge1xuICAgICAgaWYgKCFzcGVjTW9kZWxzKSB7XG4gICAgICAgIHNwZWNNb2RlbHMgPSBhd2FpdCBLZXJuZWwuZ2V0U3BlY3Moc2VydmVyU2V0dGluZ3MpO1xuICAgICAgfVxuXG4gICAgICBjb25zdCBrZXJuZWxTcGVjcyA9IF8uZmlsdGVyKHNwZWNNb2RlbHMua2VybmVsc3BlY3MsIHNwZWMgPT5cbiAgICAgICAgdGhpcy5fa2VybmVsU3BlY0ZpbHRlcihzcGVjKVxuICAgICAgKTtcblxuICAgICAgY29uc3Qga2VybmVsTmFtZXMgPSBfLm1hcChrZXJuZWxTcGVjcywgc3BlY01vZGVsID0+IHNwZWNNb2RlbC5uYW1lKTtcblxuICAgICAgdHJ5IHtcbiAgICAgICAgbGV0IHNlc3Npb25Nb2RlbHMgPSBhd2FpdCBTZXNzaW9uLmxpc3RSdW5uaW5nKHNlcnZlclNldHRpbmdzKTtcbiAgICAgICAgc2Vzc2lvbk1vZGVscyA9IHNlc3Npb25Nb2RlbHMuZmlsdGVyKG1vZGVsID0+IHtcbiAgICAgICAgICBjb25zdCBuYW1lID0gbW9kZWwua2VybmVsID8gbW9kZWwua2VybmVsLm5hbWUgOiBudWxsO1xuICAgICAgICAgIHJldHVybiBuYW1lID8ga2VybmVsTmFtZXMuaW5jbHVkZXMobmFtZSkgOiB0cnVlO1xuICAgICAgICB9KTtcbiAgICAgICAgY29uc3QgaXRlbXMgPSBzZXNzaW9uTW9kZWxzLm1hcChtb2RlbCA9PiB7XG4gICAgICAgICAgbGV0IG5hbWU7XG4gICAgICAgICAgaWYgKG1vZGVsLm5vdGVib29rICYmIG1vZGVsLm5vdGVib29rLnBhdGgpIHtcbiAgICAgICAgICAgIG5hbWUgPSB0aWxkaWZ5KG1vZGVsLm5vdGVib29rLnBhdGgpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBuYW1lID0gYFNlc3Npb24gJHttb2RlbC5pZH1gO1xuICAgICAgICAgIH1cbiAgICAgICAgICByZXR1cm4geyBuYW1lLCBtb2RlbCwgb3B0aW9uczogc2VydmVyU2V0dGluZ3MgfTtcbiAgICAgICAgfSk7XG4gICAgICAgIGl0ZW1zLnVuc2hpZnQoe1xuICAgICAgICAgIG5hbWU6IFwiW25ldyBzZXNzaW9uXVwiLFxuICAgICAgICAgIG1vZGVsOiBudWxsLFxuICAgICAgICAgIG9wdGlvbnM6IHNlcnZlclNldHRpbmdzLFxuICAgICAgICAgIGtlcm5lbFNwZWNzXG4gICAgICAgIH0pO1xuICAgICAgICB0aGlzLmxpc3RWaWV3Lm9uQ29uZmlybWVkID0gdGhpcy5vblNlc3Npb24uYmluZCh0aGlzLCBnYXRld2F5SW5mby5uYW1lKTtcbiAgICAgICAgYXdhaXQgdGhpcy5saXN0Vmlldy5zZWxlY3RMaXN0Vmlldy51cGRhdGUoe1xuICAgICAgICAgIGl0ZW1zOiBpdGVtcyxcbiAgICAgICAgICBsb2FkaW5nTWVzc2FnZTogbnVsbFxuICAgICAgICB9KTtcbiAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgIGlmICghZXJyb3IueGhyIHx8IGVycm9yLnhoci5zdGF0dXMgIT09IDQwMykgdGhyb3cgZXJyb3I7XG4gICAgICAgIC8vIEdhdGV3YXlzIG9mZmVyIHRoZSBvcHRpb24gb2YgbmV2ZXIgbGlzdGluZyBzZXNzaW9ucywgZm9yIHNlY3VyaXR5XG4gICAgICAgIC8vIHJlYXNvbnMuXG4gICAgICAgIC8vIEFzc3VtZSB0aGlzIGlzIHRoZSBjYXNlIGFuZCBwcm9jZWVkIHRvIGNyZWF0aW5nIGEgbmV3IHNlc3Npb24uXG4gICAgICAgIHRoaXMub25TZXNzaW9uKGdhdGV3YXlJbmZvLm5hbWUsIHtcbiAgICAgICAgICBuYW1lOiBcIltuZXcgc2Vzc2lvbl1cIixcbiAgICAgICAgICBtb2RlbDogbnVsbCxcbiAgICAgICAgICBvcHRpb25zOiBzZXJ2ZXJTZXR0aW5ncyxcbiAgICAgICAgICBrZXJuZWxTcGVjc1xuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICBhdG9tLm5vdGlmaWNhdGlvbnMuYWRkRXJyb3IoXCJDb25uZWN0aW9uIHRvIGdhdGV3YXkgZmFpbGVkXCIpO1xuICAgICAgdGhpcy5saXN0Vmlldy5jYW5jZWwoKTtcbiAgICB9XG4gIH1cblxuICBhc3luYyBvblNlc3Npb24oZ2F0ZXdheU5hbWU6IHN0cmluZywgc2Vzc2lvbkluZm86IGFueSkge1xuICAgIGlmICghc2Vzc2lvbkluZm8ubW9kZWwpIHtcbiAgICAgIGlmICghc2Vzc2lvbkluZm8ubmFtZSkge1xuICAgICAgICBhd2FpdCB0aGlzLmxpc3RWaWV3LnNlbGVjdExpc3RWaWV3LnVwZGF0ZSh7XG4gICAgICAgICAgaXRlbXM6IFtdLFxuICAgICAgICAgIGVycm9yTWVzc2FnZTogXCJUaGlzIGdhdGV3YXkgZG9lcyBub3Qgc3VwcG9ydCBsaXN0aW5nIHNlc3Npb25zXCIsXG4gICAgICAgICAgbG9hZGluZ01lc3NhZ2U6IG51bGwsXG4gICAgICAgICAgaW5mb01lc3NhZ2U6IG51bGxcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgICBjb25zdCBpdGVtcyA9IF8ubWFwKHNlc3Npb25JbmZvLmtlcm5lbFNwZWNzLCBzcGVjID0+IHtcbiAgICAgICAgY29uc3Qgb3B0aW9ucyA9IHtcbiAgICAgICAgICBzZXJ2ZXJTZXR0aW5nczogc2Vzc2lvbkluZm8ub3B0aW9ucyxcbiAgICAgICAgICBrZXJuZWxOYW1lOiBzcGVjLm5hbWUsXG4gICAgICAgICAgcGF0aDogdGhpcy5fcGF0aFxuICAgICAgICB9O1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIG5hbWU6IHNwZWMuZGlzcGxheV9uYW1lLFxuICAgICAgICAgIG9wdGlvbnNcbiAgICAgICAgfTtcbiAgICAgIH0pO1xuXG4gICAgICB0aGlzLmxpc3RWaWV3Lm9uQ29uZmlybWVkID0gdGhpcy5zdGFydFNlc3Npb24uYmluZCh0aGlzLCBnYXRld2F5TmFtZSk7XG4gICAgICBhd2FpdCB0aGlzLmxpc3RWaWV3LnNlbGVjdExpc3RWaWV3LnVwZGF0ZSh7XG4gICAgICAgIGl0ZW1zOiBpdGVtcyxcbiAgICAgICAgZW1wdHlNZXNzYWdlOiBcIk5vIGtlcm5lbCBzcGVjcyBhdmFpbGFibGVcIixcbiAgICAgICAgaW5mb01lc3NhZ2U6IFwiU2VsZWN0IGEgc2Vzc2lvblwiLFxuICAgICAgICBsb2FkaW5nTWVzc2FnZTogbnVsbFxuICAgICAgfSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMub25TZXNzaW9uQ2hvc2VuKFxuICAgICAgICBnYXRld2F5TmFtZSxcbiAgICAgICAgYXdhaXQgU2Vzc2lvbi5jb25uZWN0VG8oc2Vzc2lvbkluZm8ubW9kZWwuaWQsIHNlc3Npb25JbmZvLm9wdGlvbnMpXG4gICAgICApO1xuICAgIH1cbiAgfVxuXG4gIHN0YXJ0U2Vzc2lvbihnYXRld2F5TmFtZTogc3RyaW5nLCBzZXNzaW9uSW5mbzogYW55KSB7XG4gICAgU2Vzc2lvbi5zdGFydE5ldyhzZXNzaW9uSW5mby5vcHRpb25zKS50aGVuKFxuICAgICAgdGhpcy5vblNlc3Npb25DaG9zZW4uYmluZCh0aGlzLCBnYXRld2F5TmFtZSlcbiAgICApO1xuICB9XG5cbiAgYXN5bmMgb25TZXNzaW9uQ2hvc2VuKGdhdGV3YXlOYW1lOiBzdHJpbmcsIHNlc3Npb246IGFueSkge1xuICAgIHRoaXMubGlzdFZpZXcuY2FuY2VsKCk7XG4gICAgY29uc3Qga2VybmVsU3BlYyA9IGF3YWl0IHNlc3Npb24ua2VybmVsLmdldFNwZWMoKTtcbiAgICBpZiAoIXN0b3JlLmdyYW1tYXIpIHJldHVybjtcblxuICAgIGNvbnN0IGtlcm5lbCA9IG5ldyBXU0tlcm5lbChcbiAgICAgIGdhdGV3YXlOYW1lLFxuICAgICAga2VybmVsU3BlYyxcbiAgICAgIHN0b3JlLmdyYW1tYXIsXG4gICAgICBzZXNzaW9uXG4gICAgKTtcbiAgICB0aGlzLl9vbkNob3NlbihrZXJuZWwpO1xuICB9XG59XG4iXX0=