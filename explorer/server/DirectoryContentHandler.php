<?php

namespace Server;

/**
 * Class DirectoryContentHandler
 * @package Server
 */
class DirectoryContentHandler extends BuilderTree
{
    const FILE_FOLDER_TYPE = 'File Folder';
    const FOLDER_GIF = 'folder.gif';

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
     * @return mixed
     */
    public function template($path)
    {
        $xml = new \SimpleXMLElement('<?xml version="1.0" encoding="iso-8859-1"?><rows></rows>');
        $xml->addAttribute('version', '1.0');

        $iterator = new \RecursiveDirectoryIterator($path);

        foreach ($iterator as $file) {

            $filePath = $file->getRealPath();
            $ext = pathinfo($file->getRealPath(), PATHINFO_EXTENSION);

            $type = is_file($filePath) ? Config::get('fileTypes')[$ext] : DirectoryContentHandler::FILE_FOLDER_TYPE;
            $icon = is_dir($filePath) ? DirectoryContentHandler::FOLDER_GIF : Config::get('fileTypes')[$ext];

            $row = $xml->addChild('row');
            $row->addAttribute('id', $file->getRealPath());

            $row->addChild('cell', $icon);
            $row->addChild('cell', basename($filePath));
            $row->addChild('cell', filesize($filePath));
            $row->addChild('cell', $type);
            $row->addChild('cell', date("Y-m-d H:i",filemtime($filePath)));
        }

        return $xml->asXML();
    }

    public function getContentType()
    {
        $mime = (stristr($_SERVER["HTTP_ACCEPT"], "application/xhtml+xml")) ? "application/xhtml+xml" : "text/html";
        header("Content-type: {$mime}");
    }
}
