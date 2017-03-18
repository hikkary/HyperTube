import torrentStream from 'torrent-stream';
import mongoose from 'mongoose';
import { Movie } from '../Schema';
import fs from 'fs';
// const myFile = `https://yts.ag/torrent/download/02C577D9A9CC90FFCCFC69082D03F74A0C8DD306`;

// faire un filter qui recoit le file le plus lourd

export const torrent = (req, res) => {
console.log('hash', req.params.hash);
  const options = {
    connections: 5000,     // Max amount of peers to be connected to.
      uploads: 10,          // Number of upload slots.
      tmp: './public',          // Root folder for the files storage.
                            // Defaults to '/tmp' or temp folder specific to your OS.
                            // Each torrent will be placed into a separate folder under /tmp/torrent-stream/{infoHash}
      path: './public/Media', // Where to save the files. Overrides `tmp`.
      verify: true,         // Verify previously stored data before starting
                            // Defaults to true
      dht: true,            // Whether or not to use DHT to initialize the swarm.
                            // Defaults to true
      tracker: true,        // Whether or not to use trackers from torrent file or magnet link
                            // Defaults to true
      trackers: [
          'udp://tracker.openbittorrent.com:80',
          'udp://tracker.ccc.de:80'
      ],
                            // Allows to declare additional custom trackers to use
                            // Defaults to empty
      // storage: '.'  // Use a custom storage backend rather than the default disk-backed one

  }

  const engine = torrentStream(req.params.hash,options);

  engine.on('ready', function() {
    console.log(engine.files);
      engine.files.forEach(function(file) {
        // file = engine.files[0];
        // console.log("FILE NAME ",file);
        // console.log('filename:', file.name);
        // console.log('file path:', file.path);
        // console.log('filename:', file);
          const stream = file.createReadStream();
          engine.on('download', () => {
            console.log(Math.floor((engine.swarm.downloaded * 8)/10000024),"M")
            // stream.pipe(res);
            response.setHeader();
            res.writeHead(200);
          });
          // const writeStream = fs.createWriteStream('./public/output.mp4');
          // console.log('var stream', stream);
          // const test = stream.pipe(writeStream);
          // console.log('TEST', test);
          // console.log('STREAM', writeStream);
      });
  });

  engine.on('idle', () => {
    console.log('download Complete');
    // a tester a l'ecole insert in db
    Movie.findOne({ id: req.body.id })
      .then((movie) => {
        if (movie) {
          // console.log(engine.files[0]); trouver le filename du ready
          movie.path = engine.files[0].path;
          movie.save();
        }
      });
  });
}
