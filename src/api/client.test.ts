import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { getJson } from './client'
import { getPostsByUser } from './posts'
import { getUsers } from './users'

function mockFetchOnce(body: unknown, ok = true, status = 200) {
  vi.stubGlobal(
    'fetch',
    vi.fn().mockResolvedValue({
      ok,
      status,
      json: () => Promise.resolve(body),
    }),
  )
}

describe('api client', () => {
  beforeEach(() => {
    vi.unstubAllGlobals()
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('returns parsed json on success', async () => {
    mockFetchOnce([{ id: 1, name: 'Ada' }])

    const data = await getJson<{ id: number; name: string }[]>('/users')

    expect(data).toEqual([{ id: 1, name: 'Ada' }])
    expect(fetch).toHaveBeenCalledWith('https://jsonplaceholder.typicode.com/users')
  })

  it('throws when the response is not ok', async () => {
    mockFetchOnce(null, false, 500)

    await expect(getJson('/users')).rejects.toThrow('Request failed with status 500')
  })
})

describe('users api', () => {
  it('fetches the users list', async () => {
    mockFetchOnce([{ id: 1, name: 'Leanne Graham' }])

    const users = await getUsers()

    expect(users).toHaveLength(1)
    expect(users[0].name).toBe('Leanne Graham')
  })
})

describe('posts api', () => {
  it('fetches posts for a given user', async () => {
    mockFetchOnce([{ userId: 1, id: 1, title: 'hi', body: 'hello' }])

    const posts = await getPostsByUser(1)

    expect(fetch).toHaveBeenCalledWith(
      'https://jsonplaceholder.typicode.com/posts?userId=1',
    )
    expect(posts[0].userId).toBe(1)
  })
})
