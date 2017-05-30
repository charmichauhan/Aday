import React, { Component } from 'react';
import { NavLink } from 'react-router-dom'
import { Button } from 'semantic-ui-react'

export default class Todo extends Component {
	render() {
		return (
			<div className="todo">
				<small className="todo-page-name">{this.props.pageName}</small>
				<h1>TODO</h1>
				<NavLink to="/">
					<Button>Back</Button>
				</NavLink>
			</div>
		);
	}
}
