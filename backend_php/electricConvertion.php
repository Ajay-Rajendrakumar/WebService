<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
header('Content-type: application/json');

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $amp = ($_POST['amp']);
    $volt = ($_POST['volt']);
    $watt = ($_POST['watt']);
    $time = ($_POST['time']);
    $kva = ($_POST['kva']);
    $kw = ($_POST['kw']);
    $joule = ($_POST['joule']);
    $va = ($_POST['va']);
    $wh = ($_POST['wh']);
    $mah =($_POST['mah']);
    $Ginput = array();
    array_push($Ginput,$amp );
    array_push($Ginput, $volt);
    array_push($Ginput, $watt);
    array_push($Ginput, $time);
    array_push($Ginput, $kw);
    array_push($Ginput, $kva);
    array_push($Ginput, $va);
    array_push($Ginput, $joule);
    array_push($Ginput, $mah);
    array_push($Ginput, $wh);
    for($i=0;$i<2;$i++){
        if(empty($volt)){
            $volt=Cvolt($amp,$watt,$va,$wh,$mah,$kva);
        }
        if(empty($watt)){
            $watt=Cwatt($amp,$volt,$kw,$wh,$time,$joule);
        }
        if(empty($amp)){
            $amp=Camp($volt,$watt,$va,$kva);
        }
        if(empty($kw)){
            $kw=Ckw($watt);
        }
        if(empty($joule)){
            $joule=Cjoule($time,$watt);
        }
        if(empty($kva)){
            $kva=Ckva($volt,$amp);
        }
        if(empty($va)){
            $va=Cva($volt,$amp);
        }
        if(empty($wh)){
            $wh=Cwh($watt,$time,$mah,$volt);
        }
        if(empty($mah)){
            $mah=CmAh($wh,$volt);
        }
        if(empty($time)){
            $time=Ctime($wh,$watt,$joule);
        }
    }
    $list=array();
    array_push($list,$amp );
    array_push($list, $volt);
    array_push($list, $watt);
    array_push($list, $time);
    array_push($list, $kw);
    array_push($list, $kva);
    array_push($list, $va);
    array_push($list, $joule);
    array_push($list, $mah);
    array_push($list, $wh);
    $Obj = new \stdClass();
    $Obj->title = "Electric Convertion";
    $Obj->language = "PHP";
    $Obj->result = $list;
    $Obj->params = $Ginput;
    $Obj->question = "Electric Convertion";
    $Obj->status = 200;
     $output = new \stdClass();
    $output->data=(object)$Obj;
    $output->status=200;
    $JSON = json_encode($output);
    echo $JSON;
}
function Cvolt($amp,$watt,$va,$wh,$mah,$kva){
    if(($amp) && ($watt)){
        return ((float)($watt)/(float)($amp));
    }
    if(($va) && ($amp)){
        return ((float)($va)/(float)($amp));
    }
    if(($kva) && ($amp)){
        return ((float)($kva)/(1000*(float)($amp)));
    }
    if(($wh) && ($mah)){
        return ((float)($wh)*1000)/(float)($mah);
    }
    return "";
}
function Cwatt($amp,$volt,$kw,$wh,$time,$joule){
    if(($amp) && ($volt)){
        return ((float)($amp)*(float)($volt));
    }
    if(($kw)){
        return ((float)($kw)/1000);
    }
    if(($wh) && ($time)){
        return ((float)($wh)/(float)($time));
    }
    if(($joule) && ($time)){
        return ((float)($joule)/((float)($time)*3600));
    }
    return "";
}
function Camp($volt,$watt,$va,$kva){
    if(($watt) && ($volt)){
        return ((float)($watt)/(float)($volt)) ;
    }
    if(($va) && ($volt)){
        return ((float)($va)/(float)($volt));
    }
    if(($kva) && ($volt)){
        return ((float)($kva)/(1000*(float)($volt)));
    }
    return "";
}
function Ckw($watt){
    if(($watt)){
        return ((float)($watt)*1000); 
    }
    return "";
}
function Cjoule($time,$watt){
    if(($watt) && ($time)){
        return ((float)($watt)*((float)($time)*3600));
    }
    return "";
}
function Cva($volt,$amp){
    if(($volt) && ($amp)){
        return((float)($volt)*(float)($amp));
    }
    return "";
}
function Ckva($volt,$amp){
    if(($volt) && ($amp)){
        return (1000*((float)($volt)*(float)($amp)));
    }
    return "";
}
function Cwh($watt,$time,$mAh,$volt){
    if(($watt) && ($time)){
        return ((float)($watt)*(float)($time));
    }
    if(($mAh) && ($volt)){
        return ((float)($mAh) * (float)($volt) / 1000);
    }
    return "";
}
function CmAh($wh,$volt){
    if(($wh) && ($volt)){
        return (1000 * (float)($wh) / (float)($volt)); 
    }
    return "";
}
function Ctime($wh,$watt,$joule){
    if(($wh) && ($watt)){
        return ((float)($wh)/(float)($watt));
    }
    if(($joule) && ($watt)){
        return ((float)($joule)/((float)($watt)*3600));
    }
    return "";
}


?>