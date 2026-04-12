const fs = require('fs');
const path = require('path');

// Read all batch files
const batch1Content = fs.readFileSync(path.join(__dirname, '../data/paid-ads-batch1.ts'), 'utf8');
const batch2Content = fs.readFileSync(path.join(__dirname, '../data/paid-ads-batch2.ts'), 'utf8');
const batch3Content = fs.readFileSync(path.join(__dirname, '../data/paid-ads-batch3.ts'), 'utf8');

// Extract the role objects from each batch
const extractRoleData = (content) => {
  const startMatch = content.match(/'[a-z-]+': \{/);
  if (!startMatch) return '';
  
  const start = content.indexOf(startMatch[0]);
  const end = content.lastIndexOf('  }\n};');
  
  return content.substring(start, end + 4);
};

const batch1Roles = extractRoleData(batch1Content);
const batch2Roles = extractRoleData(batch2Content);
const batch3Roles = extractRoleData(batch3Content);

// Read the current roles.ts
const originalContent = fs.readFileSync(path.join(__dirname, '../data/roles.ts'), 'utf8');

// Find where to insert (before the final closing };)
const insertPoint = originalContent.lastIndexOf('\n};');

// Build the new content
const beforeRoles = originalContent.substring(0, insertPoint);
const newContent = beforeRoles + ',\n\n  ' + batch1Roles + ',\n\n  ' + batch2Roles + ',\n\n  ' + batch3Roles + '\n};\n';

// Write the updated file
fs.writeFileSync(path.join(__dirname, '../data/roles.ts'), newContent, 'utf8');

console.log('✅ Successfully merged all 10 paid ads roles into roles.ts');
console.log('📝 Roles added:');
console.log('   - Google Ads Specialist');
console.log('   - Facebook Ads Specialist');
console.log('   - TikTok Ads Specialist');
console.log('   - Google Shopping Specialist');
console.log('   - Programmatic Advertising Specialist');
console.log('   - LinkedIn Ads Specialist');
console.log('   - PPC Manager');
console.log('   - Paid Social Specialist');
console.log('   - YouTube Ads Specialist');
console.log('   - Retargeting Specialist');
