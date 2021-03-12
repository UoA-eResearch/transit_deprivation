import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withStyles, createMuiTheme } from '@material-ui/core/styles';
import { Paper } from '@material-ui/core';
import { mapColorSchemeNameToInterpolator } from "../utils/colorScheme";
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
        width: "350px",
        color: theme.palette.text.secondary,
        background: theme.palette.background.paper,
        padding: theme.spacing(1)

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

    render() {
        const { classes, vmin, vmax, label, colorScheme, name, opacity } = this.props;
        let width = 330;
        let height = 10;
        let xpad = 10;
        let ypad = 0;

        let mapColorSchemeInterpolator = mapColorSchemeNameToInterpolator(colorScheme);

        let colorScale = scaleSequential([0, 1], mapColorSchemeInterpolator);
        let tickScale = scaleLinear().domain([0, 1]).range([vmin, vmax]);
        // let tickValues = tickScale.ticks().map(value => Math.round(tickScale(value)));
        let tickValues = tickScale.ticks().map(value => Number(tickScale(value).toPrecision(2)));
        let tickOffset = width / (tickValues.length - 1);

        const gradientId = `${name}_gradient`;

        return (
            <Paper
                id={"map-legend"}
                className={classes.mapLegend}
            >
                <svg id="map-legend" width="350" height="55" version="1.1" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                        <linearGradient id={gradientId}>
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
                        y={ypad}
                        width={width}
                        height={height}
                        stroke="transparent"
                        strokeWidth="1"
                        fill={`url(#${gradientId})`}
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
                                    style={{transform: `translateY(${ypad + height + 20}px)`}}>
                                    { value }
                                </text>
                            </g>
                        ))
                    }
                    <g
                        key={"label"}
                        transform={`translate(${xpad + width/2}, ${ypad + height + 42})`}
                    >
                        <text
                            id="map-legend"
                            key={"label"}
                            className={classes.colorBarLabel}
                            fill={"currentColor"}
                        >{label}</text>
                    </g>
                </svg>
            </Paper>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        // colorScheme: state.mapColorScheme,
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

