cadquery-vtk-viewer
===============================

A VTK Viewer for CadQuery in Jupyter

Installation
------------

To install use pip:

    $ pip install cadquery_vtk_viewer

For a development installation (requires [Node.js](https://nodejs.org) and [Yarn version 1](https://classic.yarnpkg.com/)),

    $ git clone https://github.com/bernhard-42/cadquery-vtk-viewer.git
    $ cd cadquery-vtk-viewer
    $ pip install -e .
    $ jupyter nbextension install --py --symlink --overwrite --sys-prefix cadquery_vtk_viewer
    $ jupyter nbextension enable --py --sys-prefix cadquery_vtk_viewer

When actively developing your extension for JupyterLab, run the command:

    $ jupyter labextension develop --overwrite cadquery_vtk_viewer

Then you need to rebuild the JS when you make a code change:

    $ cd js
    $ yarn run build

You then need to refresh the JupyterLab page when your javascript changes.
