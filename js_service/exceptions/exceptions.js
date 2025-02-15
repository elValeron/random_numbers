class FieldError extends Error {
    constructor(statusCode, message){
        super(message);
        this.statusCode=statusCode
        this.message=message
    }
}
class GRPCError extends FieldError{
    constructor(statusCode, message){
        super(statusCode, message);
    }
}

module.exports = { FieldError, GRPCError };