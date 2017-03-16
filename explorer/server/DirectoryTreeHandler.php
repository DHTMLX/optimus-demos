<?php

namespace Server;

/**
 * Class DirectoryTreeHandler
 * @package Server
 */
class DirectoryTreeHandler extends BuilderTree
{
    const DEFAULT_AWESOME_FONT = 'file-folder-0';
    const DEFAULT_REGULAR_FONT = 'dhxtreeview_icon_folder_closed';

    /**
     * @param $path
     */
    public function render($path)
    {
        if (strstr($path, "..") !== false || strstr(realpath($path), Config::get('base_dir')) === false) {
            $this->getContentType();
            echo "<rows id='incorrect value'/>";
            die;
        } else {
            $this->getContentType();
            echo $this->template($path);
        }
    }

    /**
     * @param $path
     * @return array
     */
    public function listDirectories($path)
    {
        static $allDirs = [];
        $dirs = glob($path . '/*', GLOB_ONLYDIR);

        if (count($dirs) > 0)
            foreach ($dirs as $dir) $allDirs[] = $dir;

        return $allDirs;
    }

    /**
     * @param $path
     * @return mixed
     */
    public function template($path)
    {
        $directories = $this->listDirectories($path);

        $xml = new \SimpleXMLElement('<?xml version="1.0" encoding="iso-8859-1"?><tree></tree>');
        $xml->addAttribute('version', '1.0');

        $items = $xml->addChild('item');

        foreach ($directories as $directory) {

            $fi = new \FilesystemIterator($directory, \FilesystemIterator::SKIP_DOTS);
            $count = iterator_count($fi);
            $kids = ($count > 1) ? 1 : 0;

            $item = $items->addChild('item');

            $item->addAttribute('id', $directory);
            $item->addAttribute('text', basename($directory));
            $item->addAttribute('kids', $kids);

            $icons = $item->addChild('icons');
            $icons->addAttribute('file', DirectoryTree::DEFAULT_AWESOME_FONT);
        }

        return $xml->asXML();
    }

    public function getContentType()
    {
        $mime = (stristr($_SERVER["HTTP_ACCEPT"], "application/xhtml+xml")) ? "application/xhtml+xml" : "text/html";
        header("Content-type: {$mime}");
    }
}
