<template>
  <div class="vtkView" ref="vtkContainer"></div>
</template>


<script>
import { ref, unref, onMounted, onBeforeUnmount, watchEffect } from "vue";

import "@kitware/vtk.js/Rendering/Profiles/Geometry";
import vtkFullScreenRenderWindow from "@kitware/vtk.js/Rendering/Misc/FullScreenRenderWindow";
import vtkActor from "@kitware/vtk.js/Rendering/Core/Actor";
import vtkMapper from "@kitware/vtk.js/Rendering/Core/Mapper";
import vtkConeSource from "@kitware/vtk.js/Filters/Sources/ConeSource";
import vtkWebGLRenderWindow from "@kitware/vtk.js/Rendering/OpenGL/RenderWindow";
import vtkRenderWindow from "@kitware/vtk.js/Rendering/Core/RenderWindow";
import vtkRenderWindowInteractor from "@kitware/vtk.js/Rendering/Core/RenderWindowInteractor";
import vtkRenderer from "@kitware/vtk.js/Rendering/Core/Renderer";
import vtkInteractorStyleTrackballCamera from "@kitware/vtk.js/Interaction/Style/InteractorStyleTrackballCamera";
import vtkCalculator from "@kitware/vtk.js/Filters/General/Calculator";
import vtkDataSet from "@kitware/vtk.js/Common/DataModel/DataSet";
import vtkLookupTable from "@kitware/vtk.js/Common/Core/LookupTable";
import vtkPlaneSource from "@kitware/vtk.js/Filters/Sources/PlaneSource";
import vtkPoints from "@kitware/vtk.js/Common/Core/Points";
import vtkPolyData from "@kitware/vtk.js/Common/DataModel/PolyData";
import vtkDataArray from "@kitware/vtk.js/Common/Core/DataArray";
import vtkWarpScalar from "@kitware/vtk.js/Filters/General/WarpScalar";
import vtkScalarBarActor from '@kitware/vtk.js/Rendering/Core/ScalarBarActor';
import vtkRTAnalyticSource from "@kitware/vtk.js/Filters/Sources/RTAnalyticSource";
import vtkImageSliceFilter from "@kitware/vtk.js/Filters/General/ImageSliceFilter";
import vtkScalarToRGBA from "@kitware/vtk.js/Filters/General/ScalarToRGBA";
import vtkPiecewiseFunction from "@kitware/vtk.js/Common/DataModel/PiecewiseFunction";
import vtkColorTransferFunction from "@kitware/vtk.js/Rendering/Core/ColorTransferFunction";
import vtkColorMaps from "@kitware/vtk.js/Rendering/Core/ColorTransferFunction/ColorMaps";
import Point3d from "./Point3d";
import MeshElement from "./MeshElement";

export default {
  name: "HelloWorld",
  methods: {
    createCone() {
      const fullScreenRenderer = vtkFullScreenRenderWindow.newInstance({
        rootContainer: this.$refs.vtkContainer,
      });
      //CONE EXAMPLE
      const coneSource = vtkConeSource.newInstance({ height: 1.0 });
      const mapper = vtkMapper.newInstance();
      mapper.setInputConnection(coneSource.getOutputPort());
      const actor = vtkActor.newInstance();
      actor.setMapper(mapper);

      const renderer = fullScreenRenderer.getRenderer();
      const renderWindow = fullScreenRenderer.getRenderWindow();

      renderer.addActor(actor);
      renderer.resetCamera();
      renderWindow.render();
    },
    createMesh() {
      //point coordinates
      let points = [
        new Point3d("0", 0.0, 0.0, 0),
        new Point3d("1", 0.0, 10.0, 0),
        new Point3d("2", 5.0, 10.0, 0),
        new Point3d("3", 5.0, 0.0, 0),
      ];
      //connectivity
      let triangularMesh = [
        new MeshElement("", 3, [0, 1, 2]),
        new MeshElement("", 3, [0, 2, 3]),
      ];

      const dataRange = [0, 1];
      let data = [0, 0.25, 0.3, 0.95]; //input data
      var vertexArray = [];
      var polysArray = [];
      var valuesArray = [];

      var i;

      //POINTS
      for (i = 0; i < points.length; i++) {
        let point = points[i];
        vertexArray.push(point.x, point.y, point.z);
        valuesArray.push(data[i]);
      }

      //MESH (cells)
      for (i = 0; i < triangularMesh.length; i++) {
        let cell = triangularMesh[i];
        polysArray.push(
          cell.NumberOfPoints,
          cell.PointsIndices[0],
          cell.PointsIndices[1],
          cell.PointsIndices[2]
        );
      }

      var polydata = vtkPolyData.newInstance();
      polydata.getPoints().setData(Float32Array.from(vertexArray), 3);
      polydata.getPolys().setData(Uint16Array.from(polysArray));

      const values = Float32Array.from(valuesArray);
      const filledArray = vtkDataArray.newInstance({
        name: "acceleration",
        values,
        numberOfComponents: 1,
      });
      polydata.getPointData().addArray(filledArray);

      console.log(
        polydata.getPointData().getArrayByName("acceleration").getData()
      );
      //actor
      const actor = vtkActor.newInstance();

      //configure lookup table
      const lookupTable = vtkColorTransferFunction.newInstance();
      //apply preset
      var preset = vtkColorMaps.getPresetByName("erdc_rainbow_bright");
      lookupTable.setVectorModeToComponent();
      lookupTable.setVectorComponent(0);
      lookupTable.setMappingRange(0, 1);
      lookupTable.applyColorMap(preset);
      lookupTable.updateRange();

      //mapper
      const mapper = vtkMapper.newInstance();
      mapper.setInputData(polydata);
      const { ColorMode, ScalarMode } = vtkMapper;
      mapper.set({
        colorByArrayName: "acceleration",
        colorMode: ColorMode.MAP_SCALARS,
        interpolateScalarsBeforeMapping: true,
        scalarMode: ScalarMode.USE_POINT_FIELD_DATA,
        scalarVisibility: true,
        lookupTable: lookupTable,
      });

      mapper.setScalarRange(0, 1);
      actor.setMapper(mapper);

      //edges
      actor.getProperty().setEdgeVisibility(true);

      //renderer

      const openglRenderWindow = vtkWebGLRenderWindow.newInstance();
      const container = this.$refs.vtkContainer;
      openglRenderWindow.setContainer(container);

      const renderer = vtkRenderer.newInstance();

      //https://kitware.github.io/vtk-js/examples/SimpleCone.html
      const renderWindow = vtkRenderWindow.newInstance();
      renderWindow.addRenderer(renderer);
      renderWindow.addView(openglRenderWindow);

      const { width, height } = container.getBoundingClientRect();
      openglRenderWindow.setSize(width, height);

      const interactor = vtkRenderWindowInteractor.newInstance();
      interactor.setView(openglRenderWindow);
      interactor.initialize();
      interactor.bindEvents(container);

      interactor.setInteractorStyle(
        vtkInteractorStyleTrackballCamera.newInstance()
      );

      // const fullScreenRenderer = vtkFullScreenRenderWindow.newInstance({
      //   rootContainer: this.$refs.vtkContainer,
      // });
      // const renderer = fullScreenRenderer.getRenderer();
      // const renderWindow = fullScreenRenderer.getRenderWindow();

      //color bar
      const scalarBarActor = vtkScalarBarActor.newInstance();
       scalarBarActor.setScalarsToColors(mapper.getLookupTable());
       renderer.addActor(scalarBarActor);

       scalarBarActor.setAxisLabel("acceleration");
       scalarBarActor.setVisibility(true);

      renderer.addActor(actor);
      renderer.resetCamera();
      renderWindow.render();
    },
    createPlane() {
      const fullScreenRenderer = vtkFullScreenRenderWindow.newInstance({
        rootContainer: this.$refs.vtkContainer,
      });
      //PLANE EXAMPLE
      const planeSource = vtkPlaneSource.newInstance({
        xResolution: 25,
        yResolution: 25,
      });

      const lookupTable = vtkLookupTable.newInstance({ hueRange: [0.666, 0] });
      lookupTable.setMappingRange(0.1257999986410141, 0.625);
      const { ColorMode, ScalarMode } = vtkMapper;
      const { FieldDataTypes } = vtkDataSet;

      const planeMapper = vtkMapper.newInstance({
        interpolateScalarsBeforeMapping: true,
        colorMode: ColorMode.DEFAULT,
        scalarMode: ScalarMode.DEFAULT,
        useLookupTableScalarRange: true,
        lookupTable,
      });

      const actor = vtkActor.newInstance();
      actor.getProperty().setEdgeVisibility(true);

      const simpleFilter = vtkCalculator.newInstance();
      simpleFilter.setFormulaSimple(
        FieldDataTypes.POINT, // Generate an output array defined over points.
        [], // We don't request any point-data arrays because point coordinates are made available by default.
        "z", // Name the output array "z"
        (x) => (x[0] - 0.5) * (x[0] - 0.5) + (x[1] - 0.5) * (x[1] - 0.5) + 0.125
      ); // Our formula for z

      simpleFilter.setInputConnection(planeSource.getOutputPort());
      planeMapper.setInputConnection(simpleFilter.getOutputPort());
      actor.setMapper(planeMapper);
      const renderer = fullScreenRenderer.getRenderer();
      const renderWindow = fullScreenRenderer.getRenderWindow();

      renderer.addActor(actor);
      renderer.resetCamera();
      renderWindow.render();
    },
  },

  mounted() {
    //this.createCone();
    // this.createPlane();
    this.createMesh();
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
.vtkView {
  width: 800px;
  height: 700px;
}
</style>
