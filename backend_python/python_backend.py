from flask import Flask
from flask_cors import CORS, cross_origin
from flask import request
from datetime import datetime
from flask import jsonify
from PIL import Image, ImageDraw, ImageFont,ImageFilter
import PIL.ImageDraw
import PIL.Image
import base64
import random
import os
import math
import pyqrcode 
import png 
from pyqrcode import QRCode
from barcode import EAN13 
from barcode.writer import ImageWriter 
import hashlib 
import bz2
import lzma 
import deflate

image_path = '../captcha/'

app = Flask(__name__)
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'

import portal 


@app.route('/dateDifference',methods = ['POST', 'GET'])
@cross_origin()
def dateDifference():
    if request.method == 'POST':
        param_date1 = request.form['date_1']
        param_date2 = request.form['date_2']
        #[day/month/year/hour/minute/seconds]
        date_1 = getDateList(param_date1)
        date_2 = getDateList(param_date2)
        if validDate(date_2) and validDate(date_1) and dateCompare(date_2,date_1):
        #Handling Date/Month/Year
            if date_2[0]<date_1[0]:
                if date_2[1]==3:
                    if (date_2[2] % 4 == 0 and date_2[2] % 100 != 0) or (date_2[2] % 400 == 0):
                        date_2[0]=date_2[0]+29
                    else:
                        date_2[0]=date_2[0]+28  
                elif (date_2[1]==5) or (date_2[1]==7) or (date_2[1]==10) or (date_2[1]==11):
                    date_2[0]=date_2[0]+30
                else:
                    date_2[0]=date_2[0]+31
                date_2[1]=date_2[1]-1
            if date_2[1]<date_1[1]:
                date_2[1]=date_2[1]+12
                date_2[2]=date_2[2]-1
                    
            #Handling Hour/Minute/Seconds
            if date_2[3]<date_1[3]:
                date_2[3]=date_2[3]+24
                date_2[0]=date_2[0]-1
            if date_2[4]<date_1[4]:
                date_2[4]=date_2[4]+60
                date_2[3]=date_2[3]-1
            if date_2[5]<date_1[5]:
                date_2[5]=date_2[5]+60
                date_2[4]=date_2[4]-1

            date_diff = date_2[0] - date_1[0]
            month_diff = date_2[1] - date_1[1]
            year_diff = date_2[2] - date_1[2] 
            hour_diff = date_2[3] - date_1[3]
            minute_diff = date_2[4] - date_1[4]
            second_diff = date_2[5] - date_1[5]
            diff_list=[date_diff,month_diff,year_diff,hour_diff,minute_diff,second_diff]
            output_json={"title":"Date Difference","language":"Python","question":1,"params":[dateFormat(getDateList(param_date1)),dateFormat(getDateList(param_date2))],"result":diff_list,"status":200}
            output={"data":output_json,"status":200}
            return jsonify(output)
        else:
            output_json={"title":"Date Difference","language":"Python","question":1,"params":[dateFormat(getDateList(param_date1)),dateFormat(getDateList(param_date2))],"error":"Invalid Date Format","status":200}
            output={"data":output_json,"status":200}
            return jsonify(output)

  
def getDateList(given_date):
    date_list=[]
    no=""
    for number in given_date:        
            if number == "/":
                date_list.append(int(no))
                no=""
            else:
                no=no+str(number)
    return date_list
def validDate(temp_date):
    leap = 0
    valid= True
    if temp_date[2]>=1800 and temp_date[2]<=9999:
        if (temp_date[2] % 4 == 0 and temp_date[2] % 100 != 0) or (temp_date[2] % 400 == 0):
            leap=1
        if(temp_date[1]>=1 and temp_date[1]<=12):
            if temp_date[1]==2:
                if leap==1 and temp_date[0]==29:
                    valid = True
                elif temp_date[0]>29:
                    valid = False
            elif temp_date[1]==4 or temp_date[1]==6 or temp_date[1]==9 or temp_date[1]==11:
                if temp_date[0]>30:
                    valid = False         
            elif temp_date[0]>31:
                valid = False
        else:
            valid = False   
    else:
        valid = False
    return valid

def dateCompare(d1,d2):
    if d1[2]<d2[2]:
        return False
    if d1[2]==d2[2] and d1[1]<d2[1]:
        return False
    if d1[2]==d2[2] and d1[1]==d2[1] and d1[0]<d2[0]:
        return False   
    return True   
                    


def dateFormat(temp_date):
    return str(temp_date[0])+'/'+str(temp_date[1])+'/'+str(temp_date[2])+' - '+str(temp_date[3])+':'+str(temp_date[4])+':'+str(temp_date[5])

@app.route('/setOperations',methods = ['POST', 'GET'])
@cross_origin()
def setOperations():
     if request.method == 'POST':
        param_set_a = request.form['set_a']
        param_set_b = request.form['set_b']
        set_a = getSet(param_set_a)
        set_b = getSet(param_set_b)
        if(validateSet(param_set_a) and validateSet(param_set_b)):
            swap=0
            if length(set_a) > length(set_b):
                set_a,set_b=set_b,set_a
                swap=1
            intersection=[]
            union=set_b[:] 
            minus_a=set_a[:] 
            minus_b=set_b[:] 
            for number in set_a:
                if number in set_b:
                    intersection.append(number)
                else:
                    union.append(number)
                
            for no in intersection:
                if no in set_a:
                    minus_a.remove(no)
                if no in set_b:
                    minus_b.remove(no)
            res=[]
            unionAll=[]
            unionAll.append(union)
            unionAll.append(intersection)
            if swap==1:
                res=[union,unionAll,intersection,minus_b,minus_a]
            else:
                res=[union,unionAll,intersection,minus_a,minus_b]
            output_json={"title":"Set Operations","language":"Python","question":2,"params":[getSet(param_set_a),getSet(param_set_b)],"result":res,"status":200}
            output={"data":output_json,"status":200}
            return jsonify(output)
        else:
            output_json={"title":"Set Operations","language":"Python","question":2,"params":[set_a,set_b],"error":"Invalid Characters in Set ","status":200}
            output={"data":output_json,"status":200}
            return jsonify(output)

def getSet(given_set):
    split_value = []
    tmp = ''
    for c in given_set:
        if c == ' ':
            if tmp not in split_value:
                split_value.append((tmp))
            tmp = ''
        else:
            tmp += c
    if tmp != '' and tmp != ' ' and tmp not in split_value:
        split_value.append((tmp)) 
    return split_value

def validateSet(given_set):
    count=0
    for c in given_set: 
        if (c>='a' and c<'z') or (c>='A' and c<='a') or c==' ' or (c>='0' and c<='9'):
            count=count+1
    if count==length(given_set):
        return True
    else:
        return False
        
@app.route('/matrixOperation',methods = ['POST', 'GET'])
@cross_origin()
def matrixOperations():
    param_matrix_a = request.form['matrix_a']
    param_order = request.form['order']
    order = int(param_order)
    if(validMatrix(param_matrix_a,order)):
        matrix_a = getMatrix(getStringArray(param_matrix_a),order)
        transpose=[]
        right_lower_diagonal=[]
        left_lower_diagonal=[]
        right_upper_diagonal=[]
        left_upper_diagonal=[]
        for i in range(len(matrix_a[0])): 
            row =[] 
            for item in matrix_a: 
                row.append(item[i]) 
            transpose.append(row) 

        for i in range(order): 
            lld=[]
            rld =[] 
            lud=[]
            rud=[]
            for j in range(order): 
                if (i+j) < (order-1):
                    lld.append(0)
                else:
                    lld.append(matrix_a[i][j])
                if i<j:
                    rld.append(0)
                else:
                    rld.append(matrix_a[i][j]) 
                if i>j:
                    lud.append(0)
                else:
                    lud.append(matrix_a[i][j])
                if (i+j) > (order-1):
                    rud.append(0)
                else:
                    rud.append(matrix_a[i][j])
            
            left_lower_diagonal.append(lld) 
            right_lower_diagonal.append(rld) 
            left_upper_diagonal.append(lud)
            right_upper_diagonal.append(rud)

        swivel_matrix=matrix_a
        for i in range(int(order/2)):
            l=order-1-i
            for j in range(l):
                temp=swivel_matrix[i][j]
                swivel_matrix[i][j] = swivel_matrix[order-1-j][i]
                swivel_matrix[order-1-j][i] = swivel_matrix[order-1-i][order-1-j]
                swivel_matrix[order-1-i][order-1-j]=swivel_matrix[j][order-1-i]
                swivel_matrix[j][order-1-i] =temp

        res=[transpose,left_lower_diagonal,right_lower_diagonal,left_upper_diagonal,right_upper_diagonal,swivel_matrix]
        output_json={"title":"Set Operations","language":"Python","question":3,"params":[order,getStringArray(param_matrix_a)],"result":res,"status":200}
        output={"data":output_json,"status":200}
        return jsonify(output)
    else:
        output_json={"title":"Matrix Operations","language":"Python","question":3,"params":[order,getStringArray(param_matrix_a)],"error":"Invalid Matrix ","status":200}
        output={"data":output_json,"status":200}
        return jsonify(output)

def validMatrix(string,order):
    if len(getStringArray(string)) >= (order*order):
        for c in string:
            if c==' ' or (c>='0' and c<='9'):
                continue
            else:
                return False
        return True
    else:
        return False 

def getStringArray(given_set):
    split_value = []
    tmp = ''
    for c in given_set:
        if c == ' ':
            split_value.append((tmp))
            tmp = ''
        else:
            tmp += c
    if tmp != ' ':
        split_value.append((tmp)) 
    return split_value

def getMatrix(given_array,order):
    count=0
    temp=[]
    matrix=[]
    for no in given_array:
        if count==order:
            matrix.append(temp)
            temp=[]
            temp.append(no)
            count=1
        else:
            temp.append(no)
            count=count+1
            
    return matrix
   
def length(String):
    length=0
    for char in String:
        length=length+1
    return length

@app.route('/wordCurrencyConvertion',methods = ['POST', 'GET'])
@cross_origin()
def wordCurrencyConvertion():
    param_number = request.form['currency']
    param_type = request.form['currency_type']
    currency = (param_number)
    if(validateNumber(param_number)):
        words=["","","Hundred","Thousand","Lakh","Crore"]
        limit = [2,2,1,2,2]
        value=int(currency)
        count=0
        result=[]
        while (value != 0):
            if len(str(value)) >=limit[count] and count!=1:
                r= value % 100
                value=int(value/100) 
            else:
                r=value % 10
                value=int(value/10)
            count=count+1
            cur=currency_con(str(r))
            if(cur!="zero"):
                result.append( cur+ " " +words[count])
        ans=""
        for i in reversed(result):
            ans= ans + " "+ i + " "
        symbol=getSymbol(param_type)+" "+currency
        res=[symbol,ans+" " +param_type+"s"]
        output_json={"title":"Word Convertion","language":"Python","question":4,"params":[param_type,currency],"result":res,"status":200}
        output={"data":output_json,"status":200}
        return jsonify(output)
    else:
        output_json={"title":"Word Convertion","language":"Python","question":4,"params":[param_type,currency],"error":"Invalid Number","status":200}
        output={"data":output_json,"status":200}
        return jsonify(output)
def getSymbol(c_type):
    if(c_type=="Dollar"):
        return "$"
    elif(c_type=="Rupee"):
        return "₹"
    elif(c_type=="Euro"):
        return "€"
    elif(c_type=="Pound"):
        return "£"
    

def currency_con(currency):
    currency_word=""

    ones_digit = ["zero","one","two","three","four","five","six","seven","eight","nine"]
    two_digit=["","ten","eleven","twelve","thirteen","fourteen","fifteen","sixteen","seventeen","eighteen","nineteen"]
    ten_digit=["","","twenty","thirty","forty","fifty","sixty","seventy","eighty","ninenty"]
    ten_power=["hundred","thousand"]

    l = len(currency)
    print(currency)
    num=currency
    if(l==1):
        currency_word = currency_word + ones_digit[int(num[0])]
    else:
        x=0
        while x < len(num):
            if (l <= 2 ):
                if (int(num[x])== 1): 
                    sum = int(num[x])+   int(num[x+1])
                    currency_word = currency_word + two_digit[sum]+ " "
                    break

                elif (int(num[x]) == 2 and  int(num[x + 1]) == 0):
                    currency_word = currency_word + "twenty "
                    break
                    
                else:
                    i = int(num[x]) 
                    if(i > 0):
                        currency_word = currency_word + ten_digit[i] + " "
                    else:
                        currency_word = currency_word + " "
                    x += 1
                    if(int(num[x])!= 0):
                        currency_word = currency_word + ones_digit[int(num[x])] + " "
            x += 1
    return currency_word

def validateNumber(number):
    if(len(number)>8):
        return False
    for c in number:
            if (c>='0' and c<='9'):
                continue
            else:
                return False
    return True

@app.route('/rsaEncrypt',methods = ['POST', 'GET'])
@cross_origin()
def rsaEncrypt():
    param_message = request.form['message']
    if(validateMessage(param_message)):
        prime_number_1=7
        prime_number_2=3

        public_key_1=prime_number_1*prime_number_2

        encrypt=2
        phi=(prime_number_1-1)*(prime_number_2-1)
        while(encrypt<phi):
            if gcd(encrypt,phi)==1:
                break
            else:
                encrypt=encrypt+1
        k=2
        decrypt=(1+(k*phi))/encrypt
        encrypt_list=[]
        decrypt_list=[]

        for i in param_message:
            l=encryption(public_key_1,encrypt,ord(i)-97)
            encrypt_list.append(l)
        
        encrypt_data=""
        for i in encrypt_list:
            encrypt_data=encrypt_data+chr(int(i))

        for i in encrypt_list:
            l=encryption(public_key_1,decrypt,i)
            decrypt_list.append(l)
   
        decrypt_data=""
        for i in decrypt_list:
            decrypt_data=decrypt_data+chr(int(i)+97)
    
        res=[encrypt_data,decrypt_data]
        output_json={"title":"RSA Encryption","language":"Python","question":5,"params":[param_message],"result":res,"status":200}
        output={"data":output_json,"status":200}
        return jsonify(output)
    else:
        output_json={"title":"RSA Encryption","language":"Python","question":5,"params":[param_message],"error":"Invalid Message","status":200}
        output={"data":output_json,"status":200}
        return jsonify(output)

def validateMessage(message): 
    for c in message:
        if (c>='a' and c<='t'):
            continue
        else:
            return False
    return True

def encryption(public_key,encrypt_key,msg):
    data=pow(msg,encrypt_key)
    data=math.fmod(data, public_key)
    return data

def gcd(x,y): 
    if x > y: 
        small = y 
    else: 
        small = x 
    for i in range(1, small+1): 
        if((x % i == 0) and (y % i == 0)): 
            gcd = i 
              
    return gcd 

@app.route('/generateOTP',methods = ['POST', 'GET'])
@cross_origin()
def generateOTP():
    param_otp = request.form['otpLength']
    otp_type = request.form['alphanumeric']
    alpha_numeric_char="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890"
    if(validate(param_otp)):
        if(otp_type=="Number"):
            alpha_numeric_char="1234567890"
        elif(otp_type=="Alphabet"):
            alpha_numeric_char="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz"
        otp=""
        key=unique_key()
        for i in range(int(param_otp)):
            rand = getRand(0,len(alpha_numeric_char),key)
            print(rand,key,i)
            char=alpha_numeric_char[rand]
            otp=otp+char
            key= (key + (unique_key()/(2*(i+1))))/2
                        
        res=[otp]
        output_json={"title":"otp Generation ","language":"Python","question":9,"params":[param_otp],"result":res,"status":200}
        output={"data":output_json,"status":200}
        return jsonify(output)
    else:
        output_json={"title":"OTP Generation","language":"Python","question":9,"params":[param_otp],"error":"Invalid OTP Length","status":200}
        output={"data":output_json,"status":200}
        return jsonify(output)


def validate(otp):
    if(int(otp)>=1):
        return True
    else:
        return False

def getRand(min,max,key):
    n=(key)%10
    m=(int(key/10)) % 10
    n=((n+m)/2)/10  
    return(int(n * (max - min) + min))

def unique_key():
    return datetime.now().microsecond

@app.route('/generateCaptcha',methods = ['POST', 'GET'])
@cross_origin()
def generateCaptcha():
    param_msg = request.form['message']
    img = Image.new('RGB', (200, 100), color = (255, 255, 255))
    fnt = ImageFont.truetype('./gillsans.ttf', 32)
    d = ImageDraw.Draw(img)
    R, G, B = random.randint(10,245), random.randint(10,245), random.randint(10,245),
    cmin = random.randint(50, 70)
    cmax = random.randint(90,120)
    for _ in range(cmin,cmax):
        r = R + random.randint(-10,10)
        g = G + random.randint(-10,10)
        b = B + random.randint(-10,10)
        diam = random.randint(2,4)
        x, y = random.randint(0,150), random.randint(0,50)
        draw = PIL.ImageDraw.Draw(img)
        draw.ellipse([x,y,x+diam,y+diam], fill=(r,g,b))
    img.filter(ImageFilter.BoxBlur(10))
    x=10
    y=10
    for i in range(len(param_msg)):
        d.text((x+(i*17),y),param_msg[i], font=fnt, fill=(0, 0, 0))
        if(random.randint(0, 4)%2==0):
            y=y+(random.randint(0,4) *2)
        else:
            y=y-(random.randint(0,4) *2)
    img.rotate(random.randint(-10,10))
    img.save('captcha.png')
    res=[]
    with open("./captcha.png", "rb") as image:
        encoded_string = base64.b64encode(image.read())
        res.append(encoded_string.decode("utf-8")) 
    output_json={"title":"Captcha","language":"Python","question":10,"params":[param_msg],"result":res,"status":200}
    output={"data":output_json,"status":200}
    return jsonify(output)
 
@app.route('/generateQrcode',methods = ['POST', 'GET'])
@cross_origin()
def generateQrcode():
    param_msg = request.form['message']
    url = pyqrcode.create(param_msg) 
    url.png("QrCode.png", scale = 8) 
    res=[]
    with open("./QrCode.png", "rb") as image:
        encoded_string = base64.b64encode(image.read())
        res.append(encoded_string.decode("utf-8")) 
    output_json={"title":"QR Code","language":"Python","question":8,"params":[param_msg],"result":res,"status":200}
    output={"data":output_json,"status":200}
    return jsonify(output)

@app.route('/generateBarcode',methods = ['POST', 'GET'])
@cross_origin()
def generateBarcode():
    param_msg = str(request.form['message'])
    print(param_msg)
    barCode = EAN13(param_msg, writer=ImageWriter()) 
    barCode.save("BarCode")
    res=[]
    with open("./BarCode.png", "rb") as image:
        encoded_string = base64.b64encode(image.read())
        res.append(encoded_string.decode("utf-8")) 
    output_json={"title":"Bar Code","language":"Python","question":7,"params":[param_msg],"result":res,"status":200}
    output={"data":output_json,"status":200}
    return jsonify(output)
 
@app.route('/md5Algorithm',methods = ['POST', 'GET'])
@cross_origin()
def md5Algorithm():
    param_msg = request.form['message']
    hexa = hashlib.md5(param_msg.encode()) 
    res=[hexa.hexdigest()]
    output_json={"title":"md5 Algorithm","language":"Python","question":6,"params":[param_msg],"result":res,"status":200}
    output={"data":output_json,"status":200}
    return jsonify(output)

@app.route('/variance',methods = ['POST', 'GET'])
@cross_origin()
def variance():
     if request.method == 'POST':
        param_list = request.form['Numberlist']
        if validateVarianceNumber(param_list):
            Numberlist = getNumberList(param_list)
            mean=0
            standard_deviation=0
            variance=0
            sum=0
            for i in Numberlist:
                sum = sum+i
            mean= sum/ len(Numberlist)
            for i in Numberlist:
                standard_deviation =standard_deviation + pow(i - mean, 2)
            variance = standard_deviation/ len(Numberlist)
            standard_deviation=math.sqrt(variance)
            res=[variance,standard_deviation]
            output_json={"title":"Variance & Standard Deviation","language":"Python","question":"Variance and Standard Deviation","params":[param_list],"result":res,"status":200}
            output={"data":output_json,"status":200}
            return jsonify(output)
        else:
            output_json={"title":"Variance & Standard Deviation","language":"Python","question":"Variance and Standard Deviation","params":[param_list],"error":"Invalid Characaters","status":200}
            output={"data":output_json,"status":200}
            return jsonify(output)

@app.route('/linearRegression',methods = ['POST', 'GET'])
@cross_origin()
def linearRegression():
     if request.method == 'POST':
        param_xList = request.form['xList']
        param_yList = request.form['yList']
        if validateVarianceNumber(param_xList) and validateVarianceNumber(param_yList) and len(getNumberList(param_xList))==len(getNumberList(param_yList)):
            xList = getNumberList(param_xList)
            yList = getNumberList(param_yList)
            sum_xlist=0
            sum_ylist=0
            sum_xSquare=0
            sum_xy=0 
            n=len(xList)
            for i in range(n):
                sum_xlist = sum_xlist + xList[i]
                sum_ylist = sum_ylist + yList[i]
                sum_xSquare = sum_xSquare + (xList[i]*xList[i])
                sum_xy = sum_xy + (xList[i]*yList[i])
            
            slope = (n*sum_xy-sum_xlist*sum_ylist)/(n*sum_xSquare-sum_xlist*sum_xlist);
            intercept = (sum_ylist - slope*sum_xlist)/n
            equartion= "y = " + str(slope)+"x + "+ str(intercept)
            res=[str(equartion)]
            output_json={"title":"Linear Regression","language":"Python","question":"Linear Regression","params":[param_xList,param_yList],"result":res,"status":200}
            output={"data":output_json,"status":200}
            return jsonify(output)
        else:
            output_json={"title":"Linear Regression","language":"Python","question":"Linear Regression","params":[param_xList,param_yList],"error":"Invalid Length","status":200}
            output={"data":output_json,"status":200}
            return jsonify(output)



@app.route('/CalculateLcmGcf',methods = ['POST', 'GET'])
@cross_origin()
def CalculateLcmGcf():
     if request.method == 'POST':
        param_list = request.form['Numberlist']
        if validateVarianceNumber(param_list):
            Numberlist = getNumberList(param_list)
            hcf=calculateGCD(Numberlist)
            lcm=calculateLCM(Numberlist)
            res=[hcf,lcm]
            output_json={"title":"GCF and LCM","language":"Python","question":"GCF and LCM","params":[param_list],"result":res,"status":200}
            output={"data":output_json,"status":200}
            return jsonify(output)
        else:
            output_json={"title":"GCF and LCM","language":"Python","question":"GCF and LCM","params":[param_list],"error":"Invalid Characters","status":200}
            output={"data":output_json,"status":200}
            return jsonify(output)

def calculateGCD(NList):
    result = NList[0]
    for i in NList:
        result = GCD(i, result) 
        if(result == 1): 
           return 1 
    return result 

def calculateLCM(NList):
    result = NList[0]
    for i in NList:
        result = (((i * result)) /  (GCD(i, result))) 
    return result


def GCD(a,b):
    if (a == 0):
        return b 
    return GCD(b % a, a) 


def getNumberList(given_set):
    split_value = []
    tmp = ''
    for c in given_set:
        if c == ' ':
            split_value.append(float(tmp))
            tmp = ''
        else:
            tmp += c
    if tmp != ' ':
        split_value.append(float(tmp)) 
    return split_value

def validateVarianceNumber(given_set):
    count=0
    for c in given_set: 
        if c==' ' or (c>='0' and c<='9'):
            count=count+1
    if count==length(given_set):
        return True
    else:
        return False  

@app.route('/CalculateRoot',methods = ['POST', 'GET'])
@cross_origin()
def CalculateRoot():
     if request.method == 'POST':
        param_number = int(request.form['number'])
        res=[Sqrt(param_number),Cbrt(param_number)]
        output_json={"title":"Square and Cube root","language":"Python","question":"Square and Cube root","params":[param_number],"result":res,"status":200}
        output={"data":output_json,"status":200}
        return jsonify(output)

def Sqrt(number):
    temp=0
    sqrt=number/2
    while(sqrt!=temp):
        temp=sqrt
        sqrt=(number/temp+temp)/2
    return sqrt
def Cbrt(number):
    start=0
    last=number
    precision=0.001
    while True:
        mid = (start + last)/2; 
        error = binaryDiff(number, mid); 
        if (error <= precision):
            return mid
        if ((mid*mid*mid) > number): 
            last = mid; 
        else:
            start = mid; 
    return sqrt
def binaryDiff(n,mid):
    mid=mid*mid*mid
    if(n>mid):
        return (n-mid)
    else:
        return (mid-n)

@app.route('/nthRoot',methods = ['POST', 'GET'])
@cross_origin()
def nthRoot():
     if request.method == 'POST':
        param_number = int(request.form['number'])
        param_place = int(request.form['place'])
        res=[nthRoot(param_number,param_place)]
        output_json={"title":"Nth root","language":"Python","question":"Nth root","params":[param_number],"result":res,"status":200}
        output={"data":output_json,"status":200}
        return jsonify(output)

def nthRoot(number,place):
    xPre = random.randint(1,101) % 10
    eps = 0.001
    delX = 2147483647
    xK=0.0
    while (delX > eps): 
        xK = ((place - 1.0) * xPre +number/pow(xPre, place-1)) /place
        delX = abs(xK - xPre) 
        xPre = xK; 
    return xK

@app.route('/trignomentryFunction',methods = ['POST', 'GET'])
@cross_origin()
def trignomentryFunction():
     if request.method == 'POST':
        param_degree = (request.form['degree'])
        param_radian = (request.form['radian'])
        res=[]
        param=[]
        if param_degree:
            param.append(param_degree)
            param.append('-')
            res=GenerateList(radian(float(param_degree)),"Degree")
        else:
            param.append('-')
            param.append(param_radian)
            res=GenerateList(float(param_radian),"Radian")
        output_json={"title":"trignomentry","language":"Python","question":"trignomentry","params":param,"result":res,"status":200}
        output={"data":output_json,"status":200}
        return jsonify(output)

def GenerateList(rad,val):
    res=[]

    for i in range(9):
        res.append(Error(rad,i+1))
    return res
def Error(rad,ind):
    try:
        if ind==1:
            return math.sin(rad)
        if ind==2:
            return math.cos(rad)
        if ind==3:
            return math.tan(rad)
        if ind==4:
            return 1/math.sin(rad)
        if ind==5:
            return 1/math.cos(rad)
        if ind==6:
            return 1/math.tan(rad)
        if ind==7:
            return math.asin(rad)
        if ind==8:
            return math.acos(rad)
        if ind==9:
            return math.atan(rad)
    except:
        return "Not Defined"
def radian(degree):
    return degree*(math.pi/180)

@app.route('/CalculateLog',methods = ['POST', 'GET'])
@cross_origin()
def CalculateLog():
     if request.method == 'POST':
        param_number = float(request.form['number'])
        param_base = float(request.form['base'])
        Log= log(param_number)/log(param_base)
        naturalLog= log(param_number)
        res=[naturalLog,Log]
        output_json={"title":"Logarithm","language":"Python","question":"Logarithm","params":[param_number,param_base],"result":res,"status":200}
        output={"data":output_json,"status":200}
        return jsonify(output)

def log(x):
    n = 1000.0
    return n * ((x ** (1/n)) - 1)

@app.route('/CalculateAntiLog',methods = ['POST', 'GET'])
@cross_origin()
def CalculateAntiLog():
     if request.method == 'POST':
        param_number = float(request.form['number'])
        param_base = float(request.form['base'])
        #naturalLog= pow(2.718281828,param_number)
        Log= pow(param_base,param_number)
        res=[Log]
        output_json={"title":"AntiLogarithm","language":"Python","question":"AntiLogarithm","params":[param_number,param_base],"result":res,"status":200}
        output={"data":output_json,"status":200}
        return jsonify(output)


@app.route('/electricConvertion',methods = ['POST', 'GET'])
@cross_origin()
def electricConvertion():
     if request.method == 'POST':
        amp = (request.form['amp'])
        volt = (request.form['volt'])
        watt = (request.form['watt'])
        time = (request.form['time'])
        kva = (request.form['kva'])
        kw = (request.form['kw'])
        joule = (request.form['joule'])
        va = (request.form['va'])
        wh = (request.form['wh'])
        mah =(request.form['mah'])
        Ginput=[amp,volt,watt,time,kw,kva,va,joule,mah,wh]
        for i in range(2):
            if not volt:
                volt=Cvolt(amp,watt,va,wh,mah,kva)
            if not watt:
                watt=Cwatt(amp,volt,kw,wh,time,joule)
            if not amp:
                amp=Camp(volt,watt,va,kva)
            if not kw:
                kw=Ckw(watt)
            if not joule:
                joule=Cjoule(time,watt)
            if not kva:
                kva=Ckva(volt,amp)
            if not va:
                va=Cva(volt,amp)
            if not wh:
                wh=Cwh(watt,time,mah,volt)
            if not mah:
                mah=CmAh(wh,volt)
            if not time:
                time=Ctime(wh,watt,joule)
        res=[amp,volt,watt,kw,kva,joule,va,mah,wh,time]
        output_json={"title":"Electric Convertion","language":"Python","question":"Electric Convertion","params":Ginput,"result":res,"status":200}
        output={"data":output_json,"status":200}
        return jsonify(output)

def Cvolt(amp,watt,va,wh,mah,kva):
    if(amp and watt):
        return (float(watt)/float(amp))
    if(va and amp):
        return (float(va)/float(amp))
    if(kva and amp):
        return (float(kva)/(1000*float(amp)))
    if(wh and mah):
        return (float(wh)*1000)/float(mah)
    return ""

def Cwatt(amp,volt,kw,wh,time,joule):
    if(amp and volt):
        return (float(amp)*float(volt))
    if(kw):
        return (float(kw)/1000)
    if(wh and time):
        return (float(wh)/float(time))
    if(joule and time):
        return (float(joule)/(float(time)*3600))
    return ""
def Camp(volt,watt,va,kva):
    if(watt and volt):
        return (float(watt)/float(volt)) 
    if(va and volt):
        return (float(va)/float(volt))
    if(kva and volt):
        return (float(kva)/(1000*float(volt)))
    return ""

def Ckw(watt):
    if watt:
        return (float(watt)*1000) 
    return ""
def Cjoule(time,watt):
    if watt and time:
        return (float(watt)*(float(time)*3600))

def Cva(volt,amp):
    if volt and amp:
        return(float(volt)*float(amp))

def Ckva(volt,amp):
    if volt and amp:
        return (1000*(float(volt)*float(amp)))

def Cwh(watt,time,mAh,volt):
    if(watt and time):
        return (float(watt)*float(time))
    if(mAh and volt):
        return (float(mAh) * float(volt) / 1000)
def CmAh(wh,volt):
    if wh and volt:
        return (1000 * float(wh) / float(volt)) 

def Ctime(wh,watt,joule):
    if wh and watt:
        return (float(wh)/float(watt))
    if joule and watt:
        return (float(joule)/(float(watt)*3600))

class node:
    def __init__(self, freq, char, left=None, right=None):
        self.freq = freq
        self.char = char
        self.left = left
        self.right = right
        self.huff = ''

global_node_res=[]
def traverse(node, val=''):
    newVal = val + str(node.huff)
    if(node.left):
        traverse(node.left, newVal)
    if(node.right):
        traverse(node.right, newVal)
    if(not node.left and not node.right):
        global_node_res.append(node.char+"->"+newVal)

@app.route('/huffman_technique',methods = ['POST', 'GET'])
@cross_origin()
def huffman_technique():
     if request.method == 'POST':
        global global_node_res
        h_msg = (request.form['huffman_message'])
        all_freq={}
        for i in h_msg: 
            if i in all_freq: 
                all_freq[i] += 1
            else: 
                all_freq[i] = 1
        h_char=[]
        h_freq=[]
        for x in all_freq:
            h_char.append(x)
            h_freq.append(all_freq[x])
        print(h_char,h_freq)
        nodes = []
        for i in range(len(h_char)):
            nodes.append(node(h_freq[i], h_char[i]))
        while len(nodes) > 1:
            nodes = sorted(nodes, key=lambda x: x.freq)
            left = nodes[0]
            right = nodes[1]
            left.huff = 0
            right.huff = 1
            newNode = node(left.freq+right.freq, left.char+right.char, left, right)
            nodes.remove(left)
            nodes.remove(right)
            nodes.append(newNode)
        print(nodes[0])
        traverse(nodes[0])
        Ginput=[str(h_msg)]
        res=[global_node_res]
        global_node_res=[]
        output_json={"title":"huffman_technique","language":"Python","question":"huffman_technique","params":Ginput,"result":res,"status":200}
        output={"data":output_json,"status":200}
        return jsonify(output)


@app.route('/run_length_algorithm',methods = ['POST', 'GET'])
@cross_origin()
def run_length_algorithm():
     if request.method == 'POST':
        msg = (request.form['message'])
        Ginput=[msg]
        res=[run_length_algorithm_encode(msg),run_length_algorithm_Decode(run_length_algorithm_encode(msg))]
        output_json={"title":"run_length_algorithm","language":"Python","question":"run_length_algorithm","params":Ginput,"result":res,"status":200}
        output={"data":output_json,"status":200}
        return jsonify(output)

def run_length_algorithm_encode(msg): 
    encoded_msg = "" 
    i = 0
    while (i <= len(msg)-1): 
        count = 1
        ch = msg[i] 
        j = i 
        while (j < len(msg)-1): 
            if (msg[j] == msg[j+1]): 
                count = count+1
                j = j+1
            else: 
                break
        encoded_msg=encoded_msg+ch+str(count) 
        i = j+1
    return encoded_msg 

def run_length_algorithm_Decode(msg): 
    decoded_msg = ""
    count='0'
    last_char=''
    for i in msg:
        if(str.isdigit(i)):
            count =count + i
        else:
            for j in range(int(count)):
                decoded_msg=decoded_msg+last_char
            last_char=i
            count="0"
    for j in range(int(count)):
        decoded_msg=decoded_msg+last_char
    return decoded_msg 

@app.route('/Lempel_Ziv_Welch',methods = ['POST', 'GET'])
@cross_origin()
def Lempel_Ziv_Welch():
     if request.method == 'POST':
        msg = (request.form['message'])
        Ginput=[msg]
        cmped=LZW_compress(msg)
        uncmped=LZW_decompress(cmped)
        res=[(cmped),uncmped]
        output_json={"title":"Lempel_Ziv_Welch","language":"Python","question":"Lempel_Ziv_Welch","params":Ginput,"result":res,"status":200}
        output={"data":output_json,"status":200}
        return jsonify(output)

def LZW_compress(uncompressed):
    dict_size = 256
    dictionary = dict((chr(i), i) for i in range(dict_size))
    w = ""
    result = []
    for c in uncompressed:
        wc = w + c
        if wc in dictionary:
            w = wc
        else:
            result.append(dictionary[w])
            dictionary[wc] = dict_size
            dict_size += 1
            w = c
    if w:
        result.append(dictionary[w])
    return result
 
 
def LZW_decompress(compressed):
    from io import StringIO
    dict_size = 256
    dictionary = dict((i, chr(i)) for i in range(dict_size))
    result = StringIO()
    w = chr(compressed.pop(0))
    result.write(w)
    for k in compressed:
        if k in dictionary:
            entry = dictionary[k]
        elif k == dict_size:
            entry = w + w[0]
        else:
            raise ValueError('Bad compressed k: %s' % k)
        result.write(entry)
        dictionary[dict_size] = w + entry[0]
        dict_size += 1
        w = entry
    return result.getvalue()


@app.route('/Lossless_Compressions',methods = ['POST', 'GET'])
@cross_origin()
def Lossless_Compressions():
     if request.method == 'POST':
        msg = (request.form['message'])
        Ginput=[msg]
        byte_Data=msg.encode('utf-8')
        bz2_cmped= bz2.compress(byte_Data)
        bz2_uncmped=bz2.decompress(bz2_cmped)
        obj = lzma.LZMACompressor()
        lzma_cmped=obj.compress(byte_Data)
        obj = lzma.LZMADecompressor()
        lzma_uncmped=obj.decompress(lzma_cmped)
        def_cmped = deflate.gzip_compress(byte_Data, 6)
        def_uncmped = deflate.gzip_decompress(def_cmped)
        res=[str(bz2_cmped),str(bz2_uncmped.decode('utf-8')),str(lzma_cmped),str(msg),str(def_cmped),str(def_uncmped.decode('utf-8'))]
        output_json={"title":"Lossless_Compressions","language":"Python","question":"Lossless_Compressions","params":Ginput,"result":res,"status":200}
        output={"data":output_json,"status":200}
        return jsonify(output)


if __name__ == '__main__':
    app.run()