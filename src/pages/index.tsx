import type {ReactNode, ComponentType} from 'react';
import {useState} from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Translate, {translate} from '@docusaurus/Translate';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';
import CodeBlock from '@theme/CodeBlock';
import {Shield, Zap, FileText, Code2, Wrench, RefreshCw, Copy, Check} from 'lucide-react';

import styles from './index.module.css';

function HeroBanner() {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText('gem install t-ruby');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <header className={styles.heroBanner}>
      <div className="container">
        <div className={styles.badges}>
          <span className="badge badge--experimental">
            <Translate id="homepage.hero.badge">Experimental</Translate>
          </span>
          <a
            href="https://github.com/type-ruby/t-ruby"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.githubBadge}>
            <img
              src="https://img.shields.io/github/stars/type-ruby/t-ruby?style=social"
              alt="GitHub stars"
            />
          </a>
        </div>
        <Heading as="h1" className={styles.heroTitle}>
          T-Ruby is Ruby<br />
          <span className={styles.heroHighlight}>with syntax for types.</span>
        </Heading>
        <p className={styles.heroSubtitle}>
          <Translate id="homepage.hero.subtitle2">
            Write .trb files with type annotations. Compile to standard .rb and .rbs files. Just like TypeScript.
          </Translate>
        </p>

        <div className={styles.installCommand}>
          <span className={styles.dollar}>$</span>
          <code>gem install t-ruby</code>
          <button
            onClick={handleCopy}
            className={styles.copyButton}
            aria-label={copied ? 'Copied!' : 'Copy to clipboard'}>
            {copied ? <Check size={16} /> : <Copy size={16} />}
          </button>
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

interface FeatureItem {
  title: string;
  Icon: ComponentType<{size?: number; className?: string}>;
  description: string;
}

function FeaturesSection() {
  const FEATURES: FeatureItem[] = [
    {
      title: translate({id: 'homepage.features.typeSafety.title', message: 'Type Safety'}),
      Icon: Shield,
      description: translate({id: 'homepage.features.typeSafety.description', message: 'Catch type errors at compile time, not runtime. Add types gradually to your existing Ruby code.'}),
    },
    {
      title: translate({id: 'homepage.features.zeroRuntime.title', message: 'Zero Runtime'}),
      Icon: Zap,
      description: translate({id: 'homepage.features.zeroRuntime.description', message: 'Types are erased during compilation. The output is pure Ruby that runs anywhere.'}),
    },
    {
      title: translate({id: 'homepage.features.rbsGeneration.title', message: 'RBS Generation'}),
      Icon: FileText,
      description: translate({id: 'homepage.features.rbsGeneration.description', message: 'Automatically generates .rbs signature files for integration with Steep, Ruby LSP, and more.'}),
    },
    {
      title: translate({id: 'homepage.features.tsInspired.title', message: 'TypeScript-inspired'}),
      Icon: Code2,
      description: translate({id: 'homepage.features.tsInspired.description', message: 'Familiar syntax for TypeScript developers. Union types, generics, interfaces, and more.'}),
    },
    {
      title: translate({id: 'homepage.features.greatDX.title', message: 'Great DX'}),
      Icon: Wrench,
      description: translate({id: 'homepage.features.greatDX.description', message: 'VS Code and Neovim support with syntax highlighting, LSP, and real-time error reporting.'}),
    },
    {
      title: translate({id: 'homepage.features.gradualAdoption.title', message: 'Gradual Adoption'}),
      Icon: RefreshCw,
      description: translate({id: 'homepage.features.gradualAdoption.description', message: 'Start with one file. Mix typed and untyped code. Migrate at your own pace.'}),
    },
  ];

  return (
    <section className={styles.features}>
      <div className="container">
        <div className={styles.featuresGrid}>
          {FEATURES.map((feature, idx) => (
            <div key={idx} className={styles.featureCard}>
              <feature.Icon size={32} className={styles.featureIconSvg} />
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

type TabKey = 'input' | 'output' | 'rbs';

const TAB_CONFIG: {key: TabKey; filename: string; labelId: string; defaultLabel: string}[] = [
  {key: 'input', filename: 'hello.trb', labelId: 'homepage.codeShowcase.input', defaultLabel: 'Input'},
  {key: 'output', filename: 'hello.rb', labelId: 'homepage.codeShowcase.output', defaultLabel: 'Output'},
  {key: 'rbs', filename: 'hello.rbs', labelId: 'homepage.codeShowcase.generated', defaultLabel: 'Generated'},
];

function CodeShowcase() {
  const [activeTab, setActiveTab] = useState<TabKey>('input');

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

        <div className={styles.codeTabs}>
          {TAB_CONFIG.map(({key, filename, labelId, defaultLabel}) => (
            <button
              key={key}
              className={clsx(styles.codeTab, activeTab === key && styles.codeTabActive)}
              onClick={() => setActiveTab(key)}>
              <span className={styles.codeTabFilename}>{filename}</span>
              <span className={styles.codeTabLabel}>
                <Translate id={labelId}>{defaultLabel}</Translate>
              </span>
            </button>
          ))}
        </div>

        <div className={styles.codeTabContent}>
          <CodeBlock language="ruby">
            {CODE_EXAMPLES[activeTab]}
          </CodeBlock>
        </div>

        <div className={styles.tryItWrapper}>
          <Link to="/playground" className={styles.tryItButton}>
            <Translate id="homepage.codeShowcase.tryIt">Try it in Playground →</Translate>
          </Link>
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
                <Translate id="homepage.quickStart.step1.title">Initialize project</Translate>
              </Heading>
              <CodeBlock language="bash">
{`gem install t-ruby
trc --init`}
              </CodeBlock>
            </div>
          </div>

          <div className={styles.step}>
            <div className={styles.stepNumber}>2</div>
            <div className={styles.stepContent}>
              <Heading as="h3">
                <Translate id="homepage.quickStart.step2.title">Start watch mode</Translate>
              </Heading>
              <CodeBlock language="bash">
                trc --watch
              </CodeBlock>
            </div>
          </div>

          <div className={styles.step}>
            <div className={styles.stepNumber}>3</div>
            <div className={styles.stepContent}>
              <Heading as="h3">
                <Translate id="homepage.quickStart.step3.title">Write typed Ruby</Translate>
              </Heading>
              <CodeBlock language="ruby" title="src/hello.trb">
{`def greet(name: String): String
  "Hello, #{name}!"
end`}
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
