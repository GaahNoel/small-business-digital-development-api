import { env } from '@/main/config/env';

const webUrl = `${env.webUrl}}/email-validation`;
export const makeVerifyAccountMessage = (accountName, hashedEmail) => (
  `
    <span>Olá <strong>${accountName}</strong></span>,
    <p>Verifique seu email agora e comece a aproveitar nossa plataforma! 😄</p>
    <p> ${webUrl}/${hashedEmail} </p>
  `
);
