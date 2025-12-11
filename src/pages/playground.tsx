import React, {useState, useCallback} from 'react';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';
import Translate, {translate} from '@docusaurus/Translate';

import styles from './playground.module.css';

const EXAMPLES = {
  'hello-world': {
    name: translate({id: 'playground.examples.helloWorld', message: 'Hello World'}),
    code: `# hello.trb
def greet(name: String): String
  "Hello, #{name}!"
end

puts greet("World")`,
  },
  'basic-types': {
    name: translate({id: 'playground.examples.basicTypes', message: 'Basic Types'}),
    code: `# Basic type annotations
def add(a: Integer, b: Integer): Integer
  a + b
end

def concat(str1: String, str2: String): String
  str1 + str2
end

def is_valid(flag: Bool): Bool
  !flag
end

result = add(10, 20)
puts result`,
  },
  'union-types': {
    name: translate({id: 'playground.examples.unionTypes', message: 'Union Types'}),
    code: `# Union types allow multiple types
def stringify(value: String | Integer | Float): String
  value.to_s
end

def find_user(id: Integer): User | nil
  # Returns User or nil
  nil
end

# Optional shorthand (same as T | nil)
def get_name(user: User?): String?
  user&.name
end`,
  },
  generics: {
    name: translate({id: 'playground.examples.generics', message: 'Generics'}),
    code: `# Generic functions
def first<T>(arr: Array<T>): T | nil
  arr[0]
end

def map<T, U>(arr: Array<T>, &block: (T) -> U): Array<U>
  arr.map(&block)
end

# Generic class
class Box<T>
  @value: T

  def initialize(value: T): void
    @value = value
  end

  def get: T
    @value
  end
end

box = Box.new(42)
puts box.get`,
  },
  interfaces: {
    name: translate({id: 'playground.examples.interfaces', message: 'Interfaces'}),
    code: `# Define an interface
interface Printable
  def to_string: String
end

interface Comparable<T>
  def compare(other: T): Integer
end

# Implement interface
class User
  implements Printable

  @name: String
  @age: Integer

  def initialize(name: String, age: Integer): void
    @name = name
    @age = age
  end

  def to_string: String
    "User(#{@name}, #{@age})"
  end
end`,
  },
  classes: {
    name: translate({id: 'playground.examples.classes', message: 'Classes'}),
    code: `# Class with type annotations
class Person
  @name: String
  @age: Integer
  @@count: Integer = 0

  def initialize(name: String, age: Integer): void
    @name = name
    @age = age
    @@count += 1
  end

  def greet: String
    "Hi, I'm #{@name}"
  end

  def self.count: Integer
    @@count
  end
end

class Employee < Person
  @department: String

  def initialize(name: String, age: Integer, dept: String): void
    super(name, age)
    @department = dept
  end
end`,
  },
};

type ExampleKey = keyof typeof EXAMPLES;
type OutputTab = 'ruby' | 'rbs' | 'errors';

// Placeholder compile function - will be replaced with WASM or API
async function compileCode(code: string): Promise<{
  ruby: string;
  rbs: string;
  errors: string[];
}> {
  // This is a placeholder implementation
  // In production, this will call WASM module or API endpoint

  // Simple mock transformation (removes type annotations)
  const lines = code.split('\n');
  const rubyLines: string[] = [];
  const rbsLines: string[] = [];

  for (const line of lines) {
    // Very basic transformation for demo purposes
    let rubyLine = line
      // Remove return type annotations
      .replace(/\):\s*\w+(\s*\|\s*\w+)*(\?)?(\s*{|$)/g, ')$3')
      // Remove parameter type annotations
      .replace(/(\w+):\s*([A-Z]\w*(\s*\|\s*\w+)*\??)/g, '$1')
      // Remove generic type parameters
      .replace(/<[A-Z]\w*(,\s*[A-Z]\w*)*>/g, '')
      // Remove interface declarations
      .replace(/^interface\s+.*$/g, '# interface removed')
      // Remove implements
      .replace(/^\s*implements\s+.*$/g, '')
      // Remove instance variable type annotations
      .replace(/@(\w+):\s*([A-Z]\w*(\s*\|\s*\w+)*\??)(\s*=.*)?$/g, '@$1$4');

    rubyLines.push(rubyLine);
  }

  // Generate mock RBS
  const methodMatches = code.matchAll(/def\s+(\w+)(\([^)]*\))?:\s*(\w+(\s*\|\s*\w+)*\??)/g);
  for (const match of methodMatches) {
    const [, name, params, returnType] = match;
    rbsLines.push(`def ${name}: ${params || '()'} -> ${returnType}`);
  }

  return {
    ruby: rubyLines.join('\n'),
    rbs: rbsLines.length > 0 ? rbsLines.join('\n\n') : '# No type signatures generated',
    errors: [],
  };
}

export default function Playground(): JSX.Element {
  const [code, setCode] = useState(EXAMPLES['hello-world'].code);
  const [selectedExample, setSelectedExample] = useState<ExampleKey>('hello-world');
  const [activeTab, setActiveTab] = useState<OutputTab>('ruby');
  const [output, setOutput] = useState({
    ruby: translate({id: 'playground.output.clickToCompile', message: '# Click "Compile" to see output'}),
    rbs: translate({id: 'playground.output.clickToGenerateRbs', message: '# Click "Compile" to generate RBS'}),
    errors: [] as string[],
  });
  const [isCompiling, setIsCompiling] = useState(false);

  const handleExampleChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    const key = e.target.value as ExampleKey;
    setSelectedExample(key);
    setCode(EXAMPLES[key].code);
  }, []);

  const handleCompile = useCallback(async () => {
    setIsCompiling(true);
    try {
      const result = await compileCode(code);
      setOutput(result);
      if (result.errors.length > 0) {
        setActiveTab('errors');
      } else {
        setActiveTab('ruby');
      }
    } catch (error) {
      setOutput({
        ruby: '',
        rbs: '',
        errors: [`Compilation error: ${error}`],
      });
      setActiveTab('errors');
    } finally {
      setIsCompiling(false);
    }
  }, [code]);

  return (
    <Layout
      title={translate({id: 'playground.layout.title', message: 'Playground'})}
      description={translate({id: 'playground.layout.description', message: 'Try T-Ruby in your browser'})}>
      <div className={styles.playground}>
        <div className={styles.header}>
          <Heading as="h1">
            <Translate id="playground.title">Playground</Translate>
          </Heading>
          <p className={styles.subtitle}>
            <Translate id="playground.subtitle">
              Write T-Ruby code and see the compiled output in real-time.
            </Translate>
          </p>
        </div>

        <div className={styles.container}>
          {/* Editor Panel */}
          <div className={styles.panel}>
            <div className={styles.panelHeader}>
              <span className={styles.panelTitle}>
                <Translate id="playground.input.title">Input</Translate>
              </span>
              <div className={styles.panelActions}>
                <select
                  value={selectedExample}
                  onChange={handleExampleChange}
                  className={styles.exampleSelect}
                >
                  {Object.entries(EXAMPLES).map(([key, {name}]) => (
                    <option key={key} value={key}>
                      {name}
                    </option>
                  ))}
                </select>
                <button
                  onClick={handleCompile}
                  disabled={isCompiling}
                  className={styles.compileButton}
                >
                  {isCompiling ? (
                    <Translate id="playground.compile.compiling">Compiling...</Translate>
                  ) : (
                    <Translate id="playground.compile.button">Compile</Translate>
                  )}
                </button>
              </div>
            </div>
            <div className={styles.editorWrapper}>
              <div className={styles.filenameBar}>
                <span>
                  <Translate id="playground.input.filename">example.trb</Translate>
                </span>
              </div>
              <textarea
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className={styles.editor}
                spellCheck={false}
                placeholder={translate({id: 'playground.input.placeholder', message: 'Write your T-Ruby code here...'})}
              />
            </div>
          </div>

          {/* Output Panel */}
          <div className={styles.panel}>
            <div className={styles.panelHeader}>
              <span className={styles.panelTitle}>
                <Translate id="playground.output.title">Output</Translate>
              </span>
              <div className={styles.tabs}>
                <button
                  className={`${styles.tab} ${activeTab === 'ruby' ? styles.tabActive : ''}`}
                  onClick={() => setActiveTab('ruby')}
                >
                  <Translate id="playground.output.ruby">.rb</Translate>
                </button>
                <button
                  className={`${styles.tab} ${activeTab === 'rbs' ? styles.tabActive : ''}`}
                  onClick={() => setActiveTab('rbs')}
                >
                  <Translate id="playground.output.rbs">.rbs</Translate>
                </button>
                <button
                  className={`${styles.tab} ${activeTab === 'errors' ? styles.tabActive : ''} ${output.errors.length > 0 ? styles.tabError : ''}`}
                  onClick={() => setActiveTab('errors')}
                >
                  <Translate id="playground.output.errors">Errors</Translate> {output.errors.length > 0 && `(${output.errors.length})`}
                </button>
              </div>
            </div>
            <div className={styles.editorWrapper}>
              <div className={styles.filenameBar}>
                <span>
                  {activeTab === 'ruby' && 'example.rb'}
                  {activeTab === 'rbs' && 'example.rbs'}
                  {activeTab === 'errors' && (
                    <Translate id="playground.output.compilationErrors">Compilation Errors</Translate>
                  )}
                </span>
              </div>
              <div className={styles.output}>
                {activeTab === 'errors' ? (
                  output.errors.length > 0 ? (
                    <ul className={styles.errorList}>
                      {output.errors.map((error, i) => (
                        <li key={i} className={styles.errorItem}>
                          {error}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className={styles.noErrors}>
                      <Translate id="playground.output.noErrors">No errors</Translate>
                    </p>
                  )
                ) : (
                  <pre className={styles.outputCode}>
                    <code>{activeTab === 'ruby' ? output.ruby : output.rbs}</code>
                  </pre>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className={styles.footer}>
          <p>
            <strong>
              <Translate id="playground.footer.note">
                Note: This playground uses a simplified compiler for demonstration.
                For full functionality, install T-Ruby locally with gem install t-ruby.
              </Translate>
            </strong>
          </p>
        </div>
      </div>
    </Layout>
  );
}
