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
          centerPadding: '60px',
          slidesToShow: 3,
          speed: 500
        };
      return (
        <div>
          <Slider {...settings}>
            <div><Image src="https://s3.us-east-2.amazonaws.com/aday-website/workplace-pictures/chao-center-dining.jpg"    size="large" /></div>
            <div><Image src="http://d3vgmmrg377kge.cloudfront.net/about/PublishingImages/campus-donors/Spangler_patio_110915-640x360.jpg"  size="large" /></div>
            <div><Image src="http://www.ramsa.com/api/sites/default/files/97035-ESTO-2001A75.78.jpg"  size="large" /></div>
            <div><Image src="http://www.ramsa.com/api/sites/default/files/97035-ESTO-2001A75.25.jpg"  size="large" /></div>
          </Slider>
        </div>
      );
    }
  }

  /**
   * <Image src={this.props.data.workplaceById.workplaceImageUrl} className="workplace-image"/>
   */
