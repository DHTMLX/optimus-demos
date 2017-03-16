<?php
if (@$_REQUEST["mode"] == "html5") {
    $target_path = "../temp/";
    $name= microtime(true).".xml";
    $target_path = $target_path . $name; 

    move_uploaded_file($_FILES['file']['tmp_name'], $target_path);

	header("Content-Type: text/json");
	print_r("{state: true, name:'../temp/{$name}'}");
}
?>