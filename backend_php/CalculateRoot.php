<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
header('Content-type: application/json');

if ($_SERVER["REQUEST_METHOD"] == "POST") {
  
    $number = (int)$_POST['number'];
    
    $list = array();
    array_push($list, (Squrt($number)));
    array_push($list, (Cbrt($number)));
   
    $Obj = new \stdClass();
    $Obj->title = "Square and Cube root";
    $Obj->language = "PHP";
    $Obj->result = $list;
    $params = array();
    array_push($params, $number);
    $Obj->params = $params;
    $Obj->question = "Square and Cube root";
    $Obj->status = 200;
     $output = new \stdClass();
    $output->data=(object)$Obj;
    $output->status=200;
    $JSON = json_encode($output);
    echo $JSON;
}

function Squrt($number){
    $temp=0;
    $sqrt=$number/2;
    while($sqrt!=$temp){
        $temp=$sqrt;
        $sqrt=($number/$temp+$temp)/2;
    }
    return $sqrt;
}
function Cbrt($number){
    $start=0;
    $last=$number;
    $precision=0.001;
    while(1){
        $mid = ($start + $last)/2; 
        $error = binaryDiff($number, $mid); 
        if ($error <= $precision){
            return $mid;
        }
        if (($mid*$mid*$mid) > $number) {
            $last = $mid; 
        }
        else{
            $start = $mid;
        }
    } 
    return $sqrt;
}
function binaryDiff($n,$mid){
    $mid=$mid*$mid*$mid;
    if($n>$mid){
        return ($n-$mid);
    }
    else{
        return ($mid-$n);
    }
}



?>