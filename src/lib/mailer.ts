import { renderAsync } from '@react-email/render';
import { Resend } from 'resend';

import { env } from '@/lib/config';

import { RequireAtLeastOne } from './types';

const mailer = new Resend(env.RESEND_API_KEY);

type EmailRenderOptions = {
    text?: string;
    html?: string;
    react?: React.ReactElement | React.ReactNode | null;
};

type MailOptions = RequireAtLeastOne<EmailRenderOptions> & {
    to: string | string[];
    subject: string;
};

export async function sendMail(options: MailOptions) {
    await mailer.emails.send({ from: `Onboarding <${env.RESEND_FROM_EMAIL}>`, ...options });
}

export function jsxToHtml(jsx: React.ReactElement, plainText?: boolean) {
    return renderAsync(jsx, { plainText });
}

export default mailer;
