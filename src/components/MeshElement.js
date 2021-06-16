export default class MeshElement {
    id="";
    NumberOfPoints=0;
    PointsIndices=[];
    
    constructor(id, NumberOfPoints, PointsIndices) {
        this.id=id;
        this.NumberOfPoints=NumberOfPoints;
        this.PointsIndices = PointsIndices;
    }
}