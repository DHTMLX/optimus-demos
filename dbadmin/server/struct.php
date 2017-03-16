<?php
require_once("db_common.php");

if (!isset($_GET["id"])) die("[id] parameter missed"); 

//need to be replaced with selected DB later
$details=decode_id($_GET["id"]); 
apply_config($details["host"]);
xml_head();


if ($details["table"]){
	//table view
	db_select($details["db"]);
	echo structure_grid($details["table"]);
	
} else if ($details["db"]){
	//db view
	
} else {
	//host view
	
}


?>