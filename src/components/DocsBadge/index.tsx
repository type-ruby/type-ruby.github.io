import React from 'react';
import { BadgeCheck } from 'lucide-react';

interface DocsBadgeProps {
  passRate?: number;
}

export const DocsBadge: React.FC<DocsBadgeProps> = ({ passRate = 100 }) => {
  const isPass = passRate >= 99;

  return (
    <div style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: '4px',
      padding: '4px 8px',
      borderRadius: '4px',
      fontSize: '12px',
      fontWeight: 500,
      backgroundColor: isPass ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)',
      color: isPass ? '#16a34a' : '#dc2626',
      border: `1px solid ${isPass ? 'rgba(34, 197, 94, 0.2)' : 'rgba(239, 68, 68, 0.2)'}`,
      marginBottom: '16px',
    }}>
      <BadgeCheck size={14} />
      <span>Examples Verified ({passRate}%)</span>
    </div>
  );
};

export default DocsBadge;
