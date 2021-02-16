<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
header('Content-type: application/json');
$global_node_res=array();
class node {
  public $freq;
  public $char;
  public $left;
  public $right;
  public $huff;
  function set_val($freq,$char,$left,$right) {
    $this->freq = $freq;
    $this->char = $char;
    $this->left = $left;
    $this->right = $right;
    $this->huff = "";
  }
  function get_freq() {
    return $this->freq;
  }
  function get_char() {
    return $this->char;
  }
  function get_huff() {
    return $this->huff;
  }
  function get_left() {
    return $this->left;
  }
  function get_right() {
    return $this->right;
  }
}

if ($_SERVER["REQUEST_METHOD"] == "POST") {
  
    $msg = $_POST['huffman_message'];
    $freq = array();  
    $huffman_message=$msg;
    for($i = 0; $i < strlen($msg); $i++) {  
        array_push($freq, 1);  
        for($j = $i+1; $j <strlen($msg); $j++) {  
            if($msg[$i] == $msg[$j]) {  
                $freq[$i]++;  
                $msg[$j] = '0';  
            }  
        }  
    }  
    $h_char=array();
    $h_freq=array();
    for($i = 0; $i < count($freq); $i++) {  
        if($msg[$i] != ' ' && $msg[$i] != '0'){  
            array_push($h_char, $msg[$i]);  
            array_push($h_freq, $freq[$i]);  
        }  
    }  

    $nodes=array();
    for($i = 0; $i < count($h_char); $i++) {  
            $Node = new node();
            $Node->set_val($h_freq[$i],$h_char[$i],null,null);
            array_push($nodes,$Node);  
    }
    while (count($nodes)>1) {
        usort($nodes,function($first,$second){
            return $first->freq > $second->freq;
        });
        $left = new node();
        $left = $nodes[0];
        $right = new node();
        $right = $nodes[1];
        $left->huff = 0;
        $right->huff = 1;
        $newNode = new node();
        $newNode->set_val($left->get_freq()+$right->get_freq(), $left->get_char().$right->get_char(), $left, $right);
        array_splice($nodes, 0, 2);  
        array_push($nodes,$newNode);  
    }
    traverse($nodes[0],"");
    $list = array();
    array_push($list,$global_node_res);  
    $Obj = new \stdClass();
    $Obj->title = "huffman_technique";
    $Obj->language = "PHP";
    $Obj->result = $list;
    $params = array();
    array_push($params, $huffman_message);
    $Obj->params = $params;
    $Obj->question = "huffman_technique";
    $Obj->status = 200;
     $output = new \stdClass();
    $output->data=(object)$Obj;
    $output->status=200;
    $JSON = json_encode($output);
    echo $JSON;
}

function traverse($node,$val){
    global $global_node_res;
    $newVal = $val . (string)($node->get_huff());
    if($node->get_left()){
        traverse($node->get_left(), $newVal);
    }
    if($node->get_right()){
        traverse($node->get_right(), $newVal);
    }
    if($node->get_left()==null && $node->get_right()==null){
        array_push($global_node_res, $node->get_char()."->".$newVal);
    }
}


?>