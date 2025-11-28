import { LocationDef, WardrobeItem } from './types';

export const WARDROBE: Record<string, WardrobeItem> = {
  pijama: { id: 'pijama', nome: "Pijama Fofo", nivel: 10, prompt: "wearing cute floral pajamas cozy style" },
  chinelo: { id: 'chinelo', nome: "Shorts e Chinelos", nivel: 15, prompt: "wearing denim shorts and casual flip flops home style" },
  uniforme: { id: 'uniforme', nome: "Uniforme Escolar", nivel: 40, prompt: "wearing japanese high school sailor uniform navy blue skirt white shirt" },
  saia_camisa: { id: 'saia_camisa', nome: "Casual Elegante", nivel: 50, prompt: "wearing white button shirt and black pleated skirt elegant casual" },
  sandalia: { id: 'sandalia', nome: "Vestido e Sandálias", nivel: 55, prompt: "wearing beautiful floral summer dress and cute sandals" },
  vestido: { id: 'vestido', nome: "Vestido de Verão", nivel: 45, prompt: "wearing beautiful floral summer dress sundress soft colors" },
  short_crop: { id: 'short_crop', nome: "Short e Crop Top", nivel: 65, prompt: "wearing denim shorts and white crop top belly exposed casual street style" },
  jeans_camisa: { id: 'jeans_camisa', nome: "Jeans e Tênis", nivel: 30, prompt: "wearing blue jeans tight fit and simple white t-shirt casual sneakers" },
  salto_alto: { id: 'salto_alto', nome: "Vestido de Festa e Salto", nivel: 75, prompt: "wearing elegant red evening dress and high heels glamour" },
  garconete: { id: 'garconete', nome: "Uniforme Bar", nivel: 70, prompt: "wearing waitress uniform sexy tavern style" },
  biquini: { id: 'biquini', nome: "Biquíni", nivel: 85, prompt: "wearing bikini at beach" },
  lingerie_branca: { id: 'lingerie_branca', nome: "Lingerie Branca", nivel: 60, prompt: "wearing pure white cotton lingerie set panties and bra cute bedroom" },
  lingerie_renda: { id: 'lingerie_renda', nome: "Lingerie Preta", nivel: 90, prompt: "wearing black lace lingerie set panties and bra sexy bedroom" },
  lingerie_vermelha: { id: 'lingerie_vermelha', nome: "Lingerie Vermelha", nivel: 95, prompt: "wearing red satin lingerie set panties and bra passionate bedroom" }
};

export const LOCATIONS: Record<string, LocationDef> = {
  quarto: {
    id: 'quarto',
    nome: "Quarto da Yumi",
    bgPrompt: "japanese bedroom messy morning light",
    acoes: [
      { txt: "🛌 Dormir", type: 'ACTION', payload: 'sleep' },
      { txt: "👗 Guarda-Roupa", type: 'WARDROBE_MENU' },
      { txt: "📱 Celular", type: 'ACTION', payload: 'cellphone' },
      { txt: "📚 Estudar", type: 'ACTION', payload: 'study' },
      { txt: "💭 Pensar", type: 'ACTION', payload: 'think' },
      { txt: "🚪 Ir para Sala", type: 'NAVIGATE', target: 'sala' }
    ]
  },
  sala: {
    id: 'sala',
    nome: "Sala de Estar",
    bgPrompt: "japanese living room cozy modern furniture",
    acoes: [
      { txt: "📺 Assistir TV", type: 'ACTION', payload: 'tv' },
      { txt: "🚪 Quarto Yumi", type: 'NAVIGATE', target: 'quarto' },
      { txt: "🍽️ Cozinha", type: 'NAVIGATE', target: 'cozinha' },
      { txt: "🚿 Banheiro", type: 'NAVIGATE', target: 'banheiro' },
      { txt: "🎮 Quarto Irmãos", type: 'NAVIGATE', target: 'quarto_irmaos' },
      { txt: "🛏️ Quarto Pais", type: 'NAVIGATE', target: 'quarto_pais' },
      { txt: "🚪 SAIR PARA RUA", type: 'NAVIGATE', target: 'rua', style: 'danger' }
    ]
  },
  cozinha: {
    id: 'cozinha',
    nome: "Cozinha",
    bgPrompt: "japanese kitchen modern clean interior",
    acoes: [
      { txt: "🥣 Comer", type: 'ACTION', payload: 'eat' },
      { txt: "🍳 Cozinhar", type: 'ACTION', payload: 'cook' },
      { txt: "🧹 Limpar", type: 'ACTION', payload: 'clean_kitchen' },
      { txt: "🥤 Beber Água", type: 'ACTION', payload: 'drink' },
      { txt: "🚪 Voltar", type: 'NAVIGATE', target: 'sala' }
    ]
  },
  banheiro: {
    id: 'banheiro',
    nome: "Banheiro",
    bgPrompt: "bathroom with glass shower stall modern",
    acoes: [
      { txt: "🚿 Banho", type: 'ACTION', payload: 'shower' },
      { txt: "🪞 Espelho", type: 'ACTION', payload: 'mirror' },
      { txt: "🚽 Usar Vaso", type: 'ACTION', payload: 'toilet' },
      { txt: "🪥 Escovar Dentes", type: 'ACTION', payload: 'brush_teeth' },
      { txt: "💇‍♀️ Pentear", type: 'ACTION', payload: 'groom' },
      { txt: "🚪 Voltar", type: 'NAVIGATE', target: 'sala' }
    ]
  },
  quarto_irmaos: {
    id: 'quarto_irmaos',
    nome: "Quarto dos Meninos",
    bgPrompt: "japanese boys bedroom messy video games posters",
    acoes: [
      { txt: "👀 Observar", type: 'ACTION', payload: 'observe_bros' },
      { txt: "🗣️ Interagir / Jogar", type: 'INTERACT_MENU', style: 'interaction' },
      { txt: "🧹 Limpar Bagunça", type: 'ACTION', payload: 'clean_bros' },
      { txt: "🚪 Voltar", type: 'NAVIGATE', target: 'sala' }
    ]
  },
  quarto_pais: {
    id: 'quarto_pais',
    nome: "Quarto dos Pais",
    bgPrompt: "japanese master bedroom",
    acoes: [
      { txt: "👀 Espiar", type: 'ACTION', payload: 'spy_parents' },
      { txt: "🚪 Voltar", type: 'NAVIGATE', target: 'sala' }
    ]
  },
  rua: {
    id: 'rua',
    nome: "Rua",
    bgPrompt: "tokyo street crowd neon signs day",
    acoes: [
      { txt: "🏫 Escola", type: 'NAVIGATE', target: 'escola' },
      { txt: "🛍️ Shopping", type: 'NAVIGATE', target: 'shopping' },
      { txt: "🍸 Bar", type: 'NAVIGATE', target: 'bar', style: 'danger' },
      { txt: "🏠 Casa", type: 'NAVIGATE', target: 'sala' }
    ]
  },
  escola: {
    id: 'escola',
    nome: "Escola",
    bgPrompt: "japanese high school hallway anime style",
    acoes: [
      { txt: "🏫 Aula", type: 'ACTION', payload: 'class' },
      { txt: "👥 Pátio (Alunos)", type: 'ACTION', payload: 'interact_students' },
      { txt: "🚪 Sair", type: 'NAVIGATE', target: 'rua' }
    ]
  },
  bar: {
    id: 'bar',
    nome: "Bar",
    bgPrompt: "japanese izakaya bar night interior crowded neon lights",
    acoes: [
      { txt: "💼 Trabalhar", type: 'WORK' },
      { txt: "🍺 Beber (¥50)", type: 'ACTION', payload: 'drink_alcohol', style: 'gold' },
      { txt: "🚪 Sair", type: 'NAVIGATE', target: 'rua' }
    ]
  },
  shopping: {
    id: 'shopping',
    nome: "Shopping",
    bgPrompt: "japanese shopping mall interior bright",
    acoes: [
      { txt: "👗 Loja", type: 'SHOP_MENU', style: 'gold' },
      { txt: "🚪 Sair", type: 'NAVIGATE', target: 'rua' }
    ]
  }
};

export const DAYS_OF_WEEK = ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"];

export const STUDENTS = [
  { nome: "Kenji", tipo: "nerd", fala: "Você viu o novo episódio do anime?" },
  { nome: "Sakura", tipo: "popular", fala: "Essa saia está fora de moda, Yumi." },
  { nome: "Ren", tipo: "atleta", fala: "Hoje tem treino de basquete, vai assistir?" },
  { nome: "Hiro", tipo: "badboy", fala: "Tsc... aula chata." }
];
