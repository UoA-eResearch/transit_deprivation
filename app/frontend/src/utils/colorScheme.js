import { interpolateViridis, interpolateTurbo, interpolateBuGn, interpolateOrRd, interpolateBlues} from 'd3-scale-chromatic';

export function mapColorSchemeNameToInterpolator(name) {
    let interp = () => {};
    switch (name) {
        case "BlueGreen":
            interp = interpolateBuGn;
            break;
        case "Blues":
            interp = interpolateBlues;
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
    }
    return(interp);
}