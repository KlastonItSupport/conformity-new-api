import { MigrationInterface, QueryRunner, Table } from 'typeorm';

const createEmailsModelsQuery = ` INSERT INTO emails_models (title,slug,body) VALUES
 (
'CONFORMITY - Recuperar senha', 'recuperar-senha', '<p><img src="https://conformity.me/wp-content/uploads/2021/10/logo-conformity-e1635391941916.webp" style="float: none; width: 98px; height: 33px;" /><br /></p>
<p>Olá {{usuario.nome}} <span>—</span>&nbsp;{{empresa.nome}}</p>
<p>Recebemos sua solicitação de recuperação de senha.</p>
<p>Favor clicar no link para recuperar sua senha: {{url.recuperarsenha}}</p>
<p>ATT,<br />conformity@klaston.com<br />Suporte do conformity<br />+55 11 3280 2717<br /></p>'
),
(
  'CONFORMITY - Seja bem-vindo!',
  'boas-vindas',
  '<table class="x_1430992985hide" style="margin: 5.0px auto;" width="600" cellspacing="0" cellpadding="0">
  <tbody>
    <tr>
      <td style="text-align: center;">&nbsp;<a href="https://app.conformity.me/usuarios/login">Entrar no sistema</a></td>
    </tr>
  </tbody>
</table>
<table class="x_1430992985full" style="background: white none repeat scroll 0% 0%; border-radius: 2px; overflow: hidden; border: 1px solid rgb(221, 221, 221); margin: 0px auto; font-size: 14px; line-height: 22px;" width="600" cellspacing="0" cellpadding="0" border="1">
  <tbody>
    <tr style="height: 84px;">
      <td style="background: rgb(255, 255, 255) none repeat scroll 0% 0%; padding: 25px 0px; width: 598px; height: 84px;">
        <table style="width: 100.0%;" cellspacing="0" cellpadding="0" border="0">
          <tbody>
            <tr>
              <td style="text-align: left;">
                <h2><a href="https://app.conformity.me/usuarios/login" target="_blank" rel="noopener">Conformity.me</a> | {{empresa.nome}}</h2>
              </td>
              <td class="x_1430992985hide" style="width: 145.0px; text-align: right;"><img style="display: block; margin: 0px auto; width: 95px; height: 32px;" src="https://conformity.me/wp-content/uploads/2021/10/logo-conformity-e1635391941916.webp" width="124" height="42" /> </td>
            </tr>
          </tbody>
        </table>
      </td>
    </tr>
    <tr style="height: 466px;">
      <td style="background: rgb(238, 238, 238) none repeat scroll 0% 0%; color: rgb(68, 68, 68); padding: 25px; width: 598px; height: 466px;">
        <table class="x_1430992985full_table" style="width: 100%; border: medium none; float: none;" cellspacing="0" cellpadding="0" border="1">
          <tbody>
            <tr style="height: 321px;">
              <td class="x_1430992985full_width" style="vertical-align: top; background-color: rgb(255, 255, 255); width: 100%; height: 321px;">
                <p><strong>Olá</strong> {{usuario.nome}}</p>
                <p><span style="font-size: 14px;">Seja bem vindo ao </span><strong><span style="font-size: 14px;">Conformity</span></strong><span style="font-size: 14px;">.<br /></span><span style="font-size: 14px;">No </span><strong><span style="font-size: 14px;">Conformity</span></strong><span style="font-size: 14px;"> é possível realizar:</span></p>
                <ul>
                  <li><span style="font-size: 14px;">Gestão de Documentos;</span></li>
                  <li><span style="font-size: 14px;">Gestão de Clientes / Fornecedores;</span></li>
                  <li><span style="font-size: 14px;">Gestão de Contratos;</span></li>
                  <li><span style="font-size: 14px;">Gestão de Projetos;</span></li>
                  <li><span style="font-size: 14px;">Gestão das Tarefas;</span></li>
                  <li><span style="font-size: 14px;">Gestão das Não Conformidades e Ações Corretivas;</span></li>
                  <li><span style="font-size: 14px;">Gestão de Calibração;</span></li>
                  <li><span style="font-size: 14px;">Gestão de Indicadores;</span></li>
                  <li><span style="font-size: 14px;">Gestão de Treinamentos.</span></li>
                </ul>
              </td>
            </tr>
            <tr style="height: 72px;">
              <td class="x_1430992985full_width" style="background-color: white; vertical-align: top; width: 100%; height: 72px;">
                <p><span style="font-size: 14px;"><a href="https://app.conformity.me/usuarios/login">Acesse agora o sistema para usufruir de todos estes módulos. https://conformity.me/conformity/usuarios/login</a></span></p>

              </td>
            </tr>
            <tr style="height: 66px;">
              <td style="background-color: white; vertical-align: top; width: 100%; height: 66px;">conformity@klaston.com<br />Suporte do Conformity<br /><strong>+55 11 3280 2717</strong><br /></td>
            </tr>
          </tbody>
        </table>
      </td>
    </tr>
  </tbody>
</table>'
),
  (
   'CONFORMITY - Solicitado Aprovar / Revisar Documentos.',
   'documentos-revisao-aprovacao',
   '<table class="x_1430992985hide" style="margin: 5.0px auto;" width="600" cellspacing="0" cellpadding="0">
  <tbody>
    <tr>
      <td style="text-align: center;">&nbsp;<a href="https://app.conformity.me/">Entrar no sistema</a><a href="conformity.me/conformity"></a></td>
    </tr>
  </tbody>
</table>
<table class="x_1430992985full" style="background: white; border-radius: 2.0px; overflow: hidden; border: 1.0px solid #dddddd; margin: 10.0px auto; font-size: 14.0px; line-height: 22.0px;" width="600" cellspacing="0" cellpadding="0">
  <tbody>
    <tr>
      <td style="background: #ffffff; padding: 25.0px 0;">
        <table style="width: 100.0%;" cellspacing="0" cellpadding="0" border="0">
          <tbody>
            <tr>
              <td style="text-align: left;">
                <h2><a rel="noopener" href="https://app.conformity.me/">Conformity.me</a> | {{empresa.nome}}</h2>
              </td>
              <td class="x_1430992985hide" style="width: 145px; text-align: center;"><img src="https://conformity.me/wp-content/uploads/2021/10/logo-conformity-e1635391941916.webp" style="float: none; width: 99px; height: 33px;" width="124" height="42" />&nbsp;</td>
            </tr>
          </tbody>
        </table>
      </td>
    </tr>
    <tr>
      <td style="background: #eeeeee; color: #444444; padding: 25.0px;">
        <table class="x_1430992985full_table" style="width: 100.0%; border: none;" cellspacing="0" cellpadding="0" border="0">
          <tbody>
            <tr>
              <td class="x_1430992985full_width" style="vertical-align: top;">
                <p>Olá {{usuario.nome}}</p>
                <p>O documento: {{documento.nome}}</p>
                <p>Criado por: {{documento.autor}}</p>
                <p>está aguardando para ser revisado/aprovado por você.</p>
                <p>Clique aqui para revisar/aprovar agora mesmo esta documento: <a href="https://app.conformity.me/documentos/analise">https://app.conformity.me/documentos/analise</a><a href="https://conformity.me/conformity/documentos/analise"></a>
                </p>
                <p>conformity@klaston.com<br />Suporte do Conformity<br /><strong>+55 11 3280 2717</strong><br /><img src="https://klaston.com/wp-content/uploads/2019/04/logo-klaston-oficial2-small-130130.jpg" style="float: none;" /></p>
              </td>
              <td class="x_1430992985full_width" style="vertical-align: top; width: 165.0px;">
                <p style="width: 165.0px; color: white; font-weight: bold; text-align: center; font-size: 1.4em; margin: 0 auto; padding: 0; min-height: 35.0px; line-height: 35.0px; background: #0098cd; border-radius: 2.0px 2.0px 0 0;">Doc ID</p>
                <p style="width: 165.0px; color: #666666; font-weight: 300; text-align: center; font-size: 8.0em; margin: 0 auto; padding: 0; min-height: 130.0px; line-height: 130.0px; background: #ffffff; border-bottom: 3.0px solid #dddddd;"><span style="font-size: 36px;">{{documento.id}}</span></p>
              </td>
            </tr>
          </tbody>
        </table>
      </td>
    </tr>
  </tbody>
</table>
<p>&nbsp;</p>'
  ),
  (
  'CONFORMITY - Nova task',
  'task-nova',
  '<p><img src="https://conformity.me/wp-content/uploads/2021/10/logo-conformity-e1635391941916.webp" style="float: none; width: 96px; height: 32px;" /><br /></p>
<p>Olá {{usuario.nome}} <span>—</span>&nbsp;{{empresa.nome}}<br /></p>
<p>A Task código: {{task.id}} <br />Título da task: {{task.titulo}}<br />Criada por: {{task.usuario}}<br />Origem: {{task.origem}}<br />Classificação: {{task.classificacao}}<br />Tipo: {{task.tipo}}<br />Com previsão de fechamento para: {{task.data_previsao}}</p>
<p>Clique aqui para acessar agora mesmo esta task: {{url.task}} - Url da Task</p>
<p>conformity@klaston.com<br />Suporte do conformity<br />+55 11 3280 2717<br /><img src="https://klaston.com/wp-content/uploads/2019/04/logo-klaston-oficial2-small-130130.jpg" style="float: none;" /><br /></p>'
  ),
  (
  'CONFORMITY - Solicitado avaliar TASK',
  'avaliarores-task-antigo-nao-usar',
  '<p><img src="https://conformity.me/wp-content/uploads/2021/10/logo-conformity-e1635391941916.webp" style="float: none; width: 111px; height: 37px;" /><br /></p>
<p>Olá {{usuario.nome}} <span>—</span>&nbsp;{{empresa.nome}}<br /></p>
<p>A Task código: {{task.id}} <br />Título da task: {{task.titulo}}<br />Criada por: {{task.usuario}}<br />Origem: {{task.origem}}<br />Classificação: {{task.classificacao}}<br />Tipo: {{task.tipo}}<br />Com previsão de fechamento para: {{task.data_previsao}}<br />Está aguardando para ser avaliada por você. Clique no link a frente para acessar agora mesmo esta task e realizar sua avaliação:&nbsp; {{url.task}}<br /></p>
<p>conformity@klaston.com<br />Suporte do conformity<br />+55 11 3280 2717<br /><img src="https://klaston.com/wp-content/uploads/2019/04/logo-klaston-oficial2-small-130130.jpg" style="float: none;" /><br /></p>'
  ),
  (
    'CONFORMITY - Task encerrada, favor avaliar a eficacia da TASK',
    'task-encerrar',
    '<table class="x_1430992985hide" style="margin: 5.0px auto;" width="600" cellspacing="0" cellpadding="0">
  <tbody>
    <tr>
      <td style="text-align: center;">&nbsp;<a href="https://app.conformity.me/">Entrar no sistema</a></td>
    </tr>
  </tbody>
</table>
<table class="x_1430992985full" style="background: white; border-radius: 2.0px; overflow: hidden; border: 1.0px solid #dddddd; margin: 10.0px auto; font-size: 14.0px; line-height: 22.0px;" width="600" cellspacing="0" cellpadding="0">
  <tbody>
    <tr>
      <td style="background: #ffffff; padding: 25.0px 0;">
        <table style="width: 100.0%;" cellspacing="0" cellpadding="0" border="0">
          <tbody>
            <tr>
              <td style="text-align: left;">
                <h2><a href="https://app.conformity.me/" target="_blank" rel="noopener">Conformity.me</a> | {{empresa.nome}}</h2>
              </td>
              <td class="x_1430992985hide" style="width: 145.0px; text-align: right;"><img style="display: block; margin: 0px auto; width: 93px; height: 31px;" src="https://conformity.me/wp-content/uploads/2021/10/logo-conformity-e1635391941916.webp" width="124" height="42" /> </td>
            </tr>
          </tbody>
        </table>
      </td>
    </tr>
    <tr>
      <td style="background: #eeeeee; color: #444444; padding: 25.0px;">
        <table class="x_1430992985full_table" style="width: 100.0%; border: none;" cellspacing="0" cellpadding="0" border="0">
          <tbody>
            <tr>
              <td class="x_1430992985full_width" style="vertical-align: top;">
                <p><strong>Olá</strong> {{usuario.nome}}</p>
                <p><strong>A Task código:</strong> {{task.id}}, <br /> <strong>Título da task:</strong> {{task.titulo}}<br /> <strong>Criada por:</strong> {{task.usuario}}<br /> <strong>Origem:</strong> {{task.origem}}<strong><br /> Classificação:</strong> {{task.classificacao}}<br /> <strong>Tipo:</strong> {{task.tipo}}<br /> Com previsão de fechamento para: {{task.data_previsao}}</p>
                <p>Esta <strong>TASK</strong> foi finalizada e está aguardando para ser avaliada. Clique no link a frente para acessar agora mesmo esta task e realizar sua avaliação de eficácia:&nbsp; {{url.task}}</p>
              </td>
            </tr>
            <tr>
              <td class="x_1430992985full_width" style="background-color: white; vertical-align: top;">

                <p>conformity@klaston.com<br />Suporte do conformity<br />+55 11 3280 2717<br /></p>
              </td>
            </tr>
          </tbody>
        </table>
      </td>
    </tr>
  </tbody>
</table>
<p>&nbsp;</p>'
  ),
  (
  'CONFORMITY - Task pendente',
  'task-pendente',
  '<p><img src="https://conformity.me/wp-content/uploads/2021/10/logo-conformity-e1635391941916.webp" style="float: none; width: 93px; height: 31px;" /><br /></p>
<p>Olá {{usuario.nome}} <span>—</span>&nbsp;{{empresa.nome}}<br /></p>
<p>A Task código: {{task.id}} <br />Título da task: {{task.titulo}}<br />Criada por: {{task.usuario}}<br />Origem: {{task.origem}}<br />Classificação: {{task.classificacao}}<br />Tipo: {{task.tipo}}<br />Com previsão de fechamento para: {{task.data_previsao}}, está pendente e precisa ser finalizada. Clique no link a frente para acessar agora mesmo esta task:&nbsp; {{url.task}}<br /></p>
<p>conformity@klaston.com<br />Suporte do conformity<br />+55 11 3280 2717<br /></p>'
  ),
  (
    'CONFORMITY - WEEKLY REPORT',
    'weekly-report1',
    '<p style="text-align: center;"><img src="https://conformity.me/wp-content/uploads/2021/10/logo-conformity-e1635391941916.webp" style="float: none; width: 112px; height: 38px;" /><br /></p>
<p>Olá {{usuario.nome}} <span>—</span>&nbsp;{{empresa.nome}}</p>




<table style="border-collapse: collapse; width: 100%; height: 210px;" border="1">
  <tbody>
    <tr style="height: 20px;">
      <td style="width: 100%; text-align: center; height: 20px;" colspan="3"><strong>DOCUMENTOS <span>—</span> Relatório de Documentos<br /></strong></td>
    </tr>
    <tr style="height: 19px;">
      <td style="width: 50%; height: 19px;">Documentos para análise <span>—</span> aguardando aprovação ou revisão.<br /></td>
      <td style="width: 50%; height: 19px;" colspan="2">{{lista.url.documentos.analise}}<br /></td>
    </tr>
    <tr style="height: 19px;">
      <td style="width: 50%; height: 19px;">Documentos Pendentes no sistema <span>—</span> aguardando aprovação ou revisão.<br /></td>
      <td style="width: 50%; height: 19px;" colspan="2">{{lista.url.documentos.revisao}}<br /></td>
    </tr>
    <tr style="height: 19px;">
      <td style="width: 50%; height: 19px;"><br /></td>
      <td style="width: 50%; height: 19px;" colspan="2"><br /></td>
    </tr>
    <tr style="height: 20px;">
      <td style="width: 100%; text-align: center; height: 20px;" colspan="3"><strong>Tasks — Relatório de TASKS</strong><br /></td>
    </tr>
    <tr style="height: 19px;">
      <td style="width: 50%; height: 19px;">Tasks aguardando ser avaliada no sistema.<br /></td>
      <td style="width: 50%; height: 19px;" colspan="2"><span style="text-decoration: underline;"></span>{{lista.url.task.avaliacao}}<span style="text-decoration: underline;"></span><br /></td>
    </tr>
    <tr style="height: 18px;">
      <td style="width: 50%; height: 18px;">Tasks com data de fechamento expirados e não finalizados.<br /></td>
      <td style="width: 50%; height: 18px;" colspan="2"><span style="text-decoration: underline;"></span>{{lista.url.task.dt.expirada}}<br /></td>
    </tr>
    <tr style="height: 19px;">
      <td style="width: 50%; height: 19px;">Task com data de vencimento menor que 5 dias<br /></td>
      <td style="height: 19px;" colspan="2">{{lista.url.task.dt.menor.5}}<br /></td>
    </tr>
    <tr>
      <td style="width: 50%;"><br /></td>
      <td colspan="2"><br /></td>
    </tr>
    <tr>
      <td style="width: 50%;"><br /></td>
      <td colspan="2"><br /></td>
    </tr>
    <tr>
      <td style="width: 50%;"><br /></td>
      <td style="width: 50%;" colspan="2"><br /></td>
    </tr>
    <tr style="height: 19px;">
      <td style="width: 100%; text-align: center; height: 19px;" colspan="3"><strong>Treinamentos — Gestão de Treinamentos<br /></strong></td>
    </tr>
    <tr style="height: 19px;">
      <td style="width: 50%; height: 19px;"><strong>Nome do colaborador<br /></strong></td>
      <td style="width: 26.6147%; height: 19px;"><strong>Treinamento com vencimento menor que 30 dias<br /></strong></td>
      <td style="width: 23.3853%; height: 19px;"><strong>Data do vencimento<br /></strong></td>
    </tr>
    <tr style="height: 19px;">
      <td style="width: 50%; height: 19px;">{{colaborador.nome}}<br /></td>
      <td style="width: 26.6147%; height: 19px;">{{treinamento.nome}}<br /></td>
      <td style="width: 23.3853%; height: 19px;">{{treinamento.dt.vencimento}}<span></span> <br /></td>
    </tr>
    <tr>
      <td style="width: 50%;"><br /></td>
      <td style="width: 26.6147%;"><br /></td>
      <td style="width: 23.3853%;"><br /></td>
    </tr>
    <tr style="height: 19px;">
      <td style="width: 50%; height: 19px;"><strong>Nome do colaborador<br /></strong></td>
      <td style="width: 26.6147%; height: 19px;"><strong>Treinamento com vencimento menor que 15 dias<br /></strong></td>
      <td style="width: 23.3853%; height: 19px;"><strong>Data do vencimento<br /></strong></td>
    </tr>
    <tr style="height: 19px;">
      <td style="width: 50%; height: 19px;">{{colaborador.nome}}<br /></td>
      <td style="width: 26.6147%; height: 19px;">{{treinamento.nome}}<br /></td>
      <td style="width: 23.3853%; height: 19px;">{{treinamento.dt.vencimento}}<span></span> <br /></td>
    </tr>
    <tr>
      <td style="width: 50%;"><br /></td>
      <td style="width: 26.6147%;"><br /></td>
      <td style="width: 23.3853%;"><br /></td>
    </tr>
    <tr style="height: 19px;">
      <td style="width: 50%; height: 19px;"><strong>Nome do colaborador<br /></strong></td>
      <td style="width: 26.6147%; height: 19px;"><strong>Treinamento com vencimento menor que 07 dias<br /></strong></td>
      <td style="width: 23.3853%; height: 19px;"><strong>Data do vencimento<br /></strong></td>
    </tr>
    <tr style="height: 19px;">
      <td style="width: 50%; height: 19px;">{{colaborador.nome}}<br /></td>
      <td style="width: 26.6147%; height: 19px;">{{treinamento.nome}}<br /></td>
      <td style="width: 23.3853%; height: 19px;">{{treinamento.dt.vencimento}}<span></span> <br /></td>
    </tr>
    <tr>
      <td style="width: 50%;"><br /></td>
      <td style="width: 26.6147%;"><br /></td>
      <td style="width: 23.3853%;"><br /></td>
    </tr>
    <tr style="height: 19px;">
      <td style="width: 50%; height: 19px;"><strong>Nome do colaborador<br /></strong></td>
      <td style="width: 26.6147%; height: 19px;"><strong>Treinamento com vencimento menor que 1 dia<br /></strong></td>
      <td style="width: 23.3853%; height: 19px;"><strong>Data do vencimento<br /></strong></td>
    </tr>
    <tr style="height: 19px;">
      <td style="width: 50%; height: 19px;">{{colaborador.nome}}<br /></td>
      <td style="width: 26.6147%; height: 19px;">{{treinamento.nome}}<br /></td>
      <td style="width: 23.3853%; height: 19px;">{{treinamento.dt.vencimento}}<span></span> <br /></td>
    </tr>
  </tbody>
</table>
<p><br /></p>

<p>A Task código: {{task.id}} <br />Título da task: {{task.titulo}}<br />Criada por: {{task.usuario}}<br />Origem: {{task.origem}}<br />Classificação: {{task.classificacao}}<br />Tipo: {{task.tipo}}<br />Com previsão de fechamento para: {{task.data_previsao}}, está pendente e precisa ser finalizada. Clique no link a frente para acessar agora mesmo esta task:&nbsp; {{url.task}}<br /></p>
<p>conformity@klaston.com<br />Suporte do conformity<br />+55 11 3280 2717</p>'
  ),
  (
  'CONFORMITY - Task Reaberta',
  'task-reaberta',
  '<table class="x_1430992985hide" style="margin: 5px auto;" width="600" cellspacing="0" cellpadding="0">
  <tbody>
    <tr>
      <td>&nbsp;<br /></td>
      <td style="text-align: right;"><a style="color: rgb(187, 187, 187); font-size: 0.75em;" href="https://app.conformity.me/" target="_blank" rel="noopener">Entrar no sistema</a></td>
    </tr>
  </tbody>
</table>
<table class="x_1430992985full" style="background: white; border-radius: 2px; overflow: hidden; border: 1px solid rgb(221, 221, 221); margin: 10px auto; font-size: 14px; line-height: 22px;" width="600" cellspacing="0" cellpadding="0">
  <tbody>
    <tr>
      <td style="background: rgb(255, 255, 255); padding: 25px 0px;">
        <table style="width: 100%;" cellspacing="0" cellpadding="0" border="0">
          <tbody>
            <tr>
              <td style="text-align: left; width: 75.3356%;">
                <h2><a href="https://app.conformity.me/" target="_blank" rel="noopener">Conformity.me</a> | {{empresa.nome}}</h2>
              </td>
              <td class="x_1430992985hide" style="width: 24.6644%; text-align: right;"><img src="https://conformity.me/wp-content/uploads/2021/10/logo-conformity-e1635391941916.webp" style="float: none; width: 85px; height: 28px;" width="124" height="42" />&nbsp;</td>
            </tr>
          </tbody>
        </table>
      </td>
    </tr>
    <tr>
      <td style="background: rgb(238, 238, 238); color: rgb(68, 68, 68); padding: 25px;">
        <table class="x_1430992985full_table" style="width: 100%; border: none;" cellspacing="0" cellpadding="0" border="0">
          <tbody>
            <tr>
              <td class="x_1430992985full_width" style="vertical-align: top;">
                <h2 style="margin: 0px; font-size: 1.6em; line-height: 1.2em; letter-spacing: -1px;">Olá, {{usuario.nome}}</h2>
                <p><strong>A Task código:</strong> {{task.id}} <br /><strong>Título da task:</strong> {{task.titulo}}<br /><strong>Descrição:</strong> {{task.desc}}<br /><strong>Criada por:</strong> {{task.usuario}}<br /><strong>Origem:</strong> {{task.origem}}<br /><strong>Classificação:</strong> {{task.classificacao}}<br /><strong>Tipo:</strong> {{task.tipo}}<br /><strong>Previsão de fechamento</strong>: {{task.data_previsao}}<br /><strong><span style="color: rgb(252, 29, 0);">Foi reaberta por: {{task.usuario}}</span></strong><br /></p>
                <p>
                  <!-- x-textbox/html -->Clique no link a frente para acessar agora mesmo esta task:&nbsp; <strong>{{url.task}}</strong></p>
              </td>
              <td class="x_1430992985full_width" style="vertical-align: top; width: 165px;">
                <p style="width: 165px; color: white; font-weight: bold; text-align: center; font-size: 1.4em; margin: 0px auto; padding: 0px; min-height: 35px; line-height: 35px; background: rgb(0, 152, 205); border-radius: 2px 2px 0px 0px;">Task código</p>
                <p style="width: 165px; color: rgb(102, 102, 102); font-weight: 300; text-align: center; font-size: 8em; margin: 0px auto; padding: 0px; min-height: 130px; line-height: 130px; background: rgb(255, 255, 255); border-bottom: 3px solid rgb(221, 221, 221);"><span style="font-size: 36px;">{{task.id}}</span></p>
              </td>
            </tr>
          </tbody>
        </table>
      </td>
    </tr>
  </tbody>
</table>'
  ),
  (
  'CONFORMITY - Solicitado avaliar TASK',
  'avaliarores-task',
  '<table class="x_1430992985hide" style="margin: 5.0px auto;" width="600" cellspacing="0" cellpadding="0">
  <tbody>
    <tr>
      <td>&nbsp;</td>
      <td style="text-align: right;"><a style="color: #bbbbbb; font-size: 0.75em;" href="https://app.conformity.me/" target="_blank" rel="noopener">Entrar no sistema</a></td>
    </tr>
  </tbody>
</table>
<table class="x_1430992985full" style="background: white; border-radius: 2.0px; overflow: hidden; border: 1.0px solid #dddddd; margin: 10.0px auto; font-size: 14.0px; line-height: 22.0px;" width="600" cellspacing="0" cellpadding="0">
  <tbody>
    <tr>
      <td style="background: #ffffff; padding: 25.0px 0;">
        <table style="width: 100.0%;" cellspacing="0" cellpadding="0" border="0">
          <tbody>
            <tr>
              <td style="text-align: left; width: 75.3356%;">
                <h2><a href="https://app.conformity.me/" target="_blank" rel="noopener">Conformity.me</a> | {{empresa.nome}}</h2>
              </td>
              <td class="x_1430992985hide" style="width: 24.6644%; text-align: right;"><img src="https://conformity.me/wp-content/uploads/2021/10/logo-conformity-e1635391941916.webp" style="float: none; width: 85px; height: 28px;" width="124" height="42" />&nbsp;</td>
            </tr>
          </tbody>
        </table>
      </td>
    </tr>
    <tr>
      <td style="background: #eeeeee; color: #444444; padding: 25.0px;">
        <table class="x_1430992985full_table" style="width: 100.0%; border: none;" cellspacing="0" cellpadding="0" border="0">
          <tbody>
            <tr>
              <td class="x_1430992985full_width" style="vertical-align: top;">
                <h2 style="margin: 0; font-size: 1.6em; line-height: 1.2em; letter-spacing: -1.0px;">Olá, {{usuario.nome}}</h2>
                <p><strong>A Task código:</strong> {{task.id}} <br /><strong>Título da task:</strong> {{task.titulo}}<br /><strong>Descrição:</strong> {{task.desc}}<br /><strong>Criada por:</strong> {{task.usuario}}<br /><strong>Origem:</strong> {{task.origem}}<br /><strong>Classificação:</strong> {{task.classificacao}}<br /><strong>Tipo:</strong> {{task.tipo}}<br /><strong>Previsão de fechamento</strong>: {{task.data_previsao}}</p>
                <p>
                  <!-- x-textbox/html -->Está aguardando para ser avaliada por você. Clique no link a frente para acessar agora mesmo esta task e realizar sua avaliação:&nbsp; <strong>{{url.task}}</strong></p>
              </td>
              <td class="x_1430992985full_width" style="vertical-align: top; width: 165.0px;">
                <p style="width: 165.0px; color: white; font-weight: bold; text-align: center; font-size: 1.4em; margin: 0 auto; padding: 0; min-height: 35.0px; line-height: 35.0px; background: #0098cd; border-radius: 2.0px 2.0px 0 0;">Task código</p>
                <p style="width: 165.0px; color: #666666; font-weight: 300; text-align: center; font-size: 8.0em; margin: 0 auto; padding: 0; min-height: 130.0px; line-height: 130.0px; background: #ffffff; border-bottom: 3.0px solid #dddddd;"><span style="font-size: 36px;">{{task.id}}</span></p>
              </td>
            </tr>
          </tbody>
        </table>
      </td>
    </tr>
  </tbody>
</table>
<p>&nbsp;</p>'
  ),
  (
    'CONFORMITY - TASK recebida/lida pelo avaliador',
    'task-recebida-avaliador',
    '<table class="x_1430992985hide" style="margin: 5.0px auto;" width="600" cellspacing="0" cellpadding="0">
  <tbody>
    <tr>
      <td>&nbsp;</td>
      <td style="text-align: right;"><a style="color: #bbbbbb; font-size: 0.75em;" href="https://app.conformity.me/" target="_blank" rel="noopener">Entrar no sistema</a></td>
    </tr>
  </tbody>
</table>
<table class="x_1430992985full" style="background: white; border-radius: 2.0px; overflow: hidden; border: 1.0px solid #dddddd; margin: 10.0px auto; font-size: 14.0px; line-height: 22.0px;" width="600" cellspacing="0" cellpadding="0">
  <tbody>
    <tr>
      <td style="background: #ffffff; padding: 25.0px 0;">
        <table style="width: 100.0%;" cellspacing="0" cellpadding="0" border="0">
          <tbody>
            <tr>
              <td style="text-align: left;">
                <h2><a href="https://app.conformity.me/" target="_blank" rel="noopener">Conformity.me</a> | {{empresa.nome}}</h2>
              </td>
              <td class="x_1430992985hide" style="width: 145.0px; text-align: right;"><img src="https://conformity.me/wp-content/uploads/2021/10/logo-conformity-e1635391941916.webp" style="float: none; width: 97px; height: 32px;" width="124" height="42" />&nbsp;</td>
            </tr>
          </tbody>
        </table>
      </td>
    </tr>
    <tr>
      <td style="background: #eeeeee; color: #444444; padding: 25.0px;">
        <table class="x_1430992985full_table" style="width: 100.0%; border: none;" cellspacing="0" cellpadding="0" border="0">
          <tbody>
            <tr>
              <td class="x_1430992985full_width" style="vertical-align: top;">
                <h2 style="margin: 0; font-size: 1.6em; line-height: 1.2em; letter-spacing: -1.0px;">Olá, {{task.usuario}}</h2>
                <p style="margin: 0; font-size: 1.6em; line-height: 1.2em; letter-spacing: -1.0px;"><span style="font-size: 14px;">A Task abaixo foi lida/recebida pelo:&nbsp; </span><strong><span style="font-size: 14px;">{{task.avaliador}}</span></strong><br /></p>
                <p><strong>A Task código:</strong> {{task.id}}<br /><strong>Título da task:</strong> {{task.titulo}}<br /><strong>Criada por:</strong> {{task.usuario}}<br /><strong>Origem:</strong> {{task.origem}}<br /><strong>Classificação:</strong> {{task.classificacao}}<br /><strong>Tipo:</strong> {{task.tipo}}<br /><strong>Previsão de fechamento</strong>: {{task.data_previsao}}</p>
                <p>Clique no link a frente para acessar agora mesmo esta task:&nbsp; <strong>{{url.task}}</strong><br /></p>

              </td>
              <td class="x_1430992985full_width" style="vertical-align: top; width: 165.0px;">
                <p style="width: 165.0px; color: white; font-weight: bold; text-align: center; font-size: 1.4em; margin: 0 auto; padding: 0; min-height: 35.0px; line-height: 35.0px; background: #0098cd; border-radius: 2.0px 2.0px 0 0;">Task código</p>
                <p style="width: 165.0px; color: #666666; font-weight: 300; text-align: center; font-size: 8.0em; margin: 0 auto; padding: 0; min-height: 130.0px; line-height: 130.0px; background: #ffffff; border-bottom: 3.0px solid #dddddd;"><span style="font-size: 36px;">{{task.id}}</span></p>
              </td>
            </tr>
          </tbody>
        </table>
      </td>
    </tr>
  </tbody>
</table>
<p>&nbsp;</p>'
  ),
  (
    'CONFORMITY - lembrete da Task',
    'lembrete_task',
    '<table class="x_1430992985hide" style="margin: 5.0px auto;" width="600" cellspacing="0" cellpadding="0">
  <tbody>
    <tr>
      <td>&nbsp;</td>
      <td style="text-align: right;"><a style="color: #bbbbbb; font-size: 0.75em;" href="https://app.conformity.me/" target="_blank" rel="noopener">Entrar no sistema</a></td>
    </tr>
  </tbody>
</table>
<table class="x_1430992985full" style="background: white; border-radius: 2.0px; overflow: hidden; border: 1.0px solid #dddddd; margin: 10.0px auto; font-size: 14.0px; line-height: 22.0px;" width="600" cellspacing="0" cellpadding="0">
  <tbody>
    <tr>
      <td style="background: #ffffff; padding: 25.0px 0;">
        <table style="width: 100.0%;" cellspacing="0" cellpadding="0" border="0">
          <tbody>
            <tr>
              <td style="text-align: left;">
                <h2><a href="https://app.conformity.me/" target="_blank" rel="noopener">Conformity.me</a> | {{empresa.nome}}</h2>
              </td>
              <td class="x_1430992985hide" style="width: 145.0px; text-align: right;"><img src="https://conformity.me/wp-content/uploads/2021/10/logo-conformity-e1635391941916.webp" style="float: none; width: 93px; height: 31px;" width="124" height="42" />&nbsp;</td>
            </tr>
          </tbody>
        </table>
      </td>
    </tr>
    <tr>
      <td style="background: #eeeeee; color: #444444; padding: 25.0px;">
        <table class="x_1430992985full_table" style="width: 100.0%; border: none;" cellspacing="0" cellpadding="0" border="0">
          <tbody>
            <tr>
              <td class="x_1430992985full_width" style="vertical-align: top;">
                <h2 style="margin: 0; font-size: 1.6em; line-height: 1.2em; letter-spacing: -1.0px;">Olá, {{usuario.nome}}</h2>
                <p><strong>A Task código:</strong> {{task.id}} <br /><strong>Título da task:</strong> {{task.titulo}}<br /><strong>Criada por:</strong> {{task.usuario}}<br /><strong>Origem:</strong> {{task.origem}}<br /><strong>Classificação:</strong> {{task.classificacao}}<br /><strong>Tipo:</strong> {{task.tipo}}<br /><strong>Previsão de fechamento</strong>: {{task.data_previsao}}<br /><strong>Mensagem do lembrete:</strong> {{lembrete.desc}}<br /></p>
                <p>
                  <!-- x-textbox/html -->Está aguardando para ser analisada por você. Clique no link a frente para acessar agora mesmo esta task e realizar sua avaliação:&nbsp; <strong>{{url.task}}</strong></p>
              </td>
              <td class="x_1430992985full_width" style="vertical-align: top; width: 165.0px;">
                <p style="width: 165.0px; color: white; font-weight: bold; text-align: center; font-size: 1.4em; margin: 0 auto; padding: 0; min-height: 35.0px; line-height: 35.0px; background: #0098cd; border-radius: 2.0px 2.0px 0 0;">Task código</p>
                <p style="width: 165.0px; color: #666666; font-weight: 300; text-align: center; font-size: 8.0em; margin: 0 auto; padding: 0; min-height: 130.0px; line-height: 130.0px; background: #ffffff; border-bottom: 3.0px solid #dddddd;"><span style="font-size: 36px;">{{task.id}}</span></p>
              </td>
            </tr>
          </tbody>
        </table>
      </td>
    </tr>
  </tbody>
</table>
<p>&nbsp;</p>'
  ),
  (
    'CONFORMITY - lembrete documentos',
    'lembrete_doc',
    '<table class="x_1430992985hide" style="margin: 5px auto;" width="600" cellspacing="0" cellpadding="0">
  <tbody>
    <tr>
      <td>&nbsp;<br /></td>
      <td style="text-align: right;"><a style="color: rgb(187, 187, 187); font-size: 0.75em;" href="https://app.conformity.me/" target="_blank" rel="noopener">Entrar no sistema</a></td>
    </tr>
  </tbody>
</table>
<a href="{{url.documento}}">
    </a><a href="{{url.documento}}">
  </a><a href="{{url.documento}}">
</a>
<table class="x_1430992985full" style="background: white none repeat scroll 0% 0%; border-radius: 2px; overflow: hidden; border: 1px solid rgb(221, 221, 221); margin: 10px auto; font-size: 14px; line-height: 22px;" width="600" cellspacing="0" cellpadding="0">
  <tbody>
    <tr>
      <td style="background: rgb(255, 255, 255) none repeat scroll 0% 0%; padding: 25px 0px;">
        <table style="width: 100%;" cellspacing="0" cellpadding="0" border="0">
          <tbody>
            <tr>
              <td style="text-align: left;">
                <h2><a href="https://app.conformity.me/" target="_blank" rel="noopener">Conformity.me</a> | {{empresa.nome}}</h2>
              </td>
              <td class="x_1430992985hide" style="width: 145px; text-align: right;"><img src="https://conformity.me/wp-content/uploads/2021/10/logo-conformity-e1635391941916.webp" style="float: none; width: 99px; height: 33px;" width="124" height="42" />&nbsp;</td>
            </tr>
          </tbody>
        </table>
      </td>
    </tr>
    <tr>
      <td style="background: rgb(238, 238, 238) none repeat scroll 0% 0%; color: rgb(68, 68, 68); padding: 25px;">
        <a href="{{url.documento}}">
            </a><a href="{{url.documento}}">
          </a><a href="{{url.documento}}">
        </a>
        <table class="x_1430992985full_table" style="width: 100%; border: medium none;" cellspacing="0" cellpadding="0" border="0">
          <tbody>
            <tr>
              <td class="x_1430992985full_width" style="vertical-align: top;">
                <h2 style="margin: 0px; font-size: 1.6em; line-height: 1.2em; letter-spacing: -1px;">Olá, {{usuario.nome}}</h2>
                <p><strong>Um lembrete foi criado para atualizar ou revisar o documento</strong></p>
                <p><strong>O Documento: </strong>{{documento.nome}}<br /><strong>Categoria do Documento:</strong> {{documento.categoria}}<br /><strong>Do departamento:</strong> {{documento.departamento}}<br /><strong>Menssagem do lembrete:</strong> {{lembrete.desc}}<br /></p>
                <p>Clique no link para acessar o documento - {{url.documento}}<br /></p>
              </td>
              <td class="x_1430992985full_width" style="vertical-align: top; width: 165px;">
                <p style="width: 165px; color: white; font-weight: bold; text-align: center; font-size: 1.4em; margin: 0px auto; padding: 0px; min-height: 35px; line-height: 35px; background: rgb(0, 152, 205) none repeat scroll 0% 0%; border-radius: 2px 2px 0px 0px;">Código do DOC<br /></p>
                <p style="width: 165px; color: rgb(102, 102, 102); font-weight: 300; text-align: center; font-size: 8em; margin: 0px auto; padding: 0px; min-height: 130px; line-height: 130px; background: rgb(255, 255, 255) none repeat scroll 0% 0%; border-bottom: 3px solid rgb(221, 221, 221);"><span style="font-size: 36px;"><a href="{{url.documento}}">{{documento.id}}</a></span></p><a href="{{url.documento}}">
              </a></td>
            </tr>
          </tbody>
        </table><a href="{{url.documento}}">
      </a></td>
    </tr>
  </tbody>
</table><a href="{{url.documento}}">
</a>
<p><br /></p>'
  ),
  (
  'Conformity - lembrete - CCTT',
  'lembrete_cctt',
  '<table class="x_1430992985hide" style="margin: 5px auto;" width="600" cellspacing="0" cellpadding="0">
  <tbody>
    <tr>
      <td>&nbsp;<br /></td>
      <td style="text-align: right;"><a style="color: rgb(187, 187, 187); font-size: 0.75em;" href="https://app.conformity.me/" target="_blank" rel="noopener">Entrar no sistema</a></td>
    </tr>
  </tbody>
</table>
<table class="x_1430992985full" style="background: white none repeat scroll 0% 0%; border-radius: 2px; overflow: hidden; border: 1px solid rgb(221, 221, 221); margin: 10px auto; font-size: 14px; line-height: 22px; width: 644px;" width="600" cellspacing="0" cellpadding="0">
  <tbody>
    <tr>
      <td style="background: rgb(255, 255, 255) none repeat scroll 0% 0%; padding: 25px 0px; width: 644px;">
        <table style="width: 100%;" cellspacing="0" cellpadding="0" border="0">
          <tbody>
            <tr>
              <td style="text-align: left;">
                <h2><a href="https://app.conformity.me/" target="_blank" rel="noopener">Conformity.me</a> | {{empresa.nome}}</h2>
              </td>
              <td class="x_1430992985hide" style="width: 145px; text-align: right;"><img src="https://conformity.me/wp-content/uploads/2021/10/logo-conformity-e1635391941916.webp" style="float: none; width: 86px; height: 29px;" width="124" height="42" />&nbsp;</td>
            </tr>
          </tbody>
        </table>
      </td>
    </tr>
    <tr>
      <td style="background: rgb(238, 238, 238) none repeat scroll 0% 0%; color: rgb(68, 68, 68); padding: 25px; width: 644px;">
        <table class="x_1430992985full_table" style="width: 100%; border: medium none;" cellspacing="0" cellpadding="0" border="0">
          <tbody>
            <tr>
              <td class="x_1430992985full_width" style="vertical-align: top;">
                <h2 style="margin: 0px; font-size: 1.6em; line-height: 1.2em; letter-spacing: -1px;">Olá, {{usuario.nome}}</h2>
                <p>Foi definido um lembrete no Conformity conforme abaixo informado:<br /></p>
                <p style="margin: 0pt 0pt 0.0001pt; text-align: justify; font-family: Calibri;"><span style="font-family:Calibri;font-size:10 , 5000pt;"><strong>O CCTT Processo:</strong>&nbsp;{{cctt.processo}} </span></p>
                <p style="margin: 0pt 0pt 0.0001pt; text-align: justify; font-family: Calibri;"><span style="font-family:Calibri;font-size:10 , 5000pt;"><strong>Macroprocesso:</strong>&nbsp;{{cctt.macroprocesso}}</span></p>
                <p style="margin: 0pt 0pt 0.0001pt; text-align: justify; font-family: Calibri;"><span style="font-family:Calibri;font-size:10 , 5000pt;"><strong>Atividade:</strong>&nbsp;{{cctt.atividade}}</span></p>
                <p style="margin: 0pt 0pt 0.0001pt; text-align: justify; font-family: Calibri;"><span style="font-family:Calibri;font-size:10 , 5000pt;"><strong>Prazo Intermediário:</strong>&nbsp;{{cctt.prazo_intermediario}}</span></p>
                <p style="margin: 0pt 0pt 0.0001pt; text-align: justify; font-family: Calibri;"><span style="font-family:Calibri;font-size:10 , 5000pt;"><strong>Prazo Corrente:</strong>&nbsp;{{cctt.prazo_corrente}}</span></p>
                <p style="margin: 0pt 0pt 0.0001pt; text-align: justify; font-family: Calibri;"><span style="font-family:Calibri;font-size:10 , 5000pt;"><br /></span></p>
                <p style="margin: 0pt 0pt 0.0001pt; text-align: justify; font-family: Calibri;"><a href="https://app.conformity.me/cctt/editar_cctt?id=cctt.id"><span style="font-family:Calibri;font-size:10 , 5000pt;">Clique aqui para acessar este processo.</span></a></p>



                <br />
              </td>
              <td class="x_1430992985full_width" style="vertical-align: top; width: 165px;">
                <p style="width: 165px; color: white; font-weight: bold; text-align: center; font-size: 1.4em; margin: 0px auto; padding: 0px; min-height: 35px; line-height: 35px; background: rgb(0, 152, 205) none repeat scroll 0% 0%; border-radius: 2px 2px 0px 0px;">CCTT código</p>
                <p style="width: 165px; color: rgb(102, 102, 102); font-weight: 300; text-align: center; font-size: 8em; margin: 0px auto; padding: 0px; min-height: 130px; line-height: 130px; background: rgb(255, 255, 255) none repeat scroll 0% 0%; border-bottom: 3px solid rgb(221, 221, 221);"><span style="font-size: 36px;">{{cctt.id}}</span></p>
              </td>
            </tr>
          </tbody>
        </table>
      </td>
    </tr>
  </tbody>
</table>
<p><br /></p>'
  ),
(
  'Conformity - Atualizado o feed da Task',
  'task-feed',
  '<table class="x_1430992985hide" style="margin: 5.0px auto;" width="600" cellspacing="0" cellpadding="0">
  <tbody>
    <tr>
      <td>&nbsp;</td>
      <td style="text-align: right;"><a style="color: #bbbbbb; font-size: 0.75em;" href="https://app.conformity.me/" target="_blank" rel="noopener">Entrar no sistema</a></td>
    </tr>
  </tbody>
</table>
<table class="x_1430992985full" style="background: white; border-radius: 2.0px; overflow: hidden; border: 1.0px solid #dddddd; margin: 10.0px auto; font-size: 14.0px; line-height: 22.0px;" width="600" cellspacing="0" cellpadding="0">
  <tbody>
    <tr>
      <td style="background: #ffffff; padding: 25.0px 0;">
        <table style="width: 100.0%;" cellspacing="0" cellpadding="0" border="0">
          <tbody>
            <tr>
              <td style="text-align: left; width: 75.3356%;">
                <h2><a href="https://app.conformity.me/" target="_blank" rel="noopener">Conformity.me</a> | {{empresa.nome}}</h2>
              </td>
              <td class="x_1430992985hide" style="width: 24.6644%; text-align: right;"><img src="https://conformity.me/wp-content/uploads/2021/10/logo-conformity-e1635391941916.webp" style="width: 85px; height: 28px; margin: 0px auto; display: block;" width="124" height="42" />&nbsp;</td>
            </tr>
          </tbody>
        </table>
      </td>
    </tr>
    <tr>
      <td style="background: #eeeeee; color: #444444; padding: 25.0px;">
        <table class="x_1430992985full_table" style="width: 100%; border: none; height: 276px;" cellspacing="0" cellpadding="0" border="0">
          <tbody>
            <tr style="height: 208px;">
              <td class="x_1430992985full_width" style="vertical-align: top; height: 208px;">
                <h2 style="margin: 0; font-size: 1.6em; line-height: 1.2em; letter-spacing: -1.0px;">Olá, {{usuario.nome}}</h2>
                <p><strong>A Task código:</strong> {{task.id}} <br /><strong>Título da task:</strong> {{task.titulo}}<br /><strong>Descrição:</strong> {{task.desc}}<br /><strong>Criada por:</strong> {{task.usuario}}<br /><strong>Origem:</strong> {{task.origem}}<br /><strong>Classificação:</strong> {{task.classificacao}}<br /><strong>Tipo:</strong> {{task.tipo}}<br /><strong>Previsão de fechamento</strong>: {{task.data_previsao}}<br /></p>
              </td>
              <td class="x_1430992985full_width" style="vertical-align: top; width: 165px; height: 208px;">
                <p style="width: 165.0px; color: white; font-weight: bold; text-align: center; font-size: 1.4em; margin: 0 auto; padding: 0; min-height: 35.0px; line-height: 35.0px; background: #0098cd; border-radius: 2.0px 2.0px 0 0;">Task código</p>
                <p style="width: 165.0px; color: #666666; font-weight: 300; text-align: center; font-size: 8.0em; margin: 0 auto; padding: 0; min-height: 130.0px; line-height: 130.0px; background: #ffffff; border-bottom: 3.0px solid #dddddd;"><span style="font-size: 36px;">{{task.id}}</span></p>
              </td>
            </tr>
            <tr style="height: 24px;">
              <td style="vertical-align: top; height: 24px;" colspan="2"><strong>Detalhes da Alteração:</strong>{{task.feed}}</td>
            </tr>
            <tr style="height: 44px;">
              <td style="vertical-align: top; height: 44px;" colspan="2">Esta TASK foi atualizada e você pode ver a atualização da mesma clicando no link da task:&nbsp; <strong>{{url.task}}</strong><br /></td>
            </tr>
          </tbody>
        </table>
      </td>
    </tr>
  </tbody>
</table>
<p>&nbsp;</p>'  
),
(
  'CONFORMITY - Documento revisado',
  'documento_revisado',
  '<table class="x_1430992985hide" style="margin: 5px auto;" width="600" cellspacing="0" cellpadding="0">
  <tbody>
    <tr>
      <td>&nbsp;<br /></td>
      <td style="text-align: right;"><a style="color: rgb(187, 187, 187); font-size: 0.75em;" href="https://app.conformity.me/" target="_blank" rel="noopener">Entrar no sistema</a></td>
    </tr>
  </tbody>
</table>
<a href="{{url.documento}}">
    </a><a href="{{url.documento}}">
  </a><a href="{{url.documento}}">
</a>
<table class="x_1430992985full" style="background: white none repeat scroll 0% 0%; border-radius: 2px; overflow: hidden; border: 1px solid rgb(221, 221, 221); margin: 10px auto; font-size: 14px; line-height: 22px;" width="600" cellspacing="0" cellpadding="0">
  <tbody>
    <tr>
      <td style="background: rgb(255, 255, 255) none repeat scroll 0% 0%; padding: 25px 0px;">
        <table style="width: 100%;" cellspacing="0" cellpadding="0" border="0">
          <tbody>
            <tr>
              <td style="text-align: left;">
                <h2><a href="https://app.conformity.me/" target="_blank" rel="noopener">Conformity.me</a> | {{empresa.nome}}</h2>
              </td>
              <td class="x_1430992985hide" style="width: 145px; text-align: right;"><img src="https://conformity.me/wp-content/uploads/2021/10/logo-conformity-e1635391941916.webp" style="float: none; width: 99px; height: 33px;" width="124" height="42" />&nbsp;</td>
            </tr>
          </tbody>
        </table>
      </td>
    </tr>
    <tr>
      <td style="background: rgb(238, 238, 238) none repeat scroll 0% 0%; color: rgb(68, 68, 68); padding: 25px;">
        <a href="{{url.documento}}">
            </a><a href="{{url.documento}}">
          </a><a href="{{url.documento}}">
        </a>
        <table class="x_1430992985full_table" style="width: 100%; border: medium none;" cellspacing="0" cellpadding="0" border="0">
          <tbody>
            <tr>
              <td class="x_1430992985full_width" style="vertical-align: top;">
                <h2 style="margin: 0px; font-size: 1.6em; line-height: 1.2em; letter-spacing: -1px;">Olá, {{usuario.nome}}</h2>
                <p><b>Um documento foi revisado</b></p>
                <p><strong>O Documento: </strong>{{documento.nome}}<br /><strong>Categoria do Documento:</strong> {{documento.categoria}}<br /><strong>Do departamento:</strong> {{documento.departamento}}<br /></p>
                <p>Clique no link para acessar o documento - {{url.documento}}<br /></p>
              </td>
              <td class="x_1430992985full_width" style="vertical-align: top; width: 165px;">
                <p style="width: 165px; color: white; font-weight: bold; text-align: center; font-size: 1.4em; margin: 0px auto; padding: 0px; min-height: 35px; line-height: 35px; background: rgb(0, 152, 205) none repeat scroll 0% 0%; border-radius: 2px 2px 0px 0px;">Código do DOC<br /></p>
                <p style="width: 165px; color: rgb(102, 102, 102); font-weight: 300; text-align: center; font-size: 8em; margin: 0px auto; padding: 0px; min-height: 130px; line-height: 130px; background: rgb(255, 255, 255) none repeat scroll 0% 0%; border-bottom: 3px solid rgb(221, 221, 221);"><span style="font-size: 36px;"><a href="{{url.documento}}">{{documento.id}}</a></span></p><a href="{{url.documento}}">
              </a></td>
            </tr>
          </tbody>
        </table><a href="{{url.documento}}">
      </a></td>
    </tr>
  </tbody>
</table><a href="{{url.documento}}">
</a>
<p><br /></p>'
),
(
'CONFORMITY - Documento aprovado',
'documento_aprovado',
'<table class="x_1430992985hide" style="margin: 5px auto;" width="600" cellspacing="0" cellpadding="0">
  <tbody>
    <tr>
      <td>&nbsp;<br /></td>
      <td style="text-align: right;"><a style="color: rgb(187, 187, 187); font-size: 0.75em;" href="https://app.conformity.me/" target="_blank" rel="noopener">Entrar no sistema</a></td>
    </tr>
  </tbody>
</table>
<a href="{{url.documento}}">
    </a><a href="{{url.documento}}">
  </a><a href="{{url.documento}}">
</a>
<table class="x_1430992985full" style="background: white none repeat scroll 0% 0%; border-radius: 2px; overflow: hidden; border: 1px solid rgb(221, 221, 221); margin: 10px auto; font-size: 14px; line-height: 22px;" width="600" cellspacing="0" cellpadding="0">
  <tbody>
    <tr>
      <td style="background: rgb(255, 255, 255) none repeat scroll 0% 0%; padding: 25px 0px;">
        <table style="width: 100%;" cellspacing="0" cellpadding="0" border="0">
          <tbody>
            <tr>
              <td style="text-align: left;">
                <h2><a href="https://app.conformity.me/" target="_blank" rel="noopener">Conformity.me</a> | {{empresa.nome}}</h2>
              </td>
              <td class="x_1430992985hide" style="width: 145px; text-align: right;"><img src="https://conformity.me/wp-content/uploads/2021/10/logo-conformity-e1635391941916.webp" style="float: none; width: 99px; height: 33px;" width="124" height="42" />&nbsp;</td>
            </tr>
          </tbody>
        </table>
      </td>
    </tr>
    <tr>
      <td style="background: rgb(238, 238, 238) none repeat scroll 0% 0%; color: rgb(68, 68, 68); padding: 25px;">
        <a href="{{url.documento}}">
            </a><a href="{{url.documento}}">
          </a><a href="{{url.documento}}">
        </a>
        <table class="x_1430992985full_table" style="width: 100%; border: medium none;" cellspacing="0" cellpadding="0" border="0">
          <tbody>
            <tr>
              <td class="x_1430992985full_width" style="vertical-align: top;">
                <h2 style="margin: 0px; font-size: 1.6em; line-height: 1.2em; letter-spacing: -1px;">Olá, {{usuario.nome}}</h2>
                <p><b>Um documento foi aprovado</b></p>
                <p><strong>O Documento: </strong>{{documento.nome}}<br /><strong>Categoria do Documento:</strong> {{documento.categoria}}<br /><strong>Do departamento:</strong> {{documento.departamento}}<br /></p>
                <p>Clique no link para acessar o documento - {{url.documento}}<br /></p>
              </td>
              <td class="x_1430992985full_width" style="vertical-align: top; width: 165px;">
                <p style="width: 165px; color: white; font-weight: bold; text-align: center; font-size: 1.4em; margin: 0px auto; padding: 0px; min-height: 35px; line-height: 35px; background: rgb(0, 152, 205) none repeat scroll 0% 0%; border-radius: 2px 2px 0px 0px;">Código do DOC<br /></p>
                <p style="width: 165px; color: rgb(102, 102, 102); font-weight: 300; text-align: center; font-size: 8em; margin: 0px auto; padding: 0px; min-height: 130px; line-height: 130px; background: rgb(255, 255, 255) none repeat scroll 0% 0%; border-bottom: 3px solid rgb(221, 221, 221);"><span style="font-size: 36px;"><a href="{{url.documento}}">{{documento.id}}</a></span></p><a href="{{url.documento}}">
              </a></td>
            </tr>
          </tbody>
        </table><a href="{{url.documento}}">
      </a></td>
    </tr>
  </tbody>
</table><a href="{{url.documento}}">
</a>
<p><br /></p>'
),
(
'CONFORMITY - Lembrete de lead',
'lembrete_lead',
'<table class="x_1430992985hide" style="margin: 5.0px auto;" width="600" cellspacing="0" cellpadding="0">
  <tbody>
    <tr>
      <td>&nbsp;</td>
      <td style="text-align: right;"><a style="color: #bbbbbb; font-size: 0.75em;" href="https://app.conformity.me/" target="_blank" rel="noopener">Entrar no sistema</a></td>
    </tr>
  </tbody>
</table>
<table class="x_1430992985full" style="background: white; border-radius: 2.0px; overflow: hidden; border: 1.0px solid #dddddd; margin: 10.0px auto; font-size: 14.0px; line-height: 22.0px;" width="600" cellspacing="0" cellpadding="0">
  <tbody>
    <tr>
      <td style="background: #ffffff; padding: 25.0px 0;">
        <table style="width: 100.0%;" cellspacing="0" cellpadding="0" border="0">
          <tbody>
            <tr>
              <td style="text-align: left;">
                <h2><a href="https://app.conformity.me/" target="_blank" rel="noopener">Conformity.me</a> | {{empresa.nome}}</h2>
              </td>
              <td class="x_1430992985hide" style="width: 145.0px; text-align: right;"><img src="https://conformity.me/wp-content/uploads/2021/10/logo-conformity-e1635391941916.webp" style="float: none; width: 93px; height: 31px;" width="124" height="42" />&nbsp;</td>
            </tr>
          </tbody>
        </table>
      </td>
    </tr>
    <tr>
      <td style="background: #eeeeee; color: #444444; padding: 25.0px;">
        <table class="x_1430992985full_table" style="width: 100.0%; border: none;" cellspacing="0" cellpadding="0" border="0">
          <tbody>
            <tr>
              <td class="x_1430992985full_width" style="vertical-align: top;">
                <h2 style="margin: 0; font-size: 1.6em; line-height: 1.2em; letter-spacing: -1.0px;">Olá, {{usuario.nome}}</h2>
                <p><strong>Cliente:</strong> {{lead.cliente}}<strong><br />Descrição do lead:</strong> {{lead.descricao}}<br /><strong>Tipo:</strong> {{lead.tarefa.tipo}}<br /><strong>Data</strong>: {{lead.tarefa.data}}<br /><strong>Hora</strong>: {{lead.tarefa.hora}}<br /><strong>Descrição</strong>: {{lead.tarefa.descricao}}</p>
                <p>
                  <!-- x-textbox/html -->Está aguardando para ser analisada por você. Clique no link a frente para acessar agora mesmo esta task e realizar sua avaliação:&nbsp; <strong>{{url.lead.tarefa}}</strong></p>
              </td>
              <td class="x_1430992985full_width" style="vertical-align: top; width: 165.0px;">
                <p style="width: 165.0px; color: white; font-weight: bold; text-align: center; font-size: 1.4em; margin: 0 auto; padding: 0; min-height: 35.0px; line-height: 35.0px; background: #0098cd; border-radius: 2.0px 2.0px 0 0;">Lead código</p>
                <p style="width: 165.0px; color: #666666; font-weight: 300; text-align: center; font-size: 8.0em; margin: 0 auto; padding: 0; min-height: 130.0px; line-height: 130.0px; background: #ffffff; border-bottom: 3.0px solid #dddddd;"><span style="font-size: 36px;">{{lead.id}}</span></p>
              </td>
            </tr>
          </tbody>
        </table>
      </td>
    </tr>
  </tbody>
</table>
<p>&nbsp;</p>'
),
(
'Conformity - Atualização do feed do Documento #{{documento.id}}',
'documentos-feed',
'<table class="x_1430992985hide" style="margin: 5.0px auto;" width="600" cellspacing="0" cellpadding="0">
  <tbody>
    <tr>
      <td>&nbsp;</td>
      <td style="text-align: right;"><a style="color: #bbbbbb; font-size: 0.75em;" href="https://app.conformity.me/" target="_blank" rel="noopener">Entrar no sistema</a></td>
    </tr>
  </tbody>
</table>
<table class="x_1430992985full" style="background: white; border-radius: 2.0px; overflow: hidden; border: 1.0px solid #dddddd; margin: 10.0px auto; font-size: 14.0px; line-height: 22.0px;" width="600" cellspacing="0" cellpadding="0">
  <tbody>
    <tr>
      <td style="background: #ffffff; padding: 25.0px 0;">
        <table style="width: 100.0%;" cellspacing="0" cellpadding="0" border="0">
          <tbody>
            <tr>
              <td style="text-align: left; width: 75.3356%;">
                <h2><a href="https://app.conformity.me/" target="_blank" rel="noopener">Conformity.me</a> | {{empresa.nome}}</h2>
              </td>
              <td class="x_1430992985hide" style="width: 24.6644%; text-align: right;"><img src="https://conformity-bucket.s3.us-east-2.amazonaws.com/logo.png" style="float: none; width: 85px; height: 28px;" width="124" height="42" />&nbsp;</td>
            </tr>
          </tbody>
        </table>
      </td>
    </tr>
    <tr>
      <td style="background: #eeeeee; color: #444444; padding: 25.0px;">
        <table class="x_1430992985full_table" style="width: 100%; border: none; height: 276px;" cellspacing="0" cellpadding="0" border="0">
          <tbody>
            <tr style="height: 208px;">
              <td class="x_1430992985full_width" style="vertical-align: top; height: 208px;">
                <h2 style="margin: 0; font-size: 1.6em; line-height: 1.2em; letter-spacing: -1.0px;">Olá, {{usuario.nome}}</h2>
                <p><strong>O Documento código:</strong> {{documento.id}} <br /><strong>Título do Documento:</strong> {{documento.nome}}<br /><strong>Descrição:</strong> {{documento.descricao}}<br /></p>
              </td>
              <td class="x_1430992985full_width" style="vertical-align: top; width: 165px; height: 208px;">
                <p style="width: 165.0px; color: white; font-weight: bold; text-align: center; font-size: 1.4em; margin: 0 auto; padding: 0; min-height: 35.0px; line-height: 35.0px; background: #0098cd; border-radius: 2.0px 2.0px 0 0;">Documento código</p>
                <p style="width: 165.0px; color: #666666; font-weight: 300; text-align: center; font-size: 8.0em; margin: 0 auto; padding: 0; min-height: 130.0px; line-height: 130.0px; background: #ffffff; border-bottom: 3.0px solid #dddddd;"><span style="font-size: 36px;">{{documento.id}}</span></p>
              </td>
            </tr>
            <tr style="height: 24px;">
              <td style="vertical-align: top; height: 24px;" colspan="2"><strong>Detalhes da Alteração:</strong>{{documento.feed}}</td>
            </tr>
            <tr style="height: 44px;">
              <td style="vertical-align: top; height: 44px;" colspan="2">Este DOCUMENTO foi atualizado e você pode ver a atualização do mesmo clicando no link do DOCUMENTO:&nbsp; <strong>{{url.documento}}</strong><br /></td>
            </tr>
          </tbody>
        </table>
      </td>
    </tr>
  </tbody>
</table>
<p>&nbsp;</p>'
)
`;

export class EmailsModels1734528226257 implements MigrationInterface {
  private readonly TABLE_NAME = 'emails_models';
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: this.TABLE_NAME,
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'title',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'slug',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'body',
            type: 'text',
            isNullable: false,
          },
        ],
      }),
    );
    await queryRunner.query(createEmailsModelsQuery);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable(this.TABLE_NAME);
  }
}
