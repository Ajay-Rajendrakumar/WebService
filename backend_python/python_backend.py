from flask import Flask
from flask_cors import CORS, cross_origin
from flask import request
from flask import jsonify

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



if __name__ == '__main__':
    app.run()