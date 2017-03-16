<?php

namespace Server;

require '../vendor/autoload.php';

/**
 * Class BuilderTree
 * @package Server
 */
abstract class BuilderTree
{
    /**
     * @param $path
     * @return mixed
     */
    abstract protected function render($path);

    /**
     * @param $path
     * @return mixed
     */
    abstract protected function template($path);
}
