import json
import ipywidgets as widgets
from traitlets import Unicode, Integer, List, Dict

# See js/lib/viewer.js for the frontend counterpart to this file.


@widgets.register
class VTKViewer(widgets.DOMWidget):
    """VTK viewer widget."""

    # Name of the widget view class in front-end
    _view_name = Unicode("VtkViewerView").tag(sync=True)

    # Name of the widget model class in front-end
    _model_name = Unicode("VtkViewerModel").tag(sync=True)

    # Name of the front-end module containing widget view
    _view_module = Unicode("cadquery-vtk-viewer").tag(sync=True)

    # Name of the front-end module containing widget model
    _model_module = Unicode("cadquery-vtk-viewer").tag(sync=True)

    # Version of the front-end module containing widget view
    _view_module_version = Unicode("^0.1.0").tag(sync=True)
    # Version of the front-end module containing widget model
    _model_module_version = Unicode("^0.1.0").tag(sync=True)

    # Widget specific property.
    # Widget properties are defined as traitlets. Any property tagged with `sync=True`
    # is automatically synced to the frontend *any* time it changes in Python.
    # It is synced back to Python from the frontend *any* time the model is touched.
    data = List(Dict(None, allow_none=True)).tag(sync=True)
    width = Integer(1000).tag(sync=True)
    height = Integer(800).tag(sync=True)

    def __init__(self, data, width=1000, height=800, **kwargs):
        super().__init__(**kwargs)
        self.data = data
        self.width = width
        self.height = height
