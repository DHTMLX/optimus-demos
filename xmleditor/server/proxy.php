<?php
	header("Content-type:text/xml");
	$path = $_GET['path'];
	if ($path === "../xml/demo.xml" || preg_match("|^\.\.\/temp\/[0-9\.]+\.xml$|", $path))
		echo file_get_contents($path);

	$path = filter_var($path, FILTER_VALIDATE_URL);
	if ($path)
		echo file_get_contents($path);
?>