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
    $res=array();
    for($i=1;$i<=9;$i++){
        array_push($res,Error($rad,$i));
    }
    return $res;
}
function Error($rad,$i){
    try{
        switch($i) {
            case 1:
                return sin($rad);
            case 2:
                return cos($rad);
            case 3:
                return tan($rad);
            case 4:
                {
                    if(sin($rad)!=0){
                        return 1/sin($rad);
                    }else{
                        return "Not Defined";
                    }
                }
            case 5:
                {
                    if(cos($rad)!=0){
                        return 1/cos($rad);
                    }else{
                        return "Not Defined";
                    }
                }
                
            case 6:
                {
                    if(tan($rad)!=0){
                        return 1/tan($rad);
                    }else{
                        return "Not Defined";
                    }
                }
                
            case 7:
                return asin($rad);
            case 8:
                return acos($rad);
            case 9:
                return atan($rad);
        }
      }catch(Exception  $err) {
        return ("Not Defined");
      }
}
function radian($degree){
    return $degree*(pi()/180);
}



?>