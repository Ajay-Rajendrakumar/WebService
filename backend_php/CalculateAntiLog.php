<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
header('Content-type: application/json');

if ($_SERVER["REQUEST_METHOD"] == "POST") {
  
    $param_number = (float)$_POST['number'];
    $param_base = (float)$_POST['base'];
    $Alog=pow($param_base,$param_number);
    
    $list = array();
    array_push($list,$Alog );


    $Obj = new \stdClass();
    $Obj->title = "AntiLogarithm";
    $Obj->language = "PHP";
    $Obj->result = $list;
    $params = array();
    array_push($params, $param_number);
    array_push($params, $param_base);
    $Obj->params = $params;
    $Obj->question = "AntiLogarithm";
    $Obj->status = 200;
     $output = new \stdClass();
    $output->data=(object)$Obj;
    $output->status=200;
    $JSON = json_encode($output);
    echo $JSON;
}



?>