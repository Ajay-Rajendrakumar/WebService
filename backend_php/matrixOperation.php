<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
header('Content-type: application/json');

if ($_SERVER["REQUEST_METHOD"] == "POST") {
  
 	$param_matrix = $_POST['matrix_a'];
	$order = (int)($_POST['order']);
    if(validateMatrix($param_matrix,$order)){
        $matrix = getMatrix(getStringArray($param_matrix),$order);
        $transpose=array();
        $left_lower_diagonal=array();
        $right_lower_diagonal=array();
        $left_upper_diagonal=array();
        $right_upper_diagonal=array();
        $swivel=array();
       
       for ($i = 0; $i < $order; $i++){
            $row = array();
            for ($j = 0; $j < $order ; $j++){
                    array_push($row,$matrix[$j][$i]);
            }
            array_push($transpose,$row);
        }
        for ($i = 0; $i < $order; $i++){
        $lld=array();
        $rld =array();
        $lud=array();
        $rud=array();
        for ($j = 0; $j < $order; $j++){
            if(($i+$j) < ($order-1)){
                array_push($lld,0);
            }else{
               array_push($lld, ($matrix[$i][$j]));
            }
            if($i<$j){
                array_push($rld,0);
            }else{
                array_push($rld, ($matrix[$i][$j]));
            }
            if($i>$j){
               array_push($lud,0);
            }else{
                array_push($lud,$matrix[$i][$j]);
            }
            if(($i+$j) > ($order-1)){
                array_push($rud,0);
            }else{
              array_push($rud,$matrix[$i][$j]);

            }
        }

        array_push($left_lower_diagonal,$lld);
        array_push($right_lower_diagonal,$rld);
        array_push($left_upper_diagonal,$lud);
        array_push($right_upper_diagonal,$rud);

        }
	   $swivel=$matrix;
        for ($i = 0; $i < floor($order/2); $i++){
            $l=$order-1-$i;
            for ($j = 0; $j< $l; $j++){
                $temp=$swivel[$i][$j];
                $swivel[$i][$j] = $swivel[$order-1-$j][$i];
                $swivel[$order-1-$j][$i] = $swivel[$order-1-$i][$order-1-$j];
                $swivel[$order-1-$i][$order-1-$j]=$swivel[$j][$order-1-$i];
                $swivel[$j][$order-1-$i] = $temp;
            }
        }
         $list = array();
        array_push($list, ($transpose));
        array_push($list, ($left_lower_diagonal));
        array_push($list, ($right_lower_diagonal));
        array_push($list, ($left_upper_diagonal));
        array_push($list, ($right_upper_diagonal));
        array_push($list, ($swivel));

		$Obj = new \stdClass();
		$Obj->title = "Matrix Operations";
		$Obj->language = "PHP";
		$Obj->result = $list;
		$params = array();
		array_push($params, $order);
		array_push($params, getStringArray($param_matrix));
		$Obj->params = $params;
		$Obj->question = 3;
		$Obj->status = 200;
      	 $output = new \stdClass();
		$output->data=(object)$Obj;
		$output->status=200;
        $JSON = json_encode($output);
		echo $JSON;

	}else{
		 $Obj = new \stdClass();
		$Obj->title = "Set Operations";
		$Obj->language = "PHP";
		$Obj->question = 3;
		$Obj->error = "Invalid Matrix";
		$Obj->status = 200;
		$list = array();
		array_push($list, $order);
		array_push($list, getStringArray($param_matrix));
		$Obj->params = $list;
		$output = new \stdClass();
		$output->data=(object)$Obj;
		$output->status=200;
		$JSON = json_encode($output);
		echo $JSON;
	}
  
}


function getStringArray($given_set){
    $split_value = array();
    $tmp = '';
    for ($i = 0; $i < strlen($given_set); $i++){
        if($given_set[$i]===" "){
                 array_push($split_value, $tmp);
            $tmp = '';
        }
        else{
            $tmp .= (string)$given_set[$i];
        }
    }
    if($tmp != ' ' && $tmp != '')
        array_push($split_value, $tmp);
    return $split_value;
}

function validateMatrix($string,$order){
    if (count(getStringArray($string)) >= ($order*$order)){
        for ($i = 0; $i < strlen($string); $i++){
            
            if(($string[$i]==' ' || ($string[$i]>='0' && $string[$i]<='9')))
            {
                continue;
            }else
            {
                return false;
            }
        }
        return true;
    }else{
        return false;
    }
}

function getMatrix($given_array,$order){
    $count=0;
    $temp=array();
    $matrix=array();
    for($i = 0; $i < count($given_array); $i++){
        $no=$given_array[$i];
        if($count==$order){
            array_push($matrix, $temp);
            $temp=array();
            array_push($temp, $no);
            $count=1;
        }else{
            array_push($temp, $no);
            $count=$count+1;
        }
    }
    array_push($matrix, $temp);
    return $matrix;
}

?>