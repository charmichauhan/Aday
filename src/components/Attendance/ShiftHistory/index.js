import React, { Component } from 'react';
import Paper from 'material-ui/Paper';
import { Grid, GridColumn, Image, Rating } from 'semantic-ui-react';
import moment from 'moment';
import { withApollo } from 'react-apollo';
import { findLastIndex, cloneDeep } from 'lodash';

import { shiftHistoryResolvers } from '../attendance.resolvers';
import Loading from '../../helpers/Loading';
import Modal from '../../helpers/Modal';
import CircleButton from '../../helpers/CircleButton';

const styles = {
  paperStyle: {
    borderRadius: 6
  }
};

const initialState = {
  showMorePopup: false,
  corporationId: localStorage.getItem('corporationId'),
  workplaceId: localStorage.getItem('workplaceId'),
};

class ShiftHistory extends Component {
  constructor(props) {
    super(props);
    this.state = initialState;
  }

  componentDidMount() {
    if (this.state.workplaceId) {
      this.getShiftHistoryDetails(this.state.workplaceId, this.state.corporationId);
    }
  }

  componentWillReceiveProps() {
    const workplaceId = localStorage.getItem('workplaceId');
    const corporationId = localStorage.getItem('corporationId');
    this.setState({ workplaceId, corporationId });
    if (workplaceId && this.state.workplaceId !== workplaceId) {
      this.getShiftHistoryDetails(workplaceId, corporationId);
    }
  }

  getShiftHistoryDetails = (workplaceId, corporationId) => {
    this.props.client.query({
      query: shiftHistoryResolvers.shiftHistoryQuery,
      variables: { workplaceId, corporationId }
    }).then((res) => {
      if (res.data && res.data.allShifthistories && res.data.allShifthistories.nodes) {
        const shiftHistory = res.data.allShifthistories.nodes;
        const ShiftHistoryFinal = [];
        if (shiftHistory) {
          shiftHistory.map((v) => {
            if (ShiftHistoryFinal[v.workerId + v.positionId]) {
            } else {
              ShiftHistoryFinal[v.workerId + v.positionId] = v
            }
          });
        }
        const shiftValues = Object.values(ShiftHistoryFinal);
        this.setState({ shiftHistoryAll: shiftValues, shiftHistory: this.filterUnratedShifts(shiftValues) });
      }
    }).catch(err => console.log('Error loading shift history'));
  };

  showMoreHistory = () => {
    const remainingRatings = this.state.shiftHistoryAll.filter((shift) => shift.rating < 1);
    if (remainingRatings.length) this.setState({ showMorePopup: true });
  };

  filterUnratedShifts = (shifts) => {
    return shifts.filter(shift => (!shift.rating || shift.rating < 1));
  };

  onRatingChange = (shift, data) => {
    this.props.client.mutate({
      mutation: shiftHistoryResolvers.updateJobRatingMutation,
      variables: {
        id: shift.id,
        jobInfo: { id: shift.id, rating: data.rating }
      }
    }).then(() => {
      const shiftHistoryAll = cloneDeep(this.state.shiftHistoryAll);
      const shiftIndex = findLastIndex(shiftHistoryAll, { id: shift.id });
      if (shiftIndex !== -1) {
        shiftHistoryAll[shiftIndex].rating = data.rating;
        setTimeout(() => {
          this.setState({ shiftHistoryAll, shiftHistory: this.filterUnratedShifts(shiftHistoryAll) });
        }, 200);
      }
    }).catch(err => console.log(err));
  };

  closeModalPopup = () => {
    this.setState({ showMorePopup: false });
  };

  render() {

    const { shiftHistoryAll, shiftHistory, workplaceId } = this.state;

    if (!workplaceId) {
      return (
        <div>
          <h3>Please select workplace.</h3>
        </div>
      );
    }
    if (!shiftHistory) {
      return <Loading />;
    }
    if (!shiftHistory.length && shiftHistoryAll.length) {
      return (
        <div>
          <h3>There are no unrated shifts for the selected workplace.</h3>
        </div>
      );
    }
    if (!shiftHistory.length) {
      return (
        <div>
          <h3>No History for selected workplace.</h3>
        </div>
      );
    }

    return (

      <div className="content shift-history-content">
        {shiftHistory.map((shift, index) => <Paper style={styles.paperStyle}
                                                   zDepth={1} key={index} className="content-row">
          <Grid>
            <GridColumn width={4}>
              <div className="wrapper-element text-left">
                <Image src={shift.avatarUrl} shape="circular" size="mini" className="display-inline" />
                <div className="text-uppercase display-inline">
                  <span className="font600">{shift.firstName} </span>
                  <span className="font300"> {shift.lastName} </span>
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
                <span>${shift.wage}</span>
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
                  defaultRating={shift.rating || 0}
                  maxRating={5}
                  onRate={(_, data) => this.onRatingChange(shift, data)} />
              </span>
                <p className="text-uppercase">{shift.positionName}</p>
              </div>
            </GridColumn>
          </Grid>
        </Paper>)}
        <div className="btn-circle-center content-row">
          <CircleButton disabled={shiftHistory.length < 1} type="blue" title="SEE MORE" handleClick={() => this.showMoreHistory()} />
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

export default withApollo(ShiftHistory);
