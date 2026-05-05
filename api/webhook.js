export default async function handler(req, res) {
  try {
    const body = req.body;

    console.log("📩 Webhook recebido:", body);

    // 🔥 Só processa eventos de pagamento
    if (body.type === "payment") {
      const paymentId = body?.data?.id;

      if (!paymentId) {
        console.log("⚠️ Webhook sem paymentId");
        return res.status(200).json({ ok: true });
      }

      console.log("🔎 Buscando pagamento:", paymentId);

      const response = await fetch(
        `https://api.mercadopago.com/v1/payments/${paymentId}`,
        {
          headers: {
            Authorization: `Bearer ${process.env.MP_ACCESS_TOKEN}`,
          },
        }
      );

      if (!response.ok) {
        console.log("❌ Erro ao buscar pagamento:", response.status);
        return res.status(200).json({ ok: true });
      }

      const payment = await response.json();

      console.log("💳 Status atual:", payment.status);

      // ✅ LÓGICA CORRETA PARA PIX / CARTÃO
      if (payment.status === "approved") {
        console.log("✅ PAGAMENTO CONFIRMADO");

        // 👉 AQUI você pode:
        // liberar acesso
        // enviar conversão
        // salvar venda

      } else if (payment.status === "pending") {
        console.log("⏳ Aguardando pagamento");

      } else if (payment.status === "in_process") {
        console.log("🔄 Em processamento");

      } else {
        console.log("❌ Ainda não aprovado:", payment.status);
      }
    }

    return res.status(200).json({ ok: true });

  } catch (error) {
    console.error("🚨 Erro no webhook:", error);
    return res.status(500).json({ error: true });
  }
}
