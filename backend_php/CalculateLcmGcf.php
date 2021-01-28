<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
header('Content-type: application/json');

if ($_SERVER["REQUEST_METHOD"] == "POST") {
  
    $param_list = $_POST['Numberlist'];
    if(validateVarianceNumber($param_list)){
        $Numberlist = getNumberList($param_list);
        $hcf=calculateGCD($Numberlist);
        $lcm=calculateLCM($Numberlist);
       
        $list = array();
        array_push($list, ($hcf));
        array_push($list, ($lcm));
       

        $Obj = new \stdClass();
        $Obj->title = "GCF and LCM";
        $Obj->language = "PHP";
        $Obj->result = $list;
        $params = array();
        array_push($params, $param_list);
        $Obj->params = $params;
        $Obj->question = "GCF and LCM";
        $Obj->status = 200;
         $output = new \stdClass();
        $output->data=(object)$Obj;
        $output->status=200;
        $JSON = json_encode($output);
        echo $JSON;

    }else{
         $Obj = new \stdClass();
        $Obj->title = "GCF and LCM";
        $Obj->language = "PHP";
        $Obj->question = "GCF and LCM";
        $Obj->error = "Invalid Characters";
        $Obj->status = 200;
        $list = array();
        array_push($list, $param_list);
        $Obj->params = $list;
        $output = new \stdClass();
        $output->data=(object)$Obj;
        $output->status=200;
        $JSON = json_encode($output);
        echo $JSON;
    }
  
}
function calculateGCD($NList){
    $result = $NList[0];
    for($i=0;$i<count($NList);$i++){
        $result = GCD($NList[$i] , $result); 
        if($result == 1){
           return 1 ;
        }
    }
    return $result; 
}
function calculateLCM($NList){
    $result = $NList[0];
    for($i=0;$i<count($NList);$i++){
        $result = ((($NList[$i] * $result)) /  (GCD($NList[$i], $result)));
    } 
    return $result;
}
function GCD($a,$b){
    if ($a == 0){
        return $b; 
    }
    return GCD($b % $a, $a);
} 

function getNumberList($given_set){
    $split_value = array();
    $tmp = '';
    for ($i = 0; $i < strlen($given_set); $i++){
        if($given_set[$i]===" "){
                 array_push($split_value, (double)$tmp);
            $tmp = '';
        }
        else{
            $tmp .= (string)$given_set[$i];
        }
    }
    if($tmp != ' ' && $tmp != '')
        array_push($split_value,(double)$tmp);
    return $split_value;
}

function validateVarianceNumber($string){
        for ($i = 0; $i < strlen($string); $i++){
            
            if(($string[$i]=='.' || $string[$i]==' ' || ($string[$i]>='0' && $string[$i]<='9')))
            {
                continue;
            }else
            {
                return false;
            }
        }
        return true;
}


?>