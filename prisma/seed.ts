import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const platforms = [
  {
    name: 'Instagram',
    slug: 'instagram',
    color: '#E1306C',
    gradient: 'from-pink-500 via-red-500 to-yellow-500',
    emoji: '📸',
    description: 'Photo & video sharing',
    order: 1,
  },
  {
    name: 'TikTok',
    slug: 'tiktok',
    color: '#010101',
    gradient: 'from-gray-900 via-pink-600 to-cyan-400',
    emoji: '🎵',
    description: 'Short-form video',
    order: 2,
  },
  {
    name: 'YouTube',
    slug: 'youtube',
    color: '#FF0000',
    gradient: 'from-red-600 to-red-400',
    emoji: '▶️',
    description: 'Video platform',
    order: 3,
  },
  {
    name: 'Snapchat',
    slug: 'snapchat',
    color: '#FFFC00',
    gradient: 'from-yellow-400 to-yellow-300',
    emoji: '👻',
    description: 'Disappearing photos & stories',
    order: 4,
  },
  {
    name: 'WhatsApp',
    slug: 'whatsapp',
    color: '#25D366',
    gradient: 'from-green-500 to-emerald-400',
    emoji: '💬',
    description: 'Messaging',
    order: 5,
  },
  {
    name: 'Twitter/X',
    slug: 'twitter',
    color: '#1DA1F2',
    gradient: 'from-sky-500 to-blue-600',
    emoji: '🐦',
    description: 'Microblogging & drama',
    order: 6,
  },
  {
    name: 'Twitch',
    slug: 'twitch',
    color: '#9146FF',
    gradient: 'from-violet-600 to-purple-500',
    emoji: '🎮',
    description: 'Live streaming',
    order: 7,
  },
  {
    name: 'Reddit',
    slug: 'reddit',
    color: '#FF4500',
    gradient: 'from-orange-600 to-red-500',
    emoji: '🤖',
    description: 'Forums & memes',
    order: 8,
  },
  {
    name: 'LinkedIn',
    slug: 'linkedin',
    color: '#0A66C2',
    gradient: 'from-blue-700 to-blue-500',
    emoji: '💼',
    description: 'Professional networking',
    order: 9,
  },
];

async function main() {
  console.log('🌱 Seeding platforms...');
  for (const platform of platforms) {
    await prisma.platform.upsert({
      where: { slug: platform.slug },
      update: platform,
      create: platform,
    });
  }
  console.log(`✅ Seeded ${platforms.length} platforms.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
