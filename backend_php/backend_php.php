<?php
$object = ['Name' => 'Nachiket Panchal', 'Link' => 'errorsea.com', 'data' => ['Key1' => 'Value1', 'Key2' => 'Value2', 'Key3' => 'Value3']];
header("content-type: application/json");
echo json_encode($object); ?>
