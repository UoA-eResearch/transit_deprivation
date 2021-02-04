import {color} from "d3";

export function getNormalisedValue(layer, index){
    let v = layer["values"][index];
    let vmin = layer["min"];
    let vmax = layer["max"];
    let nv = (v - vmin) / Math.max((vmax - vmin), 1);
    return nv;
}

export function getInterpolatedColor(value, interpolator){
    let c = interpolator(value);
    c = color(c).copy({opacity: 255})
    return [c.r, c.g, c.b, c.opacity];
}