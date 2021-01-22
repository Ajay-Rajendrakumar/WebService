<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
header('Content-type: application/json');

if ($_SERVER["REQUEST_METHOD"] == "POST") {
  
 	$otp_len = $_POST['otpLength'];
   
    if(validateNumber($otp_len)){
        $alpha_numeric_char="ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890abcdefghijklmnopqrstuvwxyz";
        $otp="";
        $key=unique_key();
        for ($i = 0; $i < (int)($otp_len); $i++){
            $rand = getRand(0,60,$key);
            $char=$alpha_numeric_char[$rand];
            $otp=$otp . $char;
            $key= ($key + (unique_key()/(2*($i+1))))/2;
        }
     
    
         $list = array();
        array_push($list, $otp);
      
		$Obj = new \stdClass();
		$Obj->title = "OTP Generation";
		$Obj->language = "PHP";
		$Obj->result = $list;
		$params = array();
		array_push($params, $otp_len);
		$Obj->params = $params;
		$Obj->question = 9;
		$Obj->status = 200;
      	 $output = new \stdClass();
		$output->data=(object)$Obj;
		$output->status=200;
        $JSON = json_encode($output);
		echo $JSON;

	}else{
		 $Obj = new \stdClass();
		$Obj->title = "OTP Generation";
		$Obj->language = "PHP";
		$Obj->question = 9;
		$Obj->error = "Invalid OTP Length";
		$Obj->status = 200;
		$list = array();
		array_push($list, $otp_len);
		$Obj->params = $list;
		$output = new \stdClass();
		$output->data=(object)$Obj;
		$output->status=200;
		$JSON = json_encode($output);
		echo $JSON;
	}
  
}

function unique_key(){
        list($usec, $sec) = explode(" ", microtime());
        return ((float)$usec + (float)$sec);
}
function getRand($min,$max,$key){
    $n=((int)$key)%10;
    $m=((int)($key/10)) % 10;
    $n=(($n+$m)/2)/10  ;
    return((int)($n * ($max - $min) + $min));
}
function validateNumber($no){
    if((int)($no)>=1){
        return true;
    }else{
        return false;
    }
}


?>