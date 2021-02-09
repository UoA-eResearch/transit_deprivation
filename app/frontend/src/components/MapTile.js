import React, {Component} from 'react';
import { connect } from 'react-redux';
import { withStyles, createMuiTheme} from '@material-ui/core/styles';
import {Grid, Paper, Typography} from '@material-ui/core';
import Map from "./Map";
import DefaultMap from "./DefaultMap";
import DeprivationMap from "./DeprivationMap";
import DestinationMap from "./DestinationMap";
import InboundAccessibilityMap from "./InboundAccessibilityMap";
import OutboundAccessibilityMap from "./OutboundAccessibilityMap";
import * as mapTypes from "./mapTypes";

const theme = createMuiTheme({
    palette: {
        type: "light",
    },
});

const styles = (theme) => ({
    map: {
        color: theme.palette.text.secondary,
        padding: theme.spacing(0),
    }
});

class MapTile extends Component {

    getName(mapType) {
        switch (mapType){
            case mapTypes.DEPRIVATION:
                return "Origin / Deprivation";
            case mapTypes.DESTINATION:
                return "Destination";
            case mapTypes.INBOUND:
                return "Inbound Accessibility";
            case mapTypes.OUTBOUND:
                return "Outbound Accessibility";
            default:
                return "No name";
        }
    }

    getMap(mapType){
        switch (mapType){
            case mapTypes.DEPRIVATION:
                return <DeprivationMap />;
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
                <Grid container direction="column" spacing={1}>
                    <Grid item>
                        {this.getMap(mapType)}
                    </Grid>
                    <Grid item container direction="row" justify="center">
                        <Grid item>
                            <Typography variant="h6">{this.getName(mapType)}</Typography>
                        </Grid>
                    </Grid>
                </Grid>
            </Paper>
        );
    }
}

const mapStateToProps = (state) => {
    return {}
};

const mapDispatchToProps = (dispatch) => {
    return ({});
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(withStyles(styles, {defaultTheme: theme})(MapTile));
