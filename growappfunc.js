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
    
    stream.once('close', (fd) => {
        const stat = fs.statSync(filePath)
        res.writeHead(200, {
            'Content-Type': 'text/csv',
            'Content-Length': stat.size,
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST'
        })
        const readStream = fs.createReadStream(filePath)
        readStream.pipe(res);
    })  
}

/**
 * Responds to a POST request with csv of history file recieved.
 *
 *
 * @param {Object} req Cloud Function request context.
 * @param {Object} res Cloud Function response context.
 */
exports.growappfunc = (req, res) => {
    switch (req.method) {
        case 'POST':
            handlePOST(req, res);
            break;
        default:
            res.status(500).send({ error: 'Something blew up!' });
            break;
    }
};