import { interpolateViridis, interpolateTurbo, interpolateBuGn, interpolateOrRd, interpolateBlues, interpolatePurples} from 'd3-scale-chromatic';

export function mapColorSchemeNameToInterpolator(name) {
    let interp = () => {};
    switch (name) {
        case "BlueGreen":
            interp = interpolateBuGn;
            break;
        case "Blues":
            interp = interpolateBlues;
            break;
        case "Purples":
            interp = interpolatePurples;
            break;
        case "OrangeRed":
            interp = interpolateOrRd;
            break;
        case "Viridis":
            interp = interpolateViridis;
            break;
        case "Turbo":
            interp = interpolateTurbo;
            break;
        default:
            interp = interpolateViridis;
    }
    return(interp);
}