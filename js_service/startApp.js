const app = require('./app/randomNumberApp')
const PORT = process.env.PORT || 3000;

const server = app.listen(PORT, () => {
    console.log(`Client is running on port ${PORT}`);
});

module.exports = { server, app };