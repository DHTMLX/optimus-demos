<?php
ini_set('max_execution_time', 0);
require_once("php/dhxcmd_data.php");
$_DHXCMD = new dhxCMDMain();
echo $_DHXCMD->upload_file(@$_POST, @$_FILES);
?>