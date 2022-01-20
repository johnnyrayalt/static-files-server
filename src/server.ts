import express, { Request, Response, NextFunction } from 'express';

import * as http from "http";
import path from "path";
import * as fs from "fs";
import cors from 'cors';

const server = express();
const port = 4200;
const dir = path.join(__dirname, '../public');
const corsOptions = {
    origin: `http://localhost:${port}`,
    optionsSuccessStatus: 200,
}

// Middleware
server.use(express.static(dir))
server.use(cors(corsOptions));
server.use(express.urlencoded({
    extended: true
}));

// Routes
server.use('/images/*', (req: Request, res: Response, next: NextFunction) => {
    const url = `${path.dirname(req.baseUrl)}/${path.basename(req.originalUrl)}`

    fs.readdir(dir + url, (err, files) => {
        if (err) return new Error(err.message);

        const prerenderedImgTags = files
            .sort((a, b) =>
                a.localeCompare(b, 'en-US', { numeric: true, ignorePunctuation: true}))
            .map(file => (`http://localhost:4200${url}/${file}`));

        res.status(200).json({ data: prerenderedImgTags });
    })
})

http.createServer(server).listen(port, () => {
    console.log(`Server is listening on port ${port}!`)
})