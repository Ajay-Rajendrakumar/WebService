<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
header('Content-type: application/json');

if ($_SERVER["REQUEST_METHOD"] == "POST") {
  
 	$param_set_1 = $_POST['set_a'];
	$param_set_2 = $_POST['set_b'];

	$set_a=getSet($param_set_1);
	$set_b=getSet($param_set_2);
  	
	if(validateSet($set_a) && validateSet($set_b)){
        $swap=0;
        if(count($set_a) > count($set_b)){
            $temp= $set_a;
            $set_a=$set_b;
            $set_b=$temp;
            $swap=1;
        }

        $intersection_var=array();
        $union_var=$set_b;
        $minus_a=$set_a ;
        $minus_b=$set_b ;
       
        for ($i = 0; $i < count($set_a); $i++){
            if(includes($set_a[$i],$set_b)!==-1){
                 array_push($intersection_var, $set_a[$i]);
            }
            else{
                 array_push($union_var, $set_a[$i]);
            }
        }
        $union_All=$union_var;
        array_push($union_All,$intersection_var);

        for($i = 0; $i < count($intersection_var); $i++){

            if(includes($intersection_var[$i],$minus_a)!==-1){
                array_splice($minus_a, includes($intersection_var[$i],$minus_a), 1);
            }
            if(includes($intersection_var[$i],$minus_b)!==-1){
                array_splice($minus_b, includes($intersection_var[$i],$minus_b), 1);
            }
        }
	
         $list = array();
        array_push($list, ($union_var));
        array_push($list, ($union_All));
        array_push($list, ($intersection_var));
        if($swap===1){
            array_push($list, ($minus_b));
             array_push($list, ($minus_a));
        }else{
            array_push($list, ($minus_a));
            array_push($list, ($minus_b));
        }
		$Obj = new \stdClass();
		$Obj->title = "Set Operations";
		$Obj->language = "PHP";
		$Obj->result = $list;
		$params = array();
		array_push($params, getSet($param_set_1));
		array_push($params, getSet($param_set_2));
		$Obj->params = $params;
		$Obj->question = 2;
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
		$Obj->question = 2;
		$Obj->error = "Invalid Characters in Set";
		$Obj->status = 200;
		$list = array();
		array_push($list, getSet($param_set_1));
		array_push($list, getSet($param_set_2));
		$Obj->params = $list;
		$output = new \stdClass();
		$output->data=(object)$Obj;
		$output->status=200;
		$JSON = json_encode($output);
		echo $JSON;
	}
  
}


function getSet($given_set){
    $split_value = array();
    $tmp = '';
    for ($i = 0; $i < strlen($given_set); $i++){
        if($given_set[$i]===" "){
            if(includes($tmp,$split_value)==-1){
                array_push($split_value, $tmp);
            }
            $tmp = '';
        }
        else{
            $tmp .= (string)$given_set[$i];
        }
    }
    if($tmp != ' ' && includes($tmp,$split_value)==-1)
        array_push($split_value, $tmp);
    return $split_value;
}

function validateSet($given_set){
    $count=0;
    for ($i = 0; $i < count($given_set); $i++){
        if(($given_set[$i]>='a' && $given_set[$i]<'z') || ($given_set[$i]>='A' && $given_set[$i]<='a') || $given_set[$i]==' ' || ($given_set[$i]>='0' && $given_set[$i]<='9')){
            $count=$count+1;
        }
    }
    if($count==count($given_set))
        {
        return true;
    }
    else{
        return false;
    }
}


function includes($val,$array){
    for ($i = 0; $i < count($array); $i++){
        if($array[$i]===$val){
            return $i;
        }
    }
    return -1;
}
?>