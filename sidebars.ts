import type {SidebarsConfig} from '@docusaurus/plugin-content-docs';

const sidebars: SidebarsConfig = {
  docsSidebar: [
    {
      type: 'category',
      label: 'Introduction',
      collapsed: false,
      items: [
        'introduction/what-is-t-ruby',
        'introduction/why-t-ruby',
        'introduction/t-ruby-vs-others',
      ],
    },
    {
      type: 'category',
      label: 'Getting Started',
      collapsed: false,
      items: [
        'getting-started/installation',
        'getting-started/quick-start',
        'getting-started/first-trb-file',
        'getting-started/editor-setup',
        'getting-started/project-configuration',
      ],
    },
    {
      type: 'category',
      label: 'Learn',
      collapsed: false,
      items: [
        {
          type: 'category',
          label: 'The Basics',
          items: [
            'learn/basics/type-annotations',
            'learn/basics/basic-types',
            'learn/basics/type-inference',
          ],
        },
        {
          type: 'category',
          label: 'Everyday Types',
          items: [
            'learn/everyday-types/primitives',
            'learn/everyday-types/arrays-and-hashes',
            'learn/everyday-types/union-types',
            'learn/everyday-types/type-narrowing',
            'learn/everyday-types/literal-types',
          ],
        },
        {
          type: 'category',
          label: 'Functions',
          items: [
            'learn/functions/parameter-return-types',
            'learn/functions/optional-rest-parameters',
            'learn/functions/blocks-procs-lambdas',
          ],
        },
        {
          type: 'category',
          label: 'Classes & Modules',
          items: [
            'learn/classes/class-annotations',
            'learn/classes/instance-class-variables',
            'learn/classes/inheritance-mixins',
            'learn/classes/abstract-classes',
          ],
        },
        {
          type: 'category',
          label: 'Interfaces',
          items: [
            'learn/interfaces/defining-interfaces',
            'learn/interfaces/implementing-interfaces',
            'learn/interfaces/duck-typing',
          ],
        },
        {
          type: 'category',
          label: 'Generics',
          items: [
            'learn/generics/generic-functions-classes',
            'learn/generics/constraints',
            'learn/generics/built-in-generics',
          ],
        },
        {
          type: 'category',
          label: 'Advanced Types',
          items: [
            'learn/advanced/type-aliases',
            'learn/advanced/intersection-types',
            'learn/advanced/conditional-types',
            'learn/advanced/mapped-types',
            'learn/advanced/utility-types',
          ],
        },
      ],
    },
    {
      type: 'category',
      label: 'CLI Reference',
      items: [
        'cli/commands',
        'cli/configuration',
        'cli/compiler-options',
      ],
    },
    {
      type: 'category',
      label: 'Tooling',
      items: [
        'tooling/rbs-integration',
        'tooling/steep',
        'tooling/ruby-lsp',
        'tooling/migrating-from-ruby',
      ],
    },
    {
      type: 'category',
      label: 'Reference',
      items: [
        'reference/cheatsheet',
        'reference/built-in-types',
        'reference/type-operators',
        'reference/stdlib-types',
      ],
    },
    {
      type: 'category',
      label: 'Project',
      items: [
        'project/roadmap',
        'project/contributing',
        'project/changelog',
      ],
    },
  ],
};

export default sidebars;
