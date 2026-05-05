export default async function handler(req, res) {
  try {
    const body = req.body;

    console.log("Webhook recebido:", body);

    if (body.type === "payment") {
      const paymentId = body.data?.id;

      console.log("Pagamento ID:", paymentId);

      // 🔥 BUSCA DETALHES DO PAGAMENTO
      const response = await fetch(
        `https://api.mercadopago.com/v1/payments/${paymentId}`,
        {
          headers: {
            Authorization: `Bearer ${process.env.MP_ACCESS_TOKEN}`,
          },
        }
      );

      const payment = await response.json();

      console.log("Status do pagamento:", payment.status);

      // ✅ VERIFICA SE FOI APROVADO
      if (payment.status === "approved") {
        console.log("PAGAMENTO APROVADO ✅");

        // 👉 AQUI você pode:
        // - enviar conversão pro Google Ads
        // - liberar acesso
        // - salvar no banco
      }
    }

    return res.status(200).json({ ok: true });

  } catch (error) {
    console.error("Erro no webhook:", error);
    return res.status(500).json({ error: true });
  }
}
