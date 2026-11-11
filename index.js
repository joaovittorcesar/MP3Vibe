const express = require('express');
const ytdl = require('ytdl-core');
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.set('view engine', 'ejs');

app.listen(3000, () => {
  console.log('Bot Iniciado!');
});

app.get('/mp3vibe/', (req, res) => {
  res.render('index');
});

process.on("unhandledRejection", (reason, p) => {
  console.log(reason, p);
});

process.on("uncaughtException", (err, origin) => {
  console.log(err, origin);
});

app.get('/mp3vibe/download', async (req, res) => {
  const url = req.query.resultado;

  if (!url) {
    return res.status(400).send('Erro: Nenhum ID de vídeo fornecido.');
  }

  const selectedFormat = req.query.format || 'mp3';

  try {
    const info = await ytdl.getInfo(url);
    const title = info.videoDetails.title;
    const author = info.videoDetails.author;
    const thumbnail = info.videoDetails.thumbnails[0].url;

    let contentType;

    if (selectedFormat === 'mp3') {
      contentType = 'audio/mpeg';

      res.header('Content-Disposition', `attachment; filename="${title}.${selectedFormat}"`);
      res.header('Content-Type', contentType);

      res.header('X-Title', title);
      res.header('X-Author', author);
      res.header('X-Thumbnail', thumbnail);

      ytdl(url, { filter: 'audioonly', quality: audioQuality }).pipe(res);
    } else if (selectedFormat === 'mp4') {
      contentType = 'video/mp4';

      res.header('Content-Disposition', `attachment; filename="${title}.${selectedFormat}"`);
      res.header('Content-Type', contentType);

      res.header('X-Title', title);
      res.header('X-Author', author);
      res.header('X-Thumbnail', thumbnail);

      ytdl(url, { filter: 'audioandvideo', quality: videoQuality }).pipe(res);
    } else {
      return res.status(400).send('Erro: Formato não suportado.');
    }

  } catch (error) {
    res.status(500).send('Erro interno do servidor ao processar a solicitação.');
  }
});
