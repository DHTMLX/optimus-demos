<?php

class dhxCMDConfig {
	// database

	protected $db_host = "localhost";
	protected $db_user = "root";
	protected $db_pswd = "";
	protected $db_base = "dhtmlx";
	
	
	// table prefix
	protected $prefix = "dhxcmd_";
	
	// limit download speed, kbps
	public $cmd_limitdownloadspeed = false;
	public $cmd_downloadspeedkb = 20;

	// server-path where app is stored
	protected $cmd_localpath = "D:/work/xampp2/htdocs/demos/dhtmlxFilesCommander/";//"c:/public_html/work/dhx4-tools/demoApps/dhtmlxFilesCommander/";

	// server-path of shared dir
	protected $cmd_basedir = "D:/work/xampp2/htdocs/demos/dhtmlxFilesCommander/codebase/";//"c:/public_html/work/dhx4-tools/demoApps/_share/";
	
	// server-path of virtual dir
	protected $cmd_virtualdir =  "D:/work/xampp2/htdocs/demos/dhtmlxFilesCommander/codebase/_virtual/";//c:/public_html/work/dhx4-tools/demoApps/dhtmlxFilesCommander/_virtual/";
	
	// if true files/folders will created on harddrive, if false - folders in database, files in virtual drive
	protected $root_mode = false;
	
	// dhtmlxgrid icons theme
	protected $cmd_theme = "dhx";
	
	// folder separator in path
	protected $cmd_separator = "/";
	
	// count of numbers in float pretty-formatted sizes
	protected $cmd_prettysize_float = 1;
	
	// name convertation (server-side to browser)
	protected $cmd_convertnames = false;
	protected $cmd_convertfrom = "WINDOWS-1251";
	protected $cmd_convertto = "UTF-8";
	
	// server-side, will used in js
	protected $cmd_js_server_path = "server/dhxcmd_ajax.php";
	
	// what user can do?
	protected $cmd_perms = array("folder_list"		=> true,
				     "folder_create"		=> true,
				     "folder_remove"		=> true,
				     "folder_details"		=> true,
				     "folder_copy"		=> true,
				     "folder_move"		=> true,
				     "file_upload"		=> false,
				     "file_download"		=> true,
				     "file_download_bzipped"	=> true,
				     "file_remove"		=> true,
				     "file_copy"		=> true,
				     "file_move"		=> true);
	
	protected function p($s) {
		if (!get_magic_quotes_gpc()) return mysql_real_escape_string($s);
		return $s;
	}
}

?>