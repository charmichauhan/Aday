import React, { Component } from 'react'
import TeamMemberCard from './../TeamMemberCard'
import { gql,graphql,compose } from 'react-apollo';
import { Card } from 'semantic-ui-react'

const initialState = {
	//stub
};

class ManagersComponent extends Component {
	constructor(props) {
		super(props);
		this.state = {
			...initialState,
			team_members: props.managers,
      searchManager: '',
      mappedManager: props.managers,
		};
	}

  componentWillReceiveProps(nextProps) {
    let allManagers=[];
    if(this.props.workplaceId!=""){
      let allManagersData = nextProps.allManagers && nextProps.allManagers.allManagers.edges;
      allManagers= allManagersData.filter((item)=>{
        if(item['node']['workplaceId'] == this.props.workplaceId){
          return true
        }
      })
    }
    this.setState({ mappedManager:allManagers, filteredManagers: allManagers });
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
    const filteredManagers = this.state.mappedManager.filter(mapped => {

      var toFilter =
          new RegExp(value.toLowerCase(), 'g').test(mapped.node.userByUserId.firstName.toLowerCase())||
          new RegExp(value.toLowerCase(), 'g').test(mapped.node.userByUserId.lastName.toLowerCase());
        return toFilter;
      }
    );
    this.setState({
      searchManager: value,
      filteredManagers
    });
  };

	render() {
    if (this.props.allManagers.loading) {
      return (<div>Loading</div>)
    }

		return (
			<div>
				<br/>
        <input
          type="text"
          autoFocus
          value={this.state.searchManager}
          className="form-control"
          placeholder="Search Manager"
          onChange={(e) => this.searchChange(e.target, e.target.value)}
        />
        <br/>
				<Card.Group itemsPerRow="5">
					{
            this.state.filteredManagers.map((m, i)=> <TeamMemberCard key={i} member={m['node']['userByUserId']}/>)
					}
				</Card.Group>
			</div>
		);
	}
}

const allManagers = gql`query allManagers{
  allManagers{
    edges{
      node{
        id
        nodeId
        workplaceId
        userByUserId{
          id
          avatarUrl
          firstName
          lastName
          userEmail
          userPhoneNumber
        }
      }
    }
  }
}`

const Managers = graphql(allManagers, {
  name: "allManagers"
})(ManagersComponent);
export default Managers;
