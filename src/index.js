const yargs = require('yargs');
const ytdl = require('ytdl-core');
const ffmpegPath = require('ffmpeg-static');
const ffmpeg = require('fluent-ffmpeg');
const path = require('path');

const options = yargs
    .usage('Usage: -v <video_id>')
    .option('v', {
        alias: 'video',
        describe: 'YouTube video ID',
        demandOption: true
    })
    .argv;


async function toMp3(videoUrl, outputDirectory) {
    console.log("Downloading...");
    try {
        const info = await ytdl.getInfo(videoUrl);
        const title = info.videoDetails.title.replace(/[^\w\s]/gi, ''); // Remove special characters from the title
        const videoReadableStream = ytdl(videoUrl, { filter: 'audioonly' });

        ffmpeg.setFfmpegPath(ffmpegPath);
        const outputPath = path.join(outputDirectory, `${title}.mp3`);
        ffmpeg(videoReadableStream)
            .format('mp3')
            .save(outputPath)
            .on('end', () => {
                console.log('Downloaded!');
            });
    } catch (error) {
        console.error('Error:', error);
    }
}

if (options.v) toMp3(options.v, "./output/")