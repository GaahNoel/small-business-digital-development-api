export interface EmailVerificationSender {
  send(params: EmailVerificationSender.Params): Promise<EmailVerificationSender.Result>;
}

export namespace EmailVerificationSender {
  export type Params = {
    toEmail: string,
    message: string,
    subject: string,
  };
  export type Result = boolean;
}
