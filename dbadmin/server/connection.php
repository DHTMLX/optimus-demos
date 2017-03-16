<?php
require_once("db_common.php");

switch ($_GET["mode"]) {
	
	case "add":
		$id = add_config($_GET["server"],$_GET["user"],$_GET["pass"]);
		echo $id;
		break;
	
	case "delete":
		if (delete_config($_GET["server"])) {
			echo 'host^'.$_GET["server"];
		} else {
			echo "alert('Default host can\\'t be deleted');";
		}
		break;
}
?>