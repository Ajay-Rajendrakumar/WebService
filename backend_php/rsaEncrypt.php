<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
header('Content-type: application/json');

if ($_SERVER["REQUEST_METHOD"] == "POST") {
  
 	$param_message = $_POST['message'];

    if(validateMessage($param_message)){
        $prime_number_1=7;
        $prime_number_2=3;

        $public_key_1=$prime_number_1*$prime_number_2;

        $encrypt=2;
        $phi=($prime_number_1-1)*($prime_number_2-1);
        while($encrypt<$phi){
            if(get_gcd($encrypt,$phi)==1){
                break;
            }else{
                $encrypt=$encrypt+1;
            }
        }
        $k=2;
        $decrypt=(1+($k*$phi))/$encrypt;
        $encrypt_list=array();
        $decrypt_list=array();

        for ($i = 0; $i < strlen($param_message); $i++){
            $l=encryption($public_key_1,$encrypt,(ord((string)$param_message[$i])-97));
            array_push($encrypt_list,$l);
        }
        
        $encrypt_data="";
        for ($i = 0; $i < count($encrypt_list); $i++){
            $encrypt_data=$encrypt_data . chr((int)$encrypt_list[$i]);
        }
 
        for ($i = 0; $i < count($encrypt_list); $i++){
            $l=encryption($public_key_1,$decrypt,$encrypt_list[$i]);
            array_push($decrypt_list,$l);

        }
        $decrypt_data="";
        for ($i = 0; $i < count($decrypt_list); $i++){
            $decrypt_data=$decrypt_data . chr((int)$decrypt_list[$i]+97);
        }
         $list = array();
        array_push($list, $encrypt_data);
        array_push($list, $decrypt_data);
    
		$Obj = new \stdClass();
		$Obj->title = "RSA Algorithm";
		$Obj->language = "PHP";
		$Obj->result = $list;
		$params = array();
		array_push($params, $param_message);
		$Obj->params = $params;
		$Obj->question = 5;
		$Obj->status = 200;
      	 $output = new \stdClass();
		$output->data=(object)$Obj;
		$output->status=200;
        $JSON = json_encode($output);
		echo $JSON;

	}else{
		 $Obj = new \stdClass();
		$Obj->title = "RSA Algorithm";
		$Obj->language = "PHP";
		$Obj->question = 5;
		$Obj->error = "Invalid Number";
		$Obj->status = 200;
		$list = array();
		array_push($list, $param_message);
		$Obj->params = $list;
		$output = new \stdClass();
		$output->data=(object)$Obj;
		$output->status=200;
		$JSON = json_encode($output);
		echo $JSON;
	}
  
}

function encryption($public_key,$encrypt_key,$msg){
    $data=pow($msg,$encrypt_key);
    $data=fmod($data,$public_key);
    return $data;
}

function validateMessage($string){
        for ($i = 0; $i < strlen($string); $i++){   
            if(($string[$i]>='a' && $string[$i]<='t'))
            {
                continue;
            }else
            {
                return false;
            }
        }
        return true;
}

function get_gcd($x,$y){ 
    $small=0;
    if($x > $y){
        $small = $y; 
    }else{
        $small = $x;
    } 
    for ($i = 1; $i < $small+1; $i++){
        if(($x % $i == 0) && ($y % $i == 0)){ 
            $gcd = $i; 
        }
    }  
    return $gcd; 
}


?>