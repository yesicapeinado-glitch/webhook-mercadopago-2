export default async function handler(req, res) {
  const { tipo, gclid } = req.query;

  const gclidSafe = gclid || "";

  let valor = 0;
  let titulo = "";

  if (tipo === "individual") {
    valor = 120;
    titulo = "Sessão individual";
  }

  if (tipo === "mensal") {
    valor = 360;
    titulo = "Acompanhamento mensal";
  }

  if (!valor) {
    return res.status(400).json({ error: "Tipo inválido" });
  }

  const preference = {
    items: [
      {
        title: titulo,
        quantity: 1,
        unit_price: valor, // 🔥 valor real (produção)
      },
    ],

   back_urls: {
  success: `https://yesicapeinadotransforma.com/obrigado?valor=${valor}&gclid=${gclidSafe}`,
  failure: `https://yesicapeinadotransforma.com/erro`,
  pending: `https://yesicapeinadotransforma.com/pendente?valor=${valor}&gclid=${gclidSafe}`,
},
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
    console.error("Erro ao criar pagamento:", error);
    return res.status(500).json({ error: "Erro ao criar pagamento" });
  }
}
