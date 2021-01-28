<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
header('Content-type: application/json');

if ($_SERVER["REQUEST_METHOD"] == "POST") {
  
 	$param_list = $_POST['Numberlist'];
    if(validateVarianceNumber($param_list)){
        $Numberlist = getNumberList($param_list);
       $mean=0;
        $standard_deviation=0;
        $variance=0;
        $sum=0;
        $n=count($Numberlist);

       
       for ($i = 0; $i < $n; $i++){
           $sum = $sum + $Numberlist[$i];
        }
        $mean= $sum/ $n;
        for ($i = 0; $i < $n; $i++){
                $standard_deviation =$standard_deviation + pow($Numberlist[$i] - $mean, 2);
        }
        $variance = $standard_deviation/ $n;
        $standard_deviation=sqrt($variance);
        $list = array();
        array_push($list, ($variance));
        array_push($list, ($standard_deviation));
       

		$Obj = new \stdClass();
		$Obj->title = "Variance and Standard Deviation";
		$Obj->language = "PHP";
		$Obj->result = $list;
		$params = array();
		array_push($params, $param_list);
		$Obj->params = $params;
		$Obj->question = "Variance and Standard Deviation";
		$Obj->status = 200;
      	 $output = new \stdClass();
		$output->data=(object)$Obj;
		$output->status=200;
        $JSON = json_encode($output);
		echo $JSON;

	}else{
		 $Obj = new \stdClass();
		$Obj->title = "Variance and Standard Deviation";
		$Obj->language = "PHP";
		$Obj->question = "Variance and Standard Deviation";
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