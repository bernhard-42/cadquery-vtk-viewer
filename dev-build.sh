cd js/
npm run build
cd ..
rm dist/*
python setup.py bdist_wheel
pip uninstall cadquery_vtk_viewer -y
pip install dist/cadquery_vtk_viewer-0.1.0a0-py2.py3-none-any.whl
