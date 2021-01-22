<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
header('Content-type: application/json');

if ($_SERVER["REQUEST_METHOD"] == "POST") {
  
 	$param_message =  $_POST['message'];
        $width  = 200;
        $height = 30;
        $im = imagecreatetruecolor($width, $height);

        $white  = imagecolorallocate($im, 255, 255, 255);
        $grey   = imagecolorallocate($im, 128, 128, 128);
        $blue  = imagecolorallocate($im, 0, 0, 255);
        $red  = imagecolorallocate($im, 0, 255, 0);
        $green  = imagecolorallocate($im, 255, 0, 0);
        $black  = imagecolorallocate($im, 0, 0, 0);
        imagefilledrectangle($im, 0, 0, 399, 29, $white);

        $color = array();
        array_push($color, (($blue)));
        array_push($color,  (($red)));
        array_push($color, ($green));

        $font = 'G:/xampp/htdocs/backend_php/gillsans.ttf';
       
        $x=10;
        for($i=0;$i<strlen($param_message);$i++){
                $size=rand(25,30);
                $rotate=rand(-10,10);
                 imagettftext($im, $size, $rotate, $x+($i*17), 20, $black, $font, $param_message[$i]);
        }
        imagepng($im,"captcha.png");
        $path= 'G:/xampp/htdocs/backend_php/captcha.png';

        $list = array();
        array_push($list, base64_encode(file_get_contents($path)));
        imagedestroy($im);
		
        $Obj = new \stdClass();
		$Obj->title = "Captcha";
		$Obj->language = "PHP";
		$Obj->result = $list;     
		$params = array();
		array_push($params, $param_message);
		$Obj->params = $params;
		$Obj->question = 10;
		$Obj->status = 200;
      	 $output = new \stdClass();
		$output->data=(object)$Obj;
		$output->status=200;
        $JSON = json_encode($output);
		echo $JSON;


  
}



?>