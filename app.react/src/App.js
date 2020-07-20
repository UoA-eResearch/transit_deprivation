import { hot } from 'react-hot-loader/root';
import React, { Component} from "react";

import { makeStyles, withStyles, createMuiTheme} from '@material-ui/core/styles';

//import purple from '@material-ui/core/colors/purple';
//import green from '@material-ui/core/colors/green';

import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Slider from '@material-ui/core/Slider';
import Typography from '@material-ui/core/Typography';

const theme = createMuiTheme({

    // palette: {
    //     background: {
    //         paper: purple[500]
    //     }
    // },
});

const styles = (theme) => ({
    root: {

    },
    paper: {
        padding: theme.spacing(2),
        textAlign: "left",
        color: theme.palette.text.secondary,
        background: theme.palette.background.paper
    },
    slider: {
        textAlign: "center",
    }
});

function TimeLimitSlider(props) {
    const classes = makeStyles(styles)();

    return (
        <div>
            <Typography gutterBottom>
                Time Limit: {props.value} minutes
            </Typography>
            <Slider
                className={classes.slider}
                defaultValue={60}
                onChange={(event, value) => props.onChange(value)}
                getAriaValueText={(value) => {`${value}`}}
                aria-labelledby="discrete-slider"
                valueLabelDisplay="auto"
                step={10}
                marks
                min={10}
                max={300}
            />
        </div>
    );
}

class App extends Component{

    constructor(props){
        super(props);
        this.state = {
            timeLimit: 60, // minutes
        }
    }

    _handleTimeLimitChange(value){
        //console.log(`called with ${value}`)
        this.setState({timeLimit: value});
    }

    render(){

        const {classes} = this.props;

        return (
            <div>
                <Grid container spacing={3}>
                    <Grid item xs={4}>
                        <Grid container direction="column" spacing={3}>
                            <Grid item>
                                <Paper className={classes.paper}>
                                    <Typography variant="h4" gutterBottom>
                                        Transit & Deprivation
                                    </Typography>
                                    <Typography variant="body1">
                                        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
                                    </Typography>
                                </Paper>
                            </Grid>
                            <Grid item>
                                <Paper className={classes.paper}>
                                    <TimeLimitSlider
                                        value={this.state.timeLimit}
                                        onChange={(value) => this._handleTimeLimitChange(value)}
                                    ></TimeLimitSlider>
                                </Paper>
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item xs={8}>
                        <Paper className={classes.paper}>
                            MAP
                        </Paper>
                    </Grid>
                </Grid>
            </div>
        );
    }
}
console.log(theme);
export default hot(withStyles(styles, {defaultTheme: theme})(App));