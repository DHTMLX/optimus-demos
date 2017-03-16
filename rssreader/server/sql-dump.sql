-- phpMyAdmin SQL Dump
-- version 2.9.1.1
-- http://www.phpmyadmin.net
-- 
-- Хост: localhost:3306
-- Время создания: Окт 05 2009 г., 13:57
-- Версия сервера: 5.1.37
-- Версия PHP: 5.2.11-1
-- 
-- База данных: `dhxrss`
-- 

-- --------------------------------------------------------

-- 
-- Структура таблицы `dhxrss_channels`
-- 

DROP TABLE IF EXISTS `dhxrss_channels`;
CREATE TABLE IF NOT EXISTS `dhxrss_channels` (
  `channelId` int(11) NOT NULL AUTO_INCREMENT,
  `channelBroken` int(11) NOT NULL,
  `channelParentId` int(11) NOT NULL,
  `channelReadOnly` int(11) NOT NULL DEFAULT '0',
  `channelOrder` int(11) NOT NULL,
  `channelName` text COLLATE utf8_bin NOT NULL,
  `channelLink` text COLLATE utf8_bin NOT NULL,
  `channelTags` text COLLATE utf8_bin NOT NULL,
  `channelAddDate` datetime NOT NULL,
  PRIMARY KEY (`channelId`),
  KEY `folderParentId` (`channelParentId`),
  KEY `folderOrder` (`channelOrder`),
  KEY `channelAddDate` (`channelAddDate`),
  KEY `channelReadOnly` (`channelReadOnly`),
  FULLTEXT KEY `channelName` (`channelName`),
  FULLTEXT KEY `channelLink` (`channelLink`),
  FULLTEXT KEY `channelTags` (`channelTags`)
) ENGINE=MyISAM  DEFAULT CHARSET=utf8 COLLATE=utf8_bin AUTO_INCREMENT=47 ;

-- 
-- Дамп данных таблицы `dhxrss_channels`
-- 

INSERT INTO `dhxrss_channels` (`channelId`, `channelBroken`, `channelParentId`, `channelReadOnly`, `channelOrder`, `channelName`, `channelLink`, `channelTags`, `channelAddDate`) VALUES 
(1, 0, 0, 1, 1, 0x4448544d4c58204e6577732026204576656e7473, 0x687474703a2f2f7777772e6468746d6c782e636f6d2f7273732f7273732e786d6c, '', '2008-05-28 14:32:12'),
(34, 0, 0, 1, 2, 0x5961686f6f204445204e657773, 0x687474703a2f2f702e79696d672e636f6d2f62772f626c6f672f616c6c67656d65696e2f7273732e786d6c, '', '2009-02-27 12:32:14'),
(35, 0, 0, 1, 3, 0x476f6f676c6520e8b584e8aeaf20e4b8ade59bbde78988, 0x687474703a2f2f6e6577732e676f6f676c652e636f6d2f6e6577733f6e65643d636e26686c3d7a682d434e266f75747075743d727373, '', '2009-02-27 12:36:30'),
(36, 0, 0, 1, 4, 0x476f6f676c65204e65777320496e646961202854616d696c29, 0x687474703a2f2f6e6577732e676f6f676c652e636f6d2f6e6577733f6e65643d74615f696e26686c3d7461266f75747075743d727373, '', '2009-02-27 12:38:23'),
(37, 0, 0, 1, 5, 0x476f6f676c6520eb89b4ec8aa420ed959ceab5ad, 0x687474703a2f2f6e6577732e676f6f676c652e636f6d2f6e6577733f6e65643d6b7226686c3d6b6f266f75747075743d727373, '', '2009-02-27 12:40:50'),
(45, 0, 0, 1, 6, 0x7777626e2e636f6d, 0x687474703a2f2f666565642e7777626e2e636f6d2f76312f3f6167677265676174653d63617465676f726965732663617465676f72793d3234, '', '2009-10-05 13:47:07');

-- --------------------------------------------------------

-- 
-- Структура таблицы `dhxrss_feeds`
-- 

DROP TABLE IF EXISTS `dhxrss_feeds`;
CREATE TABLE IF NOT EXISTS `dhxrss_feeds` (
  `feedId` int(11) NOT NULL AUTO_INCREMENT,
  `feedChannelId` int(11) NOT NULL,
  `feedUID` varchar(32) COLLATE utf8_bin NOT NULL,
  `feedTitle` text COLLATE utf8_bin NOT NULL,
  `feedDescription` text COLLATE utf8_bin NOT NULL,
  `feedLink` text COLLATE utf8_bin NOT NULL,
  `feedPubDate` text COLLATE utf8_bin NOT NULL,
  `feedStoredDate` datetime NOT NULL,
  `feedIsRead` int(11) NOT NULL,
  `feedInTrash` int(11) NOT NULL,
  `feedTitleLC` text COLLATE utf8_bin NOT NULL,
  `feedDescriptionLC` text COLLATE utf8_bin NOT NULL,
  PRIMARY KEY (`feedId`),
  KEY `feedChannelId` (`feedChannelId`),
  KEY `feedUID` (`feedUID`),
  KEY `feedIsRead` (`feedIsRead`),
  KEY `feedStoredDate` (`feedStoredDate`),
  KEY `feedInTrash` (`feedInTrash`),
  FULLTEXT KEY `feedTitle` (`feedTitle`),
  FULLTEXT KEY `feedDescription` (`feedDescription`),
  FULLTEXT KEY `feedTitleLC` (`feedTitleLC`),
  FULLTEXT KEY `feedDescriptionLC` (`feedDescriptionLC`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_bin AUTO_INCREMENT=1 ;

-- 
-- Дамп данных таблицы `dhxrss_feeds`
-- 


