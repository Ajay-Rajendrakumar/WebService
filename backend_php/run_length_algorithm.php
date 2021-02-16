<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
header('Content-type: application/json');

if ($_SERVER["REQUEST_METHOD"] == "POST") {
  
    $msg = $_POST['message'];
    
    $list = array();
    array_push($list,run_length_algorithm_encode($msg));  
    array_push($list,run_length_algorithm_Decode(run_length_algorithm_encode($msg)));  
    $Obj = new \stdClass();
    $Obj->title = "run_length_algorithm";
    $Obj->language = "PHP";
    $Obj->result = $list;
    $params = array();
    array_push($params, $msg);
    $Obj->params = $params;
    $Obj->question = "run_length_algorithm";
    $Obj->status = 200;
     $output = new \stdClass();
    $output->data=(object)$Obj;
    $output->status=200;
    $JSON = json_encode($output);
    echo $JSON;
}

function run_length_algorithm_encode($msg){ 
    $encoded_msg = "" ;
    $i = 0;
    while ($i <= (strlen($msg))-1){
        $count = 1;
        $ch = $msg[$i]; 
        $j = $i ;
        while ($j < (strlen($msg))-1){
            if ($msg[$j] == $msg[$j+1]){
                $count = $count+1;
                $j = $j+1;
            }
            else{
                break;
            }
        }
        $encoded_msg=$encoded_msg . $ch . (string)($count);
        $i = $j+1;
    }
    return $encoded_msg; 
}
function run_length_algorithm_Decode($msg){
    $decoded_msg = "";
    $count='0';
    $last_char='';
    for($i=0; $i<strlen($msg); $i++){
        if(is_numeric($msg[$i])){
            $count =$count . $msg[$i];
        }
        else{
             for ($j=0; $j<(int)($count);$j++) {
                $decoded_msg=$decoded_msg . $last_char;
             }
            $last_char=$msg[$i];
            $count="0";
        }
    }
    for($i=0; $i<(int)($count);$i++) {
        $decoded_msg=$decoded_msg . $last_char;
    }
    return $decoded_msg; 
}

?>