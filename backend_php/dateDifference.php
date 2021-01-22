<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
header('Content-type: application/json');

if ($_SERVER["REQUEST_METHOD"] == "POST") {
  
 	$param_date1 = $_POST['date_1'];
	$param_date2 = $_POST['date_2'];

	$date_1=getDateList($param_date1);
	$date_2=getDateList($param_date2);
  	
	if(validDate($date_1) && validDate($date_2) && dateCompare($date_2,$date_1)){

		 if($date_2[0]<$date_1[0]){
            if($date_2[1]==3){
                if(($date_2[2] % 4 == 0 & $date_2[2] % 100 != 0) || ($date_2[2] % 400 == 0)){
                    $date_2[0]=$date_2[0]+29;
                }else{
                    $date_2[0]=$date_2[0]+28 ; 
                }
              }
            else if(($date_2[1]==5) || ($date_2[1]==7) || ($date_2[1]==10) || ($date_2[1]==11)){
                $date_2[0]=$date_2[0]+30;
            }
            else{
                $date_2[0]=$date_2[0]+31;
            }
            $date_2[1]=$date_2[1]-1;
        }
        if($date_2[1]<$date_1[1]){
            $date_2[1]=$date_2[1]+12;
            $date_2[2]=$date_2[2]-1;
        }
        //Handling Hour/Minute/Seconds
        if($date_2[3]<$date_1[3]){
            $date_2[3]=$date_2[3]+24;
            $date_2[0]=$date_2[0]-1;
        }
        if($date_2[4]<$date_1[4]){
            $date_2[4]=$date_2[4]+60;
            $date_2[3]=$date_2[3]-1;
        }
        if($date_2[5]<$date_1[5]){
            $date_2[5]=$date_2[5]+60;
            $date_2[4]=$date_2[4]-1;
        }

        $date_diff = $date_2[0] - $date_1[0];
        $month_diff = $date_2[1] - $date_1[1];
        $year_diff = $date_2[2] - $date_1[2] ;
        $hour_diff = $date_2[3] - $date_1[3];
        $minute_diff = $date_2[4] - $date_1[4];
        $second_diff = $date_2[5] - $date_1[5];
        $list = array();
        array_push($list, ($date_diff));
		array_push($list, ($month_diff));
		array_push($list, ($year_diff));
		array_push($list, ($hour_diff));
		array_push($list, ($minute_diff));
		array_push($list, ($second_diff));
	
		$Obj = new \stdClass();
		$Obj->title = "Date Difference";
		$Obj->language = "PHP";
		$Obj->result = $list;
		$params = array();
		array_push($params, dateFormat(getDateList($param_date1)));
		array_push($params, dateFormat(getDateList($param_date2)));
		$Obj->params = $params;
		$Obj->question = 1;
		$Obj->status = 200;
      	 $output = new \stdClass();
		$output->data=(object)$Obj;
		$output->status=200;
        $JSON = json_encode($output);
		echo $JSON;

	}else{
		 $Obj = new \stdClass();
		$Obj->title = "Date Difference";
		$Obj->language = "PHP";
		$Obj->question = 1;
		$Obj->error = "Invalid Date Format";
		$Obj->status = 200;
		$list = array();
		array_push($list, dateFormat($date_1));
		array_push($list, dateFormat($date_2));
		$Obj->params = $list;
		$output = new \stdClass();
		$output->data=(object)$Obj;
		$output->status=200;
		$JSON = json_encode($output);
		echo $JSON;
	}
  
}

function getDateList($date) {
	$list = array();
	$no="";
	for ($i = 0; $i < strlen($date); $i++){
		 if($date[$i] == '/'){
		 	array_push($list, (int)$no);
		 	$no="";
		 }else{
		 	$no .=$date[$i]; 
		 }
	}
	return $list;
}
function dateFormat($temp_date){
    return (string) ($temp_date[0])."|".(string) ($temp_date[1])."|".(string) ($temp_date[2]).' - '.(string) ($temp_date[3]).':'.(string) ($temp_date[4]).':'.(string) ($temp_date[5]);
}
function validDate($temp_date){
    $leap = 0;
    $valid = true;
    if($temp_date[2]>=1800 && $temp_date[2]<=9999){
        if(($temp_date[2] % 4 == 0 && $temp_date[2] % 100 != 0) || ($temp_date[2] % 400 == 0))
            $leap=1;
        if($temp_date[1]>=1 && $temp_date[1]<=12)
            if($temp_date[1]==2)
                if($leap==1 && $temp_date[0]==29)
                    $valid = true;
                else if($temp_date[0]>29)
                    $valid = false;
            else if($temp_date[1]==4 || $temp_date[1]==6 || $temp_date[1]==9 || $temp_date[1]==11)
                if($temp_date[0]>30)
                    $valid = false ;        
            else if($temp_date[0]>31)
                $valid = false;
        else
            $valid = false;   
    }
    else{
        $valid = false;
    }
    return $valid;
}
function dateCompare($d1,$d2){
    if($d1[2]<$d2[2])
        return false;
    if($d1[2]==$d2[2] && $d1[1]<$d2[1])
        return false;
    if($d1[2]==$d2[2] && $d1[1]==$d2[1] && $d1[0]<$d2[0])
        return false ;  
    return true   ;
}
?>