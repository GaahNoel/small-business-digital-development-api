const webUrl = 'https://www.example.com';
export const makeVerifyAccountMessage = (accountName) => (
  `
    <span>Olá <strong>${accountName}</strong></span>,
    <p>Verifique seu email agora e comece a aproveitar nossa plataforma! 😄</p>
    <p> ${webUrl} </p>
  `
);
