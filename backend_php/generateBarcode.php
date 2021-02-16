<?php
include 'phpqrcode/qrlib.php'; 
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
header('Content-type: application/json');

if ($_SERVER["REQUEST_METHOD"] == "POST") {
  
 	$param_message =  $_POST['message'];
      
        $path = 'G:/xampp/htdocs/backend_php/';
        $file = $path."Barcode.png"; 
          
        // $ecc stores error correction capability('L') 
        $generator = new BarcodeGenerator(EncodeTypes::CODE_128, $param_message); 
    // set image resolution
        $generator->getParameters()->setResolution(200);
        // generate and save barcode
        $generator->save($file);
        $path1= 'G:/xampp/htdocs/backend_php/Barcode.png';

        $list = array();
        array_push($list, base64_encode(file_get_contents($path1)));

		
        $Obj = new \stdClass();
		$Obj->title = "Bar Code Generation";
		$Obj->language = "PHP";
		$Obj->result = $list;     
		$params = array();
		array_push($params, $param_message);
		$Obj->params = $params;
		$Obj->question = 7;
		$Obj->status = 200;
      	 $output = new \stdClass();
		$output->data=(object)$Obj;
		$output->status=200;
        $JSON = json_encode($output);
		echo $JSON;


  
}



?>