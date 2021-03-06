import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withStyles } from 'material-ui/styles';
import MenuItem from 'material-ui/Menu/MenuItem';
import TextField from 'material-ui/TextField';
import Button from 'material-ui/Button';
import Done from 'material-ui-icons/Done';
import Checkbox from 'material-ui/Checkbox';
import IconButton from 'material-ui/IconButton';
import Input, { InputLabel, InputAdornment } from 'material-ui/Input';
import Visibility from 'material-ui-icons/Visibility';
import {
	FormControl,
	FormHelperText,
	FormGroup,
	FormControlLabel
} from 'material-ui/Form';
import Icon from 'material-ui/Icon';
import Grid from 'material-ui/Grid';
import Select from 'material-ui/Select';
import Stopwatch from './Stopwatch';

import compose from 'recompose/compose';

const styles = theme => ({
	container: {
		display: 'flex',
		flexWrap: 'wrap'
	},
	textField: {
		marginLeft: theme.spacing.unit,
		marginRight: theme.spacing.unit,
		width: '95%',
		'margin-top': '2px',
		'margin-bottom': '2px'
	},
	completed: {
		color: '#868e96'
	},
	root: {
		flexGrow: 1
	},
	timeInput: {
		'margin-bottom': '3px',
		'margin-top': '3px'
	},
	project: {
		'background-color': 'rgba(0, 0, 0, 0.54)',
		'border-radius': '4px',
		'& svg': {
			display: 'none',
		}
	},
	projectText: {
		color: 'white',
		'font-size': '12px',
		'& div': {
			padding: '1.5px 3px',
		}
	},
	checkbox: {
		'margin-right': '0px'
	},
	noProject: {
		'font-style': 'italic',
		color: 'grey',
		'font-size': '12px',
		'& svg': {
			top: '-1.2px',
		},
		'& div': {
			padding: '1.5px 11.8px 1.5px 3px',
		}
	},
	noProjectContainer: {
		'background-color': 'none',
	}
});

class TaskItem extends Component {
	constructor(props) {
		super(props);

		const {
			name,
			id,
			completed,
			project_id,
			time,
			priority,
			project_name
		} = this.props.task;

		this.state = {
			name: name || '',
			id: id,
			editing: false,
			completed: completed || false,
			project_id: project_id || '',
			time: time || '',
			priority: priority || 3,
			hovering: false,
			project_name: project_name || ''
		};
	}

	handleOnClick = id => {
		this.props.deleteTask(id);
	};

	handleOnChange = e => {
		const { name, value } = e.target;
		this.setState({
			[name]: value,
			editing: true
		});
	};

	handleOnBlur = e => {
		if (this.state.editing) {
			this.props.updateTask({ ...this.state });
			this.setState({
				editing: false
			});
		}
	};

	handleOnCheck = (e, id) => {
		const checked = e.target.checked;
		this.setState({
			completed: checked
		});
		this.props.checkTask({ id: id, completed: checked });
	};

	priorityClass = () => {
		if (this.props.task.priority === 1) {
			return { color: '#E53935' };
		} else if (this.props.task.priority === 2) {
			return { color: '#FB8C00' };
		} else {
			return { color: 'grey' };
		}
	};

	render() {
		const { classes, autoFocus } = this.props;
		const { task } = this.props;
		const { name, time, project_name, project_id } = this.state;

		return (
			<div className={classes.root}>
				<form className={classes.container} noValidate autoComplete="off">
					<Grid container spacing={8} alignItems="center">
						{/* Check */}
						<Grid item>
							<FormControlLabel
								className={classes.checkbox}
								control={
									<Checkbox
										style={this.priorityClass()}
										checked={task.completed}
										id={`task_checkbox_${task.id}`}
										onChange={e => this.handleOnCheck(e, this.state.id)}
									/>
								}
							/>
						</Grid>

						{/* Task Name Input */}
						<Grid item xs>
							<FormControl className={(classes.formControl, classes.textField)}>
								<Input
									className={task.completed ? classes.completed : ''}
									id="taskFormInput"
									placeholder="Enter a Task Name"
									name="name"
									disableUnderline={true}
									value={name}
									onChange={e => this.handleOnChange(e)}
									onBlur={e => this.handleOnBlur(e, task.id)}
								/>
							</FormControl>
						</Grid>

						{/* Projects */}
						<Grid item>
							<FormControl
								className={
									project_name || project_id ? (classes.formControl, classes.textField, classes.project) : classes.noProjectContainer
								}
							>
								<Select
									className={project_name || project_id ? classes.projectText : classes.noProject}
									id="projectSelect"
									name="project_id"
									title="Project"
									disableUnderline={true}
									value={project_id}
									onChange={e => this.handleOnChange(e)}
									onBlur={e => this.handleOnBlur(e, task.id)}
									displayEmpty
								>
									<MenuItem value="" key="empty">{project_name ? project_name : 'No Project'}</MenuItem>
									{this.props.projects.map(project => (
										<MenuItem key={`project_${project.id}`} value={project.id}>
											{project.name}
										</MenuItem>
									))}
								</Select>
							</FormControl>
						</Grid>

						<Grid item sm={1} xs={2}>
							<Stopwatch
								time={time}
								task={task}
								handleOnChange={this.handleOnChange}
								handleOnBlur={this.handleOnBlur}
								projects={this.props.projects}
							/>
						</Grid>

						{/* Priorities */}
						{/* <Grid item xs={1}>
							<FormControl
								className={(classes.formControl, classes.textField)}
								margin="normal"
							>
								<Select
									className={task.completed ? classes.completed : ''}
									id="prioritySelect"
									name="priority"
									title="Priority"
									disableUnderline={true}
									value={this.state.priority}
									onChange={e => this.handleOnChange(e)}
									onBlur={e => this.handleOnBlur(e, task.id)}
									startAdornment={
										<InputAdornment position="start">
											<Icon>priority_high</Icon>
										</InputAdornment>
									}
								>
									{[1, 2, 3].map(priority => (
										<MenuItem key={`priority_${priority}`} value={priority}>
											{priority}
										</MenuItem>
									))}
								</Select>
							</FormControl>
						</Grid> */}

						{/* Delete */}
						<Grid item>
							<IconButton
								aria-label="Delete"
								onClick={() => this.handleOnClick(task.id)}
							>
								<Icon>delete</Icon>
							</IconButton>
						</Grid>
					</Grid>
				</form>
				<hr />
			</div>
		);
	}
}

function mapStateToProps(state, ownProps) {
	return {
		projects: state.projects
	};
}

export default compose(withStyles(styles), connect(mapStateToProps))(TaskItem);
