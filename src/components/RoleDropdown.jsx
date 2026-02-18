import React from 'react';
import { useTranslation } from '../context/TranslationContext';

// Role title options - shared across the application
export const roleTitleOptions = [
  'Real Estate Agent',
  'Lawyer',
  'Appraiser',
  'Contractor',
  'Translator',
  'Architect',
  'Moving Company'
];

const RoleDropdown = ({ 
  value, 
  onChange, 
  name = 'roleTitle', 
  id = 'roleTitle',
  placeholder,
  className = '',
  disabled = false
}) => {
  const { t } = useTranslation();
  
  const defaultPlaceholder = placeholder || t('common.selectRole');

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
      {roleTitleOptions.map((role) => (
        <option key={role} value={role}>
          {role}
        </option>
      ))}
    </select>
  );
};

export default RoleDropdown;

