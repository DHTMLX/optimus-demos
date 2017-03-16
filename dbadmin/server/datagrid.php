<?php
if (isset($_GET['struct'])){
	require_once("struct.php");
	die();
}
require_once("db_common.php");

if (!isset($_GET["id"])) die("[id] parameter missed");
if (isset($_GET["posStart"])) $pos=$_GET["posStart"]; else $pos=0;
if (isset($_GET["count"])) $count=$_GET["count"]; else $count=100;

$details=decode_id($_GET["id"]);
//need to be replaced with selected DB later
apply_config($details["host"]);

xml_head();

if ($details["table"]){
	//table view
	db_select($details["db"]);
	if ($pos==0) echo table_grid_header($details["table"],$pos); else echo table_grid_enmpty_header($pos);
	echo table_grid_data($details["table"],$pos,$count);
} else if ($details["db"]){
	//db view
	
} else {
	//host view
	
}

echo "</rows>";
?>