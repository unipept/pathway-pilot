import axios from 'axios';
import { HTMLElement, parse } from 'node-html-parser';

import config from '../config/config';
import { KoMap } from '../mappings/KoMap';
import { Pathway } from '../models/Pathway';
import { PathwayNode, RectanglePathwayNode, CirclePathwayNode, PolygonPathwayNode } from '../models/PathwayNode';
import { findKoMappings } from './MappingService';

/**
 * Gets the pathway information from the Kegg website
 * and converts it to a Pathway object
 * 
 * @param pathwayId The pathway id to get the information from
 * @returns         The converted Pathway object
 */
export const findPathway = async (pathwayId: string): Promise<Pathway> => {
    // Request the correct information from the configuration
    const htmlUrl = `${config.keggPathwayEndpoint}${pathwayId}`;
    const pngUrl = `${config.keggPathwayPngEndpoint}${pathwayId}@2x.png`;

    // Request the html from the Kegg website and parse it
    const html = await axios
        .get(htmlUrl)
        .then(res => parse(res.data))

    // Get all area overlays from the map
    const areas = html.querySelector('#mapdata')?.querySelectorAll('area') ?? [];

    // Get the image from the Kegg website and convert it to base64
    // This way it can be directly used in the frontend without having to request it again
    const image = await axios.get(pngUrl, {responseType: 'arraybuffer'});
    const imageBase64 = Buffer.from(image.data).toString('base64');

    const koMapping = await findKoMappings();
    
    return {
        image: `data:image/png;base64,${imageBase64}`,
        nodes: areas.map(area => areaToNode(area, koMapping))
    }
};

/**
 * Converts an area html element to a PathwayNode
 * 
 * @param area  The area to convert
 * @param scale The correcting scale for the coordinates
 * @returns     The converted PathwayNode
 */
const areaToNode = (area: HTMLElement, koMap: KoMap, scale: number = 2): PathwayNode => {
    const attributes = area.attributes;
    const coords = attributes['data-coords'].split(',');

    switch (attributes.shape) {
        case 'rect': return new RectanglePathwayNode(
            parseInt(coords[0], 10) * scale,
            parseInt(coords[1], 10) * scale,
            parseInt(coords[2], 10) * scale,
            parseInt(coords[3], 10) * scale,
            attributes.title,
            koMap
        );

        case 'circle': return new CirclePathwayNode(
            parseInt(coords[0], 10) * scale,
            parseInt(coords[1], 10) * scale,
            parseInt(coords[2], 10) * scale,
            attributes.title,
            koMap
        );

        case 'poly': return new PolygonPathwayNode(
            coords.map(c => parseInt(c, 10) * scale).join(','),
            attributes.title,
            koMap
        );

        default: throw new Error(`Unknown shape: ${attributes.shape}`);
    }
};
