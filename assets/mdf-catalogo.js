/* ============================================================
   Madê Marcenaria — catálogo de MDF (dados)

   Padrões dos dois fabricantes que a dona cita nas legendas do
   Instagram: Arauco (linha Arauco Melamina) e Duratex. Nomes e linhas
   conferidos nos sites dos fabricantes em 17/10/2026:
   - arauco.com.br/categoria/arauco-melamina/ (Cores, Madeiras,
     Madeiras Brasileiras, Tecidos, Pedras; texturas Matt, Trend, Poro,
     Bold, Nature, Chess, TX, Couro)
   - duratexmadeira.com.br (linhas Design, Essencial Wood, Cristallo, Trama)

   A COR (hex) É APROXIMAÇÃO NOSSA, para a tela. A referência é a amostra
   física — o site diz isso ao lado do catálogo. Disponibilidade muda com
   o catálogo vigente de cada fabricante: conferir antes de prometer.

   `made`: padrões que aparecem em projetos publicados pela Madê
   (legendas do Instagram), com o projeto.

   Campos: id, nome, marca, linha (textura/linha do fabricante),
   familia (solido | madeira | brasileira | brilho | textura), cor.
   ============================================================ */
(function () {
  'use strict';
  function p(id, nome, marca, linha, familia, cor, made) { return { id: id, nome: nome, marca: marca, linha: linha, familia: familia, cor: cor, made: made || '' }; }

  window.MadeCatalogoMDF = [
    /* ---------- Arauco · Cores ---------- */
    p('a-branco-supremo', 'Branco Supremo', 'Arauco', 'Matt', 'solido', '#F1EFEA'),
    p('a-beige', 'Beige', 'Arauco', 'Matt', 'solido', '#D3C8B8', 'Cozinha monocromática'),
    p('a-frape', 'Frapê', 'Arauco', 'Matt', 'solido', '#CBC4B8', 'Quarto do Miguel'),
    p('a-cafelatte', 'Cafelatte', 'Arauco', 'Matt', 'solido', '#A68E77', 'Quarto do Miguel'),
    p('a-cacao', 'Cacao', 'Arauco', 'Matt', 'solido', '#5A4135'),
    p('a-cinza-puro', 'Cinza Puro', 'Arauco', 'Matt', 'solido', '#A7A7A3'),
    p('a-beton', 'Beton', 'Arauco', 'Matt', 'solido', '#8F8C86'),
    p('a-salvia', 'Sálvia', 'Arauco', 'Matt', 'solido', '#8A957D'),
    p('a-verde-jade', 'Verde Jade', 'Arauco', 'Matt', 'solido', '#5C7366'),
    p('a-azul-sereno', 'Azul Sereno', 'Arauco', 'Matt', 'solido', '#8094A3'),
    p('a-oceano', 'Oceano', 'Arauco', 'Matt', 'solido', '#2F4B5D'),
    p('a-lavanda', 'Lavanda', 'Arauco', 'Matt', 'solido', '#A9A1B4'),
    p('a-sal-rosa', 'Sal Rosa', 'Arauco', 'Matt', 'solido', '#D8BBB0'),
    p('a-damasco', 'Damasco', 'Arauco', 'Matt', 'solido', '#D09B7C'),

    /* ---------- Arauco · Madeiras ---------- */
    p('a-carvalho-americano', 'Carvalho Americano', 'Arauco', 'Trend', 'madeira', '#C7A47C'),
    p('a-carvalho-mel', 'Carvalho Mel', 'Arauco', 'Bold', 'madeira', '#C39561'),
    p('a-areal', 'Areal', 'Arauco', 'Bold', 'madeira', '#D3BD9C'),
    p('a-teka-artico', 'Teka Ártico', 'Arauco', 'Nature', 'madeira', '#BBA88F'),
    p('a-amendoeira', 'Amendoeira', 'Arauco', 'Bold', 'madeira', '#B58E68'),
    p('a-noce-naturale', 'Noce Naturale', 'Arauco', 'Nature', 'madeira', '#8C694C'),
    p('a-nogueira-pecan', 'Nogueira Pecan', 'Arauco', 'Trend', 'madeira', '#8A6244'),
    p('a-nogueira-persa', 'Nogueira Persa', 'Arauco', 'Trend', 'madeira', '#6C4A36'),
    p('a-castanho', 'Castanho', 'Arauco', 'Poro', 'madeira', '#6A4A36'),
    p('a-tabaco', 'Tabaco', 'Arauco', 'Poro', 'madeira', '#5B4130'),
    p('a-ameixa-negra', 'Ameixa Negra', 'Arauco', 'Nature', 'madeira', '#463831'),

    /* ---------- Arauco · Madeiras Brasileiras ---------- */
    p('a-cumaru', 'Cumaru', 'Arauco', 'Trend', 'brasileira', '#AD7F55', 'Closet ele e ela'),
    p('a-louro-freijo', 'Louro Freijó', 'Arauco', 'Trend', 'brasileira', '#B9986F'),
    p('a-jequitiba', 'Jequitibá', 'Arauco', 'Trend', 'brasileira', '#C79F79'),
    p('a-tauari', 'Tauari Clássico', 'Arauco', 'Trend', 'brasileira', '#D0B48F'),
    p('a-ipe-real', 'Ipê Real', 'Arauco', 'Trend', 'brasileira', '#7B5337'),
    p('a-jatoba', 'Jatobá Brasileiro', 'Arauco', 'Trend', 'brasileira', '#98593B'),
    p('a-nova-imbuia', 'Nova Imbuia', 'Arauco', 'Poro', 'brasileira', '#694A36'),
    p('a-pau-ferro', 'Pau-Ferro', 'Arauco', 'Trend', 'brasileira', '#5D3F30'),

    /* ---------- Arauco · Texturas (tecidos, pedras, chess, TX) ---------- */
    p('a-cinza-cristal', 'Cinza Cristal', 'Arauco', 'TX', 'textura', '#C8C8C4'),
    p('a-kashmir', 'Kashmir', 'Arauco', 'Chess', 'textura', '#BBB0A2'),
    p('a-canela', 'Canela', 'Arauco', 'Chess', 'textura', '#9A6A4E'),
    p('a-grafito', 'Grafito', 'Arauco', 'Chess', 'textura', '#4B4A48'),
    p('a-ebano', 'Ébano', 'Arauco', 'TX', 'textura', '#2B2826'),
    p('a-linho', 'Linho', 'Arauco', 'Couro', 'textura', '#CEC5B5'),
    p('a-lino-piombo', 'Lino Piombo', 'Arauco', 'Chess', 'textura', '#6E6B67'),
    p('a-concreto', 'Concreto Decor', 'Arauco', 'Matt', 'textura', '#9D9993'),

    /* ---------- Duratex · Design ---------- */
    p('d-carvalho-malva', 'Carvalho Malva', 'Duratex', 'Design', 'madeira', '#C4A27C', 'Cozinha Carvalho Malva'),
    p('d-carvalho-avela', 'Carvalho Avelã', 'Duratex', 'Design', 'madeira', '#B48E68'),
    p('d-carvalho-munique', 'Carvalho Munique', 'Duratex', 'Design', 'madeira', '#C8A984'),
    p('d-carvalho-hanover', 'Carvalho Hanover', 'Duratex', 'Design', 'madeira', '#A8825C'),
    p('d-nogueira-caiena', 'Nogueira Caiena', 'Duratex', 'Design', 'madeira', '#6E4C37'),
    p('d-trancoso', 'Trancoso', 'Duratex', 'Design', 'madeira', '#BFA383'),
    p('d-ibiza', 'Ibiza', 'Duratex', 'Design', 'madeira', '#D7C6AD'),

    /* ---------- Duratex · Essencial Wood ---------- */
    p('d-carvalho-eterno', 'Carvalho Eterno', 'Duratex', 'Essencial Wood', 'madeira', '#B69A78'),
    p('d-alamo', 'Álamo', 'Duratex', 'Essencial Wood', 'madeira', '#D7C9B3'),
    p('d-rovere-marsala', 'Rovere Marsala', 'Duratex', 'Essencial Wood', 'madeira', '#7A4C3C'),
    p('d-freijo-puro', 'Freijó Puro', 'Duratex', 'Essencial Wood', 'brasileira', '#B99A73'),
    p('d-cumaru-raiz', 'Cumaru Raiz', 'Duratex', 'Essencial Wood', 'brasileira', '#A47650'),
    p('d-jequitiba-rosa', 'Jequitibá Rosa', 'Duratex', 'Essencial Wood', 'brasileira', '#C3926F'),
    p('d-pau-ferro', 'Pau Ferro Natural', 'Duratex', 'Essencial Wood', 'brasileira', '#5E4234'),

    /* ---------- Duratex · Cristallo (alto brilho) ---------- */
    p('d-branco-diamante', 'Branco Diamante', 'Duratex', 'Cristallo', 'brilho', '#F6F6F3'),
    p('d-cinza-sagrado', 'Cinza Sagrado', 'Duratex', 'Cristallo', 'brilho', '#8D9093'),
    p('d-gianduia-cristallo', 'Gianduia', 'Duratex', 'Cristallo', 'brilho', '#5C4A3F'),
    p('d-noturno', 'Noturno', 'Duratex', 'Cristallo', 'brilho', '#1F2631'),
    p('d-ultramarino', 'Ultramarino', 'Duratex', 'Cristallo', 'brilho', '#1F3A6B'),
    p('d-preto', 'Preto', 'Duratex', 'Cristallo', 'brilho', '#151515'),

    /* ---------- Duratex · Trama ---------- */
    p('d-gianduia-trama', 'Gianduia', 'Duratex', 'Trama', 'textura', '#5C4A3F', 'Guarda-roupa com porta de espelho')
  ];

  // Família → como o configurador desenha (textura de madeira, laca lisa, trama, brilho)
  window.MadeCatalogoMDF.tipoDesenho = function (familia) {
    return { solido: 'laca', madeira: 'madeira', brasileira: 'madeira', brilho: 'brilho', textura: 'trama' }[familia] || 'laca';
  };
})();
