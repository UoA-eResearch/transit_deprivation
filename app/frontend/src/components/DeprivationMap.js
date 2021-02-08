import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withStyles, createMuiTheme } from '@material-ui/core/styles';
import { mapColorSchemeNameToInterpolator } from "../utils/colorScheme";
import { updateHover,
         setMapTooltip,
         setMapViewState,
         } from "../store/actions";
// mapping
import { StaticMap } from 'react-map-gl';
import DeckGL from '@deck.gl/react';
import { GeoJsonLayer } from '@deck.gl/layers';
import MapTooltip  from './MapTooltip';
import MapLegend from './MapLegend';
import { color } from "d3";

const theme = createMuiTheme({
    palette: {
        type: "light",
    },
});

const styles = (theme) => ({
    map: {
        minHeight: "550px",
        position: "relative",
    },
});

const mapStyle = 'mapbox://styles/mapbox/light-v9';
const MAPBOX_TOKEN = process.env.REACT_APP_MapboxAccessToken;

class DeprivationMap extends Component {

     getInterpolatedColor(value, interpolator){
        let c = interpolator(value);
        c = color(c).copy({opacity: 255})
        return [c.r, c.g, c.b, c.opacity];
    }

    // new version
    getColor = (v) => {

        const { dataZoneStats } = this.props;
        const colorScheme = "BlueGreen";
        const mapColorSchemeInterpolator = mapColorSchemeNameToInterpolator(colorScheme);

        const vmin = dataZoneStats.IMD18.min;
        const vmax = dataZoneStats.IMD18.max;

        const nv = (v - vmin) / Math.max((vmax - vmin), 1);
        return this.getInterpolatedColor(nv, mapColorSchemeInterpolator);

    };

    onViewStateChange = vs => {
        const { setMapViewState } = this.props;
        setMapViewState(vs);
    };

    render() {
        const { classes, dataZones, mapViewState } = this.props;

        const layers = [
            new GeoJsonLayer({
                id: 'deprivation',
                data: dataZones,
                opacity: 1,
                filled: true,
                getFillColor: f => this.getColor(f.properties.IMD18),
            })
        ];

        return(
            <div className={classes.map}>
                <DeckGL
                    layers={layers}
                    initialViewState={mapViewState}
                    controller={true}
                    // onViewStateChange={ this.onViewStateChange }
                >
                    <StaticMap
                        reuseMaps
                        mapStyle={mapStyle}
                        preventStyleDiffing={true}
                        mapboxApiAccessToken={MAPBOX_TOKEN}
                    />
                    {/*{*/}
                    {/*    (eta !== null) ? (*/}
                    {/*        <MapLegend*/}
                    {/*            minValue={minValue}*/}
                    {/*            maxValue={maxValue}*/}
                    {/*            mapColorSchemeInterpolator={mapColorSchemeInterpolator}*/}
                    {/*            opacity={opacity}*/}
                    {/*            etaView={etaView}*/}
                    {/*        />) : null*/}
                    {/*}*/}
                    <MapTooltip />
                </DeckGL>
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        mapViewState: state.mapViewState,
        dataZones: state.dataZones,
        dataZoneStats: state.dataZoneStats,
        selectedDataZone: state.selectedDataZone,
        tooltip: state.mapTooltip,
        locIdx: state.locIdx,
    }
};

const mapDispatchToProps = (dispatch) => {
    return ({
        setMapTooltip: (mapTooltip) => { dispatch(setMapTooltip(mapTooltip)) },
        setMapViewState: (mapViewState) => { dispatch(setMapViewState(mapViewState)) },
        updateHover: (hoveredDataZone) => { dispatch(updateHover(hoveredDataZone)) },
    });
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(withStyles(styles, {defaultTheme: theme})(DeprivationMap));
