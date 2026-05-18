const fs = require('fs');
const path = require('path');

// Read all batch files
const batch1Content = fs.readFileSync(path.join(__dirname, '../data/roles-batch1.ts'), 'utf8');
const batch2Content = fs.readFileSync(path.join(__dirname, '../data/roles-batch2.ts'), 'utf8');
const batch3Content = fs.readFileSync(path.join(__dirname, '../data/roles-batch3.ts'), 'utf8');

// Extract the role objects from each batch (remove import statements and export wrapper)
const extractRoleData = (content) => {
  // Find the start of the first role definition
  const startMatch = content.match(/'[a-z-]+': \{/);
  if (!startMatch) return '';
  
  const start = content.indexOf(startMatch[0]);
  // Find the last closing brace before the final }; 
  const end = content.lastIndexOf('  }\n};');
  
  return content.substring(start, end + 4); // +4 to include the closing }
};

const batch1Roles = extractRoleData(batch1Content);
const batch2Roles = extractRoleData(batch2Content);
const batch3Roles = extractRoleData(batch3Content);

// Read the original roles.ts
const originalContent = fs.readFileSync(path.join(__dirname, '../data/roles.ts'), 'utf8');

// Find where to insert (before the final closing };)
const insertPoint = originalContent.lastIndexOf('  }\n};');

// Build the new content
const beforeRoles = originalContent.substring(0, insertPoint + 4); // Include the closing } of wordpress role
const newContent = beforeRoles + ',\n\n  ' + batch1Roles + ',\n\n  ' + batch2Roles + ',\n\n  ' + batch3Roles + '\n};\n';

// Write the updated file
fs.writeFileSync(path.join(__dirname, '../data/roles.ts'), newContent, 'utf8');

console.log('✅ Successfully merged all 10 new roles into roles.ts');
console.log('📝 Roles added:');
console.log('   - Shopify SEO Specialist');
console.log('   - Link Building Specialist');
console.log('   - Technical SEO Specialist');
console.log('   - Local SEO Specialist');
console.log('   - E-commerce SEO Specialist');
console.log('   - SEO Content Writer');
console.log('   - On-Page SEO Specialist');
console.log('   - YouTube SEO Specialist');
console.log('   - SEO Analyst');
console.log('   - WooCommerce SEO Specialist');
