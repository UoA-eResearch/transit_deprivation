import React, {Component} from 'react';
import { connect } from 'react-redux';
import { withStyles, createMuiTheme} from '@material-ui/core/styles';
import {Grid, Typography} from '@material-ui/core';
import uoaLogo from "../images/uoa.png";
import vicLogo from "../images/vic.png";
import ucLogo from "../images/uc.jpg";
import mbieLogo from "../images/mbie.png";

const theme = createMuiTheme({
    palette: {
        type: "light",
    },
});

const styles = (theme) => ({
    footer: {
        color: theme.palette.text.secondary,
        marginTop: theme.spacing(2),
    },
});

class Footer extends Component {

    render() {
        const { classes } = this.props;

        return (
            <Grid container item direction="column" spacing={3} alignItems="center" className={classes.footer}>
                <Grid item container direction="row" spacing={3} justify="space-around">
                    <Grid item>
                        <img src={uoaLogo} height="100" alt="University of Auckland"/>
                    </Grid>
                    <Grid item>
                        <img src={vicLogo} height="100" alt="Victoria University of Wellington"/>
                    </Grid>
                    <Grid item>
                        <img src={ucLogo} height="100" alt="University of Cantebury"/>
                    </Grid>
                    <Grid item>
                        <img src={mbieLogo} height="100" alt="Ministry of Business, Innovation and Employment"/>
                    </Grid>
                </Grid>
                {/*<Grid item>*/}
                {/*    <Typography>*/}
                {/*        Contact xyz@auckland.ac.nz*/}
                {/*    </Typography>*/}
                {/*</Grid>*/}
                <Grid item>
                    <Typography variant="body2">
                        Favicon "route" by Viktor Fedyuk (Tim P) from the Noun Project
                    </Typography>
                </Grid>
            </Grid>
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
)(withStyles(styles, {defaultTheme: theme})(Footer));