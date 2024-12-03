import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

const APPLICATION_IDENTIFIER = {
	local: 'com.sm-pos.dev',
	staging: 'com.sm-pos.staging',
	uat: 'com.sm-pos.uat',
	prod: 'com.sm-pos.prod'
};

const APPLICATION_NAME = {
	local: 'SM POS - DEV',
	staging: 'SM POS - STAGING',
	uat: 'SM POS - UAT',
	prod: 'SM POS'
};

const DEFAULT_ENVIRONMENT = 'local';
const CONFIG_FILE = 'src-tauri/tauri.conf.json';

const getBaseDir = () => {
	const filename = fileURLToPath(import.meta.url);
	return path.dirname(filename);
};

const readJsonFile = (filepath) => {
	try {
		const fileContent = fs.readFileSync(filepath, 'utf8');
		return JSON.parse(fileContent);
	} catch (error) {
		throw new Error(`Failed to read JSON File: ${error}`);
	}
};

const writeJsonFile = (filePath, data) => {
	try {
		const jsonData = JSON.stringify(data, null, 2);
		fs.writeFileSync(filePath, jsonData);
	} catch (error) {
		throw new Error(`Failed to write JSON File: ${error}`);
	}
};

const main = () => {
	const baseDir = getBaseDir();
	const configPath = path.join(baseDir, CONFIG_FILE);
	const config = readJsonFile(configPath);

	const environment = process.env.APP_ENV || DEFAULT_ENVIRONMENT;

	if (!environment) {
		throw new Error('No environment found');
	}

	config.tauri.bundle.identifier =
		APPLICATION_IDENTIFIER[environment] ?? APPLICATION_IDENTIFIER[DEFAULT_ENVIRONMENT];
	config.package.productName =
		APPLICATION_NAME[environment] ?? APPLICATION_NAME[DEFAULT_ENVIRONMENT];

	writeJsonFile(configPath, config);
};

main();
