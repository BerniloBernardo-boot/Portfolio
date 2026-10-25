const formularioContacto = document.querySelector("#formulario-contacto");
const estadoContacto = document.querySelector("#estado-contacto");
const anoRodape = document.querySelector("#ano-rodape");

const emailDestino = "BerniloBernardodev11@gmail.com";

if (anoRodape) {
  anoRodape.textContent = new Date().getFullYear();
}

if (formularioContacto && estadoContacto) {
  formularioContacto.addEventListener("submit", (evento) => {
    evento.preventDefault();

    const dadosFormulario = new FormData(formularioContacto);
    const nome = String(dadosFormulario.get("name") || "").trim();
    const emailRemetente = String(dadosFormulario.get("email") || "").trim();
    const assunto = String(dadosFormulario.get("subject") || "").trim();
    const mensagem = String(dadosFormulario.get("message") || "").trim();

    if (!nome || !emailRemetente || !assunto || !mensagem) {
      estadoContacto.textContent = "Preenche todos os campos antes de continuar.";
      return;
    }

    const corpoMensagem = [
      `Nome: ${nome}`,
      `E-mail de resposta: ${emailRemetente}`,
      "",
      "Mensagem:",
      mensagem
    ].join("\n");

    const enderecoEmail = new URL(`mailto:${emailDestino}`);
    enderecoEmail.searchParams.set("subject", assunto);
    enderecoEmail.searchParams.set("body", corpoMensagem);

    estadoContacto.textContent = "A abrir o meu e-mail.";
    window.location.href = enderecoEmail.toString();
  });
}
