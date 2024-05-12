import { readFileSync, writeFileSync } from 'fs';
import moment from 'moment';

const getDate = () => {
  const current = moment().startOf('quarter');
  return `CURRENT_VERSION = '${current.format('YYYY-MM')}'`;
};

// Update the path to the file you want to modify
const filePath = 'lib/constants/index.ts';
let fileContent = readFileSync(filePath, 'utf8');

const newCurrentVersion = getDate();

const pattern = /CURRENT_VERSION = '\d{4}-\d{2}'/;
fileContent = fileContent.replace(pattern, newCurrentVersion);

writeFileSync(filePath, fileContent);

console.log('The AvailableVersions enum has been updated with the latest quarters.');
