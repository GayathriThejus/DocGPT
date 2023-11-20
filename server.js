const express = require('express');
const fileUpload = require('express-fileupload');

const app = express();



//openai
const cors = require('cors');
const bodyParser = require('body-parser');

const { Configuration, OpenAIApi }=require('openai');

const config=new Configuration({
    apiKey:  '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'  ,
})

const openai = new OpenAIApi(config);


app.use(cors()); // Corrected usage
app.use(bodyParser.json()); // Corrected usage


app.use(fileUpload());


//endpoint for gpt
app.post("/chat",async (req, res) => {
    const{ prompt }=req.body;

    const completion = await openai.createCompletion({
        model: "text-davinci-003",
        max_tokens:512,
        temperature :0,
        prompt :prompt,
    });

    res.send(completion.data.choices[0].text);

})
// Upload Endpoint
app.post('/upload', (req, res) => {
  if (req.files === null) {
    return res.status(400).json({ msg: 'No file uploaded' });
  }






  const file = req.files.file;

  file.mv(`${__dirname}/client/public/uploads/${file.name}`, err => {
    if (err) {
      console.error(err);
      return res.status(500).send(err);
    }

    res.json({ fileName: file.name, filePath: `/uploads/${file.name}` });
  });
});

app.listen(5000, () => console.log('Server Started...'));