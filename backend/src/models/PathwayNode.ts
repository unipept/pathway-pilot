import PathwayShape from "./PathwayShapes";

export interface PathwayNode {
    shape: PathwayShape;          /* Shape of the node */
};

export interface RectanglePathwayNode extends PathwayNode {
    shape: PathwayShape.RECTANGLE;
    x1: number;                   /* X coordinate of the top left corner */
    y1: number;                   /* Y coordinate of the top left corner */
    x2: number;                   /* X coordinate of the bottom right corner */
    y2: number;                   /* Y coordinate of the bottom right corner */
};

export interface CirclePathwayNode extends PathwayNode {
    shape: PathwayShape.CIRCLE;
    x: number;                    /* X coordinate of the center */
    y: number;                    /* Y coordinate of the center */
    r: number;                    /* Radius of the circle */
};

export interface PolygonPathwayNode extends PathwayNode {
    shape: PathwayShape.POLYGON;
    points: string;               /* Points of the polygon */
};
