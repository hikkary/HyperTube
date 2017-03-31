import torrentStream from 'torrent-stream';
import path from 'path';
import _ from 'lodash';
import mongoose from 'mongoose';
import { Movie, Serie, User } from '../Schema';
import fs from 'fs';
import Transcoder from 'stream-transcoder';
import ffmpeg from 'ffmpeg';
// const myFile = `https://yts.ag/torrent/download/02C577D9A9CC90FFCCFC69082D03F74A0C8DD306`;

// faire un filter qui recoit le file le plus lourd

export const movieTorrent = async(req, res) => {
  console.log('HELLO');
  console.log('BACK HASH', req.params.hash);
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
      'udp://tracker.ccc.de:80',
    ],
                            // Allows to declare additional custom trackers to use
                            // Defaults to empty
      // storage: '.'  // Use a custom storage backend rather than the default disk-backed one

  };
  console.log(1);
  const engine = await torrentStream(req.params.hash, options);
  let videoFile = '';
  let videoSent = 0;
  let stream = '';
  console.log(2);

  engine.on('ready', () => {
    console.log("ANGINE ",engine.file);
    videoFile = engine.files.filter((file) => {
      console.log('file', file);
      // console.log('type video filename', typeof (file.name));
      console.log(3);

      const pathFile = path.extname(file.name);

      console.log('pathfile', pathFile);
      if (pathFile === '.mp4' || pathFile === '.mkv' || pathFile === '.avi') {
        return (file);
      }
      console.log(4);

    });
    const videoLength = videoFile[0].length;
    const range = req.headers.range;
    if (!range) return res.sendStatus(416);
    const positions = range.replace(/bytes=/, '').split('-');
    const start = parseInt(positions[0], 10);
    const fileSize = videoLength;
    const end = positions[1] ? parseInt(positions[1], 10) : fileSize - 1;
    const chunksize = (end - start) + 1;
    console.log(3);

    res.writeHead(206, {
      'Content-Range': `bytes ${start}-${end}/${fileSize}`,
      'Accept-Ranges': 'bytes',
      'Content-Length': chunksize,
      'Content-Type': `video/${path.extname(videoFile[0].name)}`,
    });
        // qu'est ce que start? a quoi ca correspond?
    console.log('start : ', start, ' - end : ', end);
    stream = videoFile[0].createReadStream({ start, end });
    console.log(4);
    return stream.pipe(res);


  });
  engine.on('download', () => {
    const download = engine.swarm.downloaded;
    console.log('download', download);
    console.log(Math.floor((engine.swarm.downloaded * 8) / 10000024), 'M', videoFile[0].path);
    const checkSize = videoFile[0].length / 5;
    console.log('checkSize', checkSize);
    // if (download >= checkSize && videoSent === 0){
    //   videoSent = 1;
    // }
    console.log(4);

  });
  engine.on('idle', () => {
    console.log('download Complete', videoFile[0].path);
        // a tester a l'ecole insert in db
    console.log('ID', req.params.id);
    Movie.findOne({ id: req.params.id })
          .then((movie) => {
            if (movie) {
              console.log('Video Path', videoFile[0].path);
              // console.log(engine.files[0]); trouver le filename du ready
              const hash = req.params.hash;
              movie.path = { ...movie.path, [hash]: { path: videoFile[0].path } };
              movie.save();
            }
          });
  });
};

export const serieTorrent = (req, res) => {
  console.log('BACK HASH', req.params.hash);
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
      'udp://tracker.ccc.de:80',
    ],
                            // Allows to declare additional custom trackers to use
                            // Defaults to empty
      // storage: '.'  // Use a custom storage backend rather than the default disk-backed one

  };

  const engine = torrentStream(req.params.hash, options);
  let videoFile = '';
  let videoSent = 0;
  let stream = '';
  engine.on('ready', () => {
    console.log(engine.files);
    videoFile = engine.files.filter((file) => {
      console.log('file', file);
      console.log('type video filename', typeof (file.name));
      const pathFile = path.extname(file.name);
      console.log('pathfile', pathFile);
      if (pathFile === '.mp4' || pathFile === '.mkv' || pathFile === '.avi') {
        return (file);
      }
    });
    const videoLength = videoFile[0].length;

    const range = req.headers.range;
    if (!range) {
      return res.sendStatus(416);
    }
    const positions = range.replace(/bytes=/, '').split('-');
    const start = parseInt(positions[0], 10);
    const file_size = videoLength;
    const end = positions[1] ? parseInt(positions[1], 10) : file_size - 1;
    const chunksize = (end - start) + 1;

    res.writeHead(206, {
      'Content-Range': `bytes ${start}-${end}/${file_size}`,
      'Accept-Ranges': 'bytes',
      'Content-Length': chunksize,
      'Content-Type': `video/${path.extname(videoFile[0].name)}`,
    });
      // res.writeHead(200, { 'Content-Length': videoLength, 'Content-Type': `video/${path.extname(videoFile[0].name)}` });
    // console.log('start : ', start, ' - end : ', end);
    //
    // console.log('VIDEO FILE', videoFile[0].name);
    // console.log('length', videoLength);




    stream = videoFile[0].createReadStream({ start, end });
        //  stream.unpipe(res);
    return stream.pipe(res);

  });
  engine.on('download', async () => {
    let download = engine.swarm.downloaded;
    console.log(Math.floor((engine.swarm.downloaded * 8) / 10000024), 'M', videoFile[0].path);

    const checkSize = videoFile[0].length / 3;
    console.log('checkSize', checkSize);
    // if (download >= checkSize && videoSent === 0){
    //   console.log("STREAM ASTAR");
    //   videoSent = 1;
    // }

  });
  engine.on('idle', () => {
    console.log('download Complete', videoFile[0].path);
    console.log('ID', req.params.serie_id);
    Serie.findOne({ imdb_code: req.params.serie_id })
      .then((serie) => {
        if (serie) {
          let episodeInfo = serie.content.filter((episode) => {
            console.log('tvdb', episode.tvdb_id);
            console.log('id', req.params.id);
            if (episode.tvdb_id === Number(req.params.id)) {
              console.log('je rentre dans le if jai trouve le match');
              return episode;
            }
          });
          const hash = req.params.hash;

          // episodeInfo.path = {...episodeInfo.path, [hash]: {path: videoFile[0].path }}
          console.log('espisode info', episodeInfo);
          const path = { ...episodeInfo[0].path, [hash]: {path: videoFile[0].path }}

          episodeInfo = { ...episodeInfo[0], path};
          console.log('apre perers', episodeInfo);
          const index = _.indexOf(serie.content, _.find(serie.content, { tvdb_id: episodeInfo.tvdb_id }));
          serie.content.splice(index, 1, episodeInfo);
          // serie.content[index].path = videoFile[0].path;
          // console.log('SERIE ', serie.content[index]);
          // serie.set(index, serie.content[index]);
          serie.save((err, result) => console.log(err));
        }
      });
  });
};
