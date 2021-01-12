import {interpolateViridis, interpolateTurbo, interpolateBuGn} from 'd3-scale-chromatic';

export function mapColorSchemeNameToInterpolator(name) {
    let interp = () => {};
    switch (name) {
        case "BlueGreen":
            interp = interpolateBuGn;
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