import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withStyles, createMuiTheme } from '@material-ui/core/styles';
import {Typography} from '@material-ui/core';


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

class MapTooltip extends Component {
    render() {
        const { classes, eta, etaView, mapTooltip, } = this.props;
        const { showHover, hoveredObject, x, y} = mapTooltip;
        if (showHover && hoveredObject) {
            const idInfo = (
                <div>
                    <Typography variant="subtitle2">
                        <b>ID: {hoveredObject.id}</b>
                    </Typography>
                </div>
            );
            if (eta !== null) {
                let view = etaView;
                let accessible = hoveredObject.id in eta[view]["values"];

                let meanEta = Math.round(eta["mean"]["values"][hoveredObject.id]);
                let stdevEta = Math.round(eta["stdev"]["values"][hoveredObject.id]);
                let avail = Math.round(eta["avail"]["values"][hoveredObject.id] * 100);

                return (
                    <div className={classes.tooltip} style={{top: y, left: x, width: "210px",}}>
                        {idInfo}
                        {
                            accessible ?
                                (
                                    <div>
                                        <Typography variant="subtitle2">
                                            {`Mean: ${meanEta} minutes`}
                                        </Typography>
                                        <Typography variant="subtitle2">
                                            {`Standard deviation: ${stdevEta} minutes`}
                                        </Typography>
                                        <Typography variant="subtitle2">
                                            {`Availability: ${avail} %`}
                                        </Typography>
                                    </div>
                                ) :
                                (
                                    <div>
                                        <Typography variant="subtitle2">
                                            {"Inaccessible"}
                                        </Typography>
                                    </div>
                                )
                        }
                    </div>
                );
            } else {
                return (
                    <div className={classes.tooltip} style={{top: y, left: x, width:90}}>
                        {idInfo}
                    </div>
                );
            }
        } else {
            return (<div></div>);
        }
    }
}

const mapStateToProps = (state) => {
    return {
        eta: state.eta,
        etaView: state.etaView,
        mapTooltip: state.mapTooltip,
    }
};

const mapDispatchToProps = (dispatch) => {
    return ({
    });
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(withStyles(styles, {defaultTheme: theme})(MapTooltip));
