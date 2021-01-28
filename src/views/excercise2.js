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
    "5":{
        "question":"Design an Basic Statistics Calculator (Standard Deviation, Variance, Linear Regression)",
        "subQuestion":["Variance and Standard Deviation","Linear Regression"],
        "subQuestionList":{
            "Variance and Standard Deviation":{
                "question":"Variance and Standard Deviation",
                "type":["text"],
                "parameters":["Numberlist"],
                "no_of_inputs":1,
                "title":["Set of Numbers"],
                "result":["Variance","Standard Deviation"]
            },
            "Linear Regression":{
                "question":"Linear Regression",
                "type":["text","text"],
                "parameters":["xList","yList"],
                "no_of_inputs":2,
                "title":["Set of Numbers(X)","Set of Numbers(Y)"],
                "result":["Linear Regression"]
            }
        } 
        },
    "1":{
        "question":"Design an Electrical Calculator (Amps, kW, kVA,VA,volts,watts,joules,kW, mAh,Wh)",
        "subQuestion":["Electric Convertion"],
        "subQuestionList":{
                "Electric Convertion":{
                    "question":"Electric Convertion",
                    "type":["number","number","number","number","number","number","number","number","number","number"],
                    "parameters":["amp","volt","watt","time","kw","kva","va","joule","mah","wh"],
                    "no_of_inputs":10,
                    "title":["Ampere","Volts","Watts","Time","KiloWatt(kW)","kilovolt-ampere(kVA)","volt-ampere(VA)","joules","milliamp Hour(mAh)","watt-hour(Wh)"],
                    "result":["Ampere(Amps)","volts","watts","KiloWatt(kW)","kilovolt-ampere(kVA)","Joule","volt-ampere(VA)","milliamp Hour(mAh)","watt-hour(Wh)","Time"]
            }
        }
        },
    "2":{
        "question":"Design an Math-Log1 Calculator (Logarithm(log), Natural Logarithm (ln), Anti-logarithm)",
        "subQuestion":["Logarithm","AntiLogarithm"],
        "subQuestionList":{
            "Logarithm":{
                "question":"Logarithm",
                "type":["number"],
                "parameters":["number"],
                "no_of_inputs":1,
                "title":["Logarithm"],
                "result":["Natural Logarithm(x)","Logarithm(x)"]
            },
            "AntiLogarithm":{
                "question":"AntiLogarithm",
                "type":["number"],
                "parameters":["number"],
                "no_of_inputs":1,
                "title":["AntiLogarithm"],
                "result":["AntiLogarithm(x)"]
            }
        }
        },
    "3":{
        "question":"Design an Math-Log2 Calculator (GCF,LCM, Squre-root, Cube-root and Nth-root )",
        "subQuestion":["GCF and LCM","Square and Cube root","Nth root"],
        "subQuestionList":{
            "GCF and LCM":{
                "question":"GCF and LCM",
                "type":["text"],
                "parameters":["Numberlist"],
                "no_of_inputs":1,
                "title":["Enter The Numbers"],
                "result":["GCF","LCM"]
            },
            "Square and Cube root":{
                "question":"Square and Cube root",
                "type":["number"],
                "parameters":["number"],
                "no_of_inputs":1,
                "title":["Enter The Number"],
                "result":["Square root","Cube root"]
            },
            "Nth root":{
                "question":"Nth root",
                "type":["number","number"],
                "parameters":["number","place"],
                "no_of_inputs":2,
                "title":["Number","N Value"],
                "result":["Nth root"]
            }
        }  
        },
    "4":{
        "question":"Design an Math-Log3 Calculator (Trigonometry – Sin, Cos, Tan, Arcsin, Arccos, Arctan, Sec, Cosec, Cot)",
        "subQuestion":["trignomentry"],
        "subQuestionList":{
            "trignomentry":{
            "question":"trignomentry",
                "type":["number","number"],
                "parameters":["degree","radian"],
                "checkbox":true,
                "checkIndex":0,
                "no_of_inputs":1,
                "title":["Degree","Radian"],
                "result":["Sin","Cos","Tan","Sec","Cosec","Cot"]
        }
    }
    },
}

let parametersList={
    "Variance and Standard Deviation":["Numberlist"],
    "Linear Regression":["xList","yList"],
    "GCF and LCM":["Numberlist"],
    "Square and Cube root":["number"],
    "Nth root":["number","place"],
    "trignomentry":["degree","radian"],
    "Logarithm":["number"],
    "AntiLogarithm":["number"],
    "Electric Convertion":["amp","volt","watt","time","kw","kva","va","joule","mah","wh"]
}
class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            qNo:1,
            currentQuestion:{},
            subQuestionList:[],
            currentSubQuestion:{},
            backendList:["Python","JavaScript","PHP"],
            selectedBackend:"Python",
            formdata:{
               "Numberlist":"",
               "xList":"",
               "yList":"",
               "number":"",
               "place":"",
               "radian":"",
               "degree":"",
               "amp":"",
               "kw":"",
               "kva":"",
               "va":"",
               "volt":"",
               "watt":"",
               "joule":"",
               "mah":"",
               "wh":"",
               "time":"",

            },
            validateMsg:"",
            result_data:[],
            result_collection:[],
        }
    }
    componentDidMount(){
        this.questionLoader(this.state.qNo,true)
    }
    handleSubmit = (e) => {
        e.preventDefault();
        let { formdata,qNo,selectedBackend,currentSubQuestion } = { ...this.state }
        if(this.validateState()){ 

        let fd = new FormData()
        fd=this.setParameters()
        this.props.distributer(fd,currentSubQuestion["question"],selectedBackend).then(response => {
            console.log("her",response,response['data'].status)
            if(response['data'].status===200){
              let data=response['data']    
              let question = data['question']
              let result= data['result']              
              let params = currentSubQuestion['result']
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
              console.log(result_data)
              this.setState({result_data})
              this.questionLoader(qNo,false)
            }else{
                
              this.toasterHandler("error", "Cant reach the server")
            }
          }).catch((err)=>{
            this.toasterHandler("error", "Cant reach the server")
          })
        }
    }

    setParameters(){
        let { formdata,currentSubQuestion } = { ...this.state }
        let fd = new FormData()
        let params=parametersList[currentSubQuestion["question"]]
        params.map((key,id)=>{
            fd.append(key,formdata[key])
        })
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

    questionLoader=(qNo,flag)=>{
        let { currentQuestion,subQuestionList,currentSubQuestion,result_collection,result_data } = { ...this.state }
        currentQuestion=questionList[qNo]
        subQuestionList=currentQuestion['subQuestion']
        if(subQuestionList.length>0 && flag){
            currentSubQuestion = currentQuestion['subQuestionList'][subQuestionList[0]]
        }
        else if(!flag){
            currentSubQuestion = currentSubQuestion
        }else{
            currentSubQuestion = {}
        }
        result_collection=_.reverse(_.filter(result_data,{ 'question':currentSubQuestion["question"]}));
        this.setState({currentQuestion,result_collection,subQuestionList,currentSubQuestion})

    }

    handleNextQuestion=()=>{
        let { qNo } = { ...this.state }
        qNo=qNo+1
        if(qNo>Object.keys(questionList).length){
            qNo=1
        }
        this.questionLoader(qNo,true)
        this.setState({qNo})
    }

    handlePreviousQuestion=()=>{
        let { qNo } = { ...this.state }
        qNo=qNo-1
        if(qNo<1){
            qNo=Object.keys(questionList).length
        }
        this.questionLoader(qNo,true)
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
       
        return true
        
        
        this.setState({validateMsg},()=>{
            this.toasterHandler("error", validateMsg)
            return false
        })
        
    }
    handleSubQuestion=(e)=>{
        console.log(e.target.value)
        let { currentQuestion,result_collection,result_data,currentSubQuestion } = { ...this.state }
        currentSubQuestion = currentQuestion['subQuestionList'][e.target.value]
        result_collection=_.reverse(_.filter(result_data,{ 'question':currentSubQuestion["question"]}));
        this.setState({currentSubQuestion,result_collection})
    }
    handleInputChange=()=>{
        let { currentSubQuestion,formdata} = { ...this.state }
        currentSubQuestion['checkIndex']=currentSubQuestion['checkIndex']+1
        if(currentSubQuestion['checkIndex']>currentSubQuestion['parameters'].length-1){
            currentSubQuestion['checkIndex']=0
        }
        currentSubQuestion['parameters'].map((key)=>{
            formdata[key]=""
        })
        this.setState({currentSubQuestion,formdata})
    }

    render() {
        let {qNo,currentQuestion,currentSubQuestion,subQuestionList,backendList,formdata,result_collection}={...this.state}
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
                    <div className="border col-5 m-2 input-div shadow-sm p-3 mb-5 bg-white rounded">
                        <div className="row">
                                <div className="col-4">
                                    <span className="font-weight-bold text-primary h4">Input</span>
                                </div>
                                <div className="col-8">
                                    <div className="form-group">
                                        <label className="font-weight-bold text-primary h6" for="sel1">Sub-Question</label>
                                        <select className="form-control" id="sel1" onChange={e=>this.handleSubQuestion(e)}>
                                            {
                                                subQuestionList.map((ques,ind)=>
                                                    <option key={ind}>{ques}</option>
                                                )
                                            }
                                         
                                        </select>
                                    </div>
                                </div>
                        </div>
                     
                     <hr className="bg-primary"></hr>
                     <div className="inputContainer">
                        {currentSubQuestion && currentSubQuestion["no_of_inputs"] && [...Array(currentSubQuestion["no_of_inputs"])].map((item,ind)=>
                           
                           <div class="card m-2" key={ind}>
                                {
                                !currentSubQuestion["checkbox"]?
                                <div class="card-body">
                                    <h5 class="card-title font-weight-bold text-danger">{currentSubQuestion["title"][ind]+":"}</h5>
                                    <p class="card-text">                  
                                        <input key={ind} className="form-control" name={currentSubQuestion["parameters"][ind]} value={formdata[currentSubQuestion["parameters"][ind]]} type={currentSubQuestion["type"][ind]} onChange={e=>this.handleChange(e)}></input>
                                    </p>
                                </div>
                                :
                                <div class="card-body">
                                    <div className="row">
                                        <div className="row col-12">
                                        <h5 class=" m-2 card-title font-weight-bold text-danger">{currentSubQuestion["title"][currentSubQuestion["checkIndex"]]+":"}</h5>
                                        
                                           <button   className="m-2 ml-4 btn btn-sm btn-success" onClick={e=>this.handleInputChange()}>Change</button> 
                                        </div>
                                    </div>
                                    <p class="card-text">                  
                                      <input key={ind} className="form-control" name={currentSubQuestion["parameters"][currentSubQuestion["checkIndex"]]} value={formdata[currentSubQuestion["parameters"][currentSubQuestion["checkIndex"]]]} type={currentSubQuestion["type"][currentSubQuestion["checkIndex"]]} onChange={e=>this.handleChange(e)}></input>      
                                    </p>
                                </div>
                            }
                            </div>
                       
                         )}
                     </div>
                    
                   
                     <div className="m-2 row d-flex justify-content-end InputFooter ">
                     <div className="mr-4 col-9 inputDisplay border">
                           <span className="text-dark  h6">Given Input:</span>
                           <br></br>
                           {
                               currentSubQuestion &&  currentSubQuestion["parameters"] && currentSubQuestion["parameters"].map((key,ind)=>      
                               <div className="mt-4">
                               <span className="text-primary h5 font-weight-bold">{this.getName(key)}</span><br></br>
                               <div className="h5 m-1">
                                           {
                                               qNo===5?
                                               <span>{"["+ formdata[key].split(' ').join(',') +"]"}</span>
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
                                        <div className="col-10">{(result_collection.length - ind) +')'+key['title']}<span className="text-success">{' ('+key['language']+')'}</span></div>
                                        <div className="col-2">{key['time']}</div>
                                        </h6>
                                    <div class="card-text"> 
                                    <span className="font-weight-bold">Input</span> 
                                    <ul className="bl-list"> 
                                    {
                                        key['params'].map((que,ind)=>
                                        <li key={ind}><span className="font-weight-bold">{this.getName(parametersList[key['question']][ind]) +' : '}</span>
                                      
                                            {
                                                    que
                                            }
                                        
                                        </li>
                                        )
                                    }
                                    </ul>
                                    <hr></hr>
                                    <span className="font-weight-bold">Result</span> <br></br>

                                    {
                                    !_.isEmpty(key['result']) ?
                                    <div className="row">
                                        <table className="table table-sm col-6 table-success  table-round"> 
                                        {
                                            Object.keys(key['result']).map((ans,ind)=>
                                            <tr key={ind}>                                                
                                                   <td className="font-weight-bold">{ans}</td>
                                                   <td>{key['result'][ans]}</td>
                                            </tr>
                                            )
                                        }
                                        </table>
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