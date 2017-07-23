import React, { Component } from 'react';
import Published from '../../../../public/assets/Icons/published.png';
import Unpublished from '../../../../public/assets/Icons/unpublished.png';
import '../../Scheduling/style.css';

export default class ShiftPublish extends Component{
    render(){
        let is_publish = this.props.ispublish;
        let status = "UNPUBLISHED SCHEDULE";
        let statusImg = Unpublished;
        if(is_publish){
            status="PUBLISHED SCHEDULE";
            statusImg = Published;
        }
        return(
            <div className="col-md-12">
                <div className="col-sm-offset-3 col-sm-5 rectangle">
                    <img src={statusImg} alt="nooo"/>
                    <p className="col-sm-offset-2">{status}</p>
                </div>
            </div>
        )
    }
}
