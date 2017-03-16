<?php
require_once("dhxrss_config.php");
require_once("rss_php.php");

class dhxRSSMain extends dhxRSSConfig {
	
	public function __construct() {
		$this->pdo = new PDO("mysql:host={$this->db_host};dbname={$this->db_base}", $this->db_user, $this->db_pswd);
		$this->pdo->query("SET NAMES `utf8`");
	}
	
	public function get_tree() {
		$xml = '<?xml version="1.0"?>'.
			'<tree id="0">'.
				'<item id="channels" im0="tree_channels.png" im1="tree_channels.png" im2="tree_channels.png" text="Channels" select="1" open="1">'.$this->get_channels(0).'</item>'.
				'<item id="trash" text="Trash" im0="tree_trash_empty.png" im1="tree_trash_empty.png" im2="tree_trash_empty.png" open="1">'.
					'<item id="trash_channels" text="Channels" im0="tree_trash_channels.png" im1="tree_trash_channels.png" im2="tree_trash_channels.png" open="1">'.$this->get_channels(1).'</item>'.
					'<item id="trash_feeds" text="Feeds" im0="tree_trash_feeds.png" im1="tree_trash_feeds.png" im2="tree_trash_feeds.png"></item>'.
				'</item>'.
			'</tree>';
		return $xml;
	}
	
	private function get_channels($parent=0) {
		$xml = '';
		$sql = "SELECT * FROM `".$this->prefix."channels` LEFT JOIN ((SELECT `feedChannelId`, COUNT(`feedId`) AS `unreadFeeds` FROM `".$this->prefix."feeds` WHERE `feedIsread`='0' GROUP BY `feedChannelId`) AS `feeds`) ON (`feeds`.`feedChannelId`=`".$this->prefix."channels`.`channelId`) WHERE `channelParentId`=".$this->pdo->quote($parent)." ORDER BY `channelOrder`";
		$res = $this->pdo->query($sql) or die ($this->pdo->errorInfo()[2]);
		while ($out = $res->fetch(PDO::FETCH_OBJ)) {
			$img = 'tree_channel'.($out->channelReadOnly==1?"_lock":"").'.png';
			$xml = $xml.'<item id="'.$out->channelId.'" im0="'.$img.'" im1="'.$img.'" im2="'.$img.'"'.(is_numeric($out->unreadFeeds)?' style="font-weight:bold;"':'').'>'.
					'<itemtext><![CDATA['.$out->channelName.(is_numeric($out->unreadFeeds)?' ('.$out->unreadFeeds.')':'').']]></itemtext>'.
					'<userdata name="nodeType">channel</userdata>'.
					'<userdata name="unread">'.(is_numeric($out->unreadFeeds)?$out->unreadFeeds:0).'</userdata>'.
					'<userdata name="nodeName"><![CDATA['.$out->channelName.']]></userdata>'.
					'<userdata name="order"><![CDATA['.$out->channelOrder.']]></userdata>'.
					'<userdata name="ro"><![CDATA['.$out->channelReadOnly.']]></userdata>'.
					'<userdata name="info"><![CDATA['.($out->channelBroken==1?'channel_error':'channel_ok').']]></userdata>'.
					'</item>';
		}
		return $xml;
	}
	
	private function parse_channel($channel, $data) {
		$new_feeds = 0;
		$rss = new rss_php();
		$rss->load($data);
		$items = $rss->getItems(); // returns all rss items
		
		$this->pdo->query("UPDATE `".$this->prefix."channels` SET `channelBroken`='".(count($items)==0?'1':'0')."' WHERE `channelId`='".$this->pdo->quote($channel)."'");
		for ($q=0; $q<count($items); $q++) {
			$title = @$items[$q]["title"];
			$descr = @$items[$q]["description"];
			$flink = @$items[$q]["link"];
			$pdate = @$items[$q]["pubDate"];
			//
			$count = 0;
			$feed_uid = md5($title);
			$res = $this->pdo->query("SELECT COUNT(`feedId`) AS `feedCount` FROM `".$this->prefix."feeds` WHERE `feedUID`='".$feed_uid."'");
			while ($out = $res->fetch(PDO::FETCH_OBJ)) { $count = $out->feedCount; }
			if ($count == 0) {
				$this->pdo->query("INSERT INTO `".$this->prefix."feeds` (`feedId`, `feedChannelId`, `feedUID`, `feedTitle`, `feedDescription`, `feedLink`, `feedPubDate`, `feedStoredDate`, `feedIsRead`, `feedInTrash`, `feedTitleLC`, `feedDescriptionLC`) VALUES (NULL , ".$this->pdo->quote($channel).", ".$this->pdo->quote($feed_uid).", ".$this->pdo->quote($title).", ".$this->pdo->quote($descr).", ".$this->pdo->quote($flink).", ".$this->pdo->quote($pdate).", NOW(), '0', '0', LCASE(".$this->pdo->quote($title)."), LCASE(".$this->pdo->quote($descr)."))");
				$new_feeds++;
			}
		}
		return array($new_feeds, (count($items)==0?1:0));
	}
	
	public function bind_channels($cid=-1) {
		$xml = '<?xml version="1.0"?><data action="bindChannels">';
		$res = $this->pdo->query("SELECT `channelId`, `channelLink` FROM `".$this->prefix."channels` WHERE `channelParentId`='0'".($cid!=-1&&is_numeric($cid)?" AND `channelId`=".$this->pdo->quote($cid)."":""));
		while ($out = $res->fetch(PDO::FETCH_OBJ)) {
			$data = $this->parse_channel($out->channelId,$out->channelLink/*@file_get_contents($out->channelLink)*/);
			$xml = $xml.'<channel id="'.$out->channelId.'" newFeeds="'.$data[0].'" isBroken="'.$data[1].'"/>';
		}
		$xml = $xml.'</data>';
		return $xml;
	}
	
	public function get_feeds($cid=-1, $posStart=0, $count=20, $by="0", $sort_ind="4", $sort_dir="ASC") {
		
		if (!is_numeric($posStart)) { $posStart = 0; }
		if (!is_numeric($count)) { $count = 20; }
		
		// sorting
		$order_by = "`feedStoredDate`";
		switch ($sort_ind) {
			case "0": $order_by = "`feedIsRead`"; break;
			case "1": $order_by = "`channelName`"; break;
			case "2": $order_by = "LCASE(`feedTitleLC`)"; break;
			case "3": $order_by = "`feedSize`"; break;
		}
		$order_type = "ASC";
		if (strtolower($sort_dir) == "asc") { $order_type = "DESC"; }
		
		$sql = "SELECT `feedId`, `channelName`, `feedTitle`, `feedIsRead`, `feedStoredDate`, LENGTH(`feedDescription`) AS `feedSize` FROM `".$this->prefix."feeds` LEFT JOIN (`".$this->prefix."channels` AS `channels`) ON (`channels`.`channelId`=`".$this->prefix."feeds`.`feedChannelId`) WHERE `feedChannelId`=".$this->pdo->quote($cid)."";
		
		$total_count = 0;
		
		$time = microtime(true);
		
		$res = $this->pdo->query("SELECT COUNT(*) AS `totalCount` FROM (".$sql.") AS `tmpTable`");
		while ($out = $res->fetch(PDO::FETCH_OBJ)) { $total_count = $out->totalCount; }
		//
		$res = $this->pdo->query($sql." ORDER BY ".$order_by." ".$order_type." LIMIT ".$posStart.", ".$count);
		
		$time = sprintf("%.3f", microtime(true)-$time);
		$xml = '<?xml version="1.0"?><rows request_time="'.$time.'" total_count="'.$total_count.'" pos="'.$posStart.'">';
		
		while ($out = $res->fetch(PDO::FETCH_OBJ)) {
			$xml = $xml.'<row id="'.$out->feedId.'"'.($out->feedIsRead==0?' style="font-weight:bold;"':'').'>'.
					($out->feedIsRead==0?'<userdata name="unread">yes</userdata>':'').
					'<cell>'.($out->feedIsRead==0?'*':'').'</cell>'.
					'<cell><![CDATA['.$out->channelName.']]></cell>'.
					'<cell><![CDATA['.$out->feedTitle.']]></cell>'.
					'<cell><![CDATA['.$this->pretty_size($out->feedSize).']]></cell>'.
					'<cell><![CDATA['.$this->make_date($out->feedStoredDate).']]></cell>'.
					'</row>';
		}
		$xml = $xml.'</rows>';
		return $xml;
	}
	
	public function load_single_feed($fid=-1) {
		
		$res = $this->pdo->query("SELECT * FROM `".$this->prefix."feeds` LEFT JOIN (`".$this->prefix."channels` AS `channels`) ON (`channels`.`channelId`=`".$this->prefix."feeds`.`feedChannelId`) WHERE `feedId`=".$this->pdo->quote($fid)."");
		while ($out = $res->fetch(PDO::FETCH_OBJ)) {
			$channel_name = $out->channelName;
			$feed_title = $out->feedTitle;
			$feed_pub_date = $out->feedPubDate;
			$feed_rec_date = $this->make_date($out->feedStoredDate);
			$feed_descr = $out->feedDescription;
			$feed_link = $out->feedLink;
		}
		
		$xml = '<?xml version="1.0"?><data action="loadSingleFeed">'.
			'<feed><![CDATA['.$fid.']]></feed>'.
			'<channel><![CDATA['.@$channel_name.']]></channel>'.
			'<title><![CDATA['.@$feed_title.']]></title>'.
			'<link><![CDATA['.@$feed_link.']]></link>'.
			'<pub_date><![CDATA[Public Date: '.@$feed_pub_date.' &nbsp; (Recieved: '.@$feed_rec_date.')]]></pub_date>'.
			'<description><![CDATA['.@$feed_descr.']]></description>'.
			'</data>';
		return $xml;
	}
	
	private function make_date($date) {
		$months = Array("Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec");
		$new_date = $months[$date[5].$date[6] - 1]." ".$date[8].$date[9].", ".$date[0].$date[1].$date[2].$date[3];
		if (strlen($date) > 10) { $new_date = $new_date." ".$date[11].$date[12].":".$date[14].$date[15]; }
		return $new_date;
	}
	
	public function mark_as_read($fid=-1, $cid=-1) {
		$this->pdo->query("UPDATE `".$this->prefix."feeds` SET `feedIsRead`='1' WHERE `feedId`=".$this->pdo->quote($fid)."");
		$done = true;
		$res = $this->pdo->query("SELECT `feedChannelId` FROM `".$this->prefix."feeds` WHERE `feedId`=".$this->pdo->quote($fid)."");
		while ($out = $res->fetch(PDO::FETCH_OBJ)) { $cid = $out->feedChannelId; }
		$xml = '<?xml version="1.0"?><data action="markAsRead"><feed channel="'.$cid.'" id="'.$fid.'" done="'.($done?"yes":"no").'"/></data>';
		return $xml;
	}
	
	private function pretty_size($size) {
		$bytes = array('b','Kb','Mb','Gb','Tb');
		foreach($bytes as $val) { if ($size > 1024) { $size = $size / 1024; } else { break; } }
		$size = round($size, $this->pretty_size_float)." ".$val;
		return $size;
	}
	
	public function restore_channel($cid=-1) {
		$this->pdo->query("UPDATE `".$this->prefix."channels` SET `channelParentId`='0' WHERE `channelId`=".$this->pdo->quote($cid)." AND `channelReadOnly`='0'");
		$is_moved = true;
		$xml = '<?xml version="1.0"?><data action="restoreChannel"><channel id="'.$cid.'" isMoved="'.($is_moved?"yes":"no").'"/></data>';
		return $xml;
	}
	
	public function trash_channel($cid=-1) {
		$this->pdo->query("UPDATE `".$this->prefix."channels` SET `channelParentId`='1' WHERE `channelId`=".$this->pdo->quote($cid)." AND `channelReadOnly`='0'");
		$is_moved = true;
		$xml = '<?xml version="1.0"?><data action="trashChannel"><channel id="'.$cid.'" isMoved="'.($is_moved?"yes":"no").'"/></data>';
		return $xml;
	}
	
	public function remove_channel($cid=-1) {
		/*
		return '<?xml version="1.0"?><data action="removeChannel"><channel id="-1" isRemoved="no" removedFeeds="0"><![CDATA[disabled in php]]></data>';
		*/
		$this->pdo->query("DELETE FROM `".$this->prefix."channels` WHERE `channelId`=".$this->pdo->quote($cid)." AND `channelReadOnly`='0' LIMIT 1");
		$is_removed = true;
		$this->pdo->query("DELETE FROM `".$this->prefix."feeds` WHERE `feedChannelId`=".$this->pdo->quote($cid)."");
		$removed_feeds = 1;
		$xml = '<?xml version="1.0"?><data action="removeChannel"><channel id="'.$cid.'" isRemoved="'.($is_removed?"yes":"no").'" removedFeeds="'.$removed_feeds.'"/></data>';
		return $xml;
	}
	
	public function channel_stat($cid, $action) {
		
		$res = $this->pdo->query("SELECT * FROM `".$this->prefix."channels` LEFT JOIN ((SELECT `feedChannelId`, COUNT(`feedId`) AS `feedsCount`, SUM(LENGTH(`feedDescription`)) AS `feedsLength` FROM `".$this->prefix."feeds` WHERE `feedChannelId`=".$this->pdo->quote($cid)." GROUP BY `feedChannelId`) AS `tmp`) ON (`tmp`.`feedChannelId`=`channelId`) WHERE `channelId`=".$this->pdo->quote($cid)."");
		$out = $res->fetch();
		
		$xml = '<?xml version="1.0"?>'.
			'<data action="'.$action.'">'.
				'<channel id="'.@$out["channelId"].'">'.
					'<name><![CDATA['.@$out["channelName"].']]></name>'.
					'<link><![CDATA['.@$out["channelLink"].']]></link>'.
					'<tags><![CDATA['.@$out["channelTags"].']]></tags>'.
					'<date><![CDATA['.$this->make_date(@$out["channelAddDate"]).']]></date>'.
					'<feeds><![CDATA['.@$out["feedsCount"].' items, '.$this->pretty_size(@$out["feedsLength"]).']]></feeds>'.
				'</channel>'.
			'</data>';
		
		return $xml;
		
	}
	
	public function channel_add($name, $link, $tags) {
		$name = urldecode($name);
		$link = urldecode($link);
		$tags = urldecode($tags);
		
		$rss = new rss_php();
		$rss->load($link);
		$items = $rss->getItems(); // returns all rss items
		if (count($items)==0) {
			// channel broken
			$xml = '<?xml version="1.0"?><data action="channelAdd"><channel id="none"><![CDATA['.$name.']]></channel></data>';
			return $xml;
		}
		
		$order = 1;
		$res = $this->pdo->query("SELECT MAX(`channelOrder`)+1 AS `maxOrder` FROM `dhxrss_channels`");
		while ($out = $res->fetch(PDO::FETCH_OBJ)) { $order = $out->maxOrder; }
		$this->pdo->query("INSERT INTO `dhxrss_channels` (`channelId`, `channelParentId`, `channelOrder`, `channelName`, `channelLink`, `channelTags`, `channelAddDate`, `channelBroken`) VALUES (NULL, '0', '".$order."', ".$this->pdo->quote($name).", ".$this->pdo->quote($link).", ".$this->pdo->quote($tags).", NOW(), '0')");
		$stat = "yes";
		
		$xml = '<?xml version="1.0"?><data action="channelAdd"><channel id="'.@$this->pdo->lastInsertId().'"><![CDATA['.$name.']]></channel></data>';
		
		return $xml;
	}
	
	public function channel_update($cid, $name, $link, $tags) {
		$name = urldecode($name);
		$link = urldecode($link);
		$tags = urldecode($tags);
		$this->pdo->query("UPDATE `".$this->prefix."channels` SET `channelName`=".$this->pdo->quote($name).", `channelLink`=".$this->pdo->quote($link).", `channelTags`=".$this->pdo->quote($tags)." WHERE `channelId`=".$this->pdo->quote($cid)." LIMIT 1");
		$xml = '<?xml version="1.0"?><data action="channelUpdate"><channel id="'.$cid.'"><![CDATA['.$name.']]></channel></data>';
		return $xml;
	}
	
	public function channel_move($cid=1, $dir) {
		
		$order = -1;
		$order2 = -1;
		
		$res = $this->pdo->query("SELECT `channelOrder` FROM `".$this->prefix."channels` WHERE `channelId`=".$this->pdo->quote($cid)."");
		while ($out = $res->fetch(PDO::FETCH_OBJ)) { $order = $out->channelOrder; }
		
		$p = 0;
		$cid2 = -1;
		
		if ($order >= 0) {
			$res = $this->pdo->query("SELECT `channelId`, `channelOrder` FROM `".$this->prefix."channels` WHERE `channelOrder`".($dir>0?">":"<")."'".$order."' ORDER BY `channelOrder` ".($dir>0?"ASC":"DESC")." LIMIT 1");
			while ($out = $res->fetch(PDO::FETCH_OBJ)) { $cid2 = $out->channelId; $order2 = $out->channelOrder; }
			if ($cid >= 0 && $cid2 >= 0 && $order2 >= 0) {
				$this->pdo->query("UPDATE `".$this->prefix."channels` SET `channelOrder`='".$order."' WHERE `channelId`='".$cid2."' LIMIT 1");
				$p += 1;
				$this->pdo->query("UPDATE `".$this->prefix."channels` SET `channelOrder`='".$order2."' WHERE `channelId`='".$cid."' LIMIT 1");
				$p += 1;
			}
		}
		
		$xml = '<?xml version="1.0"?><data action="channelMove">'.
				'<channel id="'.$cid.'" order="'.$order2.'" mode="'.($dir<0?"up":"down_strict").'" changes="'.$p.'"/>'.
				'<channel2 id="'.$cid2.'" order="'.$order.'"/>'.
			'</data>';
		return $xml;
	}
	
}

?>