import torrentStream from 'torrent-stream';

// const myFile = `https://yts.ag/torrent/download/02C577D9A9CC90FFCCFC69082D03F74A0C8DD306`;

//on recoit id
//

export const torrent = (req, res) => {

  const options = {
    connections: 5000,     // Max amount of peers to be connected to.
      uploads: 10,          // Number of upload slots.
      tmp: './src/torrent/Downloads',          // Root folder for the files storage.
                            // Defaults to '/tmp' or temp folder specific to your OS.
                            // Each torrent will be placed into a separate folder under /tmp/torrent-stream/{infoHash}
      path: './src/torrent/Downloads/Media', // Where to save the files. Overrides `tmp`.
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

  const engine = torrentStream('04E1DE5846D47B6C487C6CA77782918C02CA0903',options);

  engine.on('ready', function() {
    console.log(engine.files);
      engine.files.forEach(function(file) {
        // file = engine.files[0];
        console.log("FILE NAME ",file);
        console.log('filename:', file.name);
        console.log('file path:', file.path);
        console.log('file length:', file.length);
        console.log('filename:', file);
          var stream = file.createReadStream();
      });
  });
  engine.on('download', () => {
    console.log(Math.floor((engine.swarm.downloaded * 8)/10000024),"M")
  });
  engine.on('idle', () => {
    console.log('download Complete');
  });
}
