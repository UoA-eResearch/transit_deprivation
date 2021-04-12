import React, {Component} from 'react';
import { connect } from 'react-redux';
import { withStyles, createMuiTheme} from '@material-ui/core/styles';
import { Grid, Select, MenuItem, Typography} from '@material-ui/core';
import { setDestinationDataset } from "../store/actions";
import * as destinationTypes from "./destinationTypes";

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

    handleDestinationDatasetChange = event => {
        const { setDestinationDataset } = this.props;
        setDestinationDataset(event.target.value);
    }

    render() {
        const { classes, destinationDataset } = this.props;

        const infoStr = {
            [destinationTypes.DESTINATION_NONE]: "No destination dataset selected",
            [destinationTypes.DESTINATION_DIABETES_CLINICS]: "This dataset contains the location diabetes treatment centers in the Auckland Region."
        }

        return (
            <Grid container direction="column" spacing={2}>
                <Grid container item direction="row" spacing={3} alignItems="center">
                    <Grid item>
                        <Typography>Destinations</Typography>
                    </Grid>
                    <Grid item style={{marginLeft:0}}>
                        <Select
                            className={classes.datasetSelector}
                            value={destinationDataset}
                            onChange={this.handleDestinationDatasetChange}
                        >
                            <MenuItem value={destinationTypes.DESTINATION_NONE}>{destinationTypes.DESTINATION_NONE}</MenuItem>
                            <MenuItem value={destinationTypes.DESTINATION_DIABETES_CLINICS}>{destinationTypes.DESTINATION_DIABETES_CLINICS}</MenuItem>
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
        destinationDataset: state.destinationDataset,
    }
};

const mapDispatchToProps = (dispatch) => {
    return ({
        setDestinationDataset: (dataset) => { dispatch(setDestinationDataset(dataset))}
    });
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(withStyles(styles, {defaultTheme: theme})(DatasetSelector));
