import React, { Component } from 'react'
import { List, ListItem } from 'material-ui/List';
import Edit from 'material-ui/svg-icons/image/edit';
import IconButton from 'material-ui/IconButton';
import EditCompanyDrawer from './EditCompanyDrawer';

const styles = {
  drawer: {
    width: 600
  }
};

const initialState = {
  open: false
};

export default class Company extends Component {
  constructor(props) {
    super(props);
    this.state = initialState;
  }

  handleClick = (event) => {
    this.setState({ open: true });
  };

  handleSubmit = (event) => {
    this.setState({ open: false });
  };

  closeDrawer = (event) => {
    this.setState({ open: false });
  };

  render() {
    return (
      <div className="content company-content">
        <List>
          {this.props.companies &&
          this.props.companies.map((company) =>
            <ListItem
              key={company.id}
              primaryText={company.name}
              rightIconButton={
                <IconButton onClick={this.handleClick}><Edit /></IconButton>
              }
            />
          )}
        </List>
        <EditCompanyDrawer
          width={styles.drawer.width}
          open={this.state.open}
          handleSubmit={this.handleSubmit}
          closeDrawer={this.closeDrawer} />
      </div>
    )
  }
}
