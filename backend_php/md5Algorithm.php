<?php
include 'phpqrcode/qrlib.php'; 
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
header('Content-type: application/json');

if ($_SERVER["REQUEST_METHOD"] == "POST") {
  
 	$param_message =  $_POST['message'];
      		

        $list = array();
        array_push($list,md5($param_message));

		
        $Obj = new \stdClass();
		$Obj->title = "md5 Algorithm";
		$Obj->language = "PHP";
		$Obj->result = $list;     
		$params = array();
		array_push($params, $param_message);
		$Obj->params = $params;
		$Obj->question = 6;
		$Obj->status = 200;
      	 $output = new \stdClass();
		$output->data=(object)$Obj;
		$output->status=200;
        $JSON = json_encode($output);
		echo $JSON;


  
}



?>