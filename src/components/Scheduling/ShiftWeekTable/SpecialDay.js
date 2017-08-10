import React, { Component } from 'react';
import moment from 'moment';
import { concat, groupBy  } from 'lodash';
import uuidv1 from 'uuid/v1';
import { gql, graphql,compose} from 'react-apollo';
import AddHolidayModal from '../../helpers/AddHolidayModal';
import '../style.css';
import {allHolidays,createHoliday,deleteHolidaysById,updateHoliday} from './SpecialDay.graphql';
import {
    TableRow,
    TableRowColumn,
} from 'material-ui/Table';
const styles={
    paddingLeft:'0',
    paddingRight:'0',
    height:'auto,' ,
    cursor: 'pointer'
};
const initialState = {
  addHoliday:false,
  holidayDate:"",
  isEdit:false,
  currentData:{},
  holidayId:""
};

class SpecialDayComponent extends Component{
  constructor(props){
    super(props);
    this.state=initialState;
  }
  handleOpen = (date,holidayData) => {
    this.setState({addHoliday:true,isEdit:(holidayData?true:false),holidayDate:date['_d'],currentData:holidayData && holidayData[0],holidayId:holidayData && holidayData[0].id});
  };
  handleModalClose = () => {
    this.setState({addHoliday:false,isEdit:false})
  };
  handleAddHoliday = (holidayDetail) => {
    let that = this;
    let payMultiplier;
    if(holidayDetail.holidayPayPremium == "one"){
      payMultiplier=1
    }else if(holidayDetail.holidayPayPremium == "oneHalf"){
      payMultiplier=1.5
    }else{
      payMultiplier=2
    }
    if(that.state.isEdit){
      that.props.updateHolidayById({
        variables:{
          data:{
            id:holidayDetail.holidayId,
            holidayPatch: {
              holidayDay: that.state.holidayDate,
              holidayName: holidayDetail.holidayName,
              isPyramid: holidayDetail.pyramidPayPremium,
              payMultiplier: payMultiplier
            }
          }
        }
      }).then(({data})=>{
        console.log("Update Holiday Successfully");
      }).catch((error) => {
        console.log('there was an error sending the query', error);
      });
    }else{
      that.props.createHoliday({
        variables:{
          data:{
            holiday:{
              id:uuidv1(),
              holidayDay:that.state.holidayDate,
              holidayName:holidayDetail.holidayName,
              isPyramid:holidayDetail.pyramidPayPremium,
              payMultiplier:payMultiplier
            }
          }
        },
        updateQueries:{
          allHolidays:(previousResult,{ mutationResult })=>{
            const newEdges = mutationResult.data.createHoliday.holiday;
            previousResult.allHolidays.edges = [...previousResult.allHolidays.edges,{"node":newEdges,'__typename':""}]
            return{
              allHolidays:previousResult.allHolidays
            }
          }
        },
      }).then(({data})=>{
        console.log("Create Holiday Successfully");
      }).catch((error) => {
        console.log('there was an error sending the query', error);
      });
    }
    that.setState({isEdit:false,addHoliday:false,holidayDetail:""});
  };

  getSpecialDay = (start,specialDayData) => {
    let specialDay = [];
    for(let i=0;i<=6;i++){
      let specialDayStyle = specialDayData[moment(start).day(i).format('YYYYMMDD')] ? "spclDay":"special-day-blank";
      specialDay.push(<TableRowColumn style={styles}><p className={specialDayStyle} onClick={() => this.handleOpen(moment(start).day(i),specialDayData[moment(start).day(i).format('YYYYMMDD')])}>{specialDayData[moment(start).day(i).format('YYYYMMDD')] && specialDayData[moment(start).day(i).format('YYYYMMDD')][0]['holidayName']}</p></TableRowColumn>);
    }
    return specialDay;
  };

    render(){
        if (this.props.allHoliday.loading) {
         return (<div>Loading</div>)
        }
        if (this.props.allHoliday.error) {
          console.log(this.props.data.error);
          return (<div>An unexpected error occurred</div>)
        }
        let allHoliday = this.props.allHoliday && this.props.allHoliday.allHolidays.edges;
            // this.props.deleteHolidayById({variables:{data:{id:"24047040-7db6-11e7-8758-43844db7b008"}}})
            //   .then(({ data }) => {
            //     console.log('Delete Data', data);
            //   }).catch((error) => {
            //   console.log('there was an error sending the query', error);
            // });
        let specialDay= [];
        allHoliday.map((value,index)=>{
          let special = {};
          special.id=value.node.id;
          special.workplcaeId = value.node.workplaceId;
          special.holidayName = value.node.holidayName;
          special.holidayDate = value.node.holidayDay;
          special.pyramidPayPremium = value.node.isPyramid;
          if(value.node.payMultiplier == 1){
            special.holidayPayPremium = "one";
          }else if(value.node.payMultiplier == 1.5){
            special.holidayPayPremium = "oneHalf";
          }else{
            special.holidayPayPremium = "two";
          }
          specialDay.push(special);
        });
        let start = moment(this.props.dateStart);
        let sortedData = specialDay.map((special) => ({ ...special, specialDayData: moment(special.holidayDate).format("YYYYMMDD")}));

        let groupedData = groupBy(sortedData, 'specialDayData');
        return(
            <TableRow className="spday" displayBorder={false} style={{height:'auto'}}>
                <TableRowColumn style={styles} className="headcol">
                  {this.state.addHoliday && <AddHolidayModal isOpen={this.state.addHoliday}
                  addHoliday={this.handleAddHoliday}
                  holidayData={this.state.currentData}
                  handleClose={this.handleModalClose}/>
                  }
                </TableRowColumn>
                {
                  this.getSpecialDay(start,groupedData)
                }
            </TableRow>
        )
    }
}

const SpecialDay=compose(graphql(createHoliday, {
  name:"createHoliday"
}),
graphql(allHolidays,{
  name:"allHoliday"
}),
graphql(updateHoliday,{
  name:"updateHolidayById"
}),
graphql(deleteHolidaysById,{
  name:"deleteHolidayById"
})
)(SpecialDayComponent);
export default SpecialDay;
