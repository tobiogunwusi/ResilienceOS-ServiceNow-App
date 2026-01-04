(function process(/*RESTAPIRequest*/ request, /*RESTAPIResponse*/ response) {

   
    var requestBody = request.body.data;
    var serverName = requestBody.server;       
    var errorLog = requestBody.error;          
    var source = requestBody.source;           

 
    var result = {};

   
    var grAlert = new GlideRecord('x_1183354_resili_0_resilience_alert'); 
    
    grAlert.initialize();
    grAlert.short_description = "GenAI Alert: " + serverName;
    grAlert.source_system = source;      
    grAlert.error_payload = errorLog;    
    grAlert.remediation_status = 'new';  
    
    
    var sysId = grAlert.insert();

   
    if (sysId) {
        result.status = "Success";
        result.message = "Alert Created";
        result.alert_number = grAlert.number + "";
        result.sys_id = sysId;
        response.setStatus(201);
    } else {
        result.status = "Error";
        result.message = "Could not create record. Check table permissions.";
        response.setStatus(500);
    }

    response.setBody(result);

})(request, response);
