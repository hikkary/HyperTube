import torrentStream from 'torrent-stream';
import path from 'path';
import _ from 'lodash';
import mongoose from 'mongoose';
import { Movie, Serie, User } from '../Schema';
import fs from 'fs';
import Transcoder from 'stream-transcoder';
import ffmpeg from 'ffmpeg';

export const movieTorrent = async (req, res) => {
  const options = {
    connections: 5000,
    uploads: 10,
    tmp: './public',
    path: './public/Media',
    verify: true,
    dht: true,
    tracker: true,
    trackers: [
      'udp://tracker.openbittorrent.com:80',
      'udp://tracker.ccc.de:80',
    ],
  };
  const engine = await torrentStream(req.params.hash, options);
  let videoFile = '';
  let stream = '';
  let finalPathFile = '';
  engine.on('ready', () => {
    videoFile = engine.files.filter((file) => {
      const pathFile = path.extname(file.name);
      if (pathFile === '.mp4' || pathFile === '.mkv' || pathFile === '.avi') {
        finalPathFile = pathFile;
        return (file);
      }
    });
    const videoLength = videoFile[0].length;
    const range = req.headers.range;
    if (!range) return res.sendStatus(416);
    const positions = range.replace(/bytes=/, '').split('-');
    const start = parseInt(positions[0], 10);
    const fileSize = videoLength;
    const end = positions[1] ? parseInt(positions[1], 10) : fileSize - 1;
    const chunksize = (end - start) + 1;
    let mime = videoFile[0].name.split('.');
    mime = _.last(mime);

	if (finalPathFile !== '.avi') {
      res.writeHead(200, {
        'Content-Length': videoLength,
        'Content-Type': `video/${mime}`,
      });
	  stream = videoFile[0].createReadStream({ start, end });
      return stream.pipe(res);
    } else {
    res.writeHead(200, {
      'Content-Length': videoLength,
      'Content-Type': `video/${mime}`,
    });
    stream = videoFile[0].createReadStream({ start, end });

    new Transcoder(stream)
        .videoCodec('h264')
        .audioCodec('aac')
        .format('mp4')
        .on('finish', () => {
          console.log('LA CONVERSION EST FINI');
        })
        .stream().pipe(res);
	}
  });
  engine.on('download', () => {
    console.log(Math.floor((engine.swarm.downloaded * 8) / 10000024), 'M', videoFile[0].path);
  });
  engine.on('idle', () => {
    console.log('download Complete', videoFile[0].path);
    Movie.findOne({ id: req.params.id })
          .then((movie) => {
            if (movie) {
              const hash = req.params.hash;
              movie.path = { ...movie.path, [hash]: { path: videoFile[0].path } };
              movie.save();
            }
          });
  });
};

// =================================== SERIE ====================================
// ==============================================================================

export const serieTorrent = (req, res) => {
  const options = {
    connections: 5000,
    uploads: 10,
    tmp: './public',
    path: './public/Media',
    verify: true,
    dht: true,
    tracker: true,
    trackers: [
      'udp://tracker.openbittorrent.com:80',
      'udp://tracker.ccc.de:80',
    ],
  };
  let tab = [];
  const engine = torrentStream(req.params.hash, options);
  console.log("DANS SERIE TORRENT", req.params);
  let videoFile = '';
  let stream = '';
  let finalPathFile = '';
  engine.on('ready', () => {
	  console.log("=====================================");
	  console.log("DANS ENGINE READY");
	  console.log("======================================");
    videoFile = engine.files.filter((file) => {
      const pathFile = path.extname(file.name);
      if (pathFile === '.mp4' || pathFile === '.mkv' || pathFile === '.avi') {
        finalPathFile = pathFile;
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
    const fileSize = videoLength;
    const end = positions[1] ? parseInt(positions[1], 10) : fileSize - 1;
    const chunksize = (end - start) + 1;
    let mime = videoFile[0].name.split('.');
    mime = _.last(mime);
    if (mime === 'avi') {
      mime = 'mp4';
    }
    if (finalPathFile !== '.avi') {
      res.writeHead(200, {
        'Content-Length': videoLength,
        'Content-Type': `video/${mime}`,
      });
      stream = videoFile[0].createReadStream({ start, end });
      return stream.pipe(res);
    } else {
    res.writeHead(200, {
      'Content-Length': videoLength,
      'Content-Type': `video/${mime}`,
    });

    stream = videoFile[0].createReadStream({ start, end });

    new Transcoder(stream)
        .videoCodec('h264')
        .audioCodec('aac')
        .format('mp4')
        .on('finish', () => {
          console.log('LA CONVERSION EST FINI');
        })
        .stream().pipe(res);
    }
  },

  );
  engine.on('download', async () => {

    const download = engine.swarm.downloaded;
    	console.log(Math.floor((engine.swarm.downloaded * 8) / 10000024), 'M');
  });
  engine.on('idle', () => {
	  console.log("=====================================");
	  console.log("DANS DOWNLOAD COMPLETE");
	  console.log("======================================");
    console.log('download Complete', videoFile[0].path);
    Serie.findOne({ imdb_code: req.params.serie_id })
      .then((serie) => {
        if (serie) {
			console.log("*****************************************");
			console.log("DANS FILE SERIE TORRENT");
			console.log("*****************************************");

          let episodeInfo = serie.content.filter((episode) => {
            if (episode.tvdb_id === Number(req.params.id)) {
              console.log('je rentre dans le if jai trouve le match');
              return episode;
            }
          });
          const hash = req.params.hash;
          const path = { ...episodeInfo[0].path, [hash]: { path: videoFile[0].path } };
          episodeInfo = { ...episodeInfo[0], path };
          const index = _.indexOf(serie.content, _.find(serie.content, { tvdb_id: episodeInfo.tvdb_id }));
          serie.content.splice(index, 1, episodeInfo);
          serie.save().catch();
		  console.log("----------------------------------------");
        }
      });
  });
};

export const mediaLocalStream = (req, res) => {
console.log("MEDIA LOCAL STREAM");
  const { path, path2 } = req.params;
  let completePath = '';
  if (path && path2) {
    completePath = `./public/Media/${path}/${path2}`;
  } else if (path && !path2) {
    completePath = `./public/Media/${path}`;
  } else {
    return res.send({ status: false, errors: 'badPath' });
  }
  const stat = fs.statSync(completePath)
  const stream = fs.createReadStream(completePath, {});

  res.writeHead(200, {
  'Content-Length': stat.size,
  'Content-Type': 'video/mp4',
  });
  new Transcoder(stream)
	.on('metadata', (input) => {
	console.log("input",input.input.streams);
	  console.log("output",input.output.streams);

  } )
  .videoCodec('h264')
  .audioCodec('aac')
  .format('mp4')
  .on('finish', () => {
  console.log('LA CONVERSION EST FINI');
  })
  .stream().pipe(res);
};
