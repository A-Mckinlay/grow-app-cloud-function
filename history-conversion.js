function handleGET(req, res) {
    // Do something with the GET request
    res.status(403).send('Forbidden!');
}

function handlePUT(req, res) {
    // Do something with the PUT request
    res.status(403).send('Forbidden!');
}

function handlePOST(req, res) {
    const FlowerPowerHistory = require('flower-power-history')
    const fs = require('fs')
    const path = require('path');
    const os = require('os');
    const tmpdir = os.tmpdir()

    const b64History = req.body;
    const filePath = path.join(tmpdir, 'history.csv')

    const history = FlowerPowerHistory(b64History)
    const stream = fs.createWriteStream(filePath)
    stream.once('open', (fd) => {
        history.writeCSV(stream)
        stream.end()
    })

    const stat = fs.statSync(filePath)
    res.writeHead(200, {
        'Content-Type': 'text/csv',
        'Content-Length': stat.size
    })

    const readStream = fileSystem.createReadStream(filePath)
    // We replaced all the event handlers with a simple call to readStream.pipe()
    readStream.pipe(res);
}

/**
 * Responds to a GET request with "Hello World!". Forbids a PUT request.
 *
 * @example
 * gcloud alpha functions call helloHttp
 *
 * @param {Object} req Cloud Function request context.
 * @param {Object} res Cloud Function response context.
 */
exports.growAppFunctions = (req, res) => {
    switch (req.method) {
        case 'POST':
            handlePOST(req, res);
            break;
        case 'GET':
            handleGET(req, res);
            break;
        case 'PUT':
            handlePUT(req, res);
            break;
        default:
            res.status(500).send({ error: 'Something blew up!' });
            break;
    }
};