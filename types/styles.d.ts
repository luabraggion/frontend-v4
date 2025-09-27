/**
 * Declaração de tipos para arquivos CSS
 *
 * Este arquivo permite que o TypeScript reconheça arquivos CSS
 * quando eles são importados diretamente nos arquivos .tsx/.ts
 */
declare module '*.css' {
  const content: { [className: string]: string };
  export default content;
}
