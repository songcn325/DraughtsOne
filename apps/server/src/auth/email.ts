type EmailMessage = {
  to: string;
  subject: string;
  text: string;
};

export async function sendEmail(message: EmailMessage) {
  if (process.env.SMTP_HOST) return sendSmtpEmail(message);

  console.info(`[email disabled] To: ${message.to}\nSubject: ${message.subject}\n${message.text}`);
  return false;
}

async function sendSmtpEmail(message: EmailMessage) {
  const tls = await import("node:tls");
  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT ?? 465);
  const username = process.env.SMTP_USER;
  const password = process.env.SMTP_PASS;
  const from = process.env.SMTP_FROM ?? username;

  if (!host || !username || !password || !from) return false;

  const socket = tls.connect({ host, port, servername: host });
  socket.setEncoding("utf8");

  let buffer = "";
  const readResponse = (expected: number[]) => new Promise<string>((resolve, reject) => {
    const timeout = setTimeout(() => reject(new Error("SMTP response timed out.")), 10000);
    const onData = (chunk: string) => {
      buffer += chunk;
      const lines = buffer.split(/\r?\n/).filter(Boolean);
      const last = lines[lines.length - 1];
      if (!last || /^\d{3}-/.test(last)) return;
      const code = Number(last.slice(0, 3));
      if (!Number.isFinite(code)) return;
      socket.off("data", onData);
      clearTimeout(timeout);
      const response = buffer;
      buffer = "";
      if (!expected.includes(code)) reject(new Error(`Unexpected SMTP response: ${response}`));
      else resolve(response);
    };
    socket.on("data", onData);
  });

  const write = async (command: string, expected: number[]) => {
    socket.write(`${command}\r\n`);
    return readResponse(expected);
  };

  await new Promise<void>((resolve, reject) => {
    socket.once("secureConnect", resolve);
    socket.once("error", reject);
  });
  await readResponse([220]);
  await write(`EHLO ${process.env.SMTP_EHLO_DOMAIN ?? "draughtsone.app"}`, [250]);
  await write("AUTH LOGIN", [334]);
  await write(Buffer.from(username).toString("base64"), [334]);
  await write(Buffer.from(password).toString("base64"), [235]);
  await write(`MAIL FROM:<${from}>`, [250]);
  await write(`RCPT TO:<${message.to}>`, [250, 251]);
  await write("DATA", [354]);
  socket.write(formatMessage(from, message));
  await readResponse([250]);
  await write("QUIT", [221]);
  socket.end();
  return true;
}

function formatMessage(from: string, message: EmailMessage) {
  const headers = [
    `From: ${from}`,
    `To: ${message.to}`,
    `Subject: ${message.subject}`,
    "MIME-Version: 1.0",
    "Content-Type: text/plain; charset=UTF-8"
  ].join("\r\n");
  return `${headers}\r\n\r\n${message.text}\r\n.\r\n`;
}
