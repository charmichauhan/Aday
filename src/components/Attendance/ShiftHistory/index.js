import React, { Component } from 'react';
import Paper from 'material-ui/Paper';
import { Grid, GridColumn, Image, Rating } from 'semantic-ui-react';
import moment from 'moment';
import find from 'lodash/find';

import Modal from '../../helpers/Modal';
import CircleButton from '../../helpers/CircleButton';

const styles = {
  paperStyle: {
    borderRadius: 6
  }
};

const initialState = {
  showMorePopup: false,
  history: [{
    user: {
      avatarUrl: '/images/employee/1.jpg',
      firstName: 'Jose',
      lastName: 'Cartose'
    },
    id: 1,
    startTime: new Date().toUTCString(),
    endTime: new Date().toUTCString(),
    wageCosts: 150.86,
    rating: 0
  }, {
    user: {
      avatarUrl: '/images/employee/3.jpg',
      firstName: 'ADELAIDE',
      lastName: 'BOWERS'
    },
    id: 2,
    startTime: new Date().toUTCString(),
    endTime: new Date().toUTCString(),
    wageCosts: 150.86,
    rating: 3
  }, {
    user: {
      avatarUrl: '/images/employee/2.jpg',
      firstName: 'Adele',
      lastName: 'Travis'
    },
    id: 3,
    startTime: new Date().toUTCString(),
    endTime: new Date().toUTCString(),
    wageCosts: 150.86,
    rating: 4
  }, {
    user: {
      avatarUrl: '/images/employee/4.jpg',
      firstName: 'Coral',
      lastName: 'Brown'
    },
    id: 4,
    startTime: new Date().toUTCString(),
    endTime: new Date().toUTCString(),
    wageCosts: 150.86,
    rating: 5
  }, {
    user: {
      avatarUrl: '/images/employee/5.jpg',
      firstName: 'Dylan',
      lastName: 'Lee'
    },
    id: 5,
    startTime: new Date().toUTCString(),
    endTime: new Date().toUTCString(),
    wageCosts: 150.86,
    rating: 5
  }]
};

export default class ShiftHistory extends Component {
  constructor(props) {
    super(props);
    this.state = initialState;
  }

  showMoreHistory = () => {
    console.log('Show more button clicked');
    const remainingRattings = this.state.history.filter((shift) => shift.rating < 1 );
    if (remainingRattings.length) this.setState({ showMorePopup: true });
  };

  onRatingChange = (e, data) => {
    debugger;
  };

  closeModalPopup = () => {
    this.setState({ showMorePopup: false });
  };

  render() {
    return (
      <div className="content shift-history-content">
        {this.state.history &&
        this.state.history.map((shift, index) => <Paper style={styles.paperStyle} zDepth={1} key={index} className="content-row">
          <Grid>
            <GridColumn width={4}>
            <div className="wrapper-element text-left">
              <Image src={shift.user.avatarUrl} shape="circular" size="mini" className="display-inline" />
              <div className="text-uppercase display-inline">
                <span className="font600">{shift.user.firstName} </span>
                <span className="font300"> {shift.user.lastName} </span>
              </div>
            </div>
            </GridColumn>
            <GridColumn width={3}>
             <div className="wrapper-element">
              <span>{moment(shift.startTime).format('ddd, DD MMM YYYY')}</span>
              <p className="text-uppercase">Start Date</p>
             </div>
            </GridColumn>
            <GridColumn width={2}>
             <div className="wrapper-element">
              <span>{moment(shift.startTime).format('HH:MM A')}</span>
              <p className="text-uppercase">Start Time</p>
             </div>
            </GridColumn>
            <GridColumn width={2}>
             <div className="wrapper-element">
              <span>{moment(shift.endTime).format('HH:MM A')}</span>
              <p className="text-uppercase">End Time</p>
             </div>
            </GridColumn>
            <GridColumn width={2}>
             <div className="wrapper-element">
              <span>${shift.wageCosts}</span>
              <p className="text-uppercase">Wage Costs</p>
             </div>
            </GridColumn>
            <GridColumn width={3}>
             <div className="wrapper-element">
              <span className="rating">
                <Rating
                  icon='star'
                  size='massive'
                  clearable
                  defaultRating={shift.rating}
                  maxRating={5}
                  onRate={this.onRatingChange} />
              </span>
              <p className="text-uppercase">Sushi chef rating</p>
             </div>
            </GridColumn>
          </Grid>
        </Paper>)}
        <div className="btn-circle-center content-row">
          <CircleButton type="blue" title="SEE MORE" handleClick={() => this.showMoreHistory()} />
        </div>
        <Modal
          title="SUBMIT RATINGS"
          isOpen={this.state.showMorePopup}
          message="Please submit rating before viewing history"
          action={
            [{ type: 'blue', title: 'Confirm', handleClick: this.closeModalPopup, image: false }]
          }
          closeAction={this.closeModalPopup} />
      </div>
    )
  }
}
