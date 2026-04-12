const fs = require('fs');
const path = require('path');

// Category mapping for all roles
const categoryMapping = {
  // SEO Roles (11)
  'wordpress-seo-specialist': { category: 'SEO Specialists', categorySlug: 'seo-specialists', relatedRoles: ['shopify-seo-specialist', 'technical-seo-specialist', 'woocommerce-seo-specialist'] },
  'shopify-seo-specialist': { category: 'SEO Specialists', categorySlug: 'seo-specialists', relatedRoles: ['wordpress-seo-specialist', 'ecommerce-seo-specialist', 'woocommerce-seo-specialist'] },
  'link-building-specialist': { category: 'SEO Specialists', categorySlug: 'seo-specialists', relatedRoles: ['technical-seo-specialist', 'on-page-seo-specialist', 'seo-content-writer'] },
  'technical-seo-specialist': { category: 'SEO Specialists', categorySlug: 'seo-specialists', relatedRoles: ['wordpress-seo-specialist', 'link-building-specialist', 'on-page-seo-specialist'] },
  'local-seo-specialist': { category: 'SEO Specialists', categorySlug: 'seo-specialists', relatedRoles: ['wordpress-seo-specialist', 'seo-content-writer', 'on-page-seo-specialist'] },
  'ecommerce-seo-specialist': { category: 'SEO Specialists', categorySlug: 'seo-specialists', relatedRoles: ['shopify-seo-specialist', 'woocommerce-seo-specialist', 'seo-content-writer'] },
  'seo-content-writer': { category: 'SEO Specialists', categorySlug: 'seo-specialists', relatedRoles: ['on-page-seo-specialist', 'local-seo-specialist', 'wordpress-seo-specialist'] },
  'on-page-seo-specialist': { category: 'SEO Specialists', categorySlug: 'seo-specialists', relatedRoles: ['technical-seo-specialist', 'seo-content-writer', 'link-building-specialist'] },
  'youtube-seo-specialist': { category: 'SEO Specialists', categorySlug: 'seo-specialists', relatedRoles: ['seo-content-writer', 'seo-analyst', 'on-page-seo-specialist'] },
  'seo-analyst': { category: 'SEO Specialists', categorySlug: 'seo-specialists', relatedRoles: ['technical-seo-specialist', 'on-page-seo-specialist', 'link-building-specialist'] },
  'woocommerce-seo-specialist': { category: 'SEO Specialists', categorySlug: 'seo-specialists', relatedRoles: ['wordpress-seo-specialist', 'shopify-seo-specialist', 'ecommerce-seo-specialist'] },

  // Paid Ads Roles (10)
  'google-ads-specialist': { category: 'Paid Advertising Specialists', categorySlug: 'paid-advertising-specialists', relatedRoles: ['ppc-manager', 'google-shopping-specialist', 'retargeting-specialist'] },
  'facebook-ads-specialist': { category: 'Paid Advertising Specialists', categorySlug: 'paid-advertising-specialists', relatedRoles: ['paid-social-specialist', 'tiktok-ads-specialist', 'retargeting-specialist'] },
  'tiktok-ads-specialist': { category: 'Paid Advertising Specialists', categorySlug: 'paid-advertising-specialists', relatedRoles: ['facebook-ads-specialist', 'paid-social-specialist', 'youtube-ads-specialist'] },
  'google-shopping-specialist': { category: 'Paid Advertising Specialists', categorySlug: 'paid-advertising-specialists', relatedRoles: ['google-ads-specialist', 'ppc-manager', 'retargeting-specialist'] },
  'programmatic-advertising-specialist': { category: 'Paid Advertising Specialists', categorySlug: 'paid-advertising-specialists', relatedRoles: ['ppc-manager', 'retargeting-specialist', 'google-ads-specialist'] },
  'linkedin-ads-specialist': { category: 'Paid Advertising Specialists', categorySlug: 'paid-advertising-specialists', relatedRoles: ['paid-social-specialist', 'ppc-manager', 'facebook-ads-specialist'] },
  'ppc-manager': { category: 'Paid Advertising Specialists', categorySlug: 'paid-advertising-specialists', relatedRoles: ['google-ads-specialist', 'facebook-ads-specialist', 'programmatic-advertising-specialist'] },
  'paid-social-specialist': { category: 'Paid Advertising Specialists', categorySlug: 'paid-advertising-specialists', relatedRoles: ['facebook-ads-specialist', 'tiktok-ads-specialist', 'linkedin-ads-specialist'] },
  'youtube-ads-specialist': { category: 'Paid Advertising Specialists', categorySlug: 'paid-advertising-specialists', relatedRoles: ['tiktok-ads-specialist', 'paid-social-specialist', 'retargeting-specialist'] },
  'retargeting-specialist': { category: 'Paid Advertising Specialists', categorySlug: 'paid-advertising-specialists', relatedRoles: ['google-ads-specialist', 'facebook-ads-specialist', 'programmatic-advertising-specialist'] },

  // Sales Roles (10)
  'sales-development-rep': { category: 'Sales Specialists', categorySlug: 'sales-specialists', relatedRoles: ['appointment-setter', 'cold-calling-specialist', 'lead-generation-specialist'] },
  'business-development-manager': { category: 'Sales Specialists', categorySlug: 'sales-specialists', relatedRoles: ['account-executive', 'sales-operations-specialist', 'account-manager'] },
  'cold-calling-specialist': { category: 'Sales Specialists', categorySlug: 'sales-specialists', relatedRoles: ['sales-development-rep', 'appointment-setter', 'inside-sales-representative'] },
  'appointment-setter': { category: 'Sales Specialists', categorySlug: 'sales-specialists', relatedRoles: ['sales-development-rep', 'cold-calling-specialist', 'inside-sales-representative'] },
  'account-executive': { category: 'Sales Specialists', categorySlug: 'sales-specialists', relatedRoles: ['inside-sales-representative', 'account-manager', 'business-development-manager'] },
  'account-manager': { category: 'Sales Specialists', categorySlug: 'sales-specialists', relatedRoles: ['customer-success-manager', 'account-executive', 'crm-manager'] },
  'crm-manager': { category: 'Sales Specialists', categorySlug: 'sales-specialists', relatedRoles: ['sales-operations-specialist', 'hubspot-administrator', 'account-manager'] },
  'sales-operations-specialist': { category: 'Sales Specialists', categorySlug: 'sales-specialists', relatedRoles: ['crm-manager', 'business-development-manager', 'operations-manager'] },
  'inside-sales-representative': { category: 'Sales Specialists', categorySlug: 'sales-specialists', relatedRoles: ['account-executive', 'sales-development-rep', 'appointment-setter'] },
  'customer-success-manager': { category: 'Sales Specialists', categorySlug: 'sales-specialists', relatedRoles: ['account-manager', 'customer-support-specialist', 'operations-manager'] },

  // Marketing & Creative Roles (10)
  'copywriter': { category: 'Marketing & Creative Specialists', categorySlug: 'marketing-creative-specialists', relatedRoles: ['marketing-copywriter', 'seo-content-writer', 'content-strategist'] },
  'social-media-manager': { category: 'Marketing & Creative Specialists', categorySlug: 'marketing-creative-specialists', relatedRoles: ['content-strategist', 'graphic-designer', 'ugc-manager'] },
  'email-marketing-specialist': { category: 'Marketing & Creative Specialists', categorySlug: 'marketing-creative-specialists', relatedRoles: ['marketing-copywriter', 'marketing-assistant', 'content-strategist'] },
  'video-editor': { category: 'Marketing & Creative Specialists', categorySlug: 'marketing-creative-specialists', relatedRoles: ['graphic-designer', 'ugc-manager', 'podcast-producer'] },
  'graphic-designer': { category: 'Marketing & Creative Specialists', categorySlug: 'marketing-creative-specialists', relatedRoles: ['brand-designer', 'video-editor', 'social-media-manager'] },
  'content-strategist': { category: 'Marketing & Creative Specialists', categorySlug: 'marketing-creative-specialists', relatedRoles: ['copywriter', 'social-media-manager', 'email-marketing-specialist'] },
  'ugc-manager': { category: 'Marketing & Creative Specialists', categorySlug: 'marketing-creative-specialists', relatedRoles: ['social-media-manager', 'video-editor', 'content-strategist'] },
  'brand-designer': { category: 'Marketing & Creative Specialists', categorySlug: 'marketing-creative-specialists', relatedRoles: ['graphic-designer', 'content-strategist', 'marketing-assistant'] },
  'podcast-producer': { category: 'Marketing & Creative Specialists', categorySlug: 'marketing-creative-specialists', relatedRoles: ['video-editor', 'content-strategist', 'social-media-manager'] },
  'marketing-copywriter': { category: 'Marketing & Creative Specialists', categorySlug: 'marketing-creative-specialists', relatedRoles: ['copywriter', 'email-marketing-specialist', 'content-strategist'] },

  // Operations & Admin Roles (10)
  'executive-assistant': { category: 'Operations & Admin Specialists', categorySlug: 'operations-admin-specialists', relatedRoles: ['virtual-assistant', 'marketing-assistant', 'operations-manager'] },
  'virtual-assistant': { category: 'Operations & Admin Specialists', categorySlug: 'operations-admin-specialists', relatedRoles: ['executive-assistant', 'marketing-assistant', 'data-entry-specialist'] },
  'marketing-assistant': { category: 'Operations & Admin Specialists', categorySlug: 'operations-admin-specialists', relatedRoles: ['virtual-assistant', 'project-manager', 'social-media-manager'] },
  'project-manager': { category: 'Operations & Admin Specialists', categorySlug: 'operations-admin-specialists', relatedRoles: ['operations-manager', 'marketing-assistant', 'sales-operations-specialist'] },
  'data-entry-specialist': { category: 'Operations & Admin Specialists', categorySlug: 'operations-admin-specialists', relatedRoles: ['virtual-assistant', 'lead-generation-specialist', 'crm-manager'] },
  'lead-generation-specialist': { category: 'Operations & Admin Specialists', categorySlug: 'operations-admin-specialists', relatedRoles: ['sales-development-rep', 'data-entry-specialist', 'research-analyst'] },
  'research-analyst': { category: 'Operations & Admin Specialists', categorySlug: 'operations-admin-specialists', relatedRoles: ['lead-generation-specialist', 'data-entry-specialist', 'operations-manager'] },
  'customer-support-specialist': { category: 'Operations & Admin Specialists', categorySlug: 'operations-admin-specialists', relatedRoles: ['customer-success-manager', 'virtual-assistant', 'hubspot-administrator'] },
  'hubspot-administrator': { category: 'Operations & Admin Specialists', categorySlug: 'operations-admin-specialists', relatedRoles: ['crm-manager', 'customer-support-specialist', 'operations-manager'] },
  'operations-manager': { category: 'Operations & Admin Specialists', categorySlug: 'operations-admin-specialists', relatedRoles: ['project-manager', 'executive-assistant', 'sales-operations-specialist'] }
};

// Read the roles.ts file
const rolesPath = path.join(__dirname, '../data/roles.ts');
let content = fs.readFileSync(rolesPath, 'utf8');

// For each role, add the category data
Object.keys(categoryMapping).forEach(roleSlug => {
  const { category, categorySlug, relatedRoles } = categoryMapping[roleSlug];
  
  // Find the testimonial section for this role and add category data after it
  const rolePattern = new RegExp(`'${roleSlug}':\\s*\\{[\\s\\S]*?testimonial:\\s*\\{[\\s\\S]*?\\}`, 'g');
  
  content = content.replace(rolePattern, (match) => {
    // Check if category data already exists
    if (match.includes('category:')) {
      return match;
    }
    
    // Add category data after testimonial
    return match + `,\n    category: '${category}',\n    categorySlug: '${categorySlug}',\n    relatedRoles: ${JSON.stringify(relatedRoles)}`;
  });
});

// Write the updated content back
fs.writeFileSync(rolesPath, content, 'utf8');

console.log('✅ Successfully added category and related roles data to all 51 roles');
console.log('📝 Categories:');
console.log('   - SEO Specialists (11 roles)');
console.log('   - Paid Advertising Specialists (10 roles)');
console.log('   - Sales Specialists (10 roles)');
console.log('   - Marketing & Creative Specialists (10 roles)');
console.log('   - Operations & Admin Specialists (10 roles)');
