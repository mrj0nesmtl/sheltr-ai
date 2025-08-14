#!/usr/bin/env node

/**
 * SHELTR Security Issue Fix Script
 * Automatically fixes CodeQL security vulnerabilities
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🔒 SHELTR Security Fix Script Starting...\n');

// Define patterns to fix
const securityFixes = [
  {
    name: 'Log Injection - Console.log with template literals',
    pattern: /console\.log\(`([^`]*\$\{[^}]+\}[^`]*)`\)/g,
    replacement: (match, template) => {
      // Extract variables from template
      const vars = template.match(/\$\{([^}]+)\}/g);
      if (!vars) return match;
      
      const sanitizedVars = vars.map(v => {
        const varName = v.slice(2, -1); // Remove ${ and }
        return `\${sanitizeForLogging(${varName})}`;
      });
      
      let newTemplate = template;
      vars.forEach((original, index) => {
        newTemplate = newTemplate.replace(original, sanitizedVars[index]);
      });
      
      return `secureLog.info(\`${newTemplate}\`)`;
    }
  },
  {
    name: 'Log Injection - Console.error with template literals',
    pattern: /console\.error\(`([^`]*\$\{[^}]+\}[^`]*)`\)/g,
    replacement: (match, template) => {
      const vars = template.match(/\$\{([^}]+)\}/g);
      if (!vars) return match;
      
      const sanitizedVars = vars.map(v => {
        const varName = v.slice(2, -1);
        return `\${sanitizeForLogging(${varName})}`;
      });
      
      let newTemplate = template;
      vars.forEach((original, index) => {
        newTemplate = newTemplate.replace(original, sanitizedVars[index]);
      });
      
      return `secureLog.error(\`${newTemplate}\`)`;
    }
  },
  {
    name: 'Log Injection - Python f-strings',
    pattern: /logger\.(info|error|warning|debug)\(f"([^"]*\{[^}]+\}[^"]*)"/g,
    replacement: (match, level, template) => {
      const vars = template.match(/\{([^}]+)\}/g);
      if (!vars) return match;
      
      const sanitizedVars = vars.map(v => {
        const varName = v.slice(1, -1); // Remove { and }
        return `{sanitize_for_logging(${varName})}`;
      });
      
      let newTemplate = template;
      vars.forEach((original, index) => {
        newTemplate = newTemplate.replace(original, sanitizedVars[index]);
      });
      
      return `logger.${level}(f"${newTemplate}"`;
    }
  }
];

// Files to process
const filesToProcess = [
  'apps/web/src/services/platformMetrics.ts',
  'apps/web/src/services/analyticsService.ts', 
  'apps/web/src/services/chatbotService.ts',
  'apps/web/src/services/calendarService.ts',
  'apps/api/routers/demo_donations.py',
  'apps/api/routers/analytics.py',
  'apps/api/routers/chatbot.py',
  'apps/api/services/analytics_service.py'
];

let totalFixes = 0;

// Process each file
filesToProcess.forEach(filePath => {
  if (!fs.existsSync(filePath)) {
    console.log(`⚠️  File not found: ${filePath}`);
    return;
  }
  
  console.log(`🔍 Processing: ${filePath}`);
  let content = fs.readFileSync(filePath, 'utf8');
  let fileFixCount = 0;
  
  // Check if this is a TypeScript/JavaScript file
  const isJSTS = filePath.endsWith('.ts') || filePath.endsWith('.js') || filePath.endsWith('.tsx');
  const isPython = filePath.endsWith('.py');
  
  // Add import statement if needed for JS/TS files
  if (isJSTS && !content.includes('secureLogging')) {
    if (content.includes('import {') && content.includes("} from '@/")) {
      // Find the last import and add after it
      const importLines = content.split('\n');
      let lastImportIndex = -1;
      
      importLines.forEach((line, index) => {
        if (line.includes("import") && line.includes("from '@/")) {
          lastImportIndex = index;
        }
      });
      
      if (lastImportIndex >= 0) {
        importLines.splice(lastImportIndex + 1, 0, "import { secureLog, sanitizeForLogging } from '@/utils/secureLogging';");
        content = importLines.join('\n');
        console.log(`  ✅ Added secure logging import`);
      }
    }
  }
  
  // Add import for Python files
  if (isPython && !content.includes('secure_logging')) {
    if (content.includes('import logging')) {
      content = content.replace(
        'import logging',
        'import logging\nfrom utils.secure_logging import get_secure_logger, sanitize_for_logging'
      );
      console.log(`  ✅ Added secure logging import`);
    }
  }
  
  // Apply security fixes
  securityFixes.forEach(fix => {
    const matches = content.match(fix.pattern);
    if (matches) {
      console.log(`  🔧 Fixing: ${fix.name} (${matches.length} instances)`);
      content = content.replace(fix.pattern, fix.replacement);
      fileFixCount += matches.length;
    }
  });
  
  if (fileFixCount > 0) {
    fs.writeFileSync(filePath, content);
    console.log(`  ✅ Applied ${fileFixCount} fixes to ${filePath}`);
    totalFixes += fileFixCount;
  } else {
    console.log(`  ℹ️  No fixes needed for ${filePath}`);
  }
  
  console.log('');
});

console.log(`🎉 Security fix complete! Applied ${totalFixes} total fixes.`);
console.log('\n📋 Next steps:');
console.log('1. Test the application to ensure it still works');
console.log('2. Run the build to check for any issues');
console.log('3. Commit the security fixes');
console.log('4. Wait for new CodeQL scan to verify fixes');

if (totalFixes > 0) {
  console.log('\n🔍 Running quick build test...');
  try {
    execSync('cd apps/web && npm run build', { stdio: 'inherit' });
    console.log('✅ Build successful!');
  } catch (error) {
    console.log('❌ Build failed - please review the fixes manually');
  }
}
