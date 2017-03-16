<?php
require_once("db_common.php");

if (!isset($_GET["id"])) {
	xml_head();
	//connection list
	echo get_connection_xml();
	die();
}

//need to be replaced with selected DB later
$data=decode_id($_GET["full_id"]);
xml_head();
echo "<tree id='{$_GET['id']}'>";

if(!apply_config($data["host"])){
	echo "<item id='db^error' aCol='red' text='Connection error' /></tree>";
	die();
};



$details=explode("^",$_GET["id"]);  // first part - type of entity, second part entity name
switch ($details[0]){
	case "host":
		echo get_databases_xml();
		break;
	case "db":
		db_select($details[1]);
		echo get_tables_xml();
		break;
}

echo "</tree>";
?>