export const userEmailContentTemplate = (userName: string) => {
  return `
      <p>Olá, ${userName}</p>
      <p>Recebemos seu contato pelo nosso sistema e em breve alguém de nossa equipe entrará em contato.</p>
      <p>
        conformity@klaston.com<br />
        Suporte do Conformity<br />
        +55 11 3280 2717<br />
        <img src="http://app.conformity.me/uploads/logo-klaston-oficial2-small.jpg" />
      </p>
    `;
};

export const supportEmailContentTemplate = (
  userName: string,
  description: string,
  userEmail: string,
  issueDepartment: string,
  priority: string,
) => {
  return `
      <h3>${userName} enviou uma mensagem:</h3>
      <p>${description}</p>
      <p><strong>Email:</strong> ${userEmail}</p>
      <p><strong>Departamento:</strong> ${issueDepartment}</p>
      <p><strong>Prioridade:</strong> ${priority}</p>
    `;
};
