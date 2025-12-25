import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

const config: Config = {
  title: 'T-Ruby',
  tagline: 'Ruby with syntax for types.',
  favicon: 'img/logo.svg',

  future: {
    v4: true,
  },

  url: 'https://type-ruby.github.io',
  baseUrl: '/',

  organizationName: 'type-ruby',
  projectName: 'type-ruby.github.io',

  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',

  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'ja', 'ko'],
    localeConfigs: {
      en: {
        htmlLang: 'en-US',
        label: 'English',
      },
      ja: {
        htmlLang: 'ja-JP',
        label: '日本語',
      },
      ko: {
        htmlLang: 'ko-KR',
        label: '한국어',
      },
    },
  },

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          editUrl: 'https://github.com/type-ruby/t-ruby.github.io/tree/main/',
        },
        blog: {
          showReadingTime: true,
          blogTitle: 'T-Ruby Blog',
          blogDescription: 'Tutorials, technical articles, and best practices for T-Ruby',
          blogSidebarTitle: 'Recent Posts',
          blogSidebarCount: 5,
          postsPerPage: 10,
          editUrl: 'https://github.com/type-ruby/t-ruby.github.io/tree/main/',
          feedOptions: {
            type: ['rss', 'atom'],
            xslt: true,
            copyright: `Copyright ${new Date().getFullYear()} T-Ruby.`,
          },
        },
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  plugins: [
    [
      '@docusaurus/plugin-content-blog',
      {
        id: 'news',
        path: './news',
        routeBasePath: 'news',
        blogTitle: 'T-Ruby News',
        blogDescription: 'Release notes, announcements, and project updates',
        blogSidebarTitle: 'Recent News',
        blogSidebarCount: 10,
        postsPerPage: 10,
        showReadingTime: false,
        editUrl: 'https://github.com/type-ruby/t-ruby.github.io/tree/main/',
        feedOptions: {
          type: ['rss', 'atom'],
          xslt: true,
          copyright: `Copyright ${new Date().getFullYear()} T-Ruby.`,
        },
      },
    ],
  ],

  themeConfig: {
    image: 'img/t-ruby-social-card.png',
    colorMode: {
      defaultMode: 'dark',
      respectPrefersColorScheme: true,
    },
    navbar: {
      title: 'T-Ruby',
      logo: {
        alt: 'T-Ruby Logo',
        src: 'img/logo.svg',
      },
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'docsSidebar',
          position: 'left',
          label: 'Docs',
        },
        {
          to: '/playground',
          label: 'Playground',
          position: 'left',
        },
        {
          to: '/blog',
          label: 'Blog',
          position: 'left',
        },
        {
          to: '/news',
          label: 'News',
          position: 'left',
        },
        {
          type: 'localeDropdown',
          position: 'right',
        },
        {
          href: 'https://github.com/type-ruby/t-ruby',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Learn',
          items: [
            {
              label: 'Introduction',
              to: '/docs/introduction/what-is-t-ruby',
            },
            {
              label: 'Quick Start',
              to: '/docs/getting-started/quick-start',
            },
            {
              label: 'Basic Types',
              to: '/docs/learn/basics/basic-types',
            },
          ],
        },
        {
          title: 'Resources',
          items: [
            {
              label: 'Playground',
              to: '/playground',
            },
            {
              label: 'Blog',
              to: '/blog',
            },
            {
              label: 'News',
              to: '/news',
            },
            {
              label: 'Type Cheatsheet',
              to: '/docs/reference/cheatsheet',
            },
            {
              label: 'CLI Reference',
              to: '/docs/cli/commands',
            },
          ],
        },
        {
          title: 'Community',
          items: [
            {
              label: 'GitHub',
              href: 'https://github.com/type-ruby/t-ruby',
            },
            {
              label: 'Contributing',
              to: '/docs/project/contributing',
            },
            {
              label: 'Roadmap',
              to: '/docs/project/roadmap',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} <a href="https://github.com/yhk1038" target="_blank" rel="noopener noreferrer">Fred</a> & <a href="https://github.com/type-ruby" target="_blank" rel="noopener noreferrer">T-Ruby</a>. Built with <a href="https://docusaurus.io" target="_blank" rel="noopener noreferrer">Docusaurus</a>.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
      additionalLanguages: ['ruby', 'bash', 'yaml', 'json'],
    },
    algolia: undefined,
  } satisfies Preset.ThemeConfig,
};

export default config;
