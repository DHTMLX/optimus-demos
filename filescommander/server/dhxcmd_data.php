<?php

@session_start();
require_once("dhxcmd_config.php");

class dhxCMDMain extends dhxCMDConfig {
	
	public function __construct() {
		
		clearstatcache();
		
		$this->cmd_bzip2inputmask = "%".md5(time())."%";
		$this->cmd_bzip2outputmask = "%".md5(time())."%";
		/*
		$this->cmd_bzip2path = str_replace("%i", $this->cmd_bzip2inputmask, str_replace("%o", $this->cmd_bzip2outputmask, $this->cmd_bzip2path));
		*/
		
		mysql_connect($this->db_host, $this->db_user, $this->db_pswd);
		mysql_select_db($this->db_base);
		
		if (!$this->check_session()) {
			$this->generate_session();
			$this->clear_database();
			if (!$this->root_mode){
				$this->read_static_files();
			} 
		}
	}
	
	private function generate_session() {
		$id = -1;
		$key = md5(time());
		$res = mysql_query("INSERT INTO `".$this->prefix."session` (`sessionId`, `sessionKey`, `sessionDate`, `sessionActivity`) VALUES (NULL, '".$key."', NOW(), NOW())");
		if ($res !== false) $id = mysql_insert_id();
		$_SESSION["DHXCMD_ID"] = $id;
		$_SESSION["DHXCMD_KEY"] = $key;
	}
	
	private function clear_database() {
		mysql_query("DELETE FROM `".$this->prefix."files` WHERE DATE_ADD(`recordDate`, INTERVAL 3 DAY) < NOW()");
		$dir = opendir($this->cmd_virtualdir);
		while (false !== ($f = readdir($dir))) {
			// 3days = 3*24*60*60=259200
			if (is_numeric($f)) if (time()-filemtime($this->cmd_virtualdir."/".$f) >= 259200) @unlink($this->cmd_virtualdir."/".$f);
		}
		closedir($dir);
	}
	
	private function check_session() {
		$present = false;
		$res = mysql_query("SELECT `sessionKey` FROM `".$this->prefix."session` WHERE `sessionId`='".$this->p(@$_SESSION["DHXCMD_ID"])."'");
		while ($out = mysql_fetch_object($res)) {
			$present = ($out->sessionKey == @$_SESSION["DHXCMD_KEY"] && strlen(@$_SESSION["DHXCMD_KEY"]) == 32);
			mysql_query("UPDATE `".$this->prefix."session` SET `sessionActivity`=NOW() WHERE `sessionId`='".$this->p(@$_SESSION["DHXCMD_ID"])."'");
		}
		mysql_free_result($res);
		return $present;
	}
	
	// add static folders/files into db
	private function read_static_files($dir=null, $parent_id=0) {
		if ($dir == null) $dir = $this->cmd_basedir;
		$d = opendir($dir);
		while (false !== ($f = readdir($d))) {
			if (in_array($f, array(".", ".."))) continue;
			$t = $dir."/".$f;
			if (is_dir($t)) {
				mysql_query("INSERT INTO `".$this->prefix."files` (`fileId`, `sessionId`, `parentId`, `fileName`, `fileTempName`, `fileIsDir`, `fileDate`, `recordDate`) ".
						"VALUES (NULL, '".$this->p($_SESSION["DHXCMD_ID"])."', '".$this->p($parent_id)."', '".$f."', '', '1', NOW(), NOW())");
				
				$this->read_static_files($t, mysql_insert_id());
			} else {
				mysql_query("INSERT INTO `".$this->prefix."files` (`fileId`, `sessionId`, `parentId`, `fileName`, `fileTempName`, `fileIsDir`, `fileDate`, `recordDate`) ".
						"VALUES (NULL, '".$this->p($_SESSION["DHXCMD_ID"])."', '".$this->p($parent_id)."', '".$f."', '".$this->p($t)."', '0', NOW(), NOW())");
			}
		}
		closedir($d);
	}
	
	/* updated */
	public function read_folder($folder) {
		
		
		$levels = array();
		$files = array();
		$dirs = array();
		
		$add_parent = 0;
		
		if ($this->cmd_perms["folder_list"]) {
				if (!is_numeric($folder)) $folder = 0;
				// return to parent folder
				if ($folder != 0) {
					$res = mysql_query("SELECT * FROM `".$this->prefix."files` WHERE `sessionId`='".$this->p(@$_SESSION["DHXCMD_ID"])."' AND `fileId`='".$this->p($folder)."'");
					while ($out = mysql_fetch_object($res)) {
						array_push($levels, array("..", "", "", strtotime($out->fileDate), "", true, true, false, false, $out->parentId));
					}
					mysql_free_result($res);
				}
				// files/folders
				$res = mysql_query("SELECT * FROM `".$this->prefix."files` WHERE `sessionId`='".$this->p(@$_SESSION["DHXCMD_ID"])."' AND `parentId`='".$this->p($folder)."' ORDER BY `fileIsDir` DESC, `fileName`");
				while ($out = mysql_fetch_object($res)) {
					if ($out->fileIsDir == 1) {
						array_push($dirs, array($out->fileName, "", "", strtotime($out->fileDate), "0700", true, true, false, false, $out->fileId));
					} else {
						$p = strrpos($out->fileName, ".");
						if ($p !== false && $p !== 0) {
							$filename = substr($out->fileName, 0, $p);
							$fileext = substr($out->fileName, $p+1);
						} else {
							$filename = $out->fileName;
							$fileext = "";
						}
						$path = (is_numeric($out->fileTempName)?$this->cmd_virtualdir.$out->fileTempName:$out->fileTempName);
						array_push($files, array($filename, $fileext, @filesize($path), strtotime($out->fileDate), $this->convert_perms(@fileperms($path)), false, @is_readable($path), @is_executable($path), @is_link($path), $out->fileId));
					}
				}
				mysql_free_result($res);
				$add_parent = $folder;
		}
		// merge
		$data = array_merge($levels, $dirs, $files);
		// generate output
		$xml = '<?xml version="1.0"?><rows><userdata name="parent">'.$add_parent.'</userdata>';
		for ($w=0; $w<count($data); $w++) {// ($data as $j=>$q) {
			$q = $data[$w];
			// $img = "imgs/blank.gif";
			$img = "blank.gif";
			$dname = strtolower($q[0]);
			$fname = strtolower($q[1]);
			$array = array(
				"foo" => "bar",
				"bar" => "foo",
			);	
			if ($q[5] == true) {
				if ($q[6] == true) {
					if (file_exists($this->cmd_localpath."codebase/imgs".$this->cmd_separator."themes".$this->cmd_separator.$this->cmd_theme.$this->cmd_separator."folders".$this->cmd_separator.$dname.".gif")) {
						// $img = "imgs/themes/".$this->cmd_theme."/folders/".$dname.".gif";
						$img = $dname.".gif";
					} else {
					//	$img = "imgs/themes/".$this->cmd_theme."/common/folder.gif";
						$img = "folder.gif";
					}
				} else {
					// locked folder
			//		$img = "imgs/themes/".$this->cmd_theme."/common/folder_locked.gif";
					$img = "folder_locked.gif";
				}
			} else {
				if ($q[6] == true) {
					if ($q[7] == false) {
						//if (file_exists($this->cmd_localpath."codebase/imgs".$this->cmd_separator."themes".$this->cmd_separator.$this->cmd_theme.$this->cmd_separator."files".$this->cmd_separator.$fname.".gif")) {
						//	$img = "imgs/themes/".$this->cmd_theme."/files/".$fname.".gif";
						if (file_exists($this->cmd_localpath."codebase/imgs/grid/files/".$fname.".gif")) {
							$img = "files/".$fname.".gif";
						} else {
							// $img = "imgs/themes/".$this->cmd_theme."/common/file.gif";
							 $img = "file.gif";
						}
					} else {
						// executable file
						// $img = "imgs/themes/".$this->cmd_theme."/common/file_exec.gif";
						$img = "file_exec.gif";
					}
				} else {
					// locked file
					// $img = "imgs/themes/".$this->cmd_theme."/common/file_locked.gif";
					$img = "file_locked.gif";
				}
			}
			$xml = $xml.'<row id="'.($q[9]).'"'.($q[6]==true?($q[7]==true?' style="color:#009900;"':''):' style="color:#909090;"').'>'.
					'<cell><![CDATA[codebase/imgs/grid/'.$img.']]></cell>'.
						//'<cell><![CDATA[<img src="'.$img.'" style="width: 18px; height: 18px; border: none;" border="0">]]></cell>'.
					'<cell><![CDATA['.$this->convert_name($q[0]).']]></cell>'.
					'<cell><![CDATA['.$this->convert_name($q[1]).']]></cell>'.
					'<cell><![CDATA['.($q[5]==true?"":$this->pretty_size(sprintf("%u",$q[2]))).']]></cell>'.
					'<cell><![CDATA['.$this->pretty_date($q[3]).']]></cell>'.
					'<cell><![CDATA['.$q[4].']]></cell>'.
					($q[0]==".."?'<userdata name="target">parent</userdata>':'').
					'<userdata name="type">'.($q[5]==true?'folder'.($q[6]==false?'_locked':''):'file'.($q[6]==false?'_locked':'')).'</userdata>'.
				'</row>';
		}
		$xml = $xml.'</rows>';
		
		return $xml;
	}
	
	/* updated */
	public function create_folder($name, $folder, $pane) {
		
		$p = false;
		
		if ($this->cmd_perms["folder_create"]) {
			if (!is_numeric($folder)) $folder = 0;
			mysql_query("INSERT INTO `".$this->prefix."files` (`fileId`, `sessionId`, `parentId`, `fileName`, `fileIsDir`, `fileDate`, `recordDate`) VALUES (NULL, '".$this->p(@$_SESSION["DHXCMD_ID"])."', '".$this->p($folder)."', '".$this->p($name)."', '1', NOW(), NOW())");
			$p = (mysql_affected_rows() > 0);
		}
		
		$xml = '<?xml version="1.0"?><response action="createFolder" state="'.($p===true?"good":"bad").'" pane="'.$pane.'"/>';
		return $xml;
	}
	
	/* updated */
	public function upload_file($post, $files) {
		
		$stat = "bad";
		$pane = $post["pane"];
		
		if ($this->cmd_perms["file_upload"]) {
			
			
			if ($_FILES["file"]["error"] == 0) {
				
				$res = mysql_query("INSERT INTO `".$this->prefix."files` (`fileId`, `sessionId`, `parentId`, `fileName`, `fileTempName`, `fileIsDir`, `fileDate`, `recordDate`) ".
							"VALUES (NULL, '".$this->p($_SESSION["DHXCMD_ID"])."', '".$this->p($_POST["path"])."', '".$_FILES["file"]["name"]."', '', '0', NOW(), NOW())");
				
				if ($res == true) {
					$id = mysql_insert_id();
					if (move_uploaded_file($_FILES["file"]["tmp_name"], $this->cmd_virtualdir.$id)) {
						@chmod($filename, 0644);
						$stat = "good";
						mysql_query("UPDATE `".$this->prefix."files` SET `fileTempName`='".$id."' WHERE `fileId`='".$id."'");
					} else {
						mysql_query("DELETE FROM `".$this->prefix."files` WHERE `fileId`='".$id."'");
					}
				}
			}
		}
		
		$data = "<SCRIPT> parent.dhxCMD._doOnFileUploaded('$stat','$pane'); </SCRIPT>";
		return $data;
	}
	
	/* updated, bzip should be improved */
	public function download_file($id, $bzip2) {
		
		$data = array(false);
		
		if ($this->cmd_perms["file_download"]) {
			
			$res = mysql_query("SELECT * FROM `".$this->prefix."files` WHERE `sessionId`='".$this->p(@$_SESSION["DHXCMD_ID"])."' AND `fileId`='".$this->p($id)."' AND `fileIsDir`='0'");
			while ($out = mysql_fetch_object($res)) {
				
				$p = (is_numeric($out->fileTempName)?$this->cmd_virtualdir.$out->fileTempName:$out->fileTempName);
				
				if (file_exists($p)) {
					
					$data[0] = $out->fileName;
					$data[1] = filesize($p);
					$data[2] = $p;
				}
				
			}
			mysql_free_result($res);
				
		}
		
		if ($data[0] === false) {
			
			header('Content-Disposition: attachment; filename="not found"');
			header('Content-Length: 0');
			
		} else {
			
			if ($bzip2 == "yes") {
				$t = "/tmp/".md5(time());
				$bz = bzopen($t, "w");
				bzwrite($bz, file_get_contents($data[2]), filesize($data[2]));
				bzclose($bz);
				$data[0] = $data[0].".bzip";
				$data[1] = filesize($t);
				$data[2] = $t;
			}
			
			$ext = pathinfo($data[2]);
			$ext = $ext['extension'];
			
			if (in_array($ext, array("gif","jpg","png","jpeg"))) {
				header("Content-type: image/".$ext);
			} else if (in_array($ext, array("html","shtml","php","css","txt","xml"))) {
				header("Content-type: text/".$ext);
			} else {
				header("Content-type: application/".$ext);
			}

			header('Content-Disposition: attachment; filename="'.$data[0].'"');
			header('Content-Length: '.$data[1]);
			
			if ($this->cmd_limitdownloadspeed == true) {
				$f = fopen($data[2], "r");
				while (!feof($f)) {
					$d = fread($f, $this->cmd_downloadspeedkb*1024);
					print_r($d);
					flush();
					sleep(1);
				}
				fclose($f);
			} else {
				print_r(file_get_contents($data[2]));
			}
			
			@unlink(@$t);
		}
		
	}
	
	
	/* updated */
	public function remove_file($id, $folder, $folder2, $pane, $is_folder) {
		
		$state = "bad";
		
		if ($this->cmd_perms["".($is_folder=="yes"?"folder":"file")."_remove"]) {
			
			$files = $this->get_file_list($id);
			if (in_array($folder2, $files)) $folder2 = $folder; else $folder2 = "ignore";
			$res = mysql_query("DELETE FROM `".$this->prefix."files` WHERE `fileId` IN (".implode(",",$files).")");
			if ($res == true) $state = "good";
		}
		
		$xml = '<?xml version="1.0"?><response action="removeFile" state="'.$state.'" pane="'.$pane.'" path="'.$folder.'" path2="'.$folder2.'"/>';
		return $xml;
	}
	
	/* added */
	private function get_file_list($id) {
		$files = array($this->p($id));
		$res = mysql_query("SELECT * FROM `".$this->prefix."files` WHERE `sessionId`='".$this->p(@$_SESSION["DHXCMD_ID"])."' AND `parentId`='".$this->p($id)."'");
		while ($out = mysql_fetch_object($res)) {
			if ($out->fileIsDir == 1) {
				$files = array_merge($files, $this->get_file_list($out->fileId));
			} else {
				array_push($files, $out->fileId);
			}
		}
		mysql_free_result($res);
		return $files;
	}
	
	/* updated */
	public function copy_file($file, $parent, $pane, $is_move, $is_folder) {
		
		
		$state = "bad";
		
		if ($this->cmd_perms["".($is_folder=="yes"?"folder":"file")."_".($is_move=="yes"?"move":"copy")]) {
		
			$files = $this->get_file_list($file);
			$fileParent = null;
			
			$res = mysql_query("SELECT `parentId` FROM `".$this->prefix."files` WHERE `sessionId`='".$this->p(@$_SESSION["DHXCMD_ID"])."' AND `fileId`='".$this->p($file)."'");
			while ($out = mysql_fetch_object($res)) $fileParent = $out->parentId;
			mysql_free_result($res);
			
			if ($fileParent != null && !in_array($parent, array_merge($files, array($fileParent)))) {
				// copy/move
				$new_parents = array($fileParent=>$parent);
				$res = mysql_query("SELECT * FROM `".$this->prefix."files` WHERE `sessionId`='".$this->p(@$_SESSION["DHXCMD_ID"])."' AND `fileId` IN (".implode(",",$files).")");
				while ($out = mysql_fetch_object($res)) {
					$r2 = mysql_query("INSERT INTO `".$this->prefix."files` (`fileId`, `sessionId`, `parentId`, `fileName`, `fileTempName`, `fileIsDir`, `fileDate`, `recordDate`) ".
											"VALUES (NULL, '".$out->sessionId."', '".$new_parents[$out->parentId]."', '".$out->fileName."', '".$out->fileTempName."', '".$out->fileIsDir."', '".$out->fileDate."', '".$out->recordDate."')");
					$new_parents[$out->fileId] = mysql_insert_id();
				}
				mysql_free_result($res);
				
				if ($is_move == "yes") mysql_query("DELETE FROM `".$this->prefix."files` WHERE `sessionId`='".$this->p(@$_SESSION["DHXCMD_ID"])."' AND `fileId` IN (".implode(",",$files).")");
				$state = "good";
			} else {
				$state = "bad";
			}
			
		}
		
		$xml = '<?xml version="1.0"?><response action="copyFile" state="'.$state.'" pane="'.$pane.'" isMove="'.$is_move.'"/>';
		return $xml;
	}
	
	/* updated */
	public function folder_details($folder) {
		
		$files = 0;
		$folders = 0;
		$size = 0;
			
		if ($this->cmd_perms["folder_details"]) {
			
			$file_list = $this->get_file_list($folder);
			
			$res = mysql_query("SELECT COUNT(`fileId`) AS `filesCount` FROM `".$this->prefix."files` WHERE `sessionId`='".$this->p(@$_SESSION["DHXCMD_ID"])."' AND `fileId` IN (".implode(",",$file_list).") AND `fileIsDir`='1'");
			while ($out = mysql_fetch_object($res)) $folders = $out->filesCount;
			mysql_free_result($res);
			
			$res = mysql_query("SELECT COUNT(`fileId`) AS `filesCount` FROM `".$this->prefix."files` WHERE `sessionId`='".$this->p(@$_SESSION["DHXCMD_ID"])."' AND `fileId` IN (".implode(",",$file_list).") AND `fileIsDir`='0'");
			while ($out = mysql_fetch_object($res)) $files = $out->filesCount;
			mysql_free_result($res);
			
			for ($q=0; $q<count($file_list); $q++) $size += @filesize($this->cmd_virtualdir.$file_list[$q]);
			
		}
		
		$xml = '<?xml version="1.0"?><response action="folderDetails" files="'.$files.'" folders="'.$folders.'" size="'.$this->pretty_size($size).'">'.implode(",",$file_list).'</response>';
		return $xml;
		
	}
	
	private function pretty_size($size) {
		$bytes = array('b','Kb','Mb','Gb','Tb');
		foreach ($bytes as $val) if ($size > 1024) $size = $size/1024; else break;
		$size = round($size, $this->cmd_prettysize_float)." ".$val;
		return $size;
	}
	
	private function pretty_date($t) {
		return @date("m/d/Y H:i", $t);
	}
	
	private function convert_name($t, $back=false) {
		if (!$this->cmd_convertnames) return $t;
		return iconv(($back?$this->cmd_convertto:$this->cmd_convertfrom), ($back?$this->cmd_convertfrom:$this->cmd_convertto), $t);
	}
	
	private function convert_perms($perms) {
		$info = substr(sprintf('%o', $perms), -4);
		return $info;
	}
	
	public function print_config_for_js() {
		
		echo "// global configuration\n\n";
		echo "\t\tvar dhxCMDConfig = {};\n";
		echo "\t\tdhxCMDConfig['server'] = '".addslashes($this->cmd_js_server_path)."';\n";
		echo "\t\tdhxCMDConfig['sep'] = '".addslashes($this->cmd_separator)."';\n\n";
		echo "\t\tdhxCMDConfig['rmode'] = ".($this->root_mode?"true":"false").";\n\n";
		echo "\t\t// action permissions\n";
		echo "\t\tvar dhxCMDPerms = {};\n";
		foreach ($this->cmd_perms as $k=>$v) { echo "\t\tdhxCMDPerms['".str_replace("_", "", $k)."'] = ".($v?"true":"false").";\n"; }
		echo "\n";
	
	}
	
}

?>