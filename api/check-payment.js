export default async function handler(req, res) {
  const { payment_id } = req.query;

  if (!payment_id) {
    return res.status(400).json({ error: "payment_id obrigatório" });
  }

  try {
    const response = await fetch(
      `https://api.mercadopago.com/v1/payments/${payment_id}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${process.env.MP_ACCESS_TOKEN}`,
        },
      }
    );

    const data = await response.json();

    console.log("MP RESPONSE:", data); // 👈 debug importante

    return res.status(200).json({
      status: data.status,
    });

  } catch (error) {
    console.error("Erro:", error);
    return res.status(500).json({ error: "Erro ao consultar pagamento" });
  }
}
