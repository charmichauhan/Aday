import React, { Component } from 'react';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import CircleButton from '../CircleButton';
import IconButton from 'material-ui/IconButton';
import {Image} from 'semantic-ui-react';
import './addastemplate.css';
import modalClose from '../../../../public/images/Modal-Close.png';

const style = {
    titleStyle:{
        paddingLeft: '0',
        paddingRight: '0',
        borderBottom:'1px solid #F5F5F5'
    },
    actionsContainerStyle:{
        textAlign:'center',
        padding:'0'
    },
    contentStyle:{
        width:600,
        height:333,
        borderRadius:6
    }
};
export default class AddAsTemplateModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isOpen:props.isOpen
        }
    }
    handleChange = (e) => {
        this.props.handleChange(e.target.value);
    };
    render() {
        const {addTemplateModalOpen,handleClose,addTemplate} = this.props;
        const actions = [
            <CircleButton type="white" wrapperClassName="popup-btn-mrb" title="Cancel" handleClick={handleClose} image={false}/>,
            <CircleButton type="blue" wrapperClassName="popup-btn-mrb" title="Add Template" handleClick={addTemplate} image={false}/>
        ];
        const titleMessage=(<div>
            <div className="confirm-popup-copy">
                <IconButton onClick={this.addTemplateclose} style={{padding:0}}>
                    <Image src="/images/Assets/Icons/Icons/copying.png" size="small"/>
                </IconButton>
            </div>
            <h5 className="confirm-popup">ADD TEMPLATE</h5>
            <div className="confirm-popup-close">
                <IconButton style={{borderRadius:'50%',boxShadow:'0px 2px 9px -2px #000'}} onClick={handleClose}>
                    <Image src="/images/Modal-Close.png" size="mini"/>
                </IconButton>
            </div>
        </div>);
        return (
            <div>
                {addTemplateModalOpen && <Dialog
                titleStyle={style.titleStyle}
                contentStyle={style.contentStyle}
                actionsContainerStyle={style.actionsContainerStyle}
                title={titleMessage}
                actions={actions}
                modal={true}
                open={addTemplateModalOpen}>
                <div className="confirm-popup-body">
                    <div className="add-template-popup">
                        <label>TEMPLATE NAME</label>
                        <input type="text" onChange={(e)=>this.handleChange(e)} name="templateName"/>
                    </div>
                </div>
                </Dialog>}
            </div>
        );
    }
}
