'use client'

import { useTranslations } from 'next-intl'
import { useState, useMemo, useCallback } from 'react'
import AdBanner from '@/components/AdBanner'

type WordCategory = 'all' | 'nouns' | 'verbs' | 'adjectives' | 'animals' | 'colors'

const WORD_BANK: Record<WordCategory, string[]> = {
  all: [
    'time', 'year', 'people', 'way', 'day', 'man', 'woman', 'child', 'world', 'life',
    'hand', 'part', 'place', 'case', 'week', 'company', 'system', 'program', 'question',
    'government', 'number', 'night', 'point', 'home', 'water', 'room', 'mother', 'area',
    'money', 'story', 'fact', 'month', 'lot', 'right', 'study', 'book', 'eye', 'job',
    'word', 'business', 'issue', 'side', 'kind', 'head', 'house', 'service', 'friend',
    'father', 'power', 'hour', 'game', 'line', 'end', 'member', 'law', 'car', 'city',
    'community', 'name', 'president', 'team', 'minute', 'idea', 'kid', 'body', 'back',
    'parent', 'face', 'level', 'door', 'door', 'student', 'corner', 'party', 'market',
    'real', 'change', 'create', 'develop', 'follow', 'grow', 'help', 'include', 'involve',
    'large', 'great', 'high', 'important', 'long', 'old', 'small', 'different', 'early',
    'good', 'happy', 'beautiful', 'strong', 'fast', 'new', 'next', 'young', 'bright',
    'build', 'work', 'live', 'play', 'run', 'see', 'seem', 'take', 'want', 'need',
  ],
  nouns: [
    'time', 'year', 'people', 'way', 'day', 'man', 'woman', 'child', 'world', 'life',
    'hand', 'part', 'place', 'case', 'week', 'company', 'system', 'program', 'question',
    'government', 'number', 'night', 'point', 'home', 'water', 'room', 'mother', 'area',
    'money', 'story', 'fact', 'month', 'lot', 'right', 'study', 'book', 'eye', 'job',
    'word', 'business', 'issue', 'side', 'kind', 'head', 'house', 'service', 'friend',
    'father', 'power', 'hour', 'game', 'line', 'end', 'member', 'law', 'car', 'city',
    'community', 'name', 'president', 'team', 'minute', 'idea', 'kid', 'body', 'back',
    'parent', 'face', 'level', 'door', 'student', 'corner', 'party', 'market', 'purpose',
    'forest', 'bridge', 'mountain', 'river', 'ocean', 'village', 'garden', 'castle',
    'planet', 'window', 'garden', 'kitchen', 'garden', 'school', 'market', 'church',
  ],
  verbs: [
    'create', 'develop', 'follow', 'grow', 'help', 'include', 'involve', 'build',
    'work', 'live', 'play', 'run', 'see', 'seem', 'take', 'want', 'need', 'know',
    'think', 'make', 'use', 'find', 'give', 'tell', 'ask', 'show', 'try', 'call',
    'keep', 'start', 'bring', 'go', 'write', 'speak', 'read', 'allow', 'add', 'become',
    'believe', 'break', 'bring', 'buy', 'carry', 'catch', 'choose', 'come', 'connect',
    'consider', 'contain', 'continue', 'count', 'cover', 'cut', 'decide', 'describe',
    'discover', 'draw', 'drive', 'eat', 'expect', 'explain', 'express', 'extend',
    'feel', 'fill', 'finish', 'fly', 'forget', 'form', 'happen', 'hear', 'hold',
    'hope', 'imagine', 'improve', 'introduce', 'join', 'jump', 'learn', 'leave',
    'lie', 'like', 'listen', 'look', 'lose', 'love', 'mark', 'match', 'measure',
    'meet', 'move', 'name', 'notice', 'offer', 'open', 'order', 'pass', 'pay',
    'perform', 'pick', 'plan', 'plant', 'play', 'point', 'practice', 'prepare',
    'present', 'prevent', 'produce', 'promise', 'protect', 'provide', 'pull',
    'push', 'raise', 'reach', 'realize', 'receive', 'recognize', 'record',
    'reduce', 'reflect', 'refuse', 'relate', 'release', 'remain', 'remove',
  ],
  adjectives: [
    'large', 'great', 'high', 'important', 'long', 'old', 'small', 'different', 'early',
    'good', 'happy', 'beautiful', 'strong', 'fast', 'new', 'next', 'young', 'bright',
    'able', 'active', 'actual', 'advanced', 'afraid', 'alive', 'allowed', 'amazing',
    'angry', 'anxious', 'appropriate', 'available', 'aware', 'bad', 'basic', 'best',
    'better', 'big', 'bitter', 'blank', 'blind', 'bold', 'brave', 'brief', 'broad',
    'broken', 'busy', 'calm', 'capable', 'careful', 'cheap', 'clean', 'clear',
    'clever', 'close', 'cold', 'common', 'complete', 'complex', 'constant', 'cool',
    'correct', 'crazy', 'creative', 'curious', 'current', 'cute', 'daily', 'dangerous',
    'dear', 'deep', 'definite', 'delicate', 'delicious', 'delighted', 'dense', 'direct',
    'dirty', 'dry', 'due', 'dull', 'dynamic', 'eager', 'eastern', 'easy', 'effective',
    'efficient', 'elaborate', 'eligible', 'empty', 'encouraging', 'endless', 'energetic',
    'enormous', 'entire', 'equal', 'essential', 'even', 'eventual', 'exact', 'excellent',
    'excited', 'exciting', 'existing', 'exotic', 'expected', 'expensive', 'explicit',
    'extensive', 'extra', 'extreme', 'fair', 'false', 'familiar', 'famous', 'fancy',
    'fantastic', 'far', 'fascinating', 'fast', 'fat', 'favorable', 'favorite', 'fearless',
    'female', 'few', 'fierce', 'final', 'fine', 'firm', 'first', 'fixed', 'flat',
    'flexible', 'floating', 'focused', 'foreign', 'formal', 'former', 'fortunate',
    'fragile', 'free', 'frequent', 'fresh', 'friendly', 'frightened', 'full',
    'fun', 'funny', 'future', 'general', 'gentle', 'genuine', 'giant', 'given',
    'glad', 'global', 'golden', 'graceful', 'gradual', 'grand', 'grateful', 'gray',
    'great', 'green', 'growing', 'guilty', 'handsome', 'handy', 'happy', 'hard',
    'harsh', 'healthy', 'heavy', 'helpful', 'hidden', 'hollow', 'holy', 'honest',
    'hopeful', 'horrible', 'hostile', 'hot', 'huge', 'human', 'humble', 'hungry',
    'ideal', 'ill', 'illegal', 'immediate', 'immense', 'implicit', 'impossible',
  ],
  animals: [
    'dog', 'cat', 'bird', 'fish', 'horse', 'cow', 'pig', 'sheep', 'chicken', 'duck',
    'goat', 'rabbit', 'mouse', 'rat', 'fox', 'wolf', 'bear', 'deer', 'moose', 'elk',
    'lion', 'tiger', 'leopard', 'cheetah', 'elephant', 'giraffe', 'zebra', 'rhino',
    'hippo', 'monkey', 'gorilla', 'chimp', 'kangaroo', 'koala', 'panda', 'sloth',
    'otter', 'beaver', 'squirrel', 'hedgehog', 'raccoon', 'skunk', 'bat', 'whale',
    'dolphin', 'seal', 'walrus', 'penguin', 'eagle', 'hawk', 'owl', 'parrot',
    'crow', 'raven', 'swan', 'goose', 'turkey', 'peacock', 'flamingo', 'crane',
    'lizard', 'snake', 'turtle', 'frog', 'toad', 'salamander', 'crocodile',
    'alligator', 'shark', 'octopus', 'squid', 'crab', 'lobster', 'shrimp',
    'snail', 'worm', 'butterfly', 'bee', 'ant', 'spider', 'scorpion', 'beetle',
    'ladybug', 'dragonfly', 'grasshopper', 'cricket', 'mosquito', 'fly', 'flea',
    'llama', 'alpaca', 'camel', 'donkey', 'mule', 'buffalo', 'bison', 'yak',
  ],
  colors: [
    'red', 'blue', 'green', 'yellow', 'orange', 'purple', 'pink', 'brown', 'black',
    'white', 'gray', 'gold', 'silver', 'bronze', 'copper', 'crimson', 'scarlet',
    'ruby', 'cherry', 'rose', 'coral', 'salmon', 'peach', 'apricot', 'amber',
    'honey', 'lemon', 'lime', 'olive', 'emerald', 'jade', 'teal', 'turquoise',
    'cyan', 'azure', 'sapphire', 'navy', 'indigo', 'violet', 'lavender', 'lilac',
    'magenta', 'fuchsia', 'plum', 'maroon', 'burgundy', 'wine', 'mauve', 'taupe',
    'beige', 'cream', 'ivory', 'bone', 'tan', 'khaki', 'chocolate', 'coffee',
    'charcoal', 'slate', 'pewter', 'steel', 'iron', 'rust', 'bronze', 'copper',
    'mint', 'sage', 'forest', 'hunter', 'sea', 'sky', 'midnight', 'eggplant',
    'blush', 'dusty', 'neon', 'pastel', 'metallic', 'glossy', 'matte', 'sheer',
    'translucent', 'opaque', 'fluorescent', 'iridescent', 'sparkling', 'shimmering',
  ],
}

export default function RandomWordPage() {
  const t = useTranslations('tools.random-word')
  const ct = useTranslations('common')

  const [count, setCount] = useState(5)
  const [category, setCategory] = useState<WordCategory>('all')
  const [words, setWords] = useState<string[]>([])
  const [copied, setCopied] = useState(false)

  const generate = useCallback(() => {
    const bank = WORD_BANK[category]
    const generated: string[] = []

    for (let i = 0; i < count; i++) {
      generated.push(bank[Math.floor(Math.random() * bank.length)])
    }

    setWords(generated)
    setCopied(false)
  }, [count, category])

  const handleCopy = () => {
    if (words.length === 0) return
    navigator.clipboard.writeText(words.join(', ')).catch(() => {})
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold mb-2">{t('h1')}</h1>
      <p className="text-gray-600 dark:text-gray-400 mb-6">{t('description')}</p>
      <AdBanner className="mb-8 h-20" />

      <div className="bg-white dark:bg-gray-800 border rounded-xl p-6 mb-8">
        <div className="flex flex-wrap gap-2 mb-4">
          {([
            { value: 'all' as const, label: 'All Words' },
            { value: 'nouns' as const, label: 'Nouns' },
            { value: 'verbs' as const, label: 'Verbs' },
            { value: 'adjectives' as const, label: 'Adjectives' },
            { value: 'animals' as const, label: 'Animals' },
            { value: 'colors' as const, label: 'Colors' },
          ]).map(opt => (
            <button key={opt.value} onClick={() => setCategory(opt.value)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                category === opt.value ? 'bg-blue-600 text-white' : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}>
              {opt.label}
            </button>
          ))}
        </div>

        <div className="flex items-end gap-4 mb-4">
          <div className="flex-1">
            <label className="block text-sm font-medium mb-1">Number of Words</label>
            <input type="number" value={count} onChange={e => setCount(Math.max(1, Math.min(100, Number(e.target.value))))} min={1} max={100}
              className="w-full p-2.5 border rounded-lg text-sm dark:bg-gray-800 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button onClick={generate} className="px-6 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
            Generate
          </button>
        </div>

        {words.length > 0 && (
          <div className="p-4 bg-green-50 dark:bg-green-900/10 border border-green-200 dark:border-green-900/30 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-gray-500">Generated Words</span>
              <button onClick={handleCopy} className="text-xs px-2 py-1 border rounded hover:bg-white dark:hover:bg-gray-700 transition-colors">
                {copied ? 'Copied!' : 'Copy'}
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {words.map((word, i) => (
                <span key={i} className="px-3 py-1.5 bg-white dark:bg-gray-800 border rounded-lg text-sm font-medium">
                  {word}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      <section className="prose dark:prose-invert max-w-none">
        <h2>{t('howto.heading')}</h2>
        <ol>
          {(t.raw('howto.steps') as string[]).map((step, i) => (
            <li key={i} dangerouslySetInnerHTML={{ __html: step }} />
          ))}
        </ol>

        <h2>{t('tips.heading')}</h2>
        <ul>
          {(t.raw('tips.items') as string[]).map((item, i) => (
            <li key={i} dangerouslySetInnerHTML={{ __html: item }} />
          ))}
        </ul>

        <h2>{t('faq.heading')}</h2>
        <div className="space-y-4 not-prose">
          {(t.raw('faq.items') as { q: string; a: string }[]).map((item, i) => (
            <div key={i}>
              <h3 className="font-semibold">{item.q}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">{item.a}</p>
            </div>
          ))}
        </div></section>
    </div>
  )
}
