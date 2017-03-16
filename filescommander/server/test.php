<?php

header("Content-Type: text/plain");

// $pattern = array("/((\\|\/)|(^))([\.]*(\\|\/))*/i");
$pattern = array("/((\\\\|\\/)|(^))([\\.]*(\\\\|\\/))*/");
$replacement = array("/");
$string = "\..\..\\\\\\\\.s.\\\\\\\\/...//.../..";

echo $string."\n";
echo preg_replace($pattern, $replacement, $string)."\n";


if (preg_match("/^(\.)+$/", ".svn")===1) {
	echo "skip";
} else {
	echo "add";
}

//require_once("php/dhxcmd_config.php");
//
//class dhxCMDMain extends dhxCMDConfig {
//	public function __construct() {
//		echo $this->cmd_localpath;
//	}
//}
//
//$n = new dhxCMDMain();

?>