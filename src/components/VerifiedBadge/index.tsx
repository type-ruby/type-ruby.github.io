import React from 'react';
import { BadgeCheck, X } from 'lucide-react';

interface VerifiedBadgeProps {
  status: 'pass' | 'fail';
}

export const VerifiedBadge: React.FC<VerifiedBadgeProps> = ({ status }) => (
  status === 'pass'
    ? <BadgeCheck size={10} style={{ marginLeft: 4, verticalAlign: 'middle', color: '#22c55e' }} />
    : <X size={10} style={{ marginLeft: 4, verticalAlign: 'middle', color: 'red', opacity: 0.7 }} />
);

export default VerifiedBadge;
