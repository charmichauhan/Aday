import React, { Component } from 'react'
import ShiftDaySelector from '../../../DaySelector/ShiftDaySelector.js';
import { gql, graphql } from 'react-apollo';
import moment from 'moment';
import {Loader} from 'semantic-ui-react';

class RecurringShiftSelectComponent extends Component {
	constructor(props) {
	    super(props);
	    this.state = {
	    	shiftIdsUpdate: {},
	    	shiftDaysSelected: []
	    }
	 }

	handleData = (value) => {
		value["shiftIdsUpdate"] = this.state.shiftIdsUpdate
    	this.props.formCallBack(value);
  	};

  	componentWillMount() {
  		this.props.data.refetch()
  	}

  	componentWillReceiveProps(nextProps) {
	    if ( this.props.data.loading !== nextProps.data.loading ) {
	    	let dayHash = {}
			
		    let weekStart = moment().startOf("week").add(this.props.calendarOffset, 'days').format()
		  	console.log("this.props.calendarOffset")
		  	console.log(this.props.calendarOffset)
		  	
		  	console.log(weekStart)
		    for(let i = 0; i <= 6; i++) {
		      dayHash[moment(weekStart).day(this.props.calendarOffset + i).format("dddd").toUpperCase()] = moment(weekStart).add(i, 'days').format('MM-DD-YYYY')
		    }
		    
		    console.log(dayHash)
		    console.log(weekStart)
		    let shiftDaysSelected = []
		    if ( nextProps.data.recurringShiftById.days ){
		      nextProps.data.recurringShiftById.days.map(function(d,i){
		        shiftDaysSelected.push(dayHash[d])
		      })
		    }

		    var shiftIdsUpdate = {}
		    if (nextProps.data.recurringShiftById) {
			    nextProps.data.recurringShiftById.shiftsByRecurringShiftId.edges.map(function(shift, i) {
			    	let day = moment(shift.node.startTime).format('MM-DD-YYYY')
			    	if ( shiftDaysSelected.includes(day) ) {
			    		shiftIdsUpdate[day] = shift.node.id
			    	}
			    })
			}

			const value = {}
			value["shiftIdsUpdate"] = shiftIdsUpdate

			const returnHash = {}
			shiftDaysSelected.map(function(day,i){
				returnHash[day] = true
			})

			value["shiftDaysSelected"] = returnHash
			this.props.formCallBack(value);

			this.setState({ startDate: moment(shiftDaysSelected[0]).startOf('week').add(this.props.calendarOffset, 'days'),
							shiftDaysSelected: shiftDaysSelected,
							shiftIdsUpdate: shiftIdsUpdate})
		}
	}

    render() {

		if (this.props.data.loading){
			return (
				<div>  <Loader active inline='centered' /> </div>
			)
		}

	   return (
	     	<div>
				<ShiftDaySelector selectedDate={this.state.shiftDaysSelected} isRecurring={true}
	                startDate={this.state.startDate} formCallBack={this.handleData} />
			</div>
	   ) 
   } 
}


  const recurringShiftById =  gql`
    query recurringShiftById($id: Uuid!) {
      recurringShiftById (id: $id  ) {
        id
        days
        shiftsByRecurringShiftId{
        	edges{
        		node{
        			id
        			startTime
        		}
        	}
        	
        }
      }
    }
  `

  const RecurringShiftSelect = graphql(recurringShiftById, {
    options: (ownProps) => ({
      variables: {
        id: ownProps.recurringShift
      }
    })
  })(RecurringShiftSelectComponent)

  export default RecurringShiftSelect

  