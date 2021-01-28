import * as types from './types';
import { pythonUrl,phpUrl,jsUrl } from '../../config';
import Axios from 'axios';

let api={
  "1":"dateDifference",
  "2":"setOperations",
  "3":"matrixOperation",
  "4":"wordCurrencyConvertion",
  "5":"rsaEncrypt",
  "9":"generateOTP",
  "10":"generateCaptcha",
  "Variance and Standard Deviation":"variance",
  "Linear Regression":"linearRegression",
  "GCF and LCM":"CalculateLcmGcf",
  "Square and Cube root":"CalculateRoot",
  "Nth root":"nthRoot",
  "trignomentry":"trignomentryFunction",
  "Logarithm":"CalculateLog",
  "AntiLogarithm":"CalculateAntiLog",
  "Electric Convertion":"electricConvertion"
}
 


export const distributer = (data,question,backend) => {
  return function action(dispatch) {
    console.log(backend)
    let url=urlLoader(backend,question)
    console.log(url)
    return Axios.post(url,data).then(res => {
      let response = res['data']
      return response
    }).catch(err => {
      return catchError(dispatch,err)
    })
      
  }
};
function urlLoader(backend,question) {
  let url=""
  if(backend==="Python"){
    url= pythonUrl
  }else  if(backend==="PHP"){
    url= phpUrl
  }else{
    url= jsUrl
  }
  url=url +"/"+ api[question]
  if(backend==="PHP"){
    url=url+".php"
  }
  return url

}


function catchError(dispatch, error) {
  if (error.response) {
    let message = error.response.data
    console.log(error.response, error.response.status);
    error.response.status = error.response.data && error.response.data === "Unauthorized" ? 400 : error.response.status
    return dispatch({ type: types.CATCH_ERROR, payload: { status: error.response.status, message } })
  } else if (error.request) {
    return dispatch({ type: types.CATCH_ERROR, payload: { status: 201, message: error.request } })
  } else {
    console.log('Error', error.message);
    return dispatch({ type: types.CATCH_ERROR, payload: { status: 201, message: error.message } })
  }
}
