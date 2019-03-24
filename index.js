const restify = require('restify');
const errs    = require('restify-errors');
const knex    = require('./base');

const server = restify.createServer({
  name: 'web-node',
  version: '1.0.0'
});

server.use(restify.plugins.acceptParser(server.acceptable));
server.use(restify.plugins.queryParser());
server.use(restify.plugins.bodyParser());

/*
server.get('/echo/:name', function (req, res, next) {
  res.send(req.params);
  return next();
});
*/

server.listen(8080, function () {
  console.log('%s listening at %s', server.name, server.url);
});

server.get('/', restify.plugins.serveStatic({
  directory: './public',
  file: 'index.html',
}));

server.get('/read', function (req, res, next) {
  knex('rest')
  .then(function(dados){
    res.send(dados);
  },next );
  return next();
});

server.post('/create', (req, res, next) => {
  knex('rest')
  .insert(req.body)
  .then((dados) => {
    res.send(dados)
  }, next);
  return next();
});

server.post('/show/:id', (req, res, next) => {

  const { id } = req.params;

  knex('rest')
  .where('id_rest', id)
  .first()
  .then((dados) => {
    if(!dados){ return res.send(new errs.BadRequestError('Nenhum registro encontrado.')) }
    res.send(dados);
  });
});

server.put('/update/:id', (req, res, next) => {

  const { id } = req.params;

  knex('rest')
  .where('id_rest', id)
  .update(req.body)
  .then((dados) =>{
    if(!dados) return res.send(new errs.BadRequestError('Nenhem registro encontrado.'));
    res.send('Dados atualizados com sucesso.');
  }, next);
});

server.del('/delete/:id', (req, res, next) => {

  const { id } = req.params;

  knex('rest')
  .where('id_rest', id)
  .delete()
  .then((dados) => {
    if(!dados) return res.send(new errs.BadRequestError('Nenhem registro encontrado.'));
    res.send('Dados excluidos com sucesso.');
  }, next);
});

