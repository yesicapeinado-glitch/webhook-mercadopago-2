export default async function handler(req, res) {
  try {
    const body = req.body;

    console.log("Webhook recebido:", body);

    if (body.type === "payment") {
      const paymentId = body.data.id;

      const response = await fetch(
        `https://api.mercadopago.com/v1/payments/${paymentId}`,
        {
          headers: {
            Authorization: `Bearer ${process.env.MP_ACCESS_TOKEN}`,
          },
        }
      );

      const payment = await response.json();

      console.log("Pagamento completo:", payment);

      // 🔥 AQUI É O QUE IMPORTA
      if (payment.status === "approved") {
        console.log("✅ PAGAMENTO APROVADO");

        // 👉 AQUI você faz o que quiser:
        // liberar acesso
        // enviar evento pro Google Ads
        // salvar no banco
      } else {
        console.log("❌ Pagamento não aprovado:", payment.status);
      }
    }

    return res.status(200).json({ ok: true });

  } catch (error) {
    console.error("Erro no webhook:", error);
    return res.status(500).json({ error: true });
  }
}
