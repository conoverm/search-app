var creativeCheck = function(req, res, next) {
  var creatives = require('memory-cache');

  var tag = req.body.tag;
  var id = req.body.id;

  if ((!tag || !id) && req.method === 'POST') {
    var message = `[${new Date()}] Err: POST with no tag: ${tag} or no id: ${id}`
    console.error(message);
    res.writeHeader(400, {'Content-Type': 'application/json'});
    res.write(JSON.stringify({
      error: message
    }));
    res.end();
    return;
  }

  if (req.url.match(/\/[0-9]+/) && req.method === 'GET') {
    // if url === /creativeCheck/[somecreativeid, eg: 544629]
    // also:
    // assume this is a GET from the iframe.src, not a POST
    // to create the page

    // req.url looks like: '/5667889'
    var creativeId = req.url.slice(1);
    var page = creatives.get(creativeId);

    page = !!page ? page.toString() : '';

    res.writeHeader(200, {'Content-Type': 'text/html'});
    res.write(page);
    res.end();
    return;

  }

  if (req.url === '/' && req.method === 'POST') {
    var html = `<!DOCTYPE html><title>${id}</title><body>${tag}`;

    creatives.put(id, html, 2000);

    res.writeHeader(200, {'Content-Type': 'application/json'});
    res.write(JSON.stringify({
      creativeCheckUrl: `/creativeCheck/${id}`
    }));

    res.end();
    return;

  }

  res.writeHeader(200);
  res.end();

}

module.exports = creativeCheck;
