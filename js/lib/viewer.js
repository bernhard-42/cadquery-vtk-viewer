import {DOMWidgetModel, DOMWidgetView} from '@jupyter-widgets/base';
import {extend} from 'lodash';

import vtkRenderer from '@kitware/vtk.js/Rendering/Core/Renderer'
import vtkRenderWindow from '@kitware/vtk.js/Rendering/Core/RenderWindow'
import OpenGL from '@kitware/vtk.js/Rendering/OpenGL';
import vtkMapper from '@kitware/vtk.js/Rendering/Core/Mapper'
import vtkActor from '@kitware/vtk.js/Rendering/Core/Actor'
import vtkRenderWindowInteractor from '@kitware/vtk.js/Rendering/Core/RenderWindowInteractor'
import vtkAnnotatedCubeActor from '@kitware/vtk.js/Rendering/Core/AnnotatedCubeActor'
import vtkXMLPolyDataReader from '@kitware/vtk.js/IO/XML/XMLPolyDataReader';
import vtkOrientationMarkerWidget from '@kitware/vtk.js/Interaction/Widgets/OrientationMarkerWidget';
import vtkInteractorStyleManipulator from '@kitware/vtk.js/Interaction/Style/InteractorStyleManipulator';
import vtkMouseCameraTrackballRotateManipulator from '@kitware/vtk.js/Interaction/Manipulators/MouseCameraTrackballRotateManipulator'
import vtkMouseCameraTrackballPanManipulator from '@kitware/vtk.js/Interaction/Manipulators/MouseCameraTrackballPanManipulator'
import vtkMouseCameraTrackballZoomManipulator from '@kitware/vtk.js/Interaction/Manipulators/MouseCameraTrackballZoomManipulator'
import vtkMouseCameraTrackballRollManipulator from '@kitware/vtk.js/Interaction/Manipulators/MouseCameraTrackballRollManipulator'
// import vtkOpenGLRenderWindow from '@kitware/vtk.js/Rendering/OpenGL/RenderWindow';

// When serialiazing the entire widget state for embedding, only values that
// differ from the defaults will be specified.
export var VtkViewerModel = DOMWidgetModel.extend({
    defaults: extend(DOMWidgetModel.prototype.defaults(), {
        _model_name : 'VtkViewerModel',
        _view_name : 'VtkViewerView',
        _model_module : 'cadquery-vtk-viewer',
        _view_module : 'cadquery-vtk-viewer',
        _model_module_version : '0.1.0',
        _view_module_version : '0.1.0',
        data : null,
        width: null,
        height: null
    }),
});

// Custom View. Renders the widget model.
export var VtkViewerView = DOMWidgetView.extend({
    // Defines how the widget gets rendered into the DOM
    render: function() {
        this.value_changed();
        console.debug("data", this.data)

        // Initial setup
        const renderWindow = vtkRenderWindow.newInstance();
        const renderer = vtkRenderer.newInstance({ background: [1, 1, 1 ] });
        renderWindow.addRenderer(renderer);
        // iterate over all children children
        this.data.forEach(
            function(el){
                var trans = el.position;
                var rot = el.orientation;
                var rgba = el.color;
                var shape = el.shape;
                
                // load the inline data
                var reader = vtkXMLPolyDataReader.newInstance();
                const textEncoder = new TextEncoder();
                reader.parseAsArrayBuffer(textEncoder.encode(shape));
                // setup actor,mapper and add
                const mapper = vtkMapper.newInstance();
                mapper.setInputConnection(reader.getOutputPort());
                const actor = vtkActor.newInstance();
                actor.setMapper(mapper);
                // set color and position
                actor.getProperty().setColor(rgba.slice(0,3));
                actor.getProperty().setOpacity(rgba[3]);
                
                actor.rotateZ(rot[2]*180/3.1416);
                actor.rotateY(rot[1]*180/3.1416);
                actor.rotateX(rot[0]*180/3.1416);
                
                actor.setPosition(trans);
                renderer.addActor(actor);
            }
        );
        
        renderer.resetCamera();
        
        const openglRenderWindow = OpenGL.vtkRenderWindow.newInstance();
        renderWindow.addView(openglRenderWindow);
        
        // Add output to the "element"
        const container = document.createElement('div');
        this.el.appendChild(container);
        
        openglRenderWindow.setContainer(container);
        openglRenderWindow.setSize(this.width, this.height);
        // TODO: Is there a nice way to prevent canvas element from getting "width=100%"?
        openglRenderWindow.getCanvas().style["width"] = this.width + "px";

        // Interaction setup
        const interact_style = vtkInteractorStyleManipulator.newInstance();
        const manips = {
            rot: vtkMouseCameraTrackballRotateManipulator.newInstance(),
            pan: vtkMouseCameraTrackballPanManipulator.newInstance(),
            zoom1: vtkMouseCameraTrackballZoomManipulator.newInstance(),
            zoom2: vtkMouseCameraTrackballZoomManipulator.newInstance(),
            roll: vtkMouseCameraTrackballRollManipulator.newInstance(),
        };
        manips.zoom1.setControl(true);
        manips.zoom2.setScrollEnabled(true);
        manips.roll.setShift(true);
        manips.pan.setButton(2);
        for (var k in manips){
            interact_style.addMouseManipulator(manips[k]);
        };
        const interactor = vtkRenderWindowInteractor.newInstance();
        interactor.setView(openglRenderWindow);
        interactor.initialize();
        interactor.bindEvents(container);
        interactor.setInteractorStyle(interact_style);
        
        // Orientation marker
        const axes = vtkAnnotatedCubeActor.newInstance();
        axes.setXPlusFaceProperty({text: '+X'});
        axes.setXMinusFaceProperty({text: '-X'});
        axes.setYPlusFaceProperty({text: '+Y'});
        axes.setYMinusFaceProperty({text: '-Y'});
        axes.setZPlusFaceProperty({text: '+Z'});
        axes.setZMinusFaceProperty({text: '-Z'});
        const orientationWidget = vtkOrientationMarkerWidget.newInstance({
            actor: axes,
            interactor: interactor });
        orientationWidget.setEnabled(true);
        orientationWidget.setViewportCorner(vtkOrientationMarkerWidget.Corners.BOTTOM_LEFT);
        orientationWidget.setViewportSize(0.2);

        // Observe changes in the value traitlet in Python, and define
        // a custom callback.
        this.model.on('change:value', this.value_changed, this);
    },

    value_changed: function() {
        this.data = this.model.get('data')
        this.width = this.model.get('width');
        this.height = this.model.get('height');
    }
});

