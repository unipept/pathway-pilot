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

    const image = await axios.get(pngUrl, {responseType: 'arraybuffer'});
    const imageBase64 = Buffer.from(image.data).toString('base64');
    
    return {
        image: `data:image/png;base64,${imageBase64}`,
        nodes: areas.map(area => attributeToNode(area.attributes, 2))
    }
};

const attributeToNode = (attribute: any, scale: number): PathwayNode => {
    if (attribute.shape === 'rect') {
        const coords = attribute['data-coords'].split(',');

        return new RectanglePathwayNode(
            parseInt(coords[0], 10) * scale,
            parseInt(coords[1], 10) * scale,
            parseInt(coords[2], 10) * scale,
            parseInt(coords[3], 10) * scale,
            attribute.title
        );
    }

    else if (attribute.shape === 'circle') {
        const coords = attribute['data-coords'].split(',');

        return new CirclePathwayNode(
            parseInt(coords[0], 10) * scale,
            parseInt(coords[1], 10) * scale,
            parseInt(coords[2], 10) * scale,
            attribute.title
        );
    }

    else if (attribute.shape === 'poly') {
        // TODO: scale
        return new PolygonPathwayNode(attribute['data-coords'], attribute.title);
    }

    throw new Error(`Unknown shape: ${attribute.shape}`);
};
