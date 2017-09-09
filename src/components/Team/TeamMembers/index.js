import React, { Component } from 'react'
import TeamMemberCard from './../TeamMemberCard'
import { gql, graphql } from 'react-apollo';
import { Card } from 'semantic-ui-react'

const initialState = {
	//stub
};

/**
 * The TeamMembersComponent lists all team members that work at the workplace and brand combination chosen on the side menu.
 * @author Riya Shah
 */
class TeamMembersComponent extends Component {
	constructor(props) {
		super(props);
		this.state = {
			...initialState,
			team_members: props.team_members,
      searchTeamMember:'',
      mappedTeamMembers:props.team_members,
		};
	}


  componentWillReceiveProps(nextProps) {

    let teamMembers = nextProps.allTeamMembers && nextProps.allTeamMembers.allEmployees.edges;

    let mappedTeamMembers = [];

    if(localStorage.getItem("workplaceId")){
      teamMembers.map((value , i) => {
        if ( value['node']['primaryWorkplace'] == localStorage.getItem("workplaceId") ) {
          mappedTeamMembers.push(value)
        }
      })
    } else {
      mappedTeamMembers = teamMembers;
    }
    this.setState({ mappedTeamMembers, filteredTeamMembers: mappedTeamMembers });
  }

	handleDeleteClick = (event) => {
		event.preventDefault();
		console.log('Delete button clicked');
	};

	handleDrawerSubmit = (event) => {
		event.preventDefault();
		this.setState({ open: false });
	};

	closeDrawer = (event) => {
		event.preventDefault();
		this.setState({ open: false });
	};

	openBrandDrawer = (brand) => {
		this.setState({ open: true, drawerBrand: brand });
	};



  searchChange = (event, value) => {
     const filteredTeamMembers = this.state.mappedTeamMembers.filter(mapped => {
     var toFilter =
         new RegExp(value.toLowerCase(), 'g').test(mapped.node.userByUserId.firstName.toLowerCase())||
         new RegExp(value.toLowerCase(), 'g').test(mapped.node.userByUserId.lastName.toLowerCase());
     return toFilter;
    }
    );
    this.setState({
      searchTeamMember: value,
      filteredTeamMembers
    });
  };


	/**
	 * @param {string} allTeamMembers - the graphql query used to retrieve team members
	 * @return {TeamMemberCard} cards of team members for the current workplace + brand
	 */
	render() {
	    if(this.props.allTeamMembers.loading) {
	      return (<div>Loading</div>);
	    }

		return (
			<div>
				<br/>
        <input
          type="text"
          ref={(input) => this.searchField = input}
          autoFocus
          value={this.state.searchTeamMember}
          className="form-control"
          placeholder="Search Team member"
          onChange={(e) => this.searchChange(e.target, e.target.value)}
          />
        <br/>
				<Card.Group itemsPerRow="8">
					{
            			this.state.filteredTeamMembers.map((m, i)=>
            				    <TeamMemberCard key={i} member={m['node']['userByUserId'] } userId={m['node']['userByUserId']['id']}/>
            			)
					}
				</Card.Group>
			</div>
		);
	}
}

const allUsers = gql`
    query allEmployees($corporationId: Uuid! ){
        allEmployees(condition: { corporationId: $corporationId, isManager: false }) {
            edges{
                node{
                  id
                  primaryWorkplace
                  userByUserId{
                    id
                    firstName
                    lastName
                    avatarUrl
                    userPhoneNumber
                    userEmail
                  }
                }
            }
        }
    }
    `

const TeamMembers = graphql(allUsers, {
  options: (ownProps) => ({
    variables: {
      corporationId: localStorage.getItem('corporationId')
    }
  }),
  name:"allTeamMembers"
},
)(TeamMembersComponent);
export default TeamMembers
