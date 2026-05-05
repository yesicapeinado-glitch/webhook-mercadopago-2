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

  console.log("Status atual:", payment.status);

  // 🔥 TRATAMENTO CORRETO
  if (payment.status === "approved") {
    console.log("✅ PAGAMENTO CONFIRMADO");

  } else if (payment.status === "pending") {
    console.log("⏳ Aguardando pagamento");

  } else if (payment.status === "in_process") {
    console.log("🔄 Em processamento");

  } else {
    console.log("❌ Ainda não aprovado:", payment.status);
  }
}
