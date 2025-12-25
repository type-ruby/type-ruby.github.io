import type {ReactNode, ComponentType} from 'react';
import {useState} from 'react';
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
        <p
          className={styles.heroSubtitle}
          dangerouslySetInnerHTML={{
            __html: translate({
              id: 'homepage.hero.subtitle2',
              message: 'Write .trb files with type annotations.<br />Compile to standard .rb and .rbs files.<br />Just like TypeScript.',
            }),
          }}
        />

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

function VersionBanner() {
  return (
    <div className={styles.versionBanner}>
      <Link to="/docs/project/changelog">
        <Translate id="homepage.hero.versionNotice" values={{version: '0.0.39'}}>
          {'T-Ruby {version} is now available'}
        </Translate>
      </Link>
    </div>
  );
}

function WhatIsTRuby() {
  return (
    <section className={styles.whatIs}>
      <div className="container">
        <Heading as="h2" className={styles.whatIsTitle}>
          What is T-Ruby?
        </Heading>
        <div className={styles.whatIsGrid}>
          <div className={styles.whatIsItem}>
            <h3>Ruby and More</h3>
            <p
              dangerouslySetInnerHTML={{
                __html: translate({
                  id: 'homepage.whatIs.rubyMore.description',
                  message: 'T-Ruby extends Ruby with additional syntax. <strong>This means static types and compile time.</strong>',
                }),
              }}
            />
          </div>
          <div className={styles.whatIsItem}>
            <h3>A Result You Can Trust</h3>
            <p
              dangerouslySetInnerHTML={{
                __html: translate({
                  id: 'homepage.whatIs.trust.description',
                  message: 'T-Ruby code converts to Ruby and RBS, <strong>guaranteeing compatibility with the entire Ruby and RBS ecosystem.</strong>',
                }),
              }}
            />
          </div>
          <div className={styles.whatIsItem}>
            <h3>Safety at Scale</h3>
            <p
              dangerouslySetInnerHTML={{
                __html: translate({
                  id: 'homepage.whatIs.scale.description',
                  message: 'Ensure type safety for your Ruby products with T-Ruby. <strong>Stay safe even at large scale.</strong>',
                }),
              }}
            />
          </div>
        </div>
      </div>
    </section>
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
end`,
  output: `# hello.rb
def greet(name)
  "Hello, #{name}!"
end

def add(a, b)
  a + b
end`,
  rbs: `# hello.rbs
def greet: (name: String) -> String

def add: (a: Integer, b: Integer) -> Integer
`,
};

function CodeShowcase() {
  return (
    <section className={styles.codeShowcase}>
      <div className="container">
        <Heading as="h2" className={styles.sectionTitle}>
          <Translate id="homepage.codeShowcase.title">Example</Translate>
        </Heading>
        <p className={styles.sectionSubtitle}>
          <Translate id="homepage.codeShowcase.subtitle">
            Write typed Ruby, compile to standard Ruby with generated type signatures.
          </Translate>
        </p>

          <div className={styles.exampleWrapper}>
              <div>
                  <div className={styles.codePanel}>
                      <div className={styles.codePanelHeader}>
                          <span className={styles.codePanelFilename}>hello.trb</span>
                          <span className={styles.codePanelLabel}>
                            <Translate id="homepage.codeShowcase.input">Input</Translate>
                          </span>
                      </div>
                      <CodeBlock language="ruby">{CODE_EXAMPLES.input}</CodeBlock>
                  </div>
              </div>

              <div className={styles.codeArrowLeft}>→</div>

              <div>
                  <div>
                      {/* hello.rb (출력) */}
                      <div className={styles.codePanelWithArrow}>
                          <div className={styles.codePanel}>
                              <div className={styles.codePanelHeader}>
                                  <span className={styles.codePanelFilename}>hello.rb</span>
                                  <span className={styles.codePanelLabel}>
                                      <Translate id="homepage.codeShowcase.generated">Generated</Translate>
                                  </span>
                              </div>
                              <CodeBlock language="ruby">{CODE_EXAMPLES.output}</CodeBlock>
                          </div>
                      </div>
                  </div>

                  <div className={styles.codePlus}>+</div>

                  <div>
                      {/* hello.rbs (생성) */}
                      <div className={styles.codePanelWithArrow}>
                          <div className={styles.codePanel}>
                              <div className={styles.codePanelHeader}>
                                  <span className={styles.codePanelFilename}>hello.rbs</span>
                                  <span className={styles.codePanelLabel}>
                                      <Translate id="homepage.codeShowcase.generated">Generated</Translate>
                                  </span>
                              </div>
                              <CodeBlock language="ruby">{CODE_EXAMPLES.rbs}</CodeBlock>
                          </div>
                      </div>
                  </div>
              </div>
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

type ExistingMethodKey = 'sorbet' | 'rbs' | 'typeprof' | 'others';

interface ExistingMethodData {
  name: string;
  usage: string;
  usageCode?: string;
  limitations?: string[];
  comparison?: string;
}

const EXISTING_METHODS_BY_LOCALE: Record<string, Record<ExistingMethodKey, ExistingMethodData>> = {
  en: {
    sorbet: {
      name: 'Sorbet',
      usage: 'A static type checker for Ruby developed by Stripe. Uses sig blocks to declare types on methods.',
      usageCode: `# typed: strict
require 'sorbet-runtime'

class Greeter
  extend T::Sig

  sig { params(name: String).returns(String) }
  def greet(name)
    "Hello, #{name}!"
  end
end`,
      limitations: [
        'Requires runtime dependency (sorbet-runtime gem)',
        'Types must be written separately in sig blocks, like comments above function code.',
        'Requires learning sig block\'s unique DSL syntax.',
      ],
      comparison: 'T-Ruby uses inline types like TypeScript without runtime dependencies, and generates standard RBS files.',
    },
    rbs: {
      name: 'RBS',
      usage: 'The official type definition language supported since Ruby 3.0. Types are defined separately in .rbs files.',
      usageCode: `# greeter.rbs (separate file)
class Greeter
  def greet: (String name) -> String
end

# greeter.rb (implementation file)
class Greeter
  def greet(name)
    "Hello, #{name}!"
  end
end`,
      limitations: [
        'Types and implementation are separated into different files',
        'Like .d.ts type definition files, requires manual synchronization maintenance.',
      ],
      comparison: 'T-Ruby writes types and implementation together in a single .trb file, and auto-generates .rb and .rbs files.',
    },
    typeprof: {
      name: 'TypeProf',
      usage: 'A tool that analyzes Ruby code to infer types and generate RBS files.',
      usageCode: `# greeter.rb
class Greeter
  def greet(name)
    "Hello, #{name}!"
  end
end

Greeter.new.greet("World")

# Run: typeprof greeter.rb
# Generated RBS:
# class Greeter
#   def greet: (String) -> String
# end`,
      limitations: [
        'Inference-based, so accuracy is limited',
        'Type inference can fail on complex code',
        'Cannot explicitly declare types',
      ],
      comparison: 'T-Ruby allows developers to explicitly define and use even complex types, guaranteeing accurate type information. It also supports code-level analysis and inference through abstract syntax trees.',
    },
    others: {
      name: 'And more...',
      usage: 'To automate RBS writing while not breaking Ruby code,\nvarious approaches are being tried such as defining types through comments like RDoc.\n\nMost of these attempts tried to solve this problem within Ruby\'s existing syntactic framework.\n(Though some, like Crystal, have moved to entirely new languages)\n\nBut this way, it becomes a zero-sum game where gaining one thing means losing another.\n\nWhat if we break the mold?\n\nJust as TS enhanced JS, that\'s why we started T-Ruby.',
    },
  },
  ko: {
    sorbet: {
      name: 'Sorbet',
      usage: 'Stripe에서 개발한 Ruby용 정적 타입 체커입니다. sig 블록을 사용해 메서드에 타입을 선언합니다.',
      usageCode: `# typed: strict
require 'sorbet-runtime'

class Greeter
  extend T::Sig

  sig { params(name: String).returns(String) }
  def greet(name)
    "Hello, #{name}!"
  end
end`,
      limitations: [
        '런타임 의존성 필요 (sorbet-runtime gem)',
        '실제 함수 코드와 별도로 주석처럼 sig 블록으로 타입을 작성해야 합니다.',
        'sig 블록의 독자적인 DSL 문법을 익혀야 합니다.',
      ],
      comparison: 'T-Ruby는 런타임 의존성 없이 TypeScript처럼 인라인 타입을 사용하며, 표준 RBS 파일을 생성합니다.',
    },
    rbs: {
      name: 'RBS',
      usage: 'Ruby 3.0부터 공식 지원되는 타입 정의 언어입니다. .rbs 파일에 별도로 타입을 정의합니다.',
      usageCode: `# greeter.rbs (별도 파일)
class Greeter
  def greet: (String name) -> String
end

# greeter.rb (구현 파일)
class Greeter
  def greet(name)
    "Hello, #{name}!"
  end
end`,
      limitations: [
        '타입과 구현이 별도 파일로 분리됨',
        '.d.ts 와 같은 타입 정의파일이나, 매뉴얼한 동기화 유지보수가 필요합니다.',
      ],
      comparison: 'T-Ruby는 하나의 .trb 파일에서 타입과 구현을 함께 작성하고, .rb와 .rbs를 자동 생성합니다.',
    },
    typeprof: {
      name: 'TypeProf',
      usage: 'Ruby 코드를 분석해 타입을 추론하고 RBS 파일을 생성하는 도구입니다.',
      usageCode: `# greeter.rb
class Greeter
  def greet(name)
    "Hello, #{name}!"
  end
end

Greeter.new.greet("World")

# 실행: typeprof greeter.rb
# 출력된 RBS:
# class Greeter
#   def greet: (String) -> String
# end`,
      limitations: [
        '추론 기반이라 정확도가 제한적',
        '복잡한 코드에서 타입 추론 실패 가능',
        '명시적 타입 선언 불가',
      ],
      comparison: 'T-Ruby는 복잡한 타입이라도 개발자가 명시적으로 정의하고 사용 할 수 있어 정확한 타입 정보를 보장합니다. 추상 구문 트리를 통한 코드레벨 분석과 추론 역시 지원합니다.',
    },
    others: {
      name: '그 밖에도...',
      usage: 'RBS 작성을 자동화하는 동시에 Ruby의 코드를 해치지 않기 위해\nRDoc과 같은 주석을 통해 정의하는 방식 등\n매우 다양한 타입 정의 시도가 새롭게 시도되고 있습니다.\n\n그것들은 대부분 기존 Ruby의 문법적 틀 안에서 이 문제를 해결하고자 했습니다.\n(Crystal과 같이 완전히 새로운 언어로 나아간 경우도 있지만)\n\n하지만 그렇게 하면 결국 하나를 얻으면 하나를 잃는 제로-섬 게임을 반복하게 됩니다.\n\n틀을 깨면 해결이 될 수 있을까요?\n\nJS를 TS가 보강한 것처럼, 그래서 T-Ruby를 시작했습니다.',
    },
  },
  ja: {
    sorbet: {
      name: 'Sorbet',
      usage: 'Stripeが開発したRuby用静的型チェッカーです。sigブロックを使用してメソッドに型を宣言します。',
      usageCode: `# typed: strict
require 'sorbet-runtime'

class Greeter
  extend T::Sig

  sig { params(name: String).returns(String) }
  def greet(name)
    "Hello, #{name}!"
  end
end`,
      limitations: [
        'ランタイム依存性が必要（sorbet-runtime gem）',
        '実際の関数コードとは別に、コメントのようにsigブロックで型を書く必要があります。',
        'sigブロック独自のDSL構文を学ぶ必要があります。',
      ],
      comparison: 'T-Rubyはランタイム依存性なしでTypeScriptのようにインライン型を使用し、標準RBSファイルを生成します。',
    },
    rbs: {
      name: 'RBS',
      usage: 'Ruby 3.0から公式サポートされている型定義言語です。.rbsファイルに別途型を定義します。',
      usageCode: `# greeter.rbs（別ファイル）
class Greeter
  def greet: (String name) -> String
end

# greeter.rb（実装ファイル）
class Greeter
  def greet(name)
    "Hello, #{name}!"
  end
end`,
      limitations: [
        '型と実装が別々のファイルに分離される',
        '.d.tsのような型定義ファイルと同様、手動での同期メンテナンスが必要です。',
      ],
      comparison: 'T-Rubyは1つの.trbファイルで型と実装を一緒に書き、.rbと.rbsを自動生成します。',
    },
    typeprof: {
      name: 'TypeProf',
      usage: 'Rubyコードを分析して型を推論し、RBSファイルを生成するツールです。',
      usageCode: `# greeter.rb
class Greeter
  def greet(name)
    "Hello, #{name}!"
  end
end

Greeter.new.greet("World")

# 実行: typeprof greeter.rb
# 出力されたRBS:
# class Greeter
#   def greet: (String) -> String
# end`,
      limitations: [
        '推論ベースのため精度に限界がある',
        '複雑なコードでは型推論が失敗する可能性がある',
        '明示的な型宣言ができない',
      ],
      comparison: 'T-Rubyは複雑な型であっても開発者が明示的に定義して使用でき、正確な型情報を保証します。抽象構文木を通じたコードレベルの分析と推論もサポートします。',
    },
    others: {
      name: 'その他にも...',
      usage: 'RBS記述を自動化しながらRubyのコードを壊さないために、\nRDocのようなコメントを通じて定義する方法など\n非常に多様な型定義の試みが行われています。\n\nそれらのほとんどは既存のRubyの文法的な枠組みの中でこの問題を解決しようとしました。\n（Crystalのように完全に新しい言語に進んだ場合もありますが）\n\nしかしそうすると、結局1つを得れば1つを失うゼロサムゲームを繰り返すことになります。\n\n枠を壊せば解決できるでしょうか？\n\nJSをTSが補強したように、だからT-Rubyを始めました。',
    },
  },
};

function ExistingMethodsSection() {
  const {i18n: {currentLocale}} = useDocusaurusContext();
  const [activeTab, setActiveTab] = useState<ExistingMethodKey>('sorbet');

  // 현재 로케일에 맞는 데이터 사용, 없으면 영어로 폴백
  const EXISTING_METHODS = EXISTING_METHODS_BY_LOCALE[currentLocale] || EXISTING_METHODS_BY_LOCALE.en;
  const method = EXISTING_METHODS[activeTab];

  return (
    <section className={styles.existingMethods}>
      <div className="container">
        <Heading as="h2" className={styles.sectionTitle}>
          <Translate id="homepage.existingMethods.title">Existing Methods</Translate>
        </Heading>
        <p className={styles.sectionSubtitle}>
          <Translate id="homepage.existingMethods.subtitle">
            Compare with existing Ruby typing solutions and see why T-Ruby is different.
          </Translate>
        </p>

        <div className={styles.methodTabs}>
          {(Object.keys(EXISTING_METHODS) as ExistingMethodKey[]).map((key) => (
            <button
              key={key}
              className={`${styles.methodTab} ${activeTab === key ? styles.methodTabActive : ''}`}
              onClick={() => setActiveTab(key)}>
              {EXISTING_METHODS[key].name}
            </button>
          ))}
        </div>

        <div className={styles.methodContent}>
          <div className={styles.methodUsage}>
            {method.usageCode && (
              <Heading as="h3">
                <Translate id="homepage.existingMethods.howToUse">How it works</Translate>
              </Heading>
            )}
            <p style={{whiteSpace: 'pre-line'}}>{method.usage}</p>
            {method.usageCode && (
              <CodeBlock language="ruby">{method.usageCode}</CodeBlock>
            )}
          </div>

          {method.limitations && method.limitations.length > 0 && (
            <div className={styles.methodLimitations}>
              <Heading as="h3">
                <Translate id="homepage.existingMethods.limitations">Limitations</Translate>
              </Heading>
              <ul>
                {method.limitations.map((limitation, idx) => (
                  <li key={idx}>{limitation}</li>
                ))}
              </ul>
            </div>
          )}

          {method.comparison && (
            <div className={styles.methodComparison}>
              <Heading as="h3">
                <Translate id="homepage.existingMethods.vsTRuby">T-Ruby Approach</Translate>
              </Heading>
              <p style={{whiteSpace: 'pre-line'}}>{method.comparison}</p>
            </div>
          )}
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
              <li><Translate id="homepage.tooling.editors.jetbrains">JetBrains Plugin</Translate></li>
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

function ContributeSection() {
  return (
    <section className={styles.contribute}>
      <div className="container">
        <Heading as="h2" className={styles.sectionTitle}>
          <Translate id="homepage.contribute.title">Join the Journey</Translate>
        </Heading>
        <p className={styles.sectionSubtitle}>
          <Translate id="homepage.contribute.subtitle">
            T-Ruby is an open source project. Your contribution makes a difference.
          </Translate>
          <br />
          <Translate id="homepage.contribute.experimental">
            It's still experimental. The core compiler works, but there's much to improve.
          </Translate>
          <br />
          <Translate id="homepage.contribute.feedback">
            Feedback and suggestions are always welcome!
          </Translate>
        </p>

        <div className={styles.contributeGrid}>
          <a
            href="https://github.com/type-ruby/t-ruby"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.contributeCard}>
            <div className={styles.contributeIcon}>⭐</div>
            <Heading as="h3">
              <Translate id="homepage.contribute.star.title">Star on GitHub</Translate>
            </Heading>
            <p>
              <Translate id="homepage.contribute.star.description">
                Show your support and help others discover T-Ruby
              </Translate>
            </p>
          </a>

          <a
            href="https://github.com/type-ruby/t-ruby/issues"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.contributeCard}>
            <div className={styles.contributeIcon}>💬</div>
            <Heading as="h3">
              <Translate id="homepage.contribute.issue.title">Report Issues</Translate>
            </Heading>
            <p>
              <Translate id="homepage.contribute.issue.description">
                Found a bug or have a feature request? Let us know
              </Translate>
            </p>
          </a>

          <a
            href="https://github.com/type-ruby/t-ruby/pulls"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.contributeCard}>
            <div className={styles.contributeIcon}>🔧</div>
            <Heading as="h3">
              <Translate id="homepage.contribute.pr.title">Contribute Code</Translate>
            </Heading>
            <p>
              <Translate id="homepage.contribute.pr.description">
                Submit a pull request and help build the future of typed Ruby
              </Translate>
            </p>
          </a>
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
      <VersionBanner />
      <WhatIsTRuby />
      <main>
        {/* <FeaturesSection /> */}
        <CodeShowcase />
        <ExistingMethodsSection />
        <QuickStartSection />
        <ToolingSection />
        <ContributeSection />
      </main>
    </Layout>
  );
}
