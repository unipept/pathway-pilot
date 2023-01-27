import axios from 'axios';
import { parse } from 'node-html-parser';

import config from '../config/config';
import { Pathway } from '../models/Pathway';
import { PathwayNode, RectanglePathwayNode, CirclePathwayNode, PolygonPathwayNode } from '../models/PathwayNode';

export const getPathway = async (pathway: string): Promise<Pathway> => {
    const htmlUrl = `${config.keggPathwayEndpoint}${pathway}`;
    const pngUrl = `${config.keggPathwayPngEndpoint}${pathway}@2x.png`;

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

        return new RectanglePathwayNode(
            parseInt(coords[0], 10) * 2,
            parseInt(coords[1], 10) * 2,
            parseInt(coords[2], 10) * 2,
            parseInt(coords[3], 10) * 2
        );
    }

    else if (attribute.shape === 'circle') {
        const coords = attribute.coords.split(',');

        return new CirclePathwayNode(
            parseInt(coords[0], 10) * 2,
            parseInt(coords[1], 10) * 2,
            parseInt(coords[2], 10) * 2
        );
    }

    else if (attribute.shape === 'poly') {
        return new PolygonPathwayNode(attribute.coords);
    }

    throw new Error(`Unknown shape: ${attribute.shape}`);
}
