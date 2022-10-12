module.exports = (req, res, next) => {
  const _send = res.send
  res.send = function (body) {
    if (req.url.indexOf('senha=') > 0) {
      if (JSON.parse(body).length === 0) {
        const errors = [{
          code: '401',
          message: 'Usuário/Senha inválido',
        }]
        return _send.call(this, JSON.stringify(errors), 422)
      }
    }
    return _send.call(this, body)
  }
  next()
}