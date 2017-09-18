import React, { Component } from 'react';
import {Grid, Label, Image} from 'semantic-ui-react'
import './MyWorkplace.css';
import { gql, graphql} from 'react-apollo';
import Slider from 'react-slick'

export default class WorkplacePhotos extends Component {
    render() {
        const settings = {
          className: 'center',
          centerMode: true,
          infinite: true,
          slidesToShow: 3,
          speed: 500,
          adaptiveHeight: true,
          autoplay: true,
          pauseOnHover: true,
        };
      return (
        <div style={{display:'flex', flexDirection:'row', alignItems:'center'}}>
          <Slider {...settings}>
            <div><Image src="https://s3.us-east-2.amazonaws.com/aday-website/workplace-pictures/chao-center900x900.png"    size="massive" /></div>
            <div><Image src="https://s3.us-east-2.amazonaws.com/aday-website/workplace-pictures/spanger-dining1593x1593.jpg"  size="massive" /></div>
            <div><Image src="https://s3.us-east-2.amazonaws.com/aday-website/workplace-pictures/spanger-outside1155x1155.jpg"  size="massive" /></div>
            <div><Image src="https://s3.us-east-2.amazonaws.com/aday-website/workplace-pictures/spangler-lawn500x500.png"  size="massive" /></div>
          </Slider>
        </div>
      );
    }
  }

  /**
   * <Image src={this.props.data.workplaceById.workplaceImageUrl} className="workplace-image"/>
   */
