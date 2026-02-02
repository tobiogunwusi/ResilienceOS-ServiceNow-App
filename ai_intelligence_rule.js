(function executeRule(current, previous /*null when async*/) {

    var errorLog = current.error_payload ? current.error_payload.toString().toLowerCase() : "";
    
    var analysis = "";
    var fix = "";
    var confidence = 0;

    // --- CATEGORY 1: COMPUTE & APPLICATION (High Confidence) ---
    if (errorLog.indexOf("memory") > -1 || errorLog.indexOf("heap") > -1 || errorLog.indexOf("oom") > -1) {
        analysis = "<b>Root Cause:</b> Java Heap Space exhaustion / Out of Memory.";
        fix = "<b>Auto-Action:</b> <br>1. Flush JVM Cache.<br>2. Rolling Restart of Tomcat Service.";
        confidence = 98; // Safe to automate
    
    // --- CATEGORY 2: STORAGE & DISK (Medium Confidence) ---
    } else if (errorLog.indexOf("disk") > -1 || errorLog.indexOf("storage") > -1 || errorLog.indexOf("full") > -1) {
        analysis = "<b>Root Cause:</b> Critical Disk Capacity (<5% Free).";
        fix = "<b>Suggested Action:</b> Provision additional EBS Volume or clear temp logs.";
        confidence = 85; // Human review needed 

    // --- CATEGORY 3: DATABASE (High Confidence) ---
    } else if (errorLog.indexOf("sql") > -1 || errorLog.indexOf("deadlock") > -1 || errorLog.indexOf("connection") > -1) {
        analysis = "<b>Root Cause:</b> Database Connection Pool Exhaustion / Deadlock.";
        fix = "<b>Auto-Action:</b> Reset Connection Pool and Kill Stuck Sessions.";
        confidence = 95; // Safe to automate reset

    // --- CATEGORY 4: NETWORK & SECURITY (Low Confidence - High Risk) ---
    } else if (errorLog.indexOf("timeout") > -1 || errorLog.indexOf("502") > -1 || errorLog.indexOf("latency") > -1) {
        analysis = "<b>Root Cause:</b> Network Gateway Timeout / High Latency.";
        fix = "<b>Suggested Action:</b> Check Firewall Logs and Load Balancer health.";
        confidence = 60; // Network issues are complex, needs human

    // --- DEFAULT: UNKNOWN ERROR ---
    } else {
        analysis = "<b>Root Cause:</b> Unclassified System Error.";
        fix = "<b>Action:</b> Assign to Level 2 Support for manual triage.";
        confidence = 45; 
    }

    // 2. Set Output Fields
    current.ai_root_cause = analysis;        
    current.suggested_fix = fix;          
    current.confidence_score = confidence;  

    // 3. Set Remediation Status based on Governance Logic
    if (confidence >= 90) {
        current.remediation_status = 'auto_fixing'; // Triggers Flow
    } else if (confidence >= 70) {
        current.remediation_status = 'human_review'; 
    } else {
        current.remediation_status = 'analyzing'; 
    }

})(current, previous);
