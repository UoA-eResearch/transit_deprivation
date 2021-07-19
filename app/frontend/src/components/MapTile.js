import React, {Component} from 'react';
import { connect } from 'react-redux';
import { withStyles, createTheme} from '@material-ui/core/styles';
import {Grid, Paper, Typography} from '@material-ui/core';
import OriginMap from "./OriginMap";
import DestinationMap from "./DestinationMap";
import InboundAccessibilityMap from "./InboundAccessibilityMap";
import OutboundAccessibilityMap from "./OutboundAccessibilityMap";
import * as mapTypes from "./mapTypes";

const theme = createTheme({
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
    },
    link: {
        color: theme.palette.text.secondary,
        background: 'none!important',
        border: 'none',
        padding: '0!important',
        textDecoration: 'none',
        cursor: 'pointer',
        fontWeight: 'bolder',
    }
});

class MapTile extends Component {

    constructor(props) {
        super(props);
        this.downloadOutbound = this.downloadOutbound.bind(this);
        this.downloadInbound = this.downloadInbound.bind(this);
    }

    getName(mapType) {

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
                return "Click on the map to select a starting location. Trips will originate from here and end at the selected destination.";
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

    getTitleRow(mapType){

        const {inbound, outbound, classes} = this.props;

        switch (mapType){
            case mapTypes.ORIGIN:
                return (
                    <Grid item>
                        <Typography variant="h6" style={{paddingTop:10}}>{this.getName(mapType)}</Typography>
                    </Grid>
                );
            case mapTypes.DESTINATION:
                return (
                    <Grid item>
                        <Typography variant="h6" style={{paddingTop:10}}>{this.getName(mapType)}</Typography>
                    </Grid>
                );
            case mapTypes.INBOUND:
                if (inbound !== null){
                    return (
                        <Grid container item direction="row" justifyContent="space-between">
                            <Grid item>
                                <div style={{paddingLeft:60}}/>
                            </Grid>
                            <Grid item>
                                <Typography variant="h6" style={{paddingTop:10}}>{this.getName(mapType)}</Typography>
                            </Grid>
                            <Grid item>
                                <button className={classes.link} onClick={this.downloadInbound}>
                                    <Typography variant="caption">Download</Typography>
                                </button>
                            </Grid>
                        </Grid>
                    );
                } else {
                    return (
                        <Grid item>
                            <Typography variant="h6" style={{paddingTop:10}}>{this.getName(mapType)}</Typography>
                        </Grid>
                    );
                }

            case mapTypes.OUTBOUND:
                if (outbound !== null){
                    return (
                        <Grid container item direction="row" justifyContent="space-between">
                            <Grid item>
                                <div style={{paddingLeft:60}}/>
                            </Grid>
                            <Grid item>
                                <Typography variant="h6" style={{paddingTop:10}}>{this.getName(mapType)}</Typography>
                            </Grid>
                            <Grid item>
                                <button className={classes.link} onClick={this.downloadOutbound}>
                                    <Typography variant="caption">Download</Typography>
                                </button>
                            </Grid>
                        </Grid>
                    );
                } else {
                    return (
                        <Grid item>
                            <Typography variant="h6" style={{paddingTop:10}}>{this.getName(mapType)}</Typography>
                        </Grid>
                    );
                }

            default:
                return null;
        }
    }

    exportCSVFile(csv, exportedFilename) {

        let blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        if (navigator.msSaveBlob) { // IE 10+
            navigator.msSaveBlob(blob, exportedFilename);
        } else {
            let link = document.createElement("a");
            if (link.download !== undefined) { // feature detection
                // Browsers that support HTML5 download attribute
                let url = URL.createObjectURL(blob);
                link.setAttribute("href", url);
                link.setAttribute("download", exportedFilename);
                link.style.visibility = 'hidden';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            }
        }
    }

    convertToCSV(values, ids, name) {
        let str = `DZ2018, ${name} \r\n`;
        for (let i = 0; i < values.length; i++) {
            str += `${ids[i]}, ${values[i]} \r\n`;
        }
        return str;
    }

    downloadOutbound(){

        const {outbound, idxLoc} = this.props;
        if (outbound !== null){
            console.log(outbound.avail.values);
            let csv = this.convertToCSV(outbound.avail.values, idxLoc, 'Outbound_Accessibility');
            this.exportCSVFile(csv, 'outbound.csv');
        }
    }

    downloadInbound(){
        const {inbound, idxLoc} = this.props;
        if (inbound !== null){
            let csv = this.convertToCSV(inbound.avail.values, idxLoc, 'Inbound_Accessibility');
            this.exportCSVFile(csv, 'inbound.csv');
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
                return null;
        }
    }

    render() {

        const { classes, mapType} = this.props;

        return (
            <Paper className={classes.map}>
                <Grid container direction="column" spacing={0}>
                    <Grid item>
                        {this.getMap(mapType)}
                    </Grid>
                    <Grid item container direction="row" justify="center">
                        {this.getTitleRow(mapType)}
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
    return {
        inbound: state.AB,
        outbound: state.BC,
        idxLoc: state.idxLoc,
    }
};

const mapDispatchToProps = (dispatch) => {
    return ({});
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(withStyles(styles, {defaultTheme: theme})(MapTile));
