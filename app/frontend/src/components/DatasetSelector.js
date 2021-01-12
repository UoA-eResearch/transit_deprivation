import React, {Component} from 'react';
import { connect } from 'react-redux';
import { withStyles, createMuiTheme} from '@material-ui/core/styles';
import { Grid, Select, MenuItem, Typography} from '@material-ui/core';
import { setEtaView, setDestinationDataset } from "../store/actions";

const theme = createMuiTheme({
    palette: {
        type: "light",
    },
});

const styles = (theme) => ({
    datasetSelector: {},
    etaViewSelector: {}
});

class DatasetSelector extends Component {

    handleEtaViewChange = event => {
        const { setEtaView } = this.props;
        setEtaView(event.target.value);
    }

    handleDestinationDatasetChange = event => {
        const { setDestinationDataset } = this.props;
        setDestinationDataset(event.target.value);
    }

    render() {
        const { classes, destinationDataset, etaView } = this.props;

        const infoStr = {
            "None": "No destination dataset selected",
            "Diabetes Clinics": "This dataset contains the location diabetes treatment centers in the Auckland Region."
        }

        return (
            <Grid container direction="column" spacing={2}>
                <Grid item>
                    <Typography variant="h5">Data</Typography>
                </Grid>
                <Grid container item direction="row" spacing={3} alignItems="center">
                    <Grid item>
                        <Typography>Travel Time View</Typography>
                    </Grid>
                    <Grid item>
                        <Select
                            className={classes.etaViewSelector}
                            value={etaView}
                            onChange={this.handleEtaViewChange}
                        >
                            <MenuItem value={"avail"}>Availability</MenuItem>
                            <MenuItem value={"mean"}>Mean</MenuItem>
                            <MenuItem value={"stdev"}>Standard Deviation</MenuItem>
                        </Select>
                    </Grid>
                </Grid>
                <Grid container item direction="row" spacing={3} alignItems="center">
                    <Grid item>
                        <Typography>Destinations</Typography>
                    </Grid>
                    <Grid item style={{marginLeft:32}}>
                        <Select
                            className={classes.datasetSelector}
                            value={destinationDataset}
                            onChange={this.handleDestinationDatasetChange}
                        >
                            <MenuItem value={"None"}>None</MenuItem>
                            <MenuItem value={"Diabetes Clinics"}>Diabetes Clinics</MenuItem>
                        </Select>
                    </Grid>
                </Grid>
                <Grid item>
                    <Typography variant="body1" paragraph style={{whiteSpace: 'pre-line'}}>
                        {infoStr[destinationDataset]}
                    </Typography>
                </Grid>
            </Grid>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        etaView: state.etaView,
        destinationDataset: state.destinationDataset,
    }
};

const mapDispatchToProps = (dispatch) => {
    return ({
        setEtaView: (measureType) => { dispatch(setEtaView(measureType)) },
        setDestinationDataset: (dataset) => { dispatch(setDestinationDataset(dataset))}
    });
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(withStyles(styles, {defaultTheme: theme})(DatasetSelector));
