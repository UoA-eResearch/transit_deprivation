import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withStyles, createMuiTheme } from '@material-ui/core/styles';
import { Paper } from '@material-ui/core';
import { mapColorSchemeNameToInterpolator } from "../utils/ColorScheme";
import { scaleSequential, scaleLinear } from "d3";
// color helpers
var tinycolor = require("tinycolor2");

const theme = createMuiTheme({
    palette: {
        type: "light",
    },
});

const styles = (theme) => ({
    mapLegend: {
        x: 0,
        y: 0,
        width: "320px",
        color: theme.palette.text.secondary,
        background: theme.palette.background.paper,
        padding: theme.spacing(2)

    },
    colorBarTicks: {
        color: theme.palette.text.secondary,
        fontFamily: "Roboto",
        fontSize: "10px",
        textAnchor: "middle",
    },
    colorBarLabel: {
        color: theme.palette.text.secondary,
        fontFamily: "Roboto",
        fontSize: "14px",
        textAnchor: "middle",
    },
});

class MapLegend extends Component {

    label = () => {
        const { etaView } = this.props;
        let l = "";
        switch (etaView){
            case "mean":
                l = "Mean Travel Time (minutes)"
                break;
            case "stdev":
                l = "Standard Deviation in Travel Time (minutes)"
                break;
            case "avail":
                l = "Availability (%)"
                break;
            default:
                break;
        }
        return l;
    }

    render() {
        const { classes, minValue, maxValue, etaView, colorScheme, opacity } = this.props;
        let width = 300;
        let height = 8;
        let xpad = 5;

        let vmin = minValue;
        let vmax = maxValue;
        if (etaView === "avail") {
            vmin = minValue * 100;
            vmax = maxValue * 100;
        }

        let mapColorSchemeInterpolator = mapColorSchemeNameToInterpolator(colorScheme);
        let colorScale = scaleSequential([0, 1], mapColorSchemeInterpolator);
        let tickScale = scaleLinear().domain([0, 1]).range([vmin, vmax]);
        let tickValues = tickScale.ticks().map(value => Math.round(tickScale(value)));
        let tickOffset = width / (tickValues.length - 1);

        return (
            <Paper
                id={"map-legend"}
                className={classes.mapLegend}
            >
                <svg id="map-legend" width="320" height="60" version="1.1" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                        <linearGradient id="Gradient">
                            {
                                tickScale.ticks().map((value, index) => (
                                    // console.log(`${index} ${value} ${colorScale(value)}`)
                                    <stop key={`stop-${index}`} offset={`${value*100}%`} stopColor={tinycolor(colorScale(value)).setAlpha(opacity)}/>
                                ))

                            }
                        </linearGradient>
                    </defs>
                    <rect
                        x={xpad}
                        y="0"
                        width={width}
                        height={height}
                        stroke="transparent"
                        strokeWidth="1"
                        fill="url(#Gradient)"
                    />
                    {
                        tickValues.map((value, index) => (
                            // console.log(`${value} ${index} ${index * tickOffset}`)
                            <g
                                key={`tick-${index}`}
                                transform={`translate(${xpad + index * tickOffset}, 0)`}
                            >
                                <text
                                    id="map-legend"
                                    key={`tickValue-${index}`}
                                    className={classes.colorBarTicks}
                                    fill={"currentColor"}
                                    style={{transform: `translateY(${height + 20}px)`}}>
                                    { value }
                                </text>
                            </g>
                        ))
                    }
                    <g
                        key={"label"}
                        transform={`translate(${xpad + width/2}, ${height + 50})`}
                    >
                        <text
                            id="map-legend"
                            key={"label"}
                            className={classes.colorBarLabel}
                            fill={"currentColor"}
                        >{this.label}</text>
                    </g>
                </svg>
            </Paper>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        minValue: state.mapMinValue,
        maxValue: state.mapMaxValue,
        colorScheme: state.mapColorScheme,
        opacity: state.mapOpacity,
    }
};

const mapDispatchToProps = (dispatch) => {
    return ({
    });
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(withStyles(styles, {defaultTheme: theme})(MapLegend));

