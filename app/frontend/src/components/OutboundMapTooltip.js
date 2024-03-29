import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withStyles, createTheme } from '@material-ui/core/styles';
import chroma from "chroma-js";
import Plotly from 'plotly.js-basic-dist';
import createPlotlyComponent from "react-plotly.js/factory";
const Plot = createPlotlyComponent(Plotly);

const theme = createTheme({
    palette: {
        type: "light",
    },
});

const styles = (theme) => ({
    tooltip: {
        pointerEvents: "none",
        position: "absolute",
        zIndex: 9,
        //padding: "1px",
        //paddingBottom: "0px",
        //background: "#777f80",
        //color: "#fff",
        overflowY: "hidden",
        borderRadius: "10px",
    },
});

class OutboundMapTooltip extends Component {

    // https://observablehq.com/@haakenlid/svg-circle

    constructor(props){
        super(props);
        this.svgSize = 200;
        this.segments = 24*6;
        this.margin = 0;
        this.radius = 80;
        this.width = this.radius;

    }

    polarToCartesian = (x, y, r, degrees) => {
        const radians = degrees * Math.PI / 180.0;
        const phase = -Math.PI / 2;
        return [x + (r * Math.cos(radians + phase)),
            y + (r * Math.sin(radians + phase))]
    }

    segmentPath = (x, y, r0, r1, d0, d1) => {
        // https://svgwg.org/specs/paths/#PathDataEllipticalArcCommands
        const arc = Math.abs(d0 - d1) > 180 ? 1 : 0
        const point = (radius, degree) =>
            this.polarToCartesian(x, y, radius, degree)
                .map(n => n.toPrecision(5))
                .join(',')
        return [
            `M${point(r0, d0)}`,
            `A${r0},${r0},0,${arc},1,${point(r0, d1)}`,
            `L${point(r1, d1)}`,
            `A${r1},${r1},0,${arc},0,${point(r1, d0)}`,
            'Z',
        ].join('')
    }

    segment = (value, n) => {

        const [mask, ratio] = value;
        const center = this.svgSize/2;
        const degrees = 360 / this.segments;
        const start = degrees * n;
        const end = (degrees * (n + 1 - this.margin) + (this.margin === 0 ? 1 : 0));
        const path = this.segmentPath(center, center, this.radius, this.radius-this.width, start, end);
        const fill = mask ? chroma.gl(0, 0, 1, ratio) : chroma("grey");

        // return (<path d={path} style={`fill:${fill};stroke:none`} />);
        return <path d={path} style={{fill:`${fill}`, stroke:`none`}} />
    }

    range = (n) => [...Array(n).keys()]

    renderTrips = (trips) =>  {

        const interval = 6; // 60 minutes over 10 minute intervals
        const start = 7 * interval; // 7 am
        const end = start + trips.length;

        let values = Array(24*interval).fill(Array(2).fill(0)); // 24hrs

        let tripIdx = 0;
        for (let i=0; i < values.length; i++){
            if (i >= start && i < end){
                values[i] = [1, trips[tripIdx]]; // mask, value
                tripIdx += 1;
            }
        }

        return (
            // <div>{sum}</div>
            <svg id="trips" height={this.svgSize} viewBox={`0 0 ${this.svgSize} ${this.svgSize}`}>
                {values.map(this.segment)}
            </svg>
        )
    }

    render() {
        const {classes, hoverInfo, BC, selectedDataZone, locIdx, idxT, showOutboundHover} = this.props;

        if (showOutboundHover && hoverInfo && hoverInfo.object && selectedDataZone !== null && BC !== null){
            const {x, y} = hoverInfo;

            const originIdx = locIdx[hoverInfo.object.id];
            const trips = BC.trips.slice(null, [originIdx, originIdx+1, 1]).flatten().tolist();

            // summary of trips vector:
            // there is a set of trips from the origin that can reach the destination and spend the required time there
            // of these trips, there are some that can also reach a 3rd (outbound) location
            // the trips vector now shows the ratio of inbound trips that can reach a selected outbound location

            // plot date fromatting
            // https://github.com/d3/d3-time-format#locale_format
            return (
                <div className={classes.tooltip} style={{top: y, left: x}}>
                    {/*{this.renderTrips(trips)}*/}
                    <Plot
                        data={[
                            {
                                x: this.range(trips.length).map(x => idxT[x]),
                                y: trips.map(x => x * 100),
                                type: 'scatter',
                                line: {shape: 'spline'},
                                mode: 'lines',
                                marker: {color: '#2dcee0'},
                            },
                        ]}
                        layout={ {width: 375, height: 100,
                            margin: {
                                l:55, r:10, b: 25, t: 15, pad: 0
                            },
                            xaxis: {showgrid: false, tickformat: "%I %p"},
                            yaxis: {title: {text: 'Trip %', font: {family: 'Roboto', size: 13}}, showgrid: false, range: [-5, 105]},
                        }}
                    />
                </div>
            );

        } else {
            return null;
        }
    }

}

const mapStateToProps = (state) => {
    return {
        BC : state.BC,
        locIdx: state.locIdx,
        idxT: state.idxT,
        selectedDataZone: state.selectedDataZone,
        showOutboundHover: state.showOutboundHover,

    }
};

const mapDispatchToProps = (dispatch) => {
    return ({});
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(withStyles(styles, {defaultTheme: theme})(OutboundMapTooltip));
