-- phpMyAdmin SQL Dump
-- version 2.9.1.1
-- http://www.phpmyadmin.net
-- 
-- Хост: localhost:3306
-- Время создания: Сен 01 2009 г., 18:23
-- Версия сервера: 5.0.81
-- Версия PHP: 5.2.9-4
-- 
-- База данных: `dhtmlx`
-- 

-- --------------------------------------------------------

-- 
-- Структура таблицы `dhxcmd_files`
-- 

CREATE TABLE `dhxcmd_files` (
  `fileId` int(11) NOT NULL auto_increment,
  `sessionId` int(11) NOT NULL,
  `parentId` int(11) NOT NULL,
  `fileName` text character set utf8 collate utf8_bin NOT NULL,
  `fileTempName` text character set utf8 collate utf8_bin NOT NULL,
  `fileIsDir` int(11) NOT NULL,
  `fileDate` datetime NOT NULL,
  PRIMARY KEY  (`fileId`),
  KEY `sessionId` (`sessionId`),
  KEY `folderId` (`parentId`),
  KEY `fileDate` (`fileDate`),
  KEY `fileIsDir` (`fileIsDir`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

-- 
-- Структура таблицы `dhxcmd_session`
-- 

CREATE TABLE `dhxcmd_session` (
  `sessionId` int(11) NOT NULL auto_increment,
  `sessionKey` varchar(32) character set utf8 collate utf8_bin NOT NULL,
  `sessionDate` datetime NOT NULL,
  `sessionActivity` datetime NOT NULL,
  PRIMARY KEY  (`sessionId`),
  KEY `sessionDate` (`sessionDate`),
  KEY `sessionActivity` (`sessionActivity`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1;

