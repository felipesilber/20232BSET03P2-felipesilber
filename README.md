# 20232BSET03P2
Inteli - Engenharia de Software | Avaliação 2023-2B P2

## Vulnerabilidades: 

### SQL Injection: no código fornecido, era possível a realização de uma SQL Injection através da URL.
*  Para corrigir, houve a substituição de db.run por db.prepare (dessa forma, os parâmetros passados são tratados de forma isolada de instruções SQL) e a utilização do biblioteca express-validator para validar o campo "nome" passado no corpo da requisição.

### Falta de lógica para verificar se um registro existe antes de adicionar um voto.
* Para corrigir, foi implementada uma lógica de verificação, como mostrado abaixo:
```
const check = db.prepare(`SELECT COUNT(*) as count FROM ${animalType} WHERE id = ?`);
  check.get(id, (err, row) => {
    check.finalize();

    if (err) {
      res.status(500).json({ error: "Erro ao verificar o banco de dados" });
    } else {
      const count = row.count;

      if (count === 0) {
        res.status(404).json({ error: "Registro não encontrado" });
      } else {
        const update = db.prepare(`UPDATE ${animalType} SET votes = votes + 1 WHERE id = ?`);
        update.run(id, function (err) {
          update.finalize();
```
### Erros tratados de maneira inadequada (alguns erros estavam sendo tratados de forma que pudessem vazar informações).
 * Para corrigir, houve a substituição de mensagens de erro por modelos menos específicos e mais genéricos, diminuindo, assim, o risco de vazamento de dados. Abaixo está um exemplo:

No endpoint POST /vote/:animalType/:id, houve a substituição da mensagem de erro "Registro não encontrado" por "Erro ao tentar encontrar o animal desejado".

### Métodos incompletos (alguns métodos ainda não estavam implementados, o que impossibilitava o funcionamento completo da aplicação.
* Para corrigir, foram implementadas lógicas para os endpoints POST /dogs e GET /dogs, que estavam faltando.
