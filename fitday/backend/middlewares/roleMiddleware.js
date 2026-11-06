function permitirPerfis(...perfisPermitidos) {
  return (req, res, next) => {
    if (!req.usuario) {
      return res.status(401).json({ mensagem: 'Autenticação necessária.' });
    }

    if (!perfisPermitidos.includes(req.usuario.perfil)) {
      return res.status(403).json({ mensagem: 'Você não tem permissão para acessar este recurso.' });
    }

    next();
  };
}

module.exports = { permitirPerfis };
