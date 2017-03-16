<?php

ini_set("max_execution_time", 600);

require_once("dhxcmd_data.php");

$_DHXCMD = new dhxCMDMain();

switch (@$_GET["action"]) {
	
	case "readFolder":
		header("Content-Type: text/xml");
		echo $_DHXCMD->read_folder(@$_GET["folder"]);
		break;

	case "loadBar":
		header("Content-Type: text/xml");
		echo $_DHXCMD->load_drive_buttons();
		break;
	
	case "createFolder":
		header("Content-Type: text/xml");
		echo $_DHXCMD->create_folder(@$_GET["folderName"], @$_GET["path"], @$_GET["pane"]);
		break;
	
	case "removeFile":
		header("Content-Type: text/xml");
		echo $_DHXCMD->remove_file(@$_GET["id"], @$_GET["path"], @$_GET["path2"], @$_GET["pane"], @$_GET["isFolder"]);
		break;
	
	case "copyFile":
		header("Content-Type: text/xml");
		echo $_DHXCMD->copy_file(@$_GET["id"], @$_GET["path"], @$_GET["pane"], @$_GET["isMove"], @$_GET["isFolder"]);
		break;
	
	case "folderDetails":
		header("Content-Type: text/xml");
		echo $_DHXCMD->folder_details(@$_GET["path"]);
		break;
	
	case "downloadFile":
		$_DHXCMD->download_file(@$_GET["id"], @$_GET["bzip2"]);
		break;
}

?>