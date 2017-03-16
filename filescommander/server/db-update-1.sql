ALTER TABLE `dhxcmd_files` ADD `recordDate` DATETIME NOT NULL;
ALTER TABLE `dhxcmd_files` ADD INDEX (`recordDate`);
