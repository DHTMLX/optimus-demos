<?php
header("Content-Type: text/xml");

require_once("dhxrss_data.php");

$_DHXRSS = new dhxRSSMain();

switch (@$_GET["action"]) {
	
	case "loadTree":
		echo $_DHXRSS->get_tree();
		break;
	case "bindChannels":
		ini_set("max_execution_time", 600);
		echo $_DHXRSS->bind_channels(@$_GET["channelId"]);
		break;
	case "getFeeds":
		echo $_DHXRSS->get_feeds(@$_GET["channelId"], @$_GET["posStart"], @$_GET["count"], "", @$_GET["sortInd"], @$_GET["sortDir"]);
		break;
	case "loadSingleFeed":
		echo $_DHXRSS->load_single_feed(@$_GET["feedId"]);
		break;
	case "markAsRead":
		echo $_DHXRSS->mark_as_read(@$_GET["feedId"], @$_GET["channelId"]);
		break;
	case "trashChannel":
		echo $_DHXRSS->trash_channel(@$_GET["channelId"]);
		break;
	case "restoreChannel":
		echo $_DHXRSS->restore_channel(@$_GET["channelId"]);
		break;
	case "removeChannel":
		echo $_DHXRSS->remove_channel(@$_GET["channelId"]);
		break;
	case "channelStat":
		echo $_DHXRSS->channel_stat(@$_GET["channelId"], "channelStat");
		break;
	case "channelEdit":
		echo $_DHXRSS->channel_stat(@$_GET["channelId"], "channelEdit");
		break;
	case "channelAdd":
		echo $_DHXRSS->channel_add(@$_GET["channelName"], @$_GET["channelLink"], @$_GET["channelTags"]);
		break;
	case "channelMoveUp":
		echo $_DHXRSS->channel_move(@$_GET["channelId"], -1);
		break;
	case "channelMoveDown":
		echo $_DHXRSS->channel_move(@$_GET["channelId"], 1);
		break;
	case "channelUpdate":
		echo $_DHXRSS->channel_update(@$_GET["channelId"], @$_GET["channelName"], @$_GET["channelLink"], @$_GET["channelTags"]);
		break;
}


?>