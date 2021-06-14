import { ViewChild, ElementRef, Component } from '@angular/core';
import vtkFullScreenRenderWindow from 'vtk.js/Sources/Rendering/Misc/FullScreenRenderWindow';
import vtkConeSource from 'vtk.js/Sources/Filters/Sources/ConeSource';
import vtkActor from 'vtk.js/Sources/Rendering/Core/Actor';
import vtkMapper from 'vtk.js/Sources/Rendering/Core/Mapper';
import vtkPolyData from 'vtk.js/Sources/Common/DataModel/PolyData';
import vtkCalculator from 'vtk.js/Sources/Filters/General/Calculator';
import vtkDataSet from 'vtk.js/Sources/Common/DataModel/DataSet';
import vtkLookupTable from 'vtk.js/Sources/Common/Core/LookupTable';
import vtkPlaneSource from 'vtk.js/Sources/Filters/Sources/PlaneSource';
import vtkPoints from 'vtk.js/Sources/Common/Core/Points';
import vtkWarpScalar from 'vtk.js/Sources/Filters/General/WarpScalar';
import vtkColorTransferFunction from 'vtk.js/Sources/Rendering/Core'
import vtkDataArray from 'vtk.js/Sources/Common/Core'
import vtkCellArray from 'vtk.js/Sources/Common/Core'
import vtkColorMaps from 'vtk.js/Sources/Rendering/Core/ColorTransferFunction/ColorMaps';

import { Point3d } from './point3d';
import { MeshCell } from './meshCell';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'VtkAngular';

  @ViewChild('content', { read: ElementRef }) content: ElementRef;

  fullscreenRenderWindow = null;

  ngAfterViewInit(): void 
  {
    //main entry point
    //this.createConeExample();
    //this.createPlaneExample();
    this.createPolyData();
  }

  createPolyData() {


    let points: Point3d[] =
    [
      new Point3d('0', 0.0,0.0 ,0),
      new Point3d('1', 0.0,10.0,0),
      new Point3d('2', 5.0,10.0,0),
      new Point3d('3', 5.0,0.0 ,0),
    ]
    ;


    let triangularMesh: MeshCell[] = [
      new MeshCell("", 3, [0, 1, 2]),
      new MeshCell("", 3, [0, 2, 3]),
    ]


    this.fullscreenRenderWindow = vtkFullScreenRenderWindow.newInstance({
      background: [0.9, 0.9, 0.9],
    });

    const renderer = this.fullscreenRenderWindow.getRenderer();

    var vertexArray = [];
    var polysArray = [];
    var valuesArray=[];


    for (var point of points) {
      vertexArray.push(point.x, point.y, point.z);
    }
    for (var cell of triangularMesh) {
      polysArray.push(cell.NumberOfPoints, cell.PointsIds[0], cell.PointsIds[1], cell.PointsIds[2]);
      valuesArray.push(Math.random() * 10);
    }

    console.log(vertexArray);
    console.log(polysArray);

     var polydata = vtkPolyData.newInstance();

    // let lookupTable = vtkColorTransferFunction.newInstance();
    // lookupTable.setVectorModeToMagnitude();
    // const preset = vtkColorMaps.getPresetByName('erdc_rainbow_bright');
    // lookupTable.applyColorMap(preset);
    // lookupTable.setMappingRange(0,1);
    // lookupTable.updateRange();

    // let mapper = vtkMapper.newInstance({});
    // mapper.setInputData(polydata);
    // mapper.setLookupTable(lookupTable);
    // //mapper.setColorByArrayName(arrayName);
    // mapper.setColorModeToDirectScalars();
    // mapper.setColorModeToMapScalars();
    // mapper.setInterpolateScalarsBeforeMapping();
    // mapper.setScalarModeToUsePointFieldData();
    // mapper.setScalarVisibility(true);
    // mapper.setScalarRange(0,1);
    
    // const meshActor = vtkActor.newInstance();
    // meshActor.setMapper(mapper);
    //AAAAAAAAAA
    //==========================================================================
     polydata.getPoints().setData(Float32Array.from(vertexArray), 3);
     polydata.getPolys().setData(Uint16Array.from(polysArray));
    // polydata.getCellData().setScalars( vtkDataArray.newInstance({
    //   name: 'var1',
    //   values: Float32Array.from(valuesArray)
    // }));
    // const triangles = vtkCellArray.newInstance({ values: Uint16Array.from(cellArray) });
    // console.log('Nb of points: ', polydata.getPoints().getData().length);
    // console.log('Nb of cells: ', polydata.getCellData().getScalars().getData().length);

    // polydata.getCellData().setScalars(vtk.Common.Core.vtkDataArray.newInstance({
    //   name: 'var1',
    //   values: Float32Array.from(valuesArray1)
    // }));


    //const meshActor = vtkActor.newInstance();
    // const mapper = vtkMapper.newInstance();
    // mapper.setInputData(polydata);

    // var lookup = vtkColorTransferFunction.newInstance();
    // lookup.addRGBPoint(0, 1.0, 0.0, 1.0); //red
    // lookup.addRGBPoint(1, 1.0, 1.0, 1.0); //white
    // lookup.addRGBPoint(2, 0.0, 1.0, 0.0); //green
    // lookup.build();
    
    // mapper.setLookupTable(lookup);
    // mapper.setScalarRange(0, 10);
    // meshActor.getProperty().setAmbient(1);
    // meshActor.getProperty().setDiffuse(0);
    // meshActor.setMapper(mapper);

    //=========================================================
    //VVVVVV
   const polygonmapper = vtkMapper.newInstance();
   polygonmapper.setInputData(polydata);
    
   
   const polygonactor = vtkActor.newInstance();
    polygonactor.getProperty().setColor(0, 0, 0);
    polygonactor.getProperty().setAmbient(1);
    polygonactor.getProperty().setDiffuse(0);
     polygonactor.setMapper(polygonmapper);
     polygonactor.getProperty().setEdgeVisibility(true);

     renderer.addActor(polygonactor);
     renderer.resetCamera();

     const renderWindow = this.fullscreenRenderWindow.getRenderWindow();
     renderWindow.render();

  }

  createConeExample() {

    this.fullscreenRenderWindow = vtkFullScreenRenderWindow.newInstance({
      background: [0.9, 0.9, 0.9],
    });
    const cone = vtkConeSource.newInstance();
    const actor = vtkActor.newInstance();
    const mapper = vtkMapper.newInstance();

    actor.setMapper(mapper);
    mapper.setInputConnection(cone.getOutputPort());

    const renderer = this.fullscreenRenderWindow.getRenderer();
    renderer.addActor(actor);
    renderer.resetCamera();

    const renderWindow = this.fullscreenRenderWindow.getRenderWindow();
    renderWindow.render();
  }

  createPlaneExample() {
    this.fullscreenRenderWindow = vtkFullScreenRenderWindow.newInstance({
      background: [0.9, 0.9, 0.9],
    });

    const renderer = this.fullscreenRenderWindow.getRenderer();
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

    const planeActor = vtkActor.newInstance();
    planeActor.getProperty().setEdgeVisibility(true);

    const simpleFilter = vtkCalculator.newInstance();
    simpleFilter.setFormulaSimple(
      FieldDataTypes.POINT, // Generate an output array defined over points.
      [], // We don't request any point-data arrays because point coordinates are made available by default.
      'z', // Name the output array "z"
      (x) => (x[0] - 0.5) * (x[0] - 0.5) + (x[1] - 0.5) * (x[1] - 0.5) + 0.125
    ); // Our formula for z

    simpleFilter.setInputConnection(planeSource.getOutputPort());
    planeMapper.setInputConnection(simpleFilter.getOutputPort());
    planeActor.setMapper(planeMapper);

    renderer.addActor(planeActor);

    renderer.resetCamera();

    const renderWindow = this.fullscreenRenderWindow.getRenderWindow();
    renderWindow.render();
  }

  
}
