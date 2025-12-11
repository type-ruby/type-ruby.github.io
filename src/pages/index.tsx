import type {ReactNode} from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Translate, {translate} from '@docusaurus/Translate';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';
import CodeBlock from '@theme/CodeBlock';

import styles from './index.module.css';

function HeroBanner() {
  return (
    <header className={styles.heroBanner}>
      <div className="container">
        <span className="badge badge--experimental">
          <Translate id="homepage.hero.badge">Experimental</Translate>
        </span>
        <Heading as="h1" className={styles.heroTitle}>
          <Translate id="homepage.hero.title2">Type-safe Ruby,</Translate><br />
          <span className={styles.heroHighlight}>
            <Translate id="homepage.hero.titleHighlight">the TypeScript way</Translate>
          </span>
        </Heading>
        <p className={styles.heroSubtitle}>
          <Translate id="homepage.hero.subtitle2">
            Write .trb files with type annotations. Compile to standard .rb files with zero runtime overhead.
          </Translate>
        </p>

        <div className={styles.installCommand}>
          <span className={styles.dollar}>$</span>
          <code>
            <Translate id="homepage.install.command">gem install t-ruby</Translate>
          </code>
        </div>

        <div className={styles.heroButtons}>
          <Link
            className="button button--primary button--lg"
            to="/docs/getting-started/quick-start">
            <Translate id="homepage.cta.getStarted">Get Started</Translate>
          </Link>
          <Link
            className="button button--secondary button--lg"
            to="/playground">
            <Translate id="homepage.cta.playground">Playground</Translate>
          </Link>
        </div>
      </div>
    </header>
  );
}

function FeaturesSection() {
  const FEATURES = [
    {
      title: translate({id: 'homepage.features.typeSafety.title', message: 'Type Safety'}),
      icon: '🔒',
      description: translate({id: 'homepage.features.typeSafety.description', message: 'Catch type errors at compile time, not runtime. Add types gradually to your existing Ruby code.'}),
    },
    {
      title: translate({id: 'homepage.features.zeroRuntime.title', message: 'Zero Runtime'}),
      icon: '🚀',
      description: translate({id: 'homepage.features.zeroRuntime.description', message: 'Types are erased during compilation. The output is pure Ruby that runs anywhere.'}),
    },
    {
      title: translate({id: 'homepage.features.rbsGeneration.title', message: 'RBS Generation'}),
      icon: '📝',
      description: translate({id: 'homepage.features.rbsGeneration.description', message: 'Automatically generates .rbs signature files for integration with Steep, Ruby LSP, and more.'}),
    },
    {
      title: translate({id: 'homepage.features.tsInspired.title', message: 'TypeScript-inspired'}),
      icon: '💡',
      description: translate({id: 'homepage.features.tsInspired.description', message: 'Familiar syntax for TypeScript developers. Union types, generics, interfaces, and more.'}),
    },
    {
      title: translate({id: 'homepage.features.greatDX.title', message: 'Great DX'}),
      icon: '🛠',
      description: translate({id: 'homepage.features.greatDX.description', message: 'VS Code and Neovim support with syntax highlighting, LSP, and real-time error reporting.'}),
    },
    {
      title: translate({id: 'homepage.features.gradualAdoption.title', message: 'Gradual Adoption'}),
      icon: '🔄',
      description: translate({id: 'homepage.features.gradualAdoption.description', message: 'Start with one file. Mix typed and untyped code. Migrate at your own pace.'}),
    },
  ];

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
          <Translate id="homepage.codeShowcase.title">See it in action</Translate>
        </Heading>
        <p className={styles.sectionSubtitle}>
          <Translate id="homepage.codeShowcase.subtitle">
            Write typed Ruby, compile to standard Ruby with generated type signatures.
          </Translate>
        </p>

        <div className={styles.codeGrid}>
          <div className={styles.codeBlock}>
            <div className={styles.codeHeader}>
              <span className={styles.codeFilename}>hello.trb</span>
              <span className={styles.codeLabel}>
                <Translate id="homepage.codeShowcase.input">Input</Translate>
              </span>
            </div>
            <CodeBlock language="ruby" className={styles.codeContent}>
              {CODE_EXAMPLES.input}
            </CodeBlock>
          </div>

          <div className={styles.codeBlock}>
            <div className={styles.codeHeader}>
              <span className={styles.codeFilename}>hello.rb</span>
              <span className={styles.codeLabel}>
                <Translate id="homepage.codeShowcase.output">Output</Translate>
              </span>
            </div>
            <CodeBlock language="ruby" className={styles.codeContent}>
              {CODE_EXAMPLES.output}
            </CodeBlock>
          </div>

          <div className={styles.codeBlock}>
            <div className={styles.codeHeader}>
              <span className={styles.codeFilename}>hello.rbs</span>
              <span className={styles.codeLabel}>
                <Translate id="homepage.codeShowcase.generated">Generated</Translate>
              </span>
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
          <Translate id="homepage.quickStart.title">Quick Start</Translate>
        </Heading>

        <div className={styles.steps}>
          <div className={styles.step}>
            <div className={styles.stepNumber}>1</div>
            <div className={styles.stepContent}>
              <Heading as="h3">
                <Translate id="homepage.quickStart.step1.title">Install T-Ruby</Translate>
              </Heading>
              <CodeBlock language="bash">
                gem install t-ruby
              </CodeBlock>
            </div>
          </div>

          <div className={styles.step}>
            <div className={styles.stepNumber}>2</div>
            <div className={styles.stepContent}>
              <Heading as="h3">
                <Translate id="homepage.quickStart.step2.title">Create a .trb file</Translate>
              </Heading>
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
              <Heading as="h3">
                <Translate id="homepage.quickStart.step3.title">Compile and run</Translate>
              </Heading>
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
            <Translate id="homepage.quickStart.cta">Read the full guide</Translate>
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
          <Translate id="homepage.tooling.title">Works with your tools</Translate>
        </Heading>
        <p className={styles.sectionSubtitle}>
          <Translate id="homepage.tooling.subtitle">
            T-Ruby integrates seamlessly with the Ruby ecosystem.
          </Translate>
        </p>

        <div className={styles.toolingGrid}>
          <div className={styles.toolingCard}>
            <Heading as="h3">
              <Translate id="homepage.tooling.editors.title">Editors</Translate>
            </Heading>
            <ul>
              <li><Translate id="homepage.tooling.editors.vscode">VS Code Extension</Translate></li>
              <li><Translate id="homepage.tooling.editors.neovim">Neovim Plugin</Translate></li>
              <li><Translate id="homepage.tooling.editors.lsp">Language Server (LSP)</Translate></li>
            </ul>
          </div>

          <div className={styles.toolingCard}>
            <Heading as="h3">
              <Translate id="homepage.tooling.typeCheckers.title">Type Checkers</Translate>
            </Heading>
            <ul>
              <li><Translate id="homepage.tooling.typeCheckers.steep">Steep</Translate></li>
              <li><Translate id="homepage.tooling.typeCheckers.rubyLsp">Ruby LSP</Translate></li>
              <li><Translate id="homepage.tooling.typeCheckers.sorbet">Sorbet (via RBS)</Translate></li>
            </ul>
          </div>

          <div className={styles.toolingCard}>
            <Heading as="h3">
              <Translate id="homepage.tooling.ecosystem.title">Ruby Ecosystem</Translate>
            </Heading>
            <ul>
              <li><Translate id="homepage.tooling.ecosystem.rbs">RBS Compatible</Translate></li>
              <li><Translate id="homepage.tooling.ecosystem.ruby">Any Ruby version</Translate></li>
              <li><Translate id="homepage.tooling.ecosystem.gems">All gems work</Translate></li>
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
      title={translate({id: 'homepage.layout.title', message: 'Type-safe Ruby'})}
      description={translate({id: 'homepage.layout.description', message: 'T-Ruby: TypeScript-style type system for Ruby. Write .trb files with type annotations, compile to standard .rb files.'})}>
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
