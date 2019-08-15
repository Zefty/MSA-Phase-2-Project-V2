import React from 'react';

import Button from '@material-ui/core/Button';

import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
// import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Slide from '@material-ui/core/Slide';
import { TransitionProps } from '@material-ui/core/transitions';

// import clsx from 'clsx';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
// import MenuItem from '@material-ui/core/MenuItem';
import TextField from '@material-ui/core/TextField';

interface IProps{
    openWindow: boolean,
    handleClose: any,
    updateWorkout: any,
    workoutId: number,
    workoutName: string,
    workoutDescription: string, 
    isDarkMode: boolean,
}

interface IState{
    workoutName: string,
    workoutDescription: string,
    exerciseData: any,
    tempRemoveExercise: any,
}

const Transition = React.forwardRef<unknown, TransitionProps>(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      display: 'flex',
      flexWrap: 'wrap',
    },
    textField: {
      marginLeft: theme.spacing(0),
      marginRight: theme.spacing(0),
    },
    dense: {
      marginTop: 0,
    },
    // menu: {
    // //   width: 200,
    // },
  }),
);

export default class EditWindow extends React.Component<IProps, IState> {
    public constructor(props:any) {
        super(props);
        this.state = {
            workoutName: "",
            workoutDescription: "",
            exerciseData: [],
            tempRemoveExercise: [],
        }
        
        
    }


    private openWorkoutDialog = () => {
        if (this.props.workoutId !== 0) {
            this.updateWorkoutContents()
        } else if (this.props.workoutId === 0) {
            this.setState({exerciseData: [{
                "exerciseId": 0,
                "workoutId": 0,
                "exerciseName": "",
                "exerciseReps": "",
                "exerciseSets": "",
                "workout": null
                }]})
        }

        this.setState({workoutName: this.props.workoutName})
        this.setState({workoutDescription: this.props.workoutDescription})
    }

    public updateWorkoutContents = () => {
        fetch('https://fittracapi.azurewebsites.net/api/Exercises/FilterdExercise?WorkoutId='+this.props.workoutId, {
            method:'GET'
        }).then((ret:any) => {
            return ret.json();
        }).then((output:any) => {
            // console.log(output)
            this.setState({exerciseData: output})
            // console.log(this.state.exerciseData)
        })
    }

    private changeWorkoutName = (event: any) => { 
        this.setState({workoutName: event.target.value})
    }

    private changeWorkoutDescription = (event: any) => { 
        this.setState({workoutDescription: event.target.value})
    }





    private changeExerciseName = (event: any, index: number) => {
        var newExerciseData = this.state.exerciseData
        newExerciseData[index].exerciseName = event.target.value
        this.setState({exerciseData: newExerciseData})
    }

    private changeExerciseReps= (event: any, index: number) => { 
        const newExerciseData = this.state.exerciseData
        console.log(newExerciseData)
        newExerciseData[index].exerciseReps = event.target.value
        this.setState({exerciseData: newExerciseData})
    }

    private changeExerciseSets = (event: any, index: number) => { 
        const newExerciseData = this.state.exerciseData
        console.log(newExerciseData)
        newExerciseData[index].exerciseSets = event.target.value
        this.setState({exerciseData: newExerciseData})
    }



    public render() {
        
        
        return (
            <div>
                
                <Dialog
                maxWidth={"md"}
                fullWidth
                open={this.props.openWindow}
                onEnter={this.openWorkoutDialog}
                TransitionComponent={Transition}
                keepMounted
                onClose={this.props.handleClose}
                aria-labelledby="alert-dialog-slide-title"
                aria-describedby="alert-dialog-slide-description"
                >
            

                <DialogTitle id="alert-dialog-slide-title">
                
                    <TextField
                        id="outlined-full-width"
                        value={this.state.workoutName}
                        onChange={this.changeWorkoutName}
                        placeholder="New Workout"
                        helperText="Enter Name of Workout"
                        fullWidth
                        margin="normal"
                        variant="outlined"
                    />

                    {/* <DialogContentText id="alert-dialog-slide-description">
                        Add your workout routine. You can add exercises with the + button and 
                        type in the number of sets, time, and etc in the boxes. 
                    </DialogContentText> */}

                </DialogTitle>
                <DialogContent>
                    <this.body/>
                </DialogContent>
                <DialogActions>
                    <div className="container" style={{padding: 0, margin: 0}}>
                        <Button onClick={() => this.incrCounter()}>
                        Add
                        </Button>
                        <Button onClick={() => this.decrCounter()}>
                        Remove
                        </Button>
                    </div>
                    
                    <Button onClick={this.uploadWorkout}>
                        Done
                    </Button>
                </DialogActions>
                </Dialog>
            </div>
        );
    }

    private uploadWorkout = () => {
        const workoutData = {
            "workoutId": this.props.workoutId,
            "workoutName": this.state.workoutName,
            "workoutDescription": this.state.workoutDescription,
            "isFavourite": false,
            "exercises": this.state.exerciseData
        }
        if (this.props.workoutId === 0) {
            fetch('https://fittracapi.azurewebsites.net/api/Workouts', {
                body: JSON.stringify(workoutData),
                headers: {
                    Accept: "text/plain",
                    "Content-Type": "application/json-patch+json"
                },
                method:'POST'
            }).then((response: any) => {
                if (response.ok) {
                    this.props.handleClose()   
                    this.props.updateWorkout()
                } else {
                    
                }
            })
        } else {
            fetch('https://fittracapi.azurewebsites.net/api/Workouts/EditWorkouts?id='+this.props.workoutId, {
                body: JSON.stringify(workoutData),
                headers: {
                    Accept: "text/plain",
                    "Content-Type": "application/json-patch+json"},
                method: 'PUT'
            }).then((response : any) => {
                if (response.ok) {
                    this.props.updateWorkout()
                    this.props.handleClose()   
                } else {

                }
            })

            this.state.tempRemoveExercise.forEach((id: any) => {
                fetch('https://fittracapi.azurewebsites.net/api/Exercises/'+id, {
                    method: 'DELETE'
                }).then((response : any) => {
                    if (response.ok) {
                        console.log("ok")
                    }
                })  
            });

        }
        
    }

    private incrCounter = () => {
        this.state.exerciseData.push({
            "exerciseId": 0,
            "workoutId": this.props.workoutId,
            "exerciseName": "",
            "exerciseReps": "",
            "exerciseSets": "",
            "workout": null
            }) 
        console.log(this.state.exerciseData)
        this.forceUpdate()
    }

    private decrCounter = () => {
        if (this.state.exerciseData.length > 1) {
            var temp: any = this.state.exerciseData.pop()
            if (temp.exerciseId !== 0) {
                this.state.tempRemoveExercise.push(temp.exerciseId)

            }
            console.log(this.state.exerciseData)
            console.log(this.state.tempRemoveExercise)

        }
        this.forceUpdate()
    }

    private body = () => {
        const classes = useStyles();
        return (
            <div>
                <TextField
                id="outlined-Exercise"
                value={this.state.workoutDescription}
                onChange={this.changeWorkoutDescription}
                label={"Description"}
                placeholder={"Description"}
                fullWidth
                className={classes.textField}
                margin="normal"
                variant="outlined"
                multiline
                />
                {this.state.exerciseData.map((exerciseData: any, index: number) =>
                    <div className="row" key={index}>
                        <div className="col-sm-8">
                            <TextField
                            id="outlined-Exercise"
                            value={exerciseData.exerciseName}
                            onChange={(event) => {this.changeExerciseName(event, index)}}
                            label={"Exercise Name"}
                            placeholder={"Exercise Name"}
                            fullWidth
                            className={classes.textField}
                            margin="normal"
                            variant="outlined"
                            />
                        </div>

                        <div className="col-sm-2">
                            <TextField
                            id="outlined-Reps"
                            value={exerciseData.exerciseReps}
                            onChange={(event) => {this.changeExerciseReps(event, index)}}
                            label="Reps"
                            placeholder="Reps"
                            fullWidth
                            className={classes.textField}
                            margin="normal"
                            variant="outlined"
                            />
                        </div>

                        <div className="col-sm-2">
                            <TextField
                            id="outlined-Sets"
                            value={exerciseData.exerciseSets}
                            onChange={(event) => {this.changeExerciseSets(event, index)}}
                            label="Sets"
                            placeholder="Sets"
                            fullWidth
                            className={classes.textField}
                            margin="normal"
                            variant="outlined"
                            />
                        </div>
                    </div>
                )}
            </div>
        );
    }
}