
// Aguarda o carregamento completo do HTML
document.addEventListener('DOMContentLoaded', () => {

    // Atualiza automaticamente o ano do rodapé
    const rodape = document.querySelector('.footer p');

    if (rodape) {
        rodape.textContent = `© ${new Date().getFullYear()} FitDay. Todos os direitos reservados.`;
    }

    // Rolagem suave para os links internos
    const linksInternos = document.querySelectorAll('a[href^="#"]');

    linksInternos.forEach(link => {
        link.addEventListener('click', (evento) => {
            const destino = link.getAttribute('href');

            if (destino === '#') return;

            const secao = document.querySelector(destino);

            if (secao) {
                evento.preventDefault();

                secao.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

});
