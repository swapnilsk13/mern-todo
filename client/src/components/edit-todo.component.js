import axios from "axios";
import React, { Component } from "react";
import { useNavigate, useParams } from "react-router";

const withRouter = WrappedComponent => props => {
	const params = useParams();
	const navigate = useNavigate();

	return <WrappedComponent {...props} params={params} navigate={navigate} />;
};

class EditTodo extends Component {
	constructor(props) {
		super(props);

		this.onChangeTodoDescription = this.onChangeTodoDescription.bind(this);
		this.onChangeTodoResponsible = this.onChangeTodoResponsible.bind(this);
		this.onChangeTodoPriority = this.onChangeTodoPriority.bind(this);
		this.onChangeTodoCompleted = this.onChangeTodoCompleted.bind(this);
		this.onSubmit = this.onSubmit.bind(this);

		this.state = {
			todo_description: "",
			todo_responsible: "",
			todo_priority: "",
			todo_complete: false,
		};
	}

	componentDidMount() {
		console.log(this.props);
		axios
      .get("https://mern-todo-server-phi.vercel.app/" + this.props.params.id)
      .then((response) => {
        console.log("response", response);

        this.setState({
          todo_description: response.data[0].todo_description,
          todo_responsible: response.data[0].todo_responsible,
          todo_priority: response.data[0].todo_priority,
          todo_complete: response.data[0].todo_complete,
        });
      })
      .catch(function (error) {
        console.log(error);
      });
	}

	onChangeTodoDescription(e) {
		this.setState({
			todo_description: e.target.value,
		});
	}

	onChangeTodoResponsible(e) {
		this.setState({
			todo_responsible: e.target.value,
		});
	}

	onChangeTodoPriority(e) {
		this.setState({
			todo_priority: e.target.value,
		});
	}

	onChangeTodoCompleted(e) {
		this.setState({
			todo_complete: !this.state.todo_complete,
		});
	}

	onSubmit(e) {
		e.preventDefault();
		const obj = {
			todo_description: this.state.todo_description,
			todo_responsible: this.state.todo_responsible,
			todo_priority: this.state.todo_priority,
			todo_complete: this.state.todo_complete,
		};
		console.log(obj);
		axios
      .put(
        "https://mern-todo-server-phi.vercel.app/update/" +
          this.props.params.id,
        obj
      )
      .then((res) => console.log(res.data));

		this.props.navigate("/");
	}

	render() {
		return (
			<div>
				<h3 align='center'>Update Todo</h3>
				<form onSubmit={this.onSubmit}>
					<div className='form-group'>
						<label>Description: </label>
						<input
							type='text'
							className='form-control'
							value={this.state.todo_description}
							onChange={this.onChangeTodoDescription}
						/>
					</div>
					<div className='form-group'>
						<label>Responsible: </label>
						<input
							type='text'
							className='form-control'
							value={this.state.todo_responsible}
							onChange={this.onChangeTodoResponsible}
						/>
					</div>
					<div className='form-group'>
						<div className='form-check form-check-inline'>
							<input
								className='form-check-input'
								type='radio'
								name='priorityOptions'
								id='priorityLow'
								value='Low'
								checked={this.state.todo_priority === "Low"}
								onChange={this.onChangeTodoPriority}
							/>
							<label className='form-check-label'>Low</label>
						</div>
						<div className='form-check form-check-inline'>
							<input
								className='form-check-input'
								type='radio'
								name='priorityOptions'
								id='priorityMedium'
								value='Medium'
								checked={this.state.todo_priority === "Medium"}
								onChange={this.onChangeTodoPriority}
							/>
							<label className='form-check-label'>Medium</label>
						</div>
						<div className='form-check form-check-inline'>
							<input
								className='form-check-input'
								type='radio'
								name='priorityOptions'
								id='priorityHigh'
								value='High'
								checked={this.state.todo_priority === "High"}
								onChange={this.onChangeTodoPriority}
							/>
							<label className='form-check-label'>High</label>
						</div>
					</div>
					<div className='form-check'>
						<input
							className='form-check-input'
							id='completedCheckbox'
							type='checkbox'
							name='completedCheckbox'
							onChange={this.onChangeTodoCompleted}
							checked={this.state.todo_complete}
							value={this.state.todo_complete}
						/>
						<label className='form-check-label' htmlFor='completedCheckbox'>
							Completed
						</label>
					</div>

					<br />

					<div className='form-group'>
						<input
							type='submit'
							value='Update Todo'
							className='btn btn-primary'
						/>
					</div>
				</form>
			</div>
		);
	}
}

export default withRouter(EditTodo);
