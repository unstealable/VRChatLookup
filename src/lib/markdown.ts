import { marked } from 'marked'

// Configure marked options
marked.setOptions({
  gfm: true,
  breaks: true
})

export function renderMarkdown(markdown: string): string {
  let html = marked(markdown) as string
  
  // Apply custom styling through string replacement
  html = html.replace(/<h1>/g, '<h1 class="text-3xl font-bold text-gray-900 dark:text-white mt-6 mb-4">')
  html = html.replace(/<h2>/g, '<h2 class="text-2xl font-semibold text-gray-900 dark:text-white mt-6 mb-4">')
  html = html.replace(/<h3>/g, '<h3 class="text-xl font-semibold text-gray-900 dark:text-white mt-6 mb-4">')
  html = html.replace(/<h4>/g, '<h4 class="text-lg font-semibold text-gray-900 dark:text-white mt-6 mb-4">')
  html = html.replace(/<h5>/g, '<h5 class="text-base font-semibold text-gray-900 dark:text-white mt-6 mb-4">')
  html = html.replace(/<h6>/g, '<h6 class="text-sm font-semibold text-gray-900 dark:text-white mt-6 mb-4">')
  
  html = html.replace(/<p>/g, '<p class="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">')
  html = html.replace(/<ul>/g, '<ul class="list-disc list-inside text-gray-700 dark:text-gray-300 mb-4 space-y-2">')
  html = html.replace(/<ol>/g, '<ol class="list-decimal list-inside text-gray-700 dark:text-gray-300 mb-4 space-y-2">')
  html = html.replace(/<li>/g, '<li class="ml-4">')
  
  html = html.replace(/<pre><code>/g, '<pre class="bg-gray-100 dark:bg-gray-800 rounded-lg p-4 overflow-x-auto mb-4"><code class="text-sm font-mono text-gray-800 dark:text-gray-200">')
  html = html.replace(/<code>/g, '<code class="bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 px-2 py-1 rounded text-sm font-mono">')
  
  html = html.replace(/<a /g, '<a class="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 underline" ')
  html = html.replace(/<blockquote>/g, '<blockquote class="border-l-4 border-blue-500 pl-4 py-2 my-4 bg-blue-50 dark:bg-blue-900/20 text-gray-700 dark:text-gray-300">')
  html = html.replace(/<strong>/g, '<strong class="font-semibold text-gray-900 dark:text-white">')
  html = html.replace(/<em>/g, '<em class="italic text-gray-700 dark:text-gray-300">')
  
  return html
}