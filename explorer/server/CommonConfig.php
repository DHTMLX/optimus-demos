<?php

namespace Server;

/**
 * Class CommonConfig
 * @package Server
 */
class CommonConfig
{
    /**
     * @var array
     */
    protected static $config = [];

    /**
     * @param $name
     * @param null $default
     * @return mixed|null
     */
    public static function get($name, $default = null)
    {
        return isset(self::$config[$name]) ? self::$config[$name] : $default;
    }

    /**
     * @param array $parameters
     */
    public static function add($parameters = [])
    {
        self::$config = array_merge(self::$config, $parameters);
    }
}

CommonConfig::add([
    'directory'   => '/var/www/demos-optimus/explorer/server/',
    'environment' => 'dev',
    'fileTypes' => [
        "css"	=> "CSS Document",
        "txt"   => "Text Document",
        "gif"   => "GIF Image",
        "jpg"   => "JPEG Image",
        "jpeg"	=> "JPEG Image",
        "png"	=> "PNG Image",
        "php"	=> "PHP Script",
        "doc"   => "Word Document",
        "docx"  => "Word Document",
        "xls"   => "Excel Document",
        "xlsx"  => "Excel Document",
        "html"  => "HTML Document",
        "shtml" => "SHTML Document"
    ]
]);
