var express = require('express');
var bodyParser = require('body-parser');
var multer = require('multer');
var upload = multer();
var app = express();
var cors = require('cors');
const { toInteger, toString, union, intersection, floor } = require('lodash');

app.use(cors())
app.use(bodyParser.json()); 
app.use(bodyParser.urlencoded({ extended: true })); 
app.use(upload.array()); 
app.use(express.static('public'));


var port = process.env.PORT || 8080;     
var router = express.Router();              


router.post('/dateDifference', function(req, res) {
    let param_date1=req.body["date_1"]
    let param_date2=req.body["date_2"]

    let date_1=getDateList(param_date1)
    let date_2=getDateList(param_date2)
    if(validDate(date_2) && validDate(date_1) && dateCompare(date_2,date_1)){
        //Handling Date/Month/Year
        if(date_2[0]<date_1[0]){
            if(date_2[1]==3)
                if((date_2[2] % 4 == 0 & date_2[2] % 100 != 0) || (date_2[2] % 400 == 0))
                    date_2[0]=date_2[0]+29
                else
                    date_2[0]=date_2[0]+28  
            else if((date_2[1]==5) || (date_2[1]==7) || (date_2[1]==10) || (date_2[1]==11))
                date_2[0]=date_2[0]+30
            else
                date_2[0]=date_2[0]+31
            date_2[1]=date_2[1]-1
        }
        if(date_2[1]<date_1[1]){
            date_2[1]=date_2[1]+12
            date_2[2]=date_2[2]-1
        }
        //Handling Hour/Minute/Seconds
        if(date_2[3]<date_1[3]){
            date_2[3]=date_2[3]+24
            date_2[0]=date_2[0]-1
        }
        if(date_2[4]<date_1[4]){
            date_2[4]=date_2[4]+60
            date_2[3]=date_2[3]-1
        }
        if(date_2[5]<date_1[5]){
            date_2[5]=date_2[5]+60
            date_2[4]=date_2[4]-1
        }

        let date_diff = date_2[0] - date_1[0]
        let month_diff = date_2[1] - date_1[1]
        let year_diff = date_2[2] - date_1[2] 
        let hour_diff = date_2[3] - date_1[3]
        let minute_diff = date_2[4] - date_1[4]
        let second_diff = date_2[5] - date_1[5]
        let diff_list=[date_diff,month_diff,year_diff,hour_diff,minute_diff,second_diff]
        let output_json={
            "title":"Date Difference",
            "language":"JavaScript",
            "question":1,"params":[dateFormat(getDateList(param_date1)),dateFormat(getDateList(param_date2))],
            "result":diff_list,
            "status":200}
        let output={"data":output_json,"status":200}
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify(output));
    }else{
        let result={"title":"Date Difference","language":"JavaScript","question":1,"params":[dateFormat(getDateList(param_date1)),dateFormat(getDateList(param_date2))],"error":"Invalid Date Format","status":200}
        let output={"data":result,"status":200};
        res.json(output)
    }
});


function getDateList(given_date) {
    let date_list=[]
    let no=''
    for (var i = 0; i < given_date.length; i++) {
        if(given_date.charAt(i)==="/"){
            date_list.push(toInteger(no))
            no=""
        }else{
            no=no+given_date.charAt(i)
        }
      }
    return date_list
}
function dateFormat(temp_date){
    return toString(temp_date[0])+'/'+toString(temp_date[1])+'/'+toString(temp_date[2])+' - '+toString(temp_date[3])+':'+toString(temp_date[4])+':'+toString(temp_date[5])
}
function validDate(temp_date){
    let leap = 0
    let valid=true
    if(temp_date[2]>=1800 && temp_date[2]<=9999){
        if((temp_date[2] % 4 == 0 && temp_date[2] % 100 != 0) || (temp_date[2] % 400 == 0))
            leap=1
        if(temp_date[1]>=1 && temp_date[1]<=12)
            if(temp_date[1]==2)
                if(leap==1 && temp_date[0]==29)
                    valid = true
                else if(temp_date[0]>29)
                    valid = false
            else if(temp_date[1]==4 || temp_date[1]==6 || temp_date[1]==9 || temp_date[1]==11)
                if(temp_date[0]>30)
                    valid = false         
            else if(temp_date[0]>31)
                valid = false
        else
            valid = false   
    }
    else{
        valid = false
    }
    return valid
}
function dateCompare(d1,d2){
    if(d1[2]<d2[2])
        return false
    if(d1[2]==d2[2] && d1[1]<d2[1])
        return false
    if(d1[2]==d2[2] && d1[1]==d2[1] && d1[0]<d2[0])
        return false   
    return true   
}


app.use('/node', router);

app.listen(port);
console.log('Node Server Starts at port' + port);