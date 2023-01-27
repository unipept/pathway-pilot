import axios from 'axios';
import { parse } from 'node-html-parser';

import config from '../config/config';
import { Pathway } from '../models/Pathway';
import { PathwayNode, RectanglePathwayNode, CirclePathwayNode, PolygonPathwayNode } from '../models/PathwayNode';

export const getPathway = async (pathway: string): Promise<Pathway> => {
    const htmlUrl = `${config.keggPathwayEndpoint}${pathway}`;
    const pngUrl = `${config.keggPathwayPngEndpoint}${pathway}.png`;

    const html = await axios
        .get(htmlUrl)
        .then(res => parse(res.data))

    const areas = html.querySelector('#mapdata')?.querySelectorAll('area') ?? [];
    
    return {
        image: pngUrl,
        nodes: areas.map(area => attributeToNode(area.attributes))
    }
};

const attributeToNode = (attribute: any): PathwayNode => {
    if (attribute.shape === 'rect') {
        const coords = attribute.coords.split(',');

        return {
            x1: parseInt(coords[0], 10),
            y1: parseInt(coords[1], 10),
            x2: parseInt(coords[2], 10),
            y2: parseInt(coords[3], 10)
        } as RectanglePathwayNode;
    }

    else if (attribute.shape === 'circle') {
        const coords = attribute.coords.split(',');

        return {
            x: parseInt(coords[0], 10),
            y: parseInt(coords[1], 10),
            r: parseInt(coords[2], 10)
        } as CirclePathwayNode;
    }

    else if (attribute.shape === 'poly') {
        return {
            points: attribute.coords
        } as PolygonPathwayNode;
    }

    throw new Error(`Unknown shape: ${attribute.shape}`);
}
