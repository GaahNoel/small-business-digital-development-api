import { NodeMailerAdapter } from '@/infra/email/nodemailer-adapter';

describe('NodeMailer Adapter', () => {
  it('should send email when receive a email and message ', async () => {
    const sut = new NodeMailerAdapter(
      'from@example.com',
      '88d3be68277b04',
      '781c154f4f8d37',
      'smtp.mailtrap.io',
      2525,
      false,
    );
    const result = await sut.send({
      toEmail: 'to@example.com',
      subject: 'any_subject',
      message: 'any_message',
    });
    expect(result).toBe(true);
  });
});
