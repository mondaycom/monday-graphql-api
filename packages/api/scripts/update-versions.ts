import { readFileSync, writeFileSync } from 'fs';
import * as moment from 'moment';

function getDates() {
  const current = moment().startOf('quarter');

  const formatDate = (date: moment.Moment) => {
    return `VERSION_${date.format('YYYY-MM').replace('-', '_')} = '${date.format('YYYY-MM')}'`;
  };

  return {
    currentQuarter: formatDate(current),
  };
}

// Update the path to the file you want to modify
const filePath = 'lib/constants/index.ts';
let fileContent = readFileSync(filePath, 'utf8');

const dates = getDates();

const updatedVersionConsts = `
  ${dates.currentQuarter}
`;

// Regex pattern to match the existing quarter lines
const pattern = /VERSION_\d{4}_\d{2} = '\d{4}-\d{2}'/g;
fileContent = fileContent.replace(pattern, updatedVersionConsts.trim());

writeFileSync(filePath, fileContent);

console.log('The AvailableVersions enum has been updated with the latest quarters.');
