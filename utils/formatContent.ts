export function escapeHtml(text: string): string {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

export function formatContent(content: string): string {
  if (!content) return '';
  
  let formatted = content;
  
  // Replace triple backticks with pre tags
  formatted = formatted.replace(/```python([\s\S]*?)```/g, '<pre><code>$1</code></pre>');
  formatted = formatted.replace(/```([\s\S]*?)```/g, '<pre><code>$1</code></pre>');
  
  // Replace single backticks with code tags
  formatted = formatted.replace(/`([^`]+)`/g, '<code>$1</code>');
  
  // Replace **text** with bold
  formatted = formatted.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  
  // Replace numbered lists
  formatted = formatted.replace(/(\d+\.\s+)/g, '<br>$1');
  
  // Handle newlines (avoiding pre tags)
  const parts = formatted.split('<pre>');
  formatted = parts.map((part, i) => {
    if (i === 0) {
      return part.replace(/\n/g, '<br>');
    }
    const [code, ...rest] = part.split('</pre>');
    return '<pre>' + code + '</pre>' + rest.join('</pre>').replace(/\n/g, '<br>');
  }).join('');
  
  return formatted;
}