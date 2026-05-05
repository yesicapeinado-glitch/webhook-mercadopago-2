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
      unit_price: valor,
    },
  ],

  back_urls: {
    success: `https://yesicapeinadotransforma.com/obrigado?valor=${valor}&gclid=${gclidSafe}`,
    failure: `https://yesicapeinadotransforma.com/erro`,
    pending: `https://yesicapeinadotransforma.com/pendente`,
  },

  auto_return: "approved",
};
