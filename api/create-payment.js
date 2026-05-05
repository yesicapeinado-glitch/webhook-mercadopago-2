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

  const response = await fetch("https://api.mercadopago.com/checkout/preferences", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.MP_ACCESS_TOKEN}`,
    },
    body: JSON.stringify({
      items: [
        {
          title: titulo,
          quantity: 1,
          unit_price: valor,
        },
      ],
      back_urls: {
        success: `https://yesicapeinadotransforma.com/obrigado?valor=${valor}&gclid=${gclidSafe}`,
        failure: `https://yesicapeinadotransforma.com/erro`,
        pending: `https://yesicapeinadotransforma.com/pendente`,
      },
      auto_return: "approved",
    }),
  });

  const data = await response.json();

  return res.redirect(data.init_point);
}
