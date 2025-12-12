import React from 'react';
import { BadgeCheck, X, ExternalLink } from 'lucide-react';

interface ExampleBadgeProps {
  /** 테스트 통과 여부 */
  status: 'pass' | 'fail' | 'pending';
  /** 테스트 파일 경로 (예: spec/docs_site/pages/introduction/what_is_t_ruby_spec.rb) */
  testFile?: string;
  /** 테스트 파일 내 라인 번호 */
  line?: number;
  /** 예제 ID 또는 설명 (선택) */
  id?: string;
}

const GITHUB_REPO = 'https://github.com/type-ruby/t-ruby/blob/main';

export const ExampleBadge: React.FC<ExampleBadgeProps> = ({
  status,
  testFile,
  line,
  id
}) => {
  const statusConfig = {
    pass: {
      icon: <BadgeCheck size={12} />,
      text: 'Verified',
      bgColor: 'rgba(34, 197, 94, 0.1)',
      textColor: '#16a34a',
      borderColor: 'rgba(34, 197, 94, 0.2)',
    },
    fail: {
      icon: <X size={12} />,
      text: 'Failed',
      bgColor: 'rgba(239, 68, 68, 0.1)',
      textColor: '#dc2626',
      borderColor: 'rgba(239, 68, 68, 0.2)',
    },
    pending: {
      icon: <BadgeCheck size={12} style={{ opacity: 0.5 }} />,
      text: 'Pending',
      bgColor: 'rgba(156, 163, 175, 0.1)',
      textColor: '#6b7280',
      borderColor: 'rgba(156, 163, 175, 0.2)',
    },
  };

  const config = statusConfig[status];
  const testUrl = testFile
    ? `${GITHUB_REPO}/${testFile}${line ? `#L${line}` : ''}`
    : undefined;

  const badge = (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '3px',
        padding: '2px 6px',
        borderRadius: '3px',
        fontSize: '10px',
        fontWeight: 500,
        backgroundColor: config.bgColor,
        color: config.textColor,
        border: `1px solid ${config.borderColor}`,
        cursor: testUrl ? 'pointer' : 'default',
        textDecoration: 'none',
        transition: 'opacity 0.2s',
      }}
      title={testUrl ? `View test: ${testFile}${line ? `:${line}` : ''}` : undefined}
    >
      {config.icon}
      <span>{config.text}</span>
      {testUrl && <ExternalLink size={9} style={{ marginLeft: 1, opacity: 0.7 }} />}
    </span>
  );

  if (testUrl) {
    return (
      <a
        href={testUrl}
        target="_blank"
        rel="noopener noreferrer"
        style={{ textDecoration: 'none' }}
      >
        {badge}
      </a>
    );
  }

  return badge;
};

export default ExampleBadge;
