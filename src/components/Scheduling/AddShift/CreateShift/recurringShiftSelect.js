import React, { Component } from 'react'
import ShiftDaySelector from '../../../DaySelector/ShiftDaySelector.js';
import { gql, graphql } from 'react-apollo';
import moment from 'moment';

class RecurringShiftSelectComponent extends Component {
	constructor(props) {
	    super(props);
	    this.state = {
	    	
	    }
	 }

    render() {

    	console.log(this.props)
    	console.log(this.props.startDate)
    	
    	if (this.props.data.loading){
    		return (
    			<div> </div>
    		)
    	}


		   	let dayHash = {}
		    let weekStart = moment().startOf("week")
		    for(let i = 0; i <= 6; i++) {
		      dayHash[moment(weekStart).day(i).format("dddd").toUpperCase()] = moment(weekStart).day(i).format('MM-DD-YYYY')
		    }
		    
		    let shiftDaysSelected = []
		    if ( this.props.data.recurringShiftById.days ){
		      this.props.data.recurringShiftById.days.map(function(d,i){
		        shiftDaysSelected.push(dayHash[d])
		      })
		    }


	   return (
          <div>

                            <ShiftDaySelector selectedDate={shiftDaysSelected} isRecurring={true}
                                    startDate={this.props.startDate} formCallBack={this.props.formCallBack} />
          
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

  