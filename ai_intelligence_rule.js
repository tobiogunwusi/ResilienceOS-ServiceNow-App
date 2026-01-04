(function executeRule(current, previous /*null when async*/) {

    var errorLog = current.error_payload.toString(); 
    var analysis = "";
    var fix = "";
    var confidence = 0;

  
    if (errorLog.indexOf("Memory") > -1 || errorLog.indexOf("Heap") > -1) {
        analysis = "<b>Root Cause:</b> Java Heap Space exhaustion detected.";
        fix = "<b>Recommended Action:</b> <br>1. Flush JVM Cache.<br>2. Restart Tomcat.";
        confidence = 98; // HIGH .... Auto-Fix
    
    } else if (errorLog.indexOf("Disk") > -1 || errorLog.indexOf("IO") > -1) {
        analysis = "<b>Root Cause:</b> Critical Disk I/O Latency.";
        fix = "<b>Recommended Action:</b> Expand Volume SG-01.";
        confidence = 85; // MEDIUM ... Human Review 

    } else {
        analysis = "<b>Root Cause:</b> Generic Error.";
        fix = "<b>Recommended Action:</b> Check Logs.";
        confidence = 45; 
    }

   
    current.ai_root_cause = analysis;       
    current.suggested_fix = fix;          
    current.confidence_score = confidence;  


    if (confidence >= 90) {
        current.remediation_status = 'auto_fixing'; 
    } else if (confidence >= 70) {
        current.remediation_status = 'human_review'; 
    } else {
        current.remediation_status = 'analyzing'; 
    }

})(current, previous);
