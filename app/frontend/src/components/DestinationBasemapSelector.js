import React, {Component} from 'react';
import { connect } from 'react-redux';
import { withStyles, createMuiTheme} from '@material-ui/core/styles';
import { Grid, Select, MenuItem, Typography} from '@material-ui/core';
import { setDestinationBasemap } from "../store/actions";
import * as basemapTypes from "../components/basemapTypes";

const theme = createMuiTheme({
    palette: {
        type: "light",
    },
});

const styles = (theme) => ({
    datasetSelector: {},
    viewSelector: {}
});

class DestinationBasemapSelector extends Component {

    handleDestinationBasemapChange = event => {
        const { setDestinationBasemap } = this.props;
        setDestinationBasemap(event.target.value);
    }

    getInfoStr = (basemap) => {
        switch (basemap){
            case basemapTypes.BASEMAP_NONE:
                return "No destination basemap selected";
            default:
                return basemapTypes.basemapToProperty[basemap].info;
        }

    }

    render() {
        const { classes, basemap } = this.props;

        return (
            <Grid container direction="column" spacing={2}>
                <Grid container item direction="row" spacing={3} alignItems="center">
                    <Grid item>
                        <Typography>Destination Basemap</Typography>
                    </Grid>
                    <Grid item style={{marginLeft:0}}>
                        <Select
                            className={classes.datasetSelector}
                            value={basemap}
                            onChange={this.handleDestinationBasemapChange}
                        >
                            {Object.keys(basemapTypes.basemapToProperty).map((key) => (
                                <MenuItem key={key} value={key}>{key}</MenuItem>
                            ))}
                        </Select>
                    </Grid>
                </Grid>
                <Grid item>
                    <Typography variant="body1" paragraph style={{whiteSpace: 'pre-line'}}>
                        {this.getInfoStr(basemap)}
                    </Typography>
                </Grid>
            </Grid>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        basemap: state.destinationBasemap,
    }
};

const mapDispatchToProps = (dispatch) => {
    return ({
        setDestinationBasemap: (dataset) => { dispatch(setDestinationBasemap(dataset))}
    });
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(withStyles(styles, {defaultTheme: theme})(DestinationBasemapSelector));
