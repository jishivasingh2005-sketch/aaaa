const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log("🚀 Socho Auto-Sync started! Watching for changes...");

// Files change detection
fs.watch(path.join(__dirname, 'src'), { recursive: true }, (eventType, filename) => {
    if (filename) {
        syncToGithub(filename);
    }
});

fs.watch(path.join(__dirname, 'backend'), { recursive: true }, (eventType, filename) => {
    if (filename && !filename.includes('node_modules')) {
        syncToGithub(filename);
    }
});

let isSyncing = false;
function syncToGithub(file) {
    if (isSyncing) return;
    isSyncing = true;
    
    console.log(`📝 Change detected in: ${file}. Uploading to GitHub...`);
    
    // Windows PowerShell - Use multiple commands instead of &&
    const command = `git add . ; git commit -m "Auto-update: Changed ${file}" ; git push origin main`;
    
    exec(command, (err, stdout, stderr) => {
        if (err) {
            console.error("❌ Sync failed. Error:", err.message);
        } else {
            console.log("✅ GitHub Updated! Render will now auto-deploy. 🚀");
        }
        // Wait 10 seconds before next sync to avoid spamming
        setTimeout(() => { isSyncing = false; }, 10000);
    });
}
