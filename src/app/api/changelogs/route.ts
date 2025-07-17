import { NextResponse } from 'next/server'
import { readdir, readFile } from 'fs/promises'
import { join } from 'path'
import matter from 'gray-matter'
import { renderMarkdown } from '@/lib/markdown'

export async function GET() {
  try {
    const changelogDir = join(process.cwd(), 'changelogs')
    
    // Create directory if it doesn't exist
    try {
      await readdir(changelogDir)
    } catch {
      return NextResponse.json([])
    }

    const files = await readdir(changelogDir)
    const markdownFiles = files.filter(file => file.endsWith('.md'))
    
    const changelogs = await Promise.all(
      markdownFiles.map(async (file) => {
        const filePath = join(changelogDir, file)
        const content = await readFile(filePath, 'utf8')
        const { data, content: markdownContent } = matter(content)
        
        return {
          id: file.replace('.md', ''),
          title: data.title || 'Untitled',
          date: data.date || new Date().toISOString(),
          version: data.version,
          author: data.author || 'Claude',
          content: renderMarkdown(markdownContent),
          changes: data.changes || []
        }
      })
    )

    // Sort by date (newest first) - year, month, day
    changelogs.sort((a, b) => {
      const dateA = new Date(a.date)
      const dateB = new Date(b.date)
      
      // Primary sort: year (desc)
      if (dateA.getFullYear() !== dateB.getFullYear()) {
        return dateB.getFullYear() - dateA.getFullYear()
      }
      
      // Secondary sort: month (desc)
      if (dateA.getMonth() !== dateB.getMonth()) {
        return dateB.getMonth() - dateA.getMonth()
      }
      
      // Tertiary sort: day (desc)
      return dateB.getDate() - dateA.getDate()
    })

    return NextResponse.json(changelogs)
  } catch (error) {
    console.error('Error fetching changelogs:', error)
    return NextResponse.json({ error: 'Failed to fetch changelogs' }, { status: 500 })
  }
}