/** Static platform data — mirrors the DB seed.
 *  Used client-side where we can't call Prisma directly. */
export const PLATFORMS = [
  {
    slug: 'instagram',
    name: 'Instagram',
    emoji: '📸',
    color: '#E1306C',
    gradient: 'from-pink-500 via-red-500 to-yellow-500',
    stampBg: 'bg-gradient-to-br from-pink-500 via-red-500 to-yellow-500',
    description: 'Photo & video sharing',
  },
  {
    slug: 'tiktok',
    name: 'TikTok',
    emoji: '🎵',
    color: '#010101',
    gradient: 'from-gray-900 via-pink-600 to-cyan-400',
    stampBg: 'bg-gradient-to-br from-gray-900 via-pink-600 to-cyan-400',
    description: 'Short-form video',
  },
  {
    slug: 'youtube',
    name: 'YouTube',
    emoji: '▶️',
    color: '#FF0000',
    gradient: 'from-red-600 to-red-400',
    stampBg: 'bg-gradient-to-br from-red-600 to-red-400',
    description: 'Video platform',
  },
  {
    slug: 'snapchat',
    name: 'Snapchat',
    emoji: '👻',
    color: '#FFFC00',
    gradient: 'from-yellow-400 to-yellow-300',
    stampBg: 'bg-gradient-to-br from-yellow-400 to-yellow-300',
    description: 'Disappearing photos & stories',
  },
  {
    slug: 'whatsapp',
    name: 'WhatsApp',
    emoji: '💬',
    color: '#25D366',
    gradient: 'from-green-500 to-emerald-400',
    stampBg: 'bg-gradient-to-br from-green-500 to-emerald-400',
    description: 'Messaging',
  },
  {
    slug: 'twitter',
    name: 'Twitter/X',
    emoji: '🐦',
    color: '#1DA1F2',
    gradient: 'from-sky-500 to-blue-600',
    stampBg: 'bg-gradient-to-br from-sky-500 to-blue-600',
    description: 'Microblogging & drama',
  },
  {
    slug: 'twitch',
    name: 'Twitch',
    emoji: '🎮',
    color: '#9146FF',
    gradient: 'from-violet-600 to-purple-500',
    stampBg: 'bg-gradient-to-br from-violet-600 to-purple-500',
    description: 'Live streaming',
  },
  {
    slug: 'reddit',
    name: 'Reddit',
    emoji: '🤖',
    color: '#FF4500',
    gradient: 'from-orange-600 to-red-500',
    stampBg: 'bg-gradient-to-br from-orange-600 to-red-500',
    description: 'Forums & memes',
  },
  {
    slug: 'linkedin',
    name: 'LinkedIn',
    emoji: '💼',
    color: '#0A66C2',
    gradient: 'from-blue-700 to-blue-500',
    stampBg: 'bg-gradient-to-br from-blue-700 to-blue-500',
    description: 'Professional networking',
  },
] as const;

export type PlatformSlug = (typeof PLATFORMS)[number]['slug'];

export function getPlatformBySlug(slug: string) {
  return PLATFORMS.find((p) => p.slug === slug);
}
