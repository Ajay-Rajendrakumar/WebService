<?php

class API 
{
public $data = "";
const DB_SERVER = "localhost";
const DB_USER = "Database_Username";
const DB_PASSWORD = "Database_Password";
const DB = "Database_Name";

private $db = NULL;

public function __construct()
{


}


//Public method for access api.
//This method dynmically call the method based on the query string
public function processApi()
{
$func = strtolower(trim(str_replace("/","",$_REQUEST['request'])));
if((int)method_exists($this,$func) > 0)
$this->$func();
else
$this->response('',404);
// If the method not exist with in this class, response would be "Page not found".
}

private function login()
{
	return json_encode("Hello");
}

private function users()
{
	return json_encode("user");
}


//Encode array into JSON
private function json($data)
{
if(is_array($data)){
return json_encode($data);
}
}
}

// Initiiate Library
$api = new API;
$api->processApi();
?>
?>