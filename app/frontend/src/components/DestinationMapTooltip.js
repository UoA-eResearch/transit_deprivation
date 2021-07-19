import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withStyles, createTheme } from '@material-ui/core/styles';
import {Grid, Typography} from '@material-ui/core';
import * as destinationTypes from "./destinationTypes"


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
        padding: "8px",
        background: "#000",
        color: "#fff",
        overflowY: "hidden",
    },
});

class DestinationMapTooltip extends Component {

    getContent(destinationDataset, f){

        switch (destinationDataset){
            case destinationTypes.DESTINATION_DIABETES_CLINICS:
                return (
                    <Grid container direction="column">
                        <Grid item>
                            <Typography variant="subtitle2"><b>{f.name}</b></Typography>
                        </Grid>
                        <Grid item>
                            <Typography variant="subtitle2">{f.address}</Typography>
                        </Grid>

                    </Grid>
                );
            case destinationTypes.DESTINATION_PRIMARY_SCHOOLS:
                return (
                    <Grid container direction="column">
                        <Grid item>
                            <Typography variant="subtitle2"><b>{f.Org_Name}</b></Typography>
                        </Grid>
                    </Grid>
                );
            case destinationTypes.DESTINATION_INTERMEDIATE_SCHOOLS:
                return (
                    <Grid container direction="column">
                        <Grid item>
                            <Typography variant="subtitle2"><b>{f.Org_Name}</b></Typography>
                        </Grid>
                    </Grid>
                );
            case destinationTypes.DESTINATION_SECONDARY_SCHOOLS:
                return (
                    <Grid container direction="column">
                        <Grid item>
                            <Typography variant="subtitle2"><b>{f.Org_Name}</b></Typography>
                        </Grid>
                    </Grid>
                );
            default:
                return null
        }
    }

    render() {
        const {classes, hoverInfo, destinationDataset} = this.props;
        if (hoverInfo && hoverInfo.object && destinationDataset !== destinationTypes.DESTINATION_NONE){
            const {x, y} = hoverInfo;
            const f = hoverInfo.object.properties;

            return (
                <div className={classes.tooltip} style={{top: y, left: x, width: "210px",}}>
                    {this.getContent(destinationDataset, f)}
                </div>
            )
        } else {
            return null;
        }
    }

}

const mapStateToProps = (state) => {
    return {
        destinations: state.destinations,
        destinationDataset: state.destinationDataset,
    }
};

const mapDispatchToProps = (dispatch) => {
    return ({
    });
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(withStyles(styles, {defaultTheme: theme})(DestinationMapTooltip));
