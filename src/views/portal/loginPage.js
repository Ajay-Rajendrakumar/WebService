import React, { Component } from 'react';
import { connect } from 'react-redux';
import "../../assets/css/login.css"
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
   Input
  } from "reactstrap";
import '../../styles/login.css'
import { withRouter } from 'react-router-dom';
import * as questionaction from "../../store/actions/questions.action";
import _, { matches, toInteger } from 'lodash';
import moment from 'moment';


let parametersList={
    "1":["email","password"],
    "2":["email","regno","phno"],
    "4":["email",'newpwd','otp']

}
class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            backendList:["Python","JavaScript","PHP"],
            selectedBackend:"Python",
            formdata:{
             email:"",
             password:"",
             regno:"",
             phno:"",
             repwd:"",
             newpwd:"",
             otp:"",
            },
            validateMsg:"",
            result_data:[],
            result_collection:[],
            currentMode:""
        }
    }
    componentDidMount(){
        this.handleModeChange("login")
        //this.handleModeChange("dashboard")
    }
    returnType=(e)=>{
        let { currentMode } = { ...this.state }
        if(currentMode===1){
            return "Portal_login";
        }else
        if(currentMode===2){
            return "Portal_register";
        }else
        if(currentMode===3){
            return "Portal_read";
        }else
        if(currentMode===4){
            return "Portal_changePwd";
        }

    }
    handleSubmit = (e) => {
        e.preventDefault();
        let { currentMode,userData } = { ...this.state }
        this.setState({warning:""})
        let { formdata,selectedBackend,result_data } = { ...this.state }
        let fd = new FormData()
        fd=this.setParameters()
        this.props.distributer(fd,this.returnType(),selectedBackend).then(response => {
            console.log("her",response,response['data'].status)
            if(response['data'].status===200){
              let data=response['data'].data       
              if(currentMode===1){
                this.handleModeChange("dashboard")
                this.setState({userData:data})
              }   
              this.setState({warning:response['data'].message})
            }else{
            this.setState({warning:response['data'].error})
              this.toasterHandler("error", response['data'].error)
            }
        }).catch((err)=>{
            this.toasterHandler("error", "Cant reach the server")
        })
        }
        handleOtp = (e) => {
            e.preventDefault();
            let { currentMode,userData } = { ...this.state }
            this.setState({warning:""})
            let { selectedBackend } = { ...this.state }
            let fd = new FormData()
            fd.append("email",userData['email'])
            this.props.distributer(fd,"Portal_read",selectedBackend).then(response => {
                if(response['data'].status===200){      
                  this.setState({warning:response['data'].message})
                }else{
                this.setState({warning:response['data'].error})
                  this.toasterHandler("error", response['data'].error)
                }
            }).catch((err)=>{
                this.toasterHandler("error", "Cant reach the server")
            })
            }

    setParameters(){
        let { formdata,currentMode } = { ...this.state }
        let fd = new FormData()
        let params=parametersList[currentMode]
        params.map((key,id)=>{
            fd.append(key,formdata[key])
        })
        return fd
    }
  
    handleBackendChange=(e)=>{
        if(e.target.value==="PHP"){
           this.setState({selectedBackend:"Python"})
        }else{
        this.setState({selectedBackend:e.target.value})
       }
    }
    toasterHandler = (type, msg) => {
        toast[type](msg, {
            position: toast.POSITION.TOP_RIGHT,
        });
    }
    handleChange=(e)=>{
        let { formdata } = { ...this.state }
        formdata[e.target.name] = e.target.value       
        this.setState({ formdata })
    }
    handleModeChange=(ind)=>{
        let { currentMode } = { ...this.state }
        if(ind==="login"){
            currentMode=1
        }else
        if(ind==="register"){
            currentMode=2
        }else
        if(ind==="dashboard"){
            currentMode=3
        }else
        if(ind==="pwdChange"){
            currentMode=4
        }
        this.setState({currentMode,warning:""})
        
    }
    loginTab=()=>{
        let { currentMode } = { ...this.state }
        return (
                <div className="d-flex justify-content-center">
                                <div>
                                <ul className="nav nav-tabs">
                                <li className="nav-item">
                                    <a className={"nav-link "} onClick={e=>this.handleModeChange("login")}><span className={currentMode===1 ? " font-weight-bold text-primary": ""}>Login</span></a>
                                </li>
                                <li className="nav-item">
                                    <a className={"nav-link  "} onClick={e=>this.handleModeChange("register")}><span className={currentMode===2 ? " font-weight-bold text-primary": ""}>Register</span></a>
                                </li>
                            </ul>
                            </div>
                            </div>
                        
        )
    }
    render() {
        let {formdata,currentMode,backendList,warning,userData}={...this.state}
        return (
            <div className="main-container">
                <div className="login-component bg-primary">
                
                    {currentMode===1?
                        <div className="loginDiv bg-white">
                            {this.loginTab()}
                        <div className="d-flex justify-content-center">
                        <div className="m-4"><span className="h1 m-5 text-primary ">Login</span>
                        <hr></hr></div>
                        </div>
                        <div className="row d-flex justify-content-center">
                            <div className="m-2 col-8">
                             <label>Email</label>
                                <input  className="form-control" type={"text"} name="email" value={formdata['email']} onChange={e=>this.handleChange(e)}></input>
                            </div>

                        </div>
                        <div className="row d-flex justify-content-center">
                            <div className="m-2 col-8">
                             <label>Password</label>
                                <input  className="form-control" type={"password"} name="password" value={formdata['password']} onChange={e=>this.handleChange(e)}></input>
                            </div>
                        </div>
                        <div className="row d-flex justify-content-center ">
                                    
                                    <button className="btn-primary btn-lg m-4 col-8" onClick={e=>this.handleSubmit(e)}>
                                    Submit
                                    </button>
                                    
                        </div>
                        <div className="row d-flex justify-content-center ">
                        <label className="text-danger text-center">{warning}</label>
                        </div>
                    </div>
                    :
                    currentMode===2?
                        <div className="loginDiv bg-white">
                            {this.loginTab()}
                        <div className="d-flex justify-content-center">
                        <div className="m-3"><span className="h1 m-5 text-primary ">Registration</span>
                        <hr></hr></div>
                        </div>
                        <div className="row d-flex justify-content-center">
                            <div className="m-2 col-8">
                            <label>Register Number</label>
                                <input  className="form-control" type={"text"} name="regno" value={formdata['regno']} onChange={e=>this.handleChange(e)}></input>
                            </div>

                        </div>
                        <div className="row d-flex justify-content-center">
                            <div className="m-2 col-8">
                            <label>Email</label>
                                <input  className="form-control" type={"text"} name="email" value={formdata['email']} onChange={e=>this.handleChange(e)}></input>
                            </div>

                        </div>
                        <div className="row d-flex justify-content-center">
                            <div className="m-2 col-8">
                            <label>Phone Number</label>
                                <input  className="form-control" type={"text"} name="phno" value={formdata['phno']} onChange={e=>this.handleChange(e)}></input>
                            </div>
                            
                        </div>
                        <div className="row d-flex justify-content-center ">
                                    <button className="btn-primary btn-lg m-3 col-8" onClick={e=>this.handleSubmit(e)}>
                                    Register
                                    </button>
                                    
                        </div>
                        <div className="row d-flex justify-content-center ">
                        <label className="text-danger text-center">{warning}</label>
                        </div>
                    </div>
                    :
                    currentMode===3?
                    <div>
                        <div className="row">
                                <div className="col-10"></div>
                                <div className="col-2">
                                <button className="btn-success btn-sm m-2" onClick={e=>this.handleModeChange("pwdChange")}>
                                    Change Password
                                </button>
                                </div>
                                
                        </div>
                    <div className="dashboard row d-flex justify-content-center">
                        <span className="h3 text-primary m-2">User Details</span>
                        {userData &&   <table className="table table-striped m-3">
                        {Object.keys(userData).map((key,ind) => 
                            <tr key={ind}>
                                <td className="font-weight-bold">{key}</td>
                                <td>{userData[key]}</td>
                            </tr>
                        )}
                        </table>}
                    </div>
                    </div>
                    :
                    <div>
                    <div className="row">
                            <div className="col-10"></div>
                            <div className="col-2">
                            <button className="btn-success btn-sm m-2" onClick={e=>this.handleModeChange("dashboard")}>
                                Back
                            </button>
                            </div>
                            
                    </div>
                    <div className="loginDiv bg-white">
                        <div className="d-flex justify-content-center">
                        <div className="m-3"><span className="h1 m-5 text-primary ">Password Change</span>
                        <hr></hr></div>
                        </div>
                        <div className="row d-flex justify-content-center">
                            <div className="m-2 col-8">
                            <label>New Password</label>
                                <input  className="form-control" type={"text"} name="newpwd" value={formdata['newpwd']} onChange={e=>this.handleChange(e)}></input>
                            </div>

                        </div>
                        
                        <div className="row d-flex justify-content-center">
                            <div className="m-2 col-8">
                            <label>One Time Password</label>
                                <input  className="form-control" type={"text"} name="otp" value={formdata['otp']} onChange={e=>this.handleChange(e)}></input>
                            </div>
                            
                        </div>
                        <div className="row d-flex justify-content-center ">
                                     <div className="d-flex justify-content-center col-5">
                                    <button className="btn-info btn-lg m-3" onClick={e=>this.handleOtp(e)}>
                                    Get OTP
                                    </button>
                                    </div>
                                    <div className="d-flex justify-content-center col-5">
                                    <button className="btn-primary btn-lg m-3" onClick={e=>this.handleSubmit(e)}>
                                    Change
                                    </button>
                                    </div>
                                    
                        </div>
                        <div className="row d-flex justify-content-center ">
                        <label className="text-danger text-center">{warning}</label>
                        </div>
                    </div>
                    </div>
                    }
                    <div className="backendPosition">
                    <Input type="select" name="backend" id="backend" onChange={e=>this.handleBackendChange(e)}>
                                    {backendList && backendList.map((item,ind)=>
                                            <option key={ind}>{item}</option>
                                    )}         
                                </Input>
                    </div>

                </div>
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {

    };
}

function mapDispatchToProps(dispatch) {
    return {
        distributer: (data,question,backend) => { return dispatch(questionaction.distributer(data,question,backend)); },
    };
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Login));