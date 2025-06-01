export const initializeMermaid = () => {
  mermaid.initialize({
    startOnLoad: false,
    theme: 'neutral',
    securityLevel: 'loose',
    htmlLabels: true,
    flowchart: {
      htmlLabels: true,
      curve: 'basis',
      nodeSpacing: 40,
      rankSpacing: 60,
      padding: 20,
      defaultRenderer: 'dagre-d3',
      useMaxWidth: true
    }
  });
};
