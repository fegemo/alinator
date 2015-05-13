# Alinator

Uma CLI que gera uma tabela com a alocação de projetores por professor do
DECOM/CEFET-MG.

## Instalação

```
$ npm install -g alinator
```

## Utilização

Na linha de comando, execute:

```
$ alinator
```

Um arquivo com o nome `projetores_DATA-DE-HOJE.html` será criado na pasta
de onde o comando foi executado.

## Roadmap

- [ ] Externalizar as credenciais de acesso a agendamento.decom.cefetmg.br
  - [ ] Instalar o pacote `nconf` (https://www.npmjs.com/package/nconf) como uma dependência
  - [ ] Criar opções de linha de comando para definir usuário (e.g., `-u username`) e senha (e.g., `-p password`)
  - [ ] Alterar a CLI (`bin/cli.js`) para ler um arquivo de configuração externo (e.g., `~/alinator.config.json`) e
    - [ ] caso haja um usuário e senha, usá-los (passar como argumento para a função `app.go()` e modificá-la para recebê-los) 
    - [ ] caso não haja arquivo de configuração, retornar da CLI solicitando que um usuário e senha sejam escritos (via `-u username -p password`)
    - [ ] quando um usuário e senha forem passados para a CLI (`-u -p`), após a efetuação do login com sucesso (i.e., ao final da função `app.go()`), esse usuário e senha deve ser guardado no arquivo de configuração (e.g., `nconf.save(...)`)
- [ ] Criar um parâmetro de linha de comando com o número de dias para a frente (ou para trás) para os quais deve-se gerar a página HTML com a tabela de alocações de projetores
