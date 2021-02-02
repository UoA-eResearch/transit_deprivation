import React, {Component} from 'react';
import { connect } from 'react-redux';
import { withStyles, createMuiTheme} from '@material-ui/core/styles';
import { Grid, Select, MenuItem, Typography} from '@material-ui/core';
import { setView, setDestinationDataset } from "../store/actions";

const theme = createMuiTheme({
    palette: {
        type: "light",
    },
});

const styles = (theme) => ({
    datasetSelector: {},
    viewSelector: {}
});

class DatasetSelector extends Component {

    handleViewChange = event => {
        const { setView } = this.props;
        setView(event.target.value);
    }

    handleDestinationDatasetChange = event => {
        const { setDestinationDataset } = this.props;
        setDestinationDataset(event.target.value);
    }

    render() {
        const { classes, destinationDataset, view } = this.props;

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
                            className={classes.viewSelector}
                            value={view}
                            onChange={this.handleViewChange}
                        >
                            <MenuItem value={"avail"}>Availability</MenuItem>
                            {/*<MenuItem value={"mean"}>Mean</MenuItem>*/}
                            {/*<MenuItem value={"stdev"}>Standard Deviation</MenuItem>*/}
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
        view: state.view,
        destinationDataset: state.destinationDataset,
    }
};

const mapDispatchToProps = (dispatch) => {
    return ({
        setView: (measureType) => { dispatch(setView(measureType)) },
        setDestinationDataset: (dataset) => { dispatch(setDestinationDataset(dataset))}
    });
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(withStyles(styles, {defaultTheme: theme})(DatasetSelector));
