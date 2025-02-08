const express = require('express');
const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');
const cors = require('cors');

const app=express();
const port = 3000;

//CORS 미들웨어 사용
app.use(cors());

//csv 파일 경로
const csvFilePath = path.join(__dirname, 'words.csv');

//단어 데이터 저장 배열
let words = [];

//csv 파일 파싱싱
fs.createReadStream(csvFilePath)
    .pipe(csv())
    .on('data', (row) => {
        words.push(row);
    })
    .on('end', ()=>{
        console.log('words.csv 파일 파싱 완료');
    });

//단어 제공 API
app.get('/random-word', (req, res) => {
    if(words.length==0) {
        return res.status(500).json({error: '단어 목록을 불러오는데 실패했습니다.'});    
    }

    //랜덤 단어 선택
    const randomIndex = Math.floor(Math.random()*words.length);
    const selectedWord = words[randomIndex];

    res.json({
        word: selectedWord.word,
        pronunciation: selectedWord.pronunciation,
        meaning: selectedWord.meaning,
        example: selectedWord.example
    });
});

app.use(express.static(path.join(__dirname)))

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'))
})
app.listen(port, function() {
    console.log(`서버가 http://localhost:${port}에서 실행 중입니다.`)
})
