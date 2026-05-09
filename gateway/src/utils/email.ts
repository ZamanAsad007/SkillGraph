import net from "node:net";
import tls from "node:tls";
import { env } from "../config/env.js";

type MailOptions = {
  to: string;
  subject: string;
  text: string;
};

type SmtpSocket = net.Socket | tls.TLSSocket;

function readResponse(socket: SmtpSocket) {
  return new Promise<string>((resolve, reject) => {
    let buffer = "";
    const onData = (chunk: Buffer) => {
      buffer += chunk.toString("utf8");
      const lines = buffer.split(/\r?\n/).filter(Boolean);
      const last = lines[lines.length - 1];

      if (last && /^\d{3}\s/.test(last)) {
        cleanup();
        resolve(buffer);
      }
    };
    const onError = (error: Error) => {
      cleanup();
      reject(error);
    };
    const cleanup = () => {
      socket.off("data", onData);
      socket.off("error", onError);
    };

    socket.on("data", onData);
    socket.on("error", onError);
  });
}

async function command(socket: SmtpSocket, value: string, expected: number[]) {
  socket.write(`${value}\r\n`);
  const response = await readResponse(socket);
  const code = Number(response.slice(0, 3));

  if (!expected.includes(code)) {
    throw new Error(`SMTP command failed: ${value} -> ${response.trim()}`);
  }

  return response;
}

function connectSocket() {
  const port = env.SMTP_PORT ?? (env.SMTP_SECURE ? 465 : 587);

  return new Promise<SmtpSocket>((resolve, reject) => {
    const socket = env.SMTP_SECURE
      ? tls.connect(port, env.SMTP_HOST)
      : net.connect(port, env.SMTP_HOST);

    socket.once("connect", () => resolve(socket));
    socket.once("error", reject);
  });
}

function encodeSubject(subject: string) {
  return /^[\x00-\x7F]*$/.test(subject)
    ? subject
    : `=?UTF-8?B?${Buffer.from(subject, "utf8").toString("base64")}?=`;
}

function formatMessage({ to, subject, text }: MailOptions) {
  const from = env.SMTP_FROM ?? env.SMTP_USER ?? "no-reply@skillgraph.local";

  return [
    `From: ${from}`,
    `To: ${to}`,
    `Subject: ${encodeSubject(subject)}`,
    "MIME-Version: 1.0",
    "Content-Type: text/plain; charset=UTF-8",
    "",
    text
  ].join("\r\n");
}

export function isEmailConfigured() {
  return Boolean(env.SMTP_HOST && env.SMTP_USER && env.SMTP_PASS);
}

export async function sendMail(options: MailOptions) {
  if (!isEmailConfigured()) {
    throw new Error("SMTP is not configured");
  }

  let socket = await connectSocket();

  try {
    await readResponse(socket);
    await command(socket, "EHLO skillgraph.local", [250]);

    if (!env.SMTP_SECURE) {
      await command(socket, "STARTTLS", [220]);
      socket = tls.connect({
        socket,
        servername: env.SMTP_HOST
      });
      await command(socket, "EHLO skillgraph.local", [250]);
    }

    await command(socket, "AUTH LOGIN", [334]);
    await command(socket, Buffer.from(env.SMTP_USER!).toString("base64"), [334]);
    await command(socket, Buffer.from(env.SMTP_PASS!).toString("base64"), [235]);

    const from = env.SMTP_FROM ?? env.SMTP_USER!;
    await command(socket, `MAIL FROM:<${from}>`, [250]);
    await command(socket, `RCPT TO:<${options.to}>`, [250, 251]);
    await command(socket, "DATA", [354]);
    await command(socket, `${formatMessage(options)}\r\n.`, [250]);
    await command(socket, "QUIT", [221]);
  } finally {
    socket.end();
  }
}

export async function sendVerificationEmail(to: string, token: string) {
  const verificationUrl = `${env.FRONTEND_URL}/login?token=${encodeURIComponent(token)}`;

  await sendMail({
    to,
    subject: "Confirm your SkillGraph email",
    text: [
      "Confirm your SkillGraph email",
      "",
      "Paste this confirmation token in SkillGraph:",
      token,
      "",
      `This token expires in 24 hours.`
    ].join("\n")
  });

  return verificationUrl;
}
