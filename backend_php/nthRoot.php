<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
header('Content-type: application/json');

if ($_SERVER["REQUEST_METHOD"] == "POST") {
  
    $number = (int)$_POST['number'];
    $place = (int)$_POST['place'];
    
    $list = array();
    array_push($list, (nthRoot($number,$place)));
    
    $Obj = new \stdClass();
    $Obj->title = "Nth root";
    $Obj->language = "PHP";
    $Obj->result = $list;
    $params = array();
    array_push($params, $number);
    $Obj->params = $params;
    $Obj->question = "Nth root";
    $Obj->status = 200;
     $output = new \stdClass();
    $output->data=(object)$Obj;
    $output->status=200;
    $JSON = json_encode($output);
    echo $JSON;
}

function nthRoot($number,$place){
    $xPre = rand() % 10;
    $eps = 0.001;
    $delX = 2147483647;
    $xK=0.0;
    while ($delX > $eps){ 
        $xK = (($place - 1.0) * $xPre +$number/pow($xPre, $place-1)) /$place;
        $delX = abs($xK - $xPre); 
        $xPre = $xK; 
    }
    return $xK;
}



?>