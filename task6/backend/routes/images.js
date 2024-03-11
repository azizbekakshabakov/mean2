var express = require('express');
var router = express.Router();
const {Task, validate} = require('../schemas/task');
const authMiddleware = require('../middleware/auth');
const {Dropbox} = require('dropbox');
const multer = require('multer');
const creds = require('../atlasCreds');

const upload = multer();
const dbx = new Dropbox({ accessToken: creds.dropbox_token });

router.post('/upload', upload.single('file'), (req, res) => {
  const fileContent = req.file.buffer;
  console.log(req.file.originalname, "alksdfuhlaisduhflasikjdfn");

  dbx.filesUpload({ path: '/' + req.file.originalname, contents: fileContent })
    .then(response => {
      console.log('File uploaded successfully:', response.result.name);
      res.send('File uploaded successfully');
    })
    .catch(error => {
      console.error('Error uploading file:', error);
      res.status(500).send('Error uploading file');
    });
});

// router.get("/", async (req, res) => {
//   const response = await dbx.filesListFolder({ path: '' })
//     // .then(response => {
//     //   response.result.entries.forEach(entry => {
//     //     console.log(entry.name);
//     //     console.log('asdfasdfasdf', entry);
//     //   });
//     // })
//     // .catch(error => {
//     //   console.error(error);
//     // });

//   const files = response.result.entries;
//   console.log('FILES', files);

//   res.status(200).send({ data: files });
// });

router.get('/', async (req, res) => {
  try {
    const folderPath = ''; // Specify the folder path
    const response = await dbx.filesListFolder({ path: folderPath });

    const filesInfo = response.result.entries
      .filter(entry => entry['.tag'] === 'file')
      .map(entry => ({
        name: entry.name,
        id: entry.id,
        server_modified: entry.server_modified,
        size: entry.size,
        link: null
      }));

    await Promise.all(filesInfo.map(async fileInfo => {
      const linkResponse = await dbx.filesGetTemporaryLink({ path: folderPath + '/' + fileInfo.name });
      fileInfo.link = linkResponse.result.link;
    }));

    res.json(filesInfo);
  } catch (error) {
    console.error('Error Dropbox:', error);
    res.status(500).json({ error: 'Error Dropbox' });
  }
});

router.delete('/delete/:filename', async (req, res) => {
  try {
    const filename = req.params.filename;

    const deleted = await dbx.filesDeleteV2({ path: '/'+filename });

    console.log(deleted);

    res.status(200).send('Фаил удолён');
  } catch (error) {
    console.error('Ошипко:', error);
    res.status(500).json({ error: 'Ошипко' });
  }
});

module.exports = router;
