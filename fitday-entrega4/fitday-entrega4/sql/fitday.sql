CREATE DATABASE IF NOT EXISTS fitday
  CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE fitday;

CREATE TABLE IF NOT EXISTS usuarios (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(100) NOT NULL,
  email VARCHAR(150) NOT NULL UNIQUE,
  senha VARCHAR(255) NOT NULL,
  perfil ENUM('usuario','instrutor','admin') NOT NULL DEFAULT 'usuario',
  ativo BOOLEAN NOT NULL DEFAULT TRUE,
  criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS exercicios (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(100) NOT NULL,
  descricao TEXT NOT NULL,
  grupo_muscular VARCHAR(60) NOT NULL,
  nivel ENUM('iniciante','intermediario','avancado') NOT NULL DEFAULT 'iniciante',
  duracao_minutos INT NOT NULL,
  criado_por INT NULL,
  criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_exercicio_criador FOREIGN KEY (criado_por)
    REFERENCES usuarios(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS registros_treino (
  id INT AUTO_INCREMENT PRIMARY KEY,
  usuario_id INT NOT NULL,
  exercicio_id INT NULL,
  nome_exercicio VARCHAR(100) NOT NULL,
  duracao_minutos INT NOT NULL,
  observacao VARCHAR(500) NULL,
  data_treino DATE NOT NULL,
  criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_registro_usuario FOREIGN KEY (usuario_id)
    REFERENCES usuarios(id) ON DELETE CASCADE,
  CONSTRAINT fk_registro_exercicio FOREIGN KEY (exercicio_id)
    REFERENCES exercicios(id) ON DELETE SET NULL,
  INDEX idx_registro_usuario_data (usuario_id, data_treino)
);

INSERT INTO exercicios (nome, descricao, grupo_muscular, nivel, duracao_minutos)
SELECT 'Agachamento', 'Movimento controlado de sentar e levantar, respeitando seus limites.', 'Pernas', 'iniciante', 10
WHERE NOT EXISTS (SELECT 1 FROM exercicios WHERE nome = 'Agachamento');

INSERT INTO exercicios (nome, descricao, grupo_muscular, nivel, duracao_minutos)
SELECT 'Flexão adaptada', 'Flexão com apoio dos joelhos ou em uma superfície elevada.', 'Peito e braços', 'iniciante', 8
WHERE NOT EXISTS (SELECT 1 FROM exercicios WHERE nome = 'Flexão adaptada');

INSERT INTO exercicios (nome, descricao, grupo_muscular, nivel, duracao_minutos)
SELECT 'Prancha', 'Mantenha o tronco alinhado pelo tempo que for confortável.', 'Core', 'intermediario', 5
WHERE NOT EXISTS (SELECT 1 FROM exercicios WHERE nome = 'Prancha');
