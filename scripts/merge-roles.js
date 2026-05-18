const fs = require('fs');
const path = require('path');

// Read the original roles.ts file
const originalRoles = fs.readFileSync(path.join(__dirname, '../data/roles.ts'), 'utf8');

// Read all batch files
const batch1 = fs.readFileSync(path.join(__dirname, '../data/roles-batch1.ts'), 'utf8');
const batch2 = fs.readFileSync(path.join(__dirname, '../data/roles-batch2.ts'), 'utf8');
const batch3 = fs.readFileSync(path.join(__dirname, '../data/roles-batch3.ts'), 'utf8');

// Extract role objects from batch files (everything between the opening { and closing })
const extractRoles = (content) => {
  const start = content.indexOf("'shopify-seo-specialist'") || content.indexOf("'local-seo-specialist'") || content.indexOf("'on-page-seo-specialist'");
  const end = content.lastIndexOf('};');
  return content.substring(start, end).trim();
};

// Get the role data from each batch
const batch1Roles = batch1.substring(batch1.indexOf("'shopify-seo-specialist'"), batch1.lastIndexOf('};')).trim();
const batch2Roles = batch2.substring(batch2.indexOf("'local-seo-specialist'"), batch2.lastIndexOf('};')).trim();
const batch3Roles = batch3.substring(batch3.indexOf("'on-page-seo-specialist'"), batch3.lastIndexOf('};')).trim();

// Find where to insert new roles (before the closing }; of ROLES object)
const insertPosition = originalRoles.lastIndexOf('  }\n};');

// Create the new content
const newContent = originalRoles.substring(0, insertPosition) + '  },\n\n  ' + 
  batch1Roles + ',\n\n  ' + 
  batch2Roles + ',\n\n  ' + 
  batch3Roles + '\n};';

// Write the merged file
fs.writeFileSync(path.join(__dirname, '../data/roles.ts'), newContent, 'utf8');

console.log('✅ Successfully merged all role data into roles.ts');
