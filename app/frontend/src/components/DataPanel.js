import React, {Component} from 'react';
import { connect } from 'react-redux';
import { withStyles, createTheme} from '@material-ui/core/styles';
import {Divider, Grid, Paper, Typography} from '@material-ui/core';
import DatasetSelector from "./DatasetSelector";
import DestinationBasemapSelector from "./DestinationBasemapSelector";
import OriginBasemapSelector from "./OriginBasemapSelector";

const theme = createTheme({
    palette: {
        type: "light",
    },
});

const styles = (theme) => ({
    paper: {
        padding: theme.spacing(2),
        color: theme.palette.text.secondary,
        background: theme.palette.background.paper
    },
});

class DataPanel extends Component {

    render() {
        const { classes } = this.props;

        return (
            <Paper className={classes.paper}>
                <Grid container direction="column" spacing={2}>
                    <Grid item>
                        <Typography variant="h5">Data</Typography>
                    </Grid>
                    <Grid item>
                        <DatasetSelector />
                    </Grid>
                    <Grid item>
                        <Divider />
                    </Grid>
                    <Grid item>
                        <DestinationBasemapSelector />
                    </Grid>
                    <Grid item>
                        <Divider />
                    </Grid>
                    <Grid item>
                        <OriginBasemapSelector />
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
)(withStyles(styles, {defaultTheme: theme})(DataPanel));