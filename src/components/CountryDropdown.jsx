import React from 'react';
import { useTranslation } from '../context/TranslationContext';

const CountryDropdown = ({ 
  value, 
  onChange, 
  name = 'country', 
  id = 'country',
  placeholder,
  countries = [],
  className = '',
  disabled = false
}) => {
  const { t } = useTranslation();
  
  const defaultPlaceholder = placeholder || t('common.selectCountry');

  return (
    <select
      id={id}
      name={name}
      value={value || ''}
      onChange={onChange}
      className={className}
      disabled={disabled}
    >
      <option value="">{defaultPlaceholder}</option>
      {countries.map((country) => (
        <option key={country.code} value={country.code}>
          {country.code} - {country.name}
        </option>
      ))}
    </select>
  );
};

export default CountryDropdown;

