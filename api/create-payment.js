export default async function handler(req, res) {
  const { tipo, gclid } = req.query;

  const gclidSafe = gclid || "";

  let valorReal = 0;
  let valorCobrado = 1; // 🔥 TESTE COM R$1
  let titulo = "";

  if (tipo === "individual") {
    valorReal = 120;
    titulo = "Sessão individual";
  }

  if (tipo === "mensal") {
    valorReal = 360;
    titulo = "Acompanhamento mensal";
  }

  if (!valorReal) {
    return res.status(400).json({ error: "Tipo inválido" });
  }

  const preference = {
    items: [
      {
        title: titulo,
        quantity: 1,
        unit_price: valorCobrado, // 🔥 cobra R$1
      },
    ],

    back_urls: {
      success: `https://yesicapeinadotransforma.com/obrigado?valor=${valorReal}&gclid=${gclidSafe}`,
      failure: `https://yesicapeinadotransforma.com/erro`,
      pending: `https://yesicapeinadotransforma.com/pendente`,
    },

    auto_return: "approved",
  };

  try {
    const response = await fetch("https://api.mercadopago.com/checkout/preferences", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.MP_ACCESS_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(preference),
    });

    const data = await response.json();

    return res.redirect(data.init_point);

  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Erro ao criar pagamento" });
  }
}
