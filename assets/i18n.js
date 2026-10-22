/* ============================================================
   Madê Marcenaria — idiomas (pt · en · es)

   O português é o texto do próprio HTML. Este arquivo guarda o
   dicionário pt → [en, es] e troca, na página, todo texto (e todo
   aria-label, alt, placeholder, title, <title> e meta description)
   que tenha tradução. Os módulos (assistente, configurador, moodboard)
   usam a mesma função: window.MadeI18n.t('texto em pt', {variáveis}).

   Escolha do idioma, em ordem: ?lang=en|es|pt na URL → o que a pessoa
   escolheu antes (localStorage) → idioma do navegador (turista argentino
   cai direto no espanhol) → português.

   A mensagem que chega no WhatsApp da dona continua em PORTUGUÊS, com a
   linha "Idioma do cliente", para ela saber em que língua responder.

   Texto novo no site = entrada nova aqui. Sem entrada, o texto aparece
   em português (nunca some, nunca quebra).
   ============================================================ */
(function () {
  'use strict';

  var D = {
    /* ---------- Cabeça e topo ---------- */
    'Madê Marcenaria — marcenaria sob medida em Garopaba e Imbituba': ['Madê Marcenaria — custom woodwork in Garopaba and Imbituba, Brazil', 'Madê Marcenaria — carpintería a medida en Garopaba e Imbituba, Brasil'],
    'Marcenaria sob medida em Garopaba e Imbituba: cozinhas, quartos, closets e áreas gourmet planejados, projetos para casas, apartamentos, comércios e pousadas, e peças em madeira maciça. Faça seu pré-orçamento.': ['Custom woodwork in Garopaba and Imbituba, Brazil: kitchens, bedrooms, walk-in closets and outdoor kitchens for homes, apartments, shops and guesthouses, plus solid wood pieces. Get a quick estimate.', 'Carpintería a medida en Garopaba e Imbituba, Brasil: cocinas, dormitorios, vestidores y quinchos para casas, departamentos, comercios y posadas, y piezas en madera maciza. Pedí tu presupuesto.'],
    'Madê Marcenaria — início': ['Madê Marcenaria — home', 'Madê Marcenaria — inicio'],
    'Abrir menu': ['Open menu', 'Abrir menú'],
    'Fechar menu': ['Close menu', 'Cerrar menú'],
    'Seções do site': ['Site sections', 'Secciones del sitio'],
    'Projetos': ['Projects', 'Proyectos'],
    'Monte o seu': ['Design yours', 'Armá el tuyo'],
    'Para quem': ['Who we serve', 'Para quién'],
    'Como funciona': ['How it works', 'Cómo funciona'],
    'A Madê': ['About Madê', 'Sobre Madê'],
    'Pré-orçamento': ['Estimate', 'Presupuesto'],
    'Idioma': ['Language', 'Idioma'],
    'Mudar para tema escuro': ['Switch to dark theme', 'Cambiar a tema oscuro'],
    'Mudar para tema claro': ['Switch to light theme', 'Cambiar a tema claro'],

    /* ---------- Herói ---------- */
    'Marcenaria sob medida': ['Custom woodwork', 'Carpintería a medida'],
    'Projetamos': ['We design', 'Diseñamos'],
    'seu estilo': ['your style', 'tu estilo'],
    'em cada detalhe.': ['in every detail.', 'en cada detalle.'],
    'Fazer pré-orçamento': ['Get an estimate', 'Pedir presupuesto'],
    'Ver projetos': ['See projects', 'Ver proyectos'],
    'Role': ['Scroll', 'Deslizá'],
    'Casas · Apartamentos · Comércios · Pousadas': ['Homes · Apartments · Shops · Guesthouses', 'Casas · Departamentos · Comercios · Posadas'],

    /* ---------- Faixa e manifesto ---------- */
    'Materiais com que a Madê trabalha': ['Materials Madê works with', 'Materiales con los que trabaja Madê'],
    'Madê Marcenaria — ambientes planejados em Garopaba e Imbituba': ['Madê Marcenaria — custom interiors in Garopaba and Imbituba, Brazil', 'Madê Marcenaria — ambientes a medida en Garopaba e Imbituba, Brasil'],
    'Ambientes e móveis planejados em MDF premium Arauco, Duratex, Berneck e Guararapes, com ferragens Häfele e FGVTN, em Garopaba e Imbituba: cozinhas, quartos, closets e áreas gourmet para casas, apartamentos, comércios e pousadas. Faça seu pré-orçamento.': ['Premium MDF built-in interiors by Arauco, Duratex, Berneck and Guararapes, with Häfele and FGVTN hardware, in Garopaba and Imbituba, Brazil: kitchens, bedrooms, walk-in closets and outdoor kitchens for homes, apartments, shops and guesthouses. Get a quick estimate.', 'Ambientes y muebles a medida en MDF premium Arauco, Duratex, Berneck y Guararapes, con herrajes Häfele y FGVTN, en Garopaba e Imbituba, Brasil: cocinas, dormitorios, vestidores y quinchos para casas, departamentos, comercios y posadas. Pedí tu presupuesto.'],
    'Móveis planejados em MDF premium, da cozinha à casa inteira, para residências, comércios e pousadas.': ['Premium MDF custom furniture, from the kitchen to the whole house, for homes, shops and guesthouses.', 'Muebles a medida en MDF premium, de la cocina a la casa entera, para casas, comercios y posadas.'],
    'Cada projeto começa no 3D e termina na sua rotina.': ['Every project starts in 3D and ends in your daily life.', 'Cada proyecto empieza en 3D y termina en tu rutina.'],
    'Projeto, precisão': ['Design, precision', 'Proyecto, precisión'],
    'Peças especiais': ['Special pieces', 'Piezas especiales'],
    'MDF Arauco, Duratex, Berneck e Guararapes; ferragens e metais FGVTN, Häfele, Italy Line e Zen Design': ['Arauco, Duratex, Berneck and Guararapes MDF; FGVTN, Häfele, Italy Line and Zen Design hardware', 'MDF Arauco, Duratex, Berneck y Guararapes; herrajes FGVTN, Häfele, Italy Line y Zen Design'],
    'Móveis e ambientes planejados em MDF premium. Projetamos seu estilo em cada detalhe.': ['Premium MDF custom furniture and interiors. We design your style in every detail.', 'Muebles y ambientes a medida en MDF premium. Diseñamos tu estilo en cada detalle.'],
    'Cozinhas, quartos, closets e áreas gourmet': ['Kitchens, bedrooms, closets and outdoor kitchens', 'Cocinas, dormitorios, vestidores y quinchos'],
    'O que a Madê faz': ['What Madê does', 'Lo que hace Madê'],
    'Ambientes planejados': ['Planned spaces', 'Ambientes a medida'],
    'Marcenaria inteligente': ['Smart cabinetry', 'Carpintería inteligente'],
    'Projeto em 3D': ['3D design', 'Proyecto en 3D'],
    'Acabamento premium': ['Premium finish', 'Acabado premium'],
    'Design sob medida': ['Made-to-measure design', 'Diseño a medida'],
    'Madeira grápia': ['Grápia wood', 'Madera grápia'],
    'Madeira de demolição': ['Reclaimed wood', 'Madera de demolición'],
    'Palha natural': ['Natural cane', 'Esterilla natural'],
    'Verde-sálvia': ['Sage green', 'Verde salvia'],
    'Pedra São Gabriel': ['São Gabriel stone', 'Piedra São Gabriel'],
    'A ideia da Madê': ['The idea behind Madê', 'La idea de Madê'],
    'Para a Madê, um móvel bem feito não disputa atenção:': ['At Madê, well-made furniture doesn’t compete for attention:', 'Para Madê, un mueble bien hecho no compite por la atención:'],
    'ele acompanha a casa.': ['it lives with the house.', 'acompaña la casa.'],
    'Cada projeto começa na madeira e termina na sua rotina.': ['Every project starts with the wood and ends in your daily life.', 'Cada proyecto empieza en la madera y termina en tu rutina.'],

    /* ---------- Projetos ---------- */
    'Madeira, luz': ['Wood, light', 'Madera, luz'],
    'e detalhe.': ['and detail.', 'y detalle.'],
    'Cada ambiente é desenhado para a casa onde vai morar. Projetos que saíram da oficina da Madê, com as palavras de quem fez.': ['Every room is designed for the home it will live in. Projects from the Madê workshop, described by the people who made them.', 'Cada ambiente se diseña para la casa donde va a vivir. Proyectos que salieron del taller de Madê, contados por quien los hizo.'],
    'Filtrar por ambiente': ['Filter by room', 'Filtrar por ambiente'],
    'Todos': ['All', 'Todos'],
    'Cozinhas': ['Kitchens', 'Cocinas'],
    'Quartos e closets': ['Bedrooms & closets', 'Dormitorios y vestidores'],
    'Gourmet e salas': ['Outdoor & living', 'Quinchos y livings'],
    'Escritórios': ['Home offices', 'Escritorios'],
    'Peças em madeira': ['Wood pieces', 'Piezas en madera'],
    'Cozinha': ['Kitchen', 'Cocina'],
    'Área gourmet': ['Outdoor kitchen', 'Quincho'],
    'Sala': ['Living room', 'Living'],
    'Closet': ['Walk-in closet', 'Vestidor'],
    'Quarto': ['Bedroom', 'Dormitorio'],
    'Escritório': ['Home office', 'Escritorio'],
    'Peça': ['Piece', 'Pieza'],
    'Branco, cinza e aço escovado': ['White, gray and brushed steel', 'Blanco, gris y acero cepillado'],
    'Carvalho Malva': ['Carvalho Malva oak', 'Roble Carvalho Malva'],
    'Com pedra São Gabriel escovada': ['With brushed São Gabriel stone', 'Con piedra São Gabriel cepillada'],
    'Torre de eletros': ['Appliance tower', 'Torre de electrodomésticos'],
    'Painéis em tom cinza': ['Gray wall panels', 'Paneles en tono gris'],
    'Portas ripadas em grápia': ['Slatted grápia doors', 'Puertas de listones en grápia'],
    'Pedra e madeira na churrasqueira': ['Stone and wood at the grill', 'Piedra y madera en la parrilla'],
    'Embaixo da escada': ['Under the stairs', 'Bajo la escalera'],
    'Armário, adega e bar': ['Storage, wine rack and bar', 'Mueble, cava y bar'],
    'Ele e ela': ['His and hers', 'Él y ella'],
    'Espaços iguais em 2,80 m': ['Equal space across 2.80 m', 'Espacios iguales en 2,80 m'],
    'Guarda-roupa com cabeceira': ['Wardrobe with headboard', 'Placard con respaldo'],
    'Tons neutros para crescer junto': ['Neutral tones that grow with the child', 'Tonos neutros que crecen con el chico'],
    'Para organizar o dia': ['Made for focused days', 'Para ordenar el día'],
    'Design, conforto e função': ['Design, comfort and function', 'Diseño, confort y función'],
    'Madeira e palha': ['Wood and cane', 'Madera y esterilla'],
    'Beleza que respira': ['Beauty that breathes', 'Belleza que respira'],
    'Borda orgânica': ['Live edge', 'Borde orgánico'],
    'Curvas da própria madeira': ['The wood’s own curves', 'Las curvas de la propia madera'],
    'Banco ripado': ['Slatted bench', 'Banco de listones'],
    'Guarapari, acabamento Imbuia': ['Guarapari wood, Imbuia finish', 'Madera guarapari, terminación imbuia'],
    'Ranhuras que contam história': ['Grooves that tell a story', 'Marcas que cuentan una historia'],
    'Cozinha planejada em verde-sálvia com bancada branca e janela': ['Sage green built-in kitchen with white countertop and window', 'Cocina a medida verde salvia con mesada blanca y ventana'],
    'Cozinha em Carvalho Malva com pedra preta escovada': ['Carvalho Malva oak kitchen with brushed black stone', 'Cocina en roble Carvalho Malva con piedra negra cepillada'],
    'Torre de eletros em verde-sálvia com painéis cinza': ['Sage green appliance tower with gray panels', 'Torre de electrodomésticos verde salvia con paneles grises'],
    'Churrasqueira com portas ripadas em madeira grápia e parede de pedra': ['Barbecue area with slatted grápia doors and a stone wall', 'Parrilla con puertas de listones en grápia y pared de piedra'],
    'Armário, adega e cristaleira embaixo da escada': ['Cabinet, wine rack and glass display under the stairs', 'Mueble, cava y cristalero bajo la escalera'],
    'Closet planejado em MDF Cumaru': ['Built-in walk-in closet in Cumaru MDF', 'Vestidor a medida en MDF Cumaru'],
    'Quarto infantil com guarda-roupa e cabeceira integrados': ['Kid’s bedroom with integrated wardrobe and headboard', 'Dormitorio infantil con placard y respaldo integrados'],
    'Escritório planejado com bancada dupla e painel ripado': ['Built-in home office with double desk and slatted panel', 'Escritorio a medida con escritorio doble y panel de listones'],
    'Portas em madeira com palha natural e puxadores dourados': ['Wood doors with natural cane and gold handles', 'Puertas de madera con esterilla natural y tiradores dorados'],
    'Bancada em madeira maciça com borda orgânica e cooktop': ['Solid wood live-edge countertop with cooktop', 'Mesada de madera maciza con borde orgánico y anafe'],
    'Banco ripado em madeira maciça': ['Slatted solid wood bench', 'Banco de listones en madera maciza'],
    'Mesa em madeira de demolição': ['Reclaimed wood table', 'Mesa de madera de demolición'],
    'Toque no coração das fotos que você gostar: elas vão junto no seu pré-orçamento.': ['Tap the heart on the photos you like: they’ll be sent along with your estimate request.', 'Tocá el corazón de las fotos que te gusten: van junto con tu pedido de presupuesto.'],
    'Quero um projeto assim': ['I want a project like this', 'Quiero un proyecto así'],
    'Mais projetos no Instagram': ['More projects on Instagram', 'Más proyectos en Instagram'],
    'Foto do projeto': ['Project photo', 'Foto del proyecto'],
    'Fechar': ['Close', 'Cerrar'],
    'Projeto anterior': ['Previous project', 'Proyecto anterior'],
    'Próximo projeto': ['Next project', 'Proyecto siguiente'],

    /* ---------- Monte seu ambiente ---------- */
    'Monte seu ambiente': ['Design your space', 'Armá tu ambiente'],
    'Escolha as cores.': ['Pick the colors.', 'Elegí los colores.'],
    'Veja na hora.': ['See it instantly.', 'Miralo al instante.'],
    'Combine os acabamentos que a Madê usa nos projetos e veja o ambiente mudar. Gostou? Mande a combinação junto com o pré-orçamento.': ['Mix the finishes Madê uses in real projects and watch the room change. Like it? Send the combination with your estimate request.', 'Combiná las terminaciones que Madê usa en sus proyectos y mirá cómo cambia el ambiente. ¿Te gustó? Mandá la combinación con tu pedido de presupuesto.'],
    'Ilustração para inspirar: as cores são aproximadas. A Madê leva as amostras reais e apresenta o projeto em 3D.': ['An illustration for inspiration: colors are approximate. Madê brings real samples and presents the project in 3D.', 'Ilustración para inspirarte: los colores son aproximados. Madê lleva las muestras reales y presenta el proyecto en 3D.'],
    'Paletas de projetos da Madê': ['Palettes from Madê projects', 'Paletas de proyectos de Madê'],
    'Quero este ambiente': ['I want this room', 'Quiero este ambiente'],
    'Compartilhar combinação': ['Share this combination', 'Compartir combinación'],
    'Ambiente': ['Room', 'Ambiente'],
    'Quarto e closet': ['Bedroom & closet', 'Dormitorio y vestidor'],
    'Banheiro': ['Bathroom', 'Baño'],
    'Portas e torre': ['Doors and tower', 'Puertas y torre'],
    'Aéreos e prateleiras': ['Wall cabinets and shelves', 'Alacenas y estantes'],
    'Bancada': ['Countertop', 'Mesada'],
    'Portas do armário': ['Wardrobe doors', 'Puertas del placard'],
    'Painel da cabeceira': ['Headboard panel', 'Panel del respaldo'],
    'Tampo dos criados': ['Nightstand tops', 'Tapa de las mesas de luz'],
    'Portas ripadas': ['Slatted doors', 'Puertas de listones'],
    'Prateleiras': ['Shelves', 'Estantes'],
    'Gabinete': ['Vanity', 'Vanitory'],
    'Nicho': ['Niche', 'Nicho'],
    'Puxador': ['Handles', 'Tiradores'],
    'Escovado': ['Brushed steel', 'Acero cepillado'],
    'Dourado': ['Gold', 'Dorado'],
    'Preto': ['Black', 'Negro'],
    'Cava, sem puxador': ['Recessed, no handle', 'Uñero, sin tirador'],
    'Fita de LED': ['LED strip', 'Tira de LED'],
    'Com fita de LED': ['With LED strip', 'Con tira de LED'],
    'Sem LED': ['No LED', 'Sin LED'],
    'Branco': ['White', 'Blanco'],
    'Cinza': ['Gray', 'Gris'],
    'Madeira maciça': ['Solid wood', 'Madera maciza'],
    'Monocromática': ['Monochrome', 'Monocromática'],
    'Closet em Cumaru': ['Cumaru walk-in closet', 'Vestidor en Cumaru'],
    'Quarto Frapê e Cafelatte': ['Frapê & Cafelatte bedroom', 'Dormitorio Frapê y Cafelatte'],
    'Grápia natural': ['Natural grápia', 'Grápia natural'],
    'Cozinha com aço escovado': ['Kitchen with brushed steel', 'Cocina con acero cepillado'],
    'Com pedra São Gabriel': ['With São Gabriel stone', 'Con piedra São Gabriel'],
    'Beige Matt, sem puxador': ['Beige Matt, no handles', 'Beige Matt, sin tiradores'],
    'Madeira de ponta a ponta': ['Wood from end to end', 'Madera de punta a punta'],
    'Tons neutros que crescem junto': ['Neutral tones that grow with you', 'Tonos neutros que crecen con vos'],
    'Ripado na churrasqueira': ['Slats at the grill', 'Listones en la parrilla'],
    'Link copiado. É só colar no WhatsApp.': ['Link copied. Just paste it on WhatsApp.', 'Link copiado. Pegalo en WhatsApp.'],
    'Copie o link:': ['Copy the link:', 'Copiá el link:'],
    'Minha combinação na Madê': ['My combination at Madê', 'Mi combinación en Madê'],
    'Ilustração: {d}': ['Illustration: {d}', 'Ilustración: {d}'],
    '{a}: {m}': ['{a}: {m}', '{a}: {m}'],
    'Puxador: {m}': ['Handles: {m}', 'Tiradores: {m}'],

    /* ---------- Para quem ---------- */
    'Para quem a Madê projeta': ['Who Madê designs for', 'Para quién diseña Madê'],
    'Da casa de praia': ['From the beach house', 'De la casa de playa'],
    'à pousada inteira.': ['to the whole guesthouse.', 'a la posada entera.'],
    'Residencial': ['Residential', 'Residencial'],
    'Casas': ['Houses', 'Casas'],
    'Apartamentos': ['Apartments', 'Departamentos'],
    'Casas de praia': ['Beach houses', 'Casas de playa'],
    'Cozinha, quartos, closet, área gourmet ou a casa inteira, desenhados para a rotina de quem mora.': ['Kitchen, bedrooms, closet, outdoor kitchen or the whole house, designed around the way you live.', 'Cocina, dormitorios, vestidor, quincho o la casa entera, diseñados para la rutina de quien la vive.'],
    'Pré-orçamento residencial': ['Residential estimate', 'Presupuesto residencial'],
    'Comercial': ['Commercial', 'Comercial'],
    'Lojas': ['Shops', 'Locales'],
    'Restaurantes e cafés': ['Restaurants & cafés', 'Restaurantes y cafés'],
    'Clínicas': ['Clinics', 'Clínicas'],
    'Balcões, recepções, expositores e estações de trabalho que trabalham pela sua marca.': ['Counters, reception desks, displays and workstations that work for your brand.', 'Mostradores, recepciones, exhibidores y puestos de trabajo que trabajan para tu marca.'],
    'Pré-orçamento comercial': ['Commercial estimate', 'Presupuesto comercial'],
    'Hospedagem': ['Hospitality', 'Hospedaje'],
    'Pousadas': ['Guesthouses', 'Posadas'],
    'Hotéis': ['Hotels', 'Hoteles'],
    'Aluguel por temporada': ['Vacation rentals', 'Alquiler temporario'],
    'Quartos, recepção e áreas comuns com a resistência que o litoral pede e a identidade que o hóspede lembra.': ['Rooms, reception and common areas with the durability the coast demands and an identity guests remember.', 'Habitaciones, recepción y áreas comunes con la resistencia que pide la costa y la identidad que el huésped recuerda.'],
    'Pré-orçamento hospedagem': ['Hospitality estimate', 'Presupuesto hospedaje'],

    /* ---------- Processo ---------- */
    'Comparação entre o projeto em 3D e a cozinha pronta': ['The 3D design next to the finished kitchen', 'El proyecto en 3D junto a la cocina terminada'],
    'Do projeto': ['From design', 'Del proyecto'],
    'à realidade.': ['to reality.', 'a la realidad.'],
    'Etapas do projeto': ['Project steps', 'Etapas del proyecto'],
    'Pré-orçamento e conversa': ['Estimate and conversation', 'Presupuesto y charla'],
    'Você conta o que precisa aqui no site ou no WhatsApp. A Madê entende o espaço, a rotina e o que não pode faltar.': ['Tell us what you need here or on WhatsApp. Madê gets to know the space, your routine and the must-haves.', 'Contás lo que necesitás acá o por WhatsApp. Madê entiende el espacio, la rutina y lo que no puede faltar.'],
    'Medição e projeto em 3D': ['Measuring and 3D design', 'Medición y proyecto en 3D'],
    'Com as medidas do espaço, cada ambiente é desenhado sob medida e apresentado em 3D: proporções, cores e materiais ajustados com você antes de qualquer corte.': ['With the space measured, every room is custom designed and shown in 3D: proportions, colors and materials agreed with you before any cut.', 'Con las medidas del espacio, cada ambiente se diseña a medida y se presenta en 3D: proporciones, colores y materiales ajustados con vos antes de cualquier corte.'],
    'Produção e montagem': ['Making and installation', 'Fabricación y montaje'],
    'A peça nasce na oficina da Madê e chega pronta para a montagem, com o cuidado de quem sabe que você vai ver o resultado todos os dias.': ['Each piece is made in the Madê workshop and arrives ready to install, with the care of someone who knows you’ll see it every day.', 'La pieza nace en el taller de Madê y llega lista para el montaje, con el cuidado de quien sabe que vas a ver el resultado todos los días.'],

    /* ---------- A Madê ---------- */
    'Armário sob medida embaixo da escada, com adega e cristaleira': ['Custom cabinet under the stairs, with wine rack and glass display', 'Mueble a medida bajo la escalera, con cava y cristalero'],
    'Marcenaria': ['Woodwork', 'Carpintería'],
    '“Mais do que móveis, histórias.”': ['“More than furniture: stories.”', '“Más que muebles, historias.”'],
    'Projeto em 3D, sob medida para o seu espaço': ['3D design, made to measure for your space', 'Proyecto en 3D, a medida de tu espacio'],
    'Planejados em MDF e peças em madeira maciça, inclusive de demolição': ['MDF built-ins and solid wood pieces, including reclaimed wood', 'Muebles en MDF y piezas en madera maciza, incluso de demolición'],
    'No litoral, rodapés e molduras em madeira maciça, para durar mais': ['On the coast, solid wood baseboards and trims, so it lasts longer', 'En la costa, zócalos y molduras en madera maciza, para que dure más'],
    'Atendimento em Garopaba, Imbituba e região': ['Serving Garopaba, Imbituba and the surrounding area', 'Atendemos Garopaba, Imbituba y alrededores'],
    'Quem já tem um projeto da Madê': ['People who already have a Madê project', 'Quienes ya tienen un proyecto de Madê'],
    'Em casa, todo dia.': ['At home, every day.', 'En casa, todos los días.'],

    /* ---------- Contato e rodapé ---------- */
    'Contato': ['Contact', 'Contacto'],
    'Vamos tirar o seu projeto': ['Let’s take your project', 'Saquemos tu proyecto'],
    'do papel?': ['off the page?', 'del papel'],
    'Faça o pré-orçamento em dois minutos ou chame direto no WhatsApp. A Madê responde com o próximo passo: uma conversa e a medição do espaço.': ['Get an estimate in two minutes or message us on WhatsApp. Madê replies with the next step: a conversation and measuring the space.', 'Pedí el presupuesto en dos minutos o escribí directo por WhatsApp. Madê responde con el próximo paso: una charla y la medición del espacio.'],
    'Falar no WhatsApp': ['Chat on WhatsApp', 'Escribir por WhatsApp'],
    'Atendimento': ['Service area', 'Atención'],
    'Garopaba, Imbituba e região · SC': ['Garopaba, Imbituba and area · Santa Catarina, Brazil', 'Garopaba, Imbituba y alrededores · Santa Catarina, Brasil'],
    'Ambientes planejados e peças em madeira maciça. Projetamos seu estilo em cada detalhe.': ['Built-ins and solid wood pieces. We design your style in every detail.', 'Muebles a medida y piezas en madera maciza. Diseñamos tu estilo en cada detalle.'],
    'O site': ['The site', 'El sitio'],
    'Falar com a Madê': ['Talk to Madê', 'Hablar con Madê'],
    'Todos os links': ['All links', 'Todos los links'],
    'Desenvolvido por Extrema Consultoria': ['Developed by Extrema Consultoria', 'Desarrollado por Extrema Consultoria'],
    'Abrir o assistente de pré-orçamento': ['Open the estimate assistant', 'Abrir el asistente de presupuesto'],

    /* ---------- Link da bio ---------- */
    'Madê Marcenaria — todos os links': ['Madê Marcenaria — all links', 'Madê Marcenaria — todos los links'],
    'Fale no WhatsApp, veja os projetos e conheça a Madê Marcenaria: ambientes planejados em Garopaba, Imbituba e região.': ['Chat on WhatsApp, see the projects and meet Madê Marcenaria: built-in furniture in Garopaba, Imbituba and around.', 'Escribí por WhatsApp, mirá los proyectos y conocé Madê Marcenaria: muebles a medida en Garopaba, Imbituba y alrededores.'],
    'Ambientes planejados. Projetamos seu estilo em cada detalhe. Garopaba, Imbituba e região.': ['Built-in furniture. We design your style in every detail. Garopaba, Imbituba and around.', 'Muebles a medida. Diseñamos tu estilo en cada detalle. Garopaba, Imbituba y alrededores.'],
    'Links da Madê': ['Madê links', 'Links de Madê'],
    'Conversar sobre o seu projeto': ['Talk about your project', 'Hablar de tu proyecto'],
    'Pré-orçamento em 2 minutos': ['Estimate in 2 minutes', 'Presupuesto en 2 minutos'],
    'Casa, apartamento, comércio ou pousada': ['House, apartment, shop or guesthouse', 'Casa, departamento, comercio o posada'],
    'Cozinhas, quartos, áreas gourmet e peças em madeira': ['Kitchens, bedrooms, outdoor kitchens and wood pieces', 'Cocinas, dormitorios, quinchos y piezas en madera'],
    'Conversa, projeto, produção e montagem': ['Conversation, design, making and installation', 'Charla, proyecto, fabricación y montaje'],
    'Site da Madê': ['Madê website', 'Sitio de Madê'],

    /* ---------- 404 ---------- */
    'Página não encontrada — Madê Marcenaria': ['Page not found — Madê Marcenaria', 'Página no encontrada — Madê Marcenaria'],
    'Essa página não existe.': ['This page doesn’t exist.', 'Esta página no existe.'],
    'O endereço pode ter mudado. O site da Madê está aqui embaixo, e o WhatsApp também.': ['The address may have changed. The Madê site is right below, and so is WhatsApp.', 'La dirección puede haber cambiado. El sitio de Madê está acá abajo, y WhatsApp también.'],
    'Voltar ao site': ['Back to the site', 'Volver al sitio'],

    /* ---------- Moodboard ---------- */
    '1 no seu moodboard · enviar': ['1 in your moodboard · send', '1 en tu moodboard · enviar'],
    '{n} no seu moodboard · enviar': ['{n} in your moodboard · send', '{n} en tu moodboard · enviar'],
    'Tirar do moodboard: {t}': ['Remove from moodboard: {t}', 'Quitar del moodboard: {t}'],
    'Curtir e guardar no moodboard: {t}': ['Like and save to moodboard: {t}', 'Me gusta y guardar en el moodboard: {t}'],

    /* ---------- Assistente: moldura ---------- */
    'Madê Marcenaria': ['Madê Marcenaria', 'Madê Marcenaria'],
    'Nada fica salvo no site. Suas respostas vão só na mensagem que você enviar.': ['Nothing is stored on the site. Your answers only go in the message you send.', 'Nada queda guardado en el sitio. Tus respuestas van solo en el mensaje que envíes.'],
    'Sua resposta': ['Your answer', 'Tu respuesta'],
    'Enviar resposta': ['Send answer', 'Enviar respuesta'],
    'Fechar o assistente': ['Close the assistant', 'Cerrar el asistente'],
    'Voltar uma pergunta': ['Go back one question', 'Volver una pregunta'],
    'Ou escreva com suas palavras': ['Or type in your own words', 'O escribilo con tus palabras'],
    'Escreva aqui': ['Type here', 'Escribí acá'],
    'Dica · ': ['Tip · ', 'Tip · '],
    'Continuar →': ['Continue →', 'Continuar →'],
    'Pular': ['Skip', 'Saltar'],
    'Escolha pelo menos uma opção, ou "Ainda não sei".': ['Pick at least one option, or "Not sure yet".', 'Elegí al menos una opción, o "Todavía no sé".'],
    'Não consegui entender. Pode escolher uma das opções abaixo?': ['I didn’t quite get that. Could you pick one of the options below?', 'No llegué a entender. ¿Podés elegir una de las opciones de abajo?'],
    'Qual cidade?': ['Which city?', '¿Qué ciudad?'],
    'Nome da cidade': ['City name', 'Nombre de la ciudad'],
    'Voltando para: {r}': ['Going back to: {r}', 'Volviendo a: {r}'],
    'Corrigir: {r}': ['Edit: {r}', 'Corregir: {r}'],
    'Pronto! Confira o resumo. Se algo estiver errado, toque em "corrigir".': ['Done! Check the summary. If something’s off, tap "edit".', '¡Listo! Revisá el resumen. Si algo está mal, tocá "corregir".'],
    'Pronto, {nome}! Confira o resumo. Se algo estiver errado, toque em "corrigir".': ['Done, {nome}! Check the summary. If something’s off, tap "edit".', '¡Listo, {nome}! Revisá el resumen. Si algo está mal, tocá "corregir".'],
    'Seu projeto': ['Your project', 'Tu proyecto'],
    'corrigir': ['edit', 'corregir'],
    'remover': ['remove', 'quitar'],
    'Corrigir {r}': ['Edit {r}', 'Corregir {r}'],
    'Remover {r}': ['Remove {r}', 'Quitar {r}'],
    'Enviar pelo WhatsApp': ['Send via WhatsApp', 'Enviar por WhatsApp'],
    'Recomeçar': ['Start over', 'Empezar de nuevo'],
    'Recebi a combinação que você montou: {c}. Ela vai junto no resumo.': ['Got the combination you designed: {c}. It goes along with the summary.', 'Recibí la combinación que armaste: {c}. Va junto con el resumen.'],
    'Olá! Sou o assistente de pré-orçamento da Madê. Vamos organizar o seu projeto {s} em uns 2 minutos.': ['Hi! I’m Madê’s estimate assistant. Let’s organize your {s} project in about 2 minutes.', '¡Hola! Soy el asistente de presupuesto de Madê. Organicemos tu proyecto {s} en unos 2 minutos.'],
    'residencial': ['residential', 'residencial'], 'comercial': ['commercial', 'comercial'], 'hospedagem': ['hospitality', 'de hospedaje'],

    /* ---------- Assistente: perguntas ---------- */
    'Olá! Sou o assistente de pré-orçamento da Madê.\nEm uns 2 minutos eu organizo as informações do seu projeto e você envia tudo pronto no WhatsApp.\n\nComo posso te chamar?': ['Hi! I’m Madê’s estimate assistant.\nIn about 2 minutes I’ll organize your project details and you’ll send everything ready on WhatsApp.\n\nWhat should I call you?', '¡Hola! Soy el asistente de presupuesto de Madê.\nEn unos 2 minutos ordeno la información de tu proyecto y la mandás lista por WhatsApp.\n\n¿Cómo te llamo?'],
    'Seu primeiro nome': ['Your first name', 'Tu nombre'],
    'Prefiro não dizer': ['I’d rather not say', 'Prefiero no decirlo'],
    'Prazer, {nome}!': ['Nice to meet you, {nome}!', '¡Un gusto, {nome}!'],
    'O projeto é para…': ['The project is for…', 'El proyecto es para…'],
    'Que tipo de imóvel?': ['What type of property?', '¿Qué tipo de propiedad?'],
    'Que tipo de negócio?': ['What type of business?', '¿Qué tipo de negocio?'],
    'Que tipo de hospedagem?': ['What type of lodging?', '¿Qué tipo de hospedaje?'],
    'Para hospedagem, conte também se os quartos seguem um padrão: ajuda a Madê a pensar o projeto por unidade.': ['For lodging, also tell us if the rooms follow a standard layout: it helps Madê plan the project per unit.', 'Para hospedaje, contá también si las habitaciones siguen un patrón: ayuda a Madê a pensar el proyecto por unidad.'],
    'Quantos quartos ou unidades entram no projeto?': ['How many rooms or units are in the project?', '¿Cuántas habitaciones o unidades entran en el proyecto?'],
    'Quais ambientes entram? Pode escolher vários.': ['Which rooms are included? You can pick several.', '¿Qué ambientes entran? Podés elegir varios.'],
    'Qual o tamanho aproximado do imóvel?': ['Roughly how big is the property?', '¿Cuál es el tamaño aproximado de la propiedad?'],
    'Em que pé está a obra?': ['Where is the build at?', '¿En qué etapa está la obra?'],
    'Já existe projeto de arquitetura ou de interiores?': ['Is there already an architecture or interior design plan?', '¿Ya hay un proyecto de arquitectura o de interiores?'],
    'A Madê apresenta o projeto em 3D antes de produzir, para você ajustar proporções, cores e materiais.': ['Madê presents the design in 3D before making anything, so you can adjust proportions, colors and materials.', 'Madê presenta el proyecto en 3D antes de fabricar, para que ajustes proporciones, colores y materiales.'],
    'No WhatsApp, mande o projeto (PDF ou imagens) junto com esta mensagem: agiliza muito.': ['On WhatsApp, send the plan (PDF or images) along with this message: it speeds things up a lot.', 'En WhatsApp, mandá el proyecto (PDF o imágenes) junto con este mensaje: agiliza mucho.'],
    'Separe as fotos de referência para mandar no WhatsApp. Prints do Pinterest e do Instagram valem.': ['Get your reference photos ready to send on WhatsApp. Pinterest and Instagram screenshots are great.', 'Prepará las fotos de referencia para mandar por WhatsApp. Capturas de Pinterest e Instagram sirven.'],
    'Algum estilo em mente? (opcional)': ['Any style in mind? (optional)', '¿Algún estilo en mente? (opcional)'],
    'Para quando você precisa?': ['When do you need it?', '¿Para cuándo lo necesitás?'],
    'Tem uma faixa de investimento em mente? Isso ajuda a Madê a sugerir materiais que cabem no seu orçamento.': ['Do you have a budget range in mind? It helps Madê suggest materials that fit. (Values in Brazilian reais.)', '¿Tenés un rango de inversión en mente? Ayuda a Madê a sugerir materiales que entren en tu presupuesto. (Valores en reales.)'],
    'Em que cidade fica o imóvel?': ['Which city is the property in?', '¿En qué ciudad está la propiedad?'],
    'No litoral, a Madê usa rodapés e molduras em madeira maciça, para o móvel resistir melhor à maresia.': ['On the coast, Madê uses solid wood baseboards and trims so the furniture stands up better to the sea air.', 'En la costa, Madê usa zócalos y molduras en madera maciza, para que el mueble resista mejor la brisa marina.'],
    'Medidas, o que incomoda hoje, uma ideia…': ['Measurements, what bothers you today, an idea…', 'Medidas, lo que te molesta hoy, una idea…'],
    'Nada a acrescentar': ['Nothing to add', 'Nada para agregar'],
    'Quer contar mais alguma coisa? Medidas, o que incomoda hoje, uma ideia que você viu por aí…': ['Anything else? Measurements, what bothers you today, an idea you saw somewhere…', '¿Querés contar algo más? Medidas, lo que te molesta hoy, una idea que viste por ahí…'],

    /* ---------- Assistente: rótulos do resumo ---------- */
    'Nome': ['Name', 'Nombre'], 'Tipo de projeto': ['Project type', 'Tipo de proyecto'], 'Imóvel': ['Property', 'Propiedad'], 'Unidades': ['Units', 'Unidades'],
    'Ambientes': ['Rooms', 'Ambientes'], 'Tamanho': ['Size', 'Tamaño'], 'Etapa da obra': ['Build stage', 'Etapa de la obra'], 'Projeto de arquitetura': ['Architecture plan', 'Proyecto de arquitectura'],
    'Estilo': ['Style', 'Estilo'], 'Prazo': ['Timeline', 'Plazo'], 'Investimento previsto': ['Budget range', 'Inversión prevista'], 'Cidade': ['City', 'Ciudad'], 'Observações': ['Notes', 'Observaciones'],
    'Combinação que montei no site': ['Combination I designed on the site', 'Combinación que armé en el sitio'],
    'Referências que curti': ['References I liked', 'Referencias que me gustaron'],

    /* ---------- Assistente: opções ---------- */
    'Casa': ['House', 'Casa'], 'Apartamento': ['Apartment', 'Departamento'], 'Casa de praia / temporada': ['Beach / vacation house', 'Casa de playa / temporada'], 'Outro': ['Other', 'Otro'],
    'Loja': ['Shop', 'Local comercial'], 'Escritório ou consultório': ['Office or practice', 'Oficina o consultorio'], 'Restaurante, bar ou café': ['Restaurant, bar or café', 'Restaurante, bar o café'], 'Clínica ou salão': ['Clinic or salon', 'Clínica o salón'],
    'Pousada': ['Guesthouse (pousada)', 'Posada'], 'Hotel': ['Hotel', 'Hotel'], 'Hostel': ['Hostel', 'Hostel'], 'Imóvel de aluguel por temporada': ['Vacation rental property', 'Propiedad de alquiler temporario'],
    '1 a 5': ['1 to 5', '1 a 5'], '6 a 15': ['6 to 15', '6 a 15'], '16 a 40': ['16 to 40', '16 a 40'], 'Mais de 40': ['More than 40', 'Más de 40'], 'Ainda não sei': ['Not sure yet', 'Todavía no sé'],
    'Quartos': ['Bedrooms', 'Dormitorios'], 'Banheiros': ['Bathrooms', 'Baños'], 'Sala / painel de TV': ['Living room / TV wall', 'Living / panel de TV'], 'Lavanderia': ['Laundry', 'Lavadero'], 'Casa inteira': ['Whole house', 'Casa entera'],
    'Balcão / recepção': ['Counter / reception', 'Mostrador / recepción'], 'Expositores e vitrines': ['Displays and showcases', 'Exhibidores y vitrinas'], 'Estações de trabalho': ['Workstations', 'Puestos de trabajo'], 'Armários e arquivos': ['Cabinets and filing', 'Muebles y archivos'], 'Copa / cozinha': ['Pantry / kitchen', 'Office / cocina'], 'Salão / mesas': ['Dining room / tables', 'Salón / mesas'], 'Ambiente inteiro': ['Entire space', 'Ambiente entero'],
    'Quartos / suítes': ['Rooms / suites', 'Habitaciones / suites'], 'Recepção': ['Reception', 'Recepción'], 'Restaurante / café da manhã': ['Restaurant / breakfast room', 'Restaurante / desayunador'], 'Áreas comuns': ['Common areas', 'Áreas comunes'], 'Cozinha de serviço': ['Service kitchen', 'Cocina de servicio'], 'Tudo': ['Everything', 'Todo'],
    'Até 60 m²': ['Up to 60 m²', 'Hasta 60 m²'], '60 a 120 m²': ['60 to 120 m²', '60 a 120 m²'], '120 a 250 m²': ['120 to 250 m²', '120 a 250 m²'], 'Mais de 250 m²': ['Over 250 m²', 'Más de 250 m²'], 'Não sei': ['Not sure', 'No sé'],
    'Na planta ou em construção': ['Off-plan or under construction', 'En pozo o en construcción'], 'Em reforma': ['Being renovated', 'En reforma'], 'Pronto e vazio': ['Finished and empty', 'Terminado y vacío'], 'Já mobiliado, quero renovar': ['Already furnished, want to refresh', 'Ya amueblado, quiero renovar'],
    'Sim, com arquiteto(a)': ['Yes, with an architect', 'Sí, con arquitecto/a'], 'Tenho referências e ideias': ['I have references and ideas', 'Tengo referencias e ideas'], 'Quero que a Madê desenhe': ['I’d like Madê to design it', 'Quiero que Madê lo diseñe'],
    'Moderno': ['Modern', 'Moderno'], 'Madeira natural': ['Natural wood', 'Madera natural'], 'Rústico / demolição': ['Rustic / reclaimed', 'Rústico / demolición'], 'Minimalista': ['Minimalist', 'Minimalista'], 'Clássico': ['Classic', 'Clásico'],
    'Até 2 meses': ['Within 2 months', 'Hasta 2 meses'], '2 a 4 meses': ['2 to 4 months', '2 a 4 meses'], '4 a 6 meses': ['4 to 6 months', '4 a 6 meses'], 'Sem pressa': ['No rush', 'Sin apuro'],
    'Até R$ 30 mil': ['Up to R$ 30k', 'Hasta R$ 30 mil'], 'R$ 30 a 80 mil': ['R$ 30k to 80k', 'R$ 30 a 80 mil'], 'R$ 80 a 150 mil': ['R$ 80k to 150k', 'R$ 80 a 150 mil'], 'Acima de R$ 150 mil': ['Over R$ 150k', 'Más de R$ 150 mil'], 'Prefiro conversar': ['I’d rather discuss it', 'Prefiero conversarlo'],

    /* ---------- MDF premium (17/10/2026) ---------- */
    'MDF': ['MDF', 'MDF'],
    'MDF premium': ['Premium MDF', 'MDF premium'],
    'O MDF certo': ['The right MDF', 'El MDF correcto'],
    'muda o ambiente.': ['changes the room.', 'cambia el ambiente.'],
    'A maior parte dos planejados da Madê é feita em MDF. Explore os padrões da Arauco, Duratex, Berneck e Guararapes: cores sólidas, amadeirados, madeiras brasileiras, alto brilho e texturas.': ['Most of Madê’s built-in furniture is made in MDF. Explore patterns by Arauco, Duratex, Berneck and Guararapes: solid colors, woodgrains, Brazilian woods, high gloss and textures.', 'La mayor parte de los muebles de Madê se hace en MDF. Explorá los diseños de Arauco, Duratex, Berneck y Guararapes: colores lisos, maderados, maderas brasileñas, alto brillo y texturas.'],
    'Estável e versátil': ['Stable and versatile', 'Estable y versátil'],
    'Chapa de fibra de madeira revestida: o material da maioria dos móveis planejados, com centenas de padrões possíveis.': ['A coated wood-fiber panel: the material behind most built-in furniture, with hundreds of possible patterns.', 'Placa de fibra de madera revestida: el material de la mayoría de los muebles a medida, con cientos de diseños posibles.'],
    'Cores e amadeirados': ['Colors and wood looks', 'Colores y amaderados'],
    'Dos tons lisos e foscos aos amadeirados de carvalho, nogueira, freijó e cumaru.': ['From smooth matte tones to oak, walnut, freijó and cumaru wood looks.', 'De los tonos lisos y mate a los amaderados de roble, nogal, freijó y cumarú.'],
    'Fabricantes de referência': ['Leading manufacturers', 'Fabricantes de referencia'],
    'Arauco, Duratex, Berneck e Guararapes: as chapas premium com que a Madê trabalha.': ['Arauco, Duratex, Berneck and Guararapes: the premium boards Madê works with.', 'Arauco, Duratex, Berneck y Guararapes: los tableros premium con los que trabaja Madê.'],
    'Família de padrão': ['Pattern family', 'Familia de diseño'],
    'Marca': ['Brand', 'Marca'],
    'Cores aproximadas na tela. Padrões e disponibilidade seguem o catálogo vigente de cada fabricante; a Madê leva o mostruário físico para você ver e tocar. Arauco, Duratex, Berneck, Guararapes, FGVTN, Häfele, Italy Line e Zen Design são marcas dos seus fabricantes.': ['Colors on screen are approximate. Patterns and availability follow each manufacturer’s current catalog; Madê brings the physical samples for you to see and touch. Arauco, Duratex, Berneck, Guararapes, FGVTN, Häfele, Italy Line and Zen Design are trademarks of their owners.', 'Colores aproximados en pantalla. Diseños y disponibilidad siguen el catálogo vigente de cada fabricante; Madê lleva el muestrario físico para que lo veas y lo toques. Arauco, Duratex, Berneck, Guararapes, FGVTN, Häfele, Italy Line y Zen Design son marcas de sus fabricantes.'],
    'Cores sólidas': ['Solid colors', 'Colores lisos'],
    'Amadeirados': ['Wood looks', 'Amaderados'],
    'Madeiras brasileiras': ['Brazilian woods', 'Maderas brasileñas'],
    'Alto brilho': ['High gloss', 'Alto brillo'],
    'Texturas': ['Textures', 'Texturas'],
    'Cor sólida': ['Solid color', 'Color liso'],
    'Amadeirado': ['Wood look', 'Amaderado'],
    'Madeira brasileira': ['Brazilian wood', 'Madera brasileña'],
    'Textura': ['Texture', 'Textura'],
    'Todas as marcas': ['All brands', 'Todas las marcas'],
    'Usados pela Madê': ['Used by Madê', 'Usados por Madê'],
    'Usado em projeto da Madê': ['Used in a Madê project', 'Usado en un proyecto de Madê'],
    'Buscar: Freijó, Sálvia…': ['Search: Freijó, Sálvia…', 'Buscar: Freijó, Sálvia…'],
    'Buscar padrão de MDF pelo nome': ['Search MDF pattern by name', 'Buscar diseño de MDF por nombre'],
    '1 padrão': ['1 pattern', '1 diseño'],
    '{n} padrões': ['{n} patterns', '{n} diseños'],
    'Nenhum padrão com esse filtro. Tente outro nome ou família.': ['No pattern matches this filter. Try another name or family.', 'Ningún diseño con ese filtro. Probá otro nombre o familia.'],
    'Fabricante': ['Manufacturer', 'Fabricante'],
    'Linha / acabamento': ['Line / finish', 'Línea / terminación'],
    'Usado pela Madê em': ['Used by Madê in', 'Usado por Madê en'],
    'Ver nas portas': ['Try on the doors', 'Ver en las puertas'],
    'Ver nos aéreos e painéis': ['Try on wall cabinets and panels', 'Ver en alacenas y paneles'],
    '♥ No seu moodboard': ['♥ In your moodboard', '♥ En tu moodboard'],
    '♡ Guardar no moodboard': ['♡ Save to moodboard', '♡ Guardar en el moodboard'],
    'Cozinha monocromática': ['Monochrome kitchen', 'Cocina monocromática'],
    'Quarto do Miguel': ['Miguel’s bedroom', 'Dormitorio de Miguel'],
    'Closet ele e ela': ['His-and-hers closet', 'Vestidor él y ella'],
    'Cozinha Carvalho Malva': ['Carvalho Malva oak kitchen', 'Cocina roble Carvalho Malva'],
    'Guarda-roupa com porta de espelho': ['Wardrobe with mirrored door', 'Placard con puerta espejada'],
    'Marcenaria sob medida em Garopaba e Imbituba: móveis planejados em MDF Arauco e Duratex — cozinhas, quartos, closets e áreas gourmet para casas, apartamentos, comércios e pousadas — e peças em madeira maciça. Faça seu pré-orçamento.': ['Custom woodwork in Garopaba and Imbituba, Brazil: built-in furniture in Arauco and Duratex MDF — kitchens, bedrooms, closets and outdoor kitchens for homes, apartments, shops and guesthouses — plus solid wood pieces. Get a quick estimate.', 'Carpintería a medida en Garopaba e Imbituba, Brasil: muebles a medida en MDF Arauco y Duratex — cocinas, dormitorios, vestidores y quinchos para casas, departamentos, comercios y posadas — y piezas en madera maciza. Pedí tu presupuesto.'],
    'Planejados em MDF Arauco e Duratex, e peças em madeira maciça, inclusive de demolição': ['Built-ins in Arauco and Duratex MDF, plus solid wood pieces, including reclaimed wood', 'Muebles en MDF Arauco y Duratex, y piezas en madera maciza, incluso de demolición'],
    /* ---------- Reposicionamento: MDF e projetos grandes (19/10/2026) ---------- */
    'Ambientes planejados em MDF premium, da cozinha à casa inteira, com detalhes em madeira maciça.': ['Premium MDF built-ins, from the kitchen to the whole house, with solid wood details.', 'Muebles a medida en MDF premium, de la cocina a la casa entera, con detalles en madera maciza.'],
    'Projetos completos': ['Complete projects', 'Proyectos completos'],
    'A casa inteira,': ['The whole house,', 'La casa entera,'],
    'planejada.': ['made to measure.', 'a medida.'],
    'A Madê faz ambientes planejados em MDF premium, Arauco, Duratex, Berneck e Guararapes, com foco em projetos grandes: a casa inteira, pousadas e hospedagens, lojas e escritórios, obras com arquiteto. Cada ambiente é desenhado em 3D, produzido e montado com atenção ao que só se nota de perto. A madeira maciça entra como detalhe, onde faz diferença.': ['Madê makes premium MDF built-ins in Arauco, Duratex, Berneck and Guararapes, focused on large projects: whole homes, guesthouses and holiday rentals, shops and offices, builds led by an architect. Every room is designed in 3D, made and installed with attention to what you only notice up close. Solid wood comes in as an accent, where it makes a difference.', 'Madê hace muebles a medida en MDF premium Arauco, Duratex, Berneck y Guararapes, con foco en proyectos grandes: la casa entera, posadas y alojamientos, locales y oficinas, obras con arquitecto. Cada ambiente se diseña en 3D, se fabrica y se monta cuidando lo que solo se nota de cerca. La madera maciza entra como detalle, donde hace la diferencia.'],
    'Casas inteiras, hospedagem e comércio, também em parceria com o seu arquiteto': ['Whole homes, hospitality and commercial spaces, also in partnership with your architect', 'Casas enteras, alojamientos y comercios, también junto con tu arquitecto'],
    'Pré-orçamento nº {n}': ['Estimate no. {n}', 'Presupuesto n.º {n}'],
    'Foto realista': ['Realistic photo', 'Foto realista'],
    'Gerar foto realista desta cena': ['Generate a realistic photo of this scene', 'Generar foto realista de esta escena'],
    'Preparando a luz…': ['Preparing the lighting…', 'Preparando la luz…'],
    'Cancelar': ['Cancel', 'Cancelar'],
    'Seu navegador não conseguiu gerar a foto.': ['Your browser couldn’t generate the photo.', 'Tu navegador no pudo generar la foto.'],
    'Gerando foto realista… {p}%': ['Rendering realistic photo… {p}%', 'Generando foto realista… {p}%'],
    'Pronta! Cores aproximadas: a Madê leva as amostras reais.': ['Done! Colors are approximate: Madê brings the real samples.', '¡Lista! Colores aproximados: Madê lleva las muestras reales.'],
    'Salvar imagem': ['Save image', 'Guardar imagen'],
    'Voltar ao 3D': ['Back to 3D', 'Volver al 3D'],
    'Arraste para girar': ['Drag to rotate', 'Arrastrá para girar'],
    'Outra cidade': ['Another city', 'Otra ciudad'],

    /* ---------- Histórias (projetos em destaque) ---------- */
    'Histórias': ['Stories', 'Historias'],
    'Cada projeto': ['Every project', 'Cada proyecto'],
    'conta uma história.': ['tells a story.', 'cuenta una historia.'],
    'Muito mais que móveis: um pedido, um espaço e a solução que a Madê desenhou para ele. Escolha um capítulo.': ['Much more than furniture: a wish, a space and the solution Madê designed for it. Pick a chapter.', 'Mucho más que muebles: un pedido, un espacio y la solución que Madê diseñó para él. Elegí un capítulo.'],
    'Projetos em destaque': ['Featured projects', 'Proyectos destacados'],
    'Foto anterior': ['Previous photo', 'Foto anterior'],
    'Próxima foto': ['Next photo', 'Foto siguiente'],
    'Ver no Instagram': ['See it on Instagram', 'Ver en Instagram'],
    'Cozinha verde-sálvia': ['Sage green kitchen', 'Cocina verde salvia'],
    'Carvalho e pedra': ['Oak and stone', 'Roble y piedra'],
    'Sala de jantar': ['Dining room', 'Comedor'],
    'verde-sálvia': ['in sage green', 'verde salvia'],
    'Embaixo': ['Under', 'Debajo'],
    'da escada': ['the stairs', 'de la escalera'],
    'ele e ela': ['for him and her', 'de él y de ella'],
    'Carvalho': ['Oak', 'Roble'],
    'e pedra': ['and stone', 'y piedra'],
    'Moderna, acolhedora e sofisticada': ['Modern, warm and refined', 'Moderna, cálida y sofisticada'],
    'Nenhum canto sobrando': ['No corner left behind', 'Ningún rincón desperdiciado'],
    'Espaços iguais, rotinas diferentes': ['Equal spaces, different routines', 'Espacios iguales, rutinas distintas'],
    'Estética e funcionalidade': ['Looks and function', 'Estética y funcionalidad'],
    'O verde-sálvia dá o tom; o branco, o cinza e o aço escovado equilibram. As paredes ganharam painéis em cinza e a torre de eletros veio na mesma cor dos armários. Do projeto em 3D à montagem, feita em parceria com a @marchi.montagens.': ['Sage green sets the tone; white, grey and brushed steel balance it. The walls got grey panels and the appliance tower matches the cabinets. From the 3D design to the installation, done with our partner @marchi.montagens.', 'El verde salvia marca el tono; el blanco, el gris y el acero cepillado lo equilibran. Las paredes recibieron paneles grises y la torre de electrodomésticos vino del mismo color que los muebles. Del proyecto en 3D al montaje, hecho junto a @marchi.montagens.'],
    'O vão embaixo da escada é o espaço que quase toda casa esquece. Aqui ele virou armário, adega e bar, integrado à sala de jantar: o que era sobra passou a fazer parte da casa.': ['The space under the stairs is the one almost every home forgets. Here it became storage, a wine cellar and a bar, part of the dining room: what was left over became part of the house.', 'El hueco debajo de la escalera es el espacio que casi toda casa olvida. Acá se convirtió en armario, cava y bar, integrado al comedor: lo que sobraba pasó a ser parte de la casa.'],
    'Uma parede de 2,80 m dividida em duas metades iguais, uma para cada um. O amadeirado Cumaru Trend, da Arauco, aquece o ambiente e deixa a marcenaria com cara de casa.': ['A 2.80 m wall split into two equal halves, one for each of them. Arauco’s Cumaru Trend woodgrain warms the room and makes the joinery feel like home.', 'Una pared de 2,80 m dividida en dos mitades iguales, una para cada uno. El maderado Cumaru Trend, de Arauco, le da calidez al ambiente y hace que los muebles se sientan de casa.'],
    'O amadeirado Carvalho Malva encontra a pedra São Gabriel escovada. Ao lado do fogão, um porta-temperos deixa tudo à mão de quem cozinha.': ['Carvalho Malva oak woodgrain meets brushed São Gabriel stone. Next to the stove, a spice rack keeps everything within reach of the cook.', 'El maderado Carvalho Malva se encuentra con la piedra São Gabriel cepillada. Al lado de la cocina, un especiero deja todo a mano de quien cocina.'],
    'Paleta': ['Palette', 'Paleta'],
    'Detalhes': ['Details', 'Detalles'],
    'Programa': ['Program', 'Programa'],
    'A ideia': ['The idea', 'La idea'],
    'Medida': ['Size', 'Medida'],
    'Verde-sálvia, branco e cinza': ['Sage green, white and grey', 'Verde salvia, blanco y gris'],
    'Aço escovado e painéis nas paredes': ['Brushed steel and wall panels', 'Acero cepillado y paneles en las paredes'],
    'Aproveitar o vão da escada': ['Use the space under the stairs', 'Aprovechar el hueco de la escalera'],
    '2,80 m de parede': ['2.80 m of wall', '2,80 m de pared'],
    'Cumaru Trend · Arauco': ['Cumaru Trend · Arauco', 'Cumaru Trend · Arauco'],
    'Pedra São Gabriel escovada': ['Brushed São Gabriel stone', 'Piedra São Gabriel cepillada'],
    'Torre de eletros em verde-sálvia com painéis cinza nas paredes': ['Sage green appliance tower with grey wall panels', 'Torre de electrodomésticos verde salvia con paneles grises en las paredes'],

    /* ---------- Marcas (MDF, ferragens e metais) ---------- */
    'Marcas que assinam': ['Brands behind', 'Marcas que firman'],
    'cada detalhe.': ['every detail.', 'cada detalle.'],
    'Por fora, o padrão de MDF que você escolheu. Por dentro, corrediças, dobradiças e puxadores das marcas de referência: o que se sente a cada porta e gaveta aberta.': ['Outside, the MDF pattern you chose. Inside, slides, hinges and handles from leading brands: what you feel every time a door or drawer opens.', 'Por fuera, el diseño de MDF que elegiste. Por dentro, correderas, bisagras y tiradores de las marcas de referencia: lo que se siente en cada puerta y cajón que se abre.'],
    'Chapas de MDF': ['MDF boards', 'Tableros de MDF'],
    'Ferragens e metais': ['Hardware and fittings', 'Herrajes y metales'],
    'Cores, madeiras e texturas': ['Colors, woodgrains and textures', 'Colores, maderas y texturas'],
    'Design, Essencial Wood e Cristallo': ['Design, Essencial Wood and Cristallo', 'Design, Essencial Wood y Cristallo'],
    'Coleções Legado e Horizontes': ['Legado and Horizontes collections', 'Colecciones Legado y Horizontes'],
    'Colors e Madeiras do Brasil': ['Colors and Brazilian woods', 'Colors y Maderas de Brasil'],
    'Corrediças, dobradiças e gavetas metálicas': ['Drawer slides, hinges and metal drawers', 'Correderas, bisagras y cajones metálicos'],
    'Articuladores, gavetas e iluminação': ['Lift systems, drawers and lighting', 'Elevadores, cajones e iluminación'],
    'Puxadores e metais decorativos': ['Handles and decorative fittings', 'Tiradores y metales decorativos'],
    'Puxadores em zamac': ['Zamak handles', 'Tiradores de zamak'],

    /* ---------- Histórias e mosaico: fotos em alta e capa (21/10/2026) ---------- */
    'Adega': ['Lit', 'Cava'],
    'iluminada': ['wine wall', 'iluminada'],
    'Adega iluminada': ['Lit wine wall', 'Cava iluminada'],
    'Amadeirado e preto': ['Woodgrain and black', 'Maderado y negro'],
    'Armários, bancada e prateleiras no mesmo Beige Matt, da Arauco. Com uma paleta única, o olhar não encontra divisões e a cozinha pequena parece maior.': ['Cabinets, countertop and shelves all in the same Arauco Beige Matt. With a single palette the eye finds no breaks, and the small kitchen feels bigger.', 'Muebles, mesada y estantes en el mismo Beige Matt de Arauco. Con una sola paleta, la mirada no encuentra cortes y la cocina chica parece más grande.'],
    'Aéreos amadeirados até o teto, uma torre com nichos iluminados por LED e adega para as garrafas, e uma bancada em pedra escura que desce até o piso e separa a cozinha da sala.': ['Woodgrain wall cabinets up to the ceiling, a tower with LED-lit niches and a wine rack, and a dark stone counter that runs down to the floor and separates the kitchen from the living room.', 'Alacenas maderadas hasta el techo, una torre con nichos iluminados con LED y cava para las botellas, y una mesada de piedra oscura que baja hasta el piso y separa la cocina del living.'],
    'Bancada dupla e gaveteiros': ['Double desk and drawer units', 'Escritorio doble y cajoneras'],
    'Bancada em pedra': ['Stone counter', 'Mesada de piedra'],
    'Bancada em pedra escura com queda até o piso': ['Dark stone counter running down to the floor', 'Mesada de piedra oscura que baja hasta el piso'],
    'Bancada em pedra escura com queda até o piso diante da torre iluminada': ['Dark stone counter running down to the floor in front of the lit tower', 'Mesada de piedra oscura hasta el piso frente a la torre iluminada'],
    'Escritório para dois': ['Home office for two', 'Escritorio para dos'],
    'para dois': ['for two', 'para dos'],
    'Beige Matt · Arauco': ['Beige Matt · Arauco', 'Beige Matt · Arauco'],
    'Beige Matt, da Arauco': ['Beige Matt, by Arauco', 'Beige Matt, de Arauco'],
    'Com queda até o piso': ['Running down to the floor', 'Hasta el piso'],
    'Cozinha amadeirada com torre de nichos iluminados, adega e bancada em pedra escura': ['Woodgrain kitchen with a lit niche tower, wine rack and dark stone counter', 'Cocina maderada con torre de nichos iluminados, cava y mesada de piedra oscura'],
    'Cozinha em amadeirado claro com puxadores pretos e bancada escura': ['Light woodgrain kitchen with black handles and a dark countertop', 'Cocina en maderado claro con tiradores negros y mesada oscura'],
    'Cozinha integrada': ['Open kitchen', 'Cocina integrada'],
    'Cozinha pequena toda em MDF Beige Matt da Arauco': ['Small kitchen fully in Arauco Beige Matt MDF', 'Cocina chica toda en MDF Beige Matt de Arauco'],
    'Cozinha pequena toda em MDF Beige Matt da Arauco, com nicho aberto sob os aéreos': ['Small kitchen fully in Arauco Beige Matt MDF, with an open niche under the wall cabinets', 'Cocina chica toda en MDF Beige Matt de Arauco, con nicho abierto bajo las alacenas'],
    'Design, conforto e funcionalidade': ['Design, comfort and function', 'Diseño, confort y funcionalidad'],
    'Destaque': ['Highlight', 'Destacado'],
    'Escritório planejado com bancada dupla, painel amadeirado e prateleira iluminada': ['Custom office with a double desk, woodgrain panel and lit shelf', 'Oficina a medida con escritorio doble, panel maderado y estante iluminado'],
    'Luz': ['Light', 'Luz'],
    'Luz no lugar certo': ['Light in the right place', 'Luz en el lugar justo'],
    'Mais no Instagram': ['More on Instagram', 'Más en Instagram'],
    'Moodboard da Madê com palha natural, MDF amadeirado e puxador dourado Italy Line na caixa': ['Madê moodboard with natural cane, woodgrain MDF and a boxed gold Italy Line handle', 'Moodboard de Madê con esterilla natural, MDF maderado y tirador dorado Italy Line en su caja'],
    'Nichos com LED até o teto': ['LED niches up to the ceiling', 'Nichos con LED hasta el techo'],
    'Nichos com LED e adega': ['LED niches and wine rack', 'Nichos con LED y cava'],
    'Pedra escura com queda até o piso': ['Dark stone down to the floor', 'Piedra oscura hasta el piso'],
    'Poucos metros, uma cor só': ['A few square meters, one color', 'Pocos metros, un solo color'],
    'Prateleira com LED embutido': ['Shelf with built-in LED', 'Estante con LED embutido'],
    'Puxadores pretos e nichos abertos': ['Black handles and open niches', 'Tiradores negros y nichos abiertos'],
    'Uma bancada contínua para duas pessoas trabalharem lado a lado, gaveteiros sob medida, painel amadeirado para a TV e uma prateleira com luz embutida de ponta a ponta. Um espaço projetado para organizar, com cada detalhe pensado para o dia a dia.': ['One continuous desk for two people to work side by side, custom drawer units, a woodgrain TV panel and a shelf with built-in light from end to end. A space designed to stay organized, every detail planned for daily life.', 'Un escritorio continuo para que dos personas trabajen lado a lado, cajoneras a medida, panel maderado para la TV y un estante con luz embutida de punta a punta. Un espacio pensado para organizar, con cada detalle planeado para el día a día.'],
    'Uma cor só para ampliar': ['One color to open it up', 'Un solo color para ampliar'],
    'monocromática': ['in one color', 'monocromática']
  };

  var IDIOMAS = ['pt', 'en', 'es'];
  var NOMES_HTML = { pt: 'pt-BR', en: 'en', es: 'es' };
  var CHAVE = 'made:idioma';

  function escolher() {
    var q = (new URLSearchParams(location.search).get('lang') || '').slice(0, 2).toLowerCase();
    if (IDIOMAS.indexOf(q) !== -1) return q;
    try { var s = localStorage.getItem(CHAVE); if (IDIOMAS.indexOf(s) !== -1) return s; } catch (e) {}
    var n = (navigator.language || 'pt').slice(0, 2).toLowerCase();
    return IDIOMAS.indexOf(n) !== -1 ? n : 'pt';
  }

  var idioma = escolher();

  function t(pt, vars) {
    var txt = pt;
    if (idioma !== 'pt' && D[pt]) txt = D[pt][idioma === 'en' ? 0 : 1] || pt;
    if (vars) Object.keys(vars).forEach(function (k) { txt = txt.split('{' + k + '}').join(vars[k]); });
    return txt;
  }

  /* ---------- Troca na página (texto e atributos), com volta ao original ---------- */
  var originais = new WeakMap();      // nó de texto → texto pt original
  var ATRIBUTOS = ['aria-label', 'alt', 'placeholder', 'title'];
  var PULAR = { SCRIPT: 1, STYLE: 1, SVG: 1, NOSCRIPT: 1 };

  function traduzirNo(no) {
    if (!originais.has(no)) originais.set(no, no.nodeValue);
    var orig = originais.get(no);
    var limpo = orig.replace(/\s+/g, ' ').trim();
    if (!limpo) return;
    var antes = orig.match(/^\s*/)[0], depois = orig.match(/\s*$/)[0];
    var novo = idioma === 'pt' ? orig : (D[limpo] ? antes + t(limpo) + depois : orig);
    if (no.nodeValue !== novo) no.nodeValue = novo;
  }

  function aplicar(raiz) {
    raiz = raiz || document.body;
    var caminhante = document.createTreeWalker(raiz, NodeFilter.SHOW_TEXT, {
      acceptNode: function (n) {
        for (var p = n.parentNode; p && p !== raiz.parentNode; p = p.parentNode) {
          if (PULAR[p.nodeName.toUpperCase()] || (p.hasAttribute && p.hasAttribute('data-sem-traducao'))) return NodeFilter.FILTER_REJECT;
        }
        return NodeFilter.FILTER_ACCEPT;
      }
    });
    var n; while ((n = caminhante.nextNode())) traduzirNo(n);
    raiz.querySelectorAll('[aria-label],[alt],[placeholder],[title]').forEach(function (el) {
      if (el.closest('[data-sem-traducao]')) return;   // módulos que se traduzem sozinhos
      ATRIBUTOS.forEach(function (a) {
        if (!el.hasAttribute(a)) return;
        var chave = 'data-pt-' + a;
        if (!el.hasAttribute(chave)) el.setAttribute(chave, el.getAttribute(a));
        var orig = el.getAttribute(chave);
        el.setAttribute(a, idioma === 'pt' ? orig : t(orig));
      });
    });
  }

  function aplicarCabeca() {
    document.documentElement.lang = NOMES_HTML[idioma];
    if (!document.documentElement.dataset.ptTitulo) document.documentElement.dataset.ptTitulo = document.title;
    document.title = t(document.documentElement.dataset.ptTitulo);
    var md = document.querySelector('meta[name="description"]');
    if (md) { if (!md.dataset.pt) md.dataset.pt = md.content; md.content = t(md.dataset.pt); }
  }

  function marcarBotoes() {
    document.querySelectorAll('[data-idioma]').forEach(function (b) { b.setAttribute('aria-pressed', b.dataset.idioma === idioma ? 'true' : 'false'); });
  }

  function mudar(novo) {
    if (IDIOMAS.indexOf(novo) === -1 || novo === idioma) return;
    idioma = novo;
    try { localStorage.setItem(CHAVE, novo); } catch (e) {}
    aplicarCabeca(); aplicar(); marcarBotoes();
    document.dispatchEvent(new CustomEvent('made:idioma', { detail: { idioma: novo } }));
  }

  document.addEventListener('click', function (e) {
    var b = e.target.closest('[data-idioma]');
    if (b) { e.preventDefault(); mudar(b.dataset.idioma); }
  });

  window.MadeI18n = {
    t: t,
    idioma: function () { return idioma; },
    nomeIdioma: function () { return { pt: 'Português', en: 'English (inglês)', es: 'Español (espanhol)' }[idioma]; },
    aplicar: aplicar,
    mudar: mudar,
    // Texto em português de um elemento já traduzido (o moodboard guarda o
    // título em pt, para a mensagem da dona sair sempre em português).
    original: function (el) {
      if (!el) return '';
      var out = '', w = document.createTreeWalker(el, NodeFilter.SHOW_TEXT), n;
      while ((n = w.nextNode())) out += originais.has(n) ? originais.get(n) : n.nodeValue;
      return out.replace(/\s+/g, ' ').trim();
    }
  };

  // Roda antes dos outros módulos (os scripts são defer e vêm depois deste no HTML).
  aplicarCabeca();
  if (idioma !== 'pt') aplicar();
  marcarBotoes();
})();
