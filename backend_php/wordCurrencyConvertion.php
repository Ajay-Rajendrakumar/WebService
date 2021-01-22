<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
header('Content-type: application/json');

if ($_SERVER["REQUEST_METHOD"] == "POST") {
  
 	$currency = $_POST['currency'];

    if(validateNumber($currency)){
        $words=["","","Hundred","Thousand","Lakh","Crore"];
        $limit = [2,2,1,2,2];
        $value=(int)($currency);
        $count=0;
        $result=array();
        while ($value != 0){
            if(strlen((string)($value)) >=$limit[$count] && $count!=1){
                $r= $value % 100;
                $value=(int)($value/100); 
            }
            else{
                $r=$value % 10;
                $value=(int)($value/10);
            }
            $count=$count+1;
            array_push($result, (currency_con((string)($r)) . " " . $words[$count]));
        }
        $ans="";
        for($i = count($result)-1; $i >=0 ; $i--){
            $ans= $ans . " ". $result[$i] . " ";
        }
         $list = array();
        array_push($list, ($ans));
    
		$Obj = new \stdClass();
		$Obj->title = "Word Convertion";
		$Obj->language = "PHP";
		$Obj->result = $list;
		$params = array();
		array_push($params, $currency);
		$Obj->params = $params;
		$Obj->question = 4;
		$Obj->status = 200;
      	 $output = new \stdClass();
		$output->data=(object)$Obj;
		$output->status=200;
        $JSON = json_encode($output);
		echo $JSON;

	}else{
		 $Obj = new \stdClass();
		$Obj->title = "Word Convertion";
		$Obj->language = "PHP";
		$Obj->question = 4;
		$Obj->error = "Invalid Number";
		$Obj->status = 200;
		$list = array();
		array_push($list, $currency);
		$Obj->params = $list;
		$output = new \stdClass();
		$output->data=(object)$Obj;
		$output->status=200;
		$JSON = json_encode($output);
		echo $JSON;
	}
  
}


function currency_con($num){
    $ones_digit = ["zero","one","two","three","four","five","six","seven","eight","nine"];
    $two_digit=["","ten","eleven","twelve","thirteen","fourteen","fifteen","sixteen","seventeen","eighteen","nineteen"];
    $ten_digit=["","","twenty","thirty","forty","fifty","sixty","seventy","eighty","ninenty"];
    $currency_word = "";
    $l = (strlen($num));
    if($l===1){
        $currency_word = $currency_word . $ones_digit[(int)($num[0])];
    }else{
        $x=0;
        while($x < strlen($num)){
            if ($l <= 2 ){
                if ((int)($num[$x])== 1){
                    $sum = ((int)($num[$x])+   (int)($num[$x+1]));
                    $currency_word = $currency_word . $two_digit[$sum] . " ";
                    break;
                
                }else if ((int)($num[$x]) == 2 &&  (int)($num[$x + 1]) == 0){
                    $currency_word = $currency_word . "twenty ";
                    break;
                    
                }else{
                    $i = (int)($num[$x]) ;
                    if($i > 0){
                        $currency_word = $currency_word . $ten_digit[$i] . " ";
                    }else{
                        $currency_word = $currency_word . " ";
                    }
                    $x =$x+ 1;
                    if((int)($num[$x])!= 0){
                        $currency_word = $currency_word . $ones_digit[(int)($num[$x])] . " ";
                    }
                }
              $x =$x+ 1;
            }
        }
}
return $currency_word;
}

function validateNumber($string){
        if(strlen($string)>9){
            return false;
        }
        for ($i = 0; $i < strlen($string); $i++){   
            if(($string[$i]>='0' && $string[$i]<='9'))
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