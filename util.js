/**
 * @author Nivedha
 *
 */
/**
 * This method is responsible for writing err/response to response
 *
 * @param   {Object}    err       error from endpoint processing if any
 * @param   {Object}    result    result from endpoint processing if any
 * @param   {Object}    response  http response object
 */
function processResponse(err, result) {
    var response =[];
    if (!err && result) {
        response['code'] = 200 ;
        response['message'] = result ;
    } else {
        const statusCode = err && err.statusCode ? err.statusCode : 500;
        const message = err && err.message ? err.message : 'Internal error processing the request';
        response['code'] =statusCode ;
        response['message'] = message ;
    }
    return response;
}

module.exports={
    processResponse:processResponse
};