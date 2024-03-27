import axios from "axios";
import React, { Component } from "react";
import { Link } from "react-router-dom";

const Todo = (props) => (
  <tr>
    <td className={props.todo.todo_complete ? "completed" : ""}>
      {props.todo.todo_description}
    </td>
    <td className={props.todo.todo_complete ? "completed" : ""}>
      {props.todo.todo_responsible}
    </td>
    <td className={props.todo.todo_complete ? "completed" : ""}>
      {props.todo.todo_priority}
    </td>
    <td>
      <Link to={"/edit/" + props.todo._id}>Edit</Link>
      <Link
        style={{ marginLeft: "10px" }}
        to="/"
        onClick={() =>
          axios
            .delete(
              `${process.env.API_URI}/delete/${props.todo._id}`
            )
            .then(() => window.location.reload())
            .catch((error) => console.error("Delete error:", error))
        }
      >
        Delete
      </Link>
    </td>
  </tr>
);

export default class TodosList extends Component {
  constructor(props) {
    super(props);
    this.state = { todos: [] };
  }

  componentDidMount() {
    axios
      .get(process.env.API_URI)
      .then((response) => {
        this.setState({ todos: response.data });
      })
      .catch((error) => console.error("Fetch error:", error));
  }

  componentDidUpdate() {
    axios
      .get(process.env.API_URI)
      .then((response) => {
        this.setState({ todos: response.data });
      })
      .catch((error) => console.error("Fetch error:", error));
  }

  todoList() {
    return this.state.todos.map(function (currentTodo, i) {
      return <Todo todo={currentTodo} key={i} />;
    });
  }

  render() {
    return (
      <div>
        <h3>Todos List</h3>
        <table className="table table-striped" style={{ marginTop: 20 }}>
          <thead>
            <tr>
              <th>Description</th>
              <th>Responsible</th>
              <th>Priority</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>{this.todoList()}</tbody>
        </table>
      </div>
    );
  }
}
