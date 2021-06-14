import { ViewChild, ElementRef, Component  } from '@angular/core';
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


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'VtkAngular';

  @ViewChild('content', {read: ElementRef}) content: ElementRef;

  fullscreenRenderWindow = null;

  ngAfterViewInit(): void {
    this.fullscreenRenderWindow = vtkFullScreenRenderWindow.newInstance({
      background: [0.9, 0.9, 0.9],
    });
    const cone = vtkConeSource.newInstance();
    const actor = vtkActor.newInstance();
    const mapper = vtkMapper.newInstance();

    actor.setMapper(mapper);
    mapper.setInputConnection(cone.getOutputPort());

    const renderer = this.fullscreenRenderWindow.getRenderer();
    // renderer.addActor(actor);

    const polydata = vtkPolyData.newInstance();
const vertexArray = [];
const vertexCount = 0;
const cellArray = [];

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
