(function() {
  var BreakPointPane, ConsolePane, LeftSidePane, RightSidePane, StepButton, breakpointPanel, callstackPaneModule, cancelButton, consolePaneModule, dragHandler, h, hg, logger, stepButton;

  hg = require('mercury');

  h = hg.h;

  stepButton = require('./StepButton');

  breakpointPanel = require('./BreakPointPane');

  callstackPaneModule = require('./CallStackPane');

  consolePaneModule = require('./ConsolePane');

  cancelButton = require('./CancelButton');

  dragHandler = require('./drag-handler');

  logger = require('../logger');

  StepButton = null;

  BreakPointPane = null;

  ConsolePane = null;

  LeftSidePane = function(ConsolePane, state) {
    return h('div', {
      style: {
        display: 'flex',
        flex: 'auto',
        flexDirection: 'column'
      }
    }, [ConsolePane.render(state.logger)]);
  };

  RightSidePane = function(BreakPointPane, CallStackPane, LocalsPane, WatchPane, StepButton, state) {
    return h('div', {
      style: {
        display: 'flex',
        flex: 1,
        width: (state.collapsed ? 0 : state.sideWidth) + "px",
        flexDirection: 'row'
      }
    }, [
      h('div.inset-panel', {
        style: {
          flexDirection: 'column',
          display: 'flex',
          flex: 'auto'
        }
      }, [
        h('div.debugger-panel-heading', {
          style: {
            'flex-shrink': 0
          }
        }, [h('div.btn-group', {}, [StepButton.render(state.steps.stepContinue), StepButton.render(state.steps.stepNext), StepButton.render(state.steps.stepIn), StepButton.render(state.steps.stepOut), cancelButton.render(state.cancel)])]), h('div.panel-body', {
          style: {
            flex: 'auto',
            display: 'list-item',
            overflow: 'auto'
          }
        }, [
          h('div.scroll-view', {
            style: {
              'height': '100vh'
            }
          }, [BreakPointPane.render(state.breakpoints), CallStackPane.render(state.callstack), LocalsPane.render(state.locals), WatchPane.render(state.watch)])
        ])
      ])
    ]);
  };

  exports.startBottom = function(root, _debugger) {
    var App, app, changeHeight, toggleCollapsed;
    ConsolePane = consolePaneModule.create(_debugger);
    changeHeight = function(state, data) {
      return state.height.set(data.height);
    };
    toggleCollapsed = function(state, data) {
      return state.collapsed.set(!state.collapsed());
    };
    App = function() {
      var define;
      define = {
        height: hg.value(350),
        collapsed: hg.value(false),
        channels: {
          changeHeight: changeHeight,
          toggleCollapsed: toggleCollapsed
        },
        logger: ConsolePane()
      };
      return hg.state(define);
    };
    App.render = function(state) {
      return h('div', {
        style: {
          display: 'flex',
          flex: 'auto',
          flexDirection: 'column',
          position: 'relative',
          height: (state.collapsed ? 10 : state.height) + "px"
        }
      }, [
        h('div.resizer', {
          style: {
            cursor: state.collapsed ? '' : 'ns-resize',
            display: 'flex',
            'flex-direction': 'column'
          },
          'ev-mousedown': !state.collapsed ? dragHandler(state.channels.changeHeight, {}) : void 0
        }, [
          h('div', {
            style: {
              'align-self': 'center',
              cursor: 'pointer',
              'margin-top': '-4px',
              'margin-bottom': '-2px'
            },
            'ev-click': hg.send(state.channels.toggleCollapsed),
            className: state.collapsed ? 'icon-triangle-up' : 'icon-triangle-down'
          }, [])
        ]), h('div', {
          style: {
            display: 'flex',
            flex: 'auto',
            flexDirection: 'row'
          }
        }, [LeftSidePane(ConsolePane, state)])
      ]);
    };
    app = App();
    hg.app(root, app, App.render);
    return app;
  };

  exports.startRight = function(root, _debugger) {
    var App, CallStackPane, LocalsPane, WatchPane, app, changeWidth, ref, toggleCollapsed;
    StepButton = stepButton.StepButton(_debugger);
    BreakPointPane = breakpointPanel.create(_debugger);
    ref = callstackPaneModule.create(_debugger), CallStackPane = ref.CallStackPane, LocalsPane = ref.LocalsPane, WatchPane = ref.WatchPane;
    changeWidth = function(state, data) {
      return state.sideWidth.set(data.sideWidth);
    };
    toggleCollapsed = function(state, data) {
      return state.collapsed.set(!state.collapsed());
    };
    App = function() {
      var define, stepContinue, stepIn, stepNext, stepOut;
      stepContinue = StepButton('continue', 'continue');
      stepIn = StepButton('step in', 'in');
      stepOut = StepButton('step out', 'out');
      stepNext = StepButton('step next', 'next');
      define = {
        sideWidth: hg.value(400),
        collapsed: hg.value(false),
        channels: {
          changeWidth: changeWidth,
          toggleCollapsed: toggleCollapsed
        },
        steps: {
          stepIn: stepIn,
          stepOut: stepOut,
          stepNext: stepNext,
          stepContinue: stepContinue
        },
        breakpoints: BreakPointPane(),
        callstack: CallStackPane(),
        watch: WatchPane(),
        locals: LocalsPane(),
        cancel: cancelButton.create(_debugger)
      };
      return hg.state(define);
    };
    App.render = function(state) {
      return h('div', {
        style: {
          display: 'flex',
          flexDirection: 'row',
          'justify-content': 'center'
        }
      }, [
        h('div.resizer', {
          style: {
            display: 'flex',
            cursor: state.collapsed ? '' : 'ew-resize'
          },
          'ev-mousedown': !state.collapsed ? dragHandler(state.channels.changeWidth, {}) : void 0
        }, [
          h('div', {
            style: {
              'align-self': 'center',
              cursor: 'pointer',
              'margin-left': '0px',
              'margin-right': '-4px'
            },
            'ev-click': hg.send(state.channels.toggleCollapsed),
            className: state.collapsed ? 'icon-triangle-left' : 'icon-triangle-right'
          }, [])
        ]), RightSidePane(BreakPointPane, CallStackPane, LocalsPane, WatchPane, StepButton, state)
      ]);
    };
    app = App();
    hg.app(root, app, App.render);
    return app;
  };

  exports.stop = function() {
    BreakPointPane.cleanup();
    callstackPaneModule.cleanup();
    return ConsolePane.cleanup();
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL2V2YW5oZW5kcml4MS8uYXRvbS9wYWNrYWdlcy9ub2RlLWRlYnVnZ2VyL2xpYi9Db21wb25lbnRzL0FwcC5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFBQSxNQUFBOztFQUFBLEVBQUEsR0FBSyxPQUFBLENBQVEsU0FBUjs7RUFDTCxDQUFBLEdBQUksRUFBRSxDQUFDOztFQUVQLFVBQUEsR0FBYSxPQUFBLENBQVEsY0FBUjs7RUFDYixlQUFBLEdBQWtCLE9BQUEsQ0FBUSxrQkFBUjs7RUFDbEIsbUJBQUEsR0FBc0IsT0FBQSxDQUFRLGlCQUFSOztFQUN0QixpQkFBQSxHQUFvQixPQUFBLENBQVEsZUFBUjs7RUFDcEIsWUFBQSxHQUFlLE9BQUEsQ0FBUSxnQkFBUjs7RUFDZixXQUFBLEdBQWMsT0FBQSxDQUFRLGdCQUFSOztFQUNkLE1BQUEsR0FBUyxPQUFBLENBQVEsV0FBUjs7RUFFVCxVQUFBLEdBQWE7O0VBQ2IsY0FBQSxHQUFpQjs7RUFDakIsV0FBQSxHQUFjOztFQUVkLFlBQUEsR0FBZSxTQUFDLFdBQUQsRUFBYyxLQUFkO1dBQ2IsQ0FBQSxDQUFFLEtBQUYsRUFBUztNQUNQLEtBQUEsRUFBTztRQUNMLE9BQUEsRUFBUyxNQURKO1FBRUwsSUFBQSxFQUFNLE1BRkQ7UUFHTCxhQUFBLEVBQWUsUUFIVjtPQURBO0tBQVQsRUFNRyxDQUNELFdBQVcsQ0FBQyxNQUFaLENBQW1CLEtBQUssQ0FBQyxNQUF6QixDQURDLENBTkg7RUFEYTs7RUFXZixhQUFBLEdBQWdCLFNBQUMsY0FBRCxFQUFpQixhQUFqQixFQUFnQyxVQUFoQyxFQUE0QyxTQUE1QyxFQUF1RCxVQUF2RCxFQUFtRSxLQUFuRTtXQUNkLENBQUEsQ0FBRSxLQUFGLEVBQVM7TUFDUCxLQUFBLEVBQU87UUFDTCxPQUFBLEVBQVMsTUFESjtRQUVMLElBQUEsRUFBTSxDQUZEO1FBR0wsS0FBQSxFQUFTLENBQUksS0FB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OEIsYUFBOUIsRUFBNkMsVUFBN0MsRUFBeUQsU0FBekQsRUFBb0UsVUFBcEUsRUFBZ0YsS0FBaEYsQ0FuQkM7T0FOSDtJQURXO0lBNkJiLEdBQUEsR0FBTSxHQUFBLENBQUE7SUFDTixFQUFFLENBQUMsR0FBSCxDQUFPLElBQVAsRUFBYSxHQUFiLEVBQWtCLEdBQUcsQ0FBQyxNQUF0QjtXQUNBO0VBckVtQjs7RUF1RXJCLE9BQU8sQ0FBQyxJQUFSLEdBQWUsU0FBQTtJQUNiLGNBQWMsQ0FBQyxPQUFmLENBQUE7SUFDQSxtQkFBbUIsQ0FBQyxPQUFwQixDQUFBO1dBQ0EsV0FBVyxDQUFDLE9BQVosQ0FBQTtFQUhhO0FBcE5mIiwic291cmNlc0NvbnRlbnQiOlsiaGcgPSByZXF1aXJlICdtZXJjdXJ5J1xuaCA9IGhnLmhcblxuc3RlcEJ1dHRvbiA9IHJlcXVpcmUgJy4vU3RlcEJ1dHRvbidcbmJyZWFrcG9pbnRQYW5lbCA9IHJlcXVpcmUgJy4vQnJlYWtQb2ludFBhbmUnXG5jYWxsc3RhY2tQYW5lTW9kdWxlID0gcmVxdWlyZSAnLi9DYWxsU3RhY2tQYW5lJ1xuY29uc29sZVBhbmVNb2R1bGUgPSByZXF1aXJlICcuL0NvbnNvbGVQYW5lJ1xuY2FuY2VsQnV0dG9uID0gcmVxdWlyZSAnLi9DYW5jZWxCdXR0b24nXG5kcmFnSGFuZGxlciA9IHJlcXVpcmUgJy4vZHJhZy1oYW5kbGVyJ1xubG9nZ2VyID0gcmVxdWlyZSAnLi4vbG9nZ2VyJ1xuXG5TdGVwQnV0dG9uID0gbnVsbFxuQnJlYWtQb2ludFBhbmUgPSBudWxsXG5Db25zb2xlUGFuZSA9IG51bGxcblxuTGVmdFNpZGVQYW5lID0gKENvbnNvbGVQYW5lLCBzdGF0ZSkgLT5cbiAgaCgnZGl2Jywge1xuICAgIHN0eWxlOiB7XG4gICAgICBkaXNwbGF5OiAnZmxleCdcbiAgICAgIGZsZXg6ICdhdXRvJ1xuICAgICAgZmxleERpcmVjdGlvbjogJ2NvbHVtbidcbiAgICB9XG4gIH0sIFtcbiAgICBDb25zb2xlUGFuZS5yZW5kZXIoc3RhdGUubG9nZ2VyKVxuICBdKVxuXG5SaWdodFNpZGVQYW5lID0gKEJyZWFrUG9pbnRQYW5lLCBDYWxsU3RhY2tQYW5lLCBMb2NhbHNQYW5lLCBXYXRjaFBhbmUsIFN0ZXBCdXR0b24sIHN0YXRlKSAtPlxuICBoKCdkaXYnLCB7XG4gICAgc3R5bGU6IHtcbiAgICAgIGRpc3BsYXk6ICdmbGV4J1xuICAgICAgZmxleDogMVxuICAgICAgd2lkdGg6IFwiI3tpZiBzdGF0ZS5jb2xsYXBzZWQgdGhlbiAwIGVsc2Ugc3RhdGUuc2lkZVdpZHRofXB4XCJcbiAgICAgIGZsZXhEaXJlY3Rpb246ICdyb3cnXG4gICAgfVxuICB9LCBbXG4gICAgaCgnZGl2Lmluc2V0LXBhbmVsJywge1xuICAgICAgc3R5bGU6IHtcbiAgICAgICAgZmxleERpcmVjdGlvbjogJ2NvbHVtbidcbiAgICAgICAgZGlzcGxheTogJ2ZsZXgnXG4gICAgICAgIGZsZXg6ICdhdXRvJ1xuICAgICAgfVxuICAgIH0sIFtcbiAgICAgIGgoJ2Rpdi5kZWJ1Z2dlci1wYW5lbC1oZWFkaW5nJywge1xuICAgICAgICBzdHlsZToge1xuICAgICAgICAgICdmbGV4LXNocmluayc6IDBcbiAgICAgICAgfVxuICAgICAgfSwgW1xuICAgICAgICBoKCdkaXYuYnRuLWdyb3VwJywge30sIFtcbiAgICAgICAgICBTdGVwQnV0dG9uLnJlbmRlcihzdGF0ZS5zdGVwcy5zdGVwQ29udGludWUpXG4gICAgICAgICAgU3RlcEJ1dHRvbi5yZW5kZXIoc3RhdGUuc3RlcHMuc3RlcE5leHQpXG4gICAgICAgICAgU3RlcEJ1dHRvbi5yZW5kZXIoc3RhdGUuc3RlcHMuc3RlcEluKVxuICAgICAgICAgIFN0ZXBCdXR0b24ucmVuZGVyKHN0YXRlLnN0ZXBzLnN0ZXBPdXQpXG4gICAgICAgICAgY2FuY2VsQnV0dG9uLnJlbmRlcihzdGF0ZS5jYW5jZWwpXG4gICAgICAgIF0pXG4gICAgICBdKVxuICAgICAgaCgnZGl2LnBhbmVsLWJvZHknLCB7XG4gICAgICAgIHN0eWxlOiB7XG4gICAgICAgICAgZmxleDogJ2F1dG8nXG4gICAgICAgICAgZGlzcGxheTogJ2xpc3QtaXRlbSdcbiAgICAgICAgICBvdmVyZmxvdzogJ2F1dG8nO1xuICAgICAgICB9XG4gICAgICB9LCBbXG4gICAgICAgIGgoJ2Rpdi5zY3JvbGwtdmlldycsIHtcbiAgICAgICAgICBzdHlsZTp7XG4gICAgICAgICAgICAnaGVpZ2h0JzogJzEwMHZoJ1xuICAgICAgICAgIH1cbiAgICAgICAgfSwgW1xuICAgICAgICAgIEJyZWFrUG9pbnRQYW5lLnJlbmRlcihzdGF0ZS5icmVha3BvaW50cylcbiAgICAgICAgICBDYWxsU3RhY2tQYW5lLnJlbmRlcihzdGF0ZS5jYWxsc3RhY2spXG4gICAgICAgICAgTG9jYWxzUGFuZS5yZW5kZXIoc3RhdGUubG9jYWxzKVxuICAgICAgICAgIFdhdGNoUGFuZS5yZW5kZXIoc3RhdGUud2F0Y2gpXG4gICAgICAgIF0pXG4gICAgICBdKVxuICAgIF0pXG4gIF0pXG5cbmV4cG9ydHMuc3RhcnRCb3R0b20gPSAocm9vdCwgX2RlYnVnZ2VyKSAtPlxuICBDb25zb2xlUGFuZSA9IGNvbnNvbGVQYW5lTW9kdWxlLmNyZWF0ZShfZGVidWdnZXIpXG5cbiAgY2hhbmdlSGVpZ2h0ID0gKHN0YXRlLCBkYXRhKSAtPlxuICAgIHN0YXRlLmhlaWdodC5zZXQoZGF0YS5oZWlnaHQpXG5cbiAgdG9nZ2xlQ29sbGFwc2VkID0gKHN0YXRlLCBkYXRhKSAtPlxuICAgIHN0YXRlLmNvbGxhcHNlZC5zZXQoIXN0YXRlLmNvbGxhcHNlZCgpKVxuXG4gIEFwcCA9IC0+XG4gICAgZGVmaW5lID0ge1xuICAgICAgaGVpZ2h0OiBoZy52YWx1ZSAzNTBcbiAgICAgIGNvbGxhcHNlZDogaGcudmFsdWUgZmFsc2VcbiAgICAgIGNoYW5uZWxzOiB7XG4gICAgICAgIGNoYW5nZUhlaWdodDogY2hhbmdlSGVpZ2h0XG4gICAgICAgIHRvZ2dsZUNvbGxhcHNlZDogdG9nZ2xlQ29sbGFwc2VkXG4gICAgICB9XG4gICAgICBsb2dnZXI6IENvbnNvbGVQYW5lKClcbiAgICB9XG4gICAgaGcuc3RhdGUoZGVmaW5lKVxuXG4gIEFwcC5yZW5kZXIgPSAoc3RhdGUpIC0+XG4gICAgaCgnZGl2Jywge1xuICAgICAgc3R5bGU6IHtcbiAgICAgICAgZGlzcGxheTogJ2ZsZXgnXG4gICAgICAgIGZsZXg6ICdhdXRvJ1xuICAgICAgICBmbGV4RGlyZWN0aW9uOiAnY29sdW1uJ1xuICAgICAgICBwb3NpdGlvbjogJ3JlbGF0aXZlJ1xuICAgICAgICBoZWlnaHQ6IFwiI3tpZiBzdGF0ZS5jb2xsYXBzZWQgdGhlbiAxMCBlbHNlIHN0YXRlLmhlaWdodH1weFwiXG4gICAgICB9XG4gICAgfSwgW1xuICAgICAgaCgnZGl2LnJlc2l6ZXInLCB7XG4gICAgICAgIHN0eWxlOlxuICAgICAgICAgIGN1cnNvcjogaWYgc3RhdGUuY29sbGFwc2VkIHRoZW4gJycgZWxzZSAnbnMtcmVzaXplJ1xuICAgICAgICAgIGRpc3BsYXk6ICdmbGV4J1xuICAgICAgICAgICdmbGV4LWRpcmVjdGlvbic6ICdjb2x1bW4nXG4gICAgICAgICdldi1tb3VzZWRvd24nOiB1bmxlc3Mgc3RhdGUuY29sbGFwc2VkIHRoZW4gZHJhZ0hhbmRsZXIgc3RhdGUuY2hhbm5lbHMuY2hhbmdlSGVpZ2h0LCB7fVxuICAgICAgfSwgW1xuICAgICAgICBoKCdkaXYnLCB7XG4gICAgICAgICAgICBzdHlsZToge1xuICAgICAgICAgICAgICAnYWxpZ24tc2VsZic6ICdjZW50ZXInXG4gICAgICAgICAgICAgIGN1cnNvcjogJ3BvaW50ZXInXG4gICAgICAgICAgICAgICdtYXJnaW4tdG9wJzogJy00cHgnXG4gICAgICAgICAgICAgICdtYXJnaW4tYm90dG9tJzonLTJweCdcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgICdldi1jbGljayc6IGhnLnNlbmQgc3RhdGUuY2hhbm5lbHMudG9nZ2xlQ29sbGFwc2VkXG4gICAgICAgICAgICBjbGFzc05hbWU6IGlmIHN0YXRlLmNvbGxhcHNlZCB0aGVuICdpY29uLXRyaWFuZ2xlLXVwJyBlbHNlICdpY29uLXRyaWFuZ2xlLWRvd24nXG4gICAgICAgICAgfSwgW1xuICAgICAgICBdKVxuICAgICAgXSlcbiAgICAgIGgoJ2RpdicsIHtcbiAgICAgICAgc3R5bGU6IHtcbiAgICAgICAgICBkaXNwbGF5OiAnZmxleCdcbiAgICAgICAgICBmbGV4OiAnYXV0bydcbiAgICAgICAgICBmbGV4RGlyZWN0aW9uOiAncm93J1xuICAgICAgICB9XG4gICAgICB9LCBbXG4gICAgICAgIExlZnRTaWRlUGFuZShDb25zb2xlUGFuZSwgc3RhdGUpXG4gICAgICBdKVxuICAgIF0pXG5cbiAgYXBwID0gQXBwKClcbiAgaGcuYXBwKHJvb3QsIGFwcCwgQXBwLnJlbmRlcilcbiAgYXBwXG5cbmV4cG9ydHMuc3RhcnRSaWdodCA9IChyb290LCBfZGVidWdnZXIpIC0+XG4gIFN0ZXBCdXR0b24gPSBzdGVwQnV0dG9uLlN0ZXBCdXR0b24oX2RlYnVnZ2VyKVxuICBCcmVha1BvaW50UGFuZSA9IGJyZWFrcG9pbnRQYW5lbC5jcmVhdGUoX2RlYnVnZ2VyKVxuICB7Q2FsbFN0YWNrUGFuZSwgTG9jYWxzUGFuZSwgV2F0Y2hQYW5lfSA9IGNhbGxzdGFja1BhbmVNb2R1bGUuY3JlYXRlKF9kZWJ1Z2dlcilcblxuICBjaGFuZ2VXaWR0aCA9IChzdGF0ZSwgZGF0YSkgLT5cbiAgICBzdGF0ZS5zaWRlV2lkdGguc2V0KGRhdGEuc2lkZVdpZHRoKVxuXG4gIHRvZ2dsZUNvbGxhcHNlZCA9IChzdGF0ZSwgZGF0YSkgLT5cbiAgICBzdGF0ZS5jb2xsYXBzZWQuc2V0KCFzdGF0ZS5jb2xsYXBzZWQoKSlcblxuICBBcHAgPSAtPlxuICAgIHN0ZXBDb250aW51ZSA9IFN0ZXBCdXR0b24oJ2NvbnRpbnVlJywgJ2NvbnRpbnVlJylcbiAgICBzdGVwSW4gPSBTdGVwQnV0dG9uKCdzdGVwIGluJywgJ2luJylcbiAgICBzdGVwT3V0ID0gU3RlcEJ1dHRvbignc3RlcCBvdXQnLCAnb3V0JylcbiAgICBzdGVwTmV4dCA9IFN0ZXBCdXR0b24oJ3N0ZXAgbmV4dCcsICduZXh0JylcblxuICAgIGRlZmluZSA9IHtcbiAgICAgIHNpZGVXaWR0aDogaGcudmFsdWUgNDAwXG4gICAgICBjb2xsYXBzZWQ6IGhnLnZhbHVlIGZhbHNlXG4gICAgICBjaGFubmVsczoge1xuICAgICAgICBjaGFuZ2VXaWR0aDogY2hhbmdlV2lkdGhcbiAgICAgICAgdG9nZ2xlQ29sbGFwc2VkOiB0b2dnbGVDb2xsYXBzZWRcbiAgICAgIH1cbiAgICAgIHN0ZXBzOiB7XG4gICAgICAgIHN0ZXBJbjogc3RlcEluXG4gICAgICAgIHN0ZXBPdXQ6IHN0ZXBPdXRcbiAgICAgICAgc3RlcE5leHQ6IHN0ZXBOZXh0XG4gICAgICAgIHN0ZXBDb250aW51ZTogc3RlcENvbnRpbnVlXG4gICAgICB9XG4gICAgICBicmVha3BvaW50czogQnJlYWtQb2ludFBhbmUoKVxuICAgICAgY2FsbHN0YWNrOiBDYWxsU3RhY2tQYW5lKClcbiAgICAgIHdhdGNoOiBXYXRjaFBhbmUoKVxuICAgICAgbG9jYWxzOiBMb2NhbHNQYW5lKClcbiAgICAgIGNhbmNlbDogY2FuY2VsQnV0dG9uLmNyZWF0ZShfZGVidWdnZXIpXG4gICAgfVxuICAgIGhnLnN0YXRlKGRlZmluZSlcblxuICBBcHAucmVuZGVyID0gKHN0YXRlKSAtPlxuICAgIGgoJ2RpdicsIHtcbiAgICAgIHN0eWxlOiB7XG4gICAgICAgIGRpc3BsYXk6ICdmbGV4J1xuICAgICAgICBmbGV4RGlyZWN0aW9uOiAncm93J1xuICAgICAgICAnanVzdGlmeS1jb250ZW50JzogJ2NlbnRlcidcbiAgICAgIH1cbiAgICB9LCBbXG4gICAgICBoKCdkaXYucmVzaXplcicsIHtcbiAgICAgICAgc3R5bGU6XG4gICAgICAgICAgZGlzcGxheTogJ2ZsZXgnXG4gICAgICAgICAgY3Vyc29yOiBpZiBzdGF0ZS5jb2xsYXBzZWQgdGhlbiAnJyBlbHNlICdldy1yZXNpemUnXG4gICAgICAgICdldi1tb3VzZWRvd24nOiB1bmxlc3Mgc3RhdGUuY29sbGFwc2VkIHRoZW4gZHJhZ0hhbmRsZXIgc3RhdGUuY2hhbm5lbHMuY2hhbmdlV2lkdGgsIHt9XG4gICAgICB9LCBbXG4gICAgICAgIGgoJ2RpdicsIHtcbiAgICAgICAgICAgIHN0eWxlOiB7XG4gICAgICAgICAgICAgICdhbGlnbi1zZWxmJzogJ2NlbnRlcidcbiAgICAgICAgICAgICAgY3Vyc29yOiAncG9pbnRlcidcbiAgICAgICAgICAgICAgJ21hcmdpbi1sZWZ0JzogJzBweCdcbiAgICAgICAgICAgICAgJ21hcmdpbi1yaWdodCc6Jy00cHgnXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAnZXYtY2xpY2snOiBoZy5zZW5kIHN0YXRlLmNoYW5uZWxzLnRvZ2dsZUNvbGxhcHNlZFxuICAgICAgICAgICAgY2xhc3NOYW1lOiBpZiBzdGF0ZS5jb2xsYXBzZWQgdGhlbiAnaWNvbi10cmlhbmdsZS1sZWZ0JyBlbHNlICdpY29uLXRyaWFuZ2xlLXJpZ2h0J1xuICAgICAgICAgIH0sIFtcbiAgICAgICAgXSlcbiAgICAgIF0pXG4gICAgICBSaWdodFNpZGVQYW5lKEJyZWFrUG9pbnRQYW5lLCBDYWxsU3RhY2tQYW5lLCBMb2NhbHNQYW5lLCBXYXRjaFBhbmUsIFN0ZXBCdXR0b24sIHN0YXRlKVxuICAgIF0pXG5cbiAgYXBwID0gQXBwKClcbiAgaGcuYXBwKHJvb3QsIGFwcCwgQXBwLnJlbmRlcilcbiAgYXBwXG5cbmV4cG9ydHMuc3RvcCA9IC0+XG4gIEJyZWFrUG9pbnRQYW5lLmNsZWFudXAoKVxuICBjYWxsc3RhY2tQYW5lTW9kdWxlLmNsZWFudXAoKVxuICBDb25zb2xlUGFuZS5jbGVhbnVwKClcbiJdfQ==