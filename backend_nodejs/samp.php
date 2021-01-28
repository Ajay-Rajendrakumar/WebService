<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
header('Content-type: application/json');

if ($_SERVER["REQUEST_METHOD"] == "POST") {
  
    $param_degree = $_POST['degree'];
    $param_radian = $_POST['radian'];
    $res=array();
    $param=array();
    if(strlen($param_degree)>0){
        array_push($param, $param_degree);
        array_push($param, "-");
        $res= GenerateList(radian((float)$param_degree)); 
    }else{
        array_push($param, "-");
        array_push($param, $param_radian);
        $res= GenerateList(((float)$param_radian)); 
    }
   
   
    $Obj = new \stdClass();
    $Obj->title = "trignomentry";
    $Obj->language = "PHP";
    $Obj->result = $res;
    $Obj->params = $param;
    $Obj->question = "trignomentry";
    $Obj->status = 200;
     $output = new \stdClass();
    $output->data=(object)$Obj;
    $output->status=200;
    $JSON = json_encode($output);
    echo $JSON;
}

function GenerateList($rad){
    $res= array();
    array_push($res, sin($rad));
    array_push($res, cos($rad));
    array_push($res, tan($rad));
    array_push($res, asin($rad));
    array_push($res, acos($rad));
    array_push($res, atan($rad)); 
    return $res;
}
function radian($degree){
    return $degree*(pi()/180);
}



?>