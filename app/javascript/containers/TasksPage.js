import React, { Component } from "react";
import { connect } from "react-redux";
import * as TaskActions from "../actions/taskActions";
import TaskList from "../components/TaskList";

import TaskForm from "../containers/TaskForm";
import { bindActionCreators } from "redux";

class TasksPage extends Component {
  render() {
    return (
      <div>
        <div className="row">
          <h1>Welcome To your Todo App</h1>
        </div>
        <TaskForm addTask={this.props.actions.addTask} />
        <TaskList
          tasks={this.props.tasks}
          deleteTask={this.props.actions.deleteTask}
        />
      </div>
    );
  }
}

function mapStateToProps(state, ownProps) {
  return {
    tasks: state.tasks
  };
}

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(TaskActions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(TasksPage);