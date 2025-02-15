const { GRPCError } = require("../exceptions/exceptions")

const checkGRPCErrors = (error) => {
    if (!!(error)) {
        throw new GRPCError(500, "GRPC Error")
        }
}
const checkResponseIsNotEmpty = (response) => {
    if (!response) {
        throw new GRPCError(500, "Numbers not found")
    }
}

module.exports = { checkResponseIsNotEmpty, checkGRPCErrors };