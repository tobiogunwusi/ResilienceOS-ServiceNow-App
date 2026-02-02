(function process(/*RESTAPIRequest*/ request, /*RESTAPIResponse*/ response) {

    // 1. Parse Inputs
    var requestBody = request.body.data;
    var serverName = requestBody.server;       
    var errorLog = requestBody.error;          
    var source = requestBody.source;           

    var result = {};

    // 2. Initialize the Alert Record
    var grAlert = new GlideRecord('x_1183354_resili_0_resilience_alert'); 
    grAlert.initialize();

    // --- START BINDING LOGIC (The Magic) ---
    // Look up CI in the Hardware table
    if (serverName) {
        var ciLookup = new GlideRecord('cmdb_ci_hardware');
        ciLookup.addQuery('name', serverName);
        ciLookup.setLimit(1); 
        ciLookup.query();

        if (ciLookup.next()) {
            // FOUND IT! Link the specific Sys ID
            // CHECK THIS FIELD NAME: Is it 'cmdb_ci' or 'configuration_item'?
            grAlert.cmdb_ci = ciLookup.getUniqueValue(); 
        } else {
            // NOT FOUND: Add warning 
            grAlert.description = "⚠️ WARNING: CI [" + serverName + "] not found in CMDB.\n\n" + errorLog;
        }
    }
    // --- END BINDING LOGIC ---

    // 3. Set the rest of the fields
    grAlert.short_description = "GenAI Alert: " + serverName;
    grAlert.source_system = source;      
    grAlert.error_payload = errorLog;    
    grAlert.remediation_status = 'new';  
    
    // 4. Insert and Respond
    var sysId = grAlert.insert();

    if (sysId) {
        result.status = "Success";
        result.message = "Alert Created";
        result.alert_number = grAlert.number + "";
        result.sys_id = sysId;
        
        // Return the CI Name if found
        if (grAlert.cmdb_ci) {
            result.bound_ci = grAlert.cmdb_ci.name + "";
        } else {
            result.bound_ci = "Unbound";
        }

        response.setStatus(201);
    } else {
        result.status = "Error";
        result.message = "Could not create record. Check table permissions.";
        response.setStatus(500);
    }

    response.setBody(result);

})(request, response);
