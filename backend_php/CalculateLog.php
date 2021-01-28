<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
header('Content-type: application/json');

if ($_SERVER["REQUEST_METHOD"] == "POST") {
  
    $param_number = (float)$_POST['number'];
    $Nlog=CalcLog($param_number);
    $Log=CalcLog($param_number)/CalcLog(10);
    
    $list = array();
    array_push($list,$Nlog );
    array_push($list, $Log);
    
    $Obj = new \stdClass();
    $Obj->title = "Logarithm";
    $Obj->language = "PHP";
    $Obj->result = $list;
    $params = array();
    array_push($params, $param_number);
    $Obj->params = $params;
    $Obj->question = "Logarithm";
    $Obj->status = 200;
     $output = new \stdClass();
    $output->data=(object)$Obj;
    $output->status=200;
    $JSON = json_encode($output);
    echo $JSON;
}

function CalcLog($x){
    $n = 1000.0;
    return $n * (($x ** (1/$n)) - 1);
}



?>