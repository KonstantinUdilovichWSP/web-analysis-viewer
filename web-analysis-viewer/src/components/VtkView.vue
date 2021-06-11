<template>
  <div ref="container" style="background-color: blue"></div>
</template>

<script>
import { debounce } from "vtk.js/Sources/macro";
import vtkOpenGLRenderWindow from "vtk.js/Sources/Rendering/OpenGL/RenderWindow";
import vtkRenderWindow from "vtk.js/Sources/Rendering/Core/RenderWindow";
import vtkRenderWindowInteractor from "vtk.js/Sources/Rendering/Core/RenderWindowInteractor";
import vtkRenderer from "vtk.js/Sources/Rendering/Core/Renderer";
import vtkInteractorStyleManipulator from "vtk.js/Sources/Interaction/Style/InteractorStyleManipulator";

import vtkBoundingBox from "vtk.js/Sources/Common/DataModel/BoundingBox";
import vtkCubeAxesActor from "vtk.js/Sources/Rendering/Core/CubeAxesActor";

// Style modes
import vtkMouseCameraTrackballMultiRotateManipulator from "vtk.js/Sources/Interaction/Manipulators/MouseCameraTrackballMultiRotateManipulator";
import vtkMouseCameraTrackballPanManipulator from "vtk.js/Sources/Interaction/Manipulators/MouseCameraTrackballPanManipulator";
import vtkMouseCameraTrackballRollManipulator from "vtk.js/Sources/Interaction/Manipulators/MouseCameraTrackballRollManipulator";
import vtkMouseCameraTrackballRotateManipulator from "vtk.js/Sources/Interaction/Manipulators/MouseCameraTrackballRotateManipulator";
import vtkMouseCameraTrackballZoomManipulator from "vtk.js/Sources/Interaction/Manipulators/MouseCameraTrackballZoomManipulator";
import vtkMouseCameraTrackballZoomToMouseManipulator from "vtk.js/Sources/Interaction/Manipulators/MouseCameraTrackballZoomToMouseManipulator";
import vtkGestureCameraManipulator from "vtk.js/Sources/Interaction/Manipulators/GestureCameraManipulator";
import vtkMouseBoxSelectorManipulator from "vtk.js/Sources/Interaction/Manipulators/MouseBoxSelectorManipulator";

// Picking handling
import vtkOpenGLHardwareSelector from "vtk.js/Sources/Rendering/OpenGL/HardwareSelector";
import { FieldAssociations } from "vtk.js/Sources/Common/DataModel/DataSet/Constants";

import vtkActor from "vtk.js/Sources/Rendering/Core/Actor";
import vtkConeSource from "vtk.js/Sources/Filters/Sources/ConeSource";
import vtkMapper from "vtk.js/Sources/Rendering/Core/Mapper";

export default {
  name: "VtkView",

  props: {
    background: {
      type: Array,
      default: () => [0.2, 0.3, 0.4],
    },
    camera: {
      type: Object,
      default: () => {},
    },
    interactorSettings: {
      type: Array,
      default: () => [
        {
          button: 1,
          action: "Rotate",
        },
        {
          button: 2,
          action: "Pan",
        },
        {
          button: 3,
          action: "Zoom",
          scrollEnabled: true,
        },
        {
          button: 1,
          action: "Pan",
          alt: true,
        },
        {
          button: 1,
          action: "Zoom",
          control: true,
        },
        {
          button: 1,
          action: "Select",
          shift: true,
        },
        {
          button: 1,
          action: "Roll",
          alt: true,
          shift: true,
        },
      ],
    },
    pickingModes: {
      type: Array,
      default: () => [],
    },
    showCubeAxes: {
      type: Boolean,
      default: false,
    },
    cubeAxesStyle: {
      type: Object,
      default: () => ({}),
    },
  },
  methods: {
    foo: function () {
      console.log("button");
    },
    resetCamera() {
      this.renderer.resetCamera();
      // this.style.setCenterOfRotation(
      //   this.renderer.getActiveCamera().getFocalPoint()
      // );
      this.render();
    },
  },
  mounted: function () {
 

    console.log("Mounted");
    const container = this.$refs["container"];
    container.style.setProperty("background-color", "#42b983");
    // console.log(container)
 
    this.openglRenderWindow.setContainer(container);
    // this.interactor.bindEvents(container);
    // this.onResize();
    // this.resizeObserver.observe(container);
    // document.addEventListener('keyup', this.handleKey);

    const cone = vtkConeSource.newInstance();
    const actor = vtkActor.newInstance();
    const mapper = vtkMapper.newInstance();

    actor.setMapper(mapper);
    mapper.setInputConnection(cone.getOutputPort());
    this.renderer.addActor(actor);

    this.resetCamera();
this.renderWindow.render();
    // Give a chance for the first layout to properly reset the camera
    setTimeout(() => this.resetCamera(), 100);
  },
  created() {
    console.log("Created");
    const { background, interactorSettings } = this;
console.log(this.background)
    // Create vtk.js view
    this.renderWindow = vtkRenderWindow.newInstance();
    this.renderer = vtkRenderer.newInstance({ background });
    this.renderWindow.addRenderer(this.renderer);

    this.activeCamera = this.renderer.getActiveCamera();
    this.activeCamera.set(this.camera);

    // expose helper methods
    this.render = debounce(() => {
      this.renderer.resetCameraClippingRange();
      this.renderWindow.render();
    }, 1);

    // Interactor style
    // this.style = vtkInteractorStyleManipulator.newInstance();
    // this.interactor.setInteractorStyle(this.style);

    this.openglRenderWindow = vtkOpenGLRenderWindow.newInstance({
      cursor: "default",
    });
    this.renderWindow.addView(this.openglRenderWindow);


  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
.Canvas {
  background-color: #4279b9;
  height: 100%;
  color: #4279b9;
}
</style>
