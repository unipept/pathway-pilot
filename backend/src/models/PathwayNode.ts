import PathwayShape from "./PathwayShapes";

export class PathwayNode {
    constructor(
        private shape: PathwayShape     /* Shape of the node */
    ) {}
};

export class RectanglePathwayNode extends PathwayNode {
    constructor(
        private x1: number,             /* X coordinate of the top left corner */
        private y1: number,             /* Y coordinate of the top left corner */
        private x2: number,             /* X coordinate of the bottom right corner */
        private y2: number              /* Y coordinate of the bottom right corner */
    ) { super(PathwayShape.RECTANGLE); }
};

export class CirclePathwayNode extends PathwayNode {
    constructor(
        private x: number,              /* X coordinate of the center */
        private y: number,              /* Y coordinate of the center */
        private r: number               /* Radius of the circle */
    ) { super(PathwayShape.CIRCLE); }
};

export class PolygonPathwayNode extends PathwayNode {
    constructor(
        private points: string          /* Points of the polygon */
    ) { super(PathwayShape.POLYGON); }
};
