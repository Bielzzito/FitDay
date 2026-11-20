function permitir(...perfis) {
  return (req, res, next) => {
    if (!req.usuario || !perfis.includes(req.usuario.perfil)) {
      return res.status(403).json({ mensagem: 'Você não tem permissão para esta ação.' });
    }
    next();
  };
}

module.exports = permitir;
