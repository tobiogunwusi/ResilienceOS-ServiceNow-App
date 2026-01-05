(function executeRule(current, previous /*null when async*/) {

    var STATUS_ANALYZING = 'analyzing';
    var STATUS_AUTOFIX   = 'auto_fixing';
    var STATUS_REVIEW    = 'human_review';

    
    var THRESHOLD_HIGH  = 90; 
    var THRESHOLD_LOW   = 60; 

    var score = parseInt(current.confidence_score, 10);

    
    if (score >= THRESHOLD_HIGH && current.remediation_status == STATUS_ANALYZING) {
        
        gs.addErrorMessage('Governance Violation: High Confidence items (Score: ' + score + ') cannot be downgraded to "Analyzing".');
        current.setAbortAction(true); 
        return;
    }

    
    if (score < THRESHOLD_LOW && current.remediation_status == STATUS_AUTOFIX) {
        
        gs.addErrorMessage('Governance Violation: ResilienceOS blocks Auto-Fixing for low confidence items (Score: ' + score + '). Please verify manually.');
        current.setAbortAction(true); 
        return;
    }

})(current, previous);
