import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withStyles, createMuiTheme } from '@material-ui/core/styles';
import {Typography} from '@material-ui/core';
import * as mapTypes from "./mapTypes";
import * as destinationTypes from "./destinationTypes"


const theme = createMuiTheme({
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

    render() {
        const {classes, hoverInfo, destinationDataset} = this.props;
        if (hoverInfo && hoverInfo.object && destinationDataset != destinationTypes.DESTINATION_NONE){
            const {x, y} = hoverInfo;
            const f = hoverInfo.object.properties;

            return (
                <div className={classes.tooltip} style={{top: y, left: x, width: "210px",}}>
                    <Typography variant="subtitle2"><b>{f.name}</b></Typography>
                    <Typography variant="subtitle2">{f.address}</Typography>
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
