import React, {Component} from "react";
import Drawer from "material-ui/Drawer";
import IconButton from "material-ui/IconButton";
import { Header, Icon, Table, Image, List ,Divider} from 'semantic-ui-react';
import FlatButton from 'material-ui/FlatButton';
import CircleButton from '../../helpers/CircleButton';
import moment from "moment";
import {find, pick} from "lodash";
import {leftCloseButton} from "../../styles";
import '../team.css';
const uuidv4 = require('uuid/v4');
import {userQuery, releventPositionsQuery, updateEmployeeById} from "../Team.graphql";
import {graphql, compose} from "react-apollo";


class ResumeDrawerComponent extends Component {
    constructor(props){
      super(props);
      this.state = {
        }
      }

  render() {
    const {
      shift = {},
      width = 640,
      openSecondary = true,
      docked = false,
      open
    } = this.props;

    let userDetails = this.props.userQuery && this.props.userQuery.userById;

    return (
      <Drawer docked={docked} width={width}
              openSecondary={openSecondary}
              onRequestChange={this.props.backProfileDrawer}
              open={open}>
        <div className="drawer-section resume-drawer profile-drawer">
          <div className="profile-drawer-heading">
            <div className="drawer-heading col-md-12">
              <FlatButton label="Back" onClick={this.props.backProfileDrawer}
                          icon={<Icon name="chevron left" className="floatLeft" style={{fontSize: 26}} /> }
                          style={{position: 'absolute', left: '15px', color: '#E33821', fontSize: 18, paddingLeft: 0}}
              />

              <span className="profile-title first-name-title" style={{color:"#0021A1"}}>{userDetails.firstName}</span>
              &nbsp;&nbsp;
              <span className="profile-title last-name-title" style={{color:"#0021A1"}}>{userDetails.lastName} </span>

              {userDetails.avatarUrl
                     ? <Image centered='true' size='small' shape='circular' className="profile-img" src={ userDetails.avatarUrl}/>
                     :  <Image centered='true' size='small' shape='circular' className="profile-img"
                          src="https://s3.us-east-2.amazonaws.com/aday-website/anonymous-profile.png"/>
              }

            </div>
          </div>
          <div className="drawer-content scroll-div">
            <div className="member-list">
              <div className="resume-subject text-center">
                <img src="/images/Sidebar/down-quotes.png" className="quotation-mark down" size="mini" />
                <span className="tagline">I like to work with carefree and generouspeople because that’s who I am :) </span>
                <img src="/images/Sidebar/up-quotes.png" className="quotation-mark up" size="mini" />
              </div>
              <div className="resume-qualification">
                <div className="experience">
                  <div className="qualification-title text-center">
                    <div className="display-table">
                    <h2 className="heading text-uppercase text-center resume-title">Work Experience</h2>
                    </div>
                  </div>
                  <div className="qualification-content">
                    <div className="content-heading">
                      <h2 className="text-uppercase resume-sub-header">Employer</h2>
                    </div>
                    <div className="brief-content">
                      <p className="address">
                        Restaurant Associates <br />
                        117 Western Avenue <br />
                        Boston, MA 02163 <br />
                      </p>
                      <p className="extra-work">
                        Worked on cash register and also was training to become a shift manager
                      </p>
                    </div>
                  </div>
                </div>
                <div className="education">
                  <div className="qualification-title text-center">
                    <div className="display-table">
                    <h2 className="heading text-uppercase text-center resume-title">Education</h2>
                    </div>
                  </div>
                  <div className="qualification-content">
                    <div className="content-heading">
                      <h2 className="text-uppercase resume-sub-header">College</h2>
                    </div>
                    <div className="brief-content">
                      <p className="address">
                        Boston College <br />
                        140 Commonwealth Avenue <br />
                        Chestnut Hill, MA 02467 <br />
                      </p>
                    </div>

                    <div className="brief-content">
                      <p className="address">
                        Boston College <br />
                        140 Commonwealth Avenue <br />
                        Chestnut Hill, MA 02467 <br />
                      </p>
                    </div>
                  </div>

                  <div className="qualification-content">
                    <div className="content-heading">
                      <h2 className="text-uppercase resume-sub-header">High School</h2>
                    </div>
                    <div className="brief-content">
                      <p className="address">
                        Boston College High School<br />
                        150 William T Morrisey Blvd <br />
                        Boston, MA 02467 <br />
                        August 2008 - May 2012
                      </p>
                    </div>
                  </div>
                </div>
                <div className="experience">
                  <div className="qualification-title text-center">
                    <h2 className="heading text-uppercase text-center resume-title" style={{marginTop:20}}>References</h2>
                  </div>
                  <div className="qualification-content">
                    <div className="content-heading">
                      <h2 className="text-uppercase resume-sub-header">Reference</h2>
                    </div>
                    <div className="brief-content">
                      <p className="address">
                        Lane Kane <br />
                        (403) 482-4821 <br />
                      </p>
                    </div>
                  </div>
                </div>
                <div className="experience">
                  <div className="qualification-title text-center">
                    <div className="display-table">
                    <h2 className="heading text-uppercase text-center resume-title">Availability</h2>
                    </div>
                  </div>
                  <div className="qualification-content">
                    <div className="brief-content">
                      <h4 className="address text-uppercase">
                        Desired Hours: 40 hours
                      </h4>
                    </div>
                  </div>
                </div>
                <div className="home-address">
                  <div className="qualification-title text-center">
                    <div className="display-table">
                    <h2 className="heading text-uppercase text-center resume-title ">Home Address</h2>
                    </div>
                  </div>
                  <div className="qualification-content">
                    <div className="brief-content">
                      <p className="address">
                        140 Commonwealth Avenue<br />
                        Apt. 204 <br />
                        Allston, MA 02134
                      </p>
                    </div>
                  </div>
                </div>
                <div className="contact-info ">
                  <div className="qualification-title text-center">
                    <div className="display-table">
                    <h2 className="heading text-uppercase text-center resume-title">Contact Info</h2>
                    </div>
                  </div>
                  <div className="qualification-content">
                    <div className="brief-content">
                      <p className="address">
                        <span> 617-405-5829 </span>
                      </p>
                    </div>
                    <div className="brief-content">
                      <p className="address">
                        <span>iwillbfresh@gmail.com</span>
                      </p>
                    </div>
                  </div>
                </div>
                <div className="contact-info">
                  <div className="qualification-title text-center">
                    <div className="display-table">
                    <Image centered='true' size='mini' className="heading-img"
                           src="/images/Sidebar/language.png" />
                    <h2 className="heading text-uppercase text-center resume-title">Languages</h2>
                    </div>
                  </div>
                  <div className="qualification-content">
                    <div className="brief-content">
                      <p className="text-uppercase address">
                        English
                      </p>
                    </div>
                    <div className="brief-content">
                      <p className="text-uppercase address">
                        Spanish
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="drawer-footer text-center">
            <CircleButton type="white" title="GO BACK" handleClick={this.props.backProfileDrawer}/>
          </div>
        </div>
      </Drawer>
    );
  };
}

const ResumeDrawer = compose(
  graphql(userQuery, {
    name: "userQuery",
    options: (ownProps) => ({
      variables: {
        id: ownProps.userId,
        corporationId: localStorage.getItem("corporationId")
      }
    })
  }),
  graphql(updateEmployeeById, {name: "updateEmployee"})
)(ResumeDrawerComponent);

export default ResumeDrawer;

/**
 * The code below is from the mobile application with the intention of possibly reusing the queries

import React, {
    Component
} from 'react';
import {
    Row,
    List,
    ListItem,
    Input,
    Thumbnail
} from 'native-base';
import {
    TouchableOpacity,
    AppRegistry,
    View,
    StyleSheet,
    Image,
    Text,
    Dimensions,
    Platform,
    ScrollView,
    ListView
} from 'react-native';
import {
    Actions
} from 'react-native-router-flux';
import Button from 'react-native-button';
import ImagePicker from 'react-native-image-picker';
let {
    height,
    width
} = Dimensions.get('window');
import SpinnerComponent from './../SpinnerComponent';
import {
    gql,
    ApolloClient,
    createNetworkInterface,
    ApolloProvider,
    graphql
} from 'react-apollo';
import {
    compose
} from 'react-apollo';
import Modal from 'react-native-simple-modal';
import uuidv1 from 'uuid/v1';

class MyProfileComponent extends Component {

    constructor(props) {
        super(props);
        this.state = {
            id: '',
            availabilityId: "",
            showDetails: false,
            isFullTime: true,
            availabilityShow: false,
            avatarSource: require('./../assets/profile-icons/anonymous-profile.png'),
            openModal: false,
            references: [],
            homeAddress: {},
            isIdentified: false,
            contactInfoPhoneNumberEnterFields: false,
            contactInfoPhoneNumber: "",
            contactInfoErrorMessage: false,
            phoneNumberVerifyCode: '',
            isContactInfoVerified: false,
            contactInfoEmail: '',
            modalData: {
                imgUrl: require('./../assets/profile-icons/book-icon.png'),
                paragraph: '',
                button1: {
                    name: '',
                    arguments: '',
                    url: '',
                },
                button2: {
                    name: '',
                    arguments: '',
                    url: '',
                },
                button3: {
                    name: '',
                    arguments: '',
                    url: '',
                },
            },
            isLoading: false,
            ds: new ListView.DataSource({
                rowHasChanged: (r1, r2) => r1 !== r2
            })
        };
        this.onAvailabilitySavePress = this.onAvailabilitySavePress.bind(this);
        this.openModal = this.openModal.bind(this);
        this.imagePicker = this.imagePicker.bind(this);
        this.setAvatar = this.setAvatar.bind(this);
        this.pickIdentityDocument = this.pickIdentityDocument.bind(this);
        this.saveIdentityDocument = this.saveIdentityDocument.bind(this);
        this.contactInfoPhoneNumberValidation = this.contactInfoPhoneNumberValidation.bind(this);
        this.verifyPhoneNumber = this.verifyPhoneNumber.bind(this);
    }

    componentDidMount() {

        const availability = this.props.state.myProfile.availability;
        let isFullTime = true;
        if (availability.hourRange === "PART-TIME") {
            isFullTime = false;
        }

        this.setState({
            references: this.props.state.myReferences.myReferences,
            homeAddress: this.props.state.myProfile.homeAddress,
            contactInfoEmail: this.props.state.myProfile.email,
            id: this.props.state.myProfile.id,
            availabilityId: availability.id,
            isFullTime
        })
    }

    componentWillReceiveProps(nextProps) {
        const availability = this.props.state.myProfile.availability;
        let isFullTime = true;
        if (availability.hourRange === "PART-TIME") {
            isFullTime = false;
        }
        let isContactInfoVerified = false;
        let isLoading = nextProps.data.loading;


        if (nextProps.data.userById) {
            var {
                firstName,
                lastName,
                aboutMeText
            } = nextProps.data.userById;
            if (typeof aboutMeText === 'string') {
                aboutMeText = aboutMeText.trim();
            }
        }



        if (nextProps.state.userCredentials.userCredentials.phoneNumber) {
            isContactInfoVerified = true;
        }



        if (!isLoading && !nextProps.state.myReferences.myReferences.length) {
            const references = nextProps.data.userById.userReferenceNonDemosByUserId.edges;
            const workHistory = nextProps.data.userById.userEmployersByUserId.nodes;
            const educationHistory = nextProps.data.userById.userEducationsByUserId.nodes;
            const languages = nextProps.data.userById.userLanguagesByUserId.nodes;
            const availability = nextProps.data.userById.userAvailabilityNonDemosByUserId.nodes[0];
            this.props.actions.saveReferences(references);
            this.props.actions.saveAboutMeData({
                firstName,
                lastName,
                aboutMeText
            });
            this.props.actions.saveWorkHistory(workHistory);
            this.props.actions.saveEducationHistory(educationHistory);
            this.props.actions.saveLanguage(languages);
            this.props.actions.saveAvailabilityData(availability);
        }



        if (!isLoading && !nextProps.state.myProfile.phoneNumber && nextProps.data.userById.userPhoneConfirmed) {
            const phoneNumber = nextProps.data.userById.userPhoneNumber;
            const email = this.state.contactInfoEmail;
            this.props.actions.saveContactInfo({
                phoneNumber,
                email
            });
            this.setState({
                isContactInfoVerified: true
            });
        }

        if (!isLoading && (!nextProps.state.myProfile.homeAddress || !Object.keys(nextProps.state.myProfile.homeAddress).length)) {
            const region = nextProps.data.userById.homeAddress.split(',')[1] + ', ' + nextProps.data.userById.homeAddress.split(',')[2];
            const zipCode = nextProps.data.userById.zipCode;
            const homeAddress1 = nextProps.data.userById.homeAddress.split(',')[0];
            let homeAddress = {
                homeAddress1,
                region,
                zipCode
            };
            this.props.actions.saveHomeAddress(homeAddress);
        }
        this.setState({
            references: nextProps.state.myReferences.myReferences,
            homeAddress: nextProps.state.myProfile.homeAddress,
            contactInfoPhoneNumber: nextProps.state.myProfile.phoneNumber,
            contactInfoEmail: nextProps.state.myProfile.email,
            isContactInfoVerified,
            isLoading,
            availabilityId: availability.id,
            isFullTime
        });

    }

    renderRow(dataRow, sectionID, rowID) {
        return (
            <View style={{backgroundColor:'white', marginTop: 10}}>
                <Text style={{paddingLeft: 20, fontWeight: 'bold', fontSize: 15}}>Reference {++rowID}</Text>
                <View style={{marginTop:10, paddingVertical: 10, flexDirection: 'row', justifyContent: 'space-between', backgroundColor:'rgba(216,216,216,0.2)'}}>
                    <View>
                        <Text style={{paddingLeft: 20}}>{dataRow.firstName + " "}{dataRow.lastName || ""}</Text>
                        <Text style={{paddingLeft: 20}}>{dataRow.referencePhoneNumber}</Text>
                    </View>
                    <TouchableOpacity onPress={() => Actions.AddReferenceManually({data: dataRow})}>
                        <Image
                            resizeMode="contain"
                            style={{width: 40, height: 40}}
                            source={require('./../assets/profile-icons/edit-button.png')}
                        />
                    </TouchableOpacity>
                </View>
            </View>
        )
    }

    onAvailabilitySavePress() {

        const action = this.state.availabilityId ? "updateUserAvailabilityNonDemoById" : "createUserAvailabilityNonDemo";
        const id = this.state.availabilityId ? this.state.availabilityId : uuidv1();
        const hourRange = this.state.isFullTime ? "FULL-TIME" : "PART-TIME";

        const availability = {
            id,
            hourRange,
            userId: "5b7323ac-e235-4edb-bbf9-97495d9a42a1"
        };
        this.setState({
            isLoading: true
        });
        this.props[action]({
                variables: availability
            })
            .then((response) => {
                console.log('done');
                this.setState({
                    availabilityShow: false,
                    isLoading: false
                });
                this.props.actions.saveAvailabilityData(availability);
            })
            .catch((err) => {
                console.log(err);
                console.log(id)
            });

    }

    pickAvatar() {
        let options = {
            title: 'Select Avatar',
            storageOptions: {
                skipBackup: true,
                path: 'images'
            }
        };
        this.imagePicker(options, this.setAvatar);
    }

    setAvatar(response) {
        if (response.didCancel) {
            console.log('User cancelled image picker');
        } else if (response.error) {
            console.log('ImagePicker Error: ', response.error);
        } else if (response.customButton) {
            console.log('User tapped custom button: ', response.customButton);
        } else {
            let source = {
                uri: response.uri
            };
            this.setState({
                avatarSource: source
            });
            // You can also display the image using data:
            // let source = { uri: 'data:image/jpeg;base64,' + response.data };
        }
    }

    pickIdentityDocument(type) {
        let options = {
            title: 'Select ' + type,
            storageOptions: {
                skipBackup: true,
                path: 'images'
            }
        };
        this.setState({
            identifyDocType: type.toUpperCase(),
            openModal: false
        });
        this.imagePicker(options, this.saveIdentityDocument);
    }

    saveIdentityDocument(response) {
        let isIdentified: false;
        if (response.didCancel) {
            console.log('User cancelled image picker');
        } else if (response.error) {
            console.log('ImagePicker Error: ', response.error);
        } else if (response.customButton) {
            console.log('User tapped custom button: ', response.customButton);
        } else {
            isIdentified = true;
            // You can also display the image using data:
            // let source = { uri: 'data:image/jpeg;base64,' + response.data };
        }
        this.setState({
            isIdentified: isIdentified
        });
    }

    imagePicker(options, callback) {
        ImagePicker.showImagePicker(options, (response) => {
            callback(response);
        });
    }

    renderWorkHistory(dataRow, sectionID, rowID) {
        const isJobDescription = dataRow.jobDescription !== "";
        const isEndDate = dataRow.endDate !== "";
        return (
            <View>
                <Text style={{fontSize:16, marginLeft: 20}}>EMPLOYER {1 + parseInt(rowID)}</Text>
                <View style={{flex: 1, flexDirection: "row", marginVertical: 5, backgroundColor: '#F7F7F7'}}>
                    <View style={{flex: 0.9, marginVertical: 10, marginLeft: 20}}>
                        <View>
                            <Text style={styles.text}>{dataRow.employerName}</Text>
                            <Text style={styles.text}>{dataRow.city}</Text>
                            <Text style={styles.text}>{dataRow.state}</Text>
                        </View>

                        <Text style={styles.text}>{dataRow.startDate  }{isEndDate && "-" + dataRow.startDate}</Text>
                        {isJobDescription &&
                        (<View>
                            <Text style={styles.text}>{dataRow.jobDescription}</Text>
                        </View>)
                        }
                    </View>
                    <TouchableOpacity onPress={()=> Actions.work({work: dataRow, workId: rowID})}>
                        <View style={{flex: 0.1, marginTop: 5}}>
                            <Image
                                resizeMode="contain"
                                style={{width: 50, height: 50}}
                                source={require('./../assets/profile-icons/edit-button.png')}
                            />
                        </View>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }

    renderEducationHistory(dataRow, sectionID, rowID) {
        const isAwardType = dataRow.awardType !== "";
        const isFieldOfStudy = dataRow.fieldOfStudy !== "";
        const isEndDate = dataRow.endDate !== "";
        return (
            <View>
                <Text style={{fontSize: 16, marginLeft: 20}}>DEGREE {1 + parseInt(rowID)}</Text>
                <View style={{flex: 1, flexDirection: "row", marginTop: 5, backgroundColor: '#F7F7F7'}}>
                    <View style={{flex: 0.9, marginVertical: 10, marginLeft: 20}}>
                        <View>
                            <Text style={styles.text}>{dataRow.educationalInstitutionName}</Text>
                            <Text style={styles.text}>{dataRow.city}</Text>
                            <Text style={styles.text}>{dataRow.state}</Text>
                        </View>
                        <Text style={styles.text}>{dataRow.startDate }{isEndDate && "-" + dataRow.startDate}</Text>
                        {isAwardType &&
                        (<View>
                            <Text style={styles.text}>{dataRow.awardType}</Text>
                        </View>)
                        }
                        {isFieldOfStudy &&
                        (<View>
                            <Text style={styles.text}>{dataRow.fieldOfStudy}</Text>
                        </View>)
                        }
                    </View>
                    <TouchableOpacity onPress={()=> Actions.Education({education: dataRow, educationId: rowID})}>
                        <View style={{flex: 0.1, marginTop: 5}}>
                            <Image
                                resizeMode="contain"
                                style={{width: 50, height: 50}}
                                source={require('./../assets/profile-icons/edit-button.png')}
                            />
                        </View>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }

    renderLanguages(dataRow, sectionID, rowID) {
        return (
            <View style={{flex: 1, flexDirection: "row", marginTop: 5, backgroundColor: '#F7F7F7'}}>
                <View style={{flex: 0.9, marginTop: 10, marginLeft: 20}}>
                    <Text style={{fontSize: 16}}>{dataRow.languageName}</Text>
                </View>
                <TouchableOpacity onPress={()=> Actions.Languages({language: dataRow})}>
                    <View style={{flex: 0.1, marginTop: 5}}>
                        <Image
                            resizeMode="contain"
                            style={{width: 50, height: 50}}
                            source={require('./../assets/profile-icons/edit-button.png')}
                        />
                    </View>
                </TouchableOpacity>
            </View>
        )
    }

    openModal(type) {
        const modalData = this.state.modalData;
        if (type === 'references') {
            modalData.type = type;
            modalData.imgUrl = require('./../assets/profile-icons/book-icon.png');
            modalData.paragraph = 'How do you want to add a new reference?';
            modalData.button1.name = 'BY CONTACTS';
            modalData.button1.url = Actions.AddReferenceFromContacts;
            modalData.button1.arguments = '';
            modalData.button2.name = 'MANUALLY';
            modalData.button2.url = Actions.AddReferenceManually;
            modalData.button2.arguments = '';
        } else if (type === 'identification') {
            modalData.type = type;
            modalData.imgUrl = require('./../assets/profile-icons/identification-modal.png');
            modalData.paragraph = 'Aday must confirm your identity before applying to more than 3 jobs, how would you like to verify?';
            modalData.button1.name = 'STATE ID';
            modalData.button1.url = this.pickIdentityDocument;
            modalData.button1.arguments = 'State Id';
            modalData.button2.name = 'PASSPORT';
            modalData.button2.url = this.pickIdentityDocument;
            modalData.button2.arguments = 'Passport';
        } else if (type === 'contactInfo') {
            modalData.type = type;
            modalData.imgUrl = require('./../assets/profile-icons/contact-info.png');
            modalData.paragraph = 'Aday must confirm your phone number to begin accepting shifts, how would you like to verify?';
            modalData.button1.name = 'TEXT ME';
            modalData.button1.url = this.openModal;
            modalData.button1.arguments = 'verifyPhoneNumber';
            modalData.button2.name = 'CALL ME';
            modalData.button2.url = this.openModal;
            modalData.button2.arguments = 'verifyPhoneNumber';
            modalData.button3.name = 'I HAVE A CODE';
            modalData.button3.url = this.openModal;
            modalData.button3.arguments = 'verifyPhoneNumber';
        } else if (type === 'verifyPhoneNumber') {
            modalData.type = type;
            modalData.imgUrl = require('./../assets/profile-icons/contact-info.png');
            modalData.button1.name = 'VERIFY NUMBER';
            modalData.button1.url = this.verifyPhoneNumber;
            modalData.button1.arguments = '';
            modalData.button2.name = "DIDN'T RECEIVE A CODE?";
            modalData.button2.url = this.openModal;
            modalData.button2.arguments = 'contactInfo';
        }
        this.setState({
            openModal: true,
            modalData: modalData
        })

    }

    verifyPhoneNumber() {
        const verifyCode = this.state.phoneNumberVerifyCode;
        this.setState({
            openModal: false,
            contactInfoPhoneNumberEnterFields: false,
            isContactInfoVerified: true,
        });
        this.props.actions.saveContactInfo({
            phoneNumber: this.state.contactInfoPhoneNumber
        });
    }

    contactInfoPhoneNumberValidation() {
        const phoneNumber = this.state.contactInfoPhoneNumber;
        const id = this.state.id;
        let errorMessage = false;
        let isContactInfoVerified = false;
        let contactInfoPhoneNumberEnterFields = true;
        if (phoneNumber) {
            //this.openModal('contactInfo')
            isContactInfoVerified = true;
            contactInfoPhoneNumberEnterFields = false;
            this.props.updateUserPhoneNumber({
                    variables: {
                        id: id,
                        userPhoneNumber: phoneNumber
                    }
                })
                .then((response) => {
                    this.setState({
                        contactInfoErrorMessage: errorMessage,
                        isContactInfoVerified,
                        contactInfoPhoneNumberEnterFields
                    });

                })
                .catch((err) => {
                    console.log(err)
                })

        } else {
            errorMessage = 'Please Enter Phone Number!';
            this.setState({
                contactInfoErrorMessage: errorMessage,
                isContactInfoVerified,
                contactInfoPhoneNumberEnterFields
            });
        }
    }

    render() {
        if (this.props.data.loading || this.state.isLoading) {
            return (
                <View style={{flex: 1, top: 0, position: 'absolute', zIndex: 100}}>
                    <SpinnerComponent />
                </View>
            )
        }

        const { aboutMe } = this.props.state;
        const { workHistory } = this.props.state.workHistory;
        const { educationHistory } = this.props.state.educationHistory;
        const { languages} = this.props.state.languages;
        const references = this.state.references;
        const homeAddress = this.state.homeAddress;
        const isReferences = references.length > 0;
        const isHomeAddress = homeAddress && Object.keys(homeAddress).length > 0;
        const isWorkExperience = workHistory.length > 0;
        const isEducation = educationHistory.length > 0;
        const modalData = this.state.modalData;
        const isLanguages = languages.length > 0;
        const isIdentified = this.state.isIdentified;
        const identifyDocType = this.state.identifyDocType;
        const contactInfoPhoneNumberEnterFields = this.state.contactInfoPhoneNumberEnterFields;
        const contactInfoErrorMessage = this.state.contactInfoErrorMessage;
        const isContactInfoVerified = this.state.isContactInfoVerified;
        const phoneNumber = this.state.contactInfoPhoneNumber;
        const email = this.state.contactInfoEmail;
        const id = this.state.id;
        return (
            <View style={styles.container}>
                <View>
                    <ScrollView>
                        <View style={{flex: 1}}>
                            <View style={[styles.center, {marginTop: 10}]}>
                                <TouchableOpacity onPress={() => this.pickAvatar()}>
                                    <Thumbnail
                                        style={{ width:100, height:100, borderRadius: 50 }}
                                        source={this.state.avatarSource}
                                    />
                                </TouchableOpacity>
                                <Text style={{fontSize:22, fontWeight:'bold'}}>{aboutMe.firstName}</Text>
                                <Text style={{fontSize:22, fontFamily: 'Roboto'}}>{aboutMe.lastName}</Text>
                            </View>
                            <View style={[styles.center, {marginTop: 20, flexDirection: 'row', marginHorizontal: 30}]}>
                                <View style={[styles.center, {justifyContent:'flex-start'}]}>
                                    <Image resizeMode="contain"
                                        style={{width: 20,height: 20}}
                                        source={require('./../assets/comma.png')}
                                    />
                                </View>
                                <View style={{marginHorizontal: 10}}>
                                    <Text style={{fontSize:20, fontFamily: 'Roboto', textAlign:'center'}}>
                                        {aboutMe.aboutMeText}
                                    </Text>
                                </View>
                                <View style={[styles.center, {justifyContent:'flex-end'}]}>
                                    <Image resizeMode="contain"
                                        style={{width:20, height:20}}
                                        source={require('./../assets/commavv.png')}
                                    />
                                </View>
                            </View>
                            <View style={[styles.center, {height: 100, backgroundColor: '#F7F7F7', marginVertical: 10}]}>
                                <TouchableOpacity onPress={() => Actions.AboutMe()}>
                                    <Image
                                        resizeMode="contain"
                                        style={{width: 75, height: 75}}
                                        source={require('./../assets/profile-icons/edit.png')}
                                    />
                                </TouchableOpacity>
                            </View>



                            <View style={[styles.center, {flexDirection: 'row'}]}>
                                <Image
                                    resizeMode="contain"
                                    style={{width: 30, height: 30}}
                                    source={require('./../assets/profile-icons/suitcase-white-bg.png')}
                                />
                                <Text style={{marginLeft: 10}}>WORK EXPERIENCE</Text>
                                {isWorkExperience &&

                                    (<View style={{position: 'absolute', right: 10}}>
                                        <TouchableOpacity onPress={() => Actions.work({})}>
                                            <Image
                                                resizeMode="contain"
                                                style={{width: 30, height: 30}}
                                                source={require('./../assets/profile-icons/plus-button.png')}
                                            />
                                        </TouchableOpacity>
                                    </View>)
                                }
                            </View>
                            {!isWorkExperience &&
                                (<View
                                    style={[styles.center, {height: 100, backgroundColor: '#F7F7F7', marginVertical: 10}]}>
                                    <TouchableOpacity onPress={() => Actions.work({})}>
                                        <Image
                                            resizeMode="contain"
                                            style={{width: 75, height: 75}}
                                            source={require('./../assets/profile-icons/add.png')}
                                        />
                                    </TouchableOpacity>
                                </View>)
                            }
                            {isWorkExperience &&
                                (<View style={{marginVertical: 10}}>
                                    <ListView
                                        enableEmptySections={true}
                                        dataSource={this.state.ds.cloneWithRows(workHistory)}
                                        renderRow={this.renderWorkHistory.bind(this)}
                                    />
                                </View>)
                            }



                            <View style={[styles.center, {flexDirection: 'row'}]}>
                                <Image
                                    resizeMode="contain"
                                    style={{width: 30, height: 30}}
                                    source={require('./../assets/profile-icons/icons-graduation.png')}
                                />
                                <Text style={{marginLeft: 10}}>EDUCATION</Text>
                                {isEducation &&
                                    (<View style={{position: 'absolute', right: 10}}>
                                        <TouchableOpacity onPress={() => Actions.Education({})}>
                                            <Image
                                                resizeMode="contain"
                                                style={{width: 30, height: 30}}
                                                source={require('./../assets/profile-icons/plus-button.png')}
                                            />
                                        </TouchableOpacity>
                                    </View>)
                                }
                            </View>
                            {!isEducation &&
                                (<View
                                    style={[styles.center, {height: 100, backgroundColor: '#F7F7F7', marginVertical: 10}]}>
                                    <TouchableOpacity onPress={() => Actions.Education({})}>
                                        <Image
                                            resizeMode="contain"
                                            style={{width: 75, height: 75}}
                                            source={require('./../assets/profile-icons/add.png')}
                                        />
                                    </TouchableOpacity>
                                </View>)
                            }
                            {isEducation &&
                                (<View style={{marginVertical: 10}}>
                                    <ListView
                                        enableEmptySections={true}
                                        dataSource={this.state.ds.cloneWithRows(educationHistory)}
                                        renderRow={this.renderEducationHistory.bind(this)}
                                    />
                                </View>)
                            }


                            <View style={[styles.center, {flexDirection: 'row'}]}>
                                <Image
                                    resizeMode="contain"
                                    style={{width: 30, height: 30}}
                                    source={require('./../assets/profile-icons/reference-icon.png')}
                                />
                                <Text style={{marginLeft: 10}}>REFERENCES</Text>
                                {isReferences &&
                                    <TouchableOpacity onPress={() =>  this.openModal('references')} style={{position: 'absolute', right: 5}}>
                                        <Image
                                            resizeMode="contain"
                                            style={{width: 30, height: 30}}
                                            source={require('./../assets/profile-icons/plus-button.png')}
                                        />
                                    </TouchableOpacity>
                                }
                            </View>
                            {!isReferences &&
                                <View style={[styles.center, {height: 100, backgroundColor: '#F7F7F7', marginVertical: 10}]}>
                                    <TouchableOpacity onPress={() => this.openModal('references')}>
                                        <Image
                                            resizeMode="contain"
                                            style={{width: 75, height: 75}}
                                            source={require('./../assets/profile-icons/add.png')}
                                        />
                                    </TouchableOpacity>
                                </View>
                            }
                            {isReferences &&
                                <ListView
                                    enableEmptySections={true}
                                    dataSource={this.state.ds.cloneWithRows(this.state.references)}
                                    renderRow={this.renderRow.bind(this)}
                                />
                            }



                            <View style={[styles.center, {flexDirection: 'row'}]}>
                                <Image
                                    resizeMode="contain"
                                    style={{width: 30, height: 30}}
                                    source={require('./../assets/profile-icons/discussion-white-bg.png')}
                                />
                                <Text style={{marginLeft: 10}}>AVAILABILITY</Text>
                            </View>

                            <View style={[styles.center, {height: 100, backgroundColor: '#F7F7F7', marginVertical: 10}]}>

                                {!this.state.availabilityShow &&
                                    (<TouchableOpacity onPress={() => this.setState({ availabilityShow: true })}>
                                        <Image
                                            resizeMode="contain"
                                            style={{ width: 75, height: 75 }}
                                            source={require('./../assets/profile-icons/add.png')}
                                        />
                                    </TouchableOpacity>)}

                                {this.state.availabilityShow &&
                                    (<View style={{ justifyContent: 'center'}}>
                                        <View style={{ flexDirection: 'row', justifyContent: 'center'}}>
                                            <Button
                                                onPress={() => this.setState({ isFullTime: true })}
                                                containerStyle={this.state.isFullTime ? styles.activeButton : styles.passiveButton}
                                                style={this.state.isFullTime ? styles.activeButtonText : styles.passiveButtonText}>
                                                Full-Time(>30 Hours)
                                            </Button>
                                            <Button
                                                onPress={() => this.setState({ isFullTime: false })}
                                                containerStyle={!this.state.isFullTime ? styles.activeButton : styles.passiveButton}
                                                style={!this.state.isFullTime ? styles.activeButtonText : styles.passiveButtonText}>
                                                Part-Time(>30 Hours)
                                            </Button>
                                        </View>
                                        <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 10}}>
                                            <Button
                                                onPress={() => this.onAvailabilitySavePress()}
                                                containerStyle={styles.saveButton}
                                                style={{ color: 'white' }}>
                                                SAVE
                                            </Button>
                                        </View>
                                    </View>)}
                            </View>



                            <View style={[styles.center, {flexDirection: 'row', marginTop: 15}]}>
                                <Image
                                    resizeMode="contain"
                                    style={{width: 40, height: 40}}
                                    source={require('./../assets/profile-icons/privacy.png')}
                                />
                                <Text style={{marginLeft: 10, color: 'red', fontWeight: 'bold', fontSize: 18}}>PERSONAL INFORMATION</Text>
                            </View>
                            <View style={ [styles.center, {marginVertical: 10}] }>
                                <Text>
                                    The information below is not available to the
                                </Text>
                                <Text>
                                    employer until you are hired
                                </Text>
                            </View>



                            <View style={[styles.center, {flexDirection: 'row'}]}>
                                <Image
                                    resizeMode="contain"
                                    style={{width: 30, height: 30}}
                                    source={require('./../assets/profile-icons/icons-home.png')}
                                />
                                <Text style={{marginLeft: 10}}>HOME ADDRESS</Text>
                            </View>
                            {!isHomeAddress &&
                                <View style={[styles.center, {height: 100, backgroundColor: '#F7F7F7', marginVertical: 10}]}>
                                    <TouchableOpacity onPress={() => Actions.ZipCode({addressName: 'homeAddress'})}>
                                        <Image
                                            resizeMode="contain"
                                            style={{width: 75, height: 75}}
                                            source={require('./../assets/profile-icons/add.png')}
                                        />
                                    </TouchableOpacity>
                                </View>
                            }
                            {isHomeAddress &&
                                <View style={{backgroundColor:'white', marginTop: 10}}>
                                    <View style={{marginTop:10, paddingVertical: 10, flexDirection: 'row', justifyContent: 'space-between', backgroundColor:'rgba(216,216,216,0.2)'}}>
                                        <View>
                                            <Text style={{paddingLeft: 20}}>{homeAddress.homeAddress1}</Text>
                                            <Text style={{paddingLeft: 20}}>{homeAddress.homeAddress2}</Text>
                                            <Text style={{paddingLeft: 20}}>{homeAddress.region}, {homeAddress.zipCode}</Text>
                                        </View>
                                        <TouchableOpacity onPress={() => Actions.ZipCode({addressName: 'homeAddress'})}>
                                            <Image
                                                resizeMode="contain"
                                                style={{width: 40, height: 40}}
                                                source={require('./../assets/profile-icons/edit-button.png')}
                                            />
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            }


                            <View style={[styles.center, {flexDirection: 'row'}]}>
                                <Image
                                    resizeMode="contain"
                                    style={{width: 30, height: 30}}
                                    source={require('./../assets/profile-icons/icons-home.png')}
                                />
                                <Text style={{marginLeft: 10}}>CONTACT INFO</Text>
                            </View>
                            {contactInfoErrorMessage &&
                                <Text style={styles.errorText}>{contactInfoErrorMessage}</Text>
                            }
                            <View style={[styles.center, { backgroundColor: '#F7F7F7', marginVertical: 10}]}>
                                {!isContactInfoVerified &&
                                    <Image
                                        resizeMode="contain"
                                        style={{width: 20, height: 20, position: 'absolute', left: 8}}
                                        source={require('./../assets/profile-icons/phone.png')}
                                    />
                                }
                                {!isContactInfoVerified &&
                                    <Image
                                        resizeMode="contain"
                                        style={{width: 20, height: 20, position: 'absolute', left: 30}}
                                        source={require('./../assets/profile-icons/alert-red.png')}
                                    />
                                }
                                {(!contactInfoPhoneNumberEnterFields && !isContactInfoVerified) &&
                                    <TouchableOpacity onPress={() => this.setState({contactInfoPhoneNumberEnterFields: true})}>
                                        <Image
                                            resizeMode="contain"
                                            style={{width: 75, height: 75}}
                                            source={require('./../assets/profile-icons/add.png')}
                                        />
                                    </TouchableOpacity>
                                }
                                {contactInfoPhoneNumberEnterFields &&
                                    <View style={{width: width - 80, marginLeft: 45, justifyContent: 'center', alignItems: 'center'}}>
                                        <View style={styles.inputField}>
                                            <Input
                                                style={{paddingLeft: 20, marginTop: 2}}
                                                defaultValue={this.state.contactInfoPhoneNumber}
                                                onChangeText={(text) => this.setState({contactInfoPhoneNumber: text})}
                                                returnKeyType="next"
                                                keyboardType="numeric"
                                            />
                                        </View>
                                        <View style={{flexDirection: 'row'}}>
                                            <TouchableOpacity
                                                onPress={() => this.setState({contactInfoPhoneNumberEnterFields: false, contactInfoPhoneNumber: ''})}
                                                style={styles.contactInfoCancelButtonContainer}>
                                                <Text style={styles.contactInfoCancelButtonName}>CANCEL</Text>
                                            </TouchableOpacity>
                                            <TouchableOpacity
                                                onPress={() => this.contactInfoPhoneNumberValidation()}
                                                style={styles.contactInfoSaveButtonContainer}>
                                                <Text style={styles.contactInfoSaveButtonName}>SAVE</Text>
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                }
                                {isContactInfoVerified &&
                                    <View style={{backgroundColor:'white', width: width}}>
                                        <View style={{marginTop:10, paddingVertical: 10, flexDirection: 'row', justifyContent: 'space-between', backgroundColor:'rgba(216,216,216,0.2)'}}>
                                            <View style={[{flexDirection: 'row', padding: 10, alignItems: 'center', backgroundColor: '#F7F7F7'}]}>
                                                <Image
                                                    resizeMode="contain"
                                                    style={{width: 22, height: 23}}
                                                    source={require('./../assets/profile-icons/phone.png')}
                                                />
                                                <Text style={{marginLeft: 10}}>{phoneNumber}</Text>
                                            </View>
                                            <TouchableOpacity onPress={()=>Actions.EditContactInfo({id: id, contactInfo: {phoneNumber: phoneNumber, email: email}})}>
                                                <Image
                                                    resizeMode="contain"
                                                    style={{width: 40, height: 40}}
                                                    source={require('./../assets/profile-icons/edit-button.png')}
                                                />
                                            </TouchableOpacity>
                                        </View>
                                        <View style={{marginTop:10, paddingVertical: 10, flexDirection: 'row', justifyContent: 'space-between', backgroundColor:'rgba(216,216,216,0.2)'}}>
                                            <View style={[{flexDirection: 'row', padding: 10, alignItems: 'center', backgroundColor: '#F7F7F7'}]}>
                                                <Image
                                                    resizeMode="contain"
                                                    style={{width: 22, height: 23}}
                                                    source={require('./../assets/profile-icons/email.png')}
                                                />
                                                <Text style={{marginLeft: 10}}>{email}</Text>
                                            </View>
                                            <TouchableOpacity onPress={()=>Actions.EditContactInfo({id: id, contactInfo: {phoneNumber: phoneNumber, email: email}})}>
                                            <Image
                                                resizeMode="contain"
                                                style={{width: 40, height: 40}}
                                                source={require('./../assets/profile-icons/edit-button.png')}
                                            />
                                        </TouchableOpacity>
                                    </View>
                                </View>
                                }
                            </View>




                            <View style={[styles.center, {flexDirection: 'row', marginTop: 10}]}>
                                <Image
                                    resizeMode="contain"
                                    style={{width: 30, height: 30}}
                                    source={require('./../assets/profile-icons/profile.png')}
                                />
                                <Text style={{marginLeft: 10}}>IDENTIFICATION</Text>
                            </View>
                            {!isIdentified &&
                            <View style={[styles.center, {height: 100, backgroundColor: '#F7F7F7', marginVertical: 10}]}>
                                <Image
                                    resizeMode="contain"
                                    style={{width: 20, height: 20, position: 'absolute', left: 30}}
                                    source={require('./../assets/profile-icons/alert-red.png')}
                                />
                                <TouchableOpacity onPress={() => this.openModal('identification')}>
                                    <Image
                                        resizeMode="contain"
                                        style={{width: 75, height: 75}}
                                        source={require('./../assets/profile-icons/add.png')}
                                    />
                                </TouchableOpacity>
                            </View>
                            }
                            {isIdentified &&
                            <View style={{backgroundColor:'white', marginTop: 10}}>
                                <View style={{marginTop:10, paddingVertical: 10, flexDirection: 'row', justifyContent: 'space-between', backgroundColor:'rgba(216,216,216,0.2)'}}>
                                    <View>
                                        <Text style={{paddingLeft: 20}}>{identifyDocType} UPLOADED</Text>
                                    </View>
                                    <TouchableOpacity onPress={() => this.openModal('identification')}>
                                        <Image
                                            resizeMode="contain"
                                            style={{width: 40, height: 40}}
                                            source={require('./../assets/profile-icons/edit-button.png')}
                                        />
                                    </TouchableOpacity>
                                </View>
                            </View>
                            }



                            <View style={[styles.center, {flexDirection: 'row', marginTop: 10}]}>
                                <Image
                                    resizeMode="contain"
                                    style={{width: 30, height: 30}}
                                    source={require('./../assets/profile-icons/profile.png')}
                                />
                                <Text style={{marginLeft: 10}}>LANGUAGES</Text>
                                {isLanguages &&
                                (<View style={{position: 'absolute', right: 10}}>
                                    <TouchableOpacity onPress={() => Actions.Languages()}>
                                        <Image
                                            resizeMode="contain"
                                            style={{width: 30, height: 30}}
                                            source={require('./../assets/profile-icons/plus-button.png')}
                                        />
                                    </TouchableOpacity>
                                </View>)
                                }
                            </View>
                            {!isLanguages &&
                            (<View
                                style={[styles.center, {height: 100, backgroundColor: '#F7F7F7', marginVertical: 10}]}>
                                <TouchableOpacity onPress={() => Actions.Languages()}>
                                    <Image
                                        resizeMode="contain"
                                        style={{width: 75, height: 75}}
                                        source={require('./../assets/profile-icons/add.png')}
                                    />
                                </TouchableOpacity>
                            </View>)
                            }
                            {isLanguages &&
                            (<View style={{marginVertical: 10}}>
                                <ListView
                                    enableEmptySections={true}
                                    dataSource={this.state.ds.cloneWithRows(languages)}
                                    renderRow={this.renderLanguages.bind(this)}
                                />
                            </View>)
                            }
                        </View>
                    </ScrollView>
                </View>
                <Modal
                    offset={200}
                    open={this.state.openModal}
                    overlayBackground={'rgba(100, 100, 100, 0.3)'}
                    modalDidOpen={() => undefined}
                    modalDidClose={() => this.setState({openModal: false})}
                    containerStyle={styles.modalContainer}
                    modalStyle={styles.modalContentContainer}
                >
                    <View>
                        <View style={styles.modalContent}>
                            <Image
                                resizeMode="contain"
                                style={{width: 110, height: 110}}
                                source={modalData.imgUrl}
                            />
                            <Text style={styles.modalText}>{modalData.paragraph}</Text>
                            {modalData.type === 'verifyPhoneNumber' &&
                            <View style={styles.verifyNumberInputField}>
                                <Input
                                    style={{paddingLeft: 20, marginTop: 2}}
                                    defaultValue={this.state.phoneNumberVerifyCode}
                                    onChangeText={(text) => this.setState({phoneNumberVerifyCode: text})}
                                    returnKeyType="next"
                                    keyboardType="numeric"
                                    placeholder="CODE"
                                />
                            </View>
                            }
                            {(modalData.type === 'references' || modalData.type === 'identification' || modalData.type === 'verifyPhoneNumber') &&
                            <View>
                                <TouchableOpacity onPress={() => modalData.button1.url(modalData.button1.arguments)} style={styles.modalButtonContainer}>
                                    <Text style={styles.modalButtonName}>{modalData.button1.name}</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => modalData.button2.url(modalData.button2.arguments)}
                                                  style={( modalData.type === 'verifyPhoneNumber') ? styles.modalWhiteBackgroundButtonContainer : styles.modalButtonContainer}>
                                    <Text style={( modalData.type === 'verifyPhoneNumber') ? styles.modalWhiteBackgroundButtonName : styles.modalButtonName}>{modalData.button2.name}</Text>
                                </TouchableOpacity>
                            </View>
                            }
                            {(modalData.type === 'contactInfo') &&
                            <View>
                                <View style={styles.contactInfoModalButtonsRow}>
                                    <TouchableOpacity onPress={() => modalData.button1.url(modalData.button1.arguments)} style={styles.contactInfoModalSmallButtonContainer}>
                                        <Text style={styles.modalButtonName}>{modalData.button1.name}</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={() => modalData.button2.url(modalData.button2.arguments)} style={styles.contactInfoModalSmallButtonContainer}>
                                        <Text style={styles.modalButtonName}>{modalData.button2.name}</Text>
                                    </TouchableOpacity>
                                </View>
                                <View style={{justifyContent: 'center',alignItems: 'center'}}>
                                    <TouchableOpacity onPress={() => modalData.button1.url(modalData.button3.arguments)} style={styles.modalWhiteBackgroundButtonContainer}>
                                        <Text style={styles.modalWhiteBackgroundButtonName}>{modalData.button3.name}</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                            }
                        </View>
                        <View style={styles.modalFooterContainer}>
                            <TouchableOpacity onPress={() => this.setState({openModal: false})}>
                                <Image
                                    resizeMode="contain"
                                    style={{width: 50, height: 50}}
                                    source={require('./../assets/profile-icons/close-button-modal.png')}
                                />
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        ...Platform.select({
            ios: {
                paddingTop: 10
            },
            android: {
                paddingTop: 54
            }
        }),
    },
    center: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    activeButton: {
        padding: 3,
        height: 25,
        width: 170,
        overflow: 'hidden',
        borderRadius: 1,
        backgroundColor: '#007AFF'
    },
    activeButtonText: {
        fontSize: 15,
        color: 'white'
    },
    passiveButton: {
        padding: 3,
        height: 25,
        width: 170,
        overflow: 'hidden',
        borderRadius: 1,
        backgroundColor: 'white',
        borderWidth: 1,
        borderColor: '#007AFF'
    },
    passiveButtonText: {
        fontSize: 15,
        color: '#007AFF'
    },
    saveButton: {
        padding: 7,
        height: 35,
        width: 130,
        overflow: 'hidden',
        borderRadius: 1,
        backgroundColor: '#0022A1'
    },
    text: {
        fontSize: 15,
        color: '#4A4A4A',
    },
    modalContainer: {
        justifyContent: 'flex-start',
        alignItems: 'center'
    },
    modalContentContainer: {
        marginTop: 65,
        width: width * 0.8,
        padding: 0,
        borderRadius: 5,
        backgroundColor: 'transparent'
    },
    modalContent: {
        paddingTop: 10,
        paddingBottom: 20,
        paddingHorizontal: 20,
        borderRadius: 5,
        borderColor: 'rgb(153,153,153)',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white'
    },
    modalText: {
        color: '#4A4A4A',
        textAlign: 'center',
        paddingVertical: 10,
        width: width * 0.6
    },
    modalButtonContainer: {
        backgroundColor: '#0022A1',
        padding: 10,
        width: width * 0.55,
        marginVertical: 5
    },
    contactInfoModalSmallButtonContainer: {
        backgroundColor: '#0022A1',
        padding: 10,
        width: width * 0.3,
        marginVertical: 5,
        marginHorizontal: 5
    },
    modalWhiteBackgroundButtonContainer: {
        backgroundColor: 'white',
        borderWidth: 1,
        borderColor: 'grey',
        padding: 10,
        width: width * 0.55,
        marginVertical: 5,
    },
    modalButtonName: {
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center'
    },
    modalWhiteBackgroundButtonName: {
        color: 'black',
        fontWeight: 'bold',
        textAlign: 'center'
    },
    modalFooterContainer: {
        backgroundColor: 'transparent',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10
    },
    inputField: {
        borderColor: 'rgba(74,74,74,0.5)',
        backgroundColor: 'white',
        borderWidth: 1,
        height: 40,
        width: width - 80
    },
    verifyNumberInputField: {
        borderColor: 'rgba(74,74,74,0.5)',
        backgroundColor: 'white',
        borderWidth: 1,
        height: 40,
        width: width * 0.55
    },
    whiteBackgroundButtonContainer: {
        backgroundColor: 'white',
        padding: 10,
        width: (width - 100) / 2,
        marginTop: 10,
    },
    contactInfoCancelButtonContainer: {
        backgroundColor: 'white',
        padding: 10,
        width: (width - 100) / 2,
        marginTop: 10,
    },
    contactInfoSaveButtonContainer: {
        backgroundColor: '#0022A1',
        padding: 10,
        width: (width - 100) / 2,
        marginLeft: 10,
        marginTop: 10,
    },
    contactInfoCancelButtonName: {
        color: 'black',
        fontWeight: 'bold',
        textAlign: 'center'
    },
    contactInfoSaveButtonName: {
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center'
    },
    errorText: {
        color: 'red',
        textAlign: 'center',
        fontWeight: 'bold',
        marginTop: 2
    },
    contactInfoModalButtonsRow: {
        flexDirection: 'row'
    }
});

const userQuery = gql `
 query UserById($id: Uuid!){
  userById(id: $id){
    id
    firstName
    lastName
    zipCode
    homeAddress
    userPhoneConfirmed
    userPhoneNumber
    aboutMeText
    userReferenceNonDemosByUserId{
      edges{
        node{
          id
          firstName
          lastName
          referencePhoneNumber
          referenceEmailAddress
          relationship
          userId
        }
      }
    }
    userEmployersByUserId{
      nodes{
         id
         userId
         employerName
         city
         state
         jobTitle
         jobDescription
         startDate
         endDate
      }
    }
  	userEducationsByUserId{
      nodes{
        id
        userId
        educationalInstitutionName,
        city
        state
        awardType
        fieldOfStudy
        startDate
        endDate
      }
    }
    userLanguagesByUserId {
      nodes {
        id
        userId
        languageName
      }
    }
    userAvailabilityNonDemosByUserId {
      nodes {
        id
        userId
        hourRange
      }
    }
  }
}`;
const updateUserPhoneNumber = gql `
  mutation updateUserById($id: Uuid!, $userPhoneNumber: String) {
      updateUserById(input: {id: $id, userPatch: {userPhoneNumber: $userPhoneNumber}}) {
          user{
              userPhoneNumber
          }
      }
  }`;
const createUserAvailabilityNonDemo = gql `
    mutation createUserAvailabilityNonDemo($id: Uuid!, $userId: Uuid!, $hourRange: String!) {
        createUserAvailabilityNonDemo(input: {userAvailabilityNonDemo: {id: $id, userId: $userId, hourRange: $hourRange}}) {
            userAvailabilityNonDemo {
                id
                userId
                hourRange
            }
        }
    }`;
const updateUserAvailabilityNonDemoById = gql `
    mutation updateUserAvailabilityNonDemoById($id: Uuid!, $userId: Uuid!, $hourRange: String!) {
        updateUserAvailabilityNonDemoById(input: {id: $id, userAvailabilityNonDemoPatch: {userId: $userId, hourRange: $hourRange}}) {
            userAvailabilityNonDemo {
                id
                userId
                hourRange
            }
        }
    }`;
const MyProfile = compose(
    graphql(userQuery, {
        options: (ownProps) => {
            return {
                variables: {
                    id: ownProps.state.myProfile.id,
                }
            }
        }
    }),
    graphql(updateUserPhoneNumber, {
        name: 'updateUserPhoneNumber'
    }),
    graphql(createUserAvailabilityNonDemo, {
        name: 'createUserAvailabilityNonDemo'
    }),
    graphql(updateUserAvailabilityNonDemoById, {
        name: 'updateUserAvailabilityNonDemoById'
    })
)(MyProfileComponent);
export default MyProfile;


// To return this component to its original state, you must delete the row below, enable all gql template literals, and reactivate all source code under componentWillReceiveProps
export default MyProfileComponent



 */
