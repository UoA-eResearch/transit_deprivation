import React, {Component} from 'react';
import { connect } from 'react-redux';
import { withStyles, createTheme} from '@material-ui/core/styles';
import { Grid, Select, MenuItem, Typography} from '@material-ui/core';
import { setDestinationDataset } from "../store/actions";
import * as destinationTypes from "./destinationTypes";

const theme = createTheme({
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
        const { forwardedRef, classes, destinationDataset } = this.props;

        return (
            <Grid container direction="column" spacing={2} ref={forwardedRef}>
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
                            {Object.keys(destinationTypes.destinationToProperty).map((key) => (
                                <MenuItem key={key} value={key}>{key}</MenuItem>
                            ))}

                        </Select>
                    </Grid>
                </Grid>
                <Grid item>
                    <Typography variant="body1" paragraph style={{whiteSpace: 'pre-line'}}>
                        {destinationTypes.destinationToProperty[destinationDataset].info}
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
