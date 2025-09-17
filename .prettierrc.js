/**
 * Configuração do Prettier para formatação automática de código
 *
 * O Prettier é uma ferramenta de formatação que garante consistência
 * visual em todo o projeto, aplicando regras automaticamente.
 *
 * @see https://prettier.io/docs/en/configuration.html
 */

const prettierConfig = {
  /**
   * Adiciona ponto e vírgula no final das declarações
   *
   * @example
   * // true:  const name = "João";
   * // false: const name = "João"
   */
  semi: true,

  /**
   * Usa aspas simples em vez de aspas duplas
   *
   * @example
   * // true:  const name = 'João';
   * // false: const name = "João";
   */
  singleQuote: true,

  /**
   * Largura máxima da linha antes de quebrar
   *
   * Linhas mais longas que 100 caracteres serão quebradas
   * automaticamente para melhorar a legibilidade.
   *
   * @default 80
   */
  printWidth: 100,

  /**
   * Número de espaços por nível de indentação
   *
   * Define quantos espaços são usados para cada nível
   * de indentação no código.
   *
   * @default 2
   */
  tabWidth: 2,

  /**
   * Adiciona vírgula no final de listas e objetos
   *
   * @example
   * // "all":  { name: 'João', age: 30, }
   * // "none": { name: 'João', age: 30 }
   * // "es5":  { name: 'João', age: 30 } (apenas onde suportado)
   *
   * Opções: "all" | "es5" | "none"
   */
  trailingComma: 'all',

  /**
   * Adiciona espaço antes dos parênteses das funções
   *
   * @example
   * // true:  function name () { }
   * // false: function name() { }
   *
   * @default false
   * @note Esta opção não é padrão do Prettier, pode causar conflitos
   */
  // spaceBeforeFunctionParen: true, // ← Comentado: não é configuração padrão do Prettier

  /**
   * ========================================
   * Configurações Adicionais Recomendadas
   * ========================================
   */

  /**
   * Usa tabs em vez de espaços para indentação
   *
   * @default false (usa espaços)
   */
  useTabs: false,

  /**
   * Adiciona quebras de linha no final dos arquivos
   *
   * @default true
   */
  endOfLine: 'lf',

  /**
   * Configurações específicas por tipo de arquivo
   */
  overrides: [
    {
      // Markdown: usa 2 espaços e mantém quebras de linha
      files: '*.md',
      options: {
        tabWidth: 2,
        printWidth: 80,
        proseWrap: 'preserve',
      },
    },
    {
      // JSON: usa 2 espaços sem trailing comma
      files: '*.json',
      options: {
        tabWidth: 2,
        trailingComma: 'none',
      },
    },
    {
      // YAML: configuração específica para arquivos YAML
      files: ['*.yml', '*.yaml'],
      options: {
        tabWidth: 2,
        singleQuote: false,
      },
    },
  ],
};

export default prettierConfig;
