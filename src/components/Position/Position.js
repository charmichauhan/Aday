import React,{ Component } from 'react';
import Select from 'react-select';
import { Icon } from 'semantic-ui-react';
import './Position.css';

const Positions = [
	{ key:0,label: 'Cashier', value: 'Cashier' },
	{ key:1,label: 'Deep Clean', value: 'Deep Clean' },
	{ key:2,label: 'Front Door', value: 'Front Door' },
  { key:3,label: 'Bartender', value: 'Bartender' },
  { key:4,label: 'Sandwich', value: 'Sandwich' },
  { key:4,label: 'Breakfast', value: 'Breakfast' }
];

function arrowRenderer(){
   return (
     <Icon name="sort" />
   )
}
export default class PositionSelectOption extends Component{
  constructor(props){
    super(props);
    this.onChange=this.onChange.bind(this);
		this.state = {
      options:Positions,
      position:'',
    }
  }
	onChange(value){
		const {formCallBack}=this.props;
		const updatedState = {
			position:value
		}
		this.setState(updatedState);
		formCallBack(updatedState);
	}

  render(){
    return(
      <Select 
         style={{ marginTop:'-1%  '}}
         className="sectionTest1"
			   name="managers"
         single
   	 		 placeholder="SELECT POSITION"
				 value={this.state.position}
         onChange={this.onChange}
         options={this.state.options}
         arrowRenderer={arrowRenderer}
			/>
    );
  }
}
