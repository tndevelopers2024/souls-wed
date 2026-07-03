const fs = require('fs');
const readline = require('readline');

async function recoverFiles() {
  const logPath = '/Users/mohan/.gemini/antigravity-ide/brain/77751e28-f438-43ce-bd1c-9da577a0e298/.system_generated/logs/transcript_full.jsonl';
  const fileStream = fs.createReadStream(logPath);
  const rl = readline.createInterface({ input: fileStream, crlfDelay: Infinity });

  // Map to store the latest full content of a file
  const latestContents = new Map();

  for await (const line of rl) {
    try {
      const entry = JSON.parse(line);
      
      // Look for tool responses that might contain full file contents
      if (entry.type === 'TOOL_RESPONSE' && entry.tool_responses) {
        for (const tr of entry.tool_responses) {
          if (tr.name === 'default_api:view_file' || tr.name === 'default_api:write_to_file') {
            const output = tr.response?.output || '';
            
            // Try to extract the file path and content
            // view_file outputs:
            // File Path: `file:///...`
            // Total Lines: X ...
            // The following code has been modified ...
            // 1: code...
            
            if (output.includes('File Path: `file://')) {
              const pathMatch = output.match(/File Path: `file:\/\/(.+?)`/);
              if (pathMatch) {
                const filePath = pathMatch[1];
                
                // Extract lines. The lines are prefixed with "line_number: "
                const lines = output.split('\n');
                let content = [];
                let isCode = false;
                
                for (const l of lines) {
                  const lineMatch = l.match(/^\d+:\s(.*)$/);
                  if (lineMatch) {
                    content.push(lineMatch[1]);
                    isCode = true;
                  } else if (isCode) {
                    // if we stopped matching numbers, but we were in code, it might be the end message
                    if (l.includes('The above content')) break;
                  }
                }
                
                if (content.length > 0) {
                  latestContents.set(filePath, content.join('\n'));
                }
              }
            }
          }
        }
      }
    } catch (e) {
      // ignore parse errors
    }
  }

  // Now let's see which files we have recovered
  console.log(`Found ${latestContents.size} files in logs.`);
  
  const targetFiles = [
    'components/admin/AdminSidebar.tsx',
    'components/admin/AdminOverviewTab.tsx',
    'components/admin/AdminApprovalsTab.tsx',
    'components/admin/AdminVendorsTab.tsx',
    'components/admin/AdminBookingsTab.tsx',
    'components/admin/AdminUsersTab.tsx',
    'components/admin/AdminVenuesTab.tsx',
    'components/vendor/VendorSidebar.tsx',
    'components/vendor/VendorOverviewTab.tsx',
    'components/vendor/VendorLeadsTab.tsx',
    'components/vendor/VendorVenuesTab.tsx',
    'components/vendor/VendorSettingsTab.tsx',
    'app/(dashboard)/vendor/page.tsx',
    'middleware.ts',
    '.env',
    '.env.local'
  ];
  
  for (const [filePath, content] of latestContents.entries()) {
    const relativePath = filePath.replace('/Users/mohan/Developer/Projects/souls-wed/', '');
    if (targetFiles.some(t => relativePath.includes(t))) {
      console.log(`Recovering: ${relativePath}`);
      const dir = require('path').dirname('/Users/mohan/Developer/Projects/souls-wed/' + relativePath);
      fs.mkdirSync(dir, { recursive: true });
      fs.writeFileSync('/Users/mohan/Developer/Projects/souls-wed/' + relativePath, content);
    }
  }
}

recoverFiles().catch(console.error);
