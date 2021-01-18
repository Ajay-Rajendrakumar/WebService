import React, { Component } from 'react';
import { connect } from 'react-redux';
import "../assets/css/login.css"
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
   Input
  } from "reactstrap";
import '../styles/login.css'
import { withRouter } from 'react-router-dom';
import * as questionaction from "../store/actions/questions.action";
import _, { matches, toInteger } from 'lodash';
import moment from 'moment';

let questionList={
    "1":{
        "question":"Calculate the difference between two dates",
        "parameters":["day","month","year","hour","minute","second"],
        "description":"To calculate the actual diffence between two give Dates.",
        "type":["datetime-local","datetime-local"],
        "no_of_inputs":2,
        "date":true,
        "title":["Date 1","Date 2"],
        "result":["Number of Days","Number of Months","Number of Years","Number of Hours","Number of Minutes","Number of Seconds"]

        },
    "2":{
        "question":"Perform Set theory operations such as Union, Minus, Intersection for the group of data",
        "parameters":["set_a","set_b"],
        "description":"To perform set theory operations on give 2 sets.",
        "type":["text","text"],
        "no_of_inputs":2,
        "title":["Set 1","Set 2"],
        "result":["Union","Intersection","Minus(A-B)","Minus(B-A)"]
        },
    "3":{
        "question":"Perform matrix operations like Transpose, Lower Diagonal (Left & Right), Upper Diagonal (Left & Right) and Swivel",
        "parameters":["order","matrix_a"],
        "description":"Description",
        "type":["number","text"],
        "no_of_inputs":2,
        "title":["Order","Matrix"],
        "result":["Transpose","Left Lower Diagonal","Right Lower Diagonal","Left Upper Diagonal","Rigth Upper Diagonal","Swivel Matrix"]

        },
    "4":{
        "question":"Convert the figure into words in currency",
        "parameters":["currency_amount"],
        "description":"Description",
        "type":["number"],
        "no_of_inputs":1,
        "title":["Currency"]
        
        },
    "5":{
        "question":"Implement the RSA algorithm for encryption and decryption",
        "parameters":["Message"],
        "description":"Description",
    },
    "6":{
        "question":"Generate the checksum value for the given sentence using md5 algorithm",
        "parameters":["Sentence"],
        "description":"Description",
    },
    "7":{
        "question":"Generate 128-bit bar code for alphanumeric data",
        "parameters":["Alphanumeric"],
        "description":"Description",
    },
    "8":{
        "question":"Generate QR code for alphanumeric data",
        "parameters":["Alphanumeric"],
        "description":"Description",
    },
    "9":{
        "question":"Generate a one-time password (OTP) in numbers, alphabet and alphanumeric",
        "parameters":["Length of OTP"],
        "description":"Description",
    },
    "10":{
        "question":"Generate a Completely Automated Public Turing test to tell Computers and Humans Apart (CAPTCHA) for the given string",
        "parameters":["Sentence"],
        "description":"Description",
    },
}
let parametersList={
    "1":["date_1","date_2"],
    "2":["set_a","set_b"],
    "3":["order","matrix_a"]
}
class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            qNo:1,
            currentQuestion:{},
            backendList:["Python","JavaScript","PHP"],
            selectedBackend:"Python",
            formdata:{
                "day_1":0,
                "month_1":0,
                "year_1":0,
                "hour_1":0,
                "minute_1":0,
                "second_1":0,         
                "day_2":0,
                "month_2":0,
                "year_2":0,
                "hour_2":0,
                "minute_2":0,
                "second_2":0,
                "set_a":"",
                "set_b":"",
                "order":0,
                "matrix":"",
                "currency_amount":0,
                
            },
            validateMsg:"",
            result_data:[],
            result_collection:[],
        }
    }
    componentDidMount(){
        this.questionLoader(this.state.qNo)
    }
    handleSubmit = (e) => {
        e.preventDefault();
        let { formdata,qNo,selectedBackend } = { ...this.state }
        if(this.validateState()){ 

        let fd = new FormData()
        fd=this.setParameters(qNo)
        this.props.distributer(fd,qNo,selectedBackend).then(response => {
            console.log("her",response,response['data'].status)
            if(response['data'].status===200){
              let data=response['data']    
              let question = data['question']
              let result= data['result']              
              let params = questionList[question]['result']
              let output={}
              let error=""
                if(data['error']){
                    error=data['error']
                }else{
                  params.map((key,ind)=>{
                        output[key]=result[ind]
                  })
                }

              let obj={
                  question:question,
                  result:output,
                  language:data['language'],
                  title:data['title'],
                  params:data['params'],
                  time:moment().format('LT'),
                  error:error,
              }
              let {result_data}={...this.state}
              result_data.push(obj)
              console.log(obj)
              this.setState({result_data})
              this.questionLoader(qNo)
            }else{
                
              this.toasterHandler("error", "Cant reach the server")
            }
          }).catch((err)=>{
            this.toasterHandler("error", "Cant reach the server")
          })
        }
    }

    setParameters(qNo){
        let { formdata } = { ...this.state }
        let fd = new FormData()
        let params=parametersList[qNo]
        if(qNo===1){
            fd.append("date_1",formdata['day_1']+"/"+formdata['month_1']+"/"+formdata['year_1']+"/"+formdata['hour_1']+"/"+formdata['minute_1']+"/"+formdata['second_1']+"/")
            fd.append("date_2",formdata['day_2']+"/"+formdata['month_2']+"/"+formdata['year_2']+"/"+formdata['hour_2']+"/"+formdata['minute_2']+"/"+formdata['second_2']+"/")
        }else{
            params.map((key,id)=>{
                fd.append(key,formdata[key])
            })
        }
        return fd
    }
  
    handleBackendChange=(e)=>{
        this.setState({selectedBackend:e.target.value})
    }
    toasterHandler = (type, msg) => {
        toast[type](msg, {
            position: toast.POSITION.TOP_RIGHT,
        });
    }

    questionLoader=(qNo)=>{
        let { currentQuestion,result_collection,result_data } = { ...this.state }
        currentQuestion=questionList[qNo]
        result_collection=_.reverse(_.filter(result_data,{ 'question':qNo}));
        this.setState({currentQuestion,result_collection})

    }

    handleNextQuestion=()=>{
        let { qNo } = { ...this.state }
        qNo=qNo+1
        if(qNo>Object.keys(questionList).length){
            qNo=1
        }
        this.questionLoader(qNo)
        this.setState({qNo})
    }

    handlePreviousQuestion=()=>{
        let { qNo } = { ...this.state }
        qNo=qNo-1
        if(qNo<1){
            qNo=Object.keys(questionList).length
        }
        this.questionLoader(qNo)
        this.setState({qNo})
    }
    getName=(name)=>{
            name = name.replace("_", " ")
            name = _.startCase(name);
            return name
    }
    handleChange=(e)=>{
        
        let { formdata } = { ...this.state }
        formdata[e.target.name] = e.target.value       
        this.setState({ formdata })
    }
    validateState(){
        let {formdata ,qNo,validateMsg}={...this.state}
        let flag = 0
        if(qNo===1){
            let date1=this.dateValidation(formdata["day_1"],formdata["month_1"],formdata["year_1"],formdata["hour_1"],formdata["minute_1"],formdata["second_1"])
            let date2=this.dateValidation(formdata["day_2"],formdata["month_2"],formdata["year_2"],formdata["hour_2"],formdata["minute_2"],formdata["second_2"])
            if(date1 && date2){
                return true
            }else{
                validateMsg="Invalid Date"
            }
        }else{
            return true
        }
        
        this.setState({validateMsg},()=>{
            this.toasterHandler("error", validateMsg)
            return false
        })
        
    }

    dateValidation(day,month,year,hour,minute,second){

            if(day!="" && month!="" && year!="" && minute!="" && second!="" && hour>=0 && hour<24 && minute>=0 && minute<=60 && second>=0 && second<=60 && day>=1 && day<=31 && month>=1 && month<=12 && year>=1){
                return true
            }
            return false
    }

    printSet=(set)=>{
        let res="[ "
        set.map((val,ind)=>{
            if(ind!=0)
                res=res+","+val
            else    
                res=res+val
        })
        res=res+" ]"
        return res
    }
    printMatrix=(value,ind)=>{
        let {formdata}={...this.state}
        if(value){
            if(ind==0){
                    return (value+ " * "+value)
            }else{
                let array=value.split(/\s+/);
                let order=formdata['order']
                if(order>1){
                    let count=0;
                    let matrix=[]
                    let temp=[]
                    if(array.length>=(order*order))
                        array.splice(order*order+1,array.length)
                    array.map((val,ind)=>{
                        
                        if(count === (toInteger(order))){
                            matrix.push(temp)
                            temp=[]
                            temp.push(val)
                            count=1
                        }else{
                            temp.push(val)
                            count=count+1
                        }
                    })
                    return this.matrixGen(matrix)
                }else{
                    this.toasterHandler('error',"Enter valid Order")
                }
            }
        }
    }
    matrixGen=(matrix)=>{
        return (
            <div className="m-1">
              {matrix.map((row, i) => (
                <div key={i}>
                  {row.map((col, j) => (
                    <span className="m-1" key={j}>{col}</span>
                  ))}
                </div>
              ))}
            </div>
          );
    }
    render() {
        let {qNo,currentQuestion,backendList,formdata,result_collection}={...this.state}
        return (
             <div className="main-container">
               <div className="question-container shadow-lg p-3 mb-5 bg-white rounded">
                <div className="d-flex justify-content-between">
                            <div className="m-1">
                                <button className="btn-primary btn-lg" onClick={e=>this.handlePreviousQuestion()}>
                                <i className="fa fa-caret-square-o-left fa-lg" aria-hidden="true"></i>
                                </button>
                                <button className="btn-success btn-lg ml-2 disable">
                                <span className="m-2">{"Question:    "+ qNo }</span>
                                </button>
                            </div>
                            <div className="question-text  d-flex align-items-center">
                                  <span className="text-info font-weight-bold">  {currentQuestion && currentQuestion["question"] && currentQuestion["question"]}</span>
                            </div>
                        <div className="m-1">
                                <button className="btn-primary btn-lg" onClick={e=>this.handleNextQuestion()}>
                                <i className="fa fa-caret-square-o-right fa-lg" aria-hidden="true"></i>
                                </button>
                        </div>
                        
                </div>
               </div>
               <div className="row d-flex justify-content-between m-2">
                   <div className="border col-2 parameter-div shadow-sm p-3 mb-5 bg-white rounded">
                   <div class="card mt-2">
                      <div class="card-body">
                        <h5 class="card-title font-weight-bold text-info">Description</h5>
                        <p class="card-text">  
                       {currentQuestion && currentQuestion["description"] && currentQuestion["description"]}
                        </p>
                    </div>
                    </div>
                   <div class="card mt-3">
                      <div class="card-body">
                        <h5 class="card-title font-weight-bold text-info">Parameters</h5>
                        <p class="card-text">  
                        <ul>
                            {currentQuestion && currentQuestion["parameters"] && currentQuestion["parameters"].map((item,ind)=>
                                <li key={ind}>{this.getName(item)}</li>
                            )}
                        </ul>
                        </p>
                    </div>
                    </div>
                  
                   </div>
                   <div className="border col m-2 input-div shadow-sm p-3 mb-5 bg-white rounded">
                     <span className="font-weight-bold text-primary h4">Input</span>
                     <hr></hr>
                     <div className="inputContainer">
                        {currentQuestion && currentQuestion["no_of_inputs"] && [...Array(currentQuestion["no_of_inputs"])].map((item,ind)=>
                           
                           currentQuestion["date"]?
                                <div class="card m-2" key={ind}>
                                <div class="card-body">
                                    <h5 class="card-title font-weight-bold text-danger">{currentQuestion["title"][ind]+":"}</h5>
                                    <div class="card-text row">  
                                        {currentQuestion["parameters"].map((key,id)=>
                                            <div key={id} className="col m-1">
                                            <label>{this.getName(key)}</label>
                                                <input  className="form-control" type={"number"} name={key+"_"+(ind+1)} value={formdata[key+"_"+(ind+1)]} min="0" onChange={e=>this.handleChange(e)}></input>
                                            </div> 
                                        )}
                                    </div>
                                </div>
                                </div>
                  
                           :
                           <div class="card m-2" key={ind}>
                                <div class="card-body">
                                    <h5 class="card-title font-weight-bold text-danger">{currentQuestion["title"][ind]+":"}</h5>
                                    <p class="card-text">  
                                    <input key={ind} className="form-control" name={currentQuestion["parameters"][ind]} value={formdata[currentQuestion["parameters"][ind]]} type={currentQuestion["type"][ind]} onChange={e=>this.handleChange(e)}></input>
                                    </p>
                                </div>
                            </div>
                       
                         )}
                     </div>
                    
                   
                     <div className="m-2 row d-flex justify-content-end InputFooter ">
                     <div className="mr-4 col-9 inputDisplay border">
                           <span className="text-dark  h6">Given Input:</span>
                           <br></br>
                           {
                               qNo===1?
                               <div className="m-1">
                               {[...Array(2)].map((item,ind)=>
                                  <div className="mt-4">
                                      <span className="text-primary h5 font-weight-bold">{"Date " + (ind+1)}</span><br></br>
                                      <div className="h5 m-1">
                                          {formdata["day_"+(ind+1)]+"/"+formdata["month_"+(ind+1)]+"/"+formdata["year_"+(ind+1)]+"  -  "+formdata["hour_"+(ind+1)]+":"+formdata["minute_"+(ind+1)]+":"+formdata["second_"+(ind+1)]}
                                      </div>
                                  </div>
                               )}
                            </div>
                        :
                               questionList && questionList[qNo]["parameters"].map((key,ind)=>      
                               <div className="mt-4">
                               <span className="text-primary h5 font-weight-bold">{this.getName(key)}</span><br></br>
                               <div className="h5 m-1">
                                   
                                   {
                                    qNo===2?   
                                       <span>{"["+ formdata[key].split(' ').join(',') +"]"}</span>
                                       :
                                    qNo===3?
                                   
                                        this.printMatrix(formdata[key],ind)
                                        :

                                       <span>{formdata[key]}</span>
                                   }
                                </div>
                             </div>
                               )
                           }
                    </div>
                        <div className="mt-5">
                            <div >
                                <Input type="select" name="backend" id="backend" onChange={e=>this.handleBackendChange(e)}>
                                    {backendList && backendList.map((item,ind)=>
                                            <option key={ind}>{item}</option>
                                    )}         
                                </Input>
                            </div><br></br>
                            <div>
                                    <button className="btn-primary btn-lg ml-2" onClick={e=>this.handleSubmit(e)}>
                                    Submit
                                    </button>
                            </div>
                        </div>
                     </div>
                   </div>
                   <div className="border col m-2 output-div shadow-sm p-3 mb-5 bg-white rounded">
                        <span className="font-weight-bold text-primary h4">Output</span>
                        <hr></hr>

                        <div className="output-pane">
                        {
                            result_collection && result_collection.map((key,ind)=>
                                <div class="card m-2" key={ind}>
                                <div class="card-body">
                                    <h6 class="card-title row font-weight-bold text-info h6">
                                        <div className="col-10">{(ind+1) +')'+key['title']}<span className="text-success">{' ('+key['language']+')'}</span></div>
                                        <div className="col-2">{key['time']}</div>
                                        </h6>
                                    <div class="card-text"> 
                                    <span className="font-weight-bold">Input</span> 
                                    <ul className="bl-list"> 
                                    {
                                        key['params'].map((que,ind)=>
                                        <li key={ind}><span className="font-weight-bold">{this.getName(parametersList[key['question']][ind]) +' : '}</span>
                                      
                                            {key['question']===2?
                                                    this.printSet(que)
                                                :
                                                    que
                                            }
                                        
                                        </li>
                                        )
                                    }
                                    </ul>
                                    <hr></hr>
                                    {
                                    !_.isEmpty(key['result']) ?
                                    <div>
                                        <span className="font-weight-bold">Result</span> 
                                        <ul className="bl-list"> 
                                        {
                                            Object.keys(key['result']).map((ans,ind)=>
                                            <li key={ind}><span className="font-weight-bold">{ans+" : "}</span>
                                                {
                                                    key['question']==2?
                                                        this.printSet(key['result'][ans])
                                                    :
                                                    key['question']==3?
                                                        this.matrixGen(key['result'][ans])
                                                    :
                                                    key['result'][ans]}</li>
                                            )
                                        }
                                        </ul>
                                    </div>:
                                           <span className="font-weight-bold h5 text-danger">{key['error']}</span> 
                                        }
                                    </div>
                                </div>
                            </div>

                            )
                        }
                       </div>
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