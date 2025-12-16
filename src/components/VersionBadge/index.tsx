import React from 'react';
import versionData from '@site/static/version.json';

type ComponentType = 'compiler' | 'vscode' | 'jetbrains' | 'wasm';

interface VersionBadgeProps {
  component?: ComponentType;
  showLabel?: boolean;
  style?: 'badge' | 'inline';
}

const labels: Record<ComponentType, string> = {
  compiler: 'T-Ruby',
  vscode: 'VSCode',
  jetbrains: 'JetBrains',
  wasm: 'WASM',
};

export const VersionBadge: React.FC<VersionBadgeProps> = ({
  component = 'compiler',
  showLabel = false,
  style = 'inline',
}) => {
  const version = versionData[component];
  const label = labels[component];

  if (style === 'badge') {
    return (
      <span
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '4px',
          padding: '2px 8px',
          borderRadius: '4px',
          fontSize: '12px',
          fontWeight: 500,
          backgroundColor: 'var(--ifm-color-primary-lightest)',
          color: 'var(--ifm-color-primary-darkest)',
          border: '1px solid var(--ifm-color-primary-light)',
        }}
      >
        {showLabel && <span>{label}</span>}
        <span>v{version}</span>
      </span>
    );
  }

  return (
    <span style={{ fontFamily: 'var(--ifm-font-family-monospace)' }}>
      {showLabel && `${label} `}v{version}
    </span>
  );
};

export default VersionBadge;
