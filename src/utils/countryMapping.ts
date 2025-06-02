
import { Country } from '@/types/auth';

export const getCountryFromCode = (countryCode: string): Country => {
  const countryMap: Record<string, Country> = {
    '+244': 'Angola',
    '+258': 'Moçambique',
    '+238': 'Cabo Verde',
    '+264': 'Namibia',
    '+27': 'Africa do Sul',
    '+234': 'Nigéria',
    '+233': 'Gana',
    '+254': 'Quênia',
    '+255': 'Tanzânia',
    '+256': 'Uganda',
    '+250': 'Ruanda',
    '+237': 'Camarões',
    '+225': 'Costa do Marfim',
    '+221': 'Senegal',
    '+223': 'Mali',
    '+251': 'Etiópia',
    '+267': 'Botswana',
    '+260': 'Zâmbia',
    '+263': 'Zimbábue',
    '+265': 'Malauí',
    '+261': 'Madagascar',
    '+230': 'Maurício',
    '+248': 'Seicheles',
    '+241': 'Gabão',
    '+243': 'República Democrática do Congo',
    '+351': 'Portugal',
    '+34': 'Espanha',
    '+33': 'França',
    '+49': 'Alemanha',
    '+39': 'Itália',
    '+44': 'Reino Unido',
    '+31': 'Holanda',
    '+32': 'Bélgica',
    '+41': 'Suíça',
    '+43': 'Áustria',
    '+48': 'Polônia',
    '+420': 'República Tcheca',
    '+36': 'Hungria',
    '+421': 'Eslováquia',
    '+40': 'Romênia',
    '+359': 'Bulgária',
    '+385': 'Croácia',
    '+386': 'Eslovênia',
    '+372': 'Estônia',
    '+371': 'Letônia',
  };
  
  return countryMap[countryCode] || 'Angola';
};

export const extractCountryCodeFromPhone = (phone: string): string => {
  const countryCodeMatch = phone.match(/^\+\d{2,3}/);
  return countryCodeMatch ? countryCodeMatch[0] : '';
};
