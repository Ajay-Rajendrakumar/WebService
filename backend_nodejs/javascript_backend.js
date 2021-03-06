var express = require('express');
var bodyParser = require('body-parser');
var multer = require('multer');
var upload = multer();
var app = express();
var cors = require('cors');
let Jimp = require('jimp')
var fs = require('fs');
var QRCode  = require('qrcode');  
const bwipjs = require('bwip-js');
var md5 = require('md5');
var LZUTF8 = require('lzutf8');
var zlib = require('zlib');
var mysql = require('mysql');
var nodemailer = require('nodemailer');
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


router.post('/setOperations', function(req, res) {
    let param_set_a=req.body["set_a"]
    let param_set_b=req.body["set_b"]

    set_a = getSet(param_set_a)
    set_b = getSet(param_set_b)

    if(validateSet(set_a) && validateSet(set_b)){
        let swap=0
        if(set_a.length > set_b.length){
            let temp= set_a
            set_a=set_b
            set_b=temp
            swap=1
        }
        let intersection_var=[]
        let union_var=[...set_b] 
        let minus_a=set_a 
        let minus_b=set_b 
        for (var i = 0; i < set_a.length; i++){
            if(includes(set_a[i],set_b)!==-1){
                intersection_var.push(set_a[i])
            }
            else{
                union_var.push(set_a[i])
            }
        }
        let unionAll=[]
        unionAll.push(union_var)
        unionAll.push(intersection_var)

        for(var i = 0; i < intersection_var.length; i++){
            let no=intersection_var[i]
            if(includes(no,set_a)!=-1){
                minus_a.splice(includes(no,set_a),1)
            }
            if(includes(no,set_b)!=-1){
                minus_b.splice(includes(no,set_b),1)
            }
        }
        let result=[]
        if(swap===1){
            result=[union_var,unionAll,intersection_var,minus_b,minus_a]
        }else{
            result=[union_var,unionAll,intersection_var,minus_a,minus_b]
        }
        let output_json={
            "title":"Set Operations",
            "language":"JavaScript",
            "question":2,"params":[getSet(param_set_a),getSet(param_set_b)],
            "result":result,
            "status":200}
        let output={"data":output_json,"status":200}
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify(output));
    }else{
        let result={"title":"Set Operations","language":"JavaScript","question":2,"params":[getSet(param_set_a),getSet(param_set_b)],"error":"Invalid Characters in Set","status":200}
        let output={"data":result,"status":200};
        res.json(output)
    }

});

function getSet(given_set){
    let split_value = []
    tmp = ''
    for (var i = 0; i < given_set.length; i++){
        if(given_set.charAt(i)===" "){
            if(includes(tmp,split_value)==-1){
                split_value.push((tmp))
            }
            tmp = ''
        }
        else{
            tmp += given_set.charAt(i)
        }
    }
    if(tmp != ' ' && includes(tmp,split_value)==-1)
        split_value.push((tmp)) 
    return split_value
}

function validateSet(given_set){
    count=0
    for (var i = 0; i < given_set.length; i++){
        if((given_set[i]>='a' && given_set[i]<'z') || (given_set[i]>='A' && given_set[i]<='a') || given_set[i]==' ' || (given_set[i]>='0' && given_set[i]<='9')){
            count=count+1
        }
    }
    if(count==given_set.length){return true}
    else{return false}
}
  

function includes(val,array){
    for (var i = 0; i < array.length; i++){
        if(array[i]===val){
            return i
        }
    }
    return -1
}


router.post('/matrixOperation', function(req, res) {
    let param_matrix=req.body["matrix_a"]
    let order=toInteger(req.body["order"])
    if(validateMatrix(param_matrix,order)){
        matrix = getMatrix(getStringArray(param_matrix),order)
        let transpose=[]
        let left_lower_diagonal=[] 
        let right_lower_diagonal=[] 
        let left_upper_diagonal=[] 
        let right_upper_diagonal=[] 
        let swivel=[]

        for (var i = 0; i < order; i++){
            let row =[] 
            for (var j = 0; j < matrix[i].length; j++){
                row.push(matrix[j][i]) 
            }
            transpose.push(row) 
        }
        for (var i = 0; i < order; i++){
        let lld=[]
        let rld =[] 
        let lud=[]
        let rud=[]
        for (var j = 0; j < order; j++){
            if((i+j) < (order-1)){
                lld.push(0)
            }else{
                lld.push(matrix[i][j])
            }
            if(i<j){
                rld.push(0)
            }else{
                rld.push(matrix[i][j]) 
            }
            if(i>j){
                lud.push(0)
            }else{
                lud.push(matrix[i][j])
            }
            if((i+j) > (order-1)){
                rud.push(0)
            }else{
                rud.push(matrix[i][j])
            }
        }

        left_lower_diagonal.push(lld) 
        right_lower_diagonal.push(rld) 
        left_upper_diagonal.push(lud)
        right_upper_diagonal.push(rud)
        }
      
        
        swivel=matrix
        for (var i = 0; i < floor(order/2); i++){
            l=order-1-i
            for (var j = 0; j< l; j++){
                let temp=swivel[i][j]
                swivel[i][j] = swivel[order-1-j][i]
                swivel[order-1-j][i] = swivel[order-1-i][order-1-j]
                swivel[order-1-i][order-1-j]=swivel[j][order-1-i]
                swivel[j][order-1-i] = temp

            }
        }
        let result=[]
        result=[transpose,left_lower_diagonal,right_lower_diagonal,left_upper_diagonal,right_upper_diagonal,swivel]
        let output_json={
            "title":"Matrix Operations",
            "language":"JavaScript",
            "question":3,
            "params":[order,getStringArray(param_matrix)],
            "result":result,
            "status":200}
        let output={"data":output_json,"status":200}
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify(output));
    }else{
        let result={"title":"Matrix Operations","language":"JavaScript","question":3,"params":[order,getStringArray(param_matrix)],"error":"Invalid Matrix","status":200}
        let output={"data":result,"status":200};
        res.json(output)
    }

});

function validateMatrix(string,order){
    if ((getStringArray(string).length) >= (order*order)){
        for (var i = 0; i < string.length; i++){
            if((string[i]==' ' || (string[i]>='0' && string[i]<='9'))){
                continue
            }else{
                return false
            }
        }
        return true
    }else{
        return false
    }
}

function getStringArray(given_set){
    let split_value = []
    tmp = ''
    for (var i = 0; i < given_set.length; i++){
        if(given_set.charAt(i)===" "){
           split_value.push(toInteger(tmp))
           tmp = ''
        }
        else{
            tmp += given_set.charAt(i)
        }
    }
    if(tmp != ' ' && tmp != '')
        split_value.push((tmp)) 
    return split_value
}

function getMatrix(given_array,order){
    let count=0
    let temp=[]
    let matrix=[]
    for(var i = 0; i <= given_array.length; i++){
        no=given_array[i]
        if(count===order){

            matrix.push(temp)
            temp=[]
            temp.push(no)
            count=1
        }else{
            temp.push(no)
            count=count+1
        }
    }
    return matrix
}



router.post('/wordCurrencyConvertion', function(req, res) {
    let currency=req.body["currency"]
    let param_type=req.body["currency_type"]
    if(validateNumber(currency)){
        let words=["","","Hundred","Thousand","Lakh","Crore"]
        let limit = [2,2,1,2,2]
        let value=toInteger(currency)
        let count=0
        let result=[]
        while (value != 0){
            if((String(value).length) >=limit[count] && count!=1){
                r= value % 100
                value=toInteger(value/100) 
            }
            else{
                r=value % 10
                value=toInteger(value/10)
            }
            count=count+1
            if(currency_con(String(r))!="zero")
                result.push(currency_con(String(r)) + " " +words[count])
        }
        let ans=""
        result.reverse()
        for (var i = 0; i < result.length; i++){
            ans= ans + " "+ result[i] + " "
        }
        let symbol=getSymbol(param_type)+" "+currency
        ans=ans+" " +param_type+"s"
        let output_json={
            "title":"Word Convertion",
            "language":"JavaScript",
            "question":4,
            "params":[param_type,currency],
            "result":[symbol,ans],
            "status":200}
        let output={"data":output_json,"status":200}
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify(output));
    }else{
        let result={"title":"Word Convertion","language":"JavaScript","question":4,"params":[param_type,currency],"error":"Invalid Number","status":200}
        let output={"data":result,"status":200};
        res.json(output)
    }

});
function getSymbol(c_type){
    if(c_type=="Dollar")
        return "$"
    if(c_type=="Rupee")
        return "₹"
    if(c_type=="Euro")
        return "€"
    if(c_type=="Pound")
        return "£"
}
function validateNumber(string){
    if(string.length>9){
        return False
    }
    for (var i = 0; i < string.length; i++){
        if(string[i]>='0' && string[i]<='9'){
            continue
        }else{
            return false
        }
    }
    return true
}

function currency_con(num){
    let currency_word=""

    let ones_digit = ["zero","one","two","three","four","five","six","seven","eight","nine"]
    let two_digit=["","ten","eleven","twelve","thirteen","fourteen","fifteen","sixteen","seventeen","eighteen","nineteen"]
    let ten_digit=["","","twenty","thirty","forty","fifty","sixty","seventy","eighty","ninenty"]
    let ten_power=["hundred","thousand"]

    let l = (num.length)
    if(l===1){
        currency_word = currency_word + ones_digit[toInteger(num[0])]
    }else{
        let x=0
        while (x < (num.length)){
            if (l <= 2 ){
                if (toInteger(num[x])== 1){
                    sum = toInteger(num[x])+   toInteger(num[x+1])
                    currency_word = currency_word + two_digit[sum]+ " "
                    break

                }else if (toInteger(num[x]) == 2 &&  toInteger(num[x + 1]) == 0){
                    currency_word = currency_word + "twenty "
                    break
                    
                }else{
                    i = toInteger(num[x]) 
                    if(i > 0){
                        currency_word = currency_word + ten_digit[i] + " "
                    }else{
                        currency_word = currency_word + " "
                    }
                    x += 1
                    if(toInteger(num[x])!= 0)
                        currency_word = currency_word + ones_digit[toInteger(num[x])] + " "
                }
            x =x+ 1
        }
    }
}
return currency_word
}

router.post('/rsaEncrypt', function(req, res) {
    let param_message=req.body["message"]
    if(validateMsg(param_message)){
        let prime_number_1=7
        let prime_number_2=3

        let public_key_1=prime_number_1*prime_number_2

        let encrypt=2
        let phi=(prime_number_1-1)*(prime_number_2-1)
        while(encrypt<phi){
            if(get_gcd(encrypt,phi)==1){
                break
            }else{
                encrypt=encrypt+1
            }
        }
        let k=2
        let decrypt=(1+(k*phi))/encrypt
        let encrypt_list=[]
        let decrypt_list=[]

        for (var i = 0; i < param_message.length; i++){
            let l=encryption(public_key_1,encrypt,param_message.charCodeAt(i)-97)
            encrypt_list.push(l)
        }
        
        let encrypt_data=""
        for (var i = 0; i < encrypt_list.length; i++){
            encrypt_data=encrypt_data+String.fromCharCode(toInteger(encrypt_list[i]))
        }
 
        for (var i = 0; i < encrypt_list.length; i++){
            let l=encryption(public_key_1,decrypt,encrypt_list[i])
            decrypt_list.push(l)
        }
        let decrypt_data=""
        for (var i = 0; i < decrypt_list.length; i++){
            decrypt_data=decrypt_data+String.fromCharCode(toInteger(decrypt_list[i])+97)
        }


        let output_json={
            "title":"RSA Encryption",
            "language":"JavaScript",
            "question":5,
            "params":[param_message],
            "result":[encrypt_data,decrypt_data],
            "status":200}
        let output={"data":output_json,"status":200}
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify(output));
    }else{
        let result={"title":"RSA Encryption","language":"JavaScript","question":5,"params":[param_message],"error":"Invalid Message","status":200}
        let output={"data":result,"status":200};
        res.json(output)
    }

});

function encryption(public_key,encrypt_key,msg){
    let data=Math.pow(msg,encrypt_key)
    data=(data % public_key)
    return data
}
function validateMsg(string){
    for (var i = 0; i < string.length; i++){
        if(string[i]>='a' && string[i]<='t'){
            continue
        }else{
            return false
        }
    }
    return true
}
function get_gcd(x,y){ 
    let small=0
    if(x > y){
        small = y 
    }else{
        small = x
    } 
    for (var i = 1; i < small+1; i++){
        if((x % i == 0) && (y % i == 0)){ 
            gcd = i 
        }
    }  
    return gcd 
}

router.post('/generateOTP', function(req, res) {
    let otp_len=req.body["otpLength"]
    let otp_type = req.body['alphanumeric']
    let alpha_numeric_char="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890"
    if(validateOTPNumber(otp_len)){
        if(otp_type=="Number"){
            alpha_numeric_char="1234567890"
        }else if(otp_type=="Alphabet"){
            alpha_numeric_char="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz"
        }
        let otp=""
        let key=unique_key()
        for (var i = 0; i < toInteger(otp_len); i++){
            let rand = getRand(0,alpha_numeric_char.length,key)
            let char=alpha_numeric_char[rand]
            otp=otp+char
            key= (key + (unique_key()/(2*(i+1))))/2
        }
        
        let output_json={
            "title":"OTP Generation",
            "language":"JavaScript",
            "question":9,
            "params":[otp_len],
            "result":[otp],
            "status":200}
        let output={"data":output_json,"status":200}
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify(output));
    }else{
        let result={"title":"OTP Generation","language":"JavaScript","question":9,"params":[otp_len],"error":"Invalid OTP Length","status":200}
        let output={"data":result,"status":200};
        res.json(output)
    }

});
function unique_key(){
        var d = new Date();
        return d.getMilliseconds()
}
function getRand(min,max,key){
    let n=(key)%10
    let m=(toInteger(key/10)) % 10
    n=((n+m)/2)/10  
    return(toInteger(n * (max - min) + min))
}
function validateOTPNumber(no){
    if(toInteger(no)>=1){
        return true
    }else{
        return false
    }
}


router.post('/generateCaptcha', function(req, res) {
    let msg=req.body["message"]
    let image = new Jimp(200, 100, 'white', (err, image) => {
        if (err) throw err
        })        
        let x = 10
        let y = 10   
        Jimp.loadFont(Jimp.FONT_SANS_32_BLACK)
        .then(font => {
            for(var i=0;i<msg.length;i++){
                    image.print(font, x+(i*17), y, msg[i])
                    if(rand(0,4)%2===0){
                        y=y+(rand(0,4) *2)
                    }else{
                        y=y-(rand(0,4) *2)
                    }
            }
            image.posterize(20);
            image.blur(1);  
            image.rotate(rand(-10,10)); 
            return image
        }).then(image => {
            let file = `captcha.${image.getExtension()}`
            return image.write(file)
        })
    setTimeout(function () {      
    let output_json={
        "title":"Captcha Generation",
        "language":"JavaScript",
        "question":10,
        "params":[msg],
        "result":[base64_encode("C:/Users/USER/Desktop/webservice/backend_nodejs/captcha.png")],
        "status":200}
    let output={"data":output_json,"status":200}
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify(output));
}, 500)
   

});

router.post('/generateQrcode', function(req, res) {  
    let msg=req.body["message"]
    let imgBase64Data=[]
    QRCode.toDataURL(msg, function (err, code) { 
            console.log(code)
            let output_json={
                "title":"QR Code",
                "language":"JavaScript",
                "question":8,
                "params":[msg],
                "result":[code.split(';base64,')[1]],
                "status":200}
                let output={"data":output_json,"status":200}
            res.setHeader('Content-Type', 'application/json');
            res.send(JSON.stringify(output));
    })
    
    
  });

  router.post('/generateBarcode', function(req, res) {  
    let msg=req.body["message"]
    bwipjs.toBuffer({
        bcid:        'code128',       
        text:        msg,    
        scale:       3,               
        height:      10,            
        includetext: true,         
        textxalign:  'center',       
    })
    .then(png => {
        let output_json={
            "title":"Bar Code",
            "language":"JavaScript",
            "question":7,
            "params":[msg],
            "result":[png.toString('base64')],
            "status":200}
            let output={"data":output_json,"status":200}
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify(output));
    })
    .catch(err => {
        // `err` may be a string or Error object
    });
    
});
function base64_encode(file) {
    var bitmap = fs.readFileSync(file);
    return new Buffer(bitmap).toString('base64');
}

function rand(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
router.post('/md5Algorithm', function(req, res) {  
    let msg=req.body["message"]
    let output_json={
        "title":"md5 Algorithm",
        "language":"JavaScript",
        "question":6,
        "params":[msg],
        "result":[md5(msg)],
        "status":200}
        let output={"data":output_json,"status":200}
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify(output));
    
  });

router.post('/variance', function(req, res) {
    let param_list=req.body["Numberlist"]
    if(validateVarianceNumber(param_list)){
        let Numberlist = getNumberList(param_list)
        let mean=0
        let standard_deviation=0
        let variance=0
        let sum=0
        n=Numberlist.length
        for (var i = 0; i < n; i++){
                sum = sum + Numberlist[i]
        }
        mean= sum/ n
        for (var i = 0; i < n; i++){
                standard_deviation =standard_deviation + Math.pow(Numberlist[i] - mean, 2)
        }
        variance = standard_deviation/ n
        standard_deviation=Math.sqrt(variance)
        let result=[]
        result=[variance,standard_deviation]
        let output_json={
            "title":"Variance and Standard Deviation",
            "language":"JavaScript",
            "question":"Variance and Standard Deviation",
            "params":[param_list],
            "result":result,
            "status":200}
        let output={"data":output_json,"status":200}
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify(output));
    }else{
        let result={"title":"Variance and Standard Deviation","language":"JavaScript","question":"Variance and Standard Deviation","params":[param_list],"error":"Invalid Characters","status":200}
        let output={"data":result,"status":200};
        res.json(output)
    }

});

router.post('/linearRegression', function(req, res) {

    let param_xList = req.body['xList']
    let param_yList = req.body['yList']
    
    if(validateVarianceNumber(param_xList) && validateVarianceNumber(param_yList) && getNumberList(param_xList).length===getNumberList(param_yList).length){
        let xList = getNumberList(param_xList)
        let yList = getNumberList(param_yList)
        let sum_xlist=0
        let sum_ylist=0
        let sum_xSquare=0
        let sum_xy=0 
        n=(xList).length
        for (var i = 0; i < n; i++){
            sum_xlist = sum_xlist + xList[i]
            sum_ylist = sum_ylist + yList[i]
            sum_xSquare = sum_xSquare + (xList[i]*xList[i])
            sum_xy = sum_xy + (xList[i]*yList[i])
        }
        let slope = (n*sum_xy-sum_xlist*sum_ylist)/(n*sum_xSquare-sum_xlist*sum_xlist);
        let intercept = (sum_ylist - slope*sum_xlist)/n
        let equartion= "y = " + String(slope)+"x + "+ String(intercept)
        let result=[]
        result=[String(equartion)]
        let output_json={
            "title":"Linear Regression",
            "language":"JavaScript",
            "question":"Linear Regression",
            "params":[param_xList,param_yList],
            "result":result,
            "status":200}
        let output={"data":output_json,"status":200}
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify(output));
    }else{
        let result={"title":"Linear Regression","language":"JavaScript","question":"Linear Regression","params":[param_xList,param_yList],"error":"Invalid Length","status":200}
        let output={"data":result,"status":200};
        res.json(output)
    }

});
router.post('/CalculateLcmGcf', function(req, res) {

    let param_list=req.body["Numberlist"]
    if(validateVarianceNumber(param_list)){
        let Numberlist = getNumberList(param_list)
        hcf=calculateGCD(Numberlist)
        lcm=calculateLCM(Numberlist)
        let result=[]
        result=[hcf,lcm]
        let output_json={
            "title":"GCF and LCM",
            "language":"JavaScript",
            "question":"GCF and LCM",
            "params":[param_list],
            "result":result,
            "status":200}
        let output={"data":output_json,"status":200}
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify(output));
    }else{
        let result={"title":"GCF and LCM","language":"JavaScript","question":"GCF and LCM","params":[param_list],"error":"Invalid Characters","status":200}
        let output={"data":result,"status":200};
        res.json(output)
    }

});
function calculateGCD(NList){
    result = NList[0]
    for(var i=0;i<NList.length;i++){
        result = GCD(NList[i] , result) 
        if(result == 1)
           return 1 
    }
    return result 
}
function calculateLCM(NList){
    result = NList[0]
    for(var i=0;i<NList.length;i++){
        result = (((NList[i] * result)) /  (GCD(NList[i], result)));
    } 
    return result
}
function GCD(a,b){
    if (a == 0)
        return b 
    return GCD(b % a, a)
} 

function validateVarianceNumber(string){
    for (var i = 0; i < string.length; i++){
        if((string[i]==' ' || (string[i]>='0' && string[i]<='9'))){
            continue
        }else{
            return false
        }
    }
    return true
}

function getNumberList(given_set){
    let split_value = []
    tmp = ''
    for (var i = 0; i < given_set.length; i++){
        if(given_set.charAt(i)===" "){
           split_value.push(toInteger(tmp))
           tmp = ''
        }
        else{
            tmp += given_set.charAt(i)
        }
    }
    if(tmp != ' ' && tmp != '')
        split_value.push(toInteger(tmp)) 
    return split_value
}

router.post('/CalculateRoot', function(req, res) {
    let param_number=req.body["number"]
    let result=[]
    result=[Sqrt(toInteger(param_number)),Cbrt(toInteger(param_number))]
    let output_json={
        "title":"Square and Cube root",
        "language":"JavaScript",
        "question":"Square and Cube root",
        "params":[param_number],
        "result":result,
        "status":200}
    let output={"data":output_json,"status":200}
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify(output));
}); 
function Sqrt(number){
    let temp=0
    let sqrt=number/2
    while(sqrt!=temp){
        temp=sqrt
        sqrt=(number/temp+temp)/2
    }
    return sqrt
}
function Cbrt(number){
    start=0
    last=number
    precision=0.001
    while(1){
        mid = (start + last)/2; 
        error = binaryDiff(number, mid); 
        if (error <= precision)
            return mid
        if ((mid*mid*mid) > number) 
            last = mid; 
        else
            start = mid;
    } 
    return sqrt
}
function binaryDiff(n,mid){
    mid=mid*mid*mid
    if(n>mid)
        return (n-mid)
    else
        return (mid-n)
}

router.post('/nthRoot', function(req, res) {
    let param_number=req.body["number"]
    let param_place=req.body["place"]
    let result=[]
    result=[nthRoot(toInteger(param_number),toInteger(param_place))]
    let output_json={
        "title":"Nth root",
        "language":"JavaScript",
        "question":"Nth root",
        "params":[param_number],
        "result":result,
        "status":200}
    let output={"data":output_json,"status":200}
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify(output));
});

function nthRoot(number,place){
    let xPre = Math.random() % 10
    let eps = 0.001
    let delX = 2147483647
    let xK=0.0
    while (delX > eps){ 
        xK = ((place - 1.0) * xPre +number/Math.pow(xPre, place-1)) /place
        delX = Math.abs(xK - xPre) 
        xPre = xK; 
    }
    return xK
}

router.post('/trignomentryFunction', function(req, res) {
    let param_degree=(req.body["degree"])
    let param_radian=(req.body["radian"])
    let result=[]
    let param=[]
    if(param_degree.length>0){
        param.push(param_degree)
        param.push("-")
        result=GenerateList(radian(parseFloat(param_degree)))
    }else{
        param.push("-")
        param.push(param_radian)
        result=GenerateList(parseFloat(param_radian))
    }
    let output_json={
        "title":"trignomentry",
        "language":"JavaScript",
        "question":"trignomentry",
        "params":param,
        "result":result,
        "status":200}
    let output={"data":output_json,"status":200}
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify(output));
});
function GenerateList(rad){
    res=[]
    for(var i=1;i<=9;i++)
        res.push(Error(rad,i))

    return res
}
function Error(rad,i){
    try {
        switch(i) {
            case 1:
                return Math.sin(rad)
            case 2:
                return Math.cos(rad)
            case 3:
                return Math.tan(rad)
            case 4:
                return 1/Math.sin(rad)
            case 5:
                return 1/Math.cos(rad)
            case 6:
                return 1/Math.tan(rad)
            case 7:
                return Math.asin(rad)
            case 8:
                return Math.acos(rad)
            case 9:
                return Math.atan(rad)
        }
      }
      catch(err) {
        return String("Not Defined")
      }
}
function radian(degree){
    return degree*(Math.PI/180)
}

router.post('/CalculateLog', function(req, res) {
    let param_number=parseFloat(req.body["number"])
    let param_base=parseFloat(req.body["base"])
    
    let Nlog=log(param_number)
    let Log=log(param_number)/log(param_base)
    let output_json={
        "title":"Logarithm",
        "language":"JavaScript",
        "question":"Logarithm",
        "params":[param_number,param_base],
        "result":[Nlog,Log],
        "status":200}
    let output={"data":output_json,"status":200}
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify(output));
});

function log(x){
    let n = 1000.0
    return n * ((x ** (1/n)) - 1)
}
router.post('/CalculateAntiLog', function(req, res) {
    let param_number=parseFloat(req.body["number"])
    let param_base=parseFloat(req.body["base"])
    let Alog= Math.pow(param_base,param_number)
    let output_json={
        "title":"AntiLogarithm",
        "language":"JavaScript",
        "question":"AntiLogarithm",
        "params":[param_number,param_base],
        "result":[Alog],
        "status":200}
    let output={"data":output_json,"status":200}
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify(output));
});
router.post('/electricConvertion', function(req, res) {
   
    let amp = (req.body['amp'])
    let volt = (req.body['volt'])
    let watt = (req.body['watt'])
    let time = (req.body['time'])
    let kva = (req.body['kva'])
    let kw = (req.body['kw'])
    let joule = (req.body['joule'])
    let va = (req.body['va'])
    let wh = (req.body['wh'])
    let mah =(req.body['mah'])
    let Ginput= [amp,volt,watt,time,kw,kva,va,joule,mah,wh]
    for(var i=0;i<2;i++){
    if(!volt)
        volt=Cvolt(amp,watt,va,wh,mah,kva)
    if(!watt)
        watt=Cwatt(amp,volt,kw,wh,time,joule)
    if(!amp)
        amp=Camp(volt,watt,va,kva)
    if(!kw)
        kw=Ckw(watt)
    if(!joule)
        joule=Cjoule(time,watt)
    if(!kva)
        kva=Ckva(volt,amp)
    if(!va)
        va=Cva(volt,amp)
    if(!wh)
        wh=Cwh(watt,time,mah,volt)
    if(!mah)
        mah=CmAh(wh,volt)
    if(!time)
        time=Ctime(wh,watt,joule)
    }
    result=[amp,volt,watt,kw,kva,joule,va,mah,wh,time]
    let output_json={
        "title":"Electric Convertion",
        "language":"JavaScript",
        "question":"Electric Convertion",
        "params":Ginput,
        "result":result,
        "status":200}
    let output={"data":output_json,"status":200}
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify(output));
});
function Cvolt(amp,watt,va,wh,mah,kva){
    if(amp && watt)
        return (parseFloat(watt)/parseFloat(amp))
    if(va && amp)
        return (parseFloat(va)/parseFloat(amp))
    if(kva && amp)
        return (parseFloat(kva)/(1000*parseFloat(amp)))
    if(wh && mah)
        return (parseFloat(wh)*1000)/parseFloat(mah)
    return ""
}
function Cwatt(amp,volt,kw,wh,time,joule){
    if(amp && volt)
        return (parseFloat(amp)*parseFloat(volt))
    if(kw)
        return (parseFloat(kw)/1000)
    if(wh && time)
        return (parseFloat(wh)/parseFloat(time))
    if(joule && time)
        return (parseFloat(joule)/(parseFloat(time)*3600))
    return ""
}
function Camp(volt,watt,va,kva){
    if(watt && volt)
        return (parseFloat(watt)/parseFloat(volt)) 
    if(va && volt)
        return (parseFloat(va)/parseFloat(volt))
    if(kva && volt)
        return (parseFloat(kva)/(1000*parseFloat(volt)))
    return ""
}
function Ckw(watt){
    if(watt)
        return (parseFloat(watt)*1000) 
    return ""
}
function Cjoule(time,watt){
    if(watt && time)
        return (parseFloat(watt)*(parseFloat(time)*3600))
}
function Cva(volt,amp){
    if(volt && amp)
        return(parseFloat(volt)*parseFloat(amp))
}
function Ckva(volt,amp){
    if(volt && amp)
        return (1000*(parseFloat(volt)*parseFloat(amp)))
}
function Cwh(watt,time,mAh,volt){
    if(watt && time)
        return (parseFloat(watt)*parseFloat(time))
    if(mAh && volt)
        return (parseFloat(mAh) * parseFloat(volt) / 1000)
}
function CmAh(wh,volt){
    if(wh && volt)
        return (1000 * parseFloat(wh) / parseFloat(volt)) 
}
function Ctime(wh,watt,joule){
    if(wh && watt)
        return (parseFloat(wh)/parseFloat(watt))
    if(joule && watt)
        return (parseFloat(joule)/(parseFloat(watt)*3600))
}

class node {
    constructor(freq, char,left,right) {
      this.freq = freq;
      this.char = char;
      this.left = left;
      this.right = right;
      this.huff='';
    }
  }
let global_node_res=[]
router.post('/huffman_technique', function(req, res) {
    let message=req.body["huffman_message"]
    var freq = {};
    for (var i=0; i<message.length;i++) {
        var character = message.charAt(i);
        if (freq[character]) {
           freq[character]++;
        } else {
           freq[character] = 1;
        }
    }
    let h_char=[]
    let h_freq=[]
    for (const val in freq) {
        h_char.push(val)
        h_freq.push(freq[val])
    }
    let nodes=[]
    for (var i=0; i<h_char.length;i++) {
            nodes.push(new node(h_freq[i], h_char[i],null,null))
    }
    console.log(nodes)
    while(nodes.length>1){   
        nodes.sort(function (a, b) {
            return a.freq - b.freq;
          });
        let left=new node
        left=nodes[0]
        let right=new node
        right=nodes[1]
        left.huff=0
        right.huff=1
        let newNode =new node(left.freq+right.freq, left.char+right.char, left, right)
        nodes.splice(0,2);
        nodes.push(newNode)
    }
    traverse(nodes[0],"")
    let result=[global_node_res]
    global_node_res=[]
    let output_json={
        "title":"huffman_technique",
        "language":"JavaScript",
        "question":"huffman_technique",
        "params":[message],
        "result":result,
        "status":200}
    let output={"data":output_json,"status":200}
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify(output));
});
function traverse(node,val){
    let newVal = val + String(node.huff)
    if(node.left)
        traverse(node.left, newVal)
    if(node.right)
        traverse(node.right, newVal)
    if(node.left==null && node.right==null)
        global_node_res.push(node.char+"->"+newVal)
}

router.post('/run_length_algorithm', function(req, res) {
    let msg=req.body["message"]
   
   
    let result=[run_length_algorithm_encode(msg),run_length_algorithm_Decode(run_length_algorithm_encode(msg))]
    let output_json={
        "title":"run_length_algorithm",
        "language":"JavaScript",
        "question":"run_length_algorithm",
        "params":[msg],
        "result":result,
        "status":200}
    let output={"data":output_json,"status":200}
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify(output));
});

function run_length_algorithm_encode(msg){ 
    let encoded_msg = "" 
    let i = 0
    while (i <= (msg.length)-1){
        count = 1
        ch = msg[i] 
        j = i 
        while (j < (msg.length)-1){
            if (msg[j] == msg[j+1]){
                count = count+1
                j = j+1
            }
            else{
                break
            }
        }
        encoded_msg=encoded_msg+ch+String(count)
        i = j+1
    }
    return encoded_msg 
}
function run_length_algorithm_Decode(msg){
    let decoded_msg = ""
    let count='0'
    let last_char=''
    console.log(msg,msg.length)
    for (var i=0; i<msg.length;i++) {
        if(!isNaN(msg[i])){
            count =count + msg[i]
        }
        else{
             for (var j=0; j<toInteger(count);j++) {
                decoded_msg=decoded_msg+last_char
             }
            last_char=msg[i]
            count="0"
        }
    }
    for (var i=0; i<toInteger(count);i++) {
        decoded_msg=decoded_msg+last_char
    }
    return decoded_msg 
}

class LZW 
{
    static compress(uncompressed)
    {
        let dictionary = {};
        for (let i = 0; i < 256; i++)
        {
            dictionary[String.fromCharCode(i)] = i;
        }
        let word = '';
        let result = [];
        let dictSize = 256;
 
        for (let i = 0, len = uncompressed.length; i < len; i++)
        {
            let curChar = uncompressed[i];
            let joinedWord = word + curChar;
           if (dictionary.hasOwnProperty(joinedWord)) 
            {
                word = joinedWord;
            }
            else
            {
                result.push(dictionary[word]);
                dictionary[joinedWord] = dictSize++;
                word = curChar;
            }
        }
        if (word !== '')
        {
            result.push(dictionary[word]);
        }
 
        return result;
    }
    static decompress(compressed)
    {
        let dictionary = {};
        for (let i = 0; i < 256; i++)
        {
            dictionary[i] = String.fromCharCode(i);
        }
        let word = String.fromCharCode(compressed[0]);
        let result = word;
        let entry = '';
        let dictSize = 256;
        for (let i = 1, len = compressed.length; i < len; i++)
        {
            let curNumber = compressed[i];
 
            if (dictionary[curNumber] !== undefined)
            {
                entry = dictionary[curNumber];
            }
            else
            {
                if (curNumber === dictSize)
                {
                    entry = word + word[0];
                }
                else
                {
                    throw 'Error in processing';
                    return null;
                }
            }
 
            result += entry;
            dictionary[dictSize++] = word + entry[0]; 
            word = entry;
        }
        return result;
    }
}
router.post('/Lempel_Ziv_Welch', function(req, res) {
    let msg=req.body["message"]
   
    let comp = LZW.compress(msg);
    let decomp = LZW.decompress(comp);
    let result=[comp,decomp]
    let output_json={
        "title":"Lempel_Ziv_Welch",
        "language":"JavaScript",
        "question":"Lempel_Ziv_Welch",
        "params":[msg],
        "result":result,
        "status":200}
    let output={"data":output_json,"status":200}
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify(output));
});

router.post('/Lossless_Compressions', function(req, res) {
    let msg=req.body["message"]
    var data = new Buffer(msg, 'utf8');
    var compressor = new LZUTF8.Compressor();
    var comp = compressor.compressBlock(data);
    var decompressor = new LZUTF8.Decompressor();
    var decomp = decompressor.decompressBlockToString(comp);
    var input = new Buffer(msg, 'utf8')
    var deflated = zlib.deflateSync(input).toString('base64');
    var inflated = zlib.inflateSync(new Buffer(deflated, 'base64')).toString();
    let result=["None","None",String(comp),String(decomp),deflated,inflated  ]
    let output_json={
        "title":"Lossless_Compressions",
        "language":"JavaScript",
        "question":"Lossless_Compressions",
        "params":[msg],
        "result":result,
        "status":200}
    let output={"data":output_json,"status":200}
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify(output));
});

app.use('/node', router);

app.listen(port);
console.log('Node Server Starts at port' + port);