from flask import Flask
from flask_cors import CORS, cross_origin
from flask import request
from datetime import datetime
from flask import jsonify
from PIL import Image, ImageDraw, ImageFont
import base64
import random
import os
import math

image_path = '../captcha/'
app = Flask(__name__)
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'

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
            if swap==1:
                res=[union,intersection,minus_b,minus_a]
            else:
                res=[union,intersection,minus_a,minus_b]
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
            result.append(currency_con(str(r)) + " " +words[count])
        ans=""
        for i in reversed(result):
            ans= ans + " "+ i + " "
        res=[ans]
        output_json={"title":"Word Convertion","language":"Python","question":4,"params":[currency],"result":res,"status":200}
        output={"data":output_json,"status":200}
        return jsonify(output)
    else:
        output_json={"title":"Word Convertion","language":"Python","question":4,"params":[currency],"error":"Invalid Number","status":200}
        output={"data":output_json,"status":200}
        return jsonify(output)

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
            encrypt_data=encrypt_data+chr(int(i)+97)

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


if __name__ == '__main__':
    app.run()