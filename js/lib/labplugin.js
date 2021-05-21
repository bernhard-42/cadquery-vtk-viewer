var plugin = require('./index');
var base = require('@jupyter-widgets/base');

module.exports = {
  id: 'cadquery-vtk-viewer:plugin',
  requires: [base.IJupyterWidgetRegistry],
  activate: function(app, widgets) {
      widgets.registerWidget({
          name: 'cadquery-vtk-viewer',
          version: plugin.version,
          exports: plugin
      });
      console.log('cadquery-vtk-viewer activated')
  },
  autoStart: true
};

