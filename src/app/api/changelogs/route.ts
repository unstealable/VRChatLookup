import { NextRequest, NextResponse } from 'next/server'
import { readdir, readFile, stat } from 'fs/promises'
import { join } from 'path'
import matter from 'gray-matter'
import { renderMarkdown } from '@/lib/markdown'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const sort = searchParams.get('sort') // 'newest' or 'oldest'
    
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
        const stats = await stat(filePath)
        const { data, content: markdownContent } = matter(content)
        
        // Use file creation date, but validate frontmatter date if it exists
        let fileDate = stats.birthtime
        if (data.date) {
          const frontmatterDate = new Date(data.date)
          const today = new Date()
          // Only use frontmatter date if it's not in the future
          if (frontmatterDate <= today) {
            fileDate = frontmatterDate
          }
        }
        
        return {
          id: file.replace('.md', ''),
          title: data.title || 'Untitled',
          date: fileDate.toISOString(),
          version: data.version,
          author: data.author || 'Claude',
          content: renderMarkdown(markdownContent),
          changes: data.changes || [],
          category: data.category || 'general'
        }
      })
    )

    // Filter by category if specified
    let filteredChangelogs = changelogs
    if (category && category !== 'all') {
      filteredChangelogs = changelogs.filter(changelog => changelog.category === category)
    }

    // Sort by date
    const sortOrder = sort === 'oldest' ? 'asc' : 'desc'
    filteredChangelogs.sort((a, b) => {
      const dateA = new Date(a.date)
      const dateB = new Date(b.date)
      
      if (sortOrder === 'asc') {
        return dateA.getTime() - dateB.getTime()
      } else {
        return dateB.getTime() - dateA.getTime()
      }
    })

    return NextResponse.json(filteredChangelogs)
  } catch (error) {
    console.error('Error fetching changelogs:', error)
    return NextResponse.json({ error: 'Failed to fetch changelogs' }, { status: 500 })
  }
}