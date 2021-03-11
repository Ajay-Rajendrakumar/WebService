<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
header('Content-type: application/json');
class LZW
{
    function compress($unc) {
        $i;$c;$wc;
        $w = "";
        $dictionary = array();
        $result = array();
        $dictSize = 256;
        for ($i = 0; $i < 256; $i += 1) {
            $dictionary[chr($i)] = $i;
        }
        for ($i = 0; $i < strlen($unc); $i++) {
            $c = $unc[$i];
            $wc = $w.$c;
            if (array_key_exists($w.$c, $dictionary)) {
                $w = $w.$c;
            } else {
                array_push($result,$dictionary[$w]);
                $dictionary[$wc] = $dictSize++;
                $w = (string)$c;
            }
        }
        if ($w !== "") {
            array_push($result,$dictionary[$w]);
        }
        return implode(",",$result);
    }
 
    function decompress($com) {
        $com = explode(",",$com);
        $i;$w;$k;$result;
        $dictionary = array();
        $entry = "";
        $dictSize = 256;
        for ($i = 0; $i < 256; $i++) {
            $dictionary[$i] = chr($i);
        }
        $w = chr($com[0]);
        $result = $w;
        for ($i = 1; $i < count($com);$i++) {
            $k = $com[$i];
            if ($dictionary[$k]) {
                $entry = $dictionary[$k];
            } else {
                if ($k === $dictSize) {
                    $entry = $w.$w[0];
                } else {
                    return null;
                }
            }
            $result .= $entry;
            $dictionary[$dictSize++] = $w . $entry[0];
            $w = $entry;
        }
        return $result;
    }
}
if ($_SERVER["REQUEST_METHOD"] == "POST") {
  
    $msg = $_POST['message'];
    $lzw = new LZW();
    $com = $lzw->compress($msg);
    $dec = $lzw->decompress($com);
    $list = array();
    array_push($list,$com);  
    array_push($list,$dec);  
    $Obj = new \stdClass();
    $Obj->title = "Lempel_Ziv_Welch";
    $Obj->language = "PHP";
    $Obj->result = $list;
    $params = array();
    array_push($params, $msg);
    $Obj->params = $params;
    $Obj->question = "Lempel_Ziv_Welch";
    $Obj->status = 200;
     $output = new \stdClass();
    $output->data=(object)$Obj;
    $output->status=200;
    $JSON = json_encode($output);
    echo $JSON;
}



?>