// connect app
const connect = require('connect');
const http = require('http');
const history = require('connect-history-api-fallback');
const serveStatic = require('serve-static');
const compression = require('compression')
const bodyParser = require('body-parser');
const helmet = require('helmet');
const path = require('path')

const adamaProxy = require('@mediamath/t1proxy');
const creativeCheck = require('./creativeCheck');

const app = connect();
const PORT = process.env.PORT || 8081;

app.use(compression())
app.use(helmet.frameguard())
app.use(helmet.hidePoweredBy())
app.use(helmet.xssFilter())
app.use(bodyParser.urlencoded({
  extended: true
}))
app.use(bodyParser.json())
app.use('/', function(req, res, next) {
  const rp = require('request-promise');
  const url = require('url');
  const url_parts = url.parse(req.url, true);
  const query = url_parts.query;
  const sessionId = query.session_id;

  if (req.method != 'GET' || !sessionId) {
    return next();
  }

  rp({
    url: 'https://api.mediamath.com/api/v2.0/session/',
    headers: {
      Cookie: 'adama_session=' + sessionId,
      Accept: 'application/vnd.mediamath.v1+json'
    },
    json: true
  })
  .then((response) => {
    if ((!response || !response.data || !response.data.session) ||
      !response.meta || response.meta.status != 'ok') {
      throw new Error("no response or no data in response")
    }

    res.setHeader('Set-Cookie', [
      `adama_session=${response.data.session.sessionid}; expires=${response.data.session.expires}; httpOnly; path=/`
    ]);

    next();

  })
  .catch((err) => {
    let d = new Date();
    console.error(`[${d}] Error fetching the Adama session: ${err}`)
    next();
  });
})
app.use(adamaProxy)
app.use(history())
app.use('/images', serveStatic(path.join(__dirname + '/dist/images'), {
  maxAge: '1y'
}))
app.use('/scripts', serveStatic(path.join(__dirname + '/dist/scripts'), {
  maxAge: '1y'
}))
app.use('/styles', serveStatic(path.join(__dirname + '/dist/styles'), {
  maxAge: '1y'
}))
app.use('/', serveStatic(path.join(__dirname, '/dist')))
app.use('/creativeCheck/', creativeCheck)

// beanstalk default: 8081
http.createServer(app).listen(PORT, function(){
  let d = new Date();
  console.log(`[${d}] App created on PORT: ${PORT}`);
});
