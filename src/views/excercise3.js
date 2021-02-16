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
    "huffman_technique":{
        "question":"Implement Huffman Coding Techniques in Text Compression.",
        "parameters":["huffman_text","huffman_frequency"],
        "description":"Huffman Lossless Data Compression",
        "type":["text","text"],
        "no_of_inputs":2,
        "title":["Characters","Frequency"],
        "result":["Tree"]
        },
}
let parametersList={
    "huffman_technique":["huffman_text","huffman_frequency"],
}
class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            qNo:1,
            currentQuestion:{},
            backendList:["Python","JavaScript","PHP"],
            alphanumeric:["Number","Alphabet","AlphaNumeric"],
            all_questions:["","huffman_technique"],
            selectedBackend:"Python",
            formdata:{
               huffman_text:"",
               huffman_frequency:"",
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
        let { formdata,qNo,selectedBackend,all_questions } = { ...this.state }
        if(this.validateState()){ 

        let fd = new FormData()
        fd=this.setParameters(qNo)
        this.props.distributer(fd,all_questions[qNo],selectedBackend).then(response => {
            console.log("her",response,response['data'].status)
            if(response['data'].status===200){
                
              let data=response['data']
              console.log("here",data)    
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
              console.log(obj)
              result_data.push(obj)
              this.setState({result_data})
              this.questionLoader(qNo)
            }else{
                
              this.toasterHandler("error", "Cant reach the server")
            }
          }).catch((err)=>{
            this.toasterHandler("error", err)
          })
        }
    }

    setParameters(qNo){
        let { formdata,all_questions } = { ...this.state }
        let fd = new FormData()
        let params=parametersList[all_questions[qNo]]
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

    questionLoader=(qNo)=>{
        let { all_questions,currentQuestion,result_collection,result_data } = { ...this.state }
        currentQuestion=questionList[all_questions[qNo]]
        result_collection=_.reverse(_.filter(result_data,{ 'question':all_questions[qNo]}));
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
            console.log(name)
            if(name){
            name = name.replace("_", " ")
            name = _.startCase(name);
            }
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

   
    render() {
        let {qNo,currentQuestion,backendList,formdata,result_collection,all_questions}={...this.state}
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
                                        
                                        {currentQuestion["type"][ind]!=="select"?
                                            <input key={ind} className="form-control" name={currentQuestion["parameters"][ind]} value={formdata[currentQuestion["parameters"][ind]]} type={currentQuestion["type"][ind]} onChange={e=>this.handleChange(e)}></input>
                                            :
                                            <Input type="select" name={currentQuestion["parameters"][ind]} id={currentQuestion["type"][ind]} onChange={e=>this.handleChange(e)} value={formdata[currentQuestion["parameters"][ind]]}>
                                                {
                                                    currentQuestion["parameters"][ind]==="currency_type"?
                                                    
                                                    this.state.currency_type.map((item,ind)=>
                                                        <option value={item} key={ind}>{item}</option>
                                                    ):
                                                    this.state.alphanumeric.map((item,ind)=>
                                                    <option value={item} key={ind}>{item}</option>
                                                )
                                                }
                                            </Input>
                                        }
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
                               questionList && questionList[all_questions[qNo]]["parameters"].map((key,ind)=>      
                               <div className="mt-4">
                               <span className="text-primary h5 font-weight-bold">{this.getName(key)}</span><br></br>
                               <div className="h5 m-1">
                                   
                                   {
                                    qNo===1?   
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
                                        <li key={ind}><span className="font-weight-bold">{
                                        this.getName(parametersList[key['question']][ind]) +' : '}</span>
                                      
                                            {
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
                                                    key['question']==="huffman_technique"?
                                                    
                                                    <ul className="bl-list">   
                                                    {key['result'][ans].map((val,ind)=>
                                                    <li key={ind}>{val}</li>
                                                    )}
                                                    </ul>
                                                    
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