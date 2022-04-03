const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const fs = require('fs');
const { get } = require('http');

const app = express();
app.use(cors());
app.use(bodyParser.json());

const PORT = 3000;

app.get('/', (req, res) => {
  res.json({
   message: "HELLO"
  })
});

app.get('/workers', (req, res) => {
  
  fs.readFile('./workers.json', (err, data) => {
    if (err) {
      console.error(err)
      return
    }
    if (data.toString().length === 0) {
      res.json([]);
      return;
    }
   res.json(JSON.parse(data.toString()))
  });
});


app.post('/workers', (req, res) => {
  const body = req.body
  const data = fs.readFileSync('./workers.json')
  const myObj = JSON.parse(data)

  let getId 
   for (let i = 0; i < myObj.length; i++) {
    getId = Number(myObj[i].id) 
      if(getId) {
        body.id = getId + 1
      }
   }
  
  //const id = `${body.name}_${myObj.length + 1}`;
  //body.id = id;
  myObj.push(body)
  const newData = JSON.stringify(myObj)
  
  fs.writeFile('./workers.json', newData, err => {
    if(err) {
      res.json({
        success: false
      });
      throw err;
    }   
  })
  res.json({
    success: true
  });
})
//delete data

app.post("/workers/delete", (req, res) => {
  const getDeletedBody = req.body;
  const data = fs.readFileSync('./workers.json');
  const myObj = JSON.parse(data);

  let getIndex; 

  for (let i = 0; i < myObj.length; i++) {
    if (myObj[i].id === getDeletedBody.id) {
       getIndex = i
    }      
  }
   if (getIndex !== undefined) {
     myObj.splice(getIndex, 1);
    }

  const deletedData = JSON.stringify(myObj)
  
  fs.writeFile('./workers.json', deletedData, err => {
    if(err) {
      res.json({
        success: false
      });
      throw err
    }
  });

  res.json({
    success: true
  });
});

app.listen(PORT, () => {
    console.log("Server running on port " + PORT)
});
