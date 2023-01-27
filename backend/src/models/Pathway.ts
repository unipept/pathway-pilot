import { PathwayNode } from "./PathwayNode";

export interface Pathway {
  image: string;                /* URL to the image of the pathway */
  nodes: PathwayNode[];         /* Nodes of the pathway */
};
