import React, {Component} from 'react';
import { connect } from 'react-redux';
import { withStyles, createMuiTheme} from '@material-ui/core/styles';
import {Grid, Paper, Typography} from '@material-ui/core';
import Map from "./Map";
import DefaultMap from "./DefaultMap";
import OriginMap from "./OriginMap";
import DestinationMap from "./DestinationMap";
import InboundAccessibilityMap from "./InboundAccessibilityMap";
import OutboundAccessibilityMap from "./OutboundAccessibilityMap";
import * as mapTypes from "./mapTypes";
import TimeLimitSlider from "./TimeLimitSlider";
import DestinationTimeSlider from "./DestinationTimeSlider";
import * as basemapTypes from "../components/basemapTypes";

const theme = createMuiTheme({
    palette: {
        type: "light",
    },
});

const styles = (theme) => ({
    map: {
        color: theme.palette.text.secondary,
        padding: theme.spacing(2),
    },
    mapTileDescription: {
        // padding: theme.spacing(2),
    }
});

class MapTile extends Component {

    getName(mapType) {

        const { basemap } = this.props;

        switch (mapType){
            case mapTypes.ORIGIN:
                return 'Origin';
            case mapTypes.DESTINATION:
                return 'Destination';
            case mapTypes.INBOUND:
                return "Inbound Accessibility";
            case mapTypes.OUTBOUND:
                return "Outbound Accessibility";
            default:
                return "No name";
        }
    }

    getDescription(mapType) {
        switch (mapType){
            case mapTypes.ORIGIN:
                return "Click on the map to select a starting location";
            case mapTypes.DESTINATION:
                return "Click on the map to select a destination. Set the time spent there and the total time available using the sliders under Controls";
            case mapTypes.INBOUND:
                return "This shows the percentage of trips from each starting location that can reach the destination in the allotted time";
            case mapTypes.OUTBOUND:
                return "This shows the percentage of trips from the origin that can reach every other location after spending time at the selected destination";
            default:
                return "";
        }
    }

    getMap(mapType){
        switch (mapType){
            case mapTypes.ORIGIN:
                return <OriginMap />;
            case mapTypes.DESTINATION:
                return <DestinationMap />;
            case mapTypes.INBOUND:
                return <InboundAccessibilityMap />
            case mapTypes.OUTBOUND:
                return <OutboundAccessibilityMap />;
            default:
                return <DefaultMap />;
        }
    }

    render() {
        const { classes, mapType } = this.props;
        return (
            <Paper className={classes.map}>
                <Grid container direction="column" spacing={0}>
                    <Grid item>
                        {this.getMap(mapType)}
                    </Grid>
                    <Grid item container direction="row" justify="center">
                        <Grid item>
                            <Typography variant="h6" style={{paddingTop:10}}>{this.getName(mapType)}</Typography>
                        </Grid>
                        <Grid item container direction="row">
                            <Typography variant="body1">{this.getDescription(mapType)}</Typography>
                        </Grid>
                    </Grid>
                </Grid>
            </Paper>
        );
    }
}

const mapStateToProps = (state) => {
    return {basemap: state.destinationBasemap}
};

const mapDispatchToProps = (dispatch) => {
    return ({});
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(withStyles(styles, {defaultTheme: theme})(MapTile));
