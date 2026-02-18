import React from 'react';
import { useTranslation } from '../context/TranslationContext';

// Cities by country code - shared across the application
export const citiesByCountry = {
  'TR': ['Istanbul', 'Ankara', 'Izmir', 'Antalya', 'Bodrum', 'Alanya', 'Fethiye', 'Marmaris'],
  'ES': ['Madrid', 'Barcelona', 'Valencia', 'Seville', 'Marbella', 'Mallorca', 'Malaga', 'Alicante'],
  'IT': ['Rome', 'Milan', 'Naples', 'Turin', 'Palermo', 'Genoa', 'Florence', 'Bologna'],
  'GR': ['Athens', 'Thessaloniki', 'Crete', 'Rhodes', 'Santorini', 'Mykonos', 'Corfu', 'Patras'],
  'PT': ['Lisbon', 'Porto', 'Braga', 'Coimbra', 'Faro', 'Algarve', 'Madeira', 'Aveiro'],
  'HR': ['Zagreb', 'Split', 'Dubrovnik', 'Rijeka', 'Zadar', 'Pula', 'Osijek', 'Istria'],
  'FR': ['Paris', 'Marseille', 'Lyon', 'Toulouse', 'Nice', 'Nantes', 'Strasbourg', 'Bordeaux'],
  'DE': ['Berlin', 'Munich', 'Hamburg', 'Frankfurt', 'Cologne', 'Stuttgart', 'Düsseldorf', 'Dortmund']
};

export const getCitiesForCountry = (countryCode) => {
  if (!countryCode) return [];
  return citiesByCountry[countryCode.toUpperCase()] || [];
};

const CityDropdown = ({ 
  value, 
  onChange, 
  countryCode,
  name = 'city', 
  id = 'city',
  placeholder,
  className = '',
  disabled = false,
  allowFreeText = false // If true, allows text input when no country selected
}) => {
  const { t } = useTranslation();
  
  const defaultPlaceholder = placeholder || t('common.selectCity');
  const cities = getCitiesForCountry(countryCode);
  const isDisabled = disabled || (!countryCode && !allowFreeText);

  // If no country selected and free text is allowed, show text input
  if (!countryCode && allowFreeText) {
    return (
      <input
        type="text"
        id={id}
        name={name}
        value={value || ''}
        onChange={onChange}
        placeholder={defaultPlaceholder}
        className={className}
        disabled={disabled}
      />
    );
  }

  return (
    <select
      id={id}
      name={name}
      value={value || ''}
      onChange={onChange}
      className={className}
      disabled={isDisabled}
    >
      <option value="">{defaultPlaceholder}</option>
      {cities.map((city) => (
        <option key={city} value={city}>
          {city}
        </option>
      ))}
    </select>
  );
};

export default CityDropdown;

