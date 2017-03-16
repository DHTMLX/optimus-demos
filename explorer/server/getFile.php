<?php

namespace Server;

require ('Config.php');

if (strstr($_GET["file"], "..") === false) {

    $realFilePath = Config::get('directory') . "" . $_GET["file"];
    $ext = pathinfo($realFilePath, PATHINFO_EXTENSION);
    Config::setContentType($ext);

    if (is_file($realFilePath)) {
        echo file_get_contents($realFilePath);
    } else {
        $mime = (stristr($_SERVER["HTTP_ACCEPT"], "application/xhtml+xml")) ? "application/xhtml+xml" : "text/html";
        header("Content-type: {$mime}");

        echo "<rows id='incorrect value'/>";
    }

} else {

    $mime = (stristr($_SERVER["HTTP_ACCEPT"], "application/xhtml+xml")) ? "application/xhtml+xml" : "text/html";
    header("Content-type: {$mime}");

    echo "<rows id='incorrect value'/>";
}
