import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import logo from "../assets/img/WhiteLogo.png"
import * as types from "../store/actions/types";

 class sidemenu extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showSideBar:"",
        }
    }
    componentDidMount(){
        let loggeduser=JSON.parse(sessionStorage.getItem('loggeduser'))
        if(loggeduser && loggeduser.profile_type!=="3"){
            this.setState({showSideBar:true})
        }else{
            this.setState({showSideBar:false})
        }
    }

    render() {
        let {showSideBar}={...this.state}
        return (
            <div className="side-menu ">
                <div className="logo-placeholder p-1">
                <span className="logo ml-n1 c-pointer"  onClick={e => {showSideBar && this.props.history.push("/userDetails")}}>
                            <img  src={logo} alt="Reas-Logo"  className="ReasLogo"/>
                        </span>
                        
                </div>
                {showSideBar &&
                <>
                <div className='menu-icon '> <i className="fas fa-angle-right fa-lg "></i></div>
                <div className="sidemenu-body ">
                    <div className="mb-2 mt-2 "
                     onClick={e => { this.props.history.push("/userDetails")}}
                    >
                        < i className = "fas fa-users " ></i>
                        <span className="ml-3">User Details</span>
                </div>
                <div className="mb-2 mt-4  " 
                onClick={e => { this.props.history.push("/AllAssessments")}}
                >
                        < i className = "fas fa-list" ></i>
                        <span className="ml-3"> Assessments</span>
                </div>
            </div>
                </>}
            </div >
        );
    }
}


function mapStateToProps(state) {
    return {

    };
}

function mapDispatchToProps(dispatch) {
    return {
        Header: (title) => { return dispatch({ type: types.PAGE_TITLE, payload: title }) },

    };
}
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(sidemenu));