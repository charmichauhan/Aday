import React,{Component} from 'react';
import {ModalContainer,ModalDialog} from 'react-modal-dialog';
import './styles.css';

export default class AddEmployeeForm extends Component{
  constructor(props){
    super(props);
    console.log(props);
  }
  render(){
  return(
     <div className="add-shift-modal">
      <div className="add-shift-modal-content">
        <div className="add-shift-modal-header">
          <span className="close">&times;</span>
          <h3>ADD SHIFTS BY EMPLOYEE DEMAND</h3>
        </div>
      <div className="add-shift-modal-body">
        <div id="wrapper">
      <div className="scrollbar" id="style-1">
       <div className="force-overflow">
          <form className="add-shift-form" styles={"height:450px;"}>
            <div className="rtform" styles={"width:100%;float:left"}>
             <div className="tab">
               <button className="tablinks">
                CASHIER
               </button>
               <button className="tablinks">
                SUSHI CHEF
               </button>
               <button className="tablinks">
                LINE COOK
               </button>
             </div>
            </div>
          </form>
         </div>
        </div>
       </div>
      </div>
     </div>
    </div>
    );
  }
}
