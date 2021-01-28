<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
header('Content-type: application/json');

if ($_SERVER["REQUEST_METHOD"] == "POST") {
  
    $param_xList = $_POST['xList'];
    $param_yList = $_POST['yList'];
    
    if(validateVarianceNumber($param_xList) && validateVarianceNumber($param_yList) && count(getNumberList($param_xList))===count(getNumberList($param_yList))){
        $xList = getNumberList($param_xList);
        $yList = getNumberList($param_yList);
        $sum_xlist=0;
        $sum_ylist=0;
        $sum_xSquare=0;
        $sum_xy=0 ;
        $n=count($xList);
        for ($i = 0; $i < $n; $i++){
            $sum_xlist = $sum_xlist + $xList[$i];
            $sum_ylist = $sum_ylist + $yList[$i];
            $sum_xSquare = $sum_xSquare + ($xList[$i]*$xList[$i]);
            $sum_xy = $sum_xy + ($xList[$i]*$yList[$i]);
        }
        $slope = ($n*$sum_xy-$sum_xlist*$sum_ylist)/($n*$sum_xSquare-$sum_xlist*$sum_xlist);
        $intercept = ($sum_ylist - $slope*$sum_xlist)/$n;
        $equartion= "y = " . (string)($slope)."x + ". (string)($intercept);
        $list = array();
        array_push($list, ($equartion));
      

		$Obj = new \stdClass();
		$Obj->title = "Linear Regression";
		$Obj->language = "PHP";
		$Obj->result = $list;
		$params = array();
        array_push($params, $param_xList);
		array_push($params, $param_yList);
		$Obj->params = $params;
		$Obj->question = "Linear Regression";
		$Obj->status = 200;
      	 $output = new \stdClass();
		$output->data=(object)$Obj;
		$output->status=200;
        $JSON = json_encode($output);
		echo $JSON;

	}else{
		 $Obj = new \stdClass();
		$Obj->title = "Linear Regression";
		$Obj->language = "PHP";
		$Obj->question = "Linear Regression";
		$Obj->error = "Invalid Length";
		$Obj->status = 200;
		$list = array();
        array_push($list, $param_xList);
		array_push($list, $param_yList);
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