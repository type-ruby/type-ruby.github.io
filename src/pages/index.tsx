import type {ReactNode} from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';
import CodeBlock from '@theme/CodeBlock';

import styles from './index.module.css';

function HeroBanner() {
  return (
    <header className={styles.heroBanner}>
      <div className="container">
        <span className="badge badge--experimental">Experimental</span>
        <Heading as="h1" className={styles.heroTitle}>
          Type-safe Ruby,<br />
          <span className={styles.heroHighlight}>the TypeScript way</span>
        </Heading>
        <p className={styles.heroSubtitle}>
          Write <code>.trb</code> files with type annotations.<br />
          Compile to standard <code>.rb</code> files with zero runtime overhead.
        </p>

        <div className={styles.installCommand}>
          <span className={styles.dollar}>$</span>
          <code>gem install t-ruby</code>
        </div>

        <div className={styles.heroButtons}>
          <Link
            className="button button--primary button--lg"
            to="/docs/getting-started/quick-start">
            Get Started
          </Link>
          <Link
            className="button button--secondary button--lg"
            to="/playground">
            Playground
          </Link>
        </div>
      </div>
    </header>
  );
}

const FEATURES = [
  {
    title: 'Type Safety',
    icon: '🔒',
    description: 'Catch type errors at compile time, not runtime. Add types gradually to your existing Ruby code.',
  },
  {
    title: 'Zero Runtime',
    icon: '🚀',
    description: 'Types are erased during compilation. The output is pure Ruby that runs anywhere.',
  },
  {
    title: 'RBS Generation',
    icon: '📝',
    description: 'Automatically generates .rbs signature files for integration with Steep, Ruby LSP, and more.',
  },
  {
    title: 'TypeScript-inspired',
    icon: '💡',
    description: 'Familiar syntax for TypeScript developers. Union types, generics, interfaces, and more.',
  },
  {
    title: 'Great DX',
    icon: '🛠',
    description: 'VS Code and Neovim support with syntax highlighting, LSP, and real-time error reporting.',
  },
  {
    title: 'Gradual Adoption',
    icon: '🔄',
    description: 'Start with one file. Mix typed and untyped code. Migrate at your own pace.',
  },
];

function FeaturesSection() {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className={styles.featuresGrid}>
          {FEATURES.map((feature, idx) => (
            <div key={idx} className={styles.featureCard}>
              <div className={styles.featureIcon}>{feature.icon}</div>
              <Heading as="h3" className={styles.featureTitle}>{feature.title}</Heading>
              <p className={styles.featureDescription}>{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

const CODE_EXAMPLES = {
  input: `# hello.trb
def greet(name: String): String
  "Hello, #{name}!"
end

def add(a: Integer, b: Integer): Integer
  a + b
end

# Union types
def parse_id(id: String | Integer): String
  id.to_s
end

# Generics
def first<T>(arr: Array<T>): T | nil
  arr[0]
end`,
  output: `# hello.rb (compiled)
def greet(name)
  "Hello, #{name}!"
end

def add(a, b)
  a + b
end

def parse_id(id)
  id.to_s
end

def first(arr)
  arr[0]
end`,
  rbs: `# hello.rbs (generated)
def greet: (String name) -> String

def add: (Integer a, Integer b) -> Integer

def parse_id: (String | Integer id) -> String

def first: [T] (Array[T] arr) -> T?`,
};

function CodeShowcase() {
  return (
    <section className={styles.codeShowcase}>
      <div className="container">
        <Heading as="h2" className={styles.sectionTitle}>
          See it in action
        </Heading>
        <p className={styles.sectionSubtitle}>
          Write typed Ruby, compile to standard Ruby with generated type signatures.
        </p>

        <div className={styles.codeGrid}>
          <div className={styles.codeBlock}>
            <div className={styles.codeHeader}>
              <span className={styles.codeFilename}>hello.trb</span>
              <span className={styles.codeLabel}>Input</span>
            </div>
            <CodeBlock language="ruby" className={styles.codeContent}>
              {CODE_EXAMPLES.input}
            </CodeBlock>
          </div>

          <div className={styles.codeBlock}>
            <div className={styles.codeHeader}>
              <span className={styles.codeFilename}>hello.rb</span>
              <span className={styles.codeLabel}>Output</span>
            </div>
            <CodeBlock language="ruby" className={styles.codeContent}>
              {CODE_EXAMPLES.output}
            </CodeBlock>
          </div>

          <div className={styles.codeBlock}>
            <div className={styles.codeHeader}>
              <span className={styles.codeFilename}>hello.rbs</span>
              <span className={styles.codeLabel}>Generated</span>
            </div>
            <CodeBlock language="ruby" className={styles.codeContent}>
              {CODE_EXAMPLES.rbs}
            </CodeBlock>
          </div>
        </div>
      </div>
    </section>
  );
}

function QuickStartSection() {
  return (
    <section className={styles.quickStart}>
      <div className="container">
        <Heading as="h2" className={styles.sectionTitle}>
          Quick Start
        </Heading>

        <div className={styles.steps}>
          <div className={styles.step}>
            <div className={styles.stepNumber}>1</div>
            <div className={styles.stepContent}>
              <Heading as="h3">Install T-Ruby</Heading>
              <CodeBlock language="bash">
                gem install t-ruby
              </CodeBlock>
            </div>
          </div>

          <div className={styles.step}>
            <div className={styles.stepNumber}>2</div>
            <div className={styles.stepContent}>
              <Heading as="h3">Create a .trb file</Heading>
              <CodeBlock language="ruby" title="hello.trb">
{`def greet(name: String): String
  "Hello, #{name}!"
end

puts greet("World")`}
              </CodeBlock>
            </div>
          </div>

          <div className={styles.step}>
            <div className={styles.stepNumber}>3</div>
            <div className={styles.stepContent}>
              <Heading as="h3">Compile and run</Heading>
              <CodeBlock language="bash">
{`trc hello.trb
ruby build/hello.rb`}
              </CodeBlock>
            </div>
          </div>
        </div>

        <div className={styles.ctaSection}>
          <Link
            className="button button--primary button--lg"
            to="/docs/getting-started/installation">
            Read the full guide
          </Link>
        </div>
      </div>
    </section>
  );
}

function ToolingSection() {
  return (
    <section className={styles.tooling}>
      <div className="container">
        <Heading as="h2" className={styles.sectionTitle}>
          Works with your tools
        </Heading>
        <p className={styles.sectionSubtitle}>
          T-Ruby integrates seamlessly with the Ruby ecosystem.
        </p>

        <div className={styles.toolingGrid}>
          <div className={styles.toolingCard}>
            <Heading as="h3">Editors</Heading>
            <ul>
              <li>VS Code Extension</li>
              <li>Neovim Plugin</li>
              <li>Language Server (LSP)</li>
            </ul>
          </div>

          <div className={styles.toolingCard}>
            <Heading as="h3">Type Checkers</Heading>
            <ul>
              <li>Steep</li>
              <li>Ruby LSP</li>
              <li>Sorbet (via RBS)</li>
            </ul>
          </div>

          <div className={styles.toolingCard}>
            <Heading as="h3">Ruby Ecosystem</Heading>
            <ul>
              <li>RBS Compatible</li>
              <li>Any Ruby version</li>
              <li>All gems work</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function Home(): ReactNode {
  const {siteConfig} = useDocusaurusContext();
  return (
    <Layout
      title="Type-safe Ruby"
      description="T-Ruby: TypeScript-style type system for Ruby. Write .trb files with type annotations, compile to standard .rb files.">
      <HeroBanner />
      <main>
        <FeaturesSection />
        <CodeShowcase />
        <QuickStartSection />
        <ToolingSection />
      </main>
    </Layout>
  );
}
