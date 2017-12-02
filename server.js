const express = require('express');
const hbs = require('hbs');
const fs = require('fs');

var app = express();

hbs.registerPartials(__dirname + '/views/partials')
app.set('view engine', 'hbs');

// 로그 파일을 생성하기 위한 미들웨어
app.use((req, res, next) => {
  var now = new Date().toString();

  // req.method(요청방식), req.url(요청 URL)
  var log = `${now}: ${req.method} ${req.url}`;

  console.log(log);
  // 로그파일 추가: 요청이 생길때 마다 로그가 추가됨
  fs.appendFile('server.log', log + '\n', (err) => {
    if (err) {
      console.log('log file read error.')
    }
  });
  next();
});

/*
  - 유지 보수 페이지 
  유지 보수중에는 다른 페이지를 접근 못하게 해야하므로 모든 URL 접근을 이 페이지로 구속
  다음 미들웨어로 넘어가지 않게 하기 위해 nex() 안함
*/  
// app.use((req, res, next) => {
//   res.render('maintenance.hbs');
// });

// 정적 문서도 유지보수시 접근 제한을 위해 미들웨어 위치를 아래로 조정
app.use(express.static(__dirname + '/public'));

hbs.registerHelper('getCurrentYear', () => {
  return new Date().getFullYear();
});

hbs.registerHelper('screamIt', (text) => {
  return text.toUpperCase();
});

app.get('/', (req, res) => {
  res.render('home.hbs', {
    pageTitle: 'Home Page',
    welcomeMessage: 'Welcome to my website'
  });
});

app.get('/about', (req, res) => {
  res.render('about.hbs', {
    pageTitle: 'About Page'
  });
});

// /bad - send back json with errorMessage
app.get('/bad', (req, res) => {
  res.send({
    errorMessage: 'Unable to handle request'
  });
});

app.listen(3000, () => {
  console.log('Server is up on port 3000');
});
