<?php

namespace Server;

require 'BuilderTree.php';
require 'Config.php';
require 'DirectoryTreeHandler.php';

/**
 * Class DirectoryTree
 * @package Server
 */
class DirectoryTree extends DirectoryTreeHandler
{
}

$handler = new DirectoryTreeHandler();
$handler->render($_GET['id']);
