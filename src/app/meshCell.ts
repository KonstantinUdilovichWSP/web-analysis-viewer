import { Point3d } from "./point3d";

export class MeshCell {
    id: String;
    NumberOfPoints:number;
    PointsIds:number[];
    constructor(id:String, NumberOfPoints:number, PointsIds:number[]) {
        this.id=id;
        this.NumberOfPoints=NumberOfPoints;
        this.PointsIds = PointsIds;
    }
}