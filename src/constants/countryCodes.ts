
import { CountryCode } from '@/types/auth';

// Países africanos prioritários (mais usados primeiro)
const africanCountries: CountryCode[] = [
  { code: '+244', country: 'Angola' },
  { code: '+258', country: 'Moçambique' },
  { code: '+238', country: 'Cabo Verde' },
  { code: '+27', country: 'Africa do Sul' },
  { code: '+264', country: 'Namibia' },
  { code: '+234', country: 'Nigéria' },
  { code: '+233', country: 'Gana' },
  { code: '+254', country: 'Quênia' },
  { code: '+255', country: 'Tanzânia' },
  { code: '+256', country: 'Uganda' },
  { code: '+250', country: 'Ruanda' },
  { code: '+237', country: 'Camarões' },
  { code: '+225', country: 'Costa do Marfim' },
  { code: '+221', country: 'Senegal' },
  { code: '+223', country: 'Mali' },
  { code: '+251', country: 'Etiópia' },
  { code: '+267', country: 'Botswana' },
  { code: '+260', country: 'Zâmbia' },
  { code: '+263', country: 'Zimbábue' },
  { code: '+265', country: 'Malauí' },
  { code: '+261', country: 'Madagascar' },
  { code: '+230', country: 'Maurício' },
  { code: '+248', country: 'Seicheles' },
  { code: '+241', country: 'Gabão' },
  { code: '+243', country: 'República Democrática do Congo' },
];

// Países europeus (expandido com mais 10 países)
const europeanCountries: CountryCode[] = [
  { code: '+351', country: 'Portugal' },
  { code: '+34', country: 'Espanha' },
  { code: '+33', country: 'França' },
  { code: '+49', country: 'Alemanha' },
  { code: '+39', country: 'Itália' },
  { code: '+44', country: 'Reino Unido' },
  { code: '+31', country: 'Holanda' },
  { code: '+32', country: 'Bélgica' },
  { code: '+41', country: 'Suíça' },
  { code: '+43', country: 'Áustria' },
  { code: '+48', country: 'Polônia' },
  { code: '+420', country: 'República Tcheca' },
  { code: '+36', country: 'Hungria' },
  { code: '+421', country: 'Eslováquia' },
  { code: '+40', country: 'Romênia' },
  { code: '+359', country: 'Bulgária' },
  { code: '+385', country: 'Croácia' },
  { code: '+386', country: 'Eslovênia' },
  { code: '+372', country: 'Estônia' },
  { code: '+371', country: 'Letônia' },
  // Novos 10 países europeus adicionados
  { code: '+370', country: 'Lituânia' },
  { code: '+45', country: 'Dinamarca' },
  { code: '+46', country: 'Suécia' },
  { code: '+47', country: 'Noruega' },
  { code: '+358', country: 'Finlândia' },
  { code: '+354', country: 'Islândia' },
  { code: '+353', country: 'Irlanda' },
  { code: '+30', country: 'Grécia' },
  { code: '+378', country: 'San Marino' },
  { code: '+377', country: 'Mônaco' },
];

// Lista completa ordenada por prioridade (países africanos primeiro)
export const countryCodes: CountryCode[] = [
  ...africanCountries,
  ...europeanCountries,
];

// Exportar grupos separados para uso em outros componentes se necessário
export { africanCountries, europeanCountries };
