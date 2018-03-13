'use babel';

var _bind = Function.prototype.bind;

var _createClass = (function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ('value' in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
    }
  }return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
  };
})();

var _get = function get(_x6, _x7, _x8) {
  var _again = true;_function: while (_again) {
    var object = _x6,
        property = _x7,
        receiver = _x8;_again = false;if (object === null) object = Function.prototype;var desc = Object.getOwnPropertyDescriptor(object, property);if (desc === undefined) {
      var parent = Object.getPrototypeOf(object);if (parent === null) {
        return undefined;
      } else {
        _x6 = parent;_x7 = property;_x8 = receiver;_again = true;desc = parent = undefined;continue _function;
      }
    } else if ('value' in desc) {
      return desc.value;
    } else {
      var getter = desc.get;if (getter === undefined) {
        return undefined;
      }return getter.call(receiver);
    }
  }
};

function _toConsumableArray(arr) {
  if (Array.isArray(arr)) {
    for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i];return arr2;
  } else {
    return Array.from(arr);
  }
}

function _asyncToGenerator(fn) {
  return function () {
    var gen = fn.apply(this, arguments);return new Promise(function (resolve, reject) {
      var callNext = step.bind(null, 'next');var callThrow = step.bind(null, 'throw');function step(key, arg) {
        try {
          var info = gen[key](arg);var value = info.value;
        } catch (error) {
          reject(error);return;
        }if (info.done) {
          resolve(value);
        } else {
          Promise.resolve(value).then(callNext, callThrow);
        }
      }callNext();
    });
  };
}

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError('Cannot call a class as a function');
  }
}

function _inherits(subClass, superClass) {
  if (typeof superClass !== 'function' && superClass !== null) {
    throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass);
  }subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } });if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
}

var _ = require('underscore-plus');
var url = require('url');
var path = require('path');

var _require = require('event-kit');

var Emitter = _require.Emitter;
var Disposable = _require.Disposable;
var CompositeDisposable = _require.CompositeDisposable;

var fs = require('fs-plus');

var _require2 = require('pathwatcher');

var Directory = _require2.Directory;

var Grim = require('grim');
var DefaultDirectorySearcher = require('./default-directory-searcher');
var Dock = require('./dock');
var Model = require('./model');
var StateStore = require('./state-store');
var TextEditor = require('./text-editor');
var Panel = require('./panel');
var PanelContainer = require('./panel-container');
var Task = require('./task');
var WorkspaceCenter = require('./workspace-center');
var WorkspaceElement = require('./workspace-element');

var STOPPED_CHANGING_ACTIVE_PANE_ITEM_DELAY = 100;
var ALL_LOCATIONS = ['center', 'left', 'right', 'bottom'];

// Essential: Represents the state of the user interface for the entire window.
// An instance of this class is available via the `atom.workspace` global.
//
// Interact with this object to open files, be notified of current and future
// editors, and manipulate panes. To add panels, use {Workspace::addTopPanel}
// and friends.
//
// ## Workspace Items
//
// The term "item" refers to anything that can be displayed
// in a pane within the workspace, either in the {WorkspaceCenter} or in one
// of the three {Dock}s. The workspace expects items to conform to the
// following interface:
//
// ### Required Methods
//
// #### `getTitle()`
//
// Returns a {String} containing the title of the item to display on its
// associated tab.
//
// ### Optional Methods
//
// #### `getElement()`
//
// If your item already *is* a DOM element, you do not need to implement this
// method. Otherwise it should return the element you want to display to
// represent this item.
//
// #### `destroy()`
//
// Destroys the item. This will be called when the item is removed from its
// parent pane.
//
// #### `onDidDestroy(callback)`
//
// Called by the workspace so it can be notified when the item is destroyed.
// Must return a {Disposable}.
//
// #### `serialize()`
//
// Serialize the state of the item. Must return an object that can be passed to
// `JSON.stringify`. The state should include a field called `deserializer`,
// which names a deserializer declared in your `package.json`. This method is
// invoked on items when serializing the workspace so they can be restored to
// the same location later.
//
// #### `getURI()`
//
// Returns the URI associated with the item.
//
// #### `getLongTitle()`
//
// Returns a {String} containing a longer version of the title to display in
// places like the window title or on tabs their short titles are ambiguous.
//
// #### `onDidChangeTitle`
//
// Called by the workspace so it can be notified when the item's title changes.
// Must return a {Disposable}.
//
// #### `getIconName()`
//
// Return a {String} with the name of an icon. If this method is defined and
// returns a string, the item's tab element will be rendered with the `icon` and
// `icon-${iconName}` CSS classes.
//
// ### `onDidChangeIcon(callback)`
//
// Called by the workspace so it can be notified when the item's icon changes.
// Must return a {Disposable}.
//
// #### `getDefaultLocation()`
//
// Tells the workspace where your item should be opened in absence of a user
// override. Items can appear in the center or in a dock on the left, right, or
// bottom of the workspace.
//
// Returns a {String} with one of the following values: `'center'`, `'left'`,
// `'right'`, `'bottom'`. If this method is not defined, `'center'` is the
// default.
//
// #### `getAllowedLocations()`
//
// Tells the workspace where this item can be moved. Returns an {Array} of one
// or more of the following values: `'center'`, `'left'`, `'right'`, or
// `'bottom'`.
//
// #### `isPermanentDockItem()`
//
// Tells the workspace whether or not this item can be closed by the user by
// clicking an `x` on its tab. Use of this feature is discouraged unless there's
// a very good reason not to allow users to close your item. Items can be made
// permanent *only* when they are contained in docks. Center pane items can
// always be removed. Note that it is currently still possible to close dock
// items via the `Close Pane` option in the context menu and via Atom APIs, so
// you should still be prepared to handle your dock items being destroyed by the
// user even if you implement this method.
//
// #### `save()`
//
// Saves the item.
//
// #### `saveAs(path)`
//
// Saves the item to the specified path.
//
// #### `getPath()`
//
// Returns the local path associated with this item. This is only used to set
// the initial location of the "save as" dialog.
//
// #### `isModified()`
//
// Returns whether or not the item is modified to reflect modification in the
// UI.
//
// #### `onDidChangeModified()`
//
// Called by the workspace so it can be notified when item's modified status
// changes. Must return a {Disposable}.
//
// #### `copy()`
//
// Create a copy of the item. If defined, the workspace will call this method to
// duplicate the item when splitting panes via certain split commands.
//
// #### `getPreferredHeight()`
//
// If this item is displayed in the bottom {Dock}, called by the workspace when
// initially displaying the dock to set its height. Once the dock has been
// resized by the user, their height will override this value.
//
// Returns a {Number}.
//
// #### `getPreferredWidth()`
//
// If this item is displayed in the left or right {Dock}, called by the
// workspace when initially displaying the dock to set its width. Once the dock
// has been resized by the user, their width will override this value.
//
// Returns a {Number}.
//
// #### `onDidTerminatePendingState(callback)`
//
// If the workspace is configured to use *pending pane items*, the workspace
// will subscribe to this method to terminate the pending state of the item.
// Must return a {Disposable}.
//
// #### `shouldPromptToSave()`
//
// This method indicates whether Atom should prompt the user to save this item
// when the user closes or reloads the window. Returns a boolean.
module.exports = (function (_Model) {
  _inherits(Workspace, _Model);

  function Workspace(params) {
    _classCallCheck(this, Workspace);

    _get(Object.getPrototypeOf(Workspace.prototype), 'constructor', this).apply(this, arguments);

    this.updateWindowTitle = this.updateWindowTitle.bind(this);
    this.updateDocumentEdited = this.updateDocumentEdited.bind(this);
    this.didDestroyPaneItem = this.didDestroyPaneItem.bind(this);
    this.didChangeActivePaneOnPaneContainer = this.didChangeActivePaneOnPaneContainer.bind(this);
    this.didChangeActivePaneItemOnPaneContainer = this.didChangeActivePaneItemOnPaneContainer.bind(this);
    this.didActivatePaneContainer = this.didActivatePaneContainer.bind(this);

    this.enablePersistence = params.enablePersistence;
    this.packageManager = params.packageManager;
    this.config = params.config;
    this.project = params.project;
    this.notificationManager = params.notificationManager;
    this.viewRegistry = params.viewRegistry;
    this.grammarRegistry = params.grammarRegistry;
    this.applicationDelegate = params.applicationDelegate;
    this.assert = params.assert;
    this.deserializerManager = params.deserializerManager;
    this.textEditorRegistry = params.textEditorRegistry;
    this.styleManager = params.styleManager;
    this.draggingItem = false;
    this.itemLocationStore = new StateStore('AtomPreviousItemLocations', 1);

    this.emitter = new Emitter();
    this.openers = [];
    this.destroyedItemURIs = [];
    this.stoppedChangingActivePaneItemTimeout = null;

    this.defaultDirectorySearcher = new DefaultDirectorySearcher();
    this.consumeServices(this.packageManager);

    this.paneContainers = {
      center: this.createCenter(),
      left: this.createDock('left'),
      right: this.createDock('right'),
      bottom: this.createDock('bottom')
    };
    this.activePaneContainer = this.paneContainers.center;
    this.hasActiveTextEditor = false;

    this.panelContainers = {
      top: new PanelContainer({ viewRegistry: this.viewRegistry, location: 'top' }),
      left: new PanelContainer({ viewRegistry: this.viewRegistry, location: 'left', dock: this.paneContainers.left }),
      right: new PanelContainer({ viewRegistry: this.viewRegistry, location: 'right', dock: this.paneContainers.right }),
      bottom: new PanelContainer({ viewRegistry: this.viewRegistry, location: 'bottom', dock: this.paneContainers.bottom }),
      header: new PanelContainer({ viewRegistry: this.viewRegistry, location: 'header' }),
      footer: new PanelContainer({ viewRegistry: this.viewRegistry, location: 'footer' }),
      modal: new PanelContainer({ viewRegistry: this.viewRegistry, location: 'modal' })
    };

    this.subscribeToEvents();
  }

  _createClass(Workspace, [{
    key: 'getElement',
    value: function getElement() {
      if (!this.element) {
        this.element = new WorkspaceElement().initialize(this, {
          config: this.config,
          project: this.project,
          viewRegistry: this.viewRegistry,
          styleManager: this.styleManager
        });
      }
      return this.element;
    }
  }, {
    key: 'createCenter',
    value: function createCenter() {
      return new WorkspaceCenter({
        config: this.config,
        applicationDelegate: this.applicationDelegate,
        notificationManager: this.notificationManager,
        deserializerManager: this.deserializerManager,
        viewRegistry: this.viewRegistry,
        didActivate: this.didActivatePaneContainer,
        didChangeActivePane: this.didChangeActivePaneOnPaneContainer,
        didChangeActivePaneItem: this.didChangeActivePaneItemOnPaneContainer,
        didDestroyPaneItem: this.didDestroyPaneItem
      });
    }
  }, {
    key: 'createDock',
    value: function createDock(location) {
      return new Dock({
        location: location,
        config: this.config,
        applicationDelegate: this.applicationDelegate,
        deserializerManager: this.deserializerManager,
        notificationManager: this.notificationManager,
        viewRegistry: this.viewRegistry,
        didActivate: this.didActivatePaneContainer,
        didChangeActivePane: this.didChangeActivePaneOnPaneContainer,
        didChangeActivePaneItem: this.didChangeActivePaneItemOnPaneContainer,
        didDestroyPaneItem: this.didDestroyPaneItem
      });
    }
  }, {
    key: 'reset',
    value: function reset(packageManager) {
      this.packageManager = packageManager;
      this.emitter.dispose();
      this.emitter = new Emitter();

      this.paneContainers.center.destroy();
      this.paneContainers.left.destroy();
      this.paneContainers.right.destroy();
      this.paneContainers.bottom.destroy();

      _.values(this.panelContainers).forEach(function (panelContainer) {
        panelContainer.destroy();
      });

      this.paneContainers = {
        center: this.createCenter(),
        left: this.createDock('left'),
        right: this.createDock('right'),
        bottom: this.createDock('bottom')
      };
      this.activePaneContainer = this.paneContainers.center;
      this.hasActiveTextEditor = false;

      this.panelContainers = {
        top: new PanelContainer({ viewRegistry: this.viewRegistry, location: 'top' }),
        left: new PanelContainer({ viewRegistry: this.viewRegistry, location: 'left', dock: this.paneContainers.left }),
        right: new PanelContainer({ viewRegistry: this.viewRegistry, location: 'right', dock: this.paneContainers.right }),
        bottom: new PanelContainer({ viewRegistry: this.viewRegistry, location: 'bottom', dock: this.paneContainers.bottom }),
        header: new PanelContainer({ viewRegistry: this.viewRegistry, location: 'header' }),
        footer: new PanelContainer({ viewRegistry: this.viewRegistry, location: 'footer' }),
        modal: new PanelContainer({ viewRegistry: this.viewRegistry, location: 'modal' })
      };

      this.originalFontSize = null;
      this.openers = [];
      this.destroyedItemURIs = [];
      this.element = null;
      this.consumeServices(this.packageManager);
    }
  }, {
    key: 'subscribeToEvents',
    value: function subscribeToEvents() {
      this.project.onDidChangePaths(this.updateWindowTitle);
      this.subscribeToFontSize();
      this.subscribeToAddedItems();
      this.subscribeToMovedItems();
      this.subscribeToDockToggling();
    }
  }, {
    key: 'consumeServices',
    value: function consumeServices(_ref) {
      var _this = this;

      var serviceHub = _ref.serviceHub;

      this.directorySearchers = [];
      serviceHub.consume('atom.directory-searcher', '^0.1.0', function (provider) {
        return _this.directorySearchers.unshift(provider);
      });
    }

    // Called by the Serializable mixin during serialization.
  }, {
    key: 'serialize',
    value: function serialize() {
      return {
        deserializer: 'Workspace',
        packagesWithActiveGrammars: this.getPackageNamesWithActiveGrammars(),
        destroyedItemURIs: this.destroyedItemURIs.slice(),
        // Ensure deserializing 1.17 state with pre 1.17 Atom does not error
        // TODO: Remove after 1.17 has been on stable for a while
        paneContainer: { version: 2 },
        paneContainers: {
          center: this.paneContainers.center.serialize(),
          left: this.paneContainers.left.serialize(),
          right: this.paneContainers.right.serialize(),
          bottom: this.paneContainers.bottom.serialize()
        }
      };
    }
  }, {
    key: 'deserialize',
    value: function deserialize(state, deserializerManager) {
      var packagesWithActiveGrammars = state.packagesWithActiveGrammars != null ? state.packagesWithActiveGrammars : [];
      for (var packageName of packagesWithActiveGrammars) {
        var pkg = this.packageManager.getLoadedPackage(packageName);
        if (pkg != null) {
          pkg.loadGrammarsSync();
        }
      }
      if (state.destroyedItemURIs != null) {
        this.destroyedItemURIs = state.destroyedItemURIs;
      }

      if (state.paneContainers) {
        this.paneContainers.center.deserialize(state.paneContainers.center, deserializerManager);
        this.paneContainers.left.deserialize(state.paneContainers.left, deserializerManager);
        this.paneContainers.right.deserialize(state.paneContainers.right, deserializerManager);
        this.paneContainers.bottom.deserialize(state.paneContainers.bottom, deserializerManager);
      } else if (state.paneContainer) {
        // TODO: Remove this fallback once a lot of time has passed since 1.17 was released
        this.paneContainers.center.deserialize(state.paneContainer, deserializerManager);
      }

      this.hasActiveTextEditor = this.getActiveTextEditor() != null;

      this.updateWindowTitle();
    }
  }, {
    key: 'getPackageNamesWithActiveGrammars',
    value: function getPackageNamesWithActiveGrammars() {
      var _this2 = this;

      var packageNames = [];
      var addGrammar = function addGrammar() {
        var _ref2 = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

        var includedGrammarScopes = _ref2.includedGrammarScopes;
        var packageName = _ref2.packageName;

        if (!packageName) {
          return;
        }
        // Prevent cycles
        if (packageNames.indexOf(packageName) !== -1) {
          return;
        }

        packageNames.push(packageName);
        for (var scopeName of includedGrammarScopes != null ? includedGrammarScopes : []) {
          addGrammar(_this2.grammarRegistry.grammarForScopeName(scopeName));
        }
      };

      var editors = this.getTextEditors();
      for (var editor of editors) {
        addGrammar(editor.getGrammar());
      }

      if (editors.length > 0) {
        for (var grammar of this.grammarRegistry.getGrammars()) {
          if (grammar.injectionSelector) {
            addGrammar(grammar);
          }
        }
      }

      return _.uniq(packageNames);
    }
  }, {
    key: 'didActivatePaneContainer',
    value: function didActivatePaneContainer(paneContainer) {
      if (paneContainer !== this.getActivePaneContainer()) {
        this.activePaneContainer = paneContainer;
        this.didChangeActivePaneItem(this.activePaneContainer.getActivePaneItem());
        this.emitter.emit('did-change-active-pane-container', this.activePaneContainer);
        this.emitter.emit('did-change-active-pane', this.activePaneContainer.getActivePane());
        this.emitter.emit('did-change-active-pane-item', this.activePaneContainer.getActivePaneItem());
      }
    }
  }, {
    key: 'didChangeActivePaneOnPaneContainer',
    value: function didChangeActivePaneOnPaneContainer(paneContainer, pane) {
      if (paneContainer === this.getActivePaneContainer()) {
        this.emitter.emit('did-change-active-pane', pane);
      }
    }
  }, {
    key: 'didChangeActivePaneItemOnPaneContainer',
    value: function didChangeActivePaneItemOnPaneContainer(paneContainer, item) {
      if (paneContainer === this.getActivePaneContainer()) {
        this.didChangeActivePaneItem(item);
        this.emitter.emit('did-change-active-pane-item', item);
      }

      if (paneContainer === this.getCenter()) {
        var hadActiveTextEditor = this.hasActiveTextEditor;
        this.hasActiveTextEditor = item instanceof TextEditor;

        if (this.hasActiveTextEditor || hadActiveTextEditor) {
          var itemValue = this.hasActiveTextEditor ? item : undefined;
          this.emitter.emit('did-change-active-text-editor', itemValue);
        }
      }
    }
  }, {
    key: 'didChangeActivePaneItem',
    value: function didChangeActivePaneItem(item) {
      var _this3 = this;

      this.updateWindowTitle();
      this.updateDocumentEdited();
      if (this.activeItemSubscriptions) this.activeItemSubscriptions.dispose();
      this.activeItemSubscriptions = new CompositeDisposable();

      var modifiedSubscription = undefined,
          titleSubscription = undefined;

      if (item != null && typeof item.onDidChangeTitle === 'function') {
        titleSubscription = item.onDidChangeTitle(this.updateWindowTitle);
      } else if (item != null && typeof item.on === 'function') {
        titleSubscription = item.on('title-changed', this.updateWindowTitle);
        if (titleSubscription == null || typeof titleSubscription.dispose !== 'function') {
          titleSubscription = new Disposable(function () {
            item.off('title-changed', _this3.updateWindowTitle);
          });
        }
      }

      if (item != null && typeof item.onDidChangeModified === 'function') {
        modifiedSubscription = item.onDidChangeModified(this.updateDocumentEdited);
      } else if (item != null && typeof item.on === 'function') {
        modifiedSubscription = item.on('modified-status-changed', this.updateDocumentEdited);
        if (modifiedSubscription == null || typeof modifiedSubscription.dispose !== 'function') {
          modifiedSubscription = new Disposable(function () {
            item.off('modified-status-changed', _this3.updateDocumentEdited);
          });
        }
      }

      if (titleSubscription != null) {
        this.activeItemSubscriptions.add(titleSubscription);
      }
      if (modifiedSubscription != null) {
        this.activeItemSubscriptions.add(modifiedSubscription);
      }

      this.cancelStoppedChangingActivePaneItemTimeout();
      this.stoppedChangingActivePaneItemTimeout = setTimeout(function () {
        _this3.stoppedChangingActivePaneItemTimeout = null;
        _this3.emitter.emit('did-stop-changing-active-pane-item', item);
      }, STOPPED_CHANGING_ACTIVE_PANE_ITEM_DELAY);
    }
  }, {
    key: 'cancelStoppedChangingActivePaneItemTimeout',
    value: function cancelStoppedChangingActivePaneItemTimeout() {
      if (this.stoppedChangingActivePaneItemTimeout != null) {
        clearTimeout(this.stoppedChangingActivePaneItemTimeout);
      }
    }
  }, {
    key: 'setDraggingItem',
    value: function setDraggingItem(draggingItem) {
      _.values(this.paneContainers).forEach(function (dock) {
        dock.setDraggingItem(draggingItem);
      });
    }
  }, {
    key: 'subscribeToAddedItems',
    value: function subscribeToAddedItems() {
      var _this4 = this;

      this.onDidAddPaneItem(function (_ref3) {
        var item = _ref3.item;
        var pane = _ref3.pane;
        var index = _ref3.index;

        if (item instanceof TextEditor) {
          (function () {
            var subscriptions = new CompositeDisposable(_this4.textEditorRegistry.add(item), _this4.textEditorRegistry.maintainGrammar(item), _this4.textEditorRegistry.maintainConfig(item), item.observeGrammar(_this4.handleGrammarUsed.bind(_this4)));
            item.onDidDestroy(function () {
              subscriptions.dispose();
            });
            _this4.emitter.emit('did-add-text-editor', { textEditor: item, pane: pane, index: index });
          })();
        }
      });
    }
  }, {
    key: 'subscribeToDockToggling',
    value: function subscribeToDockToggling() {
      var _this5 = this;

      var docks = [this.getLeftDock(), this.getRightDock(), this.getBottomDock()];
      docks.forEach(function (dock) {
        dock.onDidChangeVisible(function (visible) {
          if (visible) return;
          var activeElement = document.activeElement;

          var dockElement = dock.getElement();
          if (dockElement === activeElement || dockElement.contains(activeElement)) {
            _this5.getCenter().activate();
          }
        });
      });
    }
  }, {
    key: 'subscribeToMovedItems',
    value: function subscribeToMovedItems() {
      var _this6 = this;

      var _loop = function _loop(paneContainer) {
        paneContainer.observePanes(function (pane) {
          pane.onDidAddItem(function (_ref4) {
            var item = _ref4.item;

            if (typeof item.getURI === 'function' && _this6.enablePersistence) {
              var uri = item.getURI();
              if (uri) {
                var _location = paneContainer.getLocation();
                var defaultLocation = undefined;
                if (typeof item.getDefaultLocation === 'function') {
                  defaultLocation = item.getDefaultLocation();
                }
                defaultLocation = defaultLocation || 'center';
                if (_location === defaultLocation) {
                  _this6.itemLocationStore['delete'](item.getURI());
                } else {
                  _this6.itemLocationStore.save(item.getURI(), _location);
                }
              }
            }
          });
        });
      };

      for (var paneContainer of this.getPaneContainers()) {
        _loop(paneContainer);
      }
    }

    // Updates the application's title and proxy icon based on whichever file is
    // open.
  }, {
    key: 'updateWindowTitle',
    value: function updateWindowTitle() {
      var itemPath = undefined,
          itemTitle = undefined,
          projectPath = undefined,
          representedPath = undefined;
      var appName = 'Atom';
      var left = this.project.getPaths();
      var projectPaths = left != null ? left : [];
      var item = this.getActivePaneItem();
      if (item) {
        itemPath = typeof item.getPath === 'function' ? item.getPath() : undefined;
        var longTitle = typeof item.getLongTitle === 'function' ? item.getLongTitle() : undefined;
        itemTitle = longTitle == null ? typeof item.getTitle === 'function' ? item.getTitle() : undefined : longTitle;
        projectPath = _.find(projectPaths, function (projectPath) {
          return itemPath === projectPath || (itemPath != null ? itemPath.startsWith(projectPath + path.sep) : undefined);
        });
      }
      if (itemTitle == null) {
        itemTitle = 'untitled';
      }
      if (projectPath == null) {
        projectPath = itemPath ? path.dirname(itemPath) : projectPaths[0];
      }
      if (projectPath != null) {
        projectPath = fs.tildify(projectPath);
      }

      var titleParts = [];
      if (item != null && projectPath != null) {
        titleParts.push(itemTitle, projectPath);
        representedPath = itemPath != null ? itemPath : projectPath;
      } else if (projectPath != null) {
        titleParts.push(projectPath);
        representedPath = projectPath;
      } else {
        titleParts.push(itemTitle);
        representedPath = '';
      }

      if (process.platform !== 'darwin') {
        titleParts.push(appName);
      }

      document.title = titleParts.join(' — ');
      this.applicationDelegate.setRepresentedFilename(representedPath);
      this.emitter.emit('did-change-window-title');
    }

    // On macOS, fades the application window's proxy icon when the current file
    // has been modified.
  }, {
    key: 'updateDocumentEdited',
    value: function updateDocumentEdited() {
      var activePaneItem = this.getActivePaneItem();
      var modified = activePaneItem != null && typeof activePaneItem.isModified === 'function' ? activePaneItem.isModified() || false : false;
      this.applicationDelegate.setWindowDocumentEdited(modified);
    }

    /*
    Section: Event Subscription
    */

  }, {
    key: 'onDidChangeActivePaneContainer',
    value: function onDidChangeActivePaneContainer(callback) {
      return this.emitter.on('did-change-active-pane-container', callback);
    }

    // Essential: Invoke the given callback with all current and future text
    // editors in the workspace.
    //
    // * `callback` {Function} to be called with current and future text editors.
    //   * `editor` A {TextEditor} that is present in {::getTextEditors} at the time
    //     of subscription or that is added at some later time.
    //
    // Returns a {Disposable} on which `.dispose()` can be called to unsubscribe.
  }, {
    key: 'observeTextEditors',
    value: function observeTextEditors(callback) {
      for (var textEditor of this.getTextEditors()) {
        callback(textEditor);
      }
      return this.onDidAddTextEditor(function (_ref5) {
        var textEditor = _ref5.textEditor;
        return callback(textEditor);
      });
    }

    // Essential: Invoke the given callback with all current and future panes items
    // in the workspace.
    //
    // * `callback` {Function} to be called with current and future pane items.
    //   * `item` An item that is present in {::getPaneItems} at the time of
    //      subscription or that is added at some later time.
    //
    // Returns a {Disposable} on which `.dispose()` can be called to unsubscribe.
  }, {
    key: 'observePaneItems',
    value: function observePaneItems(callback) {
      return new (_bind.apply(CompositeDisposable, [null].concat(_toConsumableArray(this.getPaneContainers().map(function (container) {
        return container.observePaneItems(callback);
      })))))();
    }

    // Essential: Invoke the given callback when the active pane item changes.
    //
    // Because observers are invoked synchronously, it's important not to perform
    // any expensive operations via this method. Consider
    // {::onDidStopChangingActivePaneItem} to delay operations until after changes
    // stop occurring.
    //
    // * `callback` {Function} to be called when the active pane item changes.
    //   * `item` The active pane item.
    //
    // Returns a {Disposable} on which `.dispose()` can be called to unsubscribe.
  }, {
    key: 'onDidChangeActivePaneItem',
    value: function onDidChangeActivePaneItem(callback) {
      return this.emitter.on('did-change-active-pane-item', callback);
    }

    // Essential: Invoke the given callback when the active pane item stops
    // changing.
    //
    // Observers are called asynchronously 100ms after the last active pane item
    // change. Handling changes here rather than in the synchronous
    // {::onDidChangeActivePaneItem} prevents unneeded work if the user is quickly
    // changing or closing tabs and ensures critical UI feedback, like changing the
    // highlighted tab, gets priority over work that can be done asynchronously.
    //
    // * `callback` {Function} to be called when the active pane item stops
    //   changing.
    //   * `item` The active pane item.
    //
    // Returns a {Disposable} on which `.dispose()` can be called to unsubscribe.
  }, {
    key: 'onDidStopChangingActivePaneItem',
    value: function onDidStopChangingActivePaneItem(callback) {
      return this.emitter.on('did-stop-changing-active-pane-item', callback);
    }

    // Essential: Invoke the given callback when a text editor becomes the active
    // text editor and when there is no longer an active text editor.
    //
    // * `callback` {Function} to be called when the active text editor changes.
    //   * `editor` The active {TextEditor} or undefined if there is no longer an
    //      active text editor.
    //
    // Returns a {Disposable} on which `.dispose()` can be called to unsubscribe.
  }, {
    key: 'onDidChangeActiveTextEditor',
    value: function onDidChangeActiveTextEditor(callback) {
      return this.emitter.on('did-change-active-text-editor', callback);
    }

    // Essential: Invoke the given callback with the current active pane item and
    // with all future active pane items in the workspace.
    //
    // * `callback` {Function} to be called when the active pane item changes.
    //   * `item` The current active pane item.
    //
    // Returns a {Disposable} on which `.dispose()` can be called to unsubscribe.
  }, {
    key: 'observeActivePaneItem',
    value: function observeActivePaneItem(callback) {
      callback(this.getActivePaneItem());
      return this.onDidChangeActivePaneItem(callback);
    }

    // Essential: Invoke the given callback with the current active text editor
    // (if any), with all future active text editors, and when there is no longer
    // an active text editor.
    //
    // * `callback` {Function} to be called when the active text editor changes.
    //   * `editor` The active {TextEditor} or undefined if there is not an
    //      active text editor.
    //
    // Returns a {Disposable} on which `.dispose()` can be called to unsubscribe.
  }, {
    key: 'observeActiveTextEditor',
    value: function observeActiveTextEditor(callback) {
      callback(this.getActiveTextEditor());

      return this.onDidChangeActiveTextEditor(callback);
    }

    // Essential: Invoke the given callback whenever an item is opened. Unlike
    // {::onDidAddPaneItem}, observers will be notified for items that are already
    // present in the workspace when they are reopened.
    //
    // * `callback` {Function} to be called whenever an item is opened.
    //   * `event` {Object} with the following keys:
    //     * `uri` {String} representing the opened URI. Could be `undefined`.
    //     * `item` The opened item.
    //     * `pane` The pane in which the item was opened.
    //     * `index` The index of the opened item on its pane.
    //
    // Returns a {Disposable} on which `.dispose()` can be called to unsubscribe.
  }, {
    key: 'onDidOpen',
    value: function onDidOpen(callback) {
      return this.emitter.on('did-open', callback);
    }

    // Extended: Invoke the given callback when a pane is added to the workspace.
    //
    // * `callback` {Function} to be called panes are added.
    //   * `event` {Object} with the following keys:
    //     * `pane` The added pane.
    //
    // Returns a {Disposable} on which `.dispose()` can be called to unsubscribe.
  }, {
    key: 'onDidAddPane',
    value: function onDidAddPane(callback) {
      return new (_bind.apply(CompositeDisposable, [null].concat(_toConsumableArray(this.getPaneContainers().map(function (container) {
        return container.onDidAddPane(callback);
      })))))();
    }

    // Extended: Invoke the given callback before a pane is destroyed in the
    // workspace.
    //
    // * `callback` {Function} to be called before panes are destroyed.
    //   * `event` {Object} with the following keys:
    //     * `pane` The pane to be destroyed.
    //
    // Returns a {Disposable} on which `.dispose()` can be called to unsubscribe.
  }, {
    key: 'onWillDestroyPane',
    value: function onWillDestroyPane(callback) {
      return new (_bind.apply(CompositeDisposable, [null].concat(_toConsumableArray(this.getPaneContainers().map(function (container) {
        return container.onWillDestroyPane(callback);
      })))))();
    }

    // Extended: Invoke the given callback when a pane is destroyed in the
    // workspace.
    //
    // * `callback` {Function} to be called panes are destroyed.
    //   * `event` {Object} with the following keys:
    //     * `pane` The destroyed pane.
    //
    // Returns a {Disposable} on which `.dispose()` can be called to unsubscribe.
  }, {
    key: 'onDidDestroyPane',
    value: function onDidDestroyPane(callback) {
      return new (_bind.apply(CompositeDisposable, [null].concat(_toConsumableArray(this.getPaneContainers().map(function (container) {
        return container.onDidDestroyPane(callback);
      })))))();
    }

    // Extended: Invoke the given callback with all current and future panes in the
    // workspace.
    //
    // * `callback` {Function} to be called with current and future panes.
    //   * `pane` A {Pane} that is present in {::getPanes} at the time of
    //      subscription or that is added at some later time.
    //
    // Returns a {Disposable} on which `.dispose()` can be called to unsubscribe.
  }, {
    key: 'observePanes',
    value: function observePanes(callback) {
      return new (_bind.apply(CompositeDisposable, [null].concat(_toConsumableArray(this.getPaneContainers().map(function (container) {
        return container.observePanes(callback);
      })))))();
    }

    // Extended: Invoke the given callback when the active pane changes.
    //
    // * `callback` {Function} to be called when the active pane changes.
    //   * `pane` A {Pane} that is the current return value of {::getActivePane}.
    //
    // Returns a {Disposable} on which `.dispose()` can be called to unsubscribe.
  }, {
    key: 'onDidChangeActivePane',
    value: function onDidChangeActivePane(callback) {
      return this.emitter.on('did-change-active-pane', callback);
    }

    // Extended: Invoke the given callback with the current active pane and when
    // the active pane changes.
    //
    // * `callback` {Function} to be called with the current and future active#
    //   panes.
    //   * `pane` A {Pane} that is the current return value of {::getActivePane}.
    //
    // Returns a {Disposable} on which `.dispose()` can be called to unsubscribe.
  }, {
    key: 'observeActivePane',
    value: function observeActivePane(callback) {
      callback(this.getActivePane());
      return this.onDidChangeActivePane(callback);
    }

    // Extended: Invoke the given callback when a pane item is added to the
    // workspace.
    //
    // * `callback` {Function} to be called when pane items are added.
    //   * `event` {Object} with the following keys:
    //     * `item` The added pane item.
    //     * `pane` {Pane} containing the added item.
    //     * `index` {Number} indicating the index of the added item in its pane.
    //
    // Returns a {Disposable} on which `.dispose()` can be called to unsubscribe.
  }, {
    key: 'onDidAddPaneItem',
    value: function onDidAddPaneItem(callback) {
      return new (_bind.apply(CompositeDisposable, [null].concat(_toConsumableArray(this.getPaneContainers().map(function (container) {
        return container.onDidAddPaneItem(callback);
      })))))();
    }

    // Extended: Invoke the given callback when a pane item is about to be
    // destroyed, before the user is prompted to save it.
    //
    // * `callback` {Function} to be called before pane items are destroyed. If this function returns
    //   a {Promise}, then the item will not be destroyed until the promise resolves.
    //   * `event` {Object} with the following keys:
    //     * `item` The item to be destroyed.
    //     * `pane` {Pane} containing the item to be destroyed.
    //     * `index` {Number} indicating the index of the item to be destroyed in
    //       its pane.
    //
    // Returns a {Disposable} on which `.dispose` can be called to unsubscribe.
  }, {
    key: 'onWillDestroyPaneItem',
    value: function onWillDestroyPaneItem(callback) {
      return new (_bind.apply(CompositeDisposable, [null].concat(_toConsumableArray(this.getPaneContainers().map(function (container) {
        return container.onWillDestroyPaneItem(callback);
      })))))();
    }

    // Extended: Invoke the given callback when a pane item is destroyed.
    //
    // * `callback` {Function} to be called when pane items are destroyed.
    //   * `event` {Object} with the following keys:
    //     * `item` The destroyed item.
    //     * `pane` {Pane} containing the destroyed item.
    //     * `index` {Number} indicating the index of the destroyed item in its
    //       pane.
    //
    // Returns a {Disposable} on which `.dispose` can be called to unsubscribe.
  }, {
    key: 'onDidDestroyPaneItem',
    value: function onDidDestroyPaneItem(callback) {
      return new (_bind.apply(CompositeDisposable, [null].concat(_toConsumableArray(this.getPaneContainers().map(function (container) {
        return container.onDidDestroyPaneItem(callback);
      })))))();
    }

    // Extended: Invoke the given callback when a text editor is added to the
    // workspace.
    //
    // * `callback` {Function} to be called panes are added.
    //   * `event` {Object} with the following keys:
    //     * `textEditor` {TextEditor} that was added.
    //     * `pane` {Pane} containing the added text editor.
    //     * `index` {Number} indicating the index of the added text editor in its
    //        pane.
    //
    // Returns a {Disposable} on which `.dispose()` can be called to unsubscribe.
  }, {
    key: 'onDidAddTextEditor',
    value: function onDidAddTextEditor(callback) {
      return this.emitter.on('did-add-text-editor', callback);
    }
  }, {
    key: 'onDidChangeWindowTitle',
    value: function onDidChangeWindowTitle(callback) {
      return this.emitter.on('did-change-window-title', callback);
    }

    /*
    Section: Opening
    */

    // Essential: Opens the given URI in Atom asynchronously.
    // If the URI is already open, the existing item for that URI will be
    // activated. If no URI is given, or no registered opener can open
    // the URI, a new empty {TextEditor} will be created.
    //
    // * `uri` (optional) A {String} containing a URI.
    // * `options` (optional) {Object}
    //   * `initialLine` A {Number} indicating which row to move the cursor to
    //     initially. Defaults to `0`.
    //   * `initialColumn` A {Number} indicating which column to move the cursor to
    //     initially. Defaults to `0`.
    //   * `split` Either 'left', 'right', 'up' or 'down'.
    //     If 'left', the item will be opened in leftmost pane of the current active pane's row.
    //     If 'right', the item will be opened in the rightmost pane of the current active pane's row. If only one pane exists in the row, a new pane will be created.
    //     If 'up', the item will be opened in topmost pane of the current active pane's column.
    //     If 'down', the item will be opened in the bottommost pane of the current active pane's column. If only one pane exists in the column, a new pane will be created.
    //   * `activatePane` A {Boolean} indicating whether to call {Pane::activate} on
    //     containing pane. Defaults to `true`.
    //   * `activateItem` A {Boolean} indicating whether to call {Pane::activateItem}
    //     on containing pane. Defaults to `true`.
    //   * `pending` A {Boolean} indicating whether or not the item should be opened
    //     in a pending state. Existing pending items in a pane are replaced with
    //     new pending items when they are opened.
    //   * `searchAllPanes` A {Boolean}. If `true`, the workspace will attempt to
    //     activate an existing item for the given URI on any pane.
    //     If `false`, only the active pane will be searched for
    //     an existing item for the same URI. Defaults to `false`.
    //   * `location` (optional) A {String} containing the name of the location
    //     in which this item should be opened (one of "left", "right", "bottom",
    //     or "center"). If omitted, Atom will fall back to the last location in
    //     which a user has placed an item with the same URI or, if this is a new
    //     URI, the default location specified by the item. NOTE: This option
    //     should almost always be omitted to honor user preference.
    //
    // Returns a {Promise} that resolves to the {TextEditor} for the file URI.
  }, {
    key: 'open',
    value: _asyncToGenerator(function* (itemOrURI) {
      var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

      var uri = undefined,
          item = undefined;
      if (typeof itemOrURI === 'string') {
        uri = this.project.resolvePath(itemOrURI);
      } else if (itemOrURI) {
        item = itemOrURI;
        if (typeof item.getURI === 'function') uri = item.getURI();
      }

      if (!atom.config.get('core.allowPendingPaneItems')) {
        options.pending = false;
      }

      // Avoid adding URLs as recent documents to work-around this Spotlight crash:
      // https://github.com/atom/atom/issues/10071
      if (uri && (!url.parse(uri).protocol || process.platform === 'win32')) {
        this.applicationDelegate.addRecentDocument(uri);
      }

      var pane = undefined,
          itemExistsInWorkspace = undefined;

      // Try to find an existing item in the workspace.
      if (item || uri) {
        if (options.pane) {
          pane = options.pane;
        } else if (options.searchAllPanes) {
          pane = item ? this.paneForItem(item) : this.paneForURI(uri);
        } else {
          // If an item with the given URI is already in the workspace, assume
          // that item's pane container is the preferred location for that URI.
          var container = undefined;
          if (uri) container = this.paneContainerForURI(uri);
          if (!container) container = this.getActivePaneContainer();

          // The `split` option affects where we search for the item.
          pane = container.getActivePane();
          switch (options.split) {
            case 'left':
              pane = pane.findLeftmostSibling();
              break;
            case 'right':
              pane = pane.findRightmostSibling();
              break;
            case 'up':
              pane = pane.findTopmostSibling();
              break;
            case 'down':
              pane = pane.findBottommostSibling();
              break;
          }
        }

        if (pane) {
          if (item) {
            itemExistsInWorkspace = pane.getItems().includes(item);
          } else {
            item = pane.itemForURI(uri);
            itemExistsInWorkspace = item != null;
          }
        }
      }

      // If we already have an item at this stage, we won't need to do an async
      // lookup of the URI, so we yield the event loop to ensure this method
      // is consistently asynchronous.
      if (item) yield Promise.resolve();

      if (!itemExistsInWorkspace) {
        item = item || (yield this.createItemForURI(uri, options));
        if (!item) return;

        if (options.pane) {
          pane = options.pane;
        } else {
          var _location2 = options.location;
          if (!_location2 && !options.split && uri && this.enablePersistence) {
            _location2 = yield this.itemLocationStore.load(uri);
          }
          if (!_location2 && typeof item.getDefaultLocation === 'function') {
            _location2 = item.getDefaultLocation();
          }

          var allowedLocations = typeof item.getAllowedLocations === 'function' ? item.getAllowedLocations() : ALL_LOCATIONS;
          _location2 = allowedLocations.includes(_location2) ? _location2 : allowedLocations[0];

          var container = this.paneContainers[_location2] || this.getCenter();
          pane = container.getActivePane();
          switch (options.split) {
            case 'left':
              pane = pane.findLeftmostSibling();
              break;
            case 'right':
              pane = pane.findOrCreateRightmostSibling();
              break;
            case 'up':
              pane = pane.findTopmostSibling();
              break;
            case 'down':
              pane = pane.findOrCreateBottommostSibling();
              break;
          }
        }
      }

      if (!options.pending && pane.getPendingItem() === item) {
        pane.clearPendingItem();
      }

      this.itemOpened(item);

      if (options.activateItem === false) {
        pane.addItem(item, { pending: options.pending });
      } else {
        pane.activateItem(item, { pending: options.pending });
      }

      if (options.activatePane !== false) {
        pane.activate();
      }

      var initialColumn = 0;
      var initialLine = 0;
      if (!Number.isNaN(options.initialLine)) {
        initialLine = options.initialLine;
      }
      if (!Number.isNaN(options.initialColumn)) {
        initialColumn = options.initialColumn;
      }
      if (initialLine >= 0 || initialColumn >= 0) {
        if (typeof item.setCursorBufferPosition === 'function') {
          item.setCursorBufferPosition([initialLine, initialColumn]);
        }
      }

      var index = pane.getActiveItemIndex();
      this.emitter.emit('did-open', { uri: uri, pane: pane, item: item, index: index });
      return item;
    })

    // Essential: Search the workspace for items matching the given URI and hide them.
    //
    // * `itemOrURI` The item to hide or a {String} containing the URI
    //   of the item to hide.
    //
    // Returns a {Boolean} indicating whether any items were found (and hidden).
  }, {
    key: 'hide',
    value: function hide(itemOrURI) {
      var foundItems = false;

      // If any visible item has the given URI, hide it
      for (var container of this.getPaneContainers()) {
        var isCenter = container === this.getCenter();
        if (isCenter || container.isVisible()) {
          for (var pane of container.getPanes()) {
            var activeItem = pane.getActiveItem();
            var foundItem = activeItem != null && (activeItem === itemOrURI || typeof activeItem.getURI === 'function' && activeItem.getURI() === itemOrURI);
            if (foundItem) {
              foundItems = true;
              // We can't really hide the center so we just destroy the item.
              if (isCenter) {
                pane.destroyItem(activeItem);
              } else {
                container.hide();
              }
            }
          }
        }
      }

      return foundItems;
    }

    // Essential: Search the workspace for items matching the given URI. If any are found, hide them.
    // Otherwise, open the URL.
    //
    // * `itemOrURI` (optional) The item to toggle or a {String} containing the URI
    //   of the item to toggle.
    //
    // Returns a Promise that resolves when the item is shown or hidden.
  }, {
    key: 'toggle',
    value: function toggle(itemOrURI) {
      if (this.hide(itemOrURI)) {
        return Promise.resolve();
      } else {
        return this.open(itemOrURI, { searchAllPanes: true });
      }
    }

    // Open Atom's license in the active pane.
  }, {
    key: 'openLicense',
    value: function openLicense() {
      return this.open(path.join(process.resourcesPath, 'LICENSE.md'));
    }

    // Synchronously open the given URI in the active pane. **Only use this method
    // in specs. Calling this in production code will block the UI thread and
    // everyone will be mad at you.**
    //
    // * `uri` A {String} containing a URI.
    // * `options` An optional options {Object}
    //   * `initialLine` A {Number} indicating which row to move the cursor to
    //     initially. Defaults to `0`.
    //   * `initialColumn` A {Number} indicating which column to move the cursor to
    //     initially. Defaults to `0`.
    //   * `activatePane` A {Boolean} indicating whether to call {Pane::activate} on
    //     the containing pane. Defaults to `true`.
    //   * `activateItem` A {Boolean} indicating whether to call {Pane::activateItem}
    //     on containing pane. Defaults to `true`.
  }, {
    key: 'openSync',
    value: function openSync() {
      var uri_ = arguments.length <= 0 || arguments[0] === undefined ? '' : arguments[0];
      var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];
      var initialLine = options.initialLine;
      var initialColumn = options.initialColumn;

      var activatePane = options.activatePane != null ? options.activatePane : true;
      var activateItem = options.activateItem != null ? options.activateItem : true;

      var uri = this.project.resolvePath(uri_);
      var item = this.getActivePane().itemForURI(uri);
      if (uri && item == null) {
        for (var _opener of this.getOpeners()) {
          item = _opener(uri, options);
          if (item) break;
        }
      }
      if (item == null) {
        item = this.project.openSync(uri, { initialLine: initialLine, initialColumn: initialColumn });
      }

      if (activateItem) {
        this.getActivePane().activateItem(item);
      }
      this.itemOpened(item);
      if (activatePane) {
        this.getActivePane().activate();
      }
      return item;
    }
  }, {
    key: 'openURIInPane',
    value: function openURIInPane(uri, pane) {
      return this.open(uri, { pane: pane });
    }

    // Public: Creates a new item that corresponds to the provided URI.
    //
    // If no URI is given, or no registered opener can open the URI, a new empty
    // {TextEditor} will be created.
    //
    // * `uri` A {String} containing a URI.
    //
    // Returns a {Promise} that resolves to the {TextEditor} (or other item) for the given URI.
  }, {
    key: 'createItemForURI',
    value: function createItemForURI(uri, options) {
      if (uri != null) {
        for (var _opener2 of this.getOpeners()) {
          var item = _opener2(uri, options);
          if (item != null) return Promise.resolve(item);
        }
      }

      try {
        return this.openTextFile(uri, options);
      } catch (error) {
        switch (error.code) {
          case 'CANCELLED':
            return Promise.resolve();
          case 'EACCES':
            this.notificationManager.addWarning('Permission denied \'' + error.path + '\'');
            return Promise.resolve();
          case 'EPERM':
          case 'EBUSY':
          case 'ENXIO':
          case 'EIO':
          case 'ENOTCONN':
          case 'UNKNOWN':
          case 'ECONNRESET':
          case 'EINVAL':
          case 'EMFILE':
          case 'ENOTDIR':
          case 'EAGAIN':
            this.notificationManager.addWarning('Unable to open \'' + (error.path != null ? error.path : uri) + '\'', { detail: error.message });
            return Promise.resolve();
          default:
            throw error;
        }
      }
    }
  }, {
    key: 'openTextFile',
    value: function openTextFile(uri, options) {
      var _this7 = this;

      var filePath = this.project.resolvePath(uri);

      if (filePath != null) {
        try {
          fs.closeSync(fs.openSync(filePath, 'r'));
        } catch (error) {
          // allow ENOENT errors to create an editor for paths that dont exist
          if (error.code !== 'ENOENT') {
            throw error;
          }
        }
      }

      var fileSize = fs.getSizeSync(filePath);

      var largeFileMode = fileSize >= 2 * 1048576; // 2MB
      if (fileSize >= this.config.get('core.warnOnLargeFileLimit') * 1048576) {
        // 20MB by default
        var choice = this.applicationDelegate.confirm({
          message: 'Atom will be unresponsive during the loading of very large files.',
          detailedMessage: 'Do you still want to load this file?',
          buttons: ['Proceed', 'Cancel']
        });
        if (choice === 1) {
          var error = new Error();
          error.code = 'CANCELLED';
          throw error;
        }
      }

      return this.project.bufferForPath(filePath, options).then(function (buffer) {
        return _this7.textEditorRegistry.build(Object.assign({ buffer: buffer, largeFileMode: largeFileMode, autoHeight: false }, options));
      });
    }
  }, {
    key: 'handleGrammarUsed',
    value: function handleGrammarUsed(grammar) {
      if (grammar == null) {
        return;
      }
      return this.packageManager.triggerActivationHook(grammar.packageName + ':grammar-used');
    }

    // Public: Returns a {Boolean} that is `true` if `object` is a `TextEditor`.
    //
    // * `object` An {Object} you want to perform the check against.
  }, {
    key: 'isTextEditor',
    value: function isTextEditor(object) {
      return object instanceof TextEditor;
    }

    // Extended: Create a new text editor.
    //
    // Returns a {TextEditor}.
  }, {
    key: 'buildTextEditor',
    value: function buildTextEditor(params) {
      var editor = this.textEditorRegistry.build(params);
      var subscriptions = new CompositeDisposable(this.textEditorRegistry.maintainGrammar(editor), this.textEditorRegistry.maintainConfig(editor));
      editor.onDidDestroy(function () {
        subscriptions.dispose();
      });
      return editor;
    }

    // Public: Asynchronously reopens the last-closed item's URI if it hasn't already been
    // reopened.
    //
    // Returns a {Promise} that is resolved when the item is opened
  }, {
    key: 'reopenItem',
    value: function reopenItem() {
      var uri = this.destroyedItemURIs.pop();
      if (uri) {
        return this.open(uri);
      } else {
        return Promise.resolve();
      }
    }

    // Public: Register an opener for a uri.
    //
    // When a URI is opened via {Workspace::open}, Atom loops through its registered
    // opener functions until one returns a value for the given uri.
    // Openers are expected to return an object that inherits from HTMLElement or
    // a model which has an associated view in the {ViewRegistry}.
    // A {TextEditor} will be used if no opener returns a value.
    //
    // ## Examples
    //
    // ```coffee
    // atom.workspace.addOpener (uri) ->
    //   if path.extname(uri) is '.toml'
    //     return new TomlEditor(uri)
    // ```
    //
    // * `opener` A {Function} to be called when a path is being opened.
    //
    // Returns a {Disposable} on which `.dispose()` can be called to remove the
    // opener.
    //
    // Note that the opener will be called if and only if the URI is not already open
    // in the current pane. The searchAllPanes flag expands the search from the
    // current pane to all panes. If you wish to open a view of a different type for
    // a file that is already open, consider changing the protocol of the URI. For
    // example, perhaps you wish to preview a rendered version of the file `/foo/bar/baz.quux`
    // that is already open in a text editor view. You could signal this by calling
    // {Workspace::open} on the URI `quux-preview://foo/bar/baz.quux`. Then your opener
    // can check the protocol for quux-preview and only handle those URIs that match.
  }, {
    key: 'addOpener',
    value: function addOpener(opener) {
      var _this8 = this;

      this.openers.push(opener);
      return new Disposable(function () {
        _.remove(_this8.openers, opener);
      });
    }
  }, {
    key: 'getOpeners',
    value: function getOpeners() {
      return this.openers;
    }

    /*
    Section: Pane Items
    */

    // Essential: Get all pane items in the workspace.
    //
    // Returns an {Array} of items.
  }, {
    key: 'getPaneItems',
    value: function getPaneItems() {
      return _.flatten(this.getPaneContainers().map(function (container) {
        return container.getPaneItems();
      }));
    }

    // Essential: Get the active {Pane}'s active item.
    //
    // Returns an pane item {Object}.
  }, {
    key: 'getActivePaneItem',
    value: function getActivePaneItem() {
      return this.getActivePaneContainer().getActivePaneItem();
    }

    // Essential: Get all text editors in the workspace.
    //
    // Returns an {Array} of {TextEditor}s.
  }, {
    key: 'getTextEditors',
    value: function getTextEditors() {
      return this.getPaneItems().filter(function (item) {
        return item instanceof TextEditor;
      });
    }

    // Essential: Get the workspace center's active item if it is a {TextEditor}.
    //
    // Returns a {TextEditor} or `undefined` if the workspace center's current
    // active item is not a {TextEditor}.
  }, {
    key: 'getActiveTextEditor',
    value: function getActiveTextEditor() {
      var activeItem = this.getCenter().getActivePaneItem();
      if (activeItem instanceof TextEditor) {
        return activeItem;
      }
    }

    // Save all pane items.
  }, {
    key: 'saveAll',
    value: function saveAll() {
      this.getPaneContainers().forEach(function (container) {
        container.saveAll();
      });
    }
  }, {
    key: 'confirmClose',
    value: function confirmClose(options) {
      return Promise.all(this.getPaneContainers().map(function (container) {
        return container.confirmClose(options);
      })).then(function (results) {
        return !results.includes(false);
      });
    }

    // Save the active pane item.
    //
    // If the active pane item currently has a URI according to the item's
    // `.getURI` method, calls `.save` on the item. Otherwise
    // {::saveActivePaneItemAs} # will be called instead. This method does nothing
    // if the active item does not implement a `.save` method.
  }, {
    key: 'saveActivePaneItem',
    value: function saveActivePaneItem() {
      return this.getCenter().getActivePane().saveActiveItem();
    }

    // Prompt the user for a path and save the active pane item to it.
    //
    // Opens a native dialog where the user selects a path on disk, then calls
    // `.saveAs` on the item with the selected path. This method does nothing if
    // the active item does not implement a `.saveAs` method.
  }, {
    key: 'saveActivePaneItemAs',
    value: function saveActivePaneItemAs() {
      this.getCenter().getActivePane().saveActiveItemAs();
    }

    // Destroy (close) the active pane item.
    //
    // Removes the active pane item and calls the `.destroy` method on it if one is
    // defined.
  }, {
    key: 'destroyActivePaneItem',
    value: function destroyActivePaneItem() {
      return this.getActivePane().destroyActiveItem();
    }

    /*
    Section: Panes
    */

    // Extended: Get the most recently focused pane container.
    //
    // Returns a {Dock} or the {WorkspaceCenter}.
  }, {
    key: 'getActivePaneContainer',
    value: function getActivePaneContainer() {
      return this.activePaneContainer;
    }

    // Extended: Get all panes in the workspace.
    //
    // Returns an {Array} of {Pane}s.
  }, {
    key: 'getPanes',
    value: function getPanes() {
      return _.flatten(this.getPaneContainers().map(function (container) {
        return container.getPanes();
      }));
    }
  }, {
    key: 'getVisiblePanes',
    value: function getVisiblePanes() {
      return _.flatten(this.getVisiblePaneContainers().map(function (container) {
        return container.getPanes();
      }));
    }

    // Extended: Get the active {Pane}.
    //
    // Returns a {Pane}.
  }, {
    key: 'getActivePane',
    value: function getActivePane() {
      return this.getActivePaneContainer().getActivePane();
    }

    // Extended: Make the next pane active.
  }, {
    key: 'activateNextPane',
    value: function activateNextPane() {
      return this.getActivePaneContainer().activateNextPane();
    }

    // Extended: Make the previous pane active.
  }, {
    key: 'activatePreviousPane',
    value: function activatePreviousPane() {
      return this.getActivePaneContainer().activatePreviousPane();
    }

    // Extended: Get the first pane container that contains an item with the given
    // URI.
    //
    // * `uri` {String} uri
    //
    // Returns a {Dock}, the {WorkspaceCenter}, or `undefined` if no item exists
    // with the given URI.
  }, {
    key: 'paneContainerForURI',
    value: function paneContainerForURI(uri) {
      return this.getPaneContainers().find(function (container) {
        return container.paneForURI(uri);
      });
    }

    // Extended: Get the first pane container that contains the given item.
    //
    // * `item` the Item that the returned pane container must contain.
    //
    // Returns a {Dock}, the {WorkspaceCenter}, or `undefined` if no item exists
    // with the given URI.
  }, {
    key: 'paneContainerForItem',
    value: function paneContainerForItem(uri) {
      return this.getPaneContainers().find(function (container) {
        return container.paneForItem(uri);
      });
    }

    // Extended: Get the first {Pane} that contains an item with the given URI.
    //
    // * `uri` {String} uri
    //
    // Returns a {Pane} or `undefined` if no item exists with the given URI.
  }, {
    key: 'paneForURI',
    value: function paneForURI(uri) {
      for (var _location3 of this.getPaneContainers()) {
        var pane = _location3.paneForURI(uri);
        if (pane != null) {
          return pane;
        }
      }
    }

    // Extended: Get the {Pane} containing the given item.
    //
    // * `item` the Item that the returned pane must contain.
    //
    // Returns a {Pane} or `undefined` if no pane exists for the given item.
  }, {
    key: 'paneForItem',
    value: function paneForItem(item) {
      for (var _location4 of this.getPaneContainers()) {
        var pane = _location4.paneForItem(item);
        if (pane != null) {
          return pane;
        }
      }
    }

    // Destroy (close) the active pane.
  }, {
    key: 'destroyActivePane',
    value: function destroyActivePane() {
      var activePane = this.getActivePane();
      if (activePane != null) {
        activePane.destroy();
      }
    }

    // Close the active center pane item, or the active center pane if it is
    // empty, or the current window if there is only the empty root pane.
  }, {
    key: 'closeActivePaneItemOrEmptyPaneOrWindow',
    value: function closeActivePaneItemOrEmptyPaneOrWindow() {
      if (this.getCenter().getActivePaneItem() != null) {
        this.getCenter().getActivePane().destroyActiveItem();
      } else if (this.getCenter().getPanes().length > 1) {
        this.getCenter().destroyActivePane();
      } else if (this.config.get('core.closeEmptyWindows')) {
        atom.close();
      }
    }

    // Increase the editor font size by 1px.
  }, {
    key: 'increaseFontSize',
    value: function increaseFontSize() {
      this.config.set('editor.fontSize', this.config.get('editor.fontSize') + 1);
    }

    // Decrease the editor font size by 1px.
  }, {
    key: 'decreaseFontSize',
    value: function decreaseFontSize() {
      var fontSize = this.config.get('editor.fontSize');
      if (fontSize > 1) {
        this.config.set('editor.fontSize', fontSize - 1);
      }
    }

    // Restore to the window's original editor font size.
  }, {
    key: 'resetFontSize',
    value: function resetFontSize() {
      if (this.originalFontSize) {
        this.config.set('editor.fontSize', this.originalFontSize);
      }
    }
  }, {
    key: 'subscribeToFontSize',
    value: function subscribeToFontSize() {
      var _this9 = this;

      return this.config.onDidChange('editor.fontSize', function (_ref6) {
        var oldValue = _ref6.oldValue;

        if (_this9.originalFontSize == null) {
          _this9.originalFontSize = oldValue;
        }
      });
    }

    // Removes the item's uri from the list of potential items to reopen.
  }, {
    key: 'itemOpened',
    value: function itemOpened(item) {
      var uri = undefined;
      if (typeof item.getURI === 'function') {
        uri = item.getURI();
      } else if (typeof item.getUri === 'function') {
        uri = item.getUri();
      }

      if (uri != null) {
        _.remove(this.destroyedItemURIs, uri);
      }
    }

    // Adds the destroyed item's uri to the list of items to reopen.
  }, {
    key: 'didDestroyPaneItem',
    value: function didDestroyPaneItem(_ref7) {
      var item = _ref7.item;

      var uri = undefined;
      if (typeof item.getURI === 'function') {
        uri = item.getURI();
      } else if (typeof item.getUri === 'function') {
        uri = item.getUri();
      }

      if (uri != null) {
        this.destroyedItemURIs.push(uri);
      }
    }

    // Called by Model superclass when destroyed
  }, {
    key: 'destroyed',
    value: function destroyed() {
      this.paneContainers.center.destroy();
      this.paneContainers.left.destroy();
      this.paneContainers.right.destroy();
      this.paneContainers.bottom.destroy();
      this.cancelStoppedChangingActivePaneItemTimeout();
      if (this.activeItemSubscriptions != null) {
        this.activeItemSubscriptions.dispose();
      }
    }

    /*
    Section: Pane Locations
    */

    // Essential: Get the {WorkspaceCenter} at the center of the editor window.
  }, {
    key: 'getCenter',
    value: function getCenter() {
      return this.paneContainers.center;
    }

    // Essential: Get the {Dock} to the left of the editor window.
  }, {
    key: 'getLeftDock',
    value: function getLeftDock() {
      return this.paneContainers.left;
    }

    // Essential: Get the {Dock} to the right of the editor window.
  }, {
    key: 'getRightDock',
    value: function getRightDock() {
      return this.paneContainers.right;
    }

    // Essential: Get the {Dock} below the editor window.
  }, {
    key: 'getBottomDock',
    value: function getBottomDock() {
      return this.paneContainers.bottom;
    }
  }, {
    key: 'getPaneContainers',
    value: function getPaneContainers() {
      return [this.paneContainers.center, this.paneContainers.left, this.paneContainers.right, this.paneContainers.bottom];
    }
  }, {
    key: 'getVisiblePaneContainers',
    value: function getVisiblePaneContainers() {
      var center = this.getCenter();
      return atom.workspace.getPaneContainers().filter(function (container) {
        return container === center || container.isVisible();
      });
    }

    /*
    Section: Panels
     Panels are used to display UI related to an editor window. They are placed at one of the four
    edges of the window: left, right, top or bottom. If there are multiple panels on the same window
    edge they are stacked in order of priority: higher priority is closer to the center, lower
    priority towards the edge.
     *Note:* If your panel changes its size throughout its lifetime, consider giving it a higher
    priority, allowing fixed size panels to be closer to the edge. This allows control targets to
    remain more static for easier targeting by users that employ mice or trackpads. (See
    [atom/atom#4834](https://github.com/atom/atom/issues/4834) for discussion.)
    */

    // Essential: Get an {Array} of all the panel items at the bottom of the editor window.
  }, {
    key: 'getBottomPanels',
    value: function getBottomPanels() {
      return this.getPanels('bottom');
    }

    // Essential: Adds a panel item to the bottom of the editor window.
    //
    // * `options` {Object}
    //   * `item` Your panel content. It can be DOM element, a jQuery element, or
    //     a model with a view registered via {ViewRegistry::addViewProvider}. We recommend the
    //     latter. See {ViewRegistry::addViewProvider} for more information.
    //   * `visible` (optional) {Boolean} false if you want the panel to initially be hidden
    //     (default: true)
    //   * `priority` (optional) {Number} Determines stacking order. Lower priority items are
    //     forced closer to the edges of the window. (default: 100)
    //
    // Returns a {Panel}
  }, {
    key: 'addBottomPanel',
    value: function addBottomPanel(options) {
      return this.addPanel('bottom', options);
    }

    // Essential: Get an {Array} of all the panel items to the left of the editor window.
  }, {
    key: 'getLeftPanels',
    value: function getLeftPanels() {
      return this.getPanels('left');
    }

    // Essential: Adds a panel item to the left of the editor window.
    //
    // * `options` {Object}
    //   * `item` Your panel content. It can be DOM element, a jQuery element, or
    //     a model with a view registered via {ViewRegistry::addViewProvider}. We recommend the
    //     latter. See {ViewRegistry::addViewProvider} for more information.
    //   * `visible` (optional) {Boolean} false if you want the panel to initially be hidden
    //     (default: true)
    //   * `priority` (optional) {Number} Determines stacking order. Lower priority items are
    //     forced closer to the edges of the window. (default: 100)
    //
    // Returns a {Panel}
  }, {
    key: 'addLeftPanel',
    value: function addLeftPanel(options) {
      return this.addPanel('left', options);
    }

    // Essential: Get an {Array} of all the panel items to the right of the editor window.
  }, {
    key: 'getRightPanels',
    value: function getRightPanels() {
      return this.getPanels('right');
    }

    // Essential: Adds a panel item to the right of the editor window.
    //
    // * `options` {Object}
    //   * `item` Your panel content. It can be DOM element, a jQuery element, or
    //     a model with a view registered via {ViewRegistry::addViewProvider}. We recommend the
    //     latter. See {ViewRegistry::addViewProvider} for more information.
    //   * `visible` (optional) {Boolean} false if you want the panel to initially be hidden
    //     (default: true)
    //   * `priority` (optional) {Number} Determines stacking order. Lower priority items are
    //     forced closer to the edges of the window. (default: 100)
    //
    // Returns a {Panel}
  }, {
    key: 'addRightPanel',
    value: function addRightPanel(options) {
      return this.addPanel('right', options);
    }

    // Essential: Get an {Array} of all the panel items at the top of the editor window.
  }, {
    key: 'getTopPanels',
    value: function getTopPanels() {
      return this.getPanels('top');
    }

    // Essential: Adds a panel item to the top of the editor window above the tabs.
    //
    // * `options` {Object}
    //   * `item` Your panel content. It can be DOM element, a jQuery element, or
    //     a model with a view registered via {ViewRegistry::addViewProvider}. We recommend the
    //     latter. See {ViewRegistry::addViewProvider} for more information.
    //   * `visible` (optional) {Boolean} false if you want the panel to initially be hidden
    //     (default: true)
    //   * `priority` (optional) {Number} Determines stacking order. Lower priority items are
    //     forced closer to the edges of the window. (default: 100)
    //
    // Returns a {Panel}
  }, {
    key: 'addTopPanel',
    value: function addTopPanel(options) {
      return this.addPanel('top', options);
    }

    // Essential: Get an {Array} of all the panel items in the header.
  }, {
    key: 'getHeaderPanels',
    value: function getHeaderPanels() {
      return this.getPanels('header');
    }

    // Essential: Adds a panel item to the header.
    //
    // * `options` {Object}
    //   * `item` Your panel content. It can be DOM element, a jQuery element, or
    //     a model with a view registered via {ViewRegistry::addViewProvider}. We recommend the
    //     latter. See {ViewRegistry::addViewProvider} for more information.
    //   * `visible` (optional) {Boolean} false if you want the panel to initially be hidden
    //     (default: true)
    //   * `priority` (optional) {Number} Determines stacking order. Lower priority items are
    //     forced closer to the edges of the window. (default: 100)
    //
    // Returns a {Panel}
  }, {
    key: 'addHeaderPanel',
    value: function addHeaderPanel(options) {
      return this.addPanel('header', options);
    }

    // Essential: Get an {Array} of all the panel items in the footer.
  }, {
    key: 'getFooterPanels',
    value: function getFooterPanels() {
      return this.getPanels('footer');
    }

    // Essential: Adds a panel item to the footer.
    //
    // * `options` {Object}
    //   * `item` Your panel content. It can be DOM element, a jQuery element, or
    //     a model with a view registered via {ViewRegistry::addViewProvider}. We recommend the
    //     latter. See {ViewRegistry::addViewProvider} for more information.
    //   * `visible` (optional) {Boolean} false if you want the panel to initially be hidden
    //     (default: true)
    //   * `priority` (optional) {Number} Determines stacking order. Lower priority items are
    //     forced closer to the edges of the window. (default: 100)
    //
    // Returns a {Panel}
  }, {
    key: 'addFooterPanel',
    value: function addFooterPanel(options) {
      return this.addPanel('footer', options);
    }

    // Essential: Get an {Array} of all the modal panel items
  }, {
    key: 'getModalPanels',
    value: function getModalPanels() {
      return this.getPanels('modal');
    }

    // Essential: Adds a panel item as a modal dialog.
    //
    // * `options` {Object}
    //   * `item` Your panel content. It can be a DOM element, a jQuery element, or
    //     a model with a view registered via {ViewRegistry::addViewProvider}. We recommend the
    //     model option. See {ViewRegistry::addViewProvider} for more information.
    //   * `visible` (optional) {Boolean} false if you want the panel to initially be hidden
    //     (default: true)
    //   * `priority` (optional) {Number} Determines stacking order. Lower priority items are
    //     forced closer to the edges of the window. (default: 100)
    //   * `autoFocus` (optional) {Boolean} true if you want modal focus managed for you by Atom.
    //     Atom will automatically focus your modal panel's first tabbable element when the modal
    //     opens and will restore the previously selected element when the modal closes. Atom will
    //     also automatically restrict user tab focus within your modal while it is open.
    //     (default: false)
    //
    // Returns a {Panel}
  }, {
    key: 'addModalPanel',
    value: function addModalPanel() {
      var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

      return this.addPanel('modal', options);
    }

    // Essential: Returns the {Panel} associated with the given item. Returns
    // `null` when the item has no panel.
    //
    // * `item` Item the panel contains
  }, {
    key: 'panelForItem',
    value: function panelForItem(item) {
      for (var _location5 in this.panelContainers) {
        var container = this.panelContainers[_location5];
        var panel = container.panelForItem(item);
        if (panel != null) {
          return panel;
        }
      }
      return null;
    }
  }, {
    key: 'getPanels',
    value: function getPanels(location) {
      return this.panelContainers[location].getPanels();
    }
  }, {
    key: 'addPanel',
    value: function addPanel(location, options) {
      if (options == null) {
        options = {};
      }
      return this.panelContainers[location].addPanel(new Panel(options, this.viewRegistry));
    }

    /*
    Section: Searching and Replacing
    */

    // Public: Performs a search across all files in the workspace.
    //
    // * `regex` {RegExp} to search with.
    // * `options` (optional) {Object}
    //   * `paths` An {Array} of glob patterns to search within.
    //   * `onPathsSearched` (optional) {Function} to be periodically called
    //     with number of paths searched.
    //   * `leadingContextLineCount` {Number} default `0`; The number of lines
    //      before the matched line to include in the results object.
    //   * `trailingContextLineCount` {Number} default `0`; The number of lines
    //      after the matched line to include in the results object.
    // * `iterator` {Function} callback on each file found.
    //
    // Returns a {Promise} with a `cancel()` method that will cancel all
    // of the underlying searches that were started as part of this scan.
  }, {
    key: 'scan',
    value: function scan(regex, options, iterator) {
      var _this10 = this;

      if (options === undefined) options = {};

      if (_.isFunction(options)) {
        iterator = options;
        options = {};
      }

      // Find a searcher for every Directory in the project. Each searcher that is matched
      // will be associated with an Array of Directory objects in the Map.
      var directoriesForSearcher = new Map();
      for (var directory of this.project.getDirectories()) {
        var searcher = this.defaultDirectorySearcher;
        for (var directorySearcher of this.directorySearchers) {
          if (directorySearcher.canSearchDirectory(directory)) {
            searcher = directorySearcher;
            break;
          }
        }
        var directories = directoriesForSearcher.get(searcher);
        if (!directories) {
          directories = [];
          directoriesForSearcher.set(searcher, directories);
        }
        directories.push(directory);
      }

      // Define the onPathsSearched callback.
      var onPathsSearched = undefined;
      if (_.isFunction(options.onPathsSearched)) {
        (function () {
          // Maintain a map of directories to the number of search results. When notified of a new count,
          // replace the entry in the map and update the total.
          var onPathsSearchedOption = options.onPathsSearched;
          var totalNumberOfPathsSearched = 0;
          var numberOfPathsSearchedForSearcher = new Map();
          onPathsSearched = function (searcher, numberOfPathsSearched) {
            var oldValue = numberOfPathsSearchedForSearcher.get(searcher);
            if (oldValue) {
              totalNumberOfPathsSearched -= oldValue;
            }
            numberOfPathsSearchedForSearcher.set(searcher, numberOfPathsSearched);
            totalNumberOfPathsSearched += numberOfPathsSearched;
            return onPathsSearchedOption(totalNumberOfPathsSearched);
          };
        })();
      } else {
        onPathsSearched = function () {};
      }

      // Kick off all of the searches and unify them into one Promise.
      var allSearches = [];
      directoriesForSearcher.forEach(function (directories, searcher) {
        var searchOptions = {
          inclusions: options.paths || [],
          includeHidden: true,
          excludeVcsIgnores: _this10.config.get('core.excludeVcsIgnoredPaths'),
          exclusions: _this10.config.get('core.ignoredNames'),
          follow: _this10.config.get('core.followSymlinks'),
          leadingContextLineCount: options.leadingContextLineCount || 0,
          trailingContextLineCount: options.trailingContextLineCount || 0,
          didMatch: function didMatch(result) {
            if (!_this10.project.isPathModified(result.filePath)) {
              return iterator(result);
            }
          },
          didError: function didError(error) {
            return iterator(null, error);
          },
          didSearchPaths: function didSearchPaths(count) {
            return onPathsSearched(searcher, count);
          }
        };
        var directorySearcher = searcher.search(directories, regex, searchOptions);
        allSearches.push(directorySearcher);
      });
      var searchPromise = Promise.all(allSearches);

      for (var buffer of this.project.getBuffers()) {
        if (buffer.isModified()) {
          var filePath = buffer.getPath();
          if (!this.project.contains(filePath)) {
            continue;
          }
          var matches = [];
          buffer.scan(regex, function (match) {
            return matches.push(match);
          });
          if (matches.length > 0) {
            iterator({ filePath: filePath, matches: matches });
          }
        }
      }

      // Make sure the Promise that is returned to the client is cancelable. To be consistent
      // with the existing behavior, instead of cancel() rejecting the promise, it should
      // resolve it with the special value 'cancelled'. At least the built-in find-and-replace
      // package relies on this behavior.
      var isCancelled = false;
      var cancellablePromise = new Promise(function (resolve, reject) {
        var onSuccess = function onSuccess() {
          if (isCancelled) {
            resolve('cancelled');
          } else {
            resolve(null);
          }
        };

        var onFailure = function onFailure() {
          for (var promise of allSearches) {
            promise.cancel();
          }
          reject();
        };

        searchPromise.then(onSuccess, onFailure);
      });
      cancellablePromise.cancel = function () {
        isCancelled = true;
        // Note that cancelling all of the members of allSearches will cause all of the searches
        // to resolve, which causes searchPromise to resolve, which is ultimately what causes
        // cancellablePromise to resolve.
        allSearches.map(function (promise) {
          return promise.cancel();
        });
      };

      // Although this method claims to return a `Promise`, the `ResultsPaneView.onSearch()`
      // method in the find-and-replace package expects the object returned by this method to have a
      // `done()` method. Include a done() method until find-and-replace can be updated.
      cancellablePromise.done = function (onSuccessOrFailure) {
        cancellablePromise.then(onSuccessOrFailure, onSuccessOrFailure);
      };
      return cancellablePromise;
    }

    // Public: Performs a replace across all the specified files in the project.
    //
    // * `regex` A {RegExp} to search with.
    // * `replacementText` {String} to replace all matches of regex with.
    // * `filePaths` An {Array} of file path strings to run the replace on.
    // * `iterator` A {Function} callback on each file with replacements:
    //   * `options` {Object} with keys `filePath` and `replacements`.
    //
    // Returns a {Promise}.
  }, {
    key: 'replace',
    value: function replace(regex, replacementText, filePaths, iterator) {
      var _this11 = this;

      return new Promise(function (resolve, reject) {
        var buffer = undefined;
        var openPaths = _this11.project.getBuffers().map(function (buffer) {
          return buffer.getPath();
        });
        var outOfProcessPaths = _.difference(filePaths, openPaths);

        var inProcessFinished = !openPaths.length;
        var outOfProcessFinished = !outOfProcessPaths.length;
        var checkFinished = function checkFinished() {
          if (outOfProcessFinished && inProcessFinished) {
            resolve();
          }
        };

        if (!outOfProcessFinished.length) {
          var flags = 'g';
          if (regex.multiline) {
            flags += 'm';
          }
          if (regex.ignoreCase) {
            flags += 'i';
          }

          var task = Task.once(require.resolve('./replace-handler'), outOfProcessPaths, regex.source, flags, replacementText, function () {
            outOfProcessFinished = true;
            checkFinished();
          });

          task.on('replace:path-replaced', iterator);
          task.on('replace:file-error', function (error) {
            iterator(null, error);
          });
        }

        for (buffer of _this11.project.getBuffers()) {
          if (!filePaths.includes(buffer.getPath())) {
            continue;
          }
          var replacements = buffer.replace(regex, replacementText, iterator);
          if (replacements) {
            iterator({ filePath: buffer.getPath(), replacements: replacements });
          }
        }

        inProcessFinished = true;
        checkFinished();
      });
    }
  }, {
    key: 'checkoutHeadRevision',
    value: function checkoutHeadRevision(editor) {
      var _this12 = this;

      if (editor.getPath()) {
        var checkoutHead = function checkoutHead() {
          return _this12.project.repositoryForDirectory(new Directory(editor.getDirectoryPath())).then(function (repository) {
            return repository && repository.checkoutHeadForEditor(editor);
          });
        };

        if (this.config.get('editor.confirmCheckoutHeadRevision')) {
          this.applicationDelegate.confirm({
            message: 'Confirm Checkout HEAD Revision',
            detailedMessage: 'Are you sure you want to discard all changes to "' + editor.getFileName() + '" since the last Git commit?',
            buttons: {
              OK: checkoutHead,
              Cancel: null
            }
          });
        } else {
          return checkoutHead();
        }
      } else {
        return Promise.resolve(false);
      }
    }
  }, {
    key: 'paneContainer',
    get: function get() {
      Grim.deprecate('`atom.workspace.paneContainer` has always been private, but it is now gone. Please use `atom.workspace.getCenter()` instead and consult the workspace API docs for public methods.');
      return this.paneContainers.center.paneContainer;
    }
  }]);

  return Workspace;
})(Model);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9kaXN0aWxsZXIvYXRvbS9vdXQvYXBwL3NyYy93b3Jrc3BhY2UuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsV0FBVyxDQUFBOztBQUVYLElBQUksS0FBSyxHQUFHLFFBQVEsQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDOztBQUVwQyxJQUFJLFlBQVksR0FBRyxDQUFDLFlBQVk7QUFBRSxXQUFTLGdCQUFnQixDQUFDLE1BQU0sRUFBRSxLQUFLLEVBQUU7QUFBRSxTQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsS0FBSyxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTtBQUFFLFVBQUksVUFBVSxHQUFHLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxBQUFDLFVBQVUsQ0FBQyxVQUFVLEdBQUcsVUFBVSxDQUFDLFVBQVUsSUFBSSxLQUFLLENBQUMsQUFBQyxVQUFVLENBQUMsWUFBWSxHQUFHLElBQUksQ0FBQyxBQUFDLElBQUksT0FBTyxJQUFJLFVBQVUsRUFBRSxVQUFVLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQyxBQUFDLE1BQU0sQ0FBQyxjQUFjLENBQUMsTUFBTSxFQUFFLFVBQVUsQ0FBQyxHQUFHLEVBQUUsVUFBVSxDQUFDLENBQUM7S0FBRTtHQUFFLEFBQUMsT0FBTyxVQUFVLFdBQVcsRUFBRSxVQUFVLEVBQUUsV0FBVyxFQUFFO0FBQUUsUUFBSSxVQUFVLEVBQUUsZ0JBQWdCLENBQUMsV0FBVyxDQUFDLFNBQVMsRUFBRSxVQUFVLENBQUMsQ0FBQyxBQUFDLElBQUksV0FBVyxFQUFFLGdCQUFnQixDQUFDLFdBQVcsRUFBRSxXQUFXLENBQUMsQ0FBQyxBQUFDLE9BQU8sV0FBVyxDQUFDO0dBQUUsQ0FBQztDQUFFLENBQUEsRUFBRyxDQUFDOztBQUV0akIsSUFBSSxJQUFJLEdBQUcsU0FBUyxHQUFHLENBQUMsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUU7QUFBRSxNQUFJLE1BQU0sR0FBRyxJQUFJLENBQUMsQUFBQyxTQUFTLEVBQUUsT0FBTyxNQUFNLEVBQUU7QUFBRSxRQUFJLE1BQU0sR0FBRyxHQUFHO1FBQUUsUUFBUSxHQUFHLEdBQUc7UUFBRSxRQUFRLEdBQUcsR0FBRyxDQUFDLEFBQUMsTUFBTSxHQUFHLEtBQUssQ0FBQyxBQUFDLElBQUksTUFBTSxLQUFLLElBQUksRUFBRSxNQUFNLEdBQUcsUUFBUSxDQUFDLFNBQVMsQ0FBQyxBQUFDLElBQUksSUFBSSxHQUFHLE1BQU0sQ0FBQyx3QkFBd0IsQ0FBQyxNQUFNLEVBQUUsUUFBUSxDQUFDLENBQUMsQUFBQyxJQUFJLElBQUksS0FBSyxTQUFTLEVBQUU7QUFBRSxVQUFJLE1BQU0sR0FBRyxNQUFNLENBQUMsY0FBYyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEFBQUMsSUFBSSxNQUFNLEtBQUssSUFBSSxFQUFFO0FBQUUsZUFBTyxTQUFTLENBQUM7T0FBRSxNQUFNO0FBQUUsV0FBRyxHQUFHLE1BQU0sQ0FBQyxBQUFDLEdBQUcsR0FBRyxRQUFRLENBQUMsQUFBQyxHQUFHLEdBQUcsUUFBUSxDQUFDLEFBQUMsTUFBTSxHQUFHLElBQUksQ0FBQyxBQUFDLElBQUksR0FBRyxNQUFNLEdBQUcsU0FBUyxDQUFDLEFBQUMsU0FBUyxTQUFTLENBQUM7T0FBRTtLQUFFLE1BQU0sSUFBSSxPQUFPLElBQUksSUFBSSxFQUFFO0FBQUUsYUFBTyxJQUFJLENBQUMsS0FBSyxDQUFDO0tBQUUsTUFBTTtBQUFFLFVBQUksTUFBTSxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsQUFBQyxJQUFJLE1BQU0sS0FBSyxTQUFTLEVBQUU7QUFBRSxlQUFPLFNBQVMsQ0FBQztPQUFFLEFBQUMsT0FBTyxNQUFNLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO0tBQUU7R0FBRTtDQUFFLENBQUM7O0FBRXJwQixTQUFTLGtCQUFrQixDQUFDLEdBQUcsRUFBRTtBQUFFLE1BQUksS0FBSyxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsRUFBRTtBQUFFLFNBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLElBQUksR0FBRyxLQUFLLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsR0FBRyxHQUFHLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQUFBQyxPQUFPLElBQUksQ0FBQztHQUFFLE1BQU07QUFBRSxXQUFPLEtBQUssQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7R0FBRTtDQUFFOztBQUUvTCxTQUFTLGlCQUFpQixDQUFDLEVBQUUsRUFBRTtBQUFFLFNBQU8sWUFBWTtBQUFFLFFBQUksR0FBRyxHQUFHLEVBQUUsQ0FBQyxLQUFLLENBQUMsSUFBSSxFQUFFLFNBQVMsQ0FBQyxDQUFDLEFBQUMsT0FBTyxJQUFJLE9BQU8sQ0FBQyxVQUFVLE9BQU8sRUFBRSxNQUFNLEVBQUU7QUFBRSxVQUFJLFFBQVEsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxNQUFNLENBQUMsQ0FBQyxBQUFDLElBQUksU0FBUyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLE9BQU8sQ0FBQyxDQUFDLEFBQUMsU0FBUyxJQUFJLENBQUMsR0FBRyxFQUFFLEdBQUcsRUFBRTtBQUFFLFlBQUk7QUFBRSxjQUFJLElBQUksR0FBRyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQUFBQyxJQUFJLEtBQUssR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDO1NBQUUsQ0FBQyxPQUFPLEtBQUssRUFBRTtBQUFFLGdCQUFNLENBQUMsS0FBSyxDQUFDLENBQUMsQUFBQyxPQUFPO1NBQUUsQUFBQyxJQUFJLElBQUksQ0FBQyxJQUFJLEVBQUU7QUFBRSxpQkFBTyxDQUFDLEtBQUssQ0FBQyxDQUFDO1NBQUUsTUFBTTtBQUFFLGlCQUFPLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDLElBQUksQ0FBQyxRQUFRLEVBQUUsU0FBUyxDQUFDLENB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VUFBVSxJQUFJLFVBQVUsQ0FBQyxxQkFBcUIsQ0FBQyxNQUFNLENBQUMsQ0FBQTtXQUFBLENBQUMsQ0FBQTtTQUM5RSxDQUFBOztBQUVELFlBQUksSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsb0NBQW9DLENBQUMsRUFBRTtBQUN6RCxjQUFJLENBQUMsbUJBQW1CLENBQUMsT0FBTyxDQUFDO0FBQy9CLG1CQUFPLEVBQUUsZ0NBQWdDO0FBQ3pDLDJCQUFlLEVBQUEsbURBQUEsR0FBc0QsTUFBTSxDQUFDLFdBQVcsRUFBRSxHQUFBLDhCQUE4QjtBQUN2SCxtQkFBTyxFQUFFO0FBQ1AsZ0JBQUUsRUFBRSxZQUFZO0FBQ2hCLG9CQUFNLEVBQUUsSUFBSTthQUNiO1dBQ0YsQ0FBQyxDQUFBO1NBQ0gsTUFBTTtBQUNMLGlCQUFPLFlBQVksRUFBRSxDQUFBO1NBQ3RCO09BQ0YsTUFBTTtBQUNMLGVBQU8sT0FBTyxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQTtPQUM5QjtLQUNGO0dBaVRBLEVBQUU7QUFDRCxPQUFHLEVBQUUsZUFBZTtBQUNwQixPQUFHLEVBdmlFYSxTQUFBLEdBQUEsR0FBRztBQUNuQixVQUFJLENBQUMsU0FBUyxDQUFDLG9MQUFvTCxDQUFDLENBQUE7QUFDcE0sYUFBTyxJQUFJLENBQUMsY0FBYyxDQUFDLE1BQU0sQ0FBQyxhQUFhLENBQUE7S0FDaEQ7R0F3aUVBLENBQUMsQ0FBQyxDQUFDOztBQUVKLFNBcm1FcUIsU0FBUyxDQUFBO0NBc21FL0IsQ0FBQSxDQXRtRXdDLEtBQUssQ0E2eUQ3QyxDQUFBIiwiZmlsZSI6Ii9Vc2Vycy9kaXN0aWxsZXIvYXRvbS9vdXQvYXBwL3NyYy93b3Jrc3BhY2UuanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIGJhYmVsJ1xuXG5jb25zdCBfID0gcmVxdWlyZSgndW5kZXJzY29yZS1wbHVzJylcbmNvbnN0IHVybCA9IHJlcXVpcmUoJ3VybCcpXG5jb25zdCBwYXRoID0gcmVxdWlyZSgncGF0aCcpXG5jb25zdCB7RW1pdHRlciwgRGlzcG9zYWJsZSwgQ29tcG9zaXRlRGlzcG9zYWJsZX0gPSByZXF1aXJlKCdldmVudC1raXQnKVxuY29uc3QgZnMgPSByZXF1aXJlKCdmcy1wbHVzJylcbmNvbnN0IHtEaXJlY3Rvcnl9ID0gcmVxdWlyZSgncGF0aHdhdGNoZXInKVxuY29uc3QgR3JpbSA9IHJlcXVpcmUoJ2dyaW0nKVxuY29uc3QgRGVmYXVsdERpcmVjdG9yeVNlYXJjaGVyID0gcmVxdWlyZSgnLi9kZWZhdWx0LWRpcmVjdG9yeS1zZWFyY2hlcicpXG5jb25zdCBEb2NrID0gcmVxdWlyZSgnLi9kb2NrJylcbmNvbnN0IE1vZGVsID0gcmVxdWlyZSgnLi9tb2RlbCcpXG5jb25zdCBTdGF0ZVN0b3JlID0gcmVxdWlyZSgnLi9zdGF0ZS1zdG9yZScpXG5jb25zdCBUZXh0RWRpdG9yID0gcmVxdWlyZSgnLi90ZXh0LWVkaXRvcicpXG5jb25zdCBQYW5lbCA9IHJlcXVpcmUoJy4vcGFuZWwnKVxuY29uc3QgUGFuZWxDb250YWluZXIgPSByZXF1aXJlKCcuL3BhbmVsLWNvbnRhaW5lcicpXG5jb25zdCBUYXNrID0gcmVxdWlyZSgnLi90YXNrJylcbmNvbnN0IFdvcmtzcGFjZUNlbnRlciA9IHJlcXVpcmUoJy4vd29ya3NwYWNlLWNlbnRlcicpXG5jb25zdCBXb3Jrc3BhY2VFbGVtZW50ID0gcmVxdWlyZSgnLi93b3Jrc3BhY2UtZWxlbWVudCcpXG5cbmNvbnN0IFNUT1BQRURfQ0hBTkdJTkdfQUNUSVZFX1BBTkVfSVRFTV9ERUxBWSA9IDEwMFxuY29uc3QgQUxMX0xPQ0FUSU9OUyA9IFsnY2VudGVyJywgJ2xlZnQnLCAncmlnaHQnLCAnYm90dG9tJ11cblxuLy8gRXNzZW50aWFsOiBSZXByZXNlbnRzIHRoZSBzdGF0ZSBvZiB0aGUgdXNlciBpbnRlcmZhY2UgZm9yIHRoZSBlbnRpcmUgd2luZG93LlxuLy8gQW4gaW5zdGFuY2Ugb2YgdGhpcyBjbGFzcyBpcyBhdmFpbGFibGUgdmlhIHRoZSBgYXRvbS53b3Jrc3BhY2VgIGdsb2JhbC5cbi8vXG4vLyBJbnRlcmFjdCB3aXRoIHRoaXMgb2JqZWN0IHRvIG9wZW4gZmlsZXMsIGJlIG5vdGlmaWVkIG9mIGN1cnJlbnQgYW5kIGZ1dHVyZVxuLy8gZWRpdG9ycywgYW5kIG1hbmlwdWxhdGUgcGFuZXMuIFRvIGFkZCBwYW5lbHMsIHVzZSB7V29ya3NwYWNlOjphZGRUb3BQYW5lbH1cbi8vIGFuZCBmcmllbmRzLlxuLy9cbi8vICMjIFdvcmtzcGFjZSBJdGVtc1xuLy9cbi8vIFRoZSB0ZXJtIFwiaXRlbVwiIHJlZmVycyB0byBhbnl0aGluZyB0aGF0IGNhbiBiZSBkaXNwbGF5ZWRcbi8vIGluIGEgcGFuZSB3aXRoaW4gdGhlIHdvcmtzcGFjZSwgZWl0aGVyIGluIHRoZSB7V29ya3NwYWNlQ2VudGVyfSBvciBpbiBvbmVcbi8vIG9mIHRoZSB0aHJlZSB7RG9ja31zLiBUaGUgd29ya3NwYWNlIGV4cGVjdHMgaXRlbXMgdG8gY29uZm9ybSB0byB0aGVcbi8vIGZvbGxvd2luZyBpbnRlcmZhY2U6XG4vL1xuLy8gIyMjIFJlcXVpcmVkIE1ldGhvZHNcbi8vXG4vLyAjIyMjIGBnZXRUaXRsZSgpYFxuLy9cbi8vIFJldHVybnMgYSB7U3RyaW5nfSBjb250YWluaW5nIHRoZSB0aXRsZSBvZiB0aGUgaXRlbSB0byBkaXNwbGF5IG9uIGl0c1xuLy8gYXNzb2NpYXRlZCB0YWIuXG4vL1xuLy8gIyMjIE9wdGlvbmFsIE1ldGhvZHNcbi8vXG4vLyAjIyMjIGBnZXRFbGVtZW50KClgXG4vL1xuLy8gSWYgeW91ciBpdGVtIGFscmVhZHkgKmlzKiBhIERPTSBlbGVtZW50LCB5b3UgZG8gbm90IG5lZWQgdG8gaW1wbGVtZW50IHRoaXNcbi8vIG1ldGhvZC4gT3RoZXJ3aXNlIGl0IHNob3VsZCByZXR1cm4gdGhlIGVsZW1lbnQgeW91IHdhbnQgdG8gZGlzcGxheSB0b1xuLy8gcmVwcmVzZW50IHRoaXMgaXRlbS5cbi8vXG4vLyAjIyMjIGBkZXN0cm95KClgXG4vL1xuLy8gRGVzdHJveXMgdGhlIGl0ZW0uIFRoaXMgd2lsbCBiZSBjYWxsZWQgd2hlbiB0aGUgaXRlbSBpcyByZW1vdmVkIGZyb20gaXRzXG4vLyBwYXJlbnQgcGFuZS5cbi8vXG4vLyAjIyMjIGBvbkRpZERlc3Ryb3koY2FsbGJhY2spYFxuLy9cbi8vIENhbGxlZCBieSB0aGUgd29ya3NwYWNlIHNvIGl0IGNhbiBiZSBub3RpZmllZCB3aGVuIHRoZSBpdGVtIGlzIGRlc3Ryb3llZC5cbi8vIE11c3QgcmV0dXJuIGEge0Rpc3Bvc2FibGV9LlxuLy9cbi8vICMjIyMgYHNlcmlhbGl6ZSgpYFxuLy9cbi8vIFNlcmlhbGl6ZSB0aGUgc3RhdGUgb2YgdGhlIGl0ZW0uIE11c3QgcmV0dXJuIGFuIG9iamVjdCB0aGF0IGNhbiBiZSBwYXNzZWQgdG9cbi8vIGBKU09OLnN0cmluZ2lmeWAuIFRoZSBzdGF0ZSBzaG91bGQgaW5jbHVkZSBhIGZpZWxkIGNhbGxlZCBgZGVzZXJpYWxpemVyYCxcbi8vIHdoaWNoIG5hbWVzIGEgZGVzZXJpYWxpemVyIGRlY2xhcmVkIGluIHlvdXIgYHBhY2thZ2UuanNvbmAuIFRoaXMgbWV0aG9kIGlzXG4vLyBpbnZva2VkIG9uIGl0ZW1zIHdoZW4gc2VyaWFsaXppbmcgdGhlIHdvcmtzcGFjZSBzbyB0aGV5IGNhbiBiZSByZXN0b3JlZCB0b1xuLy8gdGhlIHNhbWUgbG9jYXRpb24gbGF0ZXIuXG4vL1xuLy8gIyMjIyBgZ2V0VVJJKClgXG4vL1xuLy8gUmV0dXJucyB0aGUgVVJJIGFzc29jaWF0ZWQgd2l0aCB0aGUgaXRlbS5cbi8vXG4vLyAjIyMjIGBnZXRMb25nVGl0bGUoKWBcbi8vXG4vLyBSZXR1cm5zIGEge1N0cmluZ30gY29udGFpbmluZyBhIGxvbmdlciB2ZXJzaW9uIG9mIHRoZSB0aXRsZSB0byBkaXNwbGF5IGluXG4vLyBwbGFjZXMgbGlrZSB0aGUgd2luZG93IHRpdGxlIG9yIG9uIHRhYnMgdGhlaXIgc2hvcnQgdGl0bGVzIGFyZSBhbWJpZ3VvdXMuXG4vL1xuLy8gIyMjIyBgb25EaWRDaGFuZ2VUaXRsZWBcbi8vXG4vLyBDYWxsZWQgYnkgdGhlIHdvcmtzcGFjZSBzbyBpdCBjYW4gYmUgbm90aWZpZWQgd2hlbiB0aGUgaXRlbSdzIHRpdGxlIGNoYW5nZXMuXG4vLyBNdXN0IHJldHVybiBhIHtEaXNwb3NhYmxlfS5cbi8vXG4vLyAjIyMjIGBnZXRJY29uTmFtZSgpYFxuLy9cbi8vIFJldHVybiBhIHtTdHJpbmd9IHdpdGggdGhlIG5hbWUgb2YgYW4gaWNvbi4gSWYgdGhpcyBtZXRob2QgaXMgZGVmaW5lZCBhbmRcbi8vIHJldHVybnMgYSBzdHJpbmcsIHRoZSBpdGVtJ3MgdGFiIGVsZW1lbnQgd2lsbCBiZSByZW5kZXJlZCB3aXRoIHRoZSBgaWNvbmAgYW5kXG4vLyBgaWNvbi0ke2ljb25OYW1lfWAgQ1NTIGNsYXNzZXMuXG4vL1xuLy8gIyMjIGBvbkRpZENoYW5nZUljb24oY2FsbGJhY2spYFxuLy9cbi8vIENhbGxlZCBieSB0aGUgd29ya3NwYWNlIHNvIGl0IGNhbiBiZSBub3RpZmllZCB3aGVuIHRoZSBpdGVtJ3MgaWNvbiBjaGFuZ2VzLlxuLy8gTXVzdCByZXR1cm4gYSB7RGlzcG9zYWJsZX0uXG4vL1xuLy8gIyMjIyBgZ2V0RGVmYXVsdExvY2F0aW9uKClgXG4vL1xuLy8gVGVsbHMgdGhlIHdvcmtzcGFjZSB3aGVyZSB5b3VyIGl0ZW0gc2hvdWxkIGJlIG9wZW5lZCBpbiBhYnNlbmNlIG9mIGEgdXNlclxuLy8gb3ZlcnJpZGUuIEl0ZW1zIGNhbiBhcHBlYXIgaW4gdGhlIGNlbnRlciBvciBpbiBhIGRvY2sgb24gdGhlIGxlZnQsIHJpZ2h0LCBvclxuLy8gYm90dG9tIG9mIHRoZSB3b3Jrc3BhY2UuXG4vL1xuLy8gUmV0dXJucyBhIHtTdHJpbmd9IHdpdGggb25lIG9mIHRoZSBmb2xsb3dpbmcgdmFsdWVzOiBgJ2NlbnRlcidgLCBgJ2xlZnQnYCxcbi8vIGAncmlnaHQnYCwgYCdib3R0b20nYC4gSWYgdGhpcyBtZXRob2QgaXMgbm90IGRlZmluZWQsIGAnY2VudGVyJ2AgaXMgdGhlXG4vLyBkZWZhdWx0LlxuLy9cbi8vICMjIyMgYGdldEFsbG93ZWRMb2NhdGlvbnMoKWBcbi8vXG4vLyBUZWxscyB0aGUgd29ya3NwYWNlIHdoZXJlIHRoaXMgaXRlbSBjYW4gYmUgbW92ZWQuIFJldHVybnMgYW4ge0FycmF5fSBvZiBvbmVcbi8vIG9yIG1vcmUgb2YgdGhlIGZvbGxvd2luZyB2YWx1ZXM6IGAnY2VudGVyJ2AsIGAnbGVmdCdgLCBgJ3JpZ2h0J2AsIG9yXG4vLyBgJ2JvdHRvbSdgLlxuLy9cbi8vICMjIyMgYGlzUGVybWFuZW50RG9ja0l0ZW0oKWBcbi8vXG4vLyBUZWxscyB0aGUgd29ya3NwYWNlIHdoZXRoZXIgb3Igbm90IHRoaXMgaXRlbSBjYW4gYmUgY2xvc2VkIGJ5IHRoZSB1c2VyIGJ5XG4vLyBjbGlja2luZyBhbiBgeGAgb24gaXRzIHRhYi4gVXNlIG9mIHRoaXMgZmVhdHVyZSBpcyBkaXNjb3VyYWdlZCB1bmxlc3MgdGhlcmUnc1xuLy8gYSB2ZXJ5IGdvb2QgcmVhc29uIG5vdCB0byBhbGxvdyB1c2VycyB0byBjbG9zZSB5b3VyIGl0ZW0uIEl0ZW1zIGNhbiBiZSBtYWRlXG4vLyBwZXJtYW5lbnQgKm9ubHkqIHdoZW4gdGhleSBhcmUgY29udGFpbmVkIGluIGRvY2tzLiBDZW50ZXIgcGFuZSBpdGVtcyBjYW5cbi8vIGFsd2F5cyBiZSByZW1vdmVkLiBOb3RlIHRoYXQgaXQgaXMgY3VycmVudGx5IHN0aWxsIHBvc3NpYmxlIHRvIGNsb3NlIGRvY2tcbi8vIGl0ZW1zIHZpYSB0aGUgYENsb3NlIFBhbmVgIG9wdGlvbiBpbiB0aGUgY29udGV4dCBtZW51IGFuZCB2aWEgQXRvbSBBUElzLCBzb1xuLy8geW91IHNob3VsZCBzdGlsbCBiZSBwcmVwYXJlZCB0byBoYW5kbGUgeW91ciBkb2NrIGl0ZW1zIGJlaW5nIGRlc3Ryb3llZCBieSB0aGVcbi8vIHVzZXIgZXZlbiBpZiB5b3UgaW1wbGVtZW50IHRoaXMgbWV0aG9kLlxuLy9cbi8vICMjIyMgYHNhdmUoKWBcbi8vXG4vLyBTYXZlcyB0aGUgaXRlbS5cbi8vXG4vLyAjIyMjIGBzYXZlQXMocGF0aClgXG4vL1xuLy8gU2F2ZXMgdGhlIGl0ZW0gdG8gdGhlIHNwZWNpZmllZCBwYXRoLlxuLy9cbi8vICMjIyMgYGdldFBhdGgoKWBcbi8vXG4vLyBSZXR1cm5zIHRoZSBsb2NhbCBwYXRoIGFzc29jaWF0ZWQgd2l0aCB0aGlzIGl0ZW0uIFRoaXMgaXMgb25seSB1c2VkIHRvIHNldFxuLy8gdGhlIGluaXRpYWwgbG9jYXRpb24gb2YgdGhlIFwic2F2ZSBhc1wiIGRpYWxvZy5cbi8vXG4vLyAjIyMjIGBpc01vZGlmaWVkKClgXG4vL1xuLy8gUmV0dXJucyB3aGV0aGVyIG9yIG5vdCB0aGUgaXRlbSBpcyBtb2RpZmllZCB0byByZWZsZWN0IG1vZGlmaWNhdGlvbiBpbiB0aGVcbi8vIFVJLlxuLy9cbi8vICMjIyMgYG9uRGlkQ2hhbmdlTW9kaWZpZWQoKWBcbi8vXG4vLyBDYWxsZWQgYnkgdGhlIHdvcmtzcGFjZSBzbyBpdCBjYW4gYmUgbm90aWZpZWQgd2hlbiBpdGVtJ3MgbW9kaWZpZWQgc3RhdHVzXG4vLyBjaGFuZ2VzLiBNdXN0IHJldHVybiBhIHtEaXNwb3NhYmxlfS5cbi8vXG4vLyAjIyMjIGBjb3B5KClgXG4vL1xuLy8gQ3JlYXRlIGEgY29weSBvZiB0aGUgaXRlbS4gSWYgZGVmaW5lZCwgdGhlIHdvcmtzcGFjZSB3aWxsIGNhbGwgdGhpcyBtZXRob2QgdG9cbi8vIGR1cGxpY2F0ZSB0aGUgaXRlbSB3aGVuIHNwbGl0dGluZyBwYW5lcyB2aWEgY2VydGFpbiBzcGxpdCBjb21tYW5kcy5cbi8vXG4vLyAjIyMjIGBnZXRQcmVmZXJyZWRIZWlnaHQoKWBcbi8vXG4vLyBJZiB0aGlzIGl0ZW0gaXMgZGlzcGxheWVkIGluIHRoZSBib3R0b20ge0RvY2t9LCBjYWxsZWQgYnkgdGhlIHdvcmtzcGFjZSB3aGVuXG4vLyBpbml0aWFsbHkgZGlzcGxheWluZyB0aGUgZG9jayB0byBzZXQgaXRzIGhlaWdodC4gT25jZSB0aGUgZG9jayBoYXMgYmVlblxuLy8gcmVzaXplZCBieSB0aGUgdXNlciwgdGhlaXIgaGVpZ2h0IHdpbGwgb3ZlcnJpZGUgdGhpcyB2YWx1ZS5cbi8vXG4vLyBSZXR1cm5zIGEge051bWJlcn0uXG4vL1xuLy8gIyMjIyBgZ2V0UHJlZmVycmVkV2lkdGgoKWBcbi8vXG4vLyBJZiB0aGlzIGl0ZW0gaXMgZGlzcGxheWVkIGluIHRoZSBsZWZ0IG9yIHJpZ2h0IHtEb2NrfSwgY2FsbGVkIGJ5IHRoZVxuLy8gd29ya3NwYWNlIHdoZW4gaW5pdGlhbGx5IGRpc3BsYXlpbmcgdGhlIGRvY2sgdG8gc2V0IGl0cyB3aWR0aC4gT25jZSB0aGUgZG9ja1xuLy8gaGFzIGJlZW4gcmVzaXplZCBieSB0aGUgdXNlciwgdGhlaXIgd2lkdGggd2lsbCBvdmVycmlkZSB0aGlzIHZhbHVlLlxuLy9cbi8vIFJldHVybnMgYSB7TnVtYmVyfS5cbi8vXG4vLyAjIyMjIGBvbkRpZFRlcm1pbmF0ZVBlbmRpbmdTdGF0ZShjYWxsYmFjaylgXG4vL1xuLy8gSWYgdGhlIHdvcmtzcGFjZSBpcyBjb25maWd1cmVkIHRvIHVzZSAqcGVuZGluZyBwYW5lIGl0ZW1zKiwgdGhlIHdvcmtzcGFjZVxuLy8gd2lsbCBzdWJzY3JpYmUgdG8gdGhpcyBtZXRob2QgdG8gdGVybWluYXRlIHRoZSBwZW5kaW5nIHN0YXRlIG9mIHRoZSBpdGVtLlxuLy8gTXVzdCByZXR1cm4gYSB7RGlzcG9zYWJsZX0uXG4vL1xuLy8gIyMjIyBgc2hvdWxkUHJvbXB0VG9TYXZlKClgXG4vL1xuLy8gVGhpcyBtZXRob2QgaW5kaWNhdGVzIHdoZXRoZXIgQXRvbSBzaG91bGQgcHJvbXB0IHRoZSB1c2VyIHRvIHNhdmUgdGhpcyBpdGVtXG4vLyB3aGVuIHRoZSB1c2VyIGNsb3NlcyBvciByZWxvYWRzIHRoZSB3aW5kb3cuIFJldHVybnMgYSBib29sZWFuLlxubW9kdWxlLmV4cG9ydHMgPSBjbGFzcyBXb3Jrc3BhY2UgZXh0ZW5kcyBNb2RlbCB7XG4gIGNvbnN0cnVjdG9yIChwYXJhbXMpIHtcbiAgICBzdXBlciguLi5hcmd1bWVudHMpXG5cbiAgICB0aGlzLnVwZGF0ZVdpbmRvd1RpdGxlID0gdGhpcy51cGRhdGVXaW5kb3dUaXRsZS5iaW5kKHRoaXMpXG4gICAgdGhpcy51cGRhdGVEb2N1bWVudEVkaXRlZCA9IHRoaXMudXBkYXRlRG9jdW1lbnRFZGl0ZWQuYmluZCh0aGlzKVxuICAgIHRoaXMuZGlkRGVzdHJveVBhbmVJdGVtID0gdGhpcy5kaWREZXN0cm95UGFuZUl0ZW0uYmluZCh0aGlzKVxuICAgIHRoaXMuZGlkQ2hhbmdlQWN0aXZlUGFuZU9uUGFuZUNvbnRhaW5lciA9IHRoaXMuZGlkQ2hhbmdlQWN0aXZlUGFuZU9uUGFuZUNvbnRhaW5lci5iaW5kKHRoaXMpXG4gICAgdGhpcy5kaWRDaGFuZ2VBY3RpdmVQYW5lSXRlbU9uUGFuZUNvbnRhaW5lciA9IHRoaXMuZGlkQ2hhbmdlQWN0aXZlUGFuZUl0ZW1PblBhbmVDb250YWluZXIuYmluZCh0aGlzKVxuICAgIHRoaXMuZGlkQWN0aXZhdGVQYW5lQ29udGFpbmVyID0gdGhpcy5kaWRBY3RpdmF0ZVBhbmVDb250YWluZXIuYmluZCh0aGlzKVxuXG4gICAgdGhpcy5lbmFibGVQZXJzaXN0ZW5jZSA9IHBhcmFtcy5lbmFibGVQZXJzaXN0ZW5jZVxuICAgIHRoaXMucGFja2FnZU1hbmFnZXIgPSBwYXJhbXMucGFja2FnZU1hbmFnZXJcbiAgICB0aGlzLmNvbmZpZyA9IHBhcmFtcy5jb25maWdcbiAgICB0aGlzLnByb2plY3QgPSBwYXJhbXMucHJvamVjdFxuICAgIHRoaXMubm90aWZpY2F0aW9uTWFuYWdlciA9IHBhcmFtcy5ub3RpZmljYXRpb25NYW5hZ2VyXG4gICAgdGhpcy52aWV3UmVnaXN0cnkgPSBwYXJhbXMudmlld1JlZ2lzdHJ5XG4gICAgdGhpcy5ncmFtbWFyUmVnaXN0cnkgPSBwYXJhbXMuZ3JhbW1hclJlZ2lzdHJ5XG4gICAgdGhpcy5hcHBsaWNhdGlvbkRlbGVnYXRlID0gcGFyYW1zLmFwcGxpY2F0aW9uRGVsZWdhdGVcbiAgICB0aGlzLmFzc2VydCA9IHBhcmFtcy5hc3NlcnRcbiAgICB0aGlzLmRlc2VyaWFsaXplck1hbmFnZXIgPSBwYXJhbXMuZGVzZXJpYWxpemVyTWFuYWdlclxuICAgIHRoaXMudGV4dEVkaXRvclJlZ2lzdHJ5ID0gcGFyYW1zLnRleHRFZGl0b3JSZWdpc3RyeVxuICAgIHRoaXMuc3R5bGVNYW5hZ2VyID0gcGFyYW1zLnN0eWxlTWFuYWdlclxuICAgIHRoaXMuZHJhZ2dpbmdJdGVtID0gZmFsc2VcbiAgICB0aGlzLml0ZW1Mb2NhdGlvblN0b3JlID0gbmV3IFN0YXRlU3RvcmUoJ0F0b21QcmV2aW91c0l0ZW1Mb2NhdGlvbnMnLCAxKVxuXG4gICAgdGhpcy5lbWl0dGVyID0gbmV3IEVtaXR0ZXIoKVxuICAgIHRoaXMub3BlbmVycyA9IFtdXG4gICAgdGhpcy5kZXN0cm95ZWRJdGVtVVJJcyA9IFtdXG4gICAgdGhpcy5zdG9wcGVkQ2hhbmdpbmdBY3RpdmVQYW5lSXRlbVRpbWVvdXQgPSBudWxsXG5cbiAgICB0aGlzLmRlZmF1bHREaXJlY3RvcnlTZWFyY2hlciA9IG5ldyBEZWZhdWx0RGlyZWN0b3J5U2VhcmNoZXIoKVxuICAgIHRoaXMuY29uc3VtZVNlcnZpY2VzKHRoaXMucGFja2FnZU1hbmFnZXIpXG5cbiAgICB0aGlzLnBhbmVDb250YWluZXJzID0ge1xuICAgICAgY2VudGVyOiB0aGlzLmNyZWF0ZUNlbnRlcigpLFxuICAgICAgbGVmdDogdGhpcy5jcmVhdGVEb2NrKCdsZWZ0JyksXG4gICAgICByaWdodDogdGhpcy5jcmVhdGVEb2NrKCdyaWdodCcpLFxuICAgICAgYm90dG9tOiB0aGlzLmNyZWF0ZURvY2soJ2JvdHRvbScpXG4gICAgfVxuICAgIHRoaXMuYWN0aXZlUGFuZUNvbnRhaW5lciA9IHRoaXMucGFuZUNvbnRhaW5lcnMuY2VudGVyXG4gICAgdGhpcy5oYXNBY3RpdmVUZXh0RWRpdG9yID0gZmFsc2VcblxuICAgIHRoaXMucGFuZWxDb250YWluZXJzID0ge1xuICAgICAgdG9wOiBuZXcgUGFuZWxDb250YWluZXIoe3ZpZXdSZWdpc3RyeTogdGhpcy52aWV3UmVnaXN0cnksIGxvY2F0aW9uOiAndG9wJ30pLFxuICAgICAgbGVmdDogbmV3IFBhbmVsQ29udGFpbmVyKHt2aWV3UmVnaXN0cnk6IHRoaXMudmlld1JlZ2lzdHJ5LCBsb2NhdGlvbjogJ2xlZnQnLCBkb2NrOiB0aGlzLnBhbmVDb250YWluZXJzLmxlZnR9KSxcbiAgICAgIHJpZ2h0OiBuZXcgUGFuZWxDb250YWluZXIoe3ZpZXdSZWdpc3RyeTogdGhpcy52aWV3UmVnaXN0cnksIGxvY2F0aW9uOiAncmlnaHQnLCBkb2NrOiB0aGlzLnBhbmVDb250YWluZXJzLnJpZ2h0fSksXG4gICAgICBib3R0b206IG5ldyBQYW5lbENvbnRhaW5lcih7dmlld1JlZ2lzdHJ5OiB0aGlzLnZpZXdSZWdpc3RyeSwgbG9jYXRpb246ICdib3R0b20nLCBkb2NrOiB0aGlzLnBhbmVDb250YWluZXJzLmJvdHRvbX0pLFxuICAgICAgaGVhZGVyOiBuZXcgUGFuZWxDb250YWluZXIoe3ZpZXdSZWdpc3RyeTogdGhpcy52aWV3UmVnaXN0cnksIGxvY2F0aW9uOiAnaGVhZGVyJ30pLFxuICAgICAgZm9vdGVyOiBuZXcgUGFuZWxDb250YWluZXIoe3ZpZXdSZWdpc3RyeTogdGhpcy52aWV3UmVnaXN0cnksIGxvY2F0aW9uOiAnZm9vdGVyJ30pLFxuICAgICAgbW9kYWw6IG5ldyBQYW5lbENvbnRhaW5lcih7dmlld1JlZ2lzdHJ5OiB0aGlzLnZpZXdSZWdpc3RyeSwgbG9jYXRpb246ICdtb2RhbCd9KVxuICAgIH1cblxuICAgIHRoaXMuc3Vic2NyaWJlVG9FdmVudHMoKVxuICB9XG5cbiAgZ2V0IHBhbmVDb250YWluZXIgKCkge1xuICAgIEdyaW0uZGVwcmVjYXRlKCdgYXRvbS53b3Jrc3BhY2UucGFuZUNvbnRhaW5lcmAgaGFzIGFsd2F5cyBiZWVuIHByaXZhdGUsIGJ1dCBpdCBpcyBub3cgZ29uZS4gUGxlYXNlIHVzZSBgYXRvbS53b3Jrc3BhY2UuZ2V0Q2VudGVyKClgIGluc3RlYWQgYW5kIGNvbnN1bHQgdGhlIHdvcmtzcGFjZSBBUEkgZG9jcyBmb3IgcHVibGljIG1ldGhvZHMuJylcbiAgICByZXR1cm4gdGhpcy5wYW5lQ29udGFpbmVycy5jZW50ZXIucGFuZUNvbnRhaW5lclxuICB9XG5cbiAgZ2V0RWxlbWVudCAoKSB7XG4gICAgaWYgKCF0aGlzLmVsZW1lbnQpIHtcbiAgICAgIHRoaXMuZWxlbWVudCA9IG5ldyBXb3Jrc3BhY2VFbGVtZW50KCkuaW5pdGlhbGl6ZSh0aGlzLCB7XG4gICAgICAgIGNvbmZpZzogdGhpcy5jb25maWcsXG4gICAgICAgIHByb2plY3Q6IHRoaXMucHJvamVjdCxcbiAgICAgICAgdmlld1JlZ2lzdHJ5OiB0aGlzLnZpZXdSZWdpc3RyeSxcbiAgICAgICAgc3R5bGVNYW5hZ2VyOiB0aGlzLnN0eWxlTWFuYWdlclxuICAgICAgfSlcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMuZWxlbWVudFxuICB9XG5cbiAgY3JlYXRlQ2VudGVyICgpIHtcbiAgICByZXR1cm4gbmV3IFdvcmtzcGFjZUNlbnRlcih7XG4gICAgICBjb25maWc6IHRoaXMuY29uZmlnLFxuICAgICAgYXBwbGljYXRpb25EZWxlZ2F0ZTogdGhpcy5hcHBsaWNhdGlvbkRlbGVnYXRlLFxuICAgICAgbm90aWZpY2F0aW9uTWFuYWdlcjogdGhpcy5ub3RpZmljYXRpb25NYW5hZ2VyLFxuICAgICAgZGVzZXJpYWxpemVyTWFuYWdlcjogdGhpcy5kZXNlcmlhbGl6ZXJNYW5hZ2VyLFxuICAgICAgdmlld1JlZ2lzdHJ5OiB0aGlzLnZpZXdSZWdpc3RyeSxcbiAgICAgIGRpZEFjdGl2YXRlOiB0aGlzLmRpZEFjdGl2YXRlUGFuZUNvbnRhaW5lcixcbiAgICAgIGRpZENoYW5nZUFjdGl2ZVBhbmU6IHRoaXMuZGlkQ2hhbmdlQWN0aXZlUGFuZU9uUGFuZUNvbnRhaW5lcixcbiAgICAgIGRpZENoYW5nZUFjdGl2ZVBhbmVJdGVtOiB0aGlzLmRpZENoYW5nZUFjdGl2ZVBhbmVJdGVtT25QYW5lQ29udGFpbmVyLFxuICAgICAgZGlkRGVzdHJveVBhbmVJdGVtOiB0aGlzLmRpZERlc3Ryb3lQYW5lSXRlbVxuICAgIH0pXG4gIH1cblxuICBjcmVhdGVEb2NrIChsb2NhdGlvbikge1xuICAgIHJldHVybiBuZXcgRG9jayh7XG4gICAgICBsb2NhdGlvbixcbiAgICAgIGNvbmZpZzogdGhpcy5jb25maWcsXG4gICAgICBhcHBsaWNhdGlvbkRlbGVnYXRlOiB0aGlzLmFwcGxpY2F0aW9uRGVsZWdhdGUsXG4gICAgICBkZXNlcmlhbGl6ZXJNYW5hZ2VyOiB0aGlzLmRlc2VyaWFsaXplck1hbmFnZXIsXG4gICAgICBub3RpZmljYXRpb25NYW5hZ2VyOiB0aGlzLm5vdGlmaWNhdGlvbk1hbmFnZXIsXG4gICAgICB2aWV3UmVnaXN0cnk6IHRoaXMudmlld1JlZ2lzdHJ5LFxuICAgICAgZGlkQWN0aXZhdGU6IHRoaXMuZGlkQWN0aXZhdGVQYW5lQ29udGFpbmVyLFxuICAgICAgZGlkQ2hhbmdlQWN0aXZlUGFuZTogdGhpcy5kaWRDaGFuZ2VBY3RpdmVQYW5lT25QYW5lQ29udGFpbmVyLFxuICAgICAgZGlkQ2hhbmdlQWN0aXZlUGFuZUl0ZW06IHRoaXMuZGlkQ2hhbmdlQWN0aXZlUGFuZUl0ZW1PblBhbmVDb250YWluZXIsXG4gICAgICBkaWREZXN0cm95UGFuZUl0ZW06IHRoaXMuZGlkRGVzdHJveVBhbmVJdGVtXG4gICAgfSlcbiAgfVxuXG4gIHJlc2V0IChwYWNrYWdlTWFuYWdlcikge1xuICAgIHRoaXMucGFja2FnZU1hbmFnZXIgPSBwYWNrYWdlTWFuYWdlclxuICAgIHRoaXMuZW1pdHRlci5kaXNwb3NlKClcbiAgICB0aGlzLmVtaXR0ZXIgPSBuZXcgRW1pdHRlcigpXG5cbiAgICB0aGlzLnBhbmVDb250YWluZXJzLmNlbnRlci5kZXN0cm95KClcbiAgICB0aGlzLnBhbmVDb250YWluZXJzLmxlZnQuZGVzdHJveSgpXG4gICAgdGhpcy5wYW5lQ29udGFpbmVycy5yaWdodC5kZXN0cm95KClcbiAgICB0aGlzLnBhbmVDb250YWluZXJzLmJvdHRvbS5kZXN0cm95KClcblxuICAgIF8udmFsdWVzKHRoaXMucGFuZWxDb250YWluZXJzKS5mb3JFYWNoKHBhbmVsQ29udGFpbmVyID0+IHsgcGFuZWxDb250YWluZXIuZGVzdHJveSgpIH0pXG5cbiAgICB0aGlzLnBhbmVDb250YWluZXJzID0ge1xuICAgICAgY2VudGVyOiB0aGlzLmNyZWF0ZUNlbnRlcigpLFxuICAgICAgbGVmdDogdGhpcy5jcmVhdGVEb2NrKCdsZWZ0JyksXG4gICAgICByaWdodDogdGhpcy5jcmVhdGVEb2NrKCdyaWdodCcpLFxuICAgICAgYm90dG9tOiB0aGlzLmNyZWF0ZURvY2soJ2JvdHRvbScpXG4gICAgfVxuICAgIHRoaXMuYWN0aXZlUGFuZUNvbnRhaW5lciA9IHRoaXMucGFuZUNvbnRhaW5lcnMuY2VudGVyXG4gICAgdGhpcy5oYXNBY3RpdmVUZXh0RWRpdG9yID0gZmFsc2VcblxuICAgIHRoaXMucGFuZWxDb250YWluZXJzID0ge1xuICAgICAgdG9wOiBuZXcgUGFuZWxDb250YWluZXIoe3ZpZXdSZWdpc3RyeTogdGhpcy52aWV3UmVnaXN0cnksIGxvY2F0aW9uOiAndG9wJ30pLFxuICAgICAgbGVmdDogbmV3IFBhbmVsQ29udGFpbmVyKHt2aWV3UmVnaXN0cnk6IHRoaXMudmlld1JlZ2lzdHJ5LCBsb2NhdGlvbjogJ2xlZnQnLCBkb2NrOiB0aGlzLnBhbmVDb250YWluZXJzLmxlZnR9KSxcbiAgICAgIHJpZ2h0OiBuZXcgUGFuZWxDb250YWluZXIoe3ZpZXdSZWdpc3RyeTogdGhpcy52aWV3UmVnaXN0cnksIGxvY2F0aW9uOiAncmlnaHQnLCBkb2NrOiB0aGlzLnBhbmVDb250YWluZXJzLnJpZ2h0fSksXG4gICAgICBib3R0b206IG5ldyBQYW5lbENvbnRhaW5lcih7dmlld1JlZ2lzdHJ5OiB0aGlzLnZpZXdSZWdpc3RyeSwgbG9jYXRpb246ICdib3R0b20nLCBkb2NrOiB0aGlzLnBhbmVDb250YWluZXJzLmJvdHRvbX0pLFxuICAgICAgaGVhZGVyOiBuZXcgUGFuZWxDb250YWluZXIoe3ZpZXdSZWdpc3RyeTogdGhpcy52aWV3UmVnaXN0cnksIGxvY2F0aW9uOiAnaGVhZGVyJ30pLFxuICAgICAgZm9vdGVyOiBuZXcgUGFuZWxDb250YWluZXIoe3ZpZXdSZWdpc3RyeTogdGhpcy52aWV3UmVnaXN0cnksIGxvY2F0aW9uOiAnZm9vdGVyJ30pLFxuICAgICAgbW9kYWw6IG5ldyBQYW5lbENvbnRhaW5lcih7dmlld1JlZ2lzdHJ5OiB0aGlzLnZpZXdSZWdpc3RyeSwgbG9jYXRpb246ICdtb2RhbCd9KVxuICAgIH1cblxuICAgIHRoaXMub3JpZ2luYWxGb250U2l6ZSA9IG51bGxcbiAgICB0aGlzLm9wZW5lcnMgPSBbXVxuICAgIHRoaXMuZGVzdHJveWVkSXRlbVVSSXMgPSBbXVxuICAgIHRoaXMuZWxlbWVudCA9IG51bGxcbiAgICB0aGlzLmNvbnN1bWVTZXJ2aWNlcyh0aGlzLnBhY2thZ2VNYW5hZ2VyKVxuICB9XG5cbiAgc3Vic2NyaWJlVG9FdmVudHMgKCkge1xuICAgIHRoaXMucHJvamVjdC5vbkRpZENoYW5nZVBhdGhzKHRoaXMudXBkYXRlV2luZG93VGl0bGUpXG4gICAgdGhpcy5zdWJzY3JpYmVUb0ZvbnRTaXplKClcbiAgICB0aGlzLnN1YnNjcmliZVRvQWRkZWRJdGVtcygpXG4gICAgdGhpcy5zdWJzY3JpYmVUb01vdmVkSXRlbXMoKVxuICAgIHRoaXMuc3Vic2NyaWJlVG9Eb2NrVG9nZ2xpbmcoKVxuICB9XG5cbiAgY29uc3VtZVNlcnZpY2VzICh7c2VydmljZUh1Yn0pIHtcbiAgICB0aGlzLmRpcmVjdG9yeVNlYXJjaGVycyA9IFtdXG4gICAgc2VydmljZUh1Yi5jb25zdW1lKFxuICAgICAgJ2F0b20uZGlyZWN0b3J5LXNlYXJjaGVyJyxcbiAgICAgICdeMC4xLjAnLFxuICAgICAgcHJvdmlkZXIgPT4gdGhpcy5kaXJlY3RvcnlTZWFyY2hlcnMudW5zaGlmdChwcm92aWRlcilcbiAgICApXG4gIH1cblxuICAvLyBDYWxsZWQgYnkgdGhlIFNlcmlhbGl6YWJsZSBtaXhpbiBkdXJpbmcgc2VyaWFsaXphdGlvbi5cbiAgc2VyaWFsaXplICgpIHtcbiAgICByZXR1cm4ge1xuICAgICAgZGVzZXJpYWxpemVyOiAnV29ya3NwYWNlJyxcbiAgICAgIHBhY2thZ2VzV2l0aEFjdGl2ZUdyYW1tYXJzOiB0aGlzLmdldFBhY2thZ2VOYW1lc1dpdGhBY3RpdmVHcmFtbWFycygpLFxuICAgICAgZGVzdHJveWVkSXRlbVVSSXM6IHRoaXMuZGVzdHJveWVkSXRlbVVSSXMuc2xpY2UoKSxcbiAgICAgIC8vIEVuc3VyZSBkZXNlcmlhbGl6aW5nIDEuMTcgc3RhdGUgd2l0aCBwcmUgMS4xNyBBdG9tIGRvZXMgbm90IGVycm9yXG4gICAgICAvLyBUT0RPOiBSZW1vdmUgYWZ0ZXIgMS4xNyBoYXMgYmVlbiBvbiBzdGFibGUgZm9yIGEgd2hpbGVcbiAgICAgIHBhbmVDb250YWluZXI6IHt2ZXJzaW9uOiAyfSxcbiAgICAgIHBhbmVDb250YWluZXJzOiB7XG4gICAgICAgIGNlbnRlcjogdGhpcy5wYW5lQ29udGFpbmVycy5jZW50ZXIuc2VyaWFsaXplKCksXG4gICAgICAgIGxlZnQ6IHRoaXMucGFuZUNvbnRhaW5lcnMubGVmdC5zZXJpYWxpemUoKSxcbiAgICAgICAgcmlnaHQ6IHRoaXMucGFuZUNvbnRhaW5lcnMucmlnaHQuc2VyaWFsaXplKCksXG4gICAgICAgIGJvdHRvbTogdGhpcy5wYW5lQ29udGFpbmVycy5ib3R0b20uc2VyaWFsaXplKClcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBkZXNlcmlhbGl6ZSAoc3RhdGUsIGRlc2VyaWFsaXplck1hbmFnZXIpIHtcbiAgICBjb25zdCBwYWNrYWdlc1dpdGhBY3RpdmVHcmFtbWFycyA9XG4gICAgICBzdGF0ZS5wYWNrYWdlc1dpdGhBY3RpdmVHcmFtbWFycyAhPSBudWxsID8gc3RhdGUucGFja2FnZXNXaXRoQWN0aXZlR3JhbW1hcnMgOiBbXVxuICAgIGZvciAobGV0IHBhY2thZ2VOYW1lIG9mIHBhY2thZ2VzV2l0aEFjdGl2ZUdyYW1tYXJzKSB7XG4gICAgICBjb25zdCBwa2cgPSB0aGlzLnBhY2thZ2VNYW5hZ2VyLmdldExvYWRlZFBhY2thZ2UocGFja2FnZU5hbWUpXG4gICAgICBpZiAocGtnICE9IG51bGwpIHtcbiAgICAgICAgcGtnLmxvYWRHcmFtbWFyc1N5bmMoKVxuICAgICAgfVxuICAgIH1cbiAgICBpZiAoc3RhdGUuZGVzdHJveWVkSXRlbVVSSXMgIT0gbnVsbCkge1xuICAgICAgdGhpcy5kZXN0cm95ZWRJdGVtVVJJcyA9IHN0YXRlLmRlc3Ryb3llZEl0ZW1VUklzXG4gICAgfVxuXG4gICAgaWYgKHN0YXRlLnBhbmVDb250YWluZXJzKSB7XG4gICAgICB0aGlzLnBhbmVDb250YWluZXJzLmNlbnRlci5kZXNlcmlhbGl6ZShzdGF0ZS5wYW5lQ29udGFpbmVycy5jZW50ZXIsIGRlc2VyaWFsaXplck1hbmFnZXIpXG4gICAgICB0aGlzLnBhbmVDb250YWluZXJzLmxlZnQuZGVzZXJpYWxpemUoc3RhdGUucGFuZUNvbnRhaW5lcnMubGVmdCwgZGVzZXJpYWxpemVyTWFuYWdlcilcbiAgICAgIHRoaXMucGFuZUNvbnRhaW5lcnMucmlnaHQuZGVzZXJpYWxpemUoc3RhdGUucGFuZUNvbnRhaW5lcnMucmlnaHQsIGRlc2VyaWFsaXplck1hbmFnZXIpXG4gICAgICB0aGlzLnBhbmVDb250YWluZXJzLmJvdHRvbS5kZXNlcmlhbGl6ZShzdGF0ZS5wYW5lQ29udGFpbmVycy5ib3R0b20sIGRlc2VyaWFsaXplck1hbmFnZXIpXG4gICAgfSBlbHNlIGlmIChzdGF0ZS5wYW5lQ29udGFpbmVyKSB7XG4gICAgICAvLyBUT0RPOiBSZW1vdmUgdGhpcyBmYWxsYmFjayBvbmNlIGEgbG90IG9mIHRpbWUgaGFzIHBhc3NlZCBzaW5jZSAxLjE3IHdhcyByZWxlYXNlZFxuICAgICAgdGhpcy5wYW5lQ29udGFpbmVycy5jZW50ZXIuZGVzZXJpYWxpemUoc3RhdGUucGFuZUNvbnRhaW5lciwgZGVzZXJpYWxpemVyTWFuYWdlcilcbiAgICB9XG5cbiAgICB0aGlzLmhhc0FjdGl2ZVRleHRFZGl0b3IgPSB0aGlzLmdldEFjdGl2ZVRleHRFZGl0b3IoKSAhPSBudWxsXG5cbiAgICB0aGlzLnVwZGF0ZVdpbmRvd1RpdGxlKClcbiAgfVxuXG4gIGdldFBhY2thZ2VOYW1lc1dpdGhBY3RpdmVHcmFtbWFycyAoKSB7XG4gICAgY29uc3QgcGFja2FnZU5hbWVzID0gW11cbiAgICBjb25zdCBhZGRHcmFtbWFyID0gKHtpbmNsdWRlZEdyYW1tYXJTY29wZXMsIHBhY2thZ2VOYW1lfSA9IHt9KSA9PiB7XG4gICAgICBpZiAoIXBhY2thZ2VOYW1lKSB7IHJldHVybiB9XG4gICAgICAvLyBQcmV2ZW50IGN5Y2xlc1xuICAgICAgaWYgKHBhY2thZ2VOYW1lcy5pbmRleE9mKHBhY2thZ2VOYW1lKSAhPT0gLTEpIHsgcmV0dXJuIH1cblxuICAgICAgcGFja2FnZU5hbWVzLnB1c2gocGFja2FnZU5hbWUpXG4gICAgICBmb3IgKGxldCBzY29wZU5hbWUgb2YgaW5jbHVkZWRHcmFtbWFyU2NvcGVzICE9IG51bGwgPyBpbmNsdWRlZEdyYW1tYXJTY29wZXMgOiBbXSkge1xuICAgICAgICBhZGRHcmFtbWFyKHRoaXMuZ3JhbW1hclJlZ2lzdHJ5LmdyYW1tYXJGb3JTY29wZU5hbWUoc2NvcGVOYW1lKSlcbiAgICAgIH1cbiAgICB9XG5cbiAgICBjb25zdCBlZGl0b3JzID0gdGhpcy5nZXRUZXh0RWRpdG9ycygpXG4gICAgZm9yIChsZXQgZWRpdG9yIG9mIGVkaXRvcnMpIHsgYWRkR3JhbW1hcihlZGl0b3IuZ2V0R3JhbW1hcigpKSB9XG5cbiAgICBpZiAoZWRpdG9ycy5sZW5ndGggPiAwKSB7XG4gICAgICBmb3IgKGxldCBncmFtbWFyIG9mIHRoaXMuZ3JhbW1hclJlZ2lzdHJ5LmdldEdyYW1tYXJzKCkpIHtcbiAgICAgICAgaWYgKGdyYW1tYXIuaW5qZWN0aW9uU2VsZWN0b3IpIHtcbiAgICAgICAgICBhZGRHcmFtbWFyKGdyYW1tYXIpXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gXy51bmlxKHBhY2thZ2VOYW1lcylcbiAgfVxuXG4gIGRpZEFjdGl2YXRlUGFuZUNvbnRhaW5lciAocGFuZUNvbnRhaW5lcikge1xuICAgIGlmIChwYW5lQ29udGFpbmVyICE9PSB0aGlzLmdldEFjdGl2ZVBhbmVDb250YWluZXIoKSkge1xuICAgICAgdGhpcy5hY3RpdmVQYW5lQ29udGFpbmVyID0gcGFuZUNvbnRhaW5lclxuICAgICAgdGhpcy5kaWRDaGFuZ2VBY3RpdmVQYW5lSXRlbSh0aGlzLmFjdGl2ZVBhbmVDb250YWluZXIuZ2V0QWN0aXZlUGFuZUl0ZW0oKSlcbiAgICAgIHRoaXMuZW1pdHRlci5lbWl0KCdkaWQtY2hhbmdlLWFjdGl2ZS1wYW5lLWNvbnRhaW5lcicsIHRoaXMuYWN0aXZlUGFuZUNvbnRhaW5lcilcbiAgICAgIHRoaXMuZW1pdHRlci5lbWl0KCdkaWQtY2hhbmdlLWFjdGl2ZS1wYW5lJywgdGhpcy5hY3RpdmVQYW5lQ29udGFpbmVyLmdldEFjdGl2ZVBhbmUoKSlcbiAgICAgIHRoaXMuZW1pdHRlci5lbWl0KCdkaWQtY2hhbmdlLWFjdGl2ZS1wYW5lLWl0ZW0nLCB0aGlzLmFjdGl2ZVBhbmVDb250YWluZXIuZ2V0QWN0aXZlUGFuZUl0ZW0oKSlcbiAgICB9XG4gIH1cblxuICBkaWRDaGFuZ2VBY3RpdmVQYW5lT25QYW5lQ29udGFpbmVyIChwYW5lQ29udGFpbmVyLCBwYW5lKSB7XG4gICAgaWYgKHBhbmVDb250YWluZXIgPT09IHRoaXMuZ2V0QWN0aXZlUGFuZUNvbnRhaW5lcigpKSB7XG4gICAgICB0aGlzLmVtaXR0ZXIuZW1pdCgnZGlkLWNoYW5nZS1hY3RpdmUtcGFuZScsIHBhbmUpXG4gICAgfVxuICB9XG5cbiAgZGlkQ2hhbmdlQWN0aXZlUGFuZUl0ZW1PblBhbmVDb250YWluZXIgKHBhbmVDb250YWluZXIsIGl0ZW0pIHtcbiAgICBpZiAocGFuZUNvbnRhaW5lciA9PT0gdGhpcy5nZXRBY3RpdmVQYW5lQ29udGFpbmVyKCkpIHtcbiAgICAgIHRoaXMuZGlkQ2hhbmdlQWN0aXZlUGFuZUl0ZW0oaXRlbSlcbiAgICAgIHRoaXMuZW1pdHRlci5lbWl0KCdkaWQtY2hhbmdlLWFjdGl2ZS1wYW5lLWl0ZW0nLCBpdGVtKVxuICAgIH1cblxuICAgIGlmIChwYW5lQ29udGFpbmVyID09PSB0aGlzLmdldENlbnRlcigpKSB7XG4gICAgICBjb25zdCBoYWRBY3RpdmVUZXh0RWRpdG9yID0gdGhpcy5oYXNBY3RpdmVUZXh0RWRpdG9yXG4gICAgICB0aGlzLmhhc0FjdGl2ZVRleHRFZGl0b3IgPSBpdGVtIGluc3RhbmNlb2YgVGV4dEVkaXRvclxuXG4gICAgICBpZiAodGhpcy5oYXNBY3RpdmVUZXh0RWRpdG9yIHx8IGhhZEFjdGl2ZVRleHRFZGl0b3IpIHtcbiAgICAgICAgY29uc3QgaXRlbVZhbHVlID0gdGhpcy5oYXNBY3RpdmVUZXh0RWRpdG9yID8gaXRlbSA6IHVuZGVmaW5lZFxuICAgICAgICB0aGlzLmVtaXR0ZXIuZW1pdCgnZGlkLWNoYW5nZS1hY3RpdmUtdGV4dC1lZGl0b3InLCBpdGVtVmFsdWUpXG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgZGlkQ2hhbmdlQWN0aXZlUGFuZUl0ZW0gKGl0ZW0pIHtcbiAgICB0aGlzLnVwZGF0ZVdpbmRvd1RpdGxlKClcbiAgICB0aGlzLnVwZGF0ZURvY3VtZW50RWRpdGVkKClcbiAgICBpZiAodGhpcy5hY3RpdmVJdGVtU3Vic2NyaXB0aW9ucykgdGhpcy5hY3RpdmVJdGVtU3Vic2NyaXB0aW9ucy5kaXNwb3NlKClcbiAgICB0aGlzLmFjdGl2ZUl0ZW1TdWJzY3JpcHRpb25zID0gbmV3IENvbXBvc2l0ZURpc3Bvc2FibGUoKVxuXG4gICAgbGV0IG1vZGlmaWVkU3Vic2NyaXB0aW9uLCB0aXRsZVN1YnNjcmlwdGlvblxuXG4gICAgaWYgKGl0ZW0gIT0gbnVsbCAmJiB0eXBlb2YgaXRlbS5vbkRpZENoYW5nZVRpdGxlID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICB0aXRsZVN1YnNjcmlwdGlvbiA9IGl0ZW0ub25EaWRDaGFuZ2VUaXRsZSh0aGlzLnVwZGF0ZVdpbmRvd1RpdGxlKVxuICAgIH0gZWxzZSBpZiAoaXRlbSAhPSBudWxsICYmIHR5cGVvZiBpdGVtLm9uID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICB0aXRsZVN1YnNjcmlwdGlvbiA9IGl0ZW0ub24oJ3RpdGxlLWNoYW5nZWQnLCB0aGlzLnVwZGF0ZVdpbmRvd1RpdGxlKVxuICAgICAgaWYgKHRpdGxlU3Vic2NyaXB0aW9uID09IG51bGwgfHwgdHlwZW9mIHRpdGxlU3Vic2NyaXB0aW9uLmRpc3Bvc2UgIT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgdGl0bGVTdWJzY3JpcHRpb24gPSBuZXcgRGlzcG9zYWJsZSgoKSA9PiB7XG4gICAgICAgICAgaXRlbS5vZmYoJ3RpdGxlLWNoYW5nZWQnLCB0aGlzLnVwZGF0ZVdpbmRvd1RpdGxlKVxuICAgICAgICB9KVxuICAgICAgfVxuICAgIH1cblxuICAgIGlmIChpdGVtICE9IG51bGwgJiYgdHlwZW9mIGl0ZW0ub25EaWRDaGFuZ2VNb2RpZmllZCA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgbW9kaWZpZWRTdWJzY3JpcHRpb24gPSBpdGVtLm9uRGlkQ2hhbmdlTW9kaWZpZWQodGhpcy51cGRhdGVEb2N1bWVudEVkaXRlZClcbiAgICB9IGVsc2UgaWYgKGl0ZW0gIT0gbnVsbCAmJiB0eXBlb2YgaXRlbS5vbiA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgbW9kaWZpZWRTdWJzY3JpcHRpb24gPSBpdGVtLm9uKCdtb2RpZmllZC1zdGF0dXMtY2hhbmdlZCcsIHRoaXMudXBkYXRlRG9jdW1lbnRFZGl0ZWQpXG4gICAgICBpZiAobW9kaWZpZWRTdWJzY3JpcHRpb24gPT0gbnVsbCB8fCB0eXBlb2YgbW9kaWZpZWRTdWJzY3JpcHRpb24uZGlzcG9zZSAhPT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICBtb2RpZmllZFN1YnNjcmlwdGlvbiA9IG5ldyBEaXNwb3NhYmxlKCgpID0+IHtcbiAgICAgICAgICBpdGVtLm9mZignbW9kaWZpZWQtc3RhdHVzLWNoYW5nZWQnLCB0aGlzLnVwZGF0ZURvY3VtZW50RWRpdGVkKVxuICAgICAgICB9KVxuICAgICAgfVxuICAgIH1cblxuICAgIGlmICh0aXRsZVN1YnNjcmlwdGlvbiAhPSBudWxsKSB7IHRoaXMuYWN0aXZlSXRlbVN1YnNjcmlwdGlvbnMuYWRkKHRpdGxlU3Vic2NyaXB0aW9uKSB9XG4gICAgaWYgKG1vZGlmaWVkU3Vic2NyaXB0aW9uICE9IG51bGwpIHsgdGhpcy5hY3RpdmVJdGVtU3Vic2NyaXB0aW9ucy5hZGQobW9kaWZpZWRTdWJzY3JpcHRpb24pIH1cblxuICAgIHRoaXMuY2FuY2VsU3RvcHBlZENoYW5naW5nQWN0aXZlUGFuZUl0ZW1UaW1lb3V0KClcbiAgICB0aGlzLnN0b3BwZWRDaGFuZ2luZ0FjdGl2ZVBhbmVJdGVtVGltZW91dCA9IHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgdGhpcy5zdG9wcGVkQ2hhbmdpbmdBY3RpdmVQYW5lSXRlbVRpbWVvdXQgPSBudWxsXG4gICAgICB0aGlzLmVtaXR0ZXIuZW1pdCgnZGlkLXN0b3AtY2hhbmdpbmctYWN0aXZlLXBhbmUtaXRlbScsIGl0ZW0pXG4gICAgfSwgU1RPUFBFRF9DSEFOR0lOR19BQ1RJVkVfUEFORV9JVEVNX0RFTEFZKVxuICB9XG5cbiAgY2FuY2VsU3RvcHBlZENoYW5naW5nQWN0aXZlUGFuZUl0ZW1UaW1lb3V0ICgpIHtcbiAgICBpZiAodGhpcy5zdG9wcGVkQ2hhbmdpbmdBY3RpdmVQYW5lSXRlbVRpbWVvdXQgIT0gbnVsbCkge1xuICAgICAgY2xlYXJUaW1lb3V0KHRoaXMuc3RvcHBlZENoYW5naW5nQWN0aXZlUGFuZUl0ZW1UaW1lb3V0KVxuICAgIH1cbiAgfVxuXG4gIHNldERyYWdnaW5nSXRlbSAoZHJhZ2dpbmdJdGVtKSB7XG4gICAgXy52YWx1ZXModGhpcy5wYW5lQ29udGFpbmVycykuZm9yRWFjaChkb2NrID0+IHtcbiAgICAgIGRvY2suc2V0RHJhZ2dpbmdJdGVtKGRyYWdnaW5nSXRlbSlcbiAgICB9KVxuICB9XG5cbiAgc3Vic2NyaWJlVG9BZGRlZEl0ZW1zICgpIHtcbiAgICB0aGlzLm9uRGlkQWRkUGFuZUl0ZW0oKHtpdGVtLCBwYW5lLCBpbmRleH0pID0+IHtcbiAgICAgIGlmIChpdGVtIGluc3RhbmNlb2YgVGV4dEVkaXRvcikge1xuICAgICAgICBjb25zdCBzdWJzY3JpcHRpb25zID0gbmV3IENvbXBvc2l0ZURpc3Bvc2FibGUoXG4gICAgICAgICAgdGhpcy50ZXh0RWRpdG9yUmVnaXN0cnkuYWRkKGl0ZW0pLFxuICAgICAgICAgIHRoaXMudGV4dEVkaXRvclJlZ2lzdHJ5Lm1haW50YWluR3JhbW1hcihpdGVtKSxcbiAgICAgICAgICB0aGlzLnRleHRFZGl0b3JSZWdpc3RyeS5tYWludGFpbkNvbmZpZyhpdGVtKSxcbiAgICAgICAgICBpdGVtLm9ic2VydmVHcmFtbWFyKHRoaXMuaGFuZGxlR3JhbW1hclVzZWQuYmluZCh0aGlzKSlcbiAgICAgICAgKVxuICAgICAgICBpdGVtLm9uRGlkRGVzdHJveSgoKSA9PiB7IHN1YnNjcmlwdGlvbnMuZGlzcG9zZSgpIH0pXG4gICAgICAgIHRoaXMuZW1pdHRlci5lbWl0KCdkaWQtYWRkLXRleHQtZWRpdG9yJywge3RleHRFZGl0b3I6IGl0ZW0sIHBhbmUsIGluZGV4fSlcbiAgICAgIH1cbiAgICB9KVxuICB9XG5cbiAgc3Vic2NyaWJlVG9Eb2NrVG9nZ2xpbmcgKCkge1xuICAgIGNvbnN0IGRvY2tzID0gW3RoaXMuZ2V0TGVmdERvY2soKSwgdGhpcy5nZXRSaWdodERvY2soKSwgdGhpcy5nZXRCb3R0b21Eb2NrKCldXG4gICAgZG9ja3MuZm9yRWFjaChkb2NrID0+IHtcbiAgICAgIGRvY2sub25EaWRDaGFuZ2VWaXNpYmxlKHZpc2libGUgPT4ge1xuICAgICAgICBpZiAodmlzaWJsZSkgcmV0dXJuXG4gICAgICAgIGNvbnN0IHthY3RpdmVFbGVtZW50fSA9IGRvY3VtZW50XG4gICAgICAgIGNvbnN0IGRvY2tFbGVtZW50ID0gZG9jay5nZXRFbGVtZW50KClcbiAgICAgICAgaWYgKGRvY2tFbGVtZW50ID09PSBhY3RpdmVFbGVtZW50IHx8IGRvY2tFbGVtZW50LmNvbnRhaW5zKGFjdGl2ZUVsZW1lbnQpKSB7XG4gICAgICAgICAgdGhpcy5nZXRDZW50ZXIoKS5hY3RpdmF0ZSgpXG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgfSlcbiAgfVxuXG4gIHN1YnNjcmliZVRvTW92ZWRJdGVtcyAoKSB7XG4gICAgZm9yIChjb25zdCBwYW5lQ29udGFpbmVyIG9mIHRoaXMuZ2V0UGFuZUNvbnRhaW5lcnMoKSkge1xuICAgICAgcGFuZUNvbnRhaW5lci5vYnNlcnZlUGFuZXMocGFuZSA9PiB7XG4gICAgICAgIHBhbmUub25EaWRBZGRJdGVtKCh7aXRlbX0pID0+IHtcbiAgICAgICAgICBpZiAodHlwZW9mIGl0ZW0uZ2V0VVJJID09PSAnZnVuY3Rpb24nICYmIHRoaXMuZW5hYmxlUGVyc2lzdGVuY2UpIHtcbiAgICAgICAgICAgIGNvbnN0IHVyaSA9IGl0ZW0uZ2V0VVJJKClcbiAgICAgICAgICAgIGlmICh1cmkpIHtcbiAgICAgICAgICAgICAgY29uc3QgbG9jYXRpb24gPSBwYW5lQ29udGFpbmVyLmdldExvY2F0aW9uKClcbiAgICAgICAgICAgICAgbGV0IGRlZmF1bHRMb2NhdGlvblxuICAgICAgICAgICAgICBpZiAodHlwZW9mIGl0ZW0uZ2V0RGVmYXVsdExvY2F0aW9uID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICAgICAgZGVmYXVsdExvY2F0aW9uID0gaXRlbS5nZXREZWZhdWx0TG9jYXRpb24oKVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIGRlZmF1bHRMb2NhdGlvbiA9IGRlZmF1bHRMb2NhdGlvbiB8fCAnY2VudGVyJ1xuICAgICAgICAgICAgICBpZiAobG9jYXRpb24gPT09IGRlZmF1bHRMb2NhdGlvbikge1xuICAgICAgICAgICAgICAgIHRoaXMuaXRlbUxvY2F0aW9uU3RvcmUuZGVsZXRlKGl0ZW0uZ2V0VVJJKCkpXG4gICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhpcy5pdGVtTG9jYXRpb25TdG9yZS5zYXZlKGl0ZW0uZ2V0VVJJKCksIGxvY2F0aW9uKVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9KVxuICAgICAgfSlcbiAgICB9XG4gIH1cblxuICAvLyBVcGRhdGVzIHRoZSBhcHBsaWNhdGlvbidzIHRpdGxlIGFuZCBwcm94eSBpY29uIGJhc2VkIG9uIHdoaWNoZXZlciBmaWxlIGlzXG4gIC8vIG9wZW4uXG4gIHVwZGF0ZVdpbmRvd1RpdGxlICgpIHtcbiAgICBsZXQgaXRlbVBhdGgsIGl0ZW1UaXRsZSwgcHJvamVjdFBhdGgsIHJlcHJlc2VudGVkUGF0aFxuICAgIGNvbnN0IGFwcE5hbWUgPSAnQXRvbSdcbiAgICBjb25zdCBsZWZ0ID0gdGhpcy5wcm9qZWN0LmdldFBhdGhzKClcbiAgICBjb25zdCBwcm9qZWN0UGF0aHMgPSBsZWZ0ICE9IG51bGwgPyBsZWZ0IDogW11cbiAgICBjb25zdCBpdGVtID0gdGhpcy5nZXRBY3RpdmVQYW5lSXRlbSgpXG4gICAgaWYgKGl0ZW0pIHtcbiAgICAgIGl0ZW1QYXRoID0gdHlwZW9mIGl0ZW0uZ2V0UGF0aCA9PT0gJ2Z1bmN0aW9uJyA/IGl0ZW0uZ2V0UGF0aCgpIDogdW5kZWZpbmVkXG4gICAgICBjb25zdCBsb25nVGl0bGUgPSB0eXBlb2YgaXRlbS5nZXRMb25nVGl0bGUgPT09ICdmdW5jdGlvbicgPyBpdGVtLmdldExvbmdUaXRsZSgpIDogdW5kZWZpbmVkXG4gICAgICBpdGVtVGl0bGUgPSBsb25nVGl0bGUgPT0gbnVsbFxuICAgICAgICA/ICh0eXBlb2YgaXRlbS5nZXRUaXRsZSA9PT0gJ2Z1bmN0aW9uJyA/IGl0ZW0uZ2V0VGl0bGUoKSA6IHVuZGVmaW5lZClcbiAgICAgICAgOiBsb25nVGl0bGVcbiAgICAgIHByb2plY3RQYXRoID0gXy5maW5kKFxuICAgICAgICBwcm9qZWN0UGF0aHMsXG4gICAgICAgIHByb2plY3RQYXRoID0+XG4gICAgICAgICAgKGl0ZW1QYXRoID09PSBwcm9qZWN0UGF0aCkgfHwgKGl0ZW1QYXRoICE9IG51bGwgPyBpdGVtUGF0aC5zdGFydHNXaXRoKHByb2plY3RQYXRoICsgcGF0aC5zZXApIDogdW5kZWZpbmVkKVxuICAgICAgKVxuICAgIH1cbiAgICBpZiAoaXRlbVRpdGxlID09IG51bGwpIHsgaXRlbVRpdGxlID0gJ3VudGl0bGVkJyB9XG4gICAgaWYgKHByb2plY3RQYXRoID09IG51bGwpIHsgcHJvamVjdFBhdGggPSBpdGVtUGF0aCA/IHBhdGguZGlybmFtZShpdGVtUGF0aCkgOiBwcm9qZWN0UGF0aHNbMF0gfVxuICAgIGlmIChwcm9qZWN0UGF0aCAhPSBudWxsKSB7XG4gICAgICBwcm9qZWN0UGF0aCA9IGZzLnRpbGRpZnkocHJvamVjdFBhdGgpXG4gICAgfVxuXG4gICAgY29uc3QgdGl0bGVQYXJ0cyA9IFtdXG4gICAgaWYgKChpdGVtICE9IG51bGwpICYmIChwcm9qZWN0UGF0aCAhPSBudWxsKSkge1xuICAgICAgdGl0bGVQYXJ0cy5wdXNoKGl0ZW1UaXRsZSwgcHJvamVjdFBhdGgpXG4gICAgICByZXByZXNlbnRlZFBhdGggPSBpdGVtUGF0aCAhPSBudWxsID8gaXRlbVBhdGggOiBwcm9qZWN0UGF0aFxuICAgIH0gZWxzZSBpZiAocHJvamVjdFBhdGggIT0gbnVsbCkge1xuICAgICAgdGl0bGVQYXJ0cy5wdXNoKHByb2plY3RQYXRoKVxuICAgICAgcmVwcmVzZW50ZWRQYXRoID0gcHJvamVjdFBhdGhcbiAgICB9IGVsc2Uge1xuICAgICAgdGl0bGVQYXJ0cy5wdXNoKGl0ZW1UaXRsZSlcbiAgICAgIHJlcHJlc2VudGVkUGF0aCA9ICcnXG4gICAgfVxuXG4gICAgaWYgKHByb2Nlc3MucGxhdGZvcm0gIT09ICdkYXJ3aW4nKSB7XG4gICAgICB0aXRsZVBhcnRzLnB1c2goYXBwTmFtZSlcbiAgICB9XG5cbiAgICBkb2N1bWVudC50aXRsZSA9IHRpdGxlUGFydHMuam9pbignIFxcdTIwMTQgJylcbiAgICB0aGlzLmFwcGxpY2F0aW9uRGVsZWdhdGUuc2V0UmVwcmVzZW50ZWRGaWxlbmFtZShyZXByZXNlbnRlZFBhdGgpXG4gICAgdGhpcy5lbWl0dGVyLmVtaXQoJ2RpZC1jaGFuZ2Utd2luZG93LXRpdGxlJylcbiAgfVxuXG4gIC8vIE9uIG1hY09TLCBmYWRlcyB0aGUgYXBwbGljYXRpb24gd2luZG93J3MgcHJveHkgaWNvbiB3aGVuIHRoZSBjdXJyZW50IGZpbGVcbiAgLy8gaGFzIGJlZW4gbW9kaWZpZWQuXG4gIHVwZGF0ZURvY3VtZW50RWRpdGVkICgpIHtcbiAgICBjb25zdCBhY3RpdmVQYW5lSXRlbSA9IHRoaXMuZ2V0QWN0aXZlUGFuZUl0ZW0oKVxuICAgIGNvbnN0IG1vZGlmaWVkID0gYWN0aXZlUGFuZUl0ZW0gIT0gbnVsbCAmJiB0eXBlb2YgYWN0aXZlUGFuZUl0ZW0uaXNNb2RpZmllZCA9PT0gJ2Z1bmN0aW9uJ1xuICAgICAgPyBhY3RpdmVQYW5lSXRlbS5pc01vZGlmaWVkKCkgfHwgZmFsc2VcbiAgICAgIDogZmFsc2VcbiAgICB0aGlzLmFwcGxpY2F0aW9uRGVsZWdhdGUuc2V0V2luZG93RG9jdW1lbnRFZGl0ZWQobW9kaWZpZWQpXG4gIH1cblxuICAvKlxuICBTZWN0aW9uOiBFdmVudCBTdWJzY3JpcHRpb25cbiAgKi9cblxuICBvbkRpZENoYW5nZUFjdGl2ZVBhbmVDb250YWluZXIgKGNhbGxiYWNrKSB7XG4gICAgcmV0dXJuIHRoaXMuZW1pdHRlci5vbignZGlkLWNoYW5nZS1hY3RpdmUtcGFuZS1jb250YWluZXInLCBjYWxsYmFjaylcbiAgfVxuXG4gIC8vIEVzc2VudGlhbDogSW52b2tlIHRoZSBnaXZlbiBjYWxsYmFjayB3aXRoIGFsbCBjdXJyZW50IGFuZCBmdXR1cmUgdGV4dFxuICAvLyBlZGl0b3JzIGluIHRoZSB3b3Jrc3BhY2UuXG4gIC8vXG4gIC8vICogYGNhbGxiYWNrYCB7RnVuY3Rpb259IHRvIGJlIGNhbGxlZCB3aXRoIGN1cnJlbnQgYW5kIGZ1dHVyZSB0ZXh0IGVkaXRvcnMuXG4gIC8vICAgKiBgZWRpdG9yYCBBIHtUZXh0RWRpdG9yfSB0aGF0IGlzIHByZXNlbnQgaW4gezo6Z2V0VGV4dEVkaXRvcnN9IGF0IHRoZSB0aW1lXG4gIC8vICAgICBvZiBzdWJzY3JpcHRpb24gb3IgdGhhdCBpcyBhZGRlZCBhdCBzb21lIGxhdGVyIHRpbWUuXG4gIC8vXG4gIC8vIFJldHVybnMgYSB7RGlzcG9zYWJsZX0gb24gd2hpY2ggYC5kaXNwb3NlKClgIGNhbiBiZSBjYWxsZWQgdG8gdW5zdWJzY3JpYmUuXG4gIG9ic2VydmVUZXh0RWRpdG9ycyAoY2FsbGJhY2spIHtcbiAgICBmb3IgKGxldCB0ZXh0RWRpdG9yIG9mIHRoaXMuZ2V0VGV4dEVkaXRvcnMoKSkgeyBjYWxsYmFjayh0ZXh0RWRpdG9yKSB9XG4gICAgcmV0dXJuIHRoaXMub25EaWRBZGRUZXh0RWRpdG9yKCh7dGV4dEVkaXRvcn0pID0+IGNhbGxiYWNrKHRleHRFZGl0b3IpKVxuICB9XG5cbiAgLy8gRXNzZW50aWFsOiBJbnZva2UgdGhlIGdpdmVuIGNhbGxiYWNrIHdpdGggYWxsIGN1cnJlbnQgYW5kIGZ1dHVyZSBwYW5lcyBpdGVtc1xuICAvLyBpbiB0aGUgd29ya3NwYWNlLlxuICAvL1xuICAvLyAqIGBjYWxsYmFja2Age0Z1bmN0aW9ufSB0byBiZSBjYWxsZWQgd2l0aCBjdXJyZW50IGFuZCBmdXR1cmUgcGFuZSBpdGVtcy5cbiAgLy8gICAqIGBpdGVtYCBBbiBpdGVtIHRoYXQgaXMgcHJlc2VudCBpbiB7OjpnZXRQYW5lSXRlbXN9IGF0IHRoZSB0aW1lIG9mXG4gIC8vICAgICAgc3Vic2NyaXB0aW9uIG9yIHRoYXQgaXMgYWRkZWQgYXQgc29tZSBsYXRlciB0aW1lLlxuICAvL1xuICAvLyBSZXR1cm5zIGEge0Rpc3Bvc2FibGV9IG9uIHdoaWNoIGAuZGlzcG9zZSgpYCBjYW4gYmUgY2FsbGVkIHRvIHVuc3Vic2NyaWJlLlxuICBvYnNlcnZlUGFuZUl0ZW1zIChjYWxsYmFjaykge1xuICAgIHJldHVybiBuZXcgQ29tcG9zaXRlRGlzcG9zYWJsZShcbiAgICAgIC4uLnRoaXMuZ2V0UGFuZUNvbnRhaW5lcnMoKS5tYXAoY29udGFpbmVyID0+IGNvbnRhaW5lci5vYnNlcnZlUGFuZUl0ZW1zKGNhbGxiYWNrKSlcbiAgICApXG4gIH1cblxuICAvLyBFc3NlbnRpYWw6IEludm9rZSB0aGUgZ2l2ZW4gY2FsbGJhY2sgd2hlbiB0aGUgYWN0aXZlIHBhbmUgaXRlbSBjaGFuZ2VzLlxuICAvL1xuICAvLyBCZWNhdXNlIG9ic2VydmVycyBhcmUgaW52b2tlZCBzeW5jaHJvbm91c2x5LCBpdCdzIGltcG9ydGFudCBub3QgdG8gcGVyZm9ybVxuICAvLyBhbnkgZXhwZW5zaXZlIG9wZXJhdGlvbnMgdmlhIHRoaXMgbWV0aG9kLiBDb25zaWRlclxuICAvLyB7OjpvbkRpZFN0b3BDaGFuZ2luZ0FjdGl2ZVBhbmVJdGVtfSB0byBkZWxheSBvcGVyYXRpb25zIHVudGlsIGFmdGVyIGNoYW5nZXNcbiAgLy8gc3RvcCBvY2N1cnJpbmcuXG4gIC8vXG4gIC8vICogYGNhbGxiYWNrYCB7RnVuY3Rpb259IHRvIGJlIGNhbGxlZCB3aGVuIHRoZSBhY3RpdmUgcGFuZSBpdGVtIGNoYW5nZXMuXG4gIC8vICAgKiBgaXRlbWAgVGhlIGFjdGl2ZSBwYW5lIGl0ZW0uXG4gIC8vXG4gIC8vIFJldHVybnMgYSB7RGlzcG9zYWJsZX0gb24gd2hpY2ggYC5kaXNwb3NlKClgIGNhbiBiZSBjYWxsZWQgdG8gdW5zdWJzY3JpYmUuXG4gIG9uRGlkQ2hhbmdlQWN0aXZlUGFuZUl0ZW0gKGNhbGxiYWNrKSB7XG4gICAgcmV0dXJuIHRoaXMuZW1pdHRlci5vbignZGlkLWNoYW5nZS1hY3RpdmUtcGFuZS1pdGVtJywgY2FsbGJhY2spXG4gIH1cblxuICAvLyBFc3NlbnRpYWw6IEludm9rZSB0aGUgZ2l2ZW4gY2FsbGJhY2sgd2hlbiB0aGUgYWN0aXZlIHBhbmUgaXRlbSBzdG9wc1xuICAvLyBjaGFuZ2luZy5cbiAgLy9cbiAgLy8gT2JzZXJ2ZXJzIGFyZSBjYWxsZWQgYXN5bmNocm9ub3VzbHkgMTAwbXMgYWZ0ZXIgdGhlIGxhc3QgYWN0aXZlIHBhbmUgaXRlbVxuICAvLyBjaGFuZ2UuIEhhbmRsaW5nIGNoYW5nZXMgaGVyZSByYXRoZXIgdGhhbiBpbiB0aGUgc3luY2hyb25vdXNcbiAgLy8gezo6b25EaWRDaGFuZ2VBY3RpdmVQYW5lSXRlbX0gcHJldmVudHMgdW5uZWVkZWQgd29yayBpZiB0aGUgdXNlciBpcyBxdWlja2x5XG4gIC8vIGNoYW5naW5nIG9yIGNsb3NpbmcgdGFicyBhbmQgZW5zdXJlcyBjcml0aWNhbCBVSSBmZWVkYmFjaywgbGlrZSBjaGFuZ2luZyB0aGVcbiAgLy8gaGlnaGxpZ2h0ZWQgdGFiLCBnZXRzIHByaW9yaXR5IG92ZXIgd29yayB0aGF0IGNhbiBiZSBkb25lIGFzeW5jaHJvbm91c2x5LlxuICAvL1xuICAvLyAqIGBjYWxsYmFja2Age0Z1bmN0aW9ufSB0byBiZSBjYWxsZWQgd2hlbiB0aGUgYWN0aXZlIHBhbmUgaXRlbSBzdG9wc1xuICAvLyAgIGNoYW5naW5nLlxuICAvLyAgICogYGl0ZW1gIFRoZSBhY3RpdmUgcGFuZSBpdGVtLlxuICAvL1xuICAvLyBSZXR1cm5zIGEge0Rpc3Bvc2FibGV9IG9uIHdoaWNoIGAuZGlzcG9zZSgpYCBjYW4gYmUgY2FsbGVkIHRvIHVuc3Vic2NyaWJlLlxuICBvbkRpZFN0b3BDaGFuZ2luZ0FjdGl2ZVBhbmVJdGVtIChjYWxsYmFjaykge1xuICAgIHJldHVybiB0aGlzLmVtaXR0ZXIub24oJ2RpZC1zdG9wLWNoYW5naW5nLWFjdGl2ZS1wYW5lLWl0ZW0nLCBjYWxsYmFjaylcbiAgfVxuXG4gIC8vIEVzc2VudGlhbDogSW52b2tlIHRoZSBnaXZlbiBjYWxsYmFjayB3aGVuIGEgdGV4dCBlZGl0b3IgYmVjb21lcyB0aGUgYWN0aXZlXG4gIC8vIHRleHQgZWRpdG9yIGFuZCB3aGVuIHRoZXJlIGlzIG5vIGxvbmdlciBhbiBhY3RpdmUgdGV4dCBlZGl0b3IuXG4gIC8vXG4gIC8vICogYGNhbGxiYWNrYCB7RnVuY3Rpb259IHRvIGJlIGNhbGxlZCB3aGVuIHRoZSBhY3RpdmUgdGV4dCBlZGl0b3IgY2hhbmdlcy5cbiAgLy8gICAqIGBlZGl0b3JgIFRoZSBhY3RpdmUge1RleHRFZGl0b3J9IG9yIHVuZGVmaW5lZCBpZiB0aGVyZSBpcyBubyBsb25nZXIgYW5cbiAgLy8gICAgICBhY3RpdmUgdGV4dCBlZGl0b3IuXG4gIC8vXG4gIC8vIFJldHVybnMgYSB7RGlzcG9zYWJsZX0gb24gd2hpY2ggYC5kaXNwb3NlKClgIGNhbiBiZSBjYWxsZWQgdG8gdW5zdWJzY3JpYmUuXG4gIG9uRGlkQ2hhbmdlQWN0aXZlVGV4dEVkaXRvciAoY2FsbGJhY2spIHtcbiAgICByZXR1cm4gdGhpcy5lbWl0dGVyLm9uKCdkaWQtY2hhbmdlLWFjdGl2ZS10ZXh0LWVkaXRvcicsIGNhbGxiYWNrKVxuICB9XG5cbiAgLy8gRXNzZW50aWFsOiBJbnZva2UgdGhlIGdpdmVuIGNhbGxiYWNrIHdpdGggdGhlIGN1cnJlbnQgYWN0aXZlIHBhbmUgaXRlbSBhbmRcbiAgLy8gd2l0aCBhbGwgZnV0dXJlIGFjdGl2ZSBwYW5lIGl0ZW1zIGluIHRoZSB3b3Jrc3BhY2UuXG4gIC8vXG4gIC8vICogYGNhbGxiYWNrYCB7RnVuY3Rpb259IHRvIGJlIGNhbGxlZCB3aGVuIHRoZSBhY3RpdmUgcGFuZSBpdGVtIGNoYW5nZXMuXG4gIC8vICAgKiBgaXRlbWAgVGhlIGN1cnJlbnQgYWN0aXZlIHBhbmUgaXRlbS5cbiAgLy9cbiAgLy8gUmV0dXJucyBhIHtEaXNwb3NhYmxlfSBvbiB3aGljaCBgLmRpc3Bvc2UoKWAgY2FuIGJlIGNhbGxlZCB0byB1bnN1YnNjcmliZS5cbiAgb2JzZXJ2ZUFjdGl2ZVBhbmVJdGVtIChjYWxsYmFjaykge1xuICAgIGNhbGxiYWNrKHRoaXMuZ2V0QWN0aXZlUGFuZUl0ZW0oKSlcbiAgICByZXR1cm4gdGhpcy5vbkRpZENoYW5nZUFjdGl2ZVBhbmVJdGVtKGNhbGxiYWNrKVxuICB9XG5cbiAgLy8gRXNzZW50aWFsOiBJbnZva2UgdGhlIGdpdmVuIGNhbGxiYWNrIHdpdGggdGhlIGN1cnJlbnQgYWN0aXZlIHRleHQgZWRpdG9yXG4gIC8vIChpZiBhbnkpLCB3aXRoIGFsbCBmdXR1cmUgYWN0aXZlIHRleHQgZWRpdG9ycywgYW5kIHdoZW4gdGhlcmUgaXMgbm8gbG9uZ2VyXG4gIC8vIGFuIGFjdGl2ZSB0ZXh0IGVkaXRvci5cbiAgLy9cbiAgLy8gKiBgY2FsbGJhY2tgIHtGdW5jdGlvbn0gdG8gYmUgY2FsbGVkIHdoZW4gdGhlIGFjdGl2ZSB0ZXh0IGVkaXRvciBjaGFuZ2VzLlxuICAvLyAgICogYGVkaXRvcmAgVGhlIGFjdGl2ZSB7VGV4dEVkaXRvcn0gb3IgdW5kZWZpbmVkIGlmIHRoZXJlIGlzIG5vdCBhblxuICAvLyAgICAgIGFjdGl2ZSB0ZXh0IGVkaXRvci5cbiAgLy9cbiAgLy8gUmV0dXJucyBhIHtEaXNwb3NhYmxlfSBvbiB3aGljaCBgLmRpc3Bvc2UoKWAgY2FuIGJlIGNhbGxlZCB0byB1bnN1YnNjcmliZS5cbiAgb2JzZXJ2ZUFjdGl2ZVRleHRFZGl0b3IgKGNhbGxiYWNrKSB7XG4gICAgY2FsbGJhY2sodGhpcy5nZXRBY3RpdmVUZXh0RWRpdG9yKCkpXG5cbiAgICByZXR1cm4gdGhpcy5vbkRpZENoYW5nZUFjdGl2ZVRleHRFZGl0b3IoY2FsbGJhY2spXG4gIH1cblxuICAvLyBFc3NlbnRpYWw6IEludm9rZSB0aGUgZ2l2ZW4gY2FsbGJhY2sgd2hlbmV2ZXIgYW4gaXRlbSBpcyBvcGVuZWQuIFVubGlrZVxuICAvLyB7OjpvbkRpZEFkZFBhbmVJdGVtfSwgb2JzZXJ2ZXJzIHdpbGwgYmUgbm90aWZpZWQgZm9yIGl0ZW1zIHRoYXQgYXJlIGFscmVhZHlcbiAgLy8gcHJlc2VudCBpbiB0aGUgd29ya3NwYWNlIHdoZW4gdGhleSBhcmUgcmVvcGVuZWQuXG4gIC8vXG4gIC8vICogYGNhbGxiYWNrYCB7RnVuY3Rpb259IHRvIGJlIGNhbGxlZCB3aGVuZXZlciBhbiBpdGVtIGlzIG9wZW5lZC5cbiAgLy8gICAqIGBldmVudGAge09iamVjdH0gd2l0aCB0aGUgZm9sbG93aW5nIGtleXM6XG4gIC8vICAgICAqIGB1cmlgIHtTdHJpbmd9IHJlcHJlc2VudGluZyB0aGUgb3BlbmVkIFVSSS4gQ291bGQgYmUgYHVuZGVmaW5lZGAuXG4gIC8vICAgICAqIGBpdGVtYCBUaGUgb3BlbmVkIGl0ZW0uXG4gIC8vICAgICAqIGBwYW5lYCBUaGUgcGFuZSBpbiB3aGljaCB0aGUgaXRlbSB3YXMgb3BlbmVkLlxuICAvLyAgICAgKiBgaW5kZXhgIFRoZSBpbmRleCBvZiB0aGUgb3BlbmVkIGl0ZW0gb24gaXRzIHBhbmUuXG4gIC8vXG4gIC8vIFJldHVybnMgYSB7RGlzcG9zYWJsZX0gb24gd2hpY2ggYC5kaXNwb3NlKClgIGNhbiBiZSBjYWxsZWQgdG8gdW5zdWJzY3JpYmUuXG4gIG9uRGlkT3BlbiAoY2FsbGJhY2spIHtcbiAgICByZXR1cm4gdGhpcy5lbWl0dGVyLm9uKCdkaWQtb3BlbicsIGNhbGxiYWNrKVxuICB9XG5cbiAgLy8gRXh0ZW5kZWQ6IEludm9rZSB0aGUgZ2l2ZW4gY2FsbGJhY2sgd2hlbiBhIHBhbmUgaXMgYWRkZWQgdG8gdGhlIHdvcmtzcGFjZS5cbiAgLy9cbiAgLy8gKiBgY2FsbGJhY2tgIHtGdW5jdGlvbn0gdG8gYmUgY2FsbGVkIHBhbmVzIGFyZSBhZGRlZC5cbiAgLy8gICAqIGBldmVudGAge09iamVjdH0gd2l0aCB0aGUgZm9sbG93aW5nIGtleXM6XG4gIC8vICAgICAqIGBwYW5lYCBUaGUgYWRkZWQgcGFuZS5cbiAgLy9cbiAgLy8gUmV0dXJucyBhIHtEaXNwb3NhYmxlfSBvbiB3aGljaCBgLmRpc3Bvc2UoKWAgY2FuIGJlIGNhbGxlZCB0byB1bnN1YnNjcmliZS5cbiAgb25EaWRBZGRQYW5lIChjYWxsYmFjaykge1xuICAgIHJldHVybiBuZXcgQ29tcG9zaXRlRGlzcG9zYWJsZShcbiAgICAgIC4uLnRoaXMuZ2V0UGFuZUNvbnRhaW5lcnMoKS5tYXAoY29udGFpbmVyID0+IGNvbnRhaW5lci5vbkRpZEFkZFBhbmUoY2FsbGJhY2spKVxuICAgIClcbiAgfVxuXG4gIC8vIEV4dGVuZGVkOiBJbnZva2UgdGhlIGdpdmVuIGNhbGxiYWNrIGJlZm9yZSBhIHBhbmUgaXMgZGVzdHJveWVkIGluIHRoZVxuICAvLyB3b3Jrc3BhY2UuXG4gIC8vXG4gIC8vICogYGNhbGxiYWNrYCB7RnVuY3Rpb259IHRvIGJlIGNhbGxlZCBiZWZvcmUgcGFuZXMgYXJlIGRlc3Ryb3llZC5cbiAgLy8gICAqIGBldmVudGAge09iamVjdH0gd2l0aCB0aGUgZm9sbG93aW5nIGtleXM6XG4gIC8vICAgICAqIGBwYW5lYCBUaGUgcGFuZSB0byBiZSBkZXN0cm95ZWQuXG4gIC8vXG4gIC8vIFJldHVybnMgYSB7RGlzcG9zYWJsZX0gb24gd2hpY2ggYC5kaXNwb3NlKClgIGNhbiBiZSBjYWxsZWQgdG8gdW5zdWJzY3JpYmUuXG4gIG9uV2lsbERlc3Ryb3lQYW5lIChjYWxsYmFjaykge1xuICAgIHJldHVybiBuZXcgQ29tcG9zaXRlRGlzcG9zYWJsZShcbiAgICAgIC4uLnRoaXMuZ2V0UGFuZUNvbnRhaW5lcnMoKS5tYXAoY29udGFpbmVyID0+IGNvbnRhaW5lci5vbldpbGxEZXN0cm95UGFuZShjYWxsYmFjaykpXG4gICAgKVxuICB9XG5cbiAgLy8gRXh0ZW5kZWQ6IEludm9rZSB0aGUgZ2l2ZW4gY2FsbGJhY2sgd2hlbiBhIHBhbmUgaXMgZGVzdHJveWVkIGluIHRoZVxuICAvLyB3b3Jrc3BhY2UuXG4gIC8vXG4gIC8vICogYGNhbGxiYWNrYCB7RnVuY3Rpb259IHRvIGJlIGNhbGxlZCBwYW5lcyBhcmUgZGVzdHJveWVkLlxuICAvLyAgICogYGV2ZW50YCB7T2JqZWN0fSB3aXRoIHRoZSBmb2xsb3dpbmcga2V5czpcbiAgLy8gICAgICogYHBhbmVgIFRoZSBkZXN0cm95ZWQgcGFuZS5cbiAgLy9cbiAgLy8gUmV0dXJucyBhIHtEaXNwb3NhYmxlfSBvbiB3aGljaCBgLmRpc3Bvc2UoKWAgY2FuIGJlIGNhbGxlZCB0byB1bnN1YnNjcmliZS5cbiAgb25EaWREZXN0cm95UGFuZSAoY2FsbGJhY2spIHtcbiAgICByZXR1cm4gbmV3IENvbXBvc2l0ZURpc3Bvc2FibGUoXG4gICAgICAuLi50aGlzLmdldFBhbmVDb250YWluZXJzKCkubWFwKGNvbnRhaW5lciA9PiBjb250YWluZXIub25EaWREZXN0cm95UGFuZShjYWxsYmFjaykpXG4gICAgKVxuICB9XG5cbiAgLy8gRXh0ZW5kZWQ6IEludm9rZSB0aGUgZ2l2ZW4gY2FsbGJhY2sgd2l0aCBhbGwgY3VycmVudCBhbmQgZnV0dXJlIHBhbmVzIGluIHRoZVxuICAvLyB3b3Jrc3BhY2UuXG4gIC8vXG4gIC8vICogYGNhbGxiYWNrYCB7RnVuY3Rpb259IHRvIGJlIGNhbGxlZCB3aXRoIGN1cnJlbnQgYW5kIGZ1dHVyZSBwYW5lcy5cbiAgLy8gICAqIGBwYW5lYCBBIHtQYW5lfSB0aGF0IGlzIHByZXNlbnQgaW4gezo6Z2V0UGFuZXN9IGF0IHRoZSB0aW1lIG9mXG4gIC8vICAgICAgc3Vic2NyaXB0aW9uIG9yIHRoYXQgaXMgYWRkZWQgYXQgc29tZSBsYXRlciB0aW1lLlxuICAvL1xuICAvLyBSZXR1cm5zIGEge0Rpc3Bvc2FibGV9IG9uIHdoaWNoIGAuZGlzcG9zZSgpYCBjYW4gYmUgY2FsbGVkIHRvIHVuc3Vic2NyaWJlLlxuICBvYnNlcnZlUGFuZXMgKGNhbGxiYWNrKSB7XG4gICAgcmV0dXJuIG5ldyBDb21wb3NpdGVEaXNwb3NhYmxlKFxuICAgICAgLi4udGhpcy5nZXRQYW5lQ29udGFpbmVycygpLm1hcChjb250YWluZXIgPT4gY29udGFpbmVyLm9ic2VydmVQYW5lcyhjYWxsYmFjaykpXG4gICAgKVxuICB9XG5cbiAgLy8gRXh0ZW5kZWQ6IEludm9rZSB0aGUgZ2l2ZW4gY2FsbGJhY2sgd2hlbiB0aGUgYWN0aXZlIHBhbmUgY2hhbmdlcy5cbiAgLy9cbiAgLy8gKiBgY2FsbGJhY2tgIHtGdW5jdGlvbn0gdG8gYmUgY2FsbGVkIHdoZW4gdGhlIGFjdGl2ZSBwYW5lIGNoYW5nZXMuXG4gIC8vICAgKiBgcGFuZWAgQSB7UGFuZX0gdGhhdCBpcyB0aGUgY3VycmVudCByZXR1cm4gdmFsdWUgb2Ygezo6Z2V0QWN0aXZlUGFuZX0uXG4gIC8vXG4gIC8vIFJldHVybnMgYSB7RGlzcG9zYWJsZX0gb24gd2hpY2ggYC5kaXNwb3NlKClgIGNhbiBiZSBjYWxsZWQgdG8gdW5zdWJzY3JpYmUuXG4gIG9uRGlkQ2hhbmdlQWN0aXZlUGFuZSAoY2FsbGJhY2spIHtcbiAgICByZXR1cm4gdGhpcy5lbWl0dGVyLm9uKCdkaWQtY2hhbmdlLWFjdGl2ZS1wYW5lJywgY2FsbGJhY2spXG4gIH1cblxuICAvLyBFeHRlbmRlZDogSW52b2tlIHRoZSBnaXZlbiBjYWxsYmFjayB3aXRoIHRoZSBjdXJyZW50IGFjdGl2ZSBwYW5lIGFuZCB3aGVuXG4gIC8vIHRoZSBhY3RpdmUgcGFuZSBjaGFuZ2VzLlxuICAvL1xuICAvLyAqIGBjYWxsYmFja2Age0Z1bmN0aW9ufSB0byBiZSBjYWxsZWQgd2l0aCB0aGUgY3VycmVudCBhbmQgZnV0dXJlIGFjdGl2ZSNcbiAgLy8gICBwYW5lcy5cbiAgLy8gICAqIGBwYW5lYCBBIHtQYW5lfSB0aGF0IGlzIHRoZSBjdXJyZW50IHJldHVybiB2YWx1ZSBvZiB7OjpnZXRBY3RpdmVQYW5lfS5cbiAgLy9cbiAgLy8gUmV0dXJucyBhIHtEaXNwb3NhYmxlfSBvbiB3aGljaCBgLmRpc3Bvc2UoKWAgY2FuIGJlIGNhbGxlZCB0byB1bnN1YnNjcmliZS5cbiAgb2JzZXJ2ZUFjdGl2ZVBhbmUgKGNhbGxiYWNrKSB7XG4gICAgY2FsbGJhY2sodGhpcy5nZXRBY3RpdmVQYW5lKCkpXG4gICAgcmV0dXJuIHRoaXMub25EaWRDaGFuZ2VBY3RpdmVQYW5lKGNhbGxiYWNrKVxuICB9XG5cbiAgLy8gRXh0ZW5kZWQ6IEludm9rZSB0aGUgZ2l2ZW4gY2FsbGJhY2sgd2hlbiBhIHBhbmUgaXRlbSBpcyBhZGRlZCB0byB0aGVcbiAgLy8gd29ya3NwYWNlLlxuICAvL1xuICAvLyAqIGBjYWxsYmFja2Age0Z1bmN0aW9ufSB0byBiZSBjYWxsZWQgd2hlbiBwYW5lIGl0ZW1zIGFyZSBhZGRlZC5cbiAgLy8gICAqIGBldmVudGAge09iamVjdH0gd2l0aCB0aGUgZm9sbG93aW5nIGtleXM6XG4gIC8vICAgICAqIGBpdGVtYCBUaGUgYWRkZWQgcGFuZSBpdGVtLlxuICAvLyAgICAgKiBgcGFuZWAge1BhbmV9IGNvbnRhaW5pbmcgdGhlIGFkZGVkIGl0ZW0uXG4gIC8vICAgICAqIGBpbmRleGAge051bWJlcn0gaW5kaWNhdGluZyB0aGUgaW5kZXggb2YgdGhlIGFkZGVkIGl0ZW0gaW4gaXRzIHBhbmUuXG4gIC8vXG4gIC8vIFJldHVybnMgYSB7RGlzcG9zYWJsZX0gb24gd2hpY2ggYC5kaXNwb3NlKClgIGNhbiBiZSBjYWxsZWQgdG8gdW5zdWJzY3JpYmUuXG4gIG9uRGlkQWRkUGFuZUl0ZW0gKGNhbGxiYWNrKSB7XG4gICAgcmV0dXJuIG5ldyBDb21wb3NpdGVEaXNwb3NhYmxlKFxuICAgICAgLi4udGhpcy5nZXRQYW5lQ29udGFpbmVycygpLm1hcChjb250YWluZXIgPT4gY29udGFpbmVyLm9uRGlkQWRkUGFuZUl0ZW0oY2FsbGJhY2spKVxuICAgIClcbiAgfVxuXG4gIC8vIEV4dGVuZGVkOiBJbnZva2UgdGhlIGdpdmVuIGNhbGxiYWNrIHdoZW4gYSBwYW5lIGl0ZW0gaXMgYWJvdXQgdG8gYmVcbiAgLy8gZGVzdHJveWVkLCBiZWZvcmUgdGhlIHVzZXIgaXMgcHJvbXB0ZWQgdG8gc2F2ZSBpdC5cbiAgLy9cbiAgLy8gKiBgY2FsbGJhY2tgIHtGdW5jdGlvbn0gdG8gYmUgY2FsbGVkIGJlZm9yZSBwYW5lIGl0ZW1zIGFyZSBkZXN0cm95ZWQuIElmIHRoaXMgZnVuY3Rpb24gcmV0dXJuc1xuICAvLyAgIGEge1Byb21pc2V9LCB0aGVuIHRoZSBpdGVtIHdpbGwgbm90IGJlIGRlc3Ryb3llZCB1bnRpbCB0aGUgcHJvbWlzZSByZXNvbHZlcy5cbiAgLy8gICAqIGBldmVudGAge09iamVjdH0gd2l0aCB0aGUgZm9sbG93aW5nIGtleXM6XG4gIC8vICAgICAqIGBpdGVtYCBUaGUgaXRlbSB0byBiZSBkZXN0cm95ZWQuXG4gIC8vICAgICAqIGBwYW5lYCB7UGFuZX0gY29udGFpbmluZyB0aGUgaXRlbSB0byBiZSBkZXN0cm95ZWQuXG4gIC8vICAgICAqIGBpbmRleGAge051bWJlcn0gaW5kaWNhdGluZyB0aGUgaW5kZXggb2YgdGhlIGl0ZW0gdG8gYmUgZGVzdHJveWVkIGluXG4gIC8vICAgICAgIGl0cyBwYW5lLlxuICAvL1xuICAvLyBSZXR1cm5zIGEge0Rpc3Bvc2FibGV9IG9uIHdoaWNoIGAuZGlzcG9zZWAgY2FuIGJlIGNhbGxlZCB0byB1bnN1YnNjcmliZS5cbiAgb25XaWxsRGVzdHJveVBhbmVJdGVtIChjYWxsYmFjaykge1xuICAgIHJldHVybiBuZXcgQ29tcG9zaXRlRGlzcG9zYWJsZShcbiAgICAgIC4uLnRoaXMuZ2V0UGFuZUNvbnRhaW5lcnMoKS5tYXAoY29udGFpbmVyID0+IGNvbnRhaW5lci5vbldpbGxEZXN0cm95UGFuZUl0ZW0oY2FsbGJhY2spKVxuICAgIClcbiAgfVxuXG4gIC8vIEV4dGVuZGVkOiBJbnZva2UgdGhlIGdpdmVuIGNhbGxiYWNrIHdoZW4gYSBwYW5lIGl0ZW0gaXMgZGVzdHJveWVkLlxuICAvL1xuICAvLyAqIGBjYWxsYmFja2Age0Z1bmN0aW9ufSB0byBiZSBjYWxsZWQgd2hlbiBwYW5lIGl0ZW1zIGFyZSBkZXN0cm95ZWQuXG4gIC8vICAgKiBgZXZlbnRgIHtPYmplY3R9IHdpdGggdGhlIGZvbGxvd2luZyBrZXlzOlxuICAvLyAgICAgKiBgaXRlbWAgVGhlIGRlc3Ryb3llZCBpdGVtLlxuICAvLyAgICAgKiBgcGFuZWAge1BhbmV9IGNvbnRhaW5pbmcgdGhlIGRlc3Ryb3llZCBpdGVtLlxuICAvLyAgICAgKiBgaW5kZXhgIHtOdW1iZXJ9IGluZGljYXRpbmcgdGhlIGluZGV4IG9mIHRoZSBkZXN0cm95ZWQgaXRlbSBpbiBpdHNcbiAgLy8gICAgICAgcGFuZS5cbiAgLy9cbiAgLy8gUmV0dXJucyBhIHtEaXNwb3NhYmxlfSBvbiB3aGljaCBgLmRpc3Bvc2VgIGNhbiBiZSBjYWxsZWQgdG8gdW5zdWJzY3JpYmUuXG4gIG9uRGlkRGVzdHJveVBhbmVJdGVtIChjYWxsYmFjaykge1xuICAgIHJldHVybiBuZXcgQ29tcG9zaXRlRGlzcG9zYWJsZShcbiAgICAgIC4uLnRoaXMuZ2V0UGFuZUNvbnRhaW5lcnMoKS5tYXAoY29udGFpbmVyID0+IGNvbnRhaW5lci5vbkRpZERlc3Ryb3lQYW5lSXRlbShjYWxsYmFjaykpXG4gICAgKVxuICB9XG5cbiAgLy8gRXh0ZW5kZWQ6IEludm9rZSB0aGUgZ2l2ZW4gY2FsbGJhY2sgd2hlbiBhIHRleHQgZWRpdG9yIGlzIGFkZGVkIHRvIHRoZVxuICAvLyB3b3Jrc3BhY2UuXG4gIC8vXG4gIC8vICogYGNhbGxiYWNrYCB7RnVuY3Rpb259IHRvIGJlIGNhbGxlZCBwYW5lcyBhcmUgYWRkZWQuXG4gIC8vICAgKiBgZXZlbnRgIHtPYmplY3R9IHdpdGggdGhlIGZvbGxvd2luZyBrZXlzOlxuICAvLyAgICAgKiBgdGV4dEVkaXRvcmAge1RleHRFZGl0b3J9IHRoYXQgd2FzIGFkZGVkLlxuICAvLyAgICAgKiBgcGFuZWAge1BhbmV9IGNvbnRhaW5pbmcgdGhlIGFkZGVkIHRleHQgZWRpdG9yLlxuICAvLyAgICAgKiBgaW5kZXhgIHtOdW1iZXJ9IGluZGljYXRpbmcgdGhlIGluZGV4IG9mIHRoZSBhZGRlZCB0ZXh0IGVkaXRvciBpbiBpdHNcbiAgLy8gICAgICAgIHBhbmUuXG4gIC8vXG4gIC8vIFJldHVybnMgYSB7RGlzcG9zYWJsZX0gb24gd2hpY2ggYC5kaXNwb3NlKClgIGNhbiBiZSBjYWxsZWQgdG8gdW5zdWJzY3JpYmUuXG4gIG9uRGlkQWRkVGV4dEVkaXRvciAoY2FsbGJhY2spIHtcbiAgICByZXR1cm4gdGhpcy5lbWl0dGVyLm9uKCdkaWQtYWRkLXRleHQtZWRpdG9yJywgY2FsbGJhY2spXG4gIH1cblxuICBvbkRpZENoYW5nZVdpbmRvd1RpdGxlIChjYWxsYmFjaykge1xuICAgIHJldHVybiB0aGlzLmVtaXR0ZXIub24oJ2RpZC1jaGFuZ2Utd2luZG93LXRpdGxlJywgY2FsbGJhY2spXG4gIH1cblxuICAvKlxuICBTZWN0aW9uOiBPcGVuaW5nXG4gICovXG5cbiAgLy8gRXNzZW50aWFsOiBPcGVucyB0aGUgZ2l2ZW4gVVJJIGluIEF0b20gYXN5bmNocm9ub3VzbHkuXG4gIC8vIElmIHRoZSBVUkkgaXMgYWxyZWFkeSBvcGVuLCB0aGUgZXhpc3RpbmcgaXRlbSBmb3IgdGhhdCBVUkkgd2lsbCBiZVxuICAvLyBhY3RpdmF0ZWQuIElmIG5vIFVSSSBpcyBnaXZlbiwgb3Igbm8gcmVnaXN0ZXJlZCBvcGVuZXIgY2FuIG9wZW5cbiAgLy8gdGhlIFVSSSwgYSBuZXcgZW1wdHkge1RleHRFZGl0b3J9IHdpbGwgYmUgY3JlYXRlZC5cbiAgLy9cbiAgLy8gKiBgdXJpYCAob3B0aW9uYWwpIEEge1N0cmluZ30gY29udGFpbmluZyBhIFVSSS5cbiAgLy8gKiBgb3B0aW9uc2AgKG9wdGlvbmFsKSB7T2JqZWN0fVxuICAvLyAgICogYGluaXRpYWxMaW5lYCBBIHtOdW1iZXJ9IGluZGljYXRpbmcgd2hpY2ggcm93IHRvIG1vdmUgdGhlIGN1cnNvciB0b1xuICAvLyAgICAgaW5pdGlhbGx5LiBEZWZhdWx0cyB0byBgMGAuXG4gIC8vICAgKiBgaW5pdGlhbENvbHVtbmAgQSB7TnVtYmVyfSBpbmRpY2F0aW5nIHdoaWNoIGNvbHVtbiB0byBtb3ZlIHRoZSBjdXJzb3IgdG9cbiAgLy8gICAgIGluaXRpYWxseS4gRGVmYXVsdHMgdG8gYDBgLlxuICAvLyAgICogYHNwbGl0YCBFaXRoZXIgJ2xlZnQnLCAncmlnaHQnLCAndXAnIG9yICdkb3duJy5cbiAgLy8gICAgIElmICdsZWZ0JywgdGhlIGl0ZW0gd2lsbCBiZSBvcGVuZWQgaW4gbGVmdG1vc3QgcGFuZSBvZiB0aGUgY3VycmVudCBhY3RpdmUgcGFuZSdzIHJvdy5cbiAgLy8gICAgIElmICdyaWdodCcsIHRoZSBpdGVtIHdpbGwgYmUgb3BlbmVkIGluIHRoZSByaWdodG1vc3QgcGFuZSBvZiB0aGUgY3VycmVudCBhY3RpdmUgcGFuZSdzIHJvdy4gSWYgb25seSBvbmUgcGFuZSBleGlzdHMgaW4gdGhlIHJvdywgYSBuZXcgcGFuZSB3aWxsIGJlIGNyZWF0ZWQuXG4gIC8vICAgICBJZiAndXAnLCB0aGUgaXRlbSB3aWxsIGJlIG9wZW5lZCBpbiB0b3Btb3N0IHBhbmUgb2YgdGhlIGN1cnJlbnQgYWN0aXZlIHBhbmUncyBjb2x1bW4uXG4gIC8vICAgICBJZiAnZG93bicsIHRoZSBpdGVtIHdpbGwgYmUgb3BlbmVkIGluIHRoZSBib3R0b21tb3N0IHBhbmUgb2YgdGhlIGN1cnJlbnQgYWN0aXZlIHBhbmUncyBjb2x1bW4uIElmIG9ubHkgb25lIHBhbmUgZXhpc3RzIGluIHRoZSBjb2x1bW4sIGEgbmV3IHBhbmUgd2lsbCBiZSBjcmVhdGVkLlxuICAvLyAgICogYGFjdGl2YXRlUGFuZWAgQSB7Qm9vbGVhbn0gaW5kaWNhdGluZyB3aGV0aGVyIHRvIGNhbGwge1BhbmU6OmFjdGl2YXRlfSBvblxuICAvLyAgICAgY29udGFpbmluZyBwYW5lLiBEZWZhdWx0cyB0byBgdHJ1ZWAuXG4gIC8vICAgKiBgYWN0aXZhdGVJdGVtYCBBIHtCb29sZWFufSBpbmRpY2F0aW5nIHdoZXRoZXIgdG8gY2FsbCB7UGFuZTo6YWN0aXZhdGVJdGVtfVxuICAvLyAgICAgb24gY29udGFpbmluZyBwYW5lLiBEZWZhdWx0cyB0byBgdHJ1ZWAuXG4gIC8vICAgKiBgcGVuZGluZ2AgQSB7Qm9vbGVhbn0gaW5kaWNhdGluZyB3aGV0aGVyIG9yIG5vdCB0aGUgaXRlbSBzaG91bGQgYmUgb3BlbmVkXG4gIC8vICAgICBpbiBhIHBlbmRpbmcgc3RhdGUuIEV4aXN0aW5nIHBlbmRpbmcgaXRlbXMgaW4gYSBwYW5lIGFyZSByZXBsYWNlZCB3aXRoXG4gIC8vICAgICBuZXcgcGVuZGluZyBpdGVtcyB3aGVuIHRoZXkgYXJlIG9wZW5lZC5cbiAgLy8gICAqIGBzZWFyY2hBbGxQYW5lc2AgQSB7Qm9vbGVhbn0uIElmIGB0cnVlYCwgdGhlIHdvcmtzcGFjZSB3aWxsIGF0dGVtcHQgdG9cbiAgLy8gICAgIGFjdGl2YXRlIGFuIGV4aXN0aW5nIGl0ZW0gZm9yIHRoZSBnaXZlbiBVUkkgb24gYW55IHBhbmUuXG4gIC8vICAgICBJZiBgZmFsc2VgLCBvbmx5IHRoZSBhY3RpdmUgcGFuZSB3aWxsIGJlIHNlYXJjaGVkIGZvclxuICAvLyAgICAgYW4gZXhpc3RpbmcgaXRlbSBmb3IgdGhlIHNhbWUgVVJJLiBEZWZhdWx0cyB0byBgZmFsc2VgLlxuICAvLyAgICogYGxvY2F0aW9uYCAob3B0aW9uYWwpIEEge1N0cmluZ30gY29udGFpbmluZyB0aGUgbmFtZSBvZiB0aGUgbG9jYXRpb25cbiAgLy8gICAgIGluIHdoaWNoIHRoaXMgaXRlbSBzaG91bGQgYmUgb3BlbmVkIChvbmUgb2YgXCJsZWZ0XCIsIFwicmlnaHRcIiwgXCJib3R0b21cIixcbiAgLy8gICAgIG9yIFwiY2VudGVyXCIpLiBJZiBvbWl0dGVkLCBBdG9tIHdpbGwgZmFsbCBiYWNrIHRvIHRoZSBsYXN0IGxvY2F0aW9uIGluXG4gIC8vICAgICB3aGljaCBhIHVzZXIgaGFzIHBsYWNlZCBhbiBpdGVtIHdpdGggdGhlIHNhbWUgVVJJIG9yLCBpZiB0aGlzIGlzIGEgbmV3XG4gIC8vICAgICBVUkksIHRoZSBkZWZhdWx0IGxvY2F0aW9uIHNwZWNpZmllZCBieSB0aGUgaXRlbS4gTk9URTogVGhpcyBvcHRpb25cbiAgLy8gICAgIHNob3VsZCBhbG1vc3QgYWx3YXlzIGJlIG9taXR0ZWQgdG8gaG9ub3IgdXNlciBwcmVmZXJlbmNlLlxuICAvL1xuICAvLyBSZXR1cm5zIGEge1Byb21pc2V9IHRoYXQgcmVzb2x2ZXMgdG8gdGhlIHtUZXh0RWRpdG9yfSBmb3IgdGhlIGZpbGUgVVJJLlxuICBhc3luYyBvcGVuIChpdGVtT3JVUkksIG9wdGlvbnMgPSB7fSkge1xuICAgIGxldCB1cmksIGl0ZW1cbiAgICBpZiAodHlwZW9mIGl0ZW1PclVSSSA9PT0gJ3N0cmluZycpIHtcbiAgICAgIHVyaSA9IHRoaXMucHJvamVjdC5yZXNvbHZlUGF0aChpdGVtT3JVUkkpXG4gICAgfSBlbHNlIGlmIChpdGVtT3JVUkkpIHtcbiAgICAgIGl0ZW0gPSBpdGVtT3JVUklcbiAgICAgIGlmICh0eXBlb2YgaXRlbS5nZXRVUkkgPT09ICdmdW5jdGlvbicpIHVyaSA9IGl0ZW0uZ2V0VVJJKClcbiAgICB9XG5cbiAgICBpZiAoIWF0b20uY29uZmlnLmdldCgnY29yZS5hbGxvd1BlbmRpbmdQYW5lSXRlbXMnKSkge1xuICAgICAgb3B0aW9ucy5wZW5kaW5nID0gZmFsc2VcbiAgICB9XG5cbiAgICAvLyBBdm9pZCBhZGRpbmcgVVJMcyBhcyByZWNlbnQgZG9jdW1lbnRzIHRvIHdvcmstYXJvdW5kIHRoaXMgU3BvdGxpZ2h0IGNyYXNoOlxuICAgIC8vIGh0dHBzOi8vZ2l0aHViLmNvbS9hdG9tL2F0b20vaXNzdWVzLzEwMDcxXG4gICAgaWYgKHVyaSAmJiAoIXVybC5wYXJzZSh1cmkpLnByb3RvY29sIHx8IHByb2Nlc3MucGxhdGZvcm0gPT09ICd3aW4zMicpKSB7XG4gICAgICB0aGlzLmFwcGxpY2F0aW9uRGVsZWdhdGUuYWRkUmVjZW50RG9jdW1lbnQodXJpKVxuICAgIH1cblxuICAgIGxldCBwYW5lLCBpdGVtRXhpc3RzSW5Xb3Jrc3BhY2VcblxuICAgIC8vIFRyeSB0byBmaW5kIGFuIGV4aXN0aW5nIGl0ZW0gaW4gdGhlIHdvcmtzcGFjZS5cbiAgICBpZiAoaXRlbSB8fCB1cmkpIHtcbiAgICAgIGlmIChvcHRpb25zLnBhbmUpIHtcbiAgICAgICAgcGFuZSA9IG9wdGlvbnMucGFuZVxuICAgICAgfSBlbHNlIGlmIChvcHRpb25zLnNlYXJjaEFsbFBhbmVzKSB7XG4gICAgICAgIHBhbmUgPSBpdGVtID8gdGhpcy5wYW5lRm9ySXRlbShpdGVtKSA6IHRoaXMucGFuZUZvclVSSSh1cmkpXG4gICAgICB9IGVsc2Uge1xuICAgICAgICAvLyBJZiBhbiBpdGVtIHdpdGggdGhlIGdpdmVuIFVSSSBpcyBhbHJlYWR5IGluIHRoZSB3b3Jrc3BhY2UsIGFzc3VtZVxuICAgICAgICAvLyB0aGF0IGl0ZW0ncyBwYW5lIGNvbnRhaW5lciBpcyB0aGUgcHJlZmVycmVkIGxvY2F0aW9uIGZvciB0aGF0IFVSSS5cbiAgICAgICAgbGV0IGNvbnRhaW5lclxuICAgICAgICBpZiAodXJpKSBjb250YWluZXIgPSB0aGlzLnBhbmVDb250YWluZXJGb3JVUkkodXJpKVxuICAgICAgICBpZiAoIWNvbnRhaW5lcikgY29udGFpbmVyID0gdGhpcy5nZXRBY3RpdmVQYW5lQ29udGFpbmVyKClcblxuICAgICAgICAvLyBUaGUgYHNwbGl0YCBvcHRpb24gYWZmZWN0cyB3aGVyZSB3ZSBzZWFyY2ggZm9yIHRoZSBpdGVtLlxuICAgICAgICBwYW5lID0gY29udGFpbmVyLmdldEFjdGl2ZVBhbmUoKVxuICAgICAgICBzd2l0Y2ggKG9wdGlvbnMuc3BsaXQpIHtcbiAgICAgICAgICBjYXNlICdsZWZ0JzpcbiAgICAgICAgICAgIHBhbmUgPSBwYW5lLmZpbmRMZWZ0bW9zdFNpYmxpbmcoKVxuICAgICAgICAgICAgYnJlYWtcbiAgICAgICAgICBjYXNlICdyaWdodCc6XG4gICAgICAgICAgICBwYW5lID0gcGFuZS5maW5kUmlnaHRtb3N0U2libGluZygpXG4gICAgICAgICAgICBicmVha1xuICAgICAgICAgIGNhc2UgJ3VwJzpcbiAgICAgICAgICAgIHBhbmUgPSBwYW5lLmZpbmRUb3Btb3N0U2libGluZygpXG4gICAgICAgICAgICBicmVha1xuICAgICAgICAgIGNhc2UgJ2Rvd24nOlxuICAgICAgICAgICAgcGFuZSA9IHBhbmUuZmluZEJvdHRvbW1vc3RTaWJsaW5nKClcbiAgICAgICAgICAgIGJyZWFrXG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgaWYgKHBhbmUpIHtcbiAgICAgICAgaWYgKGl0ZW0pIHtcbiAgICAgICAgICBpdGVtRXhpc3RzSW5Xb3Jrc3BhY2UgPSBwYW5lLmdldEl0ZW1zKCkuaW5jbHVkZXMoaXRlbSlcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBpdGVtID0gcGFuZS5pdGVtRm9yVVJJKHVyaSlcbiAgICAgICAgICBpdGVtRXhpc3RzSW5Xb3Jrc3BhY2UgPSBpdGVtICE9IG51bGxcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIC8vIElmIHdlIGFscmVhZHkgaGF2ZSBhbiBpdGVtIGF0IHRoaXMgc3RhZ2UsIHdlIHdvbid0IG5lZWQgdG8gZG8gYW4gYXN5bmNcbiAgICAvLyBsb29rdXAgb2YgdGhlIFVSSSwgc28gd2UgeWllbGQgdGhlIGV2ZW50IGxvb3AgdG8gZW5zdXJlIHRoaXMgbWV0aG9kXG4gICAgLy8gaXMgY29uc2lzdGVudGx5IGFzeW5jaHJvbm91cy5cbiAgICBpZiAoaXRlbSkgYXdhaXQgUHJvbWlzZS5yZXNvbHZlKClcblxuICAgIGlmICghaXRlbUV4aXN0c0luV29ya3NwYWNlKSB7XG4gICAgICBpdGVtID0gaXRlbSB8fCBhd2FpdCB0aGlzLmNyZWF0ZUl0ZW1Gb3JVUkkodXJpLCBvcHRpb25zKVxuICAgICAgaWYgKCFpdGVtKSByZXR1cm5cblxuICAgICAgaWYgKG9wdGlvbnMucGFuZSkge1xuICAgICAgICBwYW5lID0gb3B0aW9ucy5wYW5lXG4gICAgICB9IGVsc2Uge1xuICAgICAgICBsZXQgbG9jYXRpb24gPSBvcHRpb25zLmxvY2F0aW9uXG4gICAgICAgIGlmICghbG9jYXRpb24gJiYgIW9wdGlvbnMuc3BsaXQgJiYgdXJpICYmIHRoaXMuZW5hYmxlUGVyc2lzdGVuY2UpIHtcbiAgICAgICAgICBsb2NhdGlvbiA9IGF3YWl0IHRoaXMuaXRlbUxvY2F0aW9uU3RvcmUubG9hZCh1cmkpXG4gICAgICAgIH1cbiAgICAgICAgaWYgKCFsb2NhdGlvbiAmJiB0eXBlb2YgaXRlbS5nZXREZWZhdWx0TG9jYXRpb24gPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICBsb2NhdGlvbiA9IGl0ZW0uZ2V0RGVmYXVsdExvY2F0aW9uKClcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IGFsbG93ZWRMb2NhdGlvbnMgPSB0eXBlb2YgaXRlbS5nZXRBbGxvd2VkTG9jYXRpb25zID09PSAnZnVuY3Rpb24nID8gaXRlbS5nZXRBbGxvd2VkTG9jYXRpb25zKCkgOiBBTExfTE9DQVRJT05TXG4gICAgICAgIGxvY2F0aW9uID0gYWxsb3dlZExvY2F0aW9ucy5pbmNsdWRlcyhsb2NhdGlvbikgPyBsb2NhdGlvbiA6IGFsbG93ZWRMb2NhdGlvbnNbMF1cblxuICAgICAgICBjb25zdCBjb250YWluZXIgPSB0aGlzLnBhbmVDb250YWluZXJzW2xvY2F0aW9uXSB8fCB0aGlzLmdldENlbnRlcigpXG4gICAgICAgIHBhbmUgPSBjb250YWluZXIuZ2V0QWN0aXZlUGFuZSgpXG4gICAgICAgIHN3aXRjaCAob3B0aW9ucy5zcGxpdCkge1xuICAgICAgICAgIGNhc2UgJ2xlZnQnOlxuICAgICAgICAgICAgcGFuZSA9IHBhbmUuZmluZExlZnRtb3N0U2libGluZygpXG4gICAgICAgICAgICBicmVha1xuICAgICAgICAgIGNhc2UgJ3JpZ2h0JzpcbiAgICAgICAgICAgIHBhbmUgPSBwYW5lLmZpbmRPckNyZWF0ZVJpZ2h0bW9zdFNpYmxpbmcoKVxuICAgICAgICAgICAgYnJlYWtcbiAgICAgICAgICBjYXNlICd1cCc6XG4gICAgICAgICAgICBwYW5lID0gcGFuZS5maW5kVG9wbW9zdFNpYmxpbmcoKVxuICAgICAgICAgICAgYnJlYWtcbiAgICAgICAgICBjYXNlICdkb3duJzpcbiAgICAgICAgICAgIHBhbmUgPSBwYW5lLmZpbmRPckNyZWF0ZUJvdHRvbW1vc3RTaWJsaW5nKClcbiAgICAgICAgICAgIGJyZWFrXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoIW9wdGlvbnMucGVuZGluZyAmJiAocGFuZS5nZXRQZW5kaW5nSXRlbSgpID09PSBpdGVtKSkge1xuICAgICAgcGFuZS5jbGVhclBlbmRpbmdJdGVtKClcbiAgICB9XG5cbiAgICB0aGlzLml0ZW1PcGVuZWQoaXRlbSlcblxuICAgIGlmIChvcHRpb25zLmFjdGl2YXRlSXRlbSA9PT0gZmFsc2UpIHtcbiAgICAgIHBhbmUuYWRkSXRlbShpdGVtLCB7cGVuZGluZzogb3B0aW9ucy5wZW5kaW5nfSlcbiAgICB9IGVsc2Uge1xuICAgICAgcGFuZS5hY3RpdmF0ZUl0ZW0oaXRlbSwge3BlbmRpbmc6IG9wdGlvbnMucGVuZGluZ30pXG4gICAgfVxuXG4gICAgaWYgKG9wdGlvbnMuYWN0aXZhdGVQYW5lICE9PSBmYWxzZSkge1xuICAgICAgcGFuZS5hY3RpdmF0ZSgpXG4gICAgfVxuXG4gICAgbGV0IGluaXRpYWxDb2x1bW4gPSAwXG4gICAgbGV0IGluaXRpYWxMaW5lID0gMFxuICAgIGlmICghTnVtYmVyLmlzTmFOKG9wdGlvbnMuaW5pdGlhbExpbmUpKSB7XG4gICAgICBpbml0aWFsTGluZSA9IG9wdGlvbnMuaW5pdGlhbExpbmVcbiAgICB9XG4gICAgaWYgKCFOdW1iZXIuaXNOYU4ob3B0aW9ucy5pbml0aWFsQ29sdW1uKSkge1xuICAgICAgaW5pdGlhbENvbHVtbiA9IG9wdGlvbnMuaW5pdGlhbENvbHVtblxuICAgIH1cbiAgICBpZiAoaW5pdGlhbExpbmUgPj0gMCB8fCBpbml0aWFsQ29sdW1uID49IDApIHtcbiAgICAgIGlmICh0eXBlb2YgaXRlbS5zZXRDdXJzb3JCdWZmZXJQb3NpdGlvbiA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICBpdGVtLnNldEN1cnNvckJ1ZmZlclBvc2l0aW9uKFtpbml0aWFsTGluZSwgaW5pdGlhbENvbHVtbl0pXG4gICAgICB9XG4gICAgfVxuXG4gICAgY29uc3QgaW5kZXggPSBwYW5lLmdldEFjdGl2ZUl0ZW1JbmRleCgpXG4gICAgdGhpcy5lbWl0dGVyLmVtaXQoJ2RpZC1vcGVuJywge3VyaSwgcGFuZSwgaXRlbSwgaW5kZXh9KVxuICAgIHJldHVybiBpdGVtXG4gIH1cblxuICAvLyBFc3NlbnRpYWw6IFNlYXJjaCB0aGUgd29ya3NwYWNlIGZvciBpdGVtcyBtYXRjaGluZyB0aGUgZ2l2ZW4gVVJJIGFuZCBoaWRlIHRoZW0uXG4gIC8vXG4gIC8vICogYGl0ZW1PclVSSWAgVGhlIGl0ZW0gdG8gaGlkZSBvciBhIHtTdHJpbmd9IGNvbnRhaW5pbmcgdGhlIFVSSVxuICAvLyAgIG9mIHRoZSBpdGVtIHRvIGhpZGUuXG4gIC8vXG4gIC8vIFJldHVybnMgYSB7Qm9vbGVhbn0gaW5kaWNhdGluZyB3aGV0aGVyIGFueSBpdGVtcyB3ZXJlIGZvdW5kIChhbmQgaGlkZGVuKS5cbiAgaGlkZSAoaXRlbU9yVVJJKSB7XG4gICAgbGV0IGZvdW5kSXRlbXMgPSBmYWxzZVxuXG4gICAgLy8gSWYgYW55IHZpc2libGUgaXRlbSBoYXMgdGhlIGdpdmVuIFVSSSwgaGlkZSBpdFxuICAgIGZvciAoY29uc3QgY29udGFpbmVyIG9mIHRoaXMuZ2V0UGFuZUNvbnRhaW5lcnMoKSkge1xuICAgICAgY29uc3QgaXNDZW50ZXIgPSBjb250YWluZXIgPT09IHRoaXMuZ2V0Q2VudGVyKClcbiAgICAgIGlmIChpc0NlbnRlciB8fCBjb250YWluZXIuaXNWaXNpYmxlKCkpIHtcbiAgICAgICAgZm9yIChjb25zdCBwYW5lIG9mIGNvbnRhaW5lci5nZXRQYW5lcygpKSB7XG4gICAgICAgICAgY29uc3QgYWN0aXZlSXRlbSA9IHBhbmUuZ2V0QWN0aXZlSXRlbSgpXG4gICAgICAgICAgY29uc3QgZm91bmRJdGVtID0gKFxuICAgICAgICAgICAgYWN0aXZlSXRlbSAhPSBudWxsICYmIChcbiAgICAgICAgICAgICAgYWN0aXZlSXRlbSA9PT0gaXRlbU9yVVJJIHx8XG4gICAgICAgICAgICAgIHR5cGVvZiBhY3RpdmVJdGVtLmdldFVSSSA9PT0gJ2Z1bmN0aW9uJyAmJiBhY3RpdmVJdGVtLmdldFVSSSgpID09PSBpdGVtT3JVUklcbiAgICAgICAgICAgIClcbiAgICAgICAgICApXG4gICAgICAgICAgaWYgKGZvdW5kSXRlbSkge1xuICAgICAgICAgICAgZm91bmRJdGVtcyA9IHRydWVcbiAgICAgICAgICAgIC8vIFdlIGNhbid0IHJlYWxseSBoaWRlIHRoZSBjZW50ZXIgc28gd2UganVzdCBkZXN0cm95IHRoZSBpdGVtLlxuICAgICAgICAgICAgaWYgKGlzQ2VudGVyKSB7XG4gICAgICAgICAgICAgIHBhbmUuZGVzdHJveUl0ZW0oYWN0aXZlSXRlbSlcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIGNvbnRhaW5lci5oaWRlKClcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gZm91bmRJdGVtc1xuICB9XG5cbiAgLy8gRXNzZW50aWFsOiBTZWFyY2ggdGhlIHdvcmtzcGFjZSBmb3IgaXRlbXMgbWF0Y2hpbmcgdGhlIGdpdmVuIFVSSS4gSWYgYW55IGFyZSBmb3VuZCwgaGlkZSB0aGVtLlxuICAvLyBPdGhlcndpc2UsIG9wZW4gdGhlIFVSTC5cbiAgLy9cbiAgLy8gKiBgaXRlbU9yVVJJYCAob3B0aW9uYWwpIFRoZSBpdGVtIHRvIHRvZ2dsZSBvciBhIHtTdHJpbmd9IGNvbnRhaW5pbmcgdGhlIFVSSVxuICAvLyAgIG9mIHRoZSBpdGVtIHRvIHRvZ2dsZS5cbiAgLy9cbiAgLy8gUmV0dXJucyBhIFByb21pc2UgdGhhdCByZXNvbHZlcyB3aGVuIHRoZSBpdGVtIGlzIHNob3duIG9yIGhpZGRlbi5cbiAgdG9nZ2xlIChpdGVtT3JVUkkpIHtcbiAgICBpZiAodGhpcy5oaWRlKGl0ZW1PclVSSSkpIHtcbiAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoKVxuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gdGhpcy5vcGVuKGl0ZW1PclVSSSwge3NlYXJjaEFsbFBhbmVzOiB0cnVlfSlcbiAgICB9XG4gIH1cblxuICAvLyBPcGVuIEF0b20ncyBsaWNlbnNlIGluIHRoZSBhY3RpdmUgcGFuZS5cbiAgb3BlbkxpY2Vuc2UgKCkge1xuICAgIHJldHVybiB0aGlzLm9wZW4ocGF0aC5qb2luKHByb2Nlc3MucmVzb3VyY2VzUGF0aCwgJ0xJQ0VOU0UubWQnKSlcbiAgfVxuXG4gIC8vIFN5bmNocm9ub3VzbHkgb3BlbiB0aGUgZ2l2ZW4gVVJJIGluIHRoZSBhY3RpdmUgcGFuZS4gKipPbmx5IHVzZSB0aGlzIG1ldGhvZFxuICAvLyBpbiBzcGVjcy4gQ2FsbGluZyB0aGlzIGluIHByb2R1Y3Rpb24gY29kZSB3aWxsIGJsb2NrIHRoZSBVSSB0aHJlYWQgYW5kXG4gIC8vIGV2ZXJ5b25lIHdpbGwgYmUgbWFkIGF0IHlvdS4qKlxuICAvL1xuICAvLyAqIGB1cmlgIEEge1N0cmluZ30gY29udGFpbmluZyBhIFVSSS5cbiAgLy8gKiBgb3B0aW9uc2AgQW4gb3B0aW9uYWwgb3B0aW9ucyB7T2JqZWN0fVxuICAvLyAgICogYGluaXRpYWxMaW5lYCBBIHtOdW1iZXJ9IGluZGljYXRpbmcgd2hpY2ggcm93IHRvIG1vdmUgdGhlIGN1cnNvciB0b1xuICAvLyAgICAgaW5pdGlhbGx5LiBEZWZhdWx0cyB0byBgMGAuXG4gIC8vICAgKiBgaW5pdGlhbENvbHVtbmAgQSB7TnVtYmVyfSBpbmRpY2F0aW5nIHdoaWNoIGNvbHVtbiB0byBtb3ZlIHRoZSBjdXJzb3IgdG9cbiAgLy8gICAgIGluaXRpYWxseS4gRGVmYXVsdHMgdG8gYDBgLlxuICAvLyAgICogYGFjdGl2YXRlUGFuZWAgQSB7Qm9vbGVhbn0gaW5kaWNhdGluZyB3aGV0aGVyIHRvIGNhbGwge1BhbmU6OmFjdGl2YXRlfSBvblxuICAvLyAgICAgdGhlIGNvbnRhaW5pbmcgcGFuZS4gRGVmYXVsdHMgdG8gYHRydWVgLlxuICAvLyAgICogYGFjdGl2YXRlSXRlbWAgQSB7Qm9vbGVhbn0gaW5kaWNhdGluZyB3aGV0aGVyIHRvIGNhbGwge1BhbmU6OmFjdGl2YXRlSXRlbX1cbiAgLy8gICAgIG9uIGNvbnRhaW5pbmcgcGFuZS4gRGVmYXVsdHMgdG8gYHRydWVgLlxuICBvcGVuU3luYyAodXJpXyA9ICcnLCBvcHRpb25zID0ge30pIHtcbiAgICBjb25zdCB7aW5pdGlhbExpbmUsIGluaXRpYWxDb2x1bW59ID0gb3B0aW9uc1xuICAgIGNvbnN0IGFjdGl2YXRlUGFuZSA9IG9wdGlvbnMuYWN0aXZhdGVQYW5lICE9IG51bGwgPyBvcHRpb25zLmFjdGl2YXRlUGFuZSA6IHRydWVcbiAgICBjb25zdCBhY3RpdmF0ZUl0ZW0gPSBvcHRpb25zLmFjdGl2YXRlSXRlbSAhPSBudWxsID8gb3B0aW9ucy5hY3RpdmF0ZUl0ZW0gOiB0cnVlXG5cbiAgICBjb25zdCB1cmkgPSB0aGlzLnByb2plY3QucmVzb2x2ZVBhdGgodXJpXylcbiAgICBsZXQgaXRlbSA9IHRoaXMuZ2V0QWN0aXZlUGFuZSgpLml0ZW1Gb3JVUkkodXJpKVxuICAgIGlmICh1cmkgJiYgKGl0ZW0gPT0gbnVsbCkpIHtcbiAgICAgIGZvciAoY29uc3Qgb3BlbmVyIG9mIHRoaXMuZ2V0T3BlbmVycygpKSB7XG4gICAgICAgIGl0ZW0gPSBvcGVuZXIodXJpLCBvcHRpb25zKVxuICAgICAgICBpZiAoaXRlbSkgYnJlYWtcbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKGl0ZW0gPT0gbnVsbCkge1xuICAgICAgaXRlbSA9IHRoaXMucHJvamVjdC5vcGVuU3luYyh1cmksIHtpbml0aWFsTGluZSwgaW5pdGlhbENvbHVtbn0pXG4gICAgfVxuXG4gICAgaWYgKGFjdGl2YXRlSXRlbSkge1xuICAgICAgdGhpcy5nZXRBY3RpdmVQYW5lKCkuYWN0aXZhdGVJdGVtKGl0ZW0pXG4gICAgfVxuICAgIHRoaXMuaXRlbU9wZW5lZChpdGVtKVxuICAgIGlmIChhY3RpdmF0ZVBhbmUpIHtcbiAgICAgIHRoaXMuZ2V0QWN0aXZlUGFuZSgpLmFjdGl2YXRlKClcbiAgICB9XG4gICAgcmV0dXJuIGl0ZW1cbiAgfVxuXG4gIG9wZW5VUklJblBhbmUgKHVyaSwgcGFuZSkge1xuICAgIHJldHVybiB0aGlzLm9wZW4odXJpLCB7cGFuZX0pXG4gIH1cblxuICAvLyBQdWJsaWM6IENyZWF0ZXMgYSBuZXcgaXRlbSB0aGF0IGNvcnJlc3BvbmRzIHRvIHRoZSBwcm92aWRlZCBVUkkuXG4gIC8vXG4gIC8vIElmIG5vIFVSSSBpcyBnaXZlbiwgb3Igbm8gcmVnaXN0ZXJlZCBvcGVuZXIgY2FuIG9wZW4gdGhlIFVSSSwgYSBuZXcgZW1wdHlcbiAgLy8ge1RleHRFZGl0b3J9IHdpbGwgYmUgY3JlYXRlZC5cbiAgLy9cbiAgLy8gKiBgdXJpYCBBIHtTdHJpbmd9IGNvbnRhaW5pbmcgYSBVUkkuXG4gIC8vXG4gIC8vIFJldHVybnMgYSB7UHJvbWlzZX0gdGhhdCByZXNvbHZlcyB0byB0aGUge1RleHRFZGl0b3J9IChvciBvdGhlciBpdGVtKSBmb3IgdGhlIGdpdmVuIFVSSS5cbiAgY3JlYXRlSXRlbUZvclVSSSAodXJpLCBvcHRpb25zKSB7XG4gICAgaWYgKHVyaSAhPSBudWxsKSB7XG4gICAgICBmb3IgKGxldCBvcGVuZXIgb2YgdGhpcy5nZXRPcGVuZXJzKCkpIHtcbiAgICAgICAgY29uc3QgaXRlbSA9IG9wZW5lcih1cmksIG9wdGlvbnMpXG4gICAgICAgIGlmIChpdGVtICE9IG51bGwpIHJldHVybiBQcm9taXNlLnJlc29sdmUoaXRlbSlcbiAgICAgIH1cbiAgICB9XG5cbiAgICB0cnkge1xuICAgICAgcmV0dXJuIHRoaXMub3BlblRleHRGaWxlKHVyaSwgb3B0aW9ucylcbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgc3dpdGNoIChlcnJvci5jb2RlKSB7XG4gICAgICAgIGNhc2UgJ0NBTkNFTExFRCc6XG4gICAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSgpXG4gICAgICAgIGNhc2UgJ0VBQ0NFUyc6XG4gICAgICAgICAgdGhpcy5ub3RpZmljYXRpb25NYW5hZ2VyLmFkZFdhcm5pbmcoYFBlcm1pc3Npb24gZGVuaWVkICcke2Vycm9yLnBhdGh9J2ApXG4gICAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSgpXG4gICAgICAgIGNhc2UgJ0VQRVJNJzpcbiAgICAgICAgY2FzZSAnRUJVU1knOlxuICAgICAgICBjYXNlICdFTlhJTyc6XG4gICAgICAgIGNhc2UgJ0VJTyc6XG4gICAgICAgIGNhc2UgJ0VOT1RDT05OJzpcbiAgICAgICAgY2FzZSAnVU5LTk9XTic6XG4gICAgICAgIGNhc2UgJ0VDT05OUkVTRVQnOlxuICAgICAgICBjYXNlICdFSU5WQUwnOlxuICAgICAgICBjYXNlICdFTUZJTEUnOlxuICAgICAgICBjYXNlICdFTk9URElSJzpcbiAgICAgICAgY2FzZSAnRUFHQUlOJzpcbiAgICAgICAgICB0aGlzLm5vdGlmaWNhdGlvbk1hbmFnZXIuYWRkV2FybmluZyhcbiAgICAgICAgICAgIGBVbmFibGUgdG8gb3BlbiAnJHtlcnJvci5wYXRoICE9IG51bGwgPyBlcnJvci5wYXRoIDogdXJpfSdgLFxuICAgICAgICAgICAge2RldGFpbDogZXJyb3IubWVzc2FnZX1cbiAgICAgICAgICApXG4gICAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSgpXG4gICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgdGhyb3cgZXJyb3JcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBvcGVuVGV4dEZpbGUgKHVyaSwgb3B0aW9ucykge1xuICAgIGNvbnN0IGZpbGVQYXRoID0gdGhpcy5wcm9qZWN0LnJlc29sdmVQYXRoKHVyaSlcblxuICAgIGlmIChmaWxlUGF0aCAhPSBudWxsKSB7XG4gICAgICB0cnkge1xuICAgICAgICBmcy5jbG9zZVN5bmMoZnMub3BlblN5bmMoZmlsZVBhdGgsICdyJykpXG4gICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICAvLyBhbGxvdyBFTk9FTlQgZXJyb3JzIHRvIGNyZWF0ZSBhbiBlZGl0b3IgZm9yIHBhdGhzIHRoYXQgZG9udCBleGlzdFxuICAgICAgICBpZiAoZXJyb3IuY29kZSAhPT0gJ0VOT0VOVCcpIHtcbiAgICAgICAgICB0aHJvdyBlcnJvclxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgY29uc3QgZmlsZVNpemUgPSBmcy5nZXRTaXplU3luYyhmaWxlUGF0aClcblxuICAgIGNvbnN0IGxhcmdlRmlsZU1vZGUgPSBmaWxlU2l6ZSA+PSAoMiAqIDEwNDg1NzYpIC8vIDJNQlxuICAgIGlmIChmaWxlU2l6ZSA+PSAodGhpcy5jb25maWcuZ2V0KCdjb3JlLndhcm5PbkxhcmdlRmlsZUxpbWl0JykgKiAxMDQ4NTc2KSkgeyAvLyAyME1CIGJ5IGRlZmF1bHRcbiAgICAgIGNvbnN0IGNob2ljZSA9IHRoaXMuYXBwbGljYXRpb25EZWxlZ2F0ZS5jb25maXJtKHtcbiAgICAgICAgbWVzc2FnZTogJ0F0b20gd2lsbCBiZSB1bnJlc3BvbnNpdmUgZHVyaW5nIHRoZSBsb2FkaW5nIG9mIHZlcnkgbGFyZ2UgZmlsZXMuJyxcbiAgICAgICAgZGV0YWlsZWRNZXNzYWdlOiAnRG8geW91IHN0aWxsIHdhbnQgdG8gbG9hZCB0aGlzIGZpbGU/JyxcbiAgICAgICAgYnV0dG9uczogWydQcm9jZWVkJywgJ0NhbmNlbCddXG4gICAgICB9KVxuICAgICAgaWYgKGNob2ljZSA9PT0gMSkge1xuICAgICAgICBjb25zdCBlcnJvciA9IG5ldyBFcnJvcigpXG4gICAgICAgIGVycm9yLmNvZGUgPSAnQ0FOQ0VMTEVEJ1xuICAgICAgICB0aHJvdyBlcnJvclxuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiB0aGlzLnByb2plY3QuYnVmZmVyRm9yUGF0aChmaWxlUGF0aCwgb3B0aW9ucylcbiAgICAgIC50aGVuKGJ1ZmZlciA9PiB7XG4gICAgICAgIHJldHVybiB0aGlzLnRleHRFZGl0b3JSZWdpc3RyeS5idWlsZChPYmplY3QuYXNzaWduKHtidWZmZXIsIGxhcmdlRmlsZU1vZGUsIGF1dG9IZWlnaHQ6IGZhbHNlfSwgb3B0aW9ucykpXG4gICAgICB9KVxuICB9XG5cbiAgaGFuZGxlR3JhbW1hclVzZWQgKGdyYW1tYXIpIHtcbiAgICBpZiAoZ3JhbW1hciA9PSBudWxsKSB7IHJldHVybiB9XG4gICAgcmV0dXJuIHRoaXMucGFja2FnZU1hbmFnZXIudHJpZ2dlckFjdGl2YXRpb25Ib29rKGAke2dyYW1tYXIucGFja2FnZU5hbWV9OmdyYW1tYXItdXNlZGApXG4gIH1cblxuICAvLyBQdWJsaWM6IFJldHVybnMgYSB7Qm9vbGVhbn0gdGhhdCBpcyBgdHJ1ZWAgaWYgYG9iamVjdGAgaXMgYSBgVGV4dEVkaXRvcmAuXG4gIC8vXG4gIC8vICogYG9iamVjdGAgQW4ge09iamVjdH0geW91IHdhbnQgdG8gcGVyZm9ybSB0aGUgY2hlY2sgYWdhaW5zdC5cbiAgaXNUZXh0RWRpdG9yIChvYmplY3QpIHtcbiAgICByZXR1cm4gb2JqZWN0IGluc3RhbmNlb2YgVGV4dEVkaXRvclxuICB9XG5cbiAgLy8gRXh0ZW5kZWQ6IENyZWF0ZSBhIG5ldyB0ZXh0IGVkaXRvci5cbiAgLy9cbiAgLy8gUmV0dXJucyBhIHtUZXh0RWRpdG9yfS5cbiAgYnVpbGRUZXh0RWRpdG9yIChwYXJhbXMpIHtcbiAgICBjb25zdCBlZGl0b3IgPSB0aGlzLnRleHRFZGl0b3JSZWdpc3RyeS5idWlsZChwYXJhbXMpXG4gICAgY29uc3Qgc3Vic2NyaXB0aW9ucyA9IG5ldyBDb21wb3NpdGVEaXNwb3NhYmxlKFxuICAgICAgdGhpcy50ZXh0RWRpdG9yUmVnaXN0cnkubWFpbnRhaW5HcmFtbWFyKGVkaXRvciksXG4gICAgICB0aGlzLnRleHRFZGl0b3JSZWdpc3RyeS5tYWludGFpbkNvbmZpZyhlZGl0b3IpXG4gICAgKVxuICAgIGVkaXRvci5vbkRpZERlc3Ryb3koKCkgPT4geyBzdWJzY3JpcHRpb25zLmRpc3Bvc2UoKSB9KVxuICAgIHJldHVybiBlZGl0b3JcbiAgfVxuXG4gIC8vIFB1YmxpYzogQXN5bmNocm9ub3VzbHkgcmVvcGVucyB0aGUgbGFzdC1jbG9zZWQgaXRlbSdzIFVSSSBpZiBpdCBoYXNuJ3QgYWxyZWFkeSBiZWVuXG4gIC8vIHJlb3BlbmVkLlxuICAvL1xuICAvLyBSZXR1cm5zIGEge1Byb21pc2V9IHRoYXQgaXMgcmVzb2x2ZWQgd2hlbiB0aGUgaXRlbSBpcyBvcGVuZWRcbiAgcmVvcGVuSXRlbSAoKSB7XG4gICAgY29uc3QgdXJpID0gdGhpcy5kZXN0cm95ZWRJdGVtVVJJcy5wb3AoKVxuICAgIGlmICh1cmkpIHtcbiAgICAgIHJldHVybiB0aGlzLm9wZW4odXJpKVxuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKClcbiAgICB9XG4gIH1cblxuICAvLyBQdWJsaWM6IFJlZ2lzdGVyIGFuIG9wZW5lciBmb3IgYSB1cmkuXG4gIC8vXG4gIC8vIFdoZW4gYSBVUkkgaXMgb3BlbmVkIHZpYSB7V29ya3NwYWNlOjpvcGVufSwgQXRvbSBsb29wcyB0aHJvdWdoIGl0cyByZWdpc3RlcmVkXG4gIC8vIG9wZW5lciBmdW5jdGlvbnMgdW50aWwgb25lIHJldHVybnMgYSB2YWx1ZSBmb3IgdGhlIGdpdmVuIHVyaS5cbiAgLy8gT3BlbmVycyBhcmUgZXhwZWN0ZWQgdG8gcmV0dXJuIGFuIG9iamVjdCB0aGF0IGluaGVyaXRzIGZyb20gSFRNTEVsZW1lbnQgb3JcbiAgLy8gYSBtb2RlbCB3aGljaCBoYXMgYW4gYXNzb2NpYXRlZCB2aWV3IGluIHRoZSB7Vmlld1JlZ2lzdHJ5fS5cbiAgLy8gQSB7VGV4dEVkaXRvcn0gd2lsbCBiZSB1c2VkIGlmIG5vIG9wZW5lciByZXR1cm5zIGEgdmFsdWUuXG4gIC8vXG4gIC8vICMjIEV4YW1wbGVzXG4gIC8vXG4gIC8vIGBgYGNvZmZlZVxuICAvLyBhdG9tLndvcmtzcGFjZS5hZGRPcGVuZXIgKHVyaSkgLT5cbiAgLy8gICBpZiBwYXRoLmV4dG5hbWUodXJpKSBpcyAnLnRvbWwnXG4gIC8vICAgICByZXR1cm4gbmV3IFRvbWxFZGl0b3IodXJpKVxuICAvLyBgYGBcbiAgLy9cbiAgLy8gKiBgb3BlbmVyYCBBIHtGdW5jdGlvbn0gdG8gYmUgY2FsbGVkIHdoZW4gYSBwYXRoIGlzIGJlaW5nIG9wZW5lZC5cbiAgLy9cbiAgLy8gUmV0dXJucyBhIHtEaXNwb3NhYmxlfSBvbiB3aGljaCBgLmRpc3Bvc2UoKWAgY2FuIGJlIGNhbGxlZCB0byByZW1vdmUgdGhlXG4gIC8vIG9wZW5lci5cbiAgLy9cbiAgLy8gTm90ZSB0aGF0IHRoZSBvcGVuZXIgd2lsbCBiZSBjYWxsZWQgaWYgYW5kIG9ubHkgaWYgdGhlIFVSSSBpcyBub3QgYWxyZWFkeSBvcGVuXG4gIC8vIGluIHRoZSBjdXJyZW50IHBhbmUuIFRoZSBzZWFyY2hBbGxQYW5lcyBmbGFnIGV4cGFuZHMgdGhlIHNlYXJjaCBmcm9tIHRoZVxuICAvLyBjdXJyZW50IHBhbmUgdG8gYWxsIHBhbmVzLiBJZiB5b3Ugd2lzaCB0byBvcGVuIGEgdmlldyBvZiBhIGRpZmZlcmVudCB0eXBlIGZvclxuICAvLyBhIGZpbGUgdGhhdCBpcyBhbHJlYWR5IG9wZW4sIGNvbnNpZGVyIGNoYW5naW5nIHRoZSBwcm90b2NvbCBvZiB0aGUgVVJJLiBGb3JcbiAgLy8gZXhhbXBsZSwgcGVyaGFwcyB5b3Ugd2lzaCB0byBwcmV2aWV3IGEgcmVuZGVyZWQgdmVyc2lvbiBvZiB0aGUgZmlsZSBgL2Zvby9iYXIvYmF6LnF1dXhgXG4gIC8vIHRoYXQgaXMgYWxyZWFkeSBvcGVuIGluIGEgdGV4dCBlZGl0b3Igdmlldy4gWW91IGNvdWxkIHNpZ25hbCB0aGlzIGJ5IGNhbGxpbmdcbiAgLy8ge1dvcmtzcGFjZTo6b3Blbn0gb24gdGhlIFVSSSBgcXV1eC1wcmV2aWV3Oi8vZm9vL2Jhci9iYXoucXV1eGAuIFRoZW4geW91ciBvcGVuZXJcbiAgLy8gY2FuIGNoZWNrIHRoZSBwcm90b2NvbCBmb3IgcXV1eC1wcmV2aWV3IGFuZCBvbmx5IGhhbmRsZSB0aG9zZSBVUklzIHRoYXQgbWF0Y2guXG4gIGFkZE9wZW5lciAob3BlbmVyKSB7XG4gICAgdGhpcy5vcGVuZXJzLnB1c2gob3BlbmVyKVxuICAgIHJldHVybiBuZXcgRGlzcG9zYWJsZSgoKSA9PiB7IF8ucmVtb3ZlKHRoaXMub3BlbmVycywgb3BlbmVyKSB9KVxuICB9XG5cbiAgZ2V0T3BlbmVycyAoKSB7XG4gICAgcmV0dXJuIHRoaXMub3BlbmVyc1xuICB9XG5cbiAgLypcbiAgU2VjdGlvbjogUGFuZSBJdGVtc1xuICAqL1xuXG4gIC8vIEVzc2VudGlhbDogR2V0IGFsbCBwYW5lIGl0ZW1zIGluIHRoZSB3b3Jrc3BhY2UuXG4gIC8vXG4gIC8vIFJldHVybnMgYW4ge0FycmF5fSBvZiBpdGVtcy5cbiAgZ2V0UGFuZUl0ZW1zICgpIHtcbiAgICByZXR1cm4gXy5mbGF0dGVuKHRoaXMuZ2V0UGFuZUNvbnRhaW5lcnMoKS5tYXAoY29udGFpbmVyID0+IGNvbnRhaW5lci5nZXRQYW5lSXRlbXMoKSkpXG4gIH1cblxuICAvLyBFc3NlbnRpYWw6IEdldCB0aGUgYWN0aXZlIHtQYW5lfSdzIGFjdGl2ZSBpdGVtLlxuICAvL1xuICAvLyBSZXR1cm5zIGFuIHBhbmUgaXRlbSB7T2JqZWN0fS5cbiAgZ2V0QWN0aXZlUGFuZUl0ZW0gKCkge1xuICAgIHJldHVybiB0aGlzLmdldEFjdGl2ZVBhbmVDb250YWluZXIoKS5nZXRBY3RpdmVQYW5lSXRlbSgpXG4gIH1cblxuICAvLyBFc3NlbnRpYWw6IEdldCBhbGwgdGV4dCBlZGl0b3JzIGluIHRoZSB3b3Jrc3BhY2UuXG4gIC8vXG4gIC8vIFJldHVybnMgYW4ge0FycmF5fSBvZiB7VGV4dEVkaXRvcn1zLlxuICBnZXRUZXh0RWRpdG9ycyAoKSB7XG4gICAgcmV0dXJuIHRoaXMuZ2V0UGFuZUl0ZW1zKCkuZmlsdGVyKGl0ZW0gPT4gaXRlbSBpbnN0YW5jZW9mIFRleHRFZGl0b3IpXG4gIH1cblxuICAvLyBFc3NlbnRpYWw6IEdldCB0aGUgd29ya3NwYWNlIGNlbnRlcidzIGFjdGl2ZSBpdGVtIGlmIGl0IGlzIGEge1RleHRFZGl0b3J9LlxuICAvL1xuICAvLyBSZXR1cm5zIGEge1RleHRFZGl0b3J9IG9yIGB1bmRlZmluZWRgIGlmIHRoZSB3b3Jrc3BhY2UgY2VudGVyJ3MgY3VycmVudFxuICAvLyBhY3RpdmUgaXRlbSBpcyBub3QgYSB7VGV4dEVkaXRvcn0uXG4gIGdldEFjdGl2ZVRleHRFZGl0b3IgKCkge1xuICAgIGNvbnN0IGFjdGl2ZUl0ZW0gPSB0aGlzLmdldENlbnRlcigpLmdldEFjdGl2ZVBhbmVJdGVtKClcbiAgICBpZiAoYWN0aXZlSXRlbSBpbnN0YW5jZW9mIFRleHRFZGl0b3IpIHsgcmV0dXJuIGFjdGl2ZUl0ZW0gfVxuICB9XG5cbiAgLy8gU2F2ZSBhbGwgcGFuZSBpdGVtcy5cbiAgc2F2ZUFsbCAoKSB7XG4gICAgdGhpcy5nZXRQYW5lQ29udGFpbmVycygpLmZvckVhY2goY29udGFpbmVyID0+IHtcbiAgICAgIGNvbnRhaW5lci5zYXZlQWxsKClcbiAgICB9KVxuICB9XG5cbiAgY29uZmlybUNsb3NlIChvcHRpb25zKSB7XG4gICAgcmV0dXJuIFByb21pc2UuYWxsKHRoaXMuZ2V0UGFuZUNvbnRhaW5lcnMoKS5tYXAoY29udGFpbmVyID0+XG4gICAgICBjb250YWluZXIuY29uZmlybUNsb3NlKG9wdGlvbnMpXG4gICAgKSkudGhlbigocmVzdWx0cykgPT4gIXJlc3VsdHMuaW5jbHVkZXMoZmFsc2UpKVxuICB9XG5cbiAgLy8gU2F2ZSB0aGUgYWN0aXZlIHBhbmUgaXRlbS5cbiAgLy9cbiAgLy8gSWYgdGhlIGFjdGl2ZSBwYW5lIGl0ZW0gY3VycmVudGx5IGhhcyBhIFVSSSBhY2NvcmRpbmcgdG8gdGhlIGl0ZW0nc1xuICAvLyBgLmdldFVSSWAgbWV0aG9kLCBjYWxscyBgLnNhdmVgIG9uIHRoZSBpdGVtLiBPdGhlcndpc2VcbiAgLy8gezo6c2F2ZUFjdGl2ZVBhbmVJdGVtQXN9ICMgd2lsbCBiZSBjYWxsZWQgaW5zdGVhZC4gVGhpcyBtZXRob2QgZG9lcyBub3RoaW5nXG4gIC8vIGlmIHRoZSBhY3RpdmUgaXRlbSBkb2VzIG5vdCBpbXBsZW1lbnQgYSBgLnNhdmVgIG1ldGhvZC5cbiAgc2F2ZUFjdGl2ZVBhbmVJdGVtICgpIHtcbiAgICByZXR1cm4gdGhpcy5nZXRDZW50ZXIoKS5nZXRBY3RpdmVQYW5lKCkuc2F2ZUFjdGl2ZUl0ZW0oKVxuICB9XG5cbiAgLy8gUHJvbXB0IHRoZSB1c2VyIGZvciBhIHBhdGggYW5kIHNhdmUgdGhlIGFjdGl2ZSBwYW5lIGl0ZW0gdG8gaXQuXG4gIC8vXG4gIC8vIE9wZW5zIGEgbmF0aXZlIGRpYWxvZyB3aGVyZSB0aGUgdXNlciBzZWxlY3RzIGEgcGF0aCBvbiBkaXNrLCB0aGVuIGNhbGxzXG4gIC8vIGAuc2F2ZUFzYCBvbiB0aGUgaXRlbSB3aXRoIHRoZSBzZWxlY3RlZCBwYXRoLiBUaGlzIG1ldGhvZCBkb2VzIG5vdGhpbmcgaWZcbiAgLy8gdGhlIGFjdGl2ZSBpdGVtIGRvZXMgbm90IGltcGxlbWVudCBhIGAuc2F2ZUFzYCBtZXRob2QuXG4gIHNhdmVBY3RpdmVQYW5lSXRlbUFzICgpIHtcbiAgICB0aGlzLmdldENlbnRlcigpLmdldEFjdGl2ZVBhbmUoKS5zYXZlQWN0aXZlSXRlbUFzKClcbiAgfVxuXG4gIC8vIERlc3Ryb3kgKGNsb3NlKSB0aGUgYWN0aXZlIHBhbmUgaXRlbS5cbiAgLy9cbiAgLy8gUmVtb3ZlcyB0aGUgYWN0aXZlIHBhbmUgaXRlbSBhbmQgY2FsbHMgdGhlIGAuZGVzdHJveWAgbWV0aG9kIG9uIGl0IGlmIG9uZSBpc1xuICAvLyBkZWZpbmVkLlxuICBkZXN0cm95QWN0aXZlUGFuZUl0ZW0gKCkge1xuICAgIHJldHVybiB0aGlzLmdldEFjdGl2ZVBhbmUoKS5kZXN0cm95QWN0aXZlSXRlbSgpXG4gIH1cblxuICAvKlxuICBTZWN0aW9uOiBQYW5lc1xuICAqL1xuXG4gIC8vIEV4dGVuZGVkOiBHZXQgdGhlIG1vc3QgcmVjZW50bHkgZm9jdXNlZCBwYW5lIGNvbnRhaW5lci5cbiAgLy9cbiAgLy8gUmV0dXJucyBhIHtEb2NrfSBvciB0aGUge1dvcmtzcGFjZUNlbnRlcn0uXG4gIGdldEFjdGl2ZVBhbmVDb250YWluZXIgKCkge1xuICAgIHJldHVybiB0aGlzLmFjdGl2ZVBhbmVDb250YWluZXJcbiAgfVxuXG4gIC8vIEV4dGVuZGVkOiBHZXQgYWxsIHBhbmVzIGluIHRoZSB3b3Jrc3BhY2UuXG4gIC8vXG4gIC8vIFJldHVybnMgYW4ge0FycmF5fSBvZiB7UGFuZX1zLlxuICBnZXRQYW5lcyAoKSB7XG4gICAgcmV0dXJuIF8uZmxhdHRlbih0aGlzLmdldFBhbmVDb250YWluZXJzKCkubWFwKGNvbnRhaW5lciA9PiBjb250YWluZXIuZ2V0UGFuZXMoKSkpXG4gIH1cblxuICBnZXRWaXNpYmxlUGFuZXMgKCkge1xuICAgIHJldHVybiBfLmZsYXR0ZW4odGhpcy5nZXRWaXNpYmxlUGFuZUNvbnRhaW5lcnMoKS5tYXAoY29udGFpbmVyID0+IGNvbnRhaW5lci5nZXRQYW5lcygpKSlcbiAgfVxuXG4gIC8vIEV4dGVuZGVkOiBHZXQgdGhlIGFjdGl2ZSB7UGFuZX0uXG4gIC8vXG4gIC8vIFJldHVybnMgYSB7UGFuZX0uXG4gIGdldEFjdGl2ZVBhbmUgKCkge1xuICAgIHJldHVybiB0aGlzLmdldEFjdGl2ZVBhbmVDb250YWluZXIoKS5nZXRBY3RpdmVQYW5lKClcbiAgfVxuXG4gIC8vIEV4dGVuZGVkOiBNYWtlIHRoZSBuZXh0IHBhbmUgYWN0aXZlLlxuICBhY3RpdmF0ZU5leHRQYW5lICgpIHtcbiAgICByZXR1cm4gdGhpcy5nZXRBY3RpdmVQYW5lQ29udGFpbmVyKCkuYWN0aXZhdGVOZXh0UGFuZSgpXG4gIH1cblxuICAvLyBFeHRlbmRlZDogTWFrZSB0aGUgcHJldmlvdXMgcGFuZSBhY3RpdmUuXG4gIGFjdGl2YXRlUHJldmlvdXNQYW5lICgpIHtcbiAgICByZXR1cm4gdGhpcy5nZXRBY3RpdmVQYW5lQ29udGFpbmVyKCkuYWN0aXZhdGVQcmV2aW91c1BhbmUoKVxuICB9XG5cbiAgLy8gRXh0ZW5kZWQ6IEdldCB0aGUgZmlyc3QgcGFuZSBjb250YWluZXIgdGhhdCBjb250YWlucyBhbiBpdGVtIHdpdGggdGhlIGdpdmVuXG4gIC8vIFVSSS5cbiAgLy9cbiAgLy8gKiBgdXJpYCB7U3RyaW5nfSB1cmlcbiAgLy9cbiAgLy8gUmV0dXJucyBhIHtEb2NrfSwgdGhlIHtXb3Jrc3BhY2VDZW50ZXJ9LCBvciBgdW5kZWZpbmVkYCBpZiBubyBpdGVtIGV4aXN0c1xuICAvLyB3aXRoIHRoZSBnaXZlbiBVUkkuXG4gIHBhbmVDb250YWluZXJGb3JVUkkgKHVyaSkge1xuICAgIHJldHVybiB0aGlzLmdldFBhbmVDb250YWluZXJzKCkuZmluZChjb250YWluZXIgPT4gY29udGFpbmVyLnBhbmVGb3JVUkkodXJpKSlcbiAgfVxuXG4gIC8vIEV4dGVuZGVkOiBHZXQgdGhlIGZpcnN0IHBhbmUgY29udGFpbmVyIHRoYXQgY29udGFpbnMgdGhlIGdpdmVuIGl0ZW0uXG4gIC8vXG4gIC8vICogYGl0ZW1gIHRoZSBJdGVtIHRoYXQgdGhlIHJldHVybmVkIHBhbmUgY29udGFpbmVyIG11c3QgY29udGFpbi5cbiAgLy9cbiAgLy8gUmV0dXJucyBhIHtEb2NrfSwgdGhlIHtXb3Jrc3BhY2VDZW50ZXJ9LCBvciBgdW5kZWZpbmVkYCBpZiBubyBpdGVtIGV4aXN0c1xuICAvLyB3aXRoIHRoZSBnaXZlbiBVUkkuXG4gIHBhbmVDb250YWluZXJGb3JJdGVtICh1cmkpIHtcbiAgICByZXR1cm4gdGhpcy5nZXRQYW5lQ29udGFpbmVycygpLmZpbmQoY29udGFpbmVyID0+IGNvbnRhaW5lci5wYW5lRm9ySXRlbSh1cmkpKVxuICB9XG5cbiAgLy8gRXh0ZW5kZWQ6IEdldCB0aGUgZmlyc3Qge1BhbmV9IHRoYXQgY29udGFpbnMgYW4gaXRlbSB3aXRoIHRoZSBnaXZlbiBVUkkuXG4gIC8vXG4gIC8vICogYHVyaWAge1N0cmluZ30gdXJpXG4gIC8vXG4gIC8vIFJldHVybnMgYSB7UGFuZX0gb3IgYHVuZGVmaW5lZGAgaWYgbm8gaXRlbSBleGlzdHMgd2l0aCB0aGUgZ2l2ZW4gVVJJLlxuICBwYW5lRm9yVVJJICh1cmkpIHtcbiAgICBmb3IgKGxldCBsb2NhdGlvbiBvZiB0aGlzLmdldFBhbmVDb250YWluZXJzKCkpIHtcbiAgICAgIGNvbnN0IHBhbmUgPSBsb2NhdGlvbi5wYW5lRm9yVVJJKHVyaSlcbiAgICAgIGlmIChwYW5lICE9IG51bGwpIHtcbiAgICAgICAgcmV0dXJuIHBhbmVcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvLyBFeHRlbmRlZDogR2V0IHRoZSB7UGFuZX0gY29udGFpbmluZyB0aGUgZ2l2ZW4gaXRlbS5cbiAgLy9cbiAgLy8gKiBgaXRlbWAgdGhlIEl0ZW0gdGhhdCB0aGUgcmV0dXJuZWQgcGFuZSBtdXN0IGNvbnRhaW4uXG4gIC8vXG4gIC8vIFJldHVybnMgYSB7UGFuZX0gb3IgYHVuZGVmaW5lZGAgaWYgbm8gcGFuZSBleGlzdHMgZm9yIHRoZSBnaXZlbiBpdGVtLlxuICBwYW5lRm9ySXRlbSAoaXRlbSkge1xuICAgIGZvciAobGV0IGxvY2F0aW9uIG9mIHRoaXMuZ2V0UGFuZUNvbnRhaW5lcnMoKSkge1xuICAgICAgY29uc3QgcGFuZSA9IGxvY2F0aW9uLnBhbmVGb3JJdGVtKGl0ZW0pXG4gICAgICBpZiAocGFuZSAhPSBudWxsKSB7XG4gICAgICAgIHJldHVybiBwYW5lXG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLy8gRGVzdHJveSAoY2xvc2UpIHRoZSBhY3RpdmUgcGFuZS5cbiAgZGVzdHJveUFjdGl2ZVBhbmUgKCkge1xuICAgIGNvbnN0IGFjdGl2ZVBhbmUgPSB0aGlzLmdldEFjdGl2ZVBhbmUoKVxuICAgIGlmIChhY3RpdmVQYW5lICE9IG51bGwpIHtcbiAgICAgIGFjdGl2ZVBhbmUuZGVzdHJveSgpXG4gICAgfVxuICB9XG5cbiAgLy8gQ2xvc2UgdGhlIGFjdGl2ZSBjZW50ZXIgcGFuZSBpdGVtLCBvciB0aGUgYWN0aXZlIGNlbnRlciBwYW5lIGlmIGl0IGlzXG4gIC8vIGVtcHR5LCBvciB0aGUgY3VycmVudCB3aW5kb3cgaWYgdGhlcmUgaXMgb25seSB0aGUgZW1wdHkgcm9vdCBwYW5lLlxuICBjbG9zZUFjdGl2ZVBhbmVJdGVtT3JFbXB0eVBhbmVPcldpbmRvdyAoKSB7XG4gICAgaWYgKHRoaXMuZ2V0Q2VudGVyKCkuZ2V0QWN0aXZlUGFuZUl0ZW0oKSAhPSBudWxsKSB7XG4gICAgICB0aGlzLmdldENlbnRlcigpLmdldEFjdGl2ZVBhbmUoKS5kZXN0cm95QWN0aXZlSXRlbSgpXG4gICAgfSBlbHNlIGlmICh0aGlzLmdldENlbnRlcigpLmdldFBhbmVzKCkubGVuZ3RoID4gMSkge1xuICAgICAgdGhpcy5nZXRDZW50ZXIoKS5kZXN0cm95QWN0aXZlUGFuZSgpXG4gICAgfSBlbHNlIGlmICh0aGlzLmNvbmZpZy5nZXQoJ2NvcmUuY2xvc2VFbXB0eVdpbmRvd3MnKSkge1xuICAgICAgYXRvbS5jbG9zZSgpXG4gICAgfVxuICB9XG5cbiAgLy8gSW5jcmVhc2UgdGhlIGVkaXRvciBmb250IHNpemUgYnkgMXB4LlxuICBpbmNyZWFzZUZvbnRTaXplICgpIHtcbiAgICB0aGlzLmNvbmZpZy5zZXQoJ2VkaXRvci5mb250U2l6ZScsIHRoaXMuY29uZmlnLmdldCgnZWRpdG9yLmZvbnRTaXplJykgKyAxKVxuICB9XG5cbiAgLy8gRGVjcmVhc2UgdGhlIGVkaXRvciBmb250IHNpemUgYnkgMXB4LlxuICBkZWNyZWFzZUZvbnRTaXplICgpIHtcbiAgICBjb25zdCBmb250U2l6ZSA9IHRoaXMuY29uZmlnLmdldCgnZWRpdG9yLmZvbnRTaXplJylcbiAgICBpZiAoZm9udFNpemUgPiAxKSB7XG4gICAgICB0aGlzLmNvbmZpZy5zZXQoJ2VkaXRvci5mb250U2l6ZScsIGZvbnRTaXplIC0gMSlcbiAgICB9XG4gIH1cblxuICAvLyBSZXN0b3JlIHRvIHRoZSB3aW5kb3cncyBvcmlnaW5hbCBlZGl0b3IgZm9udCBzaXplLlxuICByZXNldEZvbnRTaXplICgpIHtcbiAgICBpZiAodGhpcy5vcmlnaW5hbEZvbnRTaXplKSB7XG4gICAgICB0aGlzLmNvbmZpZy5zZXQoJ2VkaXRvci5mb250U2l6ZScsIHRoaXMub3JpZ2luYWxGb250U2l6ZSlcbiAgICB9XG4gIH1cblxuICBzdWJzY3JpYmVUb0ZvbnRTaXplICgpIHtcbiAgICByZXR1cm4gdGhpcy5jb25maWcub25EaWRDaGFuZ2UoJ2VkaXRvci5mb250U2l6ZScsICh7b2xkVmFsdWV9KSA9PiB7XG4gICAgICBpZiAodGhpcy5vcmlnaW5hbEZvbnRTaXplID09IG51bGwpIHtcbiAgICAgICAgdGhpcy5vcmlnaW5hbEZvbnRTaXplID0gb2xkVmFsdWVcbiAgICAgIH1cbiAgICB9KVxuICB9XG5cbiAgLy8gUmVtb3ZlcyB0aGUgaXRlbSdzIHVyaSBmcm9tIHRoZSBsaXN0IG9mIHBvdGVudGlhbCBpdGVtcyB0byByZW9wZW4uXG4gIGl0ZW1PcGVuZWQgKGl0ZW0pIHtcbiAgICBsZXQgdXJpXG4gICAgaWYgKHR5cGVvZiBpdGVtLmdldFVSSSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgdXJpID0gaXRlbS5nZXRVUkkoKVxuICAgIH0gZWxzZSBpZiAodHlwZW9mIGl0ZW0uZ2V0VXJpID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICB1cmkgPSBpdGVtLmdldFVyaSgpXG4gICAgfVxuXG4gICAgaWYgKHVyaSAhPSBudWxsKSB7XG4gICAgICBfLnJlbW92ZSh0aGlzLmRlc3Ryb3llZEl0ZW1VUklzLCB1cmkpXG4gICAgfVxuICB9XG5cbiAgLy8gQWRkcyB0aGUgZGVzdHJveWVkIGl0ZW0ncyB1cmkgdG8gdGhlIGxpc3Qgb2YgaXRlbXMgdG8gcmVvcGVuLlxuICBkaWREZXN0cm95UGFuZUl0ZW0gKHtpdGVtfSkge1xuICAgIGxldCB1cmlcbiAgICBpZiAodHlwZW9mIGl0ZW0uZ2V0VVJJID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICB1cmkgPSBpdGVtLmdldFVSSSgpXG4gICAgfSBlbHNlIGlmICh0eXBlb2YgaXRlbS5nZXRVcmkgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgIHVyaSA9IGl0ZW0uZ2V0VXJpKClcbiAgICB9XG5cbiAgICBpZiAodXJpICE9IG51bGwpIHtcbiAgICAgIHRoaXMuZGVzdHJveWVkSXRlbVVSSXMucHVzaCh1cmkpXG4gICAgfVxuICB9XG5cbiAgLy8gQ2FsbGVkIGJ5IE1vZGVsIHN1cGVyY2xhc3Mgd2hlbiBkZXN0cm95ZWRcbiAgZGVzdHJveWVkICgpIHtcbiAgICB0aGlzLnBhbmVDb250YWluZXJzLmNlbnRlci5kZXN0cm95KClcbiAgICB0aGlzLnBhbmVDb250YWluZXJzLmxlZnQuZGVzdHJveSgpXG4gICAgdGhpcy5wYW5lQ29udGFpbmVycy5yaWdodC5kZXN0cm95KClcbiAgICB0aGlzLnBhbmVDb250YWluZXJzLmJvdHRvbS5kZXN0cm95KClcbiAgICB0aGlzLmNhbmNlbFN0b3BwZWRDaGFuZ2luZ0FjdGl2ZVBhbmVJdGVtVGltZW91dCgpXG4gICAgaWYgKHRoaXMuYWN0aXZlSXRlbVN1YnNjcmlwdGlvbnMgIT0gbnVsbCkge1xuICAgICAgdGhpcy5hY3RpdmVJdGVtU3Vic2NyaXB0aW9ucy5kaXNwb3NlKClcbiAgICB9XG4gIH1cblxuICAvKlxuICBTZWN0aW9uOiBQYW5lIExvY2F0aW9uc1xuICAqL1xuXG4gIC8vIEVzc2VudGlhbDogR2V0IHRoZSB7V29ya3NwYWNlQ2VudGVyfSBhdCB0aGUgY2VudGVyIG9mIHRoZSBlZGl0b3Igd2luZG93LlxuICBnZXRDZW50ZXIgKCkge1xuICAgIHJldHVybiB0aGlzLnBhbmVDb250YWluZXJzLmNlbnRlclxuICB9XG5cbiAgLy8gRXNzZW50aWFsOiBHZXQgdGhlIHtEb2NrfSB0byB0aGUgbGVmdCBvZiB0aGUgZWRpdG9yIHdpbmRvdy5cbiAgZ2V0TGVmdERvY2sgKCkge1xuICAgIHJldHVybiB0aGlzLnBhbmVDb250YWluZXJzLmxlZnRcbiAgfVxuXG4gIC8vIEVzc2VudGlhbDogR2V0IHRoZSB7RG9ja30gdG8gdGhlIHJpZ2h0IG9mIHRoZSBlZGl0b3Igd2luZG93LlxuICBnZXRSaWdodERvY2sgKCkge1xuICAgIHJldHVybiB0aGlzLnBhbmVDb250YWluZXJzLnJpZ2h0XG4gIH1cblxuICAvLyBFc3NlbnRpYWw6IEdldCB0aGUge0RvY2t9IGJlbG93IHRoZSBlZGl0b3Igd2luZG93LlxuICBnZXRCb3R0b21Eb2NrICgpIHtcbiAgICByZXR1cm4gdGhpcy5wYW5lQ29udGFpbmVycy5ib3R0b21cbiAgfVxuXG4gIGdldFBhbmVDb250YWluZXJzICgpIHtcbiAgICByZXR1cm4gW1xuICAgICAgdGhpcy5wYW5lQ29udGFpbmVycy5jZW50ZXIsXG4gICAgICB0aGlzLnBhbmVDb250YWluZXJzLmxlZnQsXG4gICAgICB0aGlzLnBhbmVDb250YWluZXJzLnJpZ2h0LFxuICAgICAgdGhpcy5wYW5lQ29udGFpbmVycy5ib3R0b21cbiAgICBdXG4gIH1cblxuICBnZXRWaXNpYmxlUGFuZUNvbnRhaW5lcnMgKCkge1xuICAgIGNvbnN0IGNlbnRlciA9IHRoaXMuZ2V0Q2VudGVyKClcbiAgICByZXR1cm4gYXRvbS53b3Jrc3BhY2UuZ2V0UGFuZUNvbnRhaW5lcnMoKVxuICAgICAgLmZpbHRlcihjb250YWluZXIgPT4gY29udGFpbmVyID09PSBjZW50ZXIgfHwgY29udGFpbmVyLmlzVmlzaWJsZSgpKVxuICB9XG5cbiAgLypcbiAgU2VjdGlvbjogUGFuZWxzXG5cbiAgUGFuZWxzIGFyZSB1c2VkIHRvIGRpc3BsYXkgVUkgcmVsYXRlZCB0byBhbiBlZGl0b3Igd2luZG93LiBUaGV5IGFyZSBwbGFjZWQgYXQgb25lIG9mIHRoZSBmb3VyXG4gIGVkZ2VzIG9mIHRoZSB3aW5kb3c6IGxlZnQsIHJpZ2h0LCB0b3Agb3IgYm90dG9tLiBJZiB0aGVyZSBhcmUgbXVsdGlwbGUgcGFuZWxzIG9uIHRoZSBzYW1lIHdpbmRvd1xuICBlZGdlIHRoZXkgYXJlIHN0YWNrZWQgaW4gb3JkZXIgb2YgcHJpb3JpdHk6IGhpZ2hlciBwcmlvcml0eSBpcyBjbG9zZXIgdG8gdGhlIGNlbnRlciwgbG93ZXJcbiAgcHJpb3JpdHkgdG93YXJkcyB0aGUgZWRnZS5cblxuICAqTm90ZToqIElmIHlvdXIgcGFuZWwgY2hhbmdlcyBpdHMgc2l6ZSB0aHJvdWdob3V0IGl0cyBsaWZldGltZSwgY29uc2lkZXIgZ2l2aW5nIGl0IGEgaGlnaGVyXG4gIHByaW9yaXR5LCBhbGxvd2luZyBmaXhlZCBzaXplIHBhbmVscyB0byBiZSBjbG9zZXIgdG8gdGhlIGVkZ2UuIFRoaXMgYWxsb3dzIGNvbnRyb2wgdGFyZ2V0cyB0b1xuICByZW1haW4gbW9yZSBzdGF0aWMgZm9yIGVhc2llciB0YXJnZXRpbmcgYnkgdXNlcnMgdGhhdCBlbXBsb3kgbWljZSBvciB0cmFja3BhZHMuIChTZWVcbiAgW2F0b20vYXRvbSM0ODM0XShodHRwczovL2dpdGh1Yi5jb20vYXRvbS9hdG9tL2lzc3Vlcy80ODM0KSBmb3IgZGlzY3Vzc2lvbi4pXG4gICovXG5cbiAgLy8gRXNzZW50aWFsOiBHZXQgYW4ge0FycmF5fSBvZiBhbGwgdGhlIHBhbmVsIGl0ZW1zIGF0IHRoZSBib3R0b20gb2YgdGhlIGVkaXRvciB3aW5kb3cuXG4gIGdldEJvdHRvbVBhbmVscyAoKSB7XG4gICAgcmV0dXJuIHRoaXMuZ2V0UGFuZWxzKCdib3R0b20nKVxuICB9XG5cbiAgLy8gRXNzZW50aWFsOiBBZGRzIGEgcGFuZWwgaXRlbSB0byB0aGUgYm90dG9tIG9mIHRoZSBlZGl0b3Igd2luZG93LlxuICAvL1xuICAvLyAqIGBvcHRpb25zYCB7T2JqZWN0fVxuICAvLyAgICogYGl0ZW1gIFlvdXIgcGFuZWwgY29udGVudC4gSXQgY2FuIGJlIERPTSBlbGVtZW50LCBhIGpRdWVyeSBlbGVtZW50LCBvclxuICAvLyAgICAgYSBtb2RlbCB3aXRoIGEgdmlldyByZWdpc3RlcmVkIHZpYSB7Vmlld1JlZ2lzdHJ5OjphZGRWaWV3UHJvdmlkZXJ9LiBXZSByZWNvbW1lbmQgdGhlXG4gIC8vICAgICBsYXR0ZXIuIFNlZSB7Vmlld1JlZ2lzdHJ5OjphZGRWaWV3UHJvdmlkZXJ9IGZvciBtb3JlIGluZm9ybWF0aW9uLlxuICAvLyAgICogYHZpc2libGVgIChvcHRpb25hbCkge0Jvb2xlYW59IGZhbHNlIGlmIHlvdSB3YW50IHRoZSBwYW5lbCB0byBpbml0aWFsbHkgYmUgaGlkZGVuXG4gIC8vICAgICAoZGVmYXVsdDogdHJ1ZSlcbiAgLy8gICAqIGBwcmlvcml0eWAgKG9wdGlvbmFsKSB7TnVtYmVyfSBEZXRlcm1pbmVzIHN0YWNraW5nIG9yZGVyLiBMb3dlciBwcmlvcml0eSBpdGVtcyBhcmVcbiAgLy8gICAgIGZvcmNlZCBjbG9zZXIgdG8gdGhlIGVkZ2VzIG9mIHRoZSB3aW5kb3cuIChkZWZhdWx0OiAxMDApXG4gIC8vXG4gIC8vIFJldHVybnMgYSB7UGFuZWx9XG4gIGFkZEJvdHRvbVBhbmVsIChvcHRpb25zKSB7XG4gICAgcmV0dXJuIHRoaXMuYWRkUGFuZWwoJ2JvdHRvbScsIG9wdGlvbnMpXG4gIH1cblxuICAvLyBFc3NlbnRpYWw6IEdldCBhbiB7QXJyYXl9IG9mIGFsbCB0aGUgcGFuZWwgaXRlbXMgdG8gdGhlIGxlZnQgb2YgdGhlIGVkaXRvciB3aW5kb3cuXG4gIGdldExlZnRQYW5lbHMgKCkge1xuICAgIHJldHVybiB0aGlzLmdldFBhbmVscygnbGVmdCcpXG4gIH1cblxuICAvLyBFc3NlbnRpYWw6IEFkZHMgYSBwYW5lbCBpdGVtIHRvIHRoZSBsZWZ0IG9mIHRoZSBlZGl0b3Igd2luZG93LlxuICAvL1xuICAvLyAqIGBvcHRpb25zYCB7T2JqZWN0fVxuICAvLyAgICogYGl0ZW1gIFlvdXIgcGFuZWwgY29udGVudC4gSXQgY2FuIGJlIERPTSBlbGVtZW50LCBhIGpRdWVyeSBlbGVtZW50LCBvclxuICAvLyAgICAgYSBtb2RlbCB3aXRoIGEgdmlldyByZWdpc3RlcmVkIHZpYSB7Vmlld1JlZ2lzdHJ5OjphZGRWaWV3UHJvdmlkZXJ9LiBXZSByZWNvbW1lbmQgdGhlXG4gIC8vICAgICBsYXR0ZXIuIFNlZSB7Vmlld1JlZ2lzdHJ5OjphZGRWaWV3UHJvdmlkZXJ9IGZvciBtb3JlIGluZm9ybWF0aW9uLlxuICAvLyAgICogYHZpc2libGVgIChvcHRpb25hbCkge0Jvb2xlYW59IGZhbHNlIGlmIHlvdSB3YW50IHRoZSBwYW5lbCB0byBpbml0aWFsbHkgYmUgaGlkZGVuXG4gIC8vICAgICAoZGVmYXVsdDogdHJ1ZSlcbiAgLy8gICAqIGBwcmlvcml0eWAgKG9wdGlvbmFsKSB7TnVtYmVyfSBEZXRlcm1pbmVzIHN0YWNraW5nIG9yZGVyLiBMb3dlciBwcmlvcml0eSBpdGVtcyBhcmVcbiAgLy8gICAgIGZvcmNlZCBjbG9zZXIgdG8gdGhlIGVkZ2VzIG9mIHRoZSB3aW5kb3cuIChkZWZhdWx0OiAxMDApXG4gIC8vXG4gIC8vIFJldHVybnMgYSB7UGFuZWx9XG4gIGFkZExlZnRQYW5lbCAob3B0aW9ucykge1xuICAgIHJldHVybiB0aGlzLmFkZFBhbmVsKCdsZWZ0Jywgb3B0aW9ucylcbiAgfVxuXG4gIC8vIEVzc2VudGlhbDogR2V0IGFuIHtBcnJheX0gb2YgYWxsIHRoZSBwYW5lbCBpdGVtcyB0byB0aGUgcmlnaHQgb2YgdGhlIGVkaXRvciB3aW5kb3cuXG4gIGdldFJpZ2h0UGFuZWxzICgpIHtcbiAgICByZXR1cm4gdGhpcy5nZXRQYW5lbHMoJ3JpZ2h0JylcbiAgfVxuXG4gIC8vIEVzc2VudGlhbDogQWRkcyBhIHBhbmVsIGl0ZW0gdG8gdGhlIHJpZ2h0IG9mIHRoZSBlZGl0b3Igd2luZG93LlxuICAvL1xuICAvLyAqIGBvcHRpb25zYCB7T2JqZWN0fVxuICAvLyAgICogYGl0ZW1gIFlvdXIgcGFuZWwgY29udGVudC4gSXQgY2FuIGJlIERPTSBlbGVtZW50LCBhIGpRdWVyeSBlbGVtZW50LCBvclxuICAvLyAgICAgYSBtb2RlbCB3aXRoIGEgdmlldyByZWdpc3RlcmVkIHZpYSB7Vmlld1JlZ2lzdHJ5OjphZGRWaWV3UHJvdmlkZXJ9LiBXZSByZWNvbW1lbmQgdGhlXG4gIC8vICAgICBsYXR0ZXIuIFNlZSB7Vmlld1JlZ2lzdHJ5OjphZGRWaWV3UHJvdmlkZXJ9IGZvciBtb3JlIGluZm9ybWF0aW9uLlxuICAvLyAgICogYHZpc2libGVgIChvcHRpb25hbCkge0Jvb2xlYW59IGZhbHNlIGlmIHlvdSB3YW50IHRoZSBwYW5lbCB0byBpbml0aWFsbHkgYmUgaGlkZGVuXG4gIC8vICAgICAoZGVmYXVsdDogdHJ1ZSlcbiAgLy8gICAqIGBwcmlvcml0eWAgKG9wdGlvbmFsKSB7TnVtYmVyfSBEZXRlcm1pbmVzIHN0YWNraW5nIG9yZGVyLiBMb3dlciBwcmlvcml0eSBpdGVtcyBhcmVcbiAgLy8gICAgIGZvcmNlZCBjbG9zZXIgdG8gdGhlIGVkZ2VzIG9mIHRoZSB3aW5kb3cuIChkZWZhdWx0OiAxMDApXG4gIC8vXG4gIC8vIFJldHVybnMgYSB7UGFuZWx9XG4gIGFkZFJpZ2h0UGFuZWwgKG9wdGlvbnMpIHtcbiAgICByZXR1cm4gdGhpcy5hZGRQYW5lbCgncmlnaHQnLCBvcHRpb25zKVxuICB9XG5cbiAgLy8gRXNzZW50aWFsOiBHZXQgYW4ge0FycmF5fSBvZiBhbGwgdGhlIHBhbmVsIGl0ZW1zIGF0IHRoZSB0b3Agb2YgdGhlIGVkaXRvciB3aW5kb3cuXG4gIGdldFRvcFBhbmVscyAoKSB7XG4gICAgcmV0dXJuIHRoaXMuZ2V0UGFuZWxzKCd0b3AnKVxuICB9XG5cbiAgLy8gRXNzZW50aWFsOiBBZGRzIGEgcGFuZWwgaXRlbSB0byB0aGUgdG9wIG9mIHRoZSBlZGl0b3Igd2luZG93IGFib3ZlIHRoZSB0YWJzLlxuICAvL1xuICAvLyAqIGBvcHRpb25zYCB7T2JqZWN0fVxuICAvLyAgICogYGl0ZW1gIFlvdXIgcGFuZWwgY29udGVudC4gSXQgY2FuIGJlIERPTSBlbGVtZW50LCBhIGpRdWVyeSBlbGVtZW50LCBvclxuICAvLyAgICAgYSBtb2RlbCB3aXRoIGEgdmlldyByZWdpc3RlcmVkIHZpYSB7Vmlld1JlZ2lzdHJ5OjphZGRWaWV3UHJvdmlkZXJ9LiBXZSByZWNvbW1lbmQgdGhlXG4gIC8vICAgICBsYXR0ZXIuIFNlZSB7Vmlld1JlZ2lzdHJ5OjphZGRWaWV3UHJvdmlkZXJ9IGZvciBtb3JlIGluZm9ybWF0aW9uLlxuICAvLyAgICogYHZpc2libGVgIChvcHRpb25hbCkge0Jvb2xlYW59IGZhbHNlIGlmIHlvdSB3YW50IHRoZSBwYW5lbCB0byBpbml0aWFsbHkgYmUgaGlkZGVuXG4gIC8vICAgICAoZGVmYXVsdDogdHJ1ZSlcbiAgLy8gICAqIGBwcmlvcml0eWAgKG9wdGlvbmFsKSB7TnVtYmVyfSBEZXRlcm1pbmVzIHN0YWNraW5nIG9yZGVyLiBMb3dlciBwcmlvcml0eSBpdGVtcyBhcmVcbiAgLy8gICAgIGZvcmNlZCBjbG9zZXIgdG8gdGhlIGVkZ2VzIG9mIHRoZSB3aW5kb3cuIChkZWZhdWx0OiAxMDApXG4gIC8vXG4gIC8vIFJldHVybnMgYSB7UGFuZWx9XG4gIGFkZFRvcFBhbmVsIChvcHRpb25zKSB7XG4gICAgcmV0dXJuIHRoaXMuYWRkUGFuZWwoJ3RvcCcsIG9wdGlvbnMpXG4gIH1cblxuICAvLyBFc3NlbnRpYWw6IEdldCBhbiB7QXJyYXl9IG9mIGFsbCB0aGUgcGFuZWwgaXRlbXMgaW4gdGhlIGhlYWRlci5cbiAgZ2V0SGVhZGVyUGFuZWxzICgpIHtcbiAgICByZXR1cm4gdGhpcy5nZXRQYW5lbHMoJ2hlYWRlcicpXG4gIH1cblxuICAvLyBFc3NlbnRpYWw6IEFkZHMgYSBwYW5lbCBpdGVtIHRvIHRoZSBoZWFkZXIuXG4gIC8vXG4gIC8vICogYG9wdGlvbnNgIHtPYmplY3R9XG4gIC8vICAgKiBgaXRlbWAgWW91ciBwYW5lbCBjb250ZW50LiBJdCBjYW4gYmUgRE9NIGVsZW1lbnQsIGEgalF1ZXJ5IGVsZW1lbnQsIG9yXG4gIC8vICAgICBhIG1vZGVsIHdpdGggYSB2aWV3IHJlZ2lzdGVyZWQgdmlhIHtWaWV3UmVnaXN0cnk6OmFkZFZpZXdQcm92aWRlcn0uIFdlIHJlY29tbWVuZCB0aGVcbiAgLy8gICAgIGxhdHRlci4gU2VlIHtWaWV3UmVnaXN0cnk6OmFkZFZpZXdQcm92aWRlcn0gZm9yIG1vcmUgaW5mb3JtYXRpb24uXG4gIC8vICAgKiBgdmlzaWJsZWAgKG9wdGlvbmFsKSB7Qm9vbGVhbn0gZmFsc2UgaWYgeW91IHdhbnQgdGhlIHBhbmVsIHRvIGluaXRpYWxseSBiZSBoaWRkZW5cbiAgLy8gICAgIChkZWZhdWx0OiB0cnVlKVxuICAvLyAgICogYHByaW9yaXR5YCAob3B0aW9uYWwpIHtOdW1iZXJ9IERldGVybWluZXMgc3RhY2tpbmcgb3JkZXIuIExvd2VyIHByaW9yaXR5IGl0ZW1zIGFyZVxuICAvLyAgICAgZm9yY2VkIGNsb3NlciB0byB0aGUgZWRnZXMgb2YgdGhlIHdpbmRvdy4gKGRlZmF1bHQ6IDEwMClcbiAgLy9cbiAgLy8gUmV0dXJucyBhIHtQYW5lbH1cbiAgYWRkSGVhZGVyUGFuZWwgKG9wdGlvbnMpIHtcbiAgICByZXR1cm4gdGhpcy5hZGRQYW5lbCgnaGVhZGVyJywgb3B0aW9ucylcbiAgfVxuXG4gIC8vIEVzc2VudGlhbDogR2V0IGFuIHtBcnJheX0gb2YgYWxsIHRoZSBwYW5lbCBpdGVtcyBpbiB0aGUgZm9vdGVyLlxuICBnZXRGb290ZXJQYW5lbHMgKCkge1xuICAgIHJldHVybiB0aGlzLmdldFBhbmVscygnZm9vdGVyJylcbiAgfVxuXG4gIC8vIEVzc2VudGlhbDogQWRkcyBhIHBhbmVsIGl0ZW0gdG8gdGhlIGZvb3Rlci5cbiAgLy9cbiAgLy8gKiBgb3B0aW9uc2Age09iamVjdH1cbiAgLy8gICAqIGBpdGVtYCBZb3VyIHBhbmVsIGNvbnRlbnQuIEl0IGNhbiBiZSBET00gZWxlbWVudCwgYSBqUXVlcnkgZWxlbWVudCwgb3JcbiAgLy8gICAgIGEgbW9kZWwgd2l0aCBhIHZpZXcgcmVnaXN0ZXJlZCB2aWEge1ZpZXdSZWdpc3RyeTo6YWRkVmlld1Byb3ZpZGVyfS4gV2UgcmVjb21tZW5kIHRoZVxuICAvLyAgICAgbGF0dGVyLiBTZWUge1ZpZXdSZWdpc3RyeTo6YWRkVmlld1Byb3ZpZGVyfSBmb3IgbW9yZSBpbmZvcm1hdGlvbi5cbiAgLy8gICAqIGB2aXNpYmxlYCAob3B0aW9uYWwpIHtCb29sZWFufSBmYWxzZSBpZiB5b3Ugd2FudCB0aGUgcGFuZWwgdG8gaW5pdGlhbGx5IGJlIGhpZGRlblxuICAvLyAgICAgKGRlZmF1bHQ6IHRydWUpXG4gIC8vICAgKiBgcHJpb3JpdHlgIChvcHRpb25hbCkge051bWJlcn0gRGV0ZXJtaW5lcyBzdGFja2luZyBvcmRlci4gTG93ZXIgcHJpb3JpdHkgaXRlbXMgYXJlXG4gIC8vICAgICBmb3JjZWQgY2xvc2VyIHRvIHRoZSBlZGdlcyBvZiB0aGUgd2luZG93LiAoZGVmYXVsdDogMTAwKVxuICAvL1xuICAvLyBSZXR1cm5zIGEge1BhbmVsfVxuICBhZGRGb290ZXJQYW5lbCAob3B0aW9ucykge1xuICAgIHJldHVybiB0aGlzLmFkZFBhbmVsKCdmb290ZXInLCBvcHRpb25zKVxuICB9XG5cbiAgLy8gRXNzZW50aWFsOiBHZXQgYW4ge0FycmF5fSBvZiBhbGwgdGhlIG1vZGFsIHBhbmVsIGl0ZW1zXG4gIGdldE1vZGFsUGFuZWxzICgpIHtcbiAgICByZXR1cm4gdGhpcy5nZXRQYW5lbHMoJ21vZGFsJylcbiAgfVxuXG4gIC8vIEVzc2VudGlhbDogQWRkcyBhIHBhbmVsIGl0ZW0gYXMgYSBtb2RhbCBkaWFsb2cuXG4gIC8vXG4gIC8vICogYG9wdGlvbnNgIHtPYmplY3R9XG4gIC8vICAgKiBgaXRlbWAgWW91ciBwYW5lbCBjb250ZW50LiBJdCBjYW4gYmUgYSBET00gZWxlbWVudCwgYSBqUXVlcnkgZWxlbWVudCwgb3JcbiAgLy8gICAgIGEgbW9kZWwgd2l0aCBhIHZpZXcgcmVnaXN0ZXJlZCB2aWEge1ZpZXdSZWdpc3RyeTo6YWRkVmlld1Byb3ZpZGVyfS4gV2UgcmVjb21tZW5kIHRoZVxuICAvLyAgICAgbW9kZWwgb3B0aW9uLiBTZWUge1ZpZXdSZWdpc3RyeTo6YWRkVmlld1Byb3ZpZGVyfSBmb3IgbW9yZSBpbmZvcm1hdGlvbi5cbiAgLy8gICAqIGB2aXNpYmxlYCAob3B0aW9uYWwpIHtCb29sZWFufSBmYWxzZSBpZiB5b3Ugd2FudCB0aGUgcGFuZWwgdG8gaW5pdGlhbGx5IGJlIGhpZGRlblxuICAvLyAgICAgKGRlZmF1bHQ6IHRydWUpXG4gIC8vICAgKiBgcHJpb3JpdHlgIChvcHRpb25hbCkge051bWJlcn0gRGV0ZXJtaW5lcyBzdGFja2luZyBvcmRlci4gTG93ZXIgcHJpb3JpdHkgaXRlbXMgYXJlXG4gIC8vICAgICBmb3JjZWQgY2xvc2VyIHRvIHRoZSBlZGdlcyBvZiB0aGUgd2luZG93LiAoZGVmYXVsdDogMTAwKVxuICAvLyAgICogYGF1dG9Gb2N1c2AgKG9wdGlvbmFsKSB7Qm9vbGVhbn0gdHJ1ZSBpZiB5b3Ugd2FudCBtb2RhbCBmb2N1cyBtYW5hZ2VkIGZvciB5b3UgYnkgQXRvbS5cbiAgLy8gICAgIEF0b20gd2lsbCBhdXRvbWF0aWNhbGx5IGZvY3VzIHlvdXIgbW9kYWwgcGFuZWwncyBmaXJzdCB0YWJiYWJsZSBlbGVtZW50IHdoZW4gdGhlIG1vZGFsXG4gIC8vICAgICBvcGVucyBhbmQgd2lsbCByZXN0b3JlIHRoZSBwcmV2aW91c2x5IHNlbGVjdGVkIGVsZW1lbnQgd2hlbiB0aGUgbW9kYWwgY2xvc2VzLiBBdG9tIHdpbGxcbiAgLy8gICAgIGFsc28gYXV0b21hdGljYWxseSByZXN0cmljdCB1c2VyIHRhYiBmb2N1cyB3aXRoaW4geW91ciBtb2RhbCB3aGlsZSBpdCBpcyBvcGVuLlxuICAvLyAgICAgKGRlZmF1bHQ6IGZhbHNlKVxuICAvL1xuICAvLyBSZXR1cm5zIGEge1BhbmVsfVxuICBhZGRNb2RhbFBhbmVsIChvcHRpb25zID0ge30pIHtcbiAgICByZXR1cm4gdGhpcy5hZGRQYW5lbCgnbW9kYWwnLCBvcHRpb25zKVxuICB9XG5cbiAgLy8gRXNzZW50aWFsOiBSZXR1cm5zIHRoZSB7UGFuZWx9IGFzc29jaWF0ZWQgd2l0aCB0aGUgZ2l2ZW4gaXRlbS4gUmV0dXJuc1xuICAvLyBgbnVsbGAgd2hlbiB0aGUgaXRlbSBoYXMgbm8gcGFuZWwuXG4gIC8vXG4gIC8vICogYGl0ZW1gIEl0ZW0gdGhlIHBhbmVsIGNvbnRhaW5zXG4gIHBhbmVsRm9ySXRlbSAoaXRlbSkge1xuICAgIGZvciAobGV0IGxvY2F0aW9uIGluIHRoaXMucGFuZWxDb250YWluZXJzKSB7XG4gICAgICBjb25zdCBjb250YWluZXIgPSB0aGlzLnBhbmVsQ29udGFpbmVyc1tsb2NhdGlvbl1cbiAgICAgIGNvbnN0IHBhbmVsID0gY29udGFpbmVyLnBhbmVsRm9ySXRlbShpdGVtKVxuICAgICAgaWYgKHBhbmVsICE9IG51bGwpIHsgcmV0dXJuIHBhbmVsIH1cbiAgICB9XG4gICAgcmV0dXJuIG51bGxcbiAgfVxuXG4gIGdldFBhbmVscyAobG9jYXRpb24pIHtcbiAgICByZXR1cm4gdGhpcy5wYW5lbENvbnRhaW5lcnNbbG9jYXRpb25dLmdldFBhbmVscygpXG4gIH1cblxuICBhZGRQYW5lbCAobG9jYXRpb24sIG9wdGlvbnMpIHtcbiAgICBpZiAob3B0aW9ucyA9PSBudWxsKSB7IG9wdGlvbnMgPSB7fSB9XG4gICAgcmV0dXJuIHRoaXMucGFuZWxDb250YWluZXJzW2xvY2F0aW9uXS5hZGRQYW5lbChuZXcgUGFuZWwob3B0aW9ucywgdGhpcy52aWV3UmVnaXN0cnkpKVxuICB9XG5cbiAgLypcbiAgU2VjdGlvbjogU2VhcmNoaW5nIGFuZCBSZXBsYWNpbmdcbiAgKi9cblxuICAvLyBQdWJsaWM6IFBlcmZvcm1zIGEgc2VhcmNoIGFjcm9zcyBhbGwgZmlsZXMgaW4gdGhlIHdvcmtzcGFjZS5cbiAgLy9cbiAgLy8gKiBgcmVnZXhgIHtSZWdFeHB9IHRvIHNlYXJjaCB3aXRoLlxuICAvLyAqIGBvcHRpb25zYCAob3B0aW9uYWwpIHtPYmplY3R9XG4gIC8vICAgKiBgcGF0aHNgIEFuIHtBcnJheX0gb2YgZ2xvYiBwYXR0ZXJucyB0byBzZWFyY2ggd2l0aGluLlxuICAvLyAgICogYG9uUGF0aHNTZWFyY2hlZGAgKG9wdGlvbmFsKSB7RnVuY3Rpb259IHRvIGJlIHBlcmlvZGljYWxseSBjYWxsZWRcbiAgLy8gICAgIHdpdGggbnVtYmVyIG9mIHBhdGhzIHNlYXJjaGVkLlxuICAvLyAgICogYGxlYWRpbmdDb250ZXh0TGluZUNvdW50YCB7TnVtYmVyfSBkZWZhdWx0IGAwYDsgVGhlIG51bWJlciBvZiBsaW5lc1xuICAvLyAgICAgIGJlZm9yZSB0aGUgbWF0Y2hlZCBsaW5lIHRvIGluY2x1ZGUgaW4gdGhlIHJlc3VsdHMgb2JqZWN0LlxuICAvLyAgICogYHRyYWlsaW5nQ29udGV4dExpbmVDb3VudGAge051bWJlcn0gZGVmYXVsdCBgMGA7IFRoZSBudW1iZXIgb2YgbGluZXNcbiAgLy8gICAgICBhZnRlciB0aGUgbWF0Y2hlZCBsaW5lIHRvIGluY2x1ZGUgaW4gdGhlIHJlc3VsdHMgb2JqZWN0LlxuICAvLyAqIGBpdGVyYXRvcmAge0Z1bmN0aW9ufSBjYWxsYmFjayBvbiBlYWNoIGZpbGUgZm91bmQuXG4gIC8vXG4gIC8vIFJldHVybnMgYSB7UHJvbWlzZX0gd2l0aCBhIGBjYW5jZWwoKWAgbWV0aG9kIHRoYXQgd2lsbCBjYW5jZWwgYWxsXG4gIC8vIG9mIHRoZSB1bmRlcmx5aW5nIHNlYXJjaGVzIHRoYXQgd2VyZSBzdGFydGVkIGFzIHBhcnQgb2YgdGhpcyBzY2FuLlxuICBzY2FuIChyZWdleCwgb3B0aW9ucyA9IHt9LCBpdGVyYXRvcikge1xuICAgIGlmIChfLmlzRnVuY3Rpb24ob3B0aW9ucykpIHtcbiAgICAgIGl0ZXJhdG9yID0gb3B0aW9uc1xuICAgICAgb3B0aW9ucyA9IHt9XG4gICAgfVxuXG4gICAgLy8gRmluZCBhIHNlYXJjaGVyIGZvciBldmVyeSBEaXJlY3RvcnkgaW4gdGhlIHByb2plY3QuIEVhY2ggc2VhcmNoZXIgdGhhdCBpcyBtYXRjaGVkXG4gICAgLy8gd2lsbCBiZSBhc3NvY2lhdGVkIHdpdGggYW4gQXJyYXkgb2YgRGlyZWN0b3J5IG9iamVjdHMgaW4gdGhlIE1hcC5cbiAgICBjb25zdCBkaXJlY3Rvcmllc0ZvclNlYXJjaGVyID0gbmV3IE1hcCgpXG4gICAgZm9yIChjb25zdCBkaXJlY3Rvcnkgb2YgdGhpcy5wcm9qZWN0LmdldERpcmVjdG9yaWVzKCkpIHtcbiAgICAgIGxldCBzZWFyY2hlciA9IHRoaXMuZGVmYXVsdERpcmVjdG9yeVNlYXJjaGVyXG4gICAgICBmb3IgKGNvbnN0IGRpcmVjdG9yeVNlYXJjaGVyIG9mIHRoaXMuZGlyZWN0b3J5U2VhcmNoZXJzKSB7XG4gICAgICAgIGlmIChkaXJlY3RvcnlTZWFyY2hlci5jYW5TZWFyY2hEaXJlY3RvcnkoZGlyZWN0b3J5KSkge1xuICAgICAgICAgIHNlYXJjaGVyID0gZGlyZWN0b3J5U2VhcmNoZXJcbiAgICAgICAgICBicmVha1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBsZXQgZGlyZWN0b3JpZXMgPSBkaXJlY3Rvcmllc0ZvclNlYXJjaGVyLmdldChzZWFyY2hlcilcbiAgICAgIGlmICghZGlyZWN0b3JpZXMpIHtcbiAgICAgICAgZGlyZWN0b3JpZXMgPSBbXVxuICAgICAgICBkaXJlY3Rvcmllc0ZvclNlYXJjaGVyLnNldChzZWFyY2hlciwgZGlyZWN0b3JpZXMpXG4gICAgICB9XG4gICAgICBkaXJlY3Rvcmllcy5wdXNoKGRpcmVjdG9yeSlcbiAgICB9XG5cbiAgICAvLyBEZWZpbmUgdGhlIG9uUGF0aHNTZWFyY2hlZCBjYWxsYmFjay5cbiAgICBsZXQgb25QYXRoc1NlYXJjaGVkXG4gICAgaWYgKF8uaXNGdW5jdGlvbihvcHRpb25zLm9uUGF0aHNTZWFyY2hlZCkpIHtcbiAgICAgIC8vIE1haW50YWluIGEgbWFwIG9mIGRpcmVjdG9yaWVzIHRvIHRoZSBudW1iZXIgb2Ygc2VhcmNoIHJlc3VsdHMuIFdoZW4gbm90aWZpZWQgb2YgYSBuZXcgY291bnQsXG4gICAgICAvLyByZXBsYWNlIHRoZSBlbnRyeSBpbiB0aGUgbWFwIGFuZCB1cGRhdGUgdGhlIHRvdGFsLlxuICAgICAgY29uc3Qgb25QYXRoc1NlYXJjaGVkT3B0aW9uID0gb3B0aW9ucy5vblBhdGhzU2VhcmNoZWRcbiAgICAgIGxldCB0b3RhbE51bWJlck9mUGF0aHNTZWFyY2hlZCA9IDBcbiAgICAgIGNvbnN0IG51bWJlck9mUGF0aHNTZWFyY2hlZEZvclNlYXJjaGVyID0gbmV3IE1hcCgpXG4gICAgICBvblBhdGhzU2VhcmNoZWQgPSBmdW5jdGlvbiAoc2VhcmNoZXIsIG51bWJlck9mUGF0aHNTZWFyY2hlZCkge1xuICAgICAgICBjb25zdCBvbGRWYWx1ZSA9IG51bWJlck9mUGF0aHNTZWFyY2hlZEZvclNlYXJjaGVyLmdldChzZWFyY2hlcilcbiAgICAgICAgaWYgKG9sZFZhbHVlKSB7XG4gICAgICAgICAgdG90YWxOdW1iZXJPZlBhdGhzU2VhcmNoZWQgLT0gb2xkVmFsdWVcbiAgICAgICAgfVxuICAgICAgICBudW1iZXJPZlBhdGhzU2VhcmNoZWRGb3JTZWFyY2hlci5zZXQoc2VhcmNoZXIsIG51bWJlck9mUGF0aHNTZWFyY2hlZClcbiAgICAgICAgdG90YWxOdW1iZXJPZlBhdGhzU2VhcmNoZWQgKz0gbnVtYmVyT2ZQYXRoc1NlYXJjaGVkXG4gICAgICAgIHJldHVybiBvblBhdGhzU2VhcmNoZWRPcHRpb24odG90YWxOdW1iZXJPZlBhdGhzU2VhcmNoZWQpXG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIG9uUGF0aHNTZWFyY2hlZCA9IGZ1bmN0aW9uICgpIHt9XG4gICAgfVxuXG4gICAgLy8gS2ljayBvZmYgYWxsIG9mIHRoZSBzZWFyY2hlcyBhbmQgdW5pZnkgdGhlbSBpbnRvIG9uZSBQcm9taXNlLlxuICAgIGNvbnN0IGFsbFNlYXJjaGVzID0gW11cbiAgICBkaXJlY3Rvcmllc0ZvclNlYXJjaGVyLmZvckVhY2goKGRpcmVjdG9yaWVzLCBzZWFyY2hlcikgPT4ge1xuICAgICAgY29uc3Qgc2VhcmNoT3B0aW9ucyA9IHtcbiAgICAgICAgaW5jbHVzaW9uczogb3B0aW9ucy5wYXRocyB8fCBbXSxcbiAgICAgICAgaW5jbHVkZUhpZGRlbjogdHJ1ZSxcbiAgICAgICAgZXhjbHVkZVZjc0lnbm9yZXM6IHRoaXMuY29uZmlnLmdldCgnY29yZS5leGNsdWRlVmNzSWdub3JlZFBhdGhzJyksXG4gICAgICAgIGV4Y2x1c2lvbnM6IHRoaXMuY29uZmlnLmdldCgnY29yZS5pZ25vcmVkTmFtZXMnKSxcbiAgICAgICAgZm9sbG93OiB0aGlzLmNvbmZpZy5nZXQoJ2NvcmUuZm9sbG93U3ltbGlua3MnKSxcbiAgICAgICAgbGVhZGluZ0NvbnRleHRMaW5lQ291bnQ6IG9wdGlvbnMubGVhZGluZ0NvbnRleHRMaW5lQ291bnQgfHwgMCxcbiAgICAgICAgdHJhaWxpbmdDb250ZXh0TGluZUNvdW50OiBvcHRpb25zLnRyYWlsaW5nQ29udGV4dExpbmVDb3VudCB8fCAwLFxuICAgICAgICBkaWRNYXRjaDogcmVzdWx0ID0+IHtcbiAgICAgICAgICBpZiAoIXRoaXMucHJvamVjdC5pc1BhdGhNb2RpZmllZChyZXN1bHQuZmlsZVBhdGgpKSB7XG4gICAgICAgICAgICByZXR1cm4gaXRlcmF0b3IocmVzdWx0KVxuICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgZGlkRXJyb3IgKGVycm9yKSB7XG4gICAgICAgICAgcmV0dXJuIGl0ZXJhdG9yKG51bGwsIGVycm9yKVxuICAgICAgICB9LFxuICAgICAgICBkaWRTZWFyY2hQYXRocyAoY291bnQpIHtcbiAgICAgICAgICByZXR1cm4gb25QYXRoc1NlYXJjaGVkKHNlYXJjaGVyLCBjb3VudClcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgY29uc3QgZGlyZWN0b3J5U2VhcmNoZXIgPSBzZWFyY2hlci5zZWFyY2goZGlyZWN0b3JpZXMsIHJlZ2V4LCBzZWFyY2hPcHRpb25zKVxuICAgICAgYWxsU2VhcmNoZXMucHVzaChkaXJlY3RvcnlTZWFyY2hlcilcbiAgICB9KVxuICAgIGNvbnN0IHNlYXJjaFByb21pc2UgPSBQcm9taXNlLmFsbChhbGxTZWFyY2hlcylcblxuICAgIGZvciAobGV0IGJ1ZmZlciBvZiB0aGlzLnByb2plY3QuZ2V0QnVmZmVycygpKSB7XG4gICAgICBpZiAoYnVmZmVyLmlzTW9kaWZpZWQoKSkge1xuICAgICAgICBjb25zdCBmaWxlUGF0aCA9IGJ1ZmZlci5nZXRQYXRoKClcbiAgICAgICAgaWYgKCF0aGlzLnByb2plY3QuY29udGFpbnMoZmlsZVBhdGgpKSB7XG4gICAgICAgICAgY29udGludWVcbiAgICAgICAgfVxuICAgICAgICB2YXIgbWF0Y2hlcyA9IFtdXG4gICAgICAgIGJ1ZmZlci5zY2FuKHJlZ2V4LCBtYXRjaCA9PiBtYXRjaGVzLnB1c2gobWF0Y2gpKVxuICAgICAgICBpZiAobWF0Y2hlcy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgaXRlcmF0b3Ioe2ZpbGVQYXRoLCBtYXRjaGVzfSlcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIC8vIE1ha2Ugc3VyZSB0aGUgUHJvbWlzZSB0aGF0IGlzIHJldHVybmVkIHRvIHRoZSBjbGllbnQgaXMgY2FuY2VsYWJsZS4gVG8gYmUgY29uc2lzdGVudFxuICAgIC8vIHdpdGggdGhlIGV4aXN0aW5nIGJlaGF2aW9yLCBpbnN0ZWFkIG9mIGNhbmNlbCgpIHJlamVjdGluZyB0aGUgcHJvbWlzZSwgaXQgc2hvdWxkXG4gICAgLy8gcmVzb2x2ZSBpdCB3aXRoIHRoZSBzcGVjaWFsIHZhbHVlICdjYW5jZWxsZWQnLiBBdCBsZWFzdCB0aGUgYnVpbHQtaW4gZmluZC1hbmQtcmVwbGFjZVxuICAgIC8vIHBhY2thZ2UgcmVsaWVzIG9uIHRoaXMgYmVoYXZpb3IuXG4gICAgbGV0IGlzQ2FuY2VsbGVkID0gZmFsc2VcbiAgICBjb25zdCBjYW5jZWxsYWJsZVByb21pc2UgPSBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICBjb25zdCBvblN1Y2Nlc3MgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGlmIChpc0NhbmNlbGxlZCkge1xuICAgICAgICAgIHJlc29sdmUoJ2NhbmNlbGxlZCcpXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmVzb2x2ZShudWxsKVxuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IG9uRmFpbHVyZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgZm9yIChsZXQgcHJvbWlzZSBvZiBhbGxTZWFyY2hlcykgeyBwcm9taXNlLmNhbmNlbCgpIH1cbiAgICAgICAgcmVqZWN0KClcbiAgICAgIH1cblxuICAgICAgc2VhcmNoUHJvbWlzZS50aGVuKG9uU3VjY2Vzcywgb25GYWlsdXJlKVxuICAgIH0pXG4gICAgY2FuY2VsbGFibGVQcm9taXNlLmNhbmNlbCA9ICgpID0+IHtcbiAgICAgIGlzQ2FuY2VsbGVkID0gdHJ1ZVxuICAgICAgLy8gTm90ZSB0aGF0IGNhbmNlbGxpbmcgYWxsIG9mIHRoZSBtZW1iZXJzIG9mIGFsbFNlYXJjaGVzIHdpbGwgY2F1c2UgYWxsIG9mIHRoZSBzZWFyY2hlc1xuICAgICAgLy8gdG8gcmVzb2x2ZSwgd2hpY2ggY2F1c2VzIHNlYXJjaFByb21pc2UgdG8gcmVzb2x2ZSwgd2hpY2ggaXMgdWx0aW1hdGVseSB3aGF0IGNhdXNlc1xuICAgICAgLy8gY2FuY2VsbGFibGVQcm9taXNlIHRvIHJlc29sdmUuXG4gICAgICBhbGxTZWFyY2hlcy5tYXAoKHByb21pc2UpID0+IHByb21pc2UuY2FuY2VsKCkpXG4gICAgfVxuXG4gICAgLy8gQWx0aG91Z2ggdGhpcyBtZXRob2QgY2xhaW1zIHRvIHJldHVybiBhIGBQcm9taXNlYCwgdGhlIGBSZXN1bHRzUGFuZVZpZXcub25TZWFyY2goKWBcbiAgICAvLyBtZXRob2QgaW4gdGhlIGZpbmQtYW5kLXJlcGxhY2UgcGFja2FnZSBleHBlY3RzIHRoZSBvYmplY3QgcmV0dXJuZWQgYnkgdGhpcyBtZXRob2QgdG8gaGF2ZSBhXG4gICAgLy8gYGRvbmUoKWAgbWV0aG9kLiBJbmNsdWRlIGEgZG9uZSgpIG1ldGhvZCB1bnRpbCBmaW5kLWFuZC1yZXBsYWNlIGNhbiBiZSB1cGRhdGVkLlxuICAgIGNhbmNlbGxhYmxlUHJvbWlzZS5kb25lID0gb25TdWNjZXNzT3JGYWlsdXJlID0+IHtcbiAgICAgIGNhbmNlbGxhYmxlUHJvbWlzZS50aGVuKG9uU3VjY2Vzc09yRmFpbHVyZSwgb25TdWNjZXNzT3JGYWlsdXJlKVxuICAgIH1cbiAgICByZXR1cm4gY2FuY2VsbGFibGVQcm9taXNlXG4gIH1cblxuICAvLyBQdWJsaWM6IFBlcmZvcm1zIGEgcmVwbGFjZSBhY3Jvc3MgYWxsIHRoZSBzcGVjaWZpZWQgZmlsZXMgaW4gdGhlIHByb2plY3QuXG4gIC8vXG4gIC8vICogYHJlZ2V4YCBBIHtSZWdFeHB9IHRvIHNlYXJjaCB3aXRoLlxuICAvLyAqIGByZXBsYWNlbWVudFRleHRgIHtTdHJpbmd9IHRvIHJlcGxhY2UgYWxsIG1hdGNoZXMgb2YgcmVnZXggd2l0aC5cbiAgLy8gKiBgZmlsZVBhdGhzYCBBbiB7QXJyYXl9IG9mIGZpbGUgcGF0aCBzdHJpbmdzIHRvIHJ1biB0aGUgcmVwbGFjZSBvbi5cbiAgLy8gKiBgaXRlcmF0b3JgIEEge0Z1bmN0aW9ufSBjYWxsYmFjayBvbiBlYWNoIGZpbGUgd2l0aCByZXBsYWNlbWVudHM6XG4gIC8vICAgKiBgb3B0aW9uc2Age09iamVjdH0gd2l0aCBrZXlzIGBmaWxlUGF0aGAgYW5kIGByZXBsYWNlbWVudHNgLlxuICAvL1xuICAvLyBSZXR1cm5zIGEge1Byb21pc2V9LlxuICByZXBsYWNlIChyZWdleCwgcmVwbGFjZW1lbnRUZXh0LCBmaWxlUGF0aHMsIGl0ZXJhdG9yKSB7XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgIGxldCBidWZmZXJcbiAgICAgIGNvbnN0IG9wZW5QYXRocyA9IHRoaXMucHJvamVjdC5nZXRCdWZmZXJzKCkubWFwKGJ1ZmZlciA9PiBidWZmZXIuZ2V0UGF0aCgpKVxuICAgICAgY29uc3Qgb3V0T2ZQcm9jZXNzUGF0aHMgPSBfLmRpZmZlcmVuY2UoZmlsZVBhdGhzLCBvcGVuUGF0aHMpXG5cbiAgICAgIGxldCBpblByb2Nlc3NGaW5pc2hlZCA9ICFvcGVuUGF0aHMubGVuZ3RoXG4gICAgICBsZXQgb3V0T2ZQcm9jZXNzRmluaXNoZWQgPSAhb3V0T2ZQcm9jZXNzUGF0aHMubGVuZ3RoXG4gICAgICBjb25zdCBjaGVja0ZpbmlzaGVkID0gKCkgPT4ge1xuICAgICAgICBpZiAob3V0T2ZQcm9jZXNzRmluaXNoZWQgJiYgaW5Qcm9jZXNzRmluaXNoZWQpIHtcbiAgICAgICAgICByZXNvbHZlKClcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBpZiAoIW91dE9mUHJvY2Vzc0ZpbmlzaGVkLmxlbmd0aCkge1xuICAgICAgICBsZXQgZmxhZ3MgPSAnZydcbiAgICAgICAgaWYgKHJlZ2V4Lm11bHRpbGluZSkgeyBmbGFncyArPSAnbScgfVxuICAgICAgICBpZiAocmVnZXguaWdub3JlQ2FzZSkgeyBmbGFncyArPSAnaScgfVxuXG4gICAgICAgIGNvbnN0IHRhc2sgPSBUYXNrLm9uY2UoXG4gICAgICAgICAgcmVxdWlyZS5yZXNvbHZlKCcuL3JlcGxhY2UtaGFuZGxlcicpLFxuICAgICAgICAgIG91dE9mUHJvY2Vzc1BhdGhzLFxuICAgICAgICAgIHJlZ2V4LnNvdXJjZSxcbiAgICAgICAgICBmbGFncyxcbiAgICAgICAgICByZXBsYWNlbWVudFRleHQsXG4gICAgICAgICAgKCkgPT4ge1xuICAgICAgICAgICAgb3V0T2ZQcm9jZXNzRmluaXNoZWQgPSB0cnVlXG4gICAgICAgICAgICBjaGVja0ZpbmlzaGVkKClcbiAgICAgICAgICB9XG4gICAgICAgIClcblxuICAgICAgICB0YXNrLm9uKCdyZXBsYWNlOnBhdGgtcmVwbGFjZWQnLCBpdGVyYXRvcilcbiAgICAgICAgdGFzay5vbigncmVwbGFjZTpmaWxlLWVycm9yJywgZXJyb3IgPT4geyBpdGVyYXRvcihudWxsLCBlcnJvcikgfSlcbiAgICAgIH1cblxuICAgICAgZm9yIChidWZmZXIgb2YgdGhpcy5wcm9qZWN0LmdldEJ1ZmZlcnMoKSkge1xuICAgICAgICBpZiAoIWZpbGVQYXRocy5pbmNsdWRlcyhidWZmZXIuZ2V0UGF0aCgpKSkgeyBjb250aW51ZSB9XG4gICAgICAgIGNvbnN0IHJlcGxhY2VtZW50cyA9IGJ1ZmZlci5yZXBsYWNlKHJlZ2V4LCByZXBsYWNlbWVudFRleHQsIGl0ZXJhdG9yKVxuICAgICAgICBpZiAocmVwbGFjZW1lbnRzKSB7XG4gICAgICAgICAgaXRlcmF0b3Ioe2ZpbGVQYXRoOiBidWZmZXIuZ2V0UGF0aCgpLCByZXBsYWNlbWVudHN9KVxuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGluUHJvY2Vzc0ZpbmlzaGVkID0gdHJ1ZVxuICAgICAgY2hlY2tGaW5pc2hlZCgpXG4gICAgfSlcbiAgfVxuXG4gIGNoZWNrb3V0SGVhZFJldmlzaW9uIChlZGl0b3IpIHtcbiAgICBpZiAoZWRpdG9yLmdldFBhdGgoKSkge1xuICAgICAgY29uc3QgY2hlY2tvdXRIZWFkID0gKCkgPT4ge1xuICAgICAgICByZXR1cm4gdGhpcy5wcm9qZWN0LnJlcG9zaXRvcnlGb3JEaXJlY3RvcnkobmV3IERpcmVjdG9yeShlZGl0b3IuZ2V0RGlyZWN0b3J5UGF0aCgpKSlcbiAgICAgICAgICAudGhlbihyZXBvc2l0b3J5ID0+IHJlcG9zaXRvcnkgJiYgcmVwb3NpdG9yeS5jaGVja291dEhlYWRGb3JFZGl0b3IoZWRpdG9yKSlcbiAgICAgIH1cblxuICAgICAgaWYgKHRoaXMuY29uZmlnLmdldCgnZWRpdG9yLmNvbmZpcm1DaGVja291dEhlYWRSZXZpc2lvbicpKSB7XG4gICAgICAgIHRoaXMuYXBwbGljYXRpb25EZWxlZ2F0ZS5jb25maXJtKHtcbiAgICAgICAgICBtZXNzYWdlOiAnQ29uZmlybSBDaGVja291dCBIRUFEIFJldmlzaW9uJyxcbiAgICAgICAgICBkZXRhaWxlZE1lc3NhZ2U6IGBBcmUgeW91IHN1cmUgeW91IHdhbnQgdG8gZGlzY2FyZCBhbGwgY2hhbmdlcyB0byBcIiR7ZWRpdG9yLmdldEZpbGVOYW1lKCl9XCIgc2luY2UgdGhlIGxhc3QgR2l0IGNvbW1pdD9gLFxuICAgICAgICAgIGJ1dHRvbnM6IHtcbiAgICAgICAgICAgIE9LOiBjaGVja291dEhlYWQsXG4gICAgICAgICAgICBDYW5jZWw6IG51bGxcbiAgICAgICAgICB9XG4gICAgICAgIH0pXG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gY2hlY2tvdXRIZWFkKClcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZShmYWxzZSlcbiAgICB9XG4gIH1cbn1cbiJdfQ==