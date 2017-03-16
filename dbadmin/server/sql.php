<?php
require_once("db_common.php");
if (!isset($_POST["id"])) die("[db] parameter missed"); 
if (!isset($_POST["sql"])) die("[db] parameter missed"); 



//need to be replaced with selected DB later
$details=decode_id($_POST["id"]);
apply_config($details["host"]);
xml_head();


if ($details["db"]) db_select($details["db"]); else die("DB not defined");

echo table_grid_enmpty_header(0);
echo sql_data($_POST["sql"]);


echo "</rows>";
?>