<?php

namespace Server;

require 'BuilderTree.php';
require 'Config.php';
require 'DirectoryContentHandler.php';

/**
 * Class DirectoryContent
 * @package Server
 */
class DirectoryContent extends DirectoryContentHandler
{
}

$handler = new DirectoryContentHandler();
$handler->render($_GET['dir']);
