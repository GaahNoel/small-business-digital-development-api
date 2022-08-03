import { NodeMailerAdapter } from '@/infra/email/nodemailer-adapter';

jest.setTimeout(30000);
describe('NodeMailer Adapter', () => {
  let sut: NodeMailerAdapter;

  beforeEach(async () => {
    if (sut) {
      await sut.transporter.close();
    }

    sut = new NodeMailerAdapter(
      'from@example.com',
      '88d3be68277b04',
      '781c154f4f8d37',
      'smtp.mailtrap.io',
      2525,
      false,
    );
  });

  it('should send email when receive a email and message ', async () => {
    const result = await sut.send({
      toEmail: 'to@example.com',
      subject: 'any_subject',
      message: 'any_message',
    });

    expect(result).toBe(true);
  });

  afterAll(async () => {
    await sut.transporter.close();
  });
});
