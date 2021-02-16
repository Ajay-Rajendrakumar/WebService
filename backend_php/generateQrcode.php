<?php
include 'phpqrcode/qrlib.php'; 
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
header('Content-type: application/json');

if ($_SERVER["REQUEST_METHOD"] == "POST") {
  
 	$param_message =  $_POST['message'];
      
        $path = 'G:/xampp/htdocs/backend_php/';
        $file = $path."Qrcode.png"; 
        $ecc = 'L'; 
        $pixel_Size = 7; 
        $frame_size = 8;
        QRcode::png($param_message, $file, $ecc, $pixel_Size, $frame_size); 
        $path1= 'G:/xampp/htdocs/backend_php/Qrcode.png';

        $list = array();
        array_push($list, base64_encode(file_get_contents($path1)));
		
        $Obj = new \stdClass();
		$Obj->title = "QR Code Generation";
		$Obj->language = "PHP";
		$Obj->result = $list;     
		$params = array();
		array_push($params, $param_message);
		$Obj->params = $params;
		$Obj->question = 8;
		$Obj->status = 200;
      	 $output = new \stdClass();
		$output->data=(object)$Obj;
		$output->status=200;
        $JSON = json_encode($output);
		echo $JSON;


  
}



?>