(function() {
  var $, BrowserPlusView, CompositeDisposable, View, fs, jQ, path, ref,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  CompositeDisposable = require('atom').CompositeDisposable;

  ref = require('atom-space-pen-views'), View = ref.View, $ = ref.$;

  $ = jQ = require('jquery');

  require('jquery-ui/autocomplete');

  path = require('path');

  require('JSON2');

  fs = require('fs');

  require('jstorage');

  window.bp = {};

  window.bp.js = $.extend({}, window.$.jStorage);

  RegExp.escape = function(s) {
    return s.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
  };

  module.exports = BrowserPlusView = (function(superClass) {
    extend(BrowserPlusView, superClass);

    function BrowserPlusView(model) {
      this.model = model;
      this.subscriptions = new CompositeDisposable;
      this.model.view = this;
      this.model.onDidDestroy((function(_this) {
        return function() {
          var base1;
          _this.subscriptions.dispose();
          return typeof (base1 = jQ(_this.url)).autocomplete === "function" ? base1.autocomplete('destroy') : void 0;
        };
      })(this));
      atom.notifications.onDidAddNotification(function(notification) {
        if (notification.type === 'info') {
          return setTimeout(function() {
            return notification.dismiss();
          }, 1000);
        }
      });
      BrowserPlusView.__super__.constructor.apply(this, arguments);
    }

    BrowserPlusView.content = function(params) {
      var hideURLBar, ref1, ref2, ref3, ref4, ref5, spinnerClass, url;
      url = params.url;
      spinnerClass = "fa fa-spinner";
      hideURLBar = '';
      if ((ref1 = params.opt) != null ? ref1.hideURLBar : void 0) {
        hideURLBar = 'hideURLBar';
      }
      if ((ref2 = params.opt) != null ? ref2.src : void 0) {
        params.src = BrowserPlusView.checkBase(params.opt.src, params.url);
        params.src = params.src.replace(/"/g, "'");
        if (!((ref3 = params.src) != null ? ref3.startsWith("data:text/html,") : void 0)) {
          params.src = "data:text/html," + params.src;
        }
        if (!url) {
          url = params.src;
        }
      }
      if ((ref4 = params.url) != null ? ref4.startsWith("browser-plus://") : void 0) {
        url = (ref5 = params.browserPlus) != null ? typeof ref5.getBrowserPlusUrl === "function" ? ref5.getBrowserPlusUrl(url) : void 0 : void 0;
        spinnerClass += " fa-custom";
      }
      return this.div({
        "class": 'browser-plus'
      }, (function(_this) {
        return function() {
          _this.div({
            "class": "url native-key-bindings " + hideURLBar,
            outlet: 'urlbar'
          }, function() {
            _this.div({
              "class": 'nav-btns-left'
            }, function() {
              _this.span({
                id: 'back',
                "class": 'mega-octicon octicon-arrow-left',
                outlet: 'back'
              });
              _this.span({
                id: 'forward',
                "class": 'mega-octicon octicon-arrow-right',
                outlet: 'forward'
              });
              _this.span({
                id: 'refresh',
                "class": 'mega-octicon octicon-sync',
                outlet: 'refresh'
              });
              _this.span({
                id: 'history',
                "class": 'mega-octicon octicon-book',
                outlet: 'history'
              });
              _this.span({
                id: 'fav',
                "class": 'mega-octicon octicon-star',
                outlet: 'fav'
              });
              _this.span({
                id: 'favList',
                "class": 'octicon octicon-arrow-down',
                outlet: 'favList'
              });
              return _this.a({
                "class": spinnerClass,
                outlet: 'spinner'
              });
            });
            _this.div({
              "class": 'nav-btns'
            }, function() {
              _this.div({
                "class": 'nav-btns-right'
              }, function() {
                _this.span({
                  id: 'newTab',
                  "class": 'octicon',
                  outlet: 'newTab'
                }, "\u2795");
                _this.span({
                  id: 'print',
                  "class": 'icon-browser-pluss icon-print',
                  outlet: 'print'
                });
                _this.span({
                  id: 'remember',
                  "class": 'mega-octicon octicon-pin',
                  outlet: 'remember'
                });
                _this.span({
                  id: 'live',
                  "class": 'mega-octicon octicon-zap',
                  outlet: 'live'
                });
                return _this.span({
                  id: 'devtool',
                  "class": 'mega-octicon octicon-tools',
                  outlet: 'devtool'
                });
              });
              return _this.div({
                "class": 'input-url'
              }, function() {
                return _this.input({
                  "class": "native-key-bindings",
                  type: 'text',
                  id: 'url',
                  outlet: 'url',
                  value: "" + params.url
                });
              });
            });
            return _this.input({
              id: 'find',
              "class": 'find find-hide',
              outlet: 'find'
            });
          });
          return _this.tag('webview', {
            "class": "native-key-bindings",
            outlet: 'htmlv',
            preload: "file:///" + params.browserPlus.resources + "/bp-client.js",
            plugins: 'on',
            src: "" + url,
            disablewebsecurity: 'on',
            allowfileaccessfromfiles: 'on',
            allowPointerLock: 'on'
          });
        };
      })(this));
    };

    BrowserPlusView.prototype.toggleURLBar = function() {
      return this.urlbar.toggle();
    };

    BrowserPlusView.prototype.initialize = function() {
      var base1, ref1, ref2, ref3, ref4, ref5, ref6, ref7, ref8, ref9, select, src;
      src = (function(_this) {
        return function(req, res) {
          var _, fav, pattern, searchUrl, urls;
          _ = require('lodash');
          pattern = RegExp("" + (RegExp.escape(req.term)), "i");
          fav = _.filter(window.bp.js.get('bp.fav'), function(fav) {
            return fav.url.match(pattern) || fav.title.match(pattern);
          });
          urls = _.pluck(fav, "url");
          res(urls);
          searchUrl = 'http://api.bing.com/osjson.aspx';
          return (function() {
            return jQ.ajax({
              url: searchUrl,
              dataType: 'json',
              data: {
                query: req.term,
                'web.count': 10
              },
              success: (function(_this) {
                return function(data) {
                  var dat, i, len, ref1, search;
                  urls = urls.slice(0, 11);
                  search = "http://www.google.com/search?as_q=";
                  ref1 = data[1].slice(0, 11);
                  for (i = 0, len = ref1.length; i < len; i++) {
                    dat = ref1[i];
                    urls.push({
                      label: dat,
                      value: search + dat
                    });
                  }
                  return res(urls);
                };
              })(this)
            });
          })();
        };
      })(this);
      select = (function(_this) {
        return function(event, ui) {
          return _this.goToUrl(ui.item.value);
        };
      })(this);
      if (typeof (base1 = jQ(this.url)).autocomplete === "function") {
        base1.autocomplete({
          source: src,
          minLength: 2,
          select: select
        });
      }
      this.subscriptions.add(atom.tooltips.add(this.back, {
        title: 'Back'
      }));
      this.subscriptions.add(atom.tooltips.add(this.forward, {
        title: 'Forward'
      }));
      this.subscriptions.add(atom.tooltips.add(this.refresh, {
        title: 'Refresh-f5/ctrl-f5'
      }));
      this.subscriptions.add(atom.tooltips.add(this.print, {
        title: 'Print'
      }));
      this.subscriptions.add(atom.tooltips.add(this.history, {
        title: 'History'
      }));
      this.subscriptions.add(atom.tooltips.add(this.favList, {
        title: 'View Favorites'
      }));
      this.subscriptions.add(atom.tooltips.add(this.fav, {
        title: 'Favoritize'
      }));
      this.subscriptions.add(atom.tooltips.add(this.live, {
        title: 'Live'
      }));
      this.subscriptions.add(atom.tooltips.add(this.remember, {
        title: 'Remember Position'
      }));
      this.subscriptions.add(atom.tooltips.add(this.newTab, {
        title: 'New Tab'
      }));
      this.subscriptions.add(atom.tooltips.add(this.devtool, {
        title: 'Dev Tools-f12'
      }));
      this.subscriptions.add(atom.commands.add('.browser-plus webview', {
        'browser-plus-view:goBack': (function(_this) {
          return function() {
            return _this.goBack();
          };
        })(this)
      }));
      this.subscriptions.add(atom.commands.add('.browser-plus webview', {
        'browser-plus-view:goForward': (function(_this) {
          return function() {
            return _this.goForward();
          };
        })(this)
      }));
      this.subscriptions.add(atom.commands.add('.browser-plus', {
        'browser-plus-view:toggleURLBar': (function(_this) {
          return function() {
            return _this.toggleURLBar();
          };
        })(this)
      }));
      this.liveOn = false;
      this.element.onkeydown = (function(_this) {
        return function() {
          return _this.keyHandler(arguments);
        };
      })(this);
      if (this.model.url.indexOf('file:///') >= 0) {
        this.checkFav();
      }
      if ((ref1 = this.htmlv[0]) != null) {
        ref1.addEventListener("permissionrequest", function(e) {
          return e.request.allow();
        });
      }
      if ((ref2 = this.htmlv[0]) != null) {
        ref2.addEventListener("console-message", (function(_this) {
          return function(e) {
            var base2, base3, base4, base5, base6, css, csss, data, i, indx, init, inits, j, js, jss, k, l, left, len, len1, len2, len3, menu, menus, ref10, ref11, ref12, ref13, ref14, ref15, ref16, ref17, ref18, ref19, ref3, ref4, ref5, ref6, ref7, ref8, ref9, top;
            if (e.message.includes('~browser-plus-position~') && _this.rememberOn) {
              data = e.message.replace('~browser-plus-position~', '');
              indx = data.indexOf(',');
              top = data.substr(0, indx);
              left = data.substr(indx + 1);
              _this.curPos = {
                "top": top,
                "left": left
              };
              _this.href = _this.url.val();
            }
            if (e.message.includes('~browser-plus-jquery~') || e.message.includes('~browser-plus-menu~')) {
              if (e.message.includes('~browser-plus-jquery~')) {
                if ((base2 = _this.model.browserPlus).jQueryJS == null) {
                  base2.jQueryJS = BrowserPlusView.getJQuery.call(_this);
                }
                if ((ref3 = _this.htmlv[0]) != null) {
                  ref3.executeJavaScript(_this.model.browserPlus.jQueryJS);
                }
              }
              if (_this.rememberOn) {
                if (_this.model.hashurl) {
                  _this.model.url = _this.model.hashurl;
                  _this.model.hashurl = void 0;
                  _this.url.val(_this.model.url);
                  if ((ref4 = _this.htmlv[0]) != null) {
                    ref4.executeJavaScript("location.href = '" + _this.model.url + "'");
                  }
                }
                if (_this.rememberOn && _this.model.url === _this.href) {
                  if ((ref5 = _this.htmlv[0]) != null) {
                    ref5.executeJavaScript("jQuery(window).scrollTop(" + _this.curPos.top + ");\njQuery(window).scrollLeft(" + _this.curPos.left + ");");
                  }
                }
              }
              if ((base3 = _this.model.browserPlus).jStorageJS == null) {
                base3.jStorageJS = BrowserPlusView.getJStorage.call(_this);
              }
              if ((ref6 = _this.htmlv[0]) != null) {
                ref6.executeJavaScript(_this.model.browserPlus.jStorageJS);
              }
              if ((base4 = _this.model.browserPlus).watchjs == null) {
                base4.watchjs = BrowserPlusView.getWatchjs.call(_this);
              }
              if ((ref7 = _this.htmlv[0]) != null) {
                ref7.executeJavaScript(_this.model.browserPlus.watchjs);
              }
              if ((base5 = _this.model.browserPlus).hotKeys == null) {
                base5.hotKeys = BrowserPlusView.getHotKeys.call(_this);
              }
              if ((ref8 = _this.htmlv[0]) != null) {
                ref8.executeJavaScript(_this.model.browserPlus.hotKeys);
              }
              if ((base6 = _this.model.browserPlus).notifyBar == null) {
                base6.notifyBar = BrowserPlusView.getNotifyBar.call(_this);
              }
              if ((ref9 = _this.htmlv[0]) != null) {
                ref9.executeJavaScript(_this.model.browserPlus.notifyBar);
              }
              if (inits = (ref10 = _this.model.browserPlus.plugins) != null ? ref10.onInit : void 0) {
                for (i = 0, len = inits.length; i < len; i++) {
                  init = inits[i];
                  if ((ref11 = _this.htmlv[0]) != null) {
                    ref11.executeJavaScript(init);
                  }
                }
              }
              if (jss = (ref12 = _this.model.browserPlus.plugins) != null ? ref12.jss : void 0) {
                for (j = 0, len1 = jss.length; j < len1; j++) {
                  js = jss[j];
                  if ((ref13 = _this.htmlv[0]) != null) {
                    ref13.executeJavaScript(BrowserPlusView.loadJS.call(_this, js, true));
                  }
                }
              }
              if (csss = (ref14 = _this.model.browserPlus.plugins) != null ? ref14.csss : void 0) {
                for (k = 0, len2 = csss.length; k < len2; k++) {
                  css = csss[k];
                  if ((ref15 = _this.htmlv[0]) != null) {
                    ref15.executeJavaScript(BrowserPlusView.loadCSS.call(_this, css, true));
                  }
                }
              }
              if (menus = (ref16 = _this.model.browserPlus.plugins) != null ? ref16.menus : void 0) {
                for (l = 0, len3 = menus.length; l < len3; l++) {
                  menu = menus[l];
                  if (menu.fn) {
                    menu.fn = menu.fn.toString();
                  }
                  if (menu.selectorFilter) {
                    menu.selectorFilter = menu.selectorFilter.toString();
                  }
                  if ((ref17 = _this.htmlv[0]) != null) {
                    ref17.executeJavaScript("browserPlus.menu(" + (JSON.stringify(menu)) + ")");
                  }
                }
              }
              if ((ref18 = _this.htmlv[0]) != null) {
                ref18.executeJavaScript(BrowserPlusView.loadCSS.call(_this, 'bp-style.css'));
              }
              return (ref19 = _this.htmlv[0]) != null ? ref19.executeJavaScript(BrowserPlusView.loadCSS.call(_this, 'jquery.notifyBar.css')) : void 0;
            }
          };
        })(this));
      }
      if ((ref3 = this.htmlv[0]) != null) {
        ref3.addEventListener("page-favicon-updated", (function(_this) {
          return function(e) {
            var _, fav, favIcon, favr, style, uri;
            _ = require('lodash');
            favr = window.bp.js.get('bp.fav');
            if (fav = _.find(favr, {
              'url': _this.model.url
            })) {
              fav.favIcon = e.favicons[0];
              window.bp.js.set('bp.fav', favr);
            }
            _this.model.iconName = Math.floor(Math.random() * 10000).toString();
            _this.model.favIcon = e.favicons[0];
            _this.model.updateIcon(e.favicons[0]);
            favIcon = window.bp.js.get('bp.favIcon');
            uri = _this.htmlv[0].getURL();
            if (!uri) {
              return;
            }
            favIcon[uri] = e.favicons[0];
            window.bp.js.set('bp.favIcon', favIcon);
            _this.model.updateIcon();
            style = document.createElement('style');
            style.type = 'text/css';
            style.innerHTML = ".title.icon.icon-" + _this.model.iconName + " {\n  background-size: 16px 16px;\n  background-repeat: no-repeat;\n  padding-left: 20px;\n  background-image: url('" + e.favicons[0] + "');\n  background-position-y: 50%;\n}";
            return document.getElementsByTagName('head')[0].appendChild(style);
          };
        })(this));
      }
      if ((ref4 = this.htmlv[0]) != null) {
        ref4.addEventListener("did-navigate-in-page", (function(_this) {
          return function(evt) {
            return _this.updatePageUrl(evt);
          };
        })(this));
      }
      if ((ref5 = this.htmlv[0]) != null) {
        ref5.addEventListener("did-navigate", (function(_this) {
          return function(evt) {
            return _this.updatePageUrl(evt);
          };
        })(this));
      }
      if ((ref6 = this.htmlv[0]) != null) {
        ref6.addEventListener("page-title-set", (function(_this) {
          return function(e) {
            var _, fav, favr, title, uri;
            _ = require('lodash');
            favr = window.bp.js.get('bp.fav');
            title = window.bp.js.get('bp.title');
            uri = _this.htmlv[0].getURL();
            if (!uri) {
              return;
            }
            title[uri] = e.title;
            window.bp.js.set('bp.title', title);
            if (fav = _.find(favr, {
              'url': _this.model.url
            })) {
              fav.title = e.title;
              window.bp.js.set('bp.fav', favr);
            }
            return _this.model.setTitle(e.title);
          };
        })(this));
      }
      this.devtool.on('click', (function(_this) {
        return function(evt) {
          return _this.toggleDevTool();
        };
      })(this));
      this.spinner.on('click', (function(_this) {
        return function(evt) {
          var ref7;
          return (ref7 = _this.htmlv[0]) != null ? ref7.stop() : void 0;
        };
      })(this));
      this.remember.on('click', (function(_this) {
        return function(evt) {
          _this.rememberOn = !_this.rememberOn;
          return _this.remember.toggleClass('active', _this.rememberOn);
        };
      })(this));
      this.print.on('click', (function(_this) {
        return function(evt) {
          var ref7;
          return (ref7 = _this.htmlv[0]) != null ? ref7.print() : void 0;
        };
      })(this));
      this.newTab.on('click', (function(_this) {
        return function(evt) {
          atom.workspace.open("browser-plus://blank");
          return _this.spinner.removeClass('fa-custom');
        };
      })(this));
      this.history.on('click', (function(_this) {
        return function(evt) {
          return atom.workspace.open("browser-plus://history", {
            split: 'left',
            searchAllPanes: true
          });
        };
      })(this));
      this.live.on('click', (function(_this) {
        return function(evt) {
          _this.liveOn = !_this.liveOn;
          _this.live.toggleClass('active', _this.liveOn);
          if (_this.liveOn) {
            _this.refreshPage();
            _this.liveSubscription = new CompositeDisposable;
            _this.liveSubscription.add(atom.workspace.observeTextEditors(function(editor) {
              return _this.liveSubscription.add(editor.onDidSave(function() {
                var timeout;
                timeout = atom.config.get('browser-plus.live');
                return setTimeout(function() {
                  return _this.refreshPage();
                }, timeout);
              }));
            }));
            return _this.model.onDidDestroy(function() {
              return _this.liveSubscription.dispose();
            });
          } else {
            return _this.liveSubscription.dispose();
          }
        };
      })(this));
      this.fav.on('click', (function(_this) {
        return function(evt) {
          var data, delCount, favs;
          favs = window.bp.js.get('bp.fav');
          if (_this.fav.hasClass('active')) {
            _this.removeFav(_this.model);
          } else {
            if (_this.model.orgURI) {
              return;
            }
            data = {
              url: _this.model.url,
              title: _this.model.title || _this.model.url,
              favIcon: _this.model.favIcon
            };
            favs.push(data);
            delCount = favs.length - atom.config.get('browser-plus.fav');
            if (delCount > 0) {
              favs.splice(0, delCount);
            }
            window.bp.js.set('bp.fav', favs);
          }
          return _this.fav.toggleClass('active');
        };
      })(this));
      if ((ref7 = this.htmlv[0]) != null) {
        ref7.addEventListener('new-window', function(e) {
          return atom.workspace.open(e.url, {
            split: 'left',
            searchAllPanes: true,
            openInSameWindow: false
          });
        });
      }
      if ((ref8 = this.htmlv[0]) != null) {
        ref8.addEventListener("did-start-loading", (function(_this) {
          return function() {
            var ref9;
            _this.spinner.removeClass('fa-custom');
            return (ref9 = _this.htmlv[0]) != null ? ref9.shadowRoot.firstChild.style.height = '95%' : void 0;
          };
        })(this));
      }
      if ((ref9 = this.htmlv[0]) != null) {
        ref9.addEventListener("did-stop-loading", (function(_this) {
          return function() {
            return _this.spinner.addClass('fa-custom');
          };
        })(this));
      }
      this.back.on('click', (function(_this) {
        return function(evt) {
          var ref10, ref11;
          if (((ref10 = _this.htmlv[0]) != null ? ref10.canGoBack() : void 0) && $( this).hasClass('active')) {
            return (ref11 = _this.htmlv[0]) != null ? ref11.goBack() : void 0;
          }
        };
      })(this));
      this.favList.on('click', (function(_this) {
        return function(evt) {
          var favList;
          favList = require('./fav-view');
          return new favList(window.bp.js.get('bp.fav'));
        };
      })(this));
      this.forward.on('click', (function(_this) {
        return function(evt) {
          var ref10, ref11;
          if (((ref10 = _this.htmlv[0]) != null ? ref10.canGoForward() : void 0) && $( this).hasClass('active')) {
            return (ref11 = _this.htmlv[0]) != null ? ref11.goForward() : void 0;
          }
        };
      })(this));
      this.url.on('click', (function(_this) {
        return function(evt) {
          return _this.url.select();
        };
      })(this));
      this.url.on('keypress', (function(_this) {
        return function(evt) {
          var URL, localhostPattern, ref10, url, urls;
          URL = require('url');
          if (evt.which === 13) {
            _this.url.blur();
            urls = URL.parse( this.value);
            url =  this.value;
            if (!url.startsWith('browser-plus://')) {
              if (url.indexOf(' ') >= 0) {
                url = "http://www.google.com/search?as_q=" + url;
              } else {
                localhostPattern = /^(http:\/\/)?localhost/i;
                if (url.search(localhostPattern) < 0 && url.indexOf('.') < 0) {
                  url = "http://www.google.com/search?as_q=" + url;
                } else {
                  if ((ref10 = urls.protocol) === 'http' || ref10 === 'https' || ref10 === 'file:') {
                    if (urls.protocol === 'file:') {
                      url = url.replace(/\\/g, "/");
                    } else {
                      url = URL.format(urls);
                    }
                  } else {
                    urls.protocol = 'http';
                    url = URL.format(urls);
                  }
                }
              }
            }
            return _this.goToUrl(url);
          }
        };
      })(this));
      return this.refresh.on('click', (function(_this) {
        return function(evt) {
          return _this.refreshPage();
        };
      })(this));
    };

    BrowserPlusView.prototype.updatePageUrl = function(evt) {
      var BrowserPlusModel, ref1, ref2, ref3, ref4, title, url;
      BrowserPlusModel = require('./browser-plus-model');
      url = evt.url;
      if (!BrowserPlusModel.checkUrl(url)) {
        url = atom.config.get('browser-plus.homepage') || "http://www.google.com";
        atom.notifications.addSuccess("Redirecting to " + url);
        if ((ref1 = this.htmlv[0]) != null) {
          ref1.executeJavaScript("location.href = '" + url + "'");
        }
        return;
      }
      if (url && url !== this.model.url && !((ref2 = this.url.val()) != null ? ref2.startsWith('browser-plus://') : void 0)) {
        this.url.val(url);
        this.model.url = url;
      }
      title = (ref3 = this.htmlv[0]) != null ? ref3.getTitle() : void 0;
      if (title) {
        if (title !== this.model.getTitle()) {
          this.model.setTitle(title);
        }
      } else {
        this.model.setTitle(url);
      }
      this.live.toggleClass('active', this.liveOn);
      if (!this.liveOn) {
        if ((ref4 = this.liveSubscription) != null) {
          ref4.dispose();
        }
      }
      this.checkNav();
      this.checkFav();
      return this.addHistory();
    };

    BrowserPlusView.prototype.refreshPage = function(url, ignorecache) {
      var pp, ref1, ref2, ref3, ref4, ref5;
      if (this.rememberOn) {
        if ((ref1 = this.htmlv[0]) != null) {
          ref1.executeJavaScript("var left, top;\ncurTop = jQuery(window).scrollTop();\ncurLeft = jQuery(window).scrollLeft();\nconsole.log(`~browser-plus-position~${curTop},${curLeft}`);");
        }
      }
      if (this.model.orgURI && (pp = atom.packages.getActivePackage('pp'))) {
        return pp.mainModule.compilePath(this.model.orgURI, this.model._id);
      } else {
        if (url) {
          this.model.url = url;
          this.url.val(url);
          return (ref2 = this.htmlv[0]) != null ? ref2.src = url : void 0;
        } else {
          if (this.ultraLiveOn && this.model.src) {
            if ((ref3 = this.htmlv[0]) != null) {
              ref3.src = this.model.src;
            }
          }
          if (ignorecache) {
            return (ref4 = this.htmlv[0]) != null ? ref4.reloadIgnoringCache() : void 0;
          } else {
            return (ref5 = this.htmlv[0]) != null ? ref5.reload() : void 0;
          }
        }
      }
    };

    BrowserPlusView.prototype.goToUrl = function(url) {
      var BrowserPlusModel, base1, base2, ref1;
      BrowserPlusModel = require('./browser-plus-model');
      if (!BrowserPlusModel.checkUrl(url)) {
        return;
      }
      if (typeof (base1 = jQ(this.url)).autocomplete === "function") {
        base1.autocomplete("close");
      }
      this.liveOn = false;
      this.live.toggleClass('active', this.liveOn);
      if (!this.liveOn) {
        if ((ref1 = this.liveSubscription) != null) {
          ref1.dispose();
        }
      }
      this.url.val(url);
      this.model.url = url;
      delete this.model.title;
      delete this.model.iconName;
      delete this.model.favIcon;
      this.model.setTitle(null);
      this.model.updateIcon(null);
      if (url.startsWith('browser-plus://')) {
        url = typeof (base2 = this.model.browserPlus).getBrowserPlusUrl === "function" ? base2.getBrowserPlusUrl(url) : void 0;
      }
      return this.htmlv.attr('src', url);
    };

    BrowserPlusView.prototype.keyHandler = function(evt) {
      switch (evt[0].keyIdentifier) {
        case "F12":
          return this.toggleDevTool();
        case "F5":
          if (evt[0].ctrlKey) {
            return this.refreshPage(void 0, true);
          } else {
            return this.refreshPage();
          }
          break;
        case "F10":
          return this.toggleURLBar();
        case "Left":
          if (evt[0].altKey) {
            return this.goBack();
          }
          break;
        case "Right":
          if (evt[0].altKey) {
            return this.goForward();
          }
      }
    };

    BrowserPlusView.prototype.removeFav = function(favorite) {
      var favr, favrs, i, idx, len;
      favrs = window.bp.js.get('bp.fav');
      for (idx = i = 0, len = favrs.length; i < len; idx = ++i) {
        favr = favrs[idx];
        if (favr.url === favorite.url) {
          favrs.splice(idx, 1);
          window.bp.js.set('bp.fav', favrs);
          return;
        }
      }
    };

    BrowserPlusView.prototype.setSrc = function(text) {
      var ref1, url;
      url = this.model.orgURI || this.model.url;
      text = BrowserPlusView.checkBase(text, url);
      this.model.src = "data:text/html," + text;
      return (ref1 = this.htmlv[0]) != null ? ref1.src = this.model.src : void 0;
    };

    BrowserPlusView.checkBase = function(text, url) {
      var $html, base, basePath, cheerio;
      cheerio = require('cheerio');
      $html = cheerio.load(text);
      basePath = path.dirname(url) + "/";
      if ($html('base').length) {
        return text;
      } else {
        if ($html('head').length) {
          base = "<base href='" + basePath + "' target='_blank'>";
          $html('head').prepend(base);
        } else {
          base = "<head><base href='" + basePath + "' target='_blank'>https://cdnjs.cloudflare.com/ajax/libs/mustache.js/2.3.0/mustache.js </head>";
          $html('html').prepend(base);
        }
        return $html.html();
      }
    };

    BrowserPlusView.prototype.checkFav = function() {
      var favr, favrs, i, len, results;
      this.fav.removeClass('active');
      favrs = window.bp.js.get('bp.fav');
      results = [];
      for (i = 0, len = favrs.length; i < len; i++) {
        favr = favrs[i];
        if (favr.url === this.model.url) {
          results.push(this.fav.addClass('active'));
        } else {
          results.push(void 0);
        }
      }
      return results;
    };

    BrowserPlusView.prototype.toggleDevTool = function() {
      var open, ref1, ref2, ref3;
      open = (ref1 = this.htmlv[0]) != null ? ref1.isDevToolsOpened() : void 0;
      if (open) {
        if ((ref2 = this.htmlv[0]) != null) {
          ref2.closeDevTools();
        }
      } else {
        if ((ref3 = this.htmlv[0]) != null) {
          ref3.openDevTools();
        }
      }
      return $(this.devtool).toggleClass('active', !open);
    };

    BrowserPlusView.prototype.checkNav = function() {
      var ref1, ref2, ref3;
      $(this.forward).toggleClass('active', (ref1 = this.htmlv[0]) != null ? ref1.canGoForward() : void 0);
      $(this.back).toggleClass('active', (ref2 = this.htmlv[0]) != null ? ref2.canGoBack() : void 0);
      if ((ref3 = this.htmlv[0]) != null ? ref3.canGoForward() : void 0) {
        if (this.clearForward) {
          $(this.forward).toggleClass('active', false);
          return this.clearForward = false;
        } else {
          return $(this.forward).toggleClass('active', true);
        }
      }
    };

    BrowserPlusView.prototype.goBack = function() {
      return this.back.click();
    };

    BrowserPlusView.prototype.goForward = function() {
      return this.forward.click();
    };

    BrowserPlusView.prototype.addHistory = function() {
      var histToday, history, historyURL, obj, today, todayObj, url, yyyymmdd;
      url = this.htmlv[0].getURL().replace(/\\/g, "/");
      if (!url) {
        return;
      }
      historyURL = ("file:///" + this.model.browserPlus.resources + "history.html").replace(/\\/g, "/");
      if (url.startsWith('browser-plus://') || url.startsWith('data:text/html,') || url.startsWith(historyURL)) {
        return;
      }
      yyyymmdd = function() {
        var date, dd, mm, yyyy;
        date = new Date();
        yyyy = date.getFullYear().toString();
        mm = (date.getMonth() + 1).toString();
        dd = date.getDate().toString();
        return yyyy + (mm[1] ? mm : '0' + mm[0]) + (dd[1] ? dd : '0' + dd[0]);
      };
      today = yyyymmdd();
      history = window.bp.js.get('bp.history') || [];
      todayObj = history.find(function(ele, idx, arr) {
        if (ele[today]) {
          return true;
        }
      });
      if (!todayObj) {
        obj = {};
        histToday = [];
        obj[today] = histToday;
        history.unshift(obj);
      } else {
        histToday = todayObj[today];
      }
      histToday.unshift({
        date: new Date().toString(),
        uri: url
      });
      return window.bp.js.set('bp.history', history);
    };

    BrowserPlusView.prototype.getTitle = function() {
      return this.model.getTitle();
    };

    BrowserPlusView.prototype.serialize = function() {};

    BrowserPlusView.prototype.destroy = function() {
      var base1;
      if (typeof (base1 = jQ(this.url)).autocomplete === "function") {
        base1.autocomplete('destroy');
      }
      return this.subscriptions.dispose();
    };

    BrowserPlusView.getJQuery = function() {
      return fs.readFileSync(this.model.browserPlus.resources + "/jquery-2.1.4.min.js", 'utf-8');
    };

    BrowserPlusView.getEval = function() {
      return fs.readFileSync(this.model.browserPlus.resources + "/eval.js", 'utf-8');
    };

    BrowserPlusView.getJStorage = function() {
      return fs.readFileSync(this.model.browserPlus.resources + "/jstorage.min.js", 'utf-8');
    };

    BrowserPlusView.getWatchjs = function() {
      return fs.readFileSync(this.model.browserPlus.resources + "/watch.js", 'utf-8');
    };

    BrowserPlusView.getNotifyBar = function() {
      return fs.readFileSync(this.model.browserPlus.resources + "/jquery.notifyBar.js", 'utf-8');
    };

    BrowserPlusView.getHotKeys = function() {
      return fs.readFileSync(this.model.browserPlus.resources + "/jquery.hotkeys.min.js", 'utf-8');
    };

    BrowserPlusView.loadCSS = function(filename, fullpath) {
      var fpath;
      if (fullpath == null) {
        fullpath = false;
      }
      if (!fullpath) {
        fpath = "file:///" + (this.model.browserPlus.resources.replace(/\\/g, '/'));
        filename = "" + fpath + filename;
      }
      return "jQuery('head').append(jQuery('<link type=\"text/css\" rel=\"stylesheet\" href=\"" + filename + "\">'))";
    };

    BrowserPlusView.loadJS = function(filename, fullpath) {
      var fpath;
      if (fullpath == null) {
        fullpath = false;
      }
      if (!fullpath) {
        fpath = "file:///" + (this.model.browserPlus.resources.replace(/\\/g, '/'));
        filename = "" + fpath + filename;
      }
      return "jQuery('head').append(jQuery('<script type=\"text/javascript\" src=\"" + filename + "\">'))";
    };

    return BrowserPlusView;

  })(View);

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL2V2YW5oZW5kcml4MS8uYXRvbS9wYWNrYWdlcy9icm93c2VyLXBsdXMvbGliL2Jyb3dzZXItcGx1cy12aWV3LmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUFBLE1BQUEsZ0VBQUE7SUFBQTs7O0VBQUMsc0JBQXdCLE9BQUEsQ0FBUSxNQUFSOztFQUN6QixNQUFXLE9BQUEsQ0FBUSxzQkFBUixDQUFYLEVBQUMsZUFBRCxFQUFNOztFQUNOLENBQUEsR0FBSSxFQUFBLEdBQUssT0FBQSxDQUFRLFFBQVI7O0VBQ1QsT0FBQSxDQUFRLHdCQUFSOztFQUNBLElBQUEsR0FBTyxPQUFBLENBQVEsTUFBUjs7RUFDUCxPQUFBLENBQVEsT0FBUjs7RUFFQSxFQUFBLEdBQUssT0FBQSxDQUFRLElBQVI7O0VBQ0wsT0FBQSxDQUFRLFVBQVI7O0VBQ0EsTUFBTSxDQUFDLEVBQVAsR0FBWTs7RUFDWixNQUFNLENBQUMsRUFBRSxDQUFDLEVBQVYsR0FBZ0IsQ0FBQyxDQUFDLE1BQUYsQ0FBUyxFQUFULEVBQVksTUFBTSxDQUFDLENBQUMsQ0FBQyxRQUFyQjs7RUFFaEIsTUFBTSxDQUFDLE1BQVAsR0FBZSxTQUFDLENBQUQ7V0FDYixDQUFDLENBQUMsT0FBRixDQUFVLHdCQUFWLEVBQW9DLE1BQXBDO0VBRGE7O0VBR2YsTUFBTSxDQUFDLE9BQVAsR0FDTTs7O0lBQ1MseUJBQUMsS0FBRDtNQUFDLElBQUMsQ0FBQSxRQUFEO01BQ1osSUFBQyxDQUFBLGFBQUQsR0FBaUIsSUFBSTtNQUNyQixJQUFDLENBQUEsS0FBSyxDQUFDLElBQVAsR0FBYztNQUNkLElBQUMsQ0FBQSxLQUFLLENBQUMsWUFBUCxDQUFvQixDQUFBLFNBQUEsS0FBQTtlQUFBLFNBQUE7QUFDbEIsY0FBQTtVQUFBLEtBQUMsQ0FBQSxhQUFhLENBQUMsT0FBZixDQUFBO21GQUNRLENBQUMsYUFBYztRQUZMO01BQUEsQ0FBQSxDQUFB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U0FGeEI7O2FBR0Esa0ZBQUEsR0FDNkUsUUFEN0UsR0FDc0Y7SUFMOUU7O0lBUVYsZUFBQyxDQUFBLE1BQUQsR0FBUyxTQUFDLFFBQUQsRUFBVSxRQUFWO0FBQ1AsVUFBQTs7UUFEaUIsV0FBUzs7TUFDMUIsSUFBQSxDQUFPLFFBQVA7UUFDRSxLQUFBLEdBQVEsVUFBQSxHQUFVLENBQUMsSUFBQyxDQUFBLEtBQUssQ0FBQyxXQUFXLENBQUMsU0FBUyxDQUFDLE9BQTdCLENBQXFDLEtBQXJDLEVBQTJDLEdBQTNDLENBQUQ7UUFDbEIsUUFBQSxHQUFXLEVBQUEsR0FBRyxLQUFILEdBQVcsU0FGeEI7O2FBSUEsdUVBQUEsR0FDb0UsUUFEcEUsR0FDNkU7SUFOdEU7Ozs7S0E1aUJtQjtBQWhCOUIiLCJzb3VyY2VzQ29udGVudCI6WyJ7Q29tcG9zaXRlRGlzcG9zYWJsZX0gID0gcmVxdWlyZSAnYXRvbSdcbntWaWV3LCR9ID0gcmVxdWlyZSAnYXRvbS1zcGFjZS1wZW4tdmlld3MnXG4kID0galEgPSByZXF1aXJlICdqcXVlcnknXG5yZXF1aXJlICdqcXVlcnktdWkvYXV0b2NvbXBsZXRlJ1xucGF0aCA9IHJlcXVpcmUgJ3BhdGgnXG5yZXF1aXJlICdKU09OMidcblxuZnMgPSByZXF1aXJlICdmcydcbnJlcXVpcmUgJ2pzdG9yYWdlJ1xud2luZG93LmJwID0ge31cbndpbmRvdy5icC5qcyAgPSAkLmV4dGVuZCh7fSx3aW5kb3cuJC5qU3RvcmFnZSlcblxuUmVnRXhwLmVzY2FwZT0gKHMpLT5cbiAgcy5yZXBsYWNlIC9bLVxcL1xcXFxeJCorPy4oKXxbXFxde31dL2csICdcXFxcJCYnXG5cbm1vZHVsZS5leHBvcnRzID1cbmNsYXNzIEJyb3dzZXJQbHVzVmlldyBleHRlbmRzIFZpZXdcbiAgY29uc3RydWN0b3I6IChAbW9kZWwpLT5cbiAgICBAc3Vic2NyaXB0aW9ucyA9IG5ldyBDb21wb3NpdGVEaXNwb3NhYmxlXG4gICAgQG1vZGVsLnZpZXcgPSBAXG4gICAgQG1vZGVsLm9uRGlkRGVzdHJveSA9PlxuICAgICAgQHN1YnNjcmlwdGlvbnMuZGlzcG9zZSgpXG4gICAgICBqUShAdXJsKS5hdXRvY29tcGxldGU/KCdkZXN0cm95JylcbiAgICBhdG9tLm5vdGlmaWNhdGlvbnMub25EaWRBZGROb3RpZmljYXRpb24gKG5vdGlmaWNhdGlvbikgLT5cbiAgICAgIGlmIG5vdGlmaWNhdGlvbi50eXBlID09ICdpbmZvJ1xuICAgICAgICBzZXRUaW1lb3V0ICgpIC0+XG4gICAgICAgICAgbm90aWZpY2F0aW9uLmRpc21pc3MoKVxuICAgICAgICAsIDEwMDBcbiAgICBzdXBlclxuXG4gIEBjb250ZW50OiAocGFyYW1zKS0+XG4gICAgdXJsICA9IHBhcmFtcy51cmxcbiAgICBzcGlubmVyQ2xhc3MgPSBcImZhIGZhLXNwaW5uZXJcIlxuICAgIGhpZGVVUkxCYXIgPSAnJ1xuICAgIGlmIHBhcmFtcy5vcHQ/LmhpZGVVUkxCYXJcbiAgICAgIGhpZGVVUkxCYXIgPSAnaGlkZVVSTEJhcidcbiAgICBpZiBwYXJhbXMub3B0Py5zcmNcbiAgICAgIHBhcmFtcy5zcmMgPSBCcm93c2VyUGx1c1ZpZXcuY2hlY2tCYXNlKHBhcmFtcy5vcHQuc3JjLHBhcmFtcy51cmwpXG4gICAgICBwYXJhbXMuc3JjID0gcGFyYW1zLnNyYy5yZXBsYWNlKC9cIi9nLFwiJ1wiKVxuICAgICAgdW5sZXNzIHBhcmFtcy5zcmM/LnN0YXJ0c1dpdGggXCJkYXRhOnRleHQvaHRtbCxcIlxuICAgICAgICBwYXJhbXMuc3JjID0gXCJkYXRhOnRleHQvaHRtbCwje3BhcmFtcy5zcmN9XCJcbiAgICAgIHVybCA9IHBhcmFtcy5zcmMgdW5sZXNzIHVybFxuICAgIGlmIHBhcmFtcy51cmw/LnN0YXJ0c1dpdGggXCJicm93c2VyLXBsdXM6Ly9cIlxuICAgICAgdXJsID0gcGFyYW1zLmJyb3dzZXJQbHVzPy5nZXRCcm93c2VyUGx1c1VybD8odXJsKVxuICAgICAgc3Bpbm5lckNsYXNzICs9IFwiIGZhLWN1c3RvbVwiXG5cbiAgICBAZGl2IGNsYXNzOidicm93c2VyLXBsdXMnLCA9PlxuICAgICAgQGRpdiBjbGFzczpcInVybCBuYXRpdmUta2V5LWJpbmRpbmdzICN7aGlkZVVSTEJhcn1cIixvdXRsZXQ6J3VybGJhcicsID0+XG4gICAgICAgIEBkaXYgY2xhc3M6ICduYXYtYnRucy1sZWZ0JywgPT5cbiAgICAgICAgICBAc3BhbiBpZDonYmFjaycsY2xhc3M6J21lZ2Etb2N0aWNvbiBvY3RpY29uLWFycm93LWxlZnQnLG91dGxldDogJ2JhY2snXG4gICAgICAgICAgQHNwYW4gaWQ6J2ZvcndhcmQnLGNsYXNzOidtZWdhLW9jdGljb24gb2N0aWNvbi1hcnJvdy1yaWdodCcsb3V0bGV0OiAnZm9yd2FyZCdcbiAgICAgICAgICBAc3BhbiBpZDoncmVmcmVzaCcsY2xhc3M6J21lZ2Etb2N0aWNvbiBvY3RpY29uLXN5bmMnLG91dGxldDogJ3JlZnJlc2gnXG4gICAgICAgICAgQHNwYW4gaWQ6J2hpc3RvcnknLGNsYXNzOidtZWdhLW9jdGljb24gb2N0aWNvbi1ib29rJyxvdXRsZXQ6ICdoaXN0b3J5J1xuICAgICAgICAgIEBzcGFuIGlkOidmYXYnLGNsYXNzOidtZWdhLW9jdGljb24gb2N0aWNvbi1zdGFyJyxvdXRsZXQ6ICdmYXYnXG4gICAgICAgICAgQHNwYW4gaWQ6J2Zhdkxpc3QnLCBjbGFzczonb2N0aWNvbiBvY3RpY29uLWFycm93LWRvd24nLG91dGxldDogJ2Zhdkxpc3QnXG4gICAgICAgICAgQGEgY2xhc3M6c3Bpbm5lckNsYXNzLCBvdXRsZXQ6ICdzcGlubmVyJ1xuXG4gICAgICAgIEBkaXYgY2xhc3M6J25hdi1idG5zJywgPT5cbiAgICAgICAgICBAZGl2IGNsYXNzOiAnbmF2LWJ0bnMtcmlnaHQnLCA9PlxuICAgICAgICAgICAgIyBAc3BhbiBpZDoncGRmJyxjbGFzczonbWVnYS1vY3RpY29uIG9jdGljb24tZmlsZS1wZGYnLG91dGxldDogJ3BkZidcbiAgICAgICAgICAgIEBzcGFuIGlkOiduZXdUYWInLCBjbGFzczonb2N0aWNvbicsb3V0bGV0OiAnbmV3VGFiJywgXCJcXHUyNzk1XCJcbiAgICAgICAgICAgIEBzcGFuIGlkOidwcmludCcsY2xhc3M6J2ljb24tYnJvd3Nlci1wbHVzcyBpY29uLXByaW50JyxvdXRsZXQ6ICdwcmludCdcbiAgICAgICAgICAgIEBzcGFuIGlkOidyZW1lbWJlcicsY2xhc3M6J21lZ2Etb2N0aWNvbiBvY3RpY29uLXBpbicsb3V0bGV0OidyZW1lbWJlcidcbiAgICAgICAgICAgIEBzcGFuIGlkOidsaXZlJyxjbGFzczonbWVnYS1vY3RpY29uIG9jdGljb24temFwJyxvdXRsZXQ6J2xpdmUnXG4gICAgICAgICAgICBAc3BhbiBpZDonZGV2dG9vbCcsY2xhc3M6J21lZ2Etb2N0aWNvbiBvY3RpY29uLXRvb2xzJyxvdXRsZXQ6J2RldnRvb2wnXG5cbiAgICAgICAgICBAZGl2IGNsYXNzOidpbnB1dC11cmwnLCA9PlxuICAgICAgICAgICAgQGlucHV0IGNsYXNzOlwibmF0aXZlLWtleS1iaW5kaW5nc1wiLCB0eXBlOid0ZXh0JyxpZDondXJsJyxvdXRsZXQ6J3VybCcsdmFsdWU6XCIje3BhcmFtcy51cmx9XCIgIyN7QHVybH1cIlxuICAgICAgICBAaW5wdXQgaWQ6J2ZpbmQnLGNsYXNzOidmaW5kIGZpbmQtaGlkZScsb3V0bGV0OidmaW5kJ1xuICAgICAgQHRhZyAnd2VidmlldycsY2xhc3M6XCJuYXRpdmUta2V5LWJpbmRpbmdzXCIsb3V0bGV0OiAnaHRtbHYnICxwcmVsb2FkOlwiZmlsZTovLy8je3BhcmFtcy5icm93c2VyUGx1cy5yZXNvdXJjZXN9L2JwLWNsaWVudC5qc1wiLFxuICAgICAgcGx1Z2luczonb24nLHNyYzpcIiN7dXJsfVwiLCBkaXNhYmxld2Vic2VjdXJpdHk6J29uJywgYWxsb3dmaWxlYWNjZXNzZnJvbWZpbGVzOidvbicsIGFsbG93UG9pbnRlckxvY2s6J29uJ1xuXG4gIHRvZ2dsZVVSTEJhcjogLT5cbiAgICBAdXJsYmFyLnRvZ2dsZSgpXG5cbiAgaW5pdGlhbGl6ZTogLT5cbiAgICAgIHNyYyA9IChyZXEscmVzKT0+XG4gICAgICAgIF8gPSByZXF1aXJlICdsb2Rhc2gnXG4gICAgICAgICMgY2hlY2sgZmF2b3JpdGVzXG4gICAgICAgIHBhdHRlcm4gPSAvLy9cbiAgICAgICAgICAgICAgICAgICAgI3tSZWdFeHAuZXNjYXBlIHJlcS50ZXJtfVxuICAgICAgICAgICAgICAgICAgLy8vaVxuICAgICAgICBmYXYgPSBfLmZpbHRlciB3aW5kb3cuYnAuanMuZ2V0KCdicC5mYXYnKSwoZmF2KS0+XG4gICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZhdi51cmwubWF0Y2gocGF0dGVybikgb3IgZmF2LnRpdGxlLm1hdGNoKHBhdHRlcm4pXG4gICAgICAgIHVybHMgPSBfLnBsdWNrKGZhdixcInVybFwiKVxuXG4gICAgICAgIHJlcyh1cmxzKVxuICAgICAgICBzZWFyY2hVcmwgPSAnaHR0cDovL2FwaS5iaW5nLmNvbS9vc2pzb24uYXNweCdcbiAgICAgICAgZG8gLT5cbiAgICAgICAgICBqUS5hamF4XG4gICAgICAgICAgICAgIHVybDogc2VhcmNoVXJsXG4gICAgICAgICAgICAgIGRhdGFUeXBlOiAnanNvbidcbiAgICAgICAgICAgICAgZGF0YToge3F1ZXJ5OnJlcS50ZXJtLCAnd2ViLmNvdW50JzogMTB9XG4gICAgICAgICAgICAgIHN1Y2Nlc3M6IChkYXRhKT0+XG4gICAgICAgICAgICAgICAgdXJscyA9IHVybHNbMC4uMTBdXG4gICAgICAgICAgICAgICAgc2VhcmNoID0gXCJodHRwOi8vd3d3Lmdvb2dsZS5jb20vc2VhcmNoP2FzX3E9XCJcbiAgICAgICAgICAgICAgICBmb3IgZGF0IGluIGRhdGFbMV1bMC4uMTBdXG4gICAgICAgICAgICAgICAgICB1cmxzLnB1c2hcbiAgICAgICAgICAgICAgICAgICAgICAgIGxhYmVsOiBkYXRcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlOiBzZWFyY2grZGF0XG4gICAgICAgICAgICAgICAgcmVzKHVybHMpXG5cbiAgICAgIHNlbGVjdCA9IChldmVudCx1aSk9PlxuICAgICAgICBAZ29Ub1VybCh1aS5pdGVtLnZhbHVlKVxuXG4gICAgICBqUShAdXJsKS5hdXRvY29tcGxldGU/KFxuICAgICAgICAgIHNvdXJjZTogc3JjXG4gICAgICAgICAgbWluTGVuZ3RoOiAyXG4gICAgICAgICAgc2VsZWN0OiBzZWxlY3QpXG4gICAgICBAc3Vic2NyaXB0aW9ucy5hZGQgYXRvbS50b29sdGlwcy5hZGQgQGJhY2ssIHRpdGxlOiAnQmFjaydcbiAgICAgIEBzdWJzY3JpcHRpb25zLmFkZCBhdG9tLnRvb2x0aXBzLmFkZCBAZm9yd2FyZCwgdGl0bGU6ICdGb3J3YXJkJ1xuICAgICAgQHN1YnNjcmlwdGlvbnMuYWRkIGF0b20udG9vbHRpcHMuYWRkIEByZWZyZXNoLCB0aXRsZTogJ1JlZnJlc2gtZjUvY3RybC1mNSdcbiAgICAgIEBzdWJzY3JpcHRpb25zLmFkZCBhdG9tLnRvb2x0aXBzLmFkZCBAcHJpbnQsIHRpdGxlOiAnUHJpbnQnXG4gICAgICBAc3Vic2NyaXB0aW9ucy5hZGQgYXRvbS50b29sdGlwcy5hZGQgQGhpc3RvcnksIHRpdGxlOiAnSGlzdG9yeSdcbiAgICAgIEBzdWJzY3JpcHRpb25zLmFkZCBhdG9tLnRvb2x0aXBzLmFkZCBAZmF2TGlzdCwgdGl0bGU6ICdWaWV3IEZhdm9yaXRlcydcbiAgICAgIEBzdWJzY3JpcHRpb25zLmFkZCBhdG9tLnRvb2x0aXBzLmFkZCBAZmF2LCB0aXRsZTogJ0Zhdm9yaXRpemUnXG4gICAgICBAc3Vic2NyaXB0aW9ucy5hZGQgYXRvbS50b29sdGlwcy5hZGQgQGxpdmUsIHRpdGxlOiAnTGl2ZSdcbiAgICAgIEBzdWJzY3JpcHRpb25zLmFkZCBhdG9tLnRvb2x0aXBzLmFkZCBAcmVtZW1iZXIsIHRpdGxlOiAnUmVtZW1iZXIgUG9zaXRpb24nXG4gICAgICBAc3Vic2NyaXB0aW9ucy5hZGQgYXRvbS50b29sdGlwcy5hZGQgQG5ld1RhYiwgdGl0bGU6ICdOZXcgVGFiJ1xuICAgICAgQHN1YnNjcmlwdGlvbnMuYWRkIGF0b20udG9vbHRpcHMuYWRkIEBkZXZ0b29sLCB0aXRsZTogJ0RldiBUb29scy1mMTInXG5cbiAgICAgIEBzdWJzY3JpcHRpb25zLmFkZCBhdG9tLmNvbW1hbmRzLmFkZCAnLmJyb3dzZXItcGx1cyB3ZWJ2aWV3JywgJ2Jyb3dzZXItcGx1cy12aWV3OmdvQmFjayc6ID0+IEBnb0JhY2soKVxuICAgICAgQHN1YnNjcmlwdGlvbnMuYWRkIGF0b20uY29tbWFuZHMuYWRkICcuYnJvd3Nlci1wbHVzIHdlYnZpZXcnLCAnYnJvd3Nlci1wbHVzLXZpZXc6Z29Gb3J3YXJkJzogPT4gQGdvRm9yd2FyZCgpXG4gICAgICBAc3Vic2NyaXB0aW9ucy5hZGQgYXRvbS5jb21tYW5kcy5hZGQgJy5icm93c2VyLXBsdXMnLCAnYnJvd3Nlci1wbHVzLXZpZXc6dG9nZ2xlVVJMQmFyJzogPT4gQHRvZ2dsZVVSTEJhcigpXG5cbiAgICAgIEBsaXZlT24gPSBmYWxzZVxuICAgICAgQGVsZW1lbnQub25rZXlkb3duID0gPT5Aa2V5SGFuZGxlcihhcmd1bWVudHMpXG4gICAgICBAY2hlY2tGYXYoKSBpZiBAbW9kZWwudXJsLmluZGV4T2YoJ2ZpbGU6Ly8vJykgPj0gMFxuICAgICAgIyBBcnJheS5vYnNlcnZlIEBtb2RlbC5icm93c2VyUGx1cy5mYXYsIChlbGUpPT5cbiAgICAgICMgICBAY2hlY2tGYXYoKVxuXG4gICAgICBAaHRtbHZbMF0/LmFkZEV2ZW50TGlzdGVuZXIgXCJwZXJtaXNzaW9ucmVxdWVzdFwiLCAoZSktPlxuICAgICAgICBlLnJlcXVlc3QuYWxsb3coKVxuXG4gICAgICBAaHRtbHZbMF0/LmFkZEV2ZW50TGlzdGVuZXIgXCJjb25zb2xlLW1lc3NhZ2VcIiwgKGUpPT5cbiAgICAgICAgaWYgZS5tZXNzYWdlLmluY2x1ZGVzKCd+YnJvd3Nlci1wbHVzLXBvc2l0aW9uficpIGFuZCBAcmVtZW1iZXJPblxuICAgICAgICAgIGRhdGEgPSBlLm1lc3NhZ2UucmVwbGFjZSgnfmJyb3dzZXItcGx1cy1wb3NpdGlvbn4nLCcnKVxuICAgICAgICAgIGluZHggPSBkYXRhLmluZGV4T2YoJywnKVxuICAgICAgICAgIHRvcCA9IGRhdGEuc3Vic3RyKDAsaW5keClcbiAgICAgICAgICBsZWZ0ID0gZGF0YS5zdWJzdHIoaW5keCArIDEpXG4gICAgICAgICAgQGN1clBvcyA9IHtcInRvcFwiOnRvcCxcImxlZnRcIjpsZWZ0fVxuICAgICAgICAgIEBocmVmID0gQHVybC52YWwoKVxuXG4gICAgICAgIGlmIGUubWVzc2FnZS5pbmNsdWRlcygnfmJyb3dzZXItcGx1cy1qcXVlcnl+Jykgb3IgZS5tZXNzYWdlLmluY2x1ZGVzKCd+YnJvd3Nlci1wbHVzLW1lbnV+JylcbiAgICAgICAgICBpZiBlLm1lc3NhZ2UuaW5jbHVkZXMoJ35icm93c2VyLXBsdXMtanF1ZXJ5ficpXG4gICAgICAgICAgICBAbW9kZWwuYnJvd3NlclBsdXMualF1ZXJ5SlMgPz0gQnJvd3NlclBsdXNWaWV3LmdldEpRdWVyeS5jYWxsIEBcbiAgICAgICAgICAgIEBodG1sdlswXT8uZXhlY3V0ZUphdmFTY3JpcHQgQG1vZGVsLmJyb3dzZXJQbHVzLmpRdWVyeUpTXG5cbiAgICAgICAgICBpZiBAcmVtZW1iZXJPblxuICAgICAgICAgICAgaWYgQG1vZGVsLmhhc2h1cmxcbiAgICAgICAgICAgICAgQG1vZGVsLnVybCA9IEBtb2RlbC5oYXNodXJsXG4gICAgICAgICAgICAgIEBtb2RlbC5oYXNodXJsID0gdW5kZWZpbmVkXG4gICAgICAgICAgICAgIEB1cmwudmFsKEBtb2RlbC51cmwpXG4gICAgICAgICAgICAgIEBodG1sdlswXT8uZXhlY3V0ZUphdmFTY3JpcHQgXCJcIlwiXG4gICAgICAgICAgICAgICAgICBsb2NhdGlvbi5ocmVmID0gJyN7QG1vZGVsLnVybH0nXG4gICAgICAgICAgICAgICAgICBcIlwiXCJcbiAgICAgICAgICAgIGlmIEByZW1lbWJlck9uIGFuZCBAbW9kZWwudXJsIGlzIEBocmVmXG4gICAgICAgICAgICAgIEBodG1sdlswXT8uZXhlY3V0ZUphdmFTY3JpcHQgXCJcIlwiXG4gICAgICAgICAgICAgICAgalF1ZXJ5KHdpbmRvdykuc2Nyb2xsVG9wKCN7QGN1clBvcy50b3B9KTtcbiAgICAgICAgICAgICAgICBqUXVlcnkod2luZG93KS5zY3JvbGxMZWZ0KCN7QGN1clBvcy5sZWZ0fSk7XG4gICAgICAgICAgICAgIFwiXCJcIlxuXG4gICAgICAgICAgQG1vZGVsLmJyb3dzZXJQbHVzLmpTdG9yYWdlSlMgPz0gQnJvd3NlclBsdXNWaWV3LmdldEpTdG9yYWdlLmNhbGwgQFxuICAgICAgICAgIEBodG1sdlswXT8uZXhlY3V0ZUphdmFTY3JpcHQgQG1vZGVsLmJyb3dzZXJQbHVzLmpTdG9yYWdlSlNcblxuICAgICAgICAgIEBtb2RlbC5icm93c2VyUGx1cy53YXRjaGpzID89IEJyb3dzZXJQbHVzVmlldy5nZXRXYXRjaGpzLmNhbGwgQFxuICAgICAgICAgIEBodG1sdlswXT8uZXhlY3V0ZUphdmFTY3JpcHQgQG1vZGVsLmJyb3dzZXJQbHVzLndhdGNoanNcblxuICAgICAgICAgIEBtb2RlbC5icm93c2VyUGx1cy5ob3RLZXlzID89IEJyb3dzZXJQbHVzVmlldy5nZXRIb3RLZXlzLmNhbGwgQFxuICAgICAgICAgIEBodG1sdlswXT8uZXhlY3V0ZUphdmFTY3JpcHQgQG1vZGVsLmJyb3dzZXJQbHVzLmhvdEtleXNcblxuICAgICAgICAgIEBtb2RlbC5icm93c2VyUGx1cy5ub3RpZnlCYXIgPz0gQnJvd3NlclBsdXNWaWV3LmdldE5vdGlmeUJhci5jYWxsIEBcbiAgICAgICAgICBAaHRtbHZbMF0/LmV4ZWN1dGVKYXZhU2NyaXB0IEBtb2RlbC5icm93c2VyUGx1cy5ub3RpZnlCYXJcbiAgICAgICAgICBpZiBpbml0cyA9IEBtb2RlbC5icm93c2VyUGx1cy5wbHVnaW5zPy5vbkluaXRcbiAgICAgICAgICAgIGZvciBpbml0IGluIGluaXRzXG4gICAgICAgICAgICAgICMgaW5pdCA9IFwiKCN7aW5pdC50b1N0cmluZygpfSkoKVwiXG4gICAgICAgICAgICAgIEBodG1sdlswXT8uZXhlY3V0ZUphdmFTY3JpcHQgaW5pdFxuICAgICAgICAgIGlmIGpzcyA9IEBtb2RlbC5icm93c2VyUGx1cy5wbHVnaW5zPy5qc3NcbiAgICAgICAgICAgIGZvciBqcyBpbiBqc3NcbiAgICAgICAgICAgICAgQGh0bWx2WzBdPy5leGVjdXRlSmF2YVNjcmlwdCBCcm93c2VyUGx1c1ZpZXcubG9hZEpTLmNhbGwoQCxqcyx0cnVlKVxuXG4gICAgICAgICAgaWYgY3NzcyA9IEBtb2RlbC5icm93c2VyUGx1cy5wbHVnaW5zPy5jc3NzXG4gICAgICAgICAgICBmb3IgY3NzIGluIGNzc3NcbiAgICAgICAgICAgICAgQGh0bWx2WzBdPy5leGVjdXRlSmF2YVNjcmlwdCBCcm93c2VyUGx1c1ZpZXcubG9hZENTUy5jYWxsKEAsY3NzLHRydWUpXG5cbiAgICAgICAgICBpZiBtZW51cyA9IEBtb2RlbC5icm93c2VyUGx1cy5wbHVnaW5zPy5tZW51c1xuICAgICAgICAgICAgZm9yIG1lbnUgaW4gbWVudXNcbiAgICAgICAgICAgICAgbWVudS5mbiA9IG1lbnUuZm4udG9TdHJpbmcoKSBpZiBtZW51LmZuXG4gICAgICAgICAgICAgIG1lbnUuc2VsZWN0b3JGaWx0ZXIgPSBtZW51LnNlbGVjdG9yRmlsdGVyLnRvU3RyaW5nKCkgaWYgbWVudS5zZWxlY3RvckZpbHRlclxuICAgICAgICAgICAgICBAaHRtbHZbMF0/LmV4ZWN1dGVKYXZhU2NyaXB0IFwiYnJvd3NlclBsdXMubWVudSgje0pTT04uc3RyaW5naWZ5KG1lbnUpfSlcIlxuXG4gICAgICAgICAgQGh0bWx2WzBdPy5leGVjdXRlSmF2YVNjcmlwdCBCcm93c2VyUGx1c1ZpZXcubG9hZENTUy5jYWxsIEAsJ2JwLXN0eWxlLmNzcydcbiAgICAgICAgICBAaHRtbHZbMF0/LmV4ZWN1dGVKYXZhU2NyaXB0IEJyb3dzZXJQbHVzVmlldy5sb2FkQ1NTLmNhbGwgQCwnanF1ZXJ5Lm5vdGlmeUJhci5jc3MnXG5cbiAgICAgIEBodG1sdlswXT8uYWRkRXZlbnRMaXN0ZW5lciBcInBhZ2UtZmF2aWNvbi11cGRhdGVkXCIsIChlKT0+XG4gICAgICAgIF8gPSByZXF1aXJlICdsb2Rhc2gnXG4gICAgICAgIGZhdnIgPSB3aW5kb3cuYnAuanMuZ2V0KCdicC5mYXYnKVxuICAgICAgICBpZiBmYXYgPSBfLmZpbmQoIGZhdnIseyd1cmwnOkBtb2RlbC51cmx9IClcbiAgICAgICAgICBmYXYuZmF2SWNvbiA9IGUuZmF2aWNvbnNbMF1cbiAgICAgICAgICB3aW5kb3cuYnAuanMuc2V0KCdicC5mYXYnLGZhdnIpXG5cbiAgICAgICAgQG1vZGVsLmljb25OYW1lID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpKjEwMDAwKS50b1N0cmluZygpXG4gICAgICAgIEBtb2RlbC5mYXZJY29uID0gZS5mYXZpY29uc1swXVxuICAgICAgICBAbW9kZWwudXBkYXRlSWNvbiBlLmZhdmljb25zWzBdXG4gICAgICAgIGZhdkljb24gPSB3aW5kb3cuYnAuanMuZ2V0KCdicC5mYXZJY29uJylcbiAgICAgICAgdXJpID0gQGh0bWx2WzBdLmdldFVSTCgpXG4gICAgICAgIHJldHVybiB1bmxlc3MgdXJpXG4gICAgICAgIGZhdkljb25bdXJpXSA9IGUuZmF2aWNvbnNbMF1cbiAgICAgICAgd2luZG93LmJwLmpzLnNldCgnYnAuZmF2SWNvbicsZmF2SWNvbilcbiAgICAgICAgQG1vZGVsLnVwZGF0ZUljb24oKVxuICAgICAgICBzdHlsZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3N0eWxlJylcbiAgICAgICAgc3R5bGUudHlwZSA9ICd0ZXh0L2NzcydcbiAgICAgICAgc3R5bGUuaW5uZXJIVE1MID0gXCJcIlwiXG4gICAgICAgICAgICAudGl0bGUuaWNvbi5pY29uLSN7QG1vZGVsLmljb25OYW1lfSB7XG4gICAgICAgICAgICAgIGJhY2tncm91bmQtc2l6ZTogMTZweCAxNnB4O1xuICAgICAgICAgICAgICBiYWNrZ3JvdW5kLXJlcGVhdDogbm8tcmVwZWF0O1xuICAgICAgICAgICAgICBwYWRkaW5nLWxlZnQ6IDIwcHg7XG4gICAgICAgICAgICAgIGJhY2tncm91bmQtaW1hZ2U6IHVybCgnI3tlLmZhdmljb25zWzBdfScpO1xuICAgICAgICAgICAgICBiYWNrZ3JvdW5kLXBvc2l0aW9uLXk6IDUwJTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICBcIlwiXCJcbiAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ2hlYWQnKVswXS5hcHBlbmRDaGlsZChzdHlsZSlcblxuICAgICAgQGh0bWx2WzBdPy5hZGRFdmVudExpc3RlbmVyIFwiZGlkLW5hdmlnYXRlLWluLXBhZ2VcIiwgKGV2dCk9PlxuICAgICAgICBAdXBkYXRlUGFnZVVybChldnQpO1xuXG4gICAgICBAaHRtbHZbMF0/LmFkZEV2ZW50TGlzdGVuZXIgXCJkaWQtbmF2aWdhdGVcIiwgKGV2dCk9PlxuICAgICAgICBAdXBkYXRlUGFnZVVybChldnQpO1xuXG4gICAgICBAaHRtbHZbMF0/LmFkZEV2ZW50TGlzdGVuZXIgXCJwYWdlLXRpdGxlLXNldFwiLCAoZSk9PlxuICAgICAgICAjIEBtb2RlbC5icm93c2VyUGx1cy50aXRsZVtAbW9kZWwudXJsXSA9IGUudGl0bGVcbiAgICAgICAgXyA9IHJlcXVpcmUgJ2xvZGFzaCdcbiAgICAgICAgZmF2ciA9IHdpbmRvdy5icC5qcy5nZXQoJ2JwLmZhdicpXG4gICAgICAgIHRpdGxlID0gd2luZG93LmJwLmpzLmdldCgnYnAudGl0bGUnKVxuICAgICAgICB1cmkgPSBAaHRtbHZbMF0uZ2V0VVJMKClcbiAgICAgICAgcmV0dXJuIHVubGVzcyB1cmlcbiAgICAgICAgdGl0bGVbdXJpXSA9IGUudGl0bGVcbiAgICAgICAgd2luZG93LmJwLmpzLnNldCgnYnAudGl0bGUnLHRpdGxlKVxuICAgICAgICBpZiBmYXYgID0gXy5maW5kKCBmYXZyLHsndXJsJzpAbW9kZWwudXJsfSApXG4gICAgICAgICAgZmF2LnRpdGxlID0gZS50aXRsZVxuICAgICAgICAgIHdpbmRvdy5icC5qcy5zZXQoJ2JwLmZhdicsZmF2cilcbiAgICAgICAgQG1vZGVsLnNldFRpdGxlKGUudGl0bGUpXG5cbiAgICAgIEBkZXZ0b29sLm9uICdjbGljaycsIChldnQpPT5cbiAgICAgICAgQHRvZ2dsZURldlRvb2woKVxuXG4gICAgICBAc3Bpbm5lci5vbiAnY2xpY2snLCAoZXZ0KT0+XG4gICAgICAgIEBodG1sdlswXT8uc3RvcCgpXG5cbiAgICAgIEByZW1lbWJlci5vbiAnY2xpY2snLCAoZXZ0KT0+XG4gICAgICAgIEByZW1lbWJlck9uID0gIUByZW1lbWJlck9uXG4gICAgICAgIEByZW1lbWJlci50b2dnbGVDbGFzcygnYWN0aXZlJyxAcmVtZW1iZXJPbilcblxuICAgICAgQHByaW50Lm9uICdjbGljaycsIChldnQpPT5cbiAgICAgICAgQGh0bWx2WzBdPy5wcmludCgpXG5cbiAgICAgIEBuZXdUYWIub24gJ2NsaWNrJywgKGV2dCk9PlxuICAgICAgICBhdG9tLndvcmtzcGFjZS5vcGVuIFwiYnJvd3Nlci1wbHVzOi8vYmxhbmtcIlxuICAgICAgICBAc3Bpbm5lci5yZW1vdmVDbGFzcyAnZmEtY3VzdG9tJ1xuXG4gICAgICBAaGlzdG9yeS5vbiAnY2xpY2snLCAoZXZ0KT0+XG4gICAgICAgICMgYXRvbS53b3Jrc3BhY2Uub3BlbiBcImZpbGU6Ly8vI3tAbW9kZWwuYnJvd3NlclBsdXMucmVzb3VyY2VzfWhpc3RvcnkuaHRtbFwiICwge3NwbGl0OiAnbGVmdCcsc2VhcmNoQWxsUGFuZXM6dHJ1ZX1cbiAgICAgICAgYXRvbS53b3Jrc3BhY2Uub3BlbiBcImJyb3dzZXItcGx1czovL2hpc3RvcnlcIiAsIHtzcGxpdDogJ2xlZnQnLHNlYXJjaEFsbFBhbmVzOnRydWV9XG5cbiAgICAgICMgQHBkZi5vbiAnY2xpY2snLCAoZXZ0KT0+XG4gICAgICAjICAgQGh0bWx2WzBdPy5wcmludFRvUERGIHt9LCAoZGF0YSxlcnIpLT5cblxuICAgICAgQGxpdmUub24gJ2NsaWNrJywgKGV2dCk9PlxuICAgICAgICAjIHJldHVybiBpZiBAbW9kZWwuc3JjXG4gICAgICAgIEBsaXZlT24gPSAhQGxpdmVPblxuICAgICAgICBAbGl2ZS50b2dnbGVDbGFzcygnYWN0aXZlJyxAbGl2ZU9uKVxuICAgICAgICBpZiBAbGl2ZU9uXG4gICAgICAgICAgQHJlZnJlc2hQYWdlKClcbiAgICAgICAgICBAbGl2ZVN1YnNjcmlwdGlvbiA9IG5ldyBDb21wb3NpdGVEaXNwb3NhYmxlXG4gICAgICAgICAgQGxpdmVTdWJzY3JpcHRpb24uYWRkIGF0b20ud29ya3NwYWNlLm9ic2VydmVUZXh0RWRpdG9ycyAoZWRpdG9yKT0+XG4gICAgICAgICAgICAgICAgICBAbGl2ZVN1YnNjcmlwdGlvbi5hZGQgZWRpdG9yLm9uRGlkU2F2ZSA9PlxuICAgICAgICAgICAgICAgICAgICAgICAgdGltZW91dCA9IGF0b20uY29uZmlnLmdldCgnYnJvd3Nlci1wbHVzLmxpdmUnKVxuICAgICAgICAgICAgICAgICAgICAgICAgc2V0VGltZW91dCA9PlxuICAgICAgICAgICAgICAgICAgICAgICAgICBAcmVmcmVzaFBhZ2UoKVxuICAgICAgICAgICAgICAgICAgICAgICAgLCB0aW1lb3V0XG4gICAgICAgICAgQG1vZGVsLm9uRGlkRGVzdHJveSA9PlxuICAgICAgICAgICAgQGxpdmVTdWJzY3JpcHRpb24uZGlzcG9zZSgpXG4gICAgICAgIGVsc2VcbiAgICAgICAgICBAbGl2ZVN1YnNjcmlwdGlvbi5kaXNwb3NlKClcblxuXG4gICAgICBAZmF2Lm9uICdjbGljaycsKGV2dCk9PlxuICAgICAgICAjIHJldHVybiBpZiBAbW9kZWwuc3JjXG4gICAgICAgICMgcmV0dXJuIGlmIEBodG1sdlswXT8uZ2V0VXJsKCkuc3RhcnRzV2l0aCgnZGF0YTp0ZXh0L2h0bWwsJylcbiAgICAgICAgIyByZXR1cm4gaWYgQG1vZGVsLnVybC5zdGFydHNXaXRoICdicm93c2VyLXBsdXM6J1xuICAgICAgICBmYXZzID0gd2luZG93LmJwLmpzLmdldCgnYnAuZmF2JylcbiAgICAgICAgaWYgQGZhdi5oYXNDbGFzcygnYWN0aXZlJylcbiAgICAgICAgICBAcmVtb3ZlRmF2KEBtb2RlbClcbiAgICAgICAgZWxzZVxuICAgICAgICAgIHJldHVybiBpZiBAbW9kZWwub3JnVVJJXG4gICAgICAgICAgZGF0YSA9IHtcbiAgICAgICAgICAgIHVybDogQG1vZGVsLnVybFxuICAgICAgICAgICAgdGl0bGU6IEBtb2RlbC50aXRsZSBvciBAbW9kZWwudXJsXG4gICAgICAgICAgICBmYXZJY29uOiBAbW9kZWwuZmF2SWNvblxuICAgICAgICAgIH1cbiAgICAgICAgICBmYXZzLnB1c2ggZGF0YVxuICAgICAgICAgIGRlbENvdW50ID0gZmF2cy5sZW5ndGggLSBhdG9tLmNvbmZpZy5nZXQgJ2Jyb3dzZXItcGx1cy5mYXYnXG4gICAgICAgICAgZmF2cy5zcGxpY2UgMCwgZGVsQ291bnQgaWYgZGVsQ291bnQgPiAwXG4gICAgICAgICAgd2luZG93LmJwLmpzLnNldCgnYnAuZmF2JyxmYXZzKVxuICAgICAgICBAZmF2LnRvZ2dsZUNsYXNzICdhY3RpdmUnXG5cbiAgICAgIEBodG1sdlswXT8uYWRkRXZlbnRMaXN0ZW5lciAnbmV3LXdpbmRvdycsIChlKS0+XG4gICAgICAgIGF0b20ud29ya3NwYWNlLm9wZW4gZS51cmwsIHtzcGxpdDogJ2xlZnQnLHNlYXJjaEFsbFBhbmVzOnRydWUsb3BlbkluU2FtZVdpbmRvdzpmYWxzZX1cblxuICAgICAgQGh0bWx2WzBdPy5hZGRFdmVudExpc3RlbmVyIFwiZGlkLXN0YXJ0LWxvYWRpbmdcIiwgPT5cbiAgICAgICAgQHNwaW5uZXIucmVtb3ZlQ2xhc3MgJ2ZhLWN1c3RvbSdcbiAgICAgICAgQGh0bWx2WzBdPy5zaGFkb3dSb290LmZpcnN0Q2hpbGQuc3R5bGUuaGVpZ2h0ID0gJzk1JSdcblxuICAgICAgQGh0bWx2WzBdPy5hZGRFdmVudExpc3RlbmVyIFwiZGlkLXN0b3AtbG9hZGluZ1wiLCA9PlxuICAgICAgICBAc3Bpbm5lci5hZGRDbGFzcyAnZmEtY3VzdG9tJ1xuXG4gICAgICBAYmFjay5vbiAnY2xpY2snLCAoZXZ0KT0+XG4gICAgICAgIGlmIEBodG1sdlswXT8uY2FuR29CYWNrKCkgYW5kICQoYCB0aGlzYCkuaGFzQ2xhc3MoJ2FjdGl2ZScpXG4gICAgICAgICAgQGh0bWx2WzBdPy5nb0JhY2soKVxuXG4gICAgICBAZmF2TGlzdC5vbiAnY2xpY2snLCAoZXZ0KT0+XG4gICAgICAgIGZhdkxpc3QgPSByZXF1aXJlICcuL2Zhdi12aWV3J1xuICAgICAgICBuZXcgZmF2TGlzdCB3aW5kb3cuYnAuanMuZ2V0KCdicC5mYXYnKVxuXG4gICAgICBAZm9yd2FyZC5vbiAnY2xpY2snLCAoZXZ0KT0+XG4gICAgICAgIGlmIEBodG1sdlswXT8uY2FuR29Gb3J3YXJkKCkgYW5kICQoYCB0aGlzYCkuaGFzQ2xhc3MoJ2FjdGl2ZScpXG4gICAgICAgICAgQGh0bWx2WzBdPy5nb0ZvcndhcmQoKVxuXG4gICAgICBAdXJsLm9uICdjbGljaycsKGV2dCk9PlxuICAgICAgICBAdXJsLnNlbGVjdCgpXG5cbiAgICAgIEB1cmwub24gJ2tleXByZXNzJywoZXZ0KT0+XG4gICAgICAgIFVSTCA9IHJlcXVpcmUgJ3VybCdcbiAgICAgICAgaWYgZXZ0LndoaWNoIGlzIDEzXG4gICAgICAgICAgQHVybC5ibHVyKClcbiAgICAgICAgICB1cmxzID0gVVJMLnBhcnNlKGAgdGhpcy52YWx1ZWApXG4gICAgICAgICAgdXJsID0gYCB0aGlzLnZhbHVlYFxuICAgICAgICAgIHVubGVzcyB1cmwuc3RhcnRzV2l0aCgnYnJvd3Nlci1wbHVzOi8vJylcbiAgICAgICAgICAgIGlmIHVybC5pbmRleE9mKCcgJykgPj0gMFxuICAgICAgICAgICAgICB1cmwgPSBcImh0dHA6Ly93d3cuZ29vZ2xlLmNvbS9zZWFyY2g/YXNfcT0je3VybH1cIlxuICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICBsb2NhbGhvc3RQYXR0ZXJuID0gLy8vXlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIChodHRwOi8vKT9cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsb2NhbGhvc3RcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLy9pXG4gICAgICAgICAgICAgIGlmIHVybC5zZWFyY2gobG9jYWxob3N0UGF0dGVybikgPCAwICAgYW5kIHVybC5pbmRleE9mKCcuJykgPCAwXG4gICAgICAgICAgICAgICAgdXJsID0gXCJodHRwOi8vd3d3Lmdvb2dsZS5jb20vc2VhcmNoP2FzX3E9I3t1cmx9XCJcbiAgICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgIGlmIHVybHMucHJvdG9jb2wgaW4gWydodHRwJywnaHR0cHMnLCdmaWxlOiddXG4gICAgICAgICAgICAgICAgICBpZiB1cmxzLnByb3RvY29sIGlzICdmaWxlOidcbiAgICAgICAgICAgICAgICAgICAgdXJsID0gdXJsLnJlcGxhY2UoL1xcXFwvZyxcIi9cIilcbiAgICAgICAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICAgICAgdXJsID0gVVJMLmZvcm1hdCh1cmxzKVxuICAgICAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICAgIHVybHMucHJvdG9jb2wgPSAnaHR0cCdcbiAgICAgICAgICAgICAgICAgIHVybCA9IFVSTC5mb3JtYXQodXJscylcbiAgICAgICAgICBAZ29Ub1VybCh1cmwpXG5cbiAgICAgIEByZWZyZXNoLm9uICdjbGljaycsIChldnQpPT5cbiAgICAgICAgQHJlZnJlc2hQYWdlKClcblxuICAgICAgIyBAbW9iaWxlLm9uICdjbGljaycsIChldnQpPT5cbiAgICAgICMgICBAaHRtbHZbMF0/LnNldFVzZXJBZ2VudChcIk1vemlsbGEvNS4wIChMaW51eDsgQW5kcm9pZCA2LjA7IE5leHVzIDUgQnVpbGQvTVJBNThOKSBBcHBsZVdlYktpdC81MzcuMzYgKEtIVE1MLCBsaWtlIEdlY2tvKSBDaHJvbWUvNjEuMC4zMTM0LjAgTW9iaWxlIFNhZmFyaS81MzcuMzZcIilcblxuICB1cGRhdGVQYWdlVXJsOiAoZXZ0KSAtPlxuICAgICAgQnJvd3NlclBsdXNNb2RlbCA9IHJlcXVpcmUgJy4vYnJvd3Nlci1wbHVzLW1vZGVsJ1xuICAgICAgdXJsID0gZXZ0LnVybFxuICAgICAgdW5sZXNzIEJyb3dzZXJQbHVzTW9kZWwuY2hlY2tVcmwodXJsKVxuICAgICAgICB1cmwgPSBhdG9tLmNvbmZpZy5nZXQoJ2Jyb3dzZXItcGx1cy5ob21lcGFnZScpIG9yIFwiaHR0cDovL3d3dy5nb29nbGUuY29tXCJcbiAgICAgICAgYXRvbS5ub3RpZmljYXRpb25zLmFkZFN1Y2Nlc3MoXCJSZWRpcmVjdGluZyB0byAje3VybH1cIilcbiAgICAgICAgQGh0bWx2WzBdPy5leGVjdXRlSmF2YVNjcmlwdCBcImxvY2F0aW9uLmhyZWYgPSAnI3t1cmx9J1wiXG4gICAgICAgIHJldHVyblxuICAgICAgaWYgdXJsIGFuZCB1cmwgaXNudCBAbW9kZWwudXJsIGFuZCBub3QgQHVybC52YWwoKT8uc3RhcnRzV2l0aCAnYnJvd3Nlci1wbHVzOi8vJ1xuICAgICAgICBAdXJsLnZhbCB1cmxcbiAgICAgICAgQG1vZGVsLnVybCA9IHVybFxuICAgICAgdGl0bGUgPSBAaHRtbHZbMF0/LmdldFRpdGxlKClcbiAgICAgIGlmIHRpdGxlXG4gICAgICAgICMgQG1vZGVsLmJyb3dzZXJQbHVzLnRpdGxlW0Btb2RlbC51cmxdID0gdGl0bGVcbiAgICAgICAgQG1vZGVsLnNldFRpdGxlKHRpdGxlKSBpZiB0aXRsZSBpc250IEBtb2RlbC5nZXRUaXRsZSgpXG4gICAgICBlbHNlXG4gICAgICAgICMgQG1vZGVsLmJyb3dzZXJQbHVzLnRpdGxlW0Btb2RlbC51cmxdID0gdXJsXG4gICAgICAgIEBtb2RlbC5zZXRUaXRsZSh1cmwpXG5cbiAgICAgIEBsaXZlLnRvZ2dsZUNsYXNzICdhY3RpdmUnLEBsaXZlT25cbiAgICAgIEBsaXZlU3Vic2NyaXB0aW9uPy5kaXNwb3NlKCkgdW5sZXNzIEBsaXZlT25cbiAgICAgIEBjaGVja05hdigpXG4gICAgICBAY2hlY2tGYXYoKVxuICAgICAgQGFkZEhpc3RvcnkoKVxuXG4gIHJlZnJlc2hQYWdlOiAodXJsLGlnbm9yZWNhY2hlKS0+XG4gICAgICAjIGh0bWx2ID0gQG1vZGVsLnZpZXcuaHRtbHZbMF1cbiAgICAgIGlmIEByZW1lbWJlck9uXG4gICAgICAgIEBodG1sdlswXT8uZXhlY3V0ZUphdmFTY3JpcHQgXCJcIlwiXG4gICAgICAgICAgdmFyIGxlZnQsIHRvcDtcbiAgICAgICAgICBjdXJUb3AgPSBqUXVlcnkod2luZG93KS5zY3JvbGxUb3AoKTtcbiAgICAgICAgICBjdXJMZWZ0ID0galF1ZXJ5KHdpbmRvdykuc2Nyb2xsTGVmdCgpO1xuICAgICAgICAgIGNvbnNvbGUubG9nKGB+YnJvd3Nlci1wbHVzLXBvc2l0aW9ufiR7Y3VyVG9wfSwke2N1ckxlZnR9YCk7XG4gICAgICAgIFwiXCJcIlxuICAgICAgaWYgQG1vZGVsLm9yZ1VSSSBhbmQgcHAgPSBhdG9tLnBhY2thZ2VzLmdldEFjdGl2ZVBhY2thZ2UoJ3BwJylcbiAgICAgICAgcHAubWFpbk1vZHVsZS5jb21waWxlUGF0aChAbW9kZWwub3JnVVJJLEBtb2RlbC5faWQpXG4gICAgICBlbHNlXG4gICAgICAgIGlmIHVybFxuICAgICAgICAgIEBtb2RlbC51cmwgPSB1cmxcbiAgICAgICAgICBAdXJsLnZhbCB1cmxcbiAgICAgICAgICBAaHRtbHZbMF0/LnNyYyA9IHVybFxuICAgICAgICBlbHNlXG4gICAgICAgICAgaWYgQHVsdHJhTGl2ZU9uIGFuZCBAbW9kZWwuc3JjXG4gICAgICAgICAgICBAaHRtbHZbMF0/LnNyYyA9IEBtb2RlbC5zcmNcbiAgICAgICAgICBpZiBpZ25vcmVjYWNoZVxuICAgICAgICAgICAgQGh0bWx2WzBdPy5yZWxvYWRJZ25vcmluZ0NhY2hlKClcbiAgICAgICAgICBlbHNlXG4gICAgICAgICAgICBAaHRtbHZbMF0/LnJlbG9hZCgpXG5cbiAgZ29Ub1VybDogKHVybCktPlxuICAgICAgQnJvd3NlclBsdXNNb2RlbCA9IHJlcXVpcmUgJy4vYnJvd3Nlci1wbHVzLW1vZGVsJ1xuICAgICAgcmV0dXJuIHVubGVzcyBCcm93c2VyUGx1c01vZGVsLmNoZWNrVXJsKHVybClcbiAgICAgIGpRKEB1cmwpLmF1dG9jb21wbGV0ZT8oXCJjbG9zZVwiKVxuICAgICAgQGxpdmVPbiA9IGZhbHNlXG4gICAgICBAbGl2ZS50b2dnbGVDbGFzcyAnYWN0aXZlJyxAbGl2ZU9uXG4gICAgICBAbGl2ZVN1YnNjcmlwdGlvbj8uZGlzcG9zZSgpIHVubGVzcyBAbGl2ZU9uXG4gICAgICBAdXJsLnZhbCB1cmxcbiAgICAgIEBtb2RlbC51cmwgPSB1cmxcbiAgICAgIGRlbGV0ZSBAbW9kZWwudGl0bGVcbiAgICAgIGRlbGV0ZSBAbW9kZWwuaWNvbk5hbWVcbiAgICAgIGRlbGV0ZSBAbW9kZWwuZmF2SWNvblxuICAgICAgQG1vZGVsLnNldFRpdGxlKG51bGwpXG4gICAgICBAbW9kZWwudXBkYXRlSWNvbihudWxsKVxuICAgICAgaWYgdXJsLnN0YXJ0c1dpdGgoJ2Jyb3dzZXItcGx1czovLycpXG4gICAgICAgIHVybCA9IEBtb2RlbC5icm93c2VyUGx1cy5nZXRCcm93c2VyUGx1c1VybD8odXJsKVxuICAgICAgQGh0bWx2LmF0dHIgJ3NyYycsdXJsXG5cbiAga2V5SGFuZGxlcjogKGV2dCktPlxuICAgIHN3aXRjaCBldnRbMF0ua2V5SWRlbnRpZmllclxuICAgICAgd2hlbiAgXCJGMTJcIlxuICAgICAgICBAdG9nZ2xlRGV2VG9vbCgpXG4gICAgICB3aGVuIFwiRjVcIlxuICAgICAgICBpZiBldnRbMF0uY3RybEtleVxuICAgICAgICAgIEByZWZyZXNoUGFnZSh1bmRlZmluZWQsdHJ1ZSlcbiAgICAgICAgZWxzZVxuICAgICAgICAgIEByZWZyZXNoUGFnZSgpXG4gICAgICB3aGVuIFwiRjEwXCJcbiAgICAgICAgQHRvZ2dsZVVSTEJhcigpXG4gICAgICB3aGVuIFwiTGVmdFwiXG4gICAgICAgIEBnb0JhY2soKSBpZiBldnRbMF0uYWx0S2V5XG5cbiAgICAgIHdoZW4gXCJSaWdodFwiXG4gICAgICAgIEBnb0ZvcndhcmQoKSBpZiBldnRbMF0uYWx0S2V5XG5cbiAgcmVtb3ZlRmF2OiAoZmF2b3JpdGUpLT5cbiAgICBmYXZycyA9IHdpbmRvdy5icC5qcy5nZXQoJ2JwLmZhdicpXG4gICAgZm9yIGZhdnIsaWR4IGluIGZhdnJzXG4gICAgICBpZiBmYXZyLnVybCBpcyBmYXZvcml0ZS51cmxcbiAgICAgICAgZmF2cnMuc3BsaWNlIGlkeCwxXG4gICAgICAgIHdpbmRvdy5icC5qcy5zZXQoJ2JwLmZhdicsZmF2cnMpXG4gICAgICAgIHJldHVyblxuXG4gIHNldFNyYzogKHRleHQpLT5cbiAgICB1cmwgPSBAbW9kZWwub3JnVVJJIG9yIEBtb2RlbC51cmxcbiAgICB0ZXh0ID0gQnJvd3NlclBsdXNWaWV3LmNoZWNrQmFzZSh0ZXh0LHVybClcbiAgICBAbW9kZWwuc3JjID0gXCJkYXRhOnRleHQvaHRtbCwje3RleHR9XCJcbiAgICBAaHRtbHZbMF0/LnNyYyA9IEBtb2RlbC5zcmNcblxuICBAY2hlY2tCYXNlOiAodGV4dCx1cmwpLT5cbiAgICBjaGVlcmlvID0gcmVxdWlyZSAnY2hlZXJpbydcbiAgICAkaHRtbCA9IGNoZWVyaW8ubG9hZCh0ZXh0KVxuICAgICMgYmFzZVBhdGggPSBhdG9tLnByb2plY3QuZ2V0UGF0aHMoKVswXStcIi9cIlxuICAgIGJhc2VQYXRoID0gcGF0aC5kaXJuYW1lKHVybCkrXCIvXCJcbiAgICBpZiAkaHRtbCgnYmFzZScpLmxlbmd0aFxuICAgICAgdGV4dFxuICAgIGVsc2VcbiAgICAgIGlmICRodG1sKCdoZWFkJykubGVuZ3RoXG4gICAgICAgIGJhc2UgID0gXCI8YmFzZSBocmVmPScje2Jhc2VQYXRofScgdGFyZ2V0PSdfYmxhbmsnPlwiXG4gICAgICAgICRodG1sKCdoZWFkJykucHJlcGVuZChiYXNlKVxuICAgICAgZWxzZVxuICAgICAgICBiYXNlICA9IFwiPGhlYWQ+PGJhc2UgaHJlZj0nI3tiYXNlUGF0aH0nIHRhcmdldD0nX2JsYW5rJz48L2hlYWQ+XCJcbiAgICAgICAgJGh0bWwoJ2h0bWwnKS5wcmVwZW5kKGJhc2UpXG4gICAgICAkaHRtbC5odG1sKClcblxuICBjaGVja0ZhdjogLT5cbiAgICBAZmF2LnJlbW92ZUNsYXNzICdhY3RpdmUnXG4gICAgZmF2cnMgPSB3aW5kb3cuYnAuanMuZ2V0KCdicC5mYXYnKVxuICAgIGZvciBmYXZyIGluIGZhdnJzXG4gICAgICBpZiBmYXZyLnVybCBpcyBAbW9kZWwudXJsXG4gICAgICAgIEBmYXYuYWRkQ2xhc3MgJ2FjdGl2ZSdcblxuICB0b2dnbGVEZXZUb29sOiAtPlxuICAgIG9wZW4gPSBAaHRtbHZbMF0/LmlzRGV2VG9vbHNPcGVuZWQoKVxuICAgIGlmIG9wZW5cbiAgICAgIEBodG1sdlswXT8uY2xvc2VEZXZUb29scygpXG4gICAgZWxzZVxuICAgICAgQGh0bWx2WzBdPy5vcGVuRGV2VG9vbHMoKVxuXG4gICAgJChAZGV2dG9vbCkudG9nZ2xlQ2xhc3MgJ2FjdGl2ZScsICFvcGVuXG5cbiAgY2hlY2tOYXY6IC0+XG4gICAgICAkKEBmb3J3YXJkKS50b2dnbGVDbGFzcyAnYWN0aXZlJyxAaHRtbHZbMF0/LmNhbkdvRm9yd2FyZCgpXG4gICAgICAkKEBiYWNrKS50b2dnbGVDbGFzcyAnYWN0aXZlJyxAaHRtbHZbMF0/LmNhbkdvQmFjaygpXG4gICAgICBpZiBAaHRtbHZbMF0/LmNhbkdvRm9yd2FyZCgpXG4gICAgICAgIGlmIEBjbGVhckZvcndhcmRcbiAgICAgICAgICAkKEBmb3J3YXJkKS50b2dnbGVDbGFzcyAnYWN0aXZlJyxmYWxzZVxuICAgICAgICAgIEBjbGVhckZvcndhcmQgPSBmYWxzZVxuICAgICAgICBlbHNlXG4gICAgICAgICAgJChAZm9yd2FyZCkudG9nZ2xlQ2xhc3MgJ2FjdGl2ZScsdHJ1ZVxuXG4gIGdvQmFjazogLT5cbiAgICBAYmFjay5jbGljaygpXG5cbiAgZ29Gb3J3YXJkOiAtPlxuICAgIEBmb3J3YXJkLmNsaWNrKClcblxuICBhZGRIaXN0b3J5OiAtPlxuICAgIHVybCA9IEBodG1sdlswXS5nZXRVUkwoKS5yZXBsYWNlKC9cXFxcL2csXCIvXCIpXG4gICAgcmV0dXJuIHVubGVzcyB1cmxcbiAgICBoaXN0b3J5VVJMID0gXCJmaWxlOi8vLyN7QG1vZGVsLmJyb3dzZXJQbHVzLnJlc291cmNlc31oaXN0b3J5Lmh0bWxcIi5yZXBsYWNlKC9cXFxcL2csXCIvXCIpXG4gICAgcmV0dXJuIGlmIHVybC5zdGFydHNXaXRoKCdicm93c2VyLXBsdXM6Ly8nKSBvciB1cmwuc3RhcnRzV2l0aCgnZGF0YTp0ZXh0L2h0bWwsJykgb3IgdXJsLnN0YXJ0c1dpdGggaGlzdG9yeVVSTFxuICAgIHl5eXltbWRkID0gLT5cbiAgICAgIGRhdGUgPSBuZXcgRGF0ZSgpXG4gICAgICB5eXl5ID0gZGF0ZS5nZXRGdWxsWWVhcigpLnRvU3RyaW5nKClcbiAgICAgIG1tID0gKGRhdGUuZ2V0TW9udGgoKSArIDEpLnRvU3RyaW5nKClcbiAgICAgICMgZ2V0TW9udGgoKSBpcyB6ZXJvLWJhc2VkXG4gICAgICBkZCA9IGRhdGUuZ2V0RGF0ZSgpLnRvU3RyaW5nKClcbiAgICAgIHl5eXkgKyAoaWYgbW1bMV0gdGhlbiBtbSBlbHNlICcwJyArIG1tWzBdKSArIChpZiBkZFsxXSB0aGVuIGRkIGVsc2UgJzAnICsgZGRbMF0pXG4gICAgdG9kYXkgPSB5eXl5bW1kZCgpXG4gICAgaGlzdG9yeSA9IHdpbmRvdy5icC5qcy5nZXQoJ2JwLmhpc3RvcnknKSBvciBbXVxuICAgICMgcmV0dXJuIHVubGVzcyBoaXN0b3J5IG9yIGhpc3RvcnkubGVuZ3RoID0gMFxuICAgIHRvZGF5T2JqID0gaGlzdG9yeS5maW5kIChlbGUsaWR4LGFyciktPlxuICAgICAgcmV0dXJuIHRydWUgaWYgZWxlW3RvZGF5XVxuICAgIHVubGVzcyB0b2RheU9ialxuICAgICAgb2JqID0ge31cbiAgICAgIGhpc3RUb2RheSA9IFtdXG4gICAgICBvYmpbdG9kYXldID0gaGlzdFRvZGF5XG4gICAgICBoaXN0b3J5LnVuc2hpZnQgb2JqXG4gICAgZWxzZVxuICAgICAgaGlzdFRvZGF5ID0gdG9kYXlPYmpbdG9kYXldXG4gICAgaGlzdFRvZGF5LnVuc2hpZnQgZGF0ZTogKG5ldyBEYXRlKCkudG9TdHJpbmcoKSksdXJpOiB1cmxcbiAgICB3aW5kb3cuYnAuanMuc2V0KCdicC5oaXN0b3J5JyxoaXN0b3J5KVxuXG4gIGdldFRpdGxlOiAtPlxuICAgIEBtb2RlbC5nZXRUaXRsZSgpXG5cbiAgc2VyaWFsaXplOiAtPlxuXG4gIGRlc3Ryb3k6IC0+XG4gICAgalEoQHVybCkuYXV0b2NvbXBsZXRlPygnZGVzdHJveScpXG4gICAgQHN1YnNjcmlwdGlvbnMuZGlzcG9zZSgpXG5cbiAgQGdldEpRdWVyeTogLT5cbiAgICBmcy5yZWFkRmlsZVN5bmMgXCIje0Btb2RlbC5icm93c2VyUGx1cy5yZXNvdXJjZXN9L2pxdWVyeS0yLjEuNC5taW4uanNcIiwndXRmLTgnXG5cbiAgQGdldEV2YWw6IC0+XG4gICAgZnMucmVhZEZpbGVTeW5jIFwiI3tAbW9kZWwuYnJvd3NlclBsdXMucmVzb3VyY2VzfS9ldmFsLmpzXCIsJ3V0Zi04J1xuXG4gIEBnZXRKU3RvcmFnZTogLT5cbiAgICBmcy5yZWFkRmlsZVN5bmMgXCIje0Btb2RlbC5icm93c2VyUGx1cy5yZXNvdXJjZXN9L2pzdG9yYWdlLm1pbi5qc1wiLCd1dGYtOCdcblxuICBAZ2V0V2F0Y2hqczogLT5cbiAgICBmcy5yZWFkRmlsZVN5bmMgXCIje0Btb2RlbC5icm93c2VyUGx1cy5yZXNvdXJjZXN9L3dhdGNoLmpzXCIsJ3V0Zi04J1xuXG4gIEBnZXROb3RpZnlCYXI6IC0+XG4gICAgZnMucmVhZEZpbGVTeW5jIFwiI3tAbW9kZWwuYnJvd3NlclBsdXMucmVzb3VyY2VzfS9qcXVlcnkubm90aWZ5QmFyLmpzXCIsJ3V0Zi04J1xuXG4gIEBnZXRIb3RLZXlzOiAtPlxuICAgIGZzLnJlYWRGaWxlU3luYyBcIiN7QG1vZGVsLmJyb3dzZXJQbHVzLnJlc291cmNlc30vanF1ZXJ5LmhvdGtleXMubWluLmpzXCIsJ3V0Zi04J1xuXG4gIEBsb2FkQ1NTOiAoZmlsZW5hbWUsZnVsbHBhdGg9ZmFsc2UpLT5cbiAgICB1bmxlc3MgZnVsbHBhdGhcbiAgICAgIGZwYXRoID0gXCJmaWxlOi8vLyN7QG1vZGVsLmJyb3dzZXJQbHVzLnJlc291cmNlcy5yZXBsYWNlKC9cXFxcL2csJy8nKX1cIlxuICAgICAgZmlsZW5hbWUgPSBcIiN7ZnBhdGh9I3tmaWxlbmFtZX1cIlxuICAgIFwiXCJcIlxuICAgIGpRdWVyeSgnaGVhZCcpLmFwcGVuZChqUXVlcnkoJzxsaW5rIHR5cGU9XCJ0ZXh0L2Nzc1wiIHJlbD1cInN0eWxlc2hlZXRcIiBocmVmPVwiI3tmaWxlbmFtZX1cIj4nKSlcbiAgICBcIlwiXCJcblxuICBAbG9hZEpTOiAoZmlsZW5hbWUsZnVsbHBhdGg9ZmFsc2UpLT5cbiAgICB1bmxlc3MgZnVsbHBhdGhcbiAgICAgIGZwYXRoID0gXCJmaWxlOi8vLyN7QG1vZGVsLmJyb3dzZXJQbHVzLnJlc291cmNlcy5yZXBsYWNlKC9cXFxcL2csJy8nKX1cIlxuICAgICAgZmlsZW5hbWUgPSBcIiN7ZnBhdGh9I3tmaWxlbmFtZX1cIlxuXG4gICAgXCJcIlwiXG4gICAgalF1ZXJ5KCdoZWFkJykuYXBwZW5kKGpRdWVyeSgnPHNjcmlwdCB0eXBlPVwidGV4dC9qYXZhc2NyaXB0XCIgc3JjPVwiI3tmaWxlbmFtZX1cIj4nKSlcbiAgICBcIlwiXCJcbiJdfQ==
