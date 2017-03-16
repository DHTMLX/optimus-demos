<?php
global $dbh;

function apply_config($index){
	$handle = fopen("config.csv", "r");
	while (($data = fgetcsv($handle, 1000, ",")) !== FALSE) {
		if ($data[0] == $index){
			$res=db_connect($data);
			fclose($handle);
			return $res;
		}
	}
	fclose($handle);
	die("Configuration not found");
}

function get_connection_xml(){
	$str="<tree id='0'>";
	$handle = fopen("config.csv", "r");
	while (($data = fgetcsv($handle, 1000, ",")) !== FALSE) {
		$str.="<item id='host^".$data[0]."' child='true' im0='server.gif' im1='server.gif' im2='server.gif'><itemtext><![CDATA[".$data[1]."]]></itemtext></item>";
	}
	fclose($handle);
	$str.="</tree>";
	return $str;
}

function csv_safe($data){
	return '"'.str_replace('"','""',$data).'"';
}

function add_config($server,$user,$pass){
	$id=time();
	$data=file_get_contents("config.csv");
	file_put_contents("config.csv",$data."\n".implode(",",array(csv_safe($id),csv_safe($server),csv_safe($user),csv_safe($pass))));
	return $id;
}

function delete_config($server){
	$id=time();
	if ($server==0) return false;
	$data=file_get_contents("config.csv");
	file_put_contents("config.csv",preg_replace('/\n"'.$server.'[^\n]*/',"",$data));
	return true;
}

function db_connect($data){
	global $dbh;
	try {
		$dbh = new PDO("mysql:host=${data[1]}", $data[2], $data[3]);
	} catch(Exception $e){
		return null;
	}
	return $dbh;
}

function db_select($name){
	global $dbh;
	$dbh->query("use $name");
}

function query($sql){
	global $dbh;
	$res=$dbh->query($sql);
	if (!$res) die("Incorrect SQL ".$sql);
	return $res;
}

function query_as_array($sql){
	$data = array();
	$res = query($sql);
	
	while ($set = $res->fetch(PDO::FETCH_NUM))
		$data[]=$set;

	return $data;
}

function tree_xml($data,$img,$id){
	$str="";
	
	return $str;
}

function get_databases_xml(){
	$data=query_as_array("SHOW DATABASES");
	$img="database.gif";
	$id="db^";
	$str="";
	for ($i=0; $i<sizeof($data); $i++){
		if ($data[$i][0]=="information_schema") continue;
		$str.="<item child='1' id='{$id}{$data[$i][0]}' im0='{$img}' im1='{$img}' im2='{$img}'><itemtext><![CDATA[{$data[$i][0]}]]></itemtext></item>\n";
	}
	return $str;
}

function get_tables_xml(){
	$data=query_as_array("SHOW TABLES");
	$img="table.gif";
	$id="table^";
	$str="";
	for ($i=0; $i<sizeof($data); $i++)
		$str.="<item id='{$id}{$data[$i][0]}' im0='{$img}' im1='{$img}' im2='{$img}'><itemtext><![CDATA[{$data[$i][0]}]]></itemtext></item>\n";
	return $str;
}

function decode_id($id){
	$params=explode("|",$id);
	$details=array();
	for ($i=0; $i<sizeof($params); $i++){
		$temp=explode("^",$params[$i]);
		$details[$temp[0]]=$temp[1];
	}
	return $details;
}

function safe_name($name){
	return preg_replace("/[ \t]+/","",$name);
}

function structure_grid($table){
        return "<rows>".sql_data("DESCRIBE`".safe_name($table)."`")."</rows>";
}

function table_grid_enmpty_header($pos,$count=""){
	return "<rows pos='{$pos}' {$count}>";
}

function table_grid_header($name,$pos){
	global $dbh;
	$res=$dbh->query("SELECT count(*) FROM `".safe_name($name)."`");
	$count=$res->rowCount();
	$str=table_grid_enmpty_header($pos,"total_count='{$count}'");
	
	$res=query("DESCRIBE`".safe_name($name)."`"); 
	$str.="<head>";
	
	while ($data=$res->fetch()){
		$color=$data['Key']?"color='#fffaaa'":"";
		$str.="<column  sort='na' {$color} type='ro' width='100'>{$data['Field']}</column>";
	}
        
	$str.="</head>";
	return $str;
}

function table_grid_data($name,$start,$count){
	$res=query("SELECT * FROM `".safe_name($name)."` LIMIT ".intval($start).",".intval($count));
	$str="";
	
	$id=$start+1;
	while ($data=$res->fetch()){
		$str.="<row id='{$id}'>";
		for ($i=0; $i<sizeof($data); $i++){
			$str.="<cell><![CDATA[".@$data[$i]."]]></cell>";
		}
		$str.="</row>";
		
		$id++;
	}
	
	return $str;
}

function sql_data($sql,$two_line=""){
	global $dbh;
	$res=$dbh->query($sql);    
	if ($res){
		$count=$res->columnCount();
		$str="<head><column sort='na' type='ro' width='".($count>3?"100":"*")."'>{$two_line}</column>";
		$temp=array();
		for ($i=0; $i < $count; $i++) { 
			$meta = $res->getColumnMeta($i);
			if ($i>0) $str.="<column sort='na' width='100' type='ro'>#cspan</column>"; //start from second column
			array_push($temp,str_replace(",","\\,",$meta["name"]));
		}
		$str.="<afterInit><call command='attachHeader'><param><![CDATA[".implode(",",$temp)."]]></param></call></afterInit>";
		$str.="</head>";
		$id=1;
		while ($data=$res->fetch()){
			$str.="<row id='{$id}'>";
			for ($i=0; $i < $count; $i++) 
				$str.="<cell><![CDATA[{$data[$i]}]]></cell>";
			$id++;
			$str.="</row>";
		}
	}else{
		$str="<head><column sort='na' type='ro' width='*'></column><afterInit><call command='attachHeader'><param>Error</param></call></afterInit></head>";
		$str.="<row id='1'><cell style='color:red;'><![CDATA[".$dbh->errorInfo()."]]></cell></row>";
	}
	return $str;
}


function xml_head(){
	header("Content-type:text/xml");
	echo "<?xml version='1.0' ?>";
}
?>