export const mockGames = [
  {
    id: 1,
    title: 'The Legend of Zelda: Breath of the Wild',
    console: 'Nintendo Switch',
    releaseDate: '2017-03-03',
    condition: 'excellent',
    coverArt: 'https://images.igdb.com/igdb/image/upload/t_cover_big/co1wyy.png',
    notes: 'Amazing open-world adventure',
    forSale: false,
    forTrade: false,
    price: null
  },
  {
    id: 2,
    title: 'Elden Ring',
    console: 'PlayStation 5',
    releaseDate: '2022-02-25',
    condition: 'excellent',
    coverArt: 'https://images.igdb.com/igdb/image/upload/t_cover_big/co4j80.png',
    notes: 'From Software masterpiece',
    forSale: true,
    forTrade: false,
    price: 45.99
  },
  {
    id: 3,
    title: 'Super Mario Odyssey',
    console: 'Nintendo Switch',
    releaseDate: '2017-10-27',
    condition: 'very-good',
    coverArt: 'https://images.igdb.com/igdb/image/upload/t_cover_big/co1r76.png',
    notes: 'One of the best Mario games',
    forSale: false,
    forTrade: true,
    price: null
  },
  {
    id: 4,
    title: 'God of War Ragnarök',
    console: 'PlayStation 5',
    releaseDate: '2022-11-09',
    condition: 'excellent',
    coverArt: 'https://images.igdb.com/igdb/image/upload/t_cover_big/co5opw.png',
    notes: '',
    forSale: false,
    forTrade: false,
    price: null
  },
  {
    id: 5,
    title: 'Hades',
    console: 'Nintendo Switch',
    releaseDate: '2020-09-17',
    condition: 'excellent',
    coverArt: 'https://images.igdb.com/igdb/image/upload/t_cover_big/co2hpg.png',
    notes: 'Incredible roguelike',
    forSale: true,
    forTrade: true,
    price: 25.99
  },
  {
    id: 6,
    title: 'Horizon Forbidden West',
    console: 'PlayStation 5',
    releaseDate: '2022-02-18',
    condition: 'very-good',
    coverArt: 'https://images.igdb.com/igdb/image/upload/t_cover_big/co4bji.png',
    notes: '',
    forSale: false,
    forTrade: false,
    price: null
  },
  {
    id: 7,
    title: 'Stardew Valley',
    console: 'Nintendo Switch',
    releaseDate: '2017-10-05',
    condition: 'good',
    coverArt: 'https://images.igdb.com/igdb/image/upload/t_cover_big/co2rpf.png',
    notes: 'Addictive farming sim',
    forSale: false,
    forTrade: true,
    price: null
  },
  {
    id: 8,
    title: 'Final Fantasy VII Remake',
    console: 'PlayStation 5',
    releaseDate: '2020-04-10',
    condition: 'excellent',
    coverArt: 'https://images.igdb.com/igdb/image/upload/t_cover_big/co1rkd.png',
    notes: '',
    forSale: true,
    forTrade: false,
    price: 35.99
  }
]

export const mockConsoles = [
  {
    id: 1,
    name: 'PlayStation 5',
    manufacturer: 'Sony',
    releaseDate: '2020-11-12',
    condition: 'excellent',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/PlayStation_5_and_DualSense_with_transparent_background.png/640px-PlayStation_5_and_DualSense_with_transparent_background.png',
    notes: 'With extra controller',
    forSale: false,
    forTrade: false,
    price: null
  },
  {
    id: 2,
    name: 'Nintendo Switch',
    manufacturer: 'Nintendo',
    releaseDate: '2017-03-03',
    condition: 'very-good',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/76/Nintendo-Switch-Console-Docked-wJoyConRB.jpg/640px-Nintendo-Switch-Console-Docked-wJoyConRB.jpg',
    notes: 'OLED Model',
    forSale: true,
    forTrade: false,
    price: 299.99
  },
  {
    id: 3,
    name: 'Xbox Series X',
    manufacturer: 'Microsoft',
    releaseDate: '2020-11-10',
    condition: 'excellent',
    image: 'https://upload.wikimedia.org/wikipedia/commons/7/7d/Xbox_Series_X_%26_S.png',
    notes: '',
    forSale: false,
    forTrade: true,
    price: null
  }
]

export const mockUsers = [
  {
    id: 'user1',
    username: 'GameMaster89',
    bio: 'Passionate collector with 15+ years of gaming experience. Love RPGs and indie games!',
    avatar: null,
    games: [mockGames[0], mockGames[1], mockGames[2], mockGames[4], mockGames[6]],
    consoles: [mockConsoles[0], mockConsoles[1]],
    likes: 42,
    joinedDate: '2020-01-15'
  },
  {
    id: 'user2',
    username: 'RetroGamer',
    bio: 'Collecting retro games since 1995. Specializing in Nintendo and Sega classics.',
    avatar: null,
    games: [mockGames[2], mockGames[3], mockGames[5], mockGames[7]],
    consoles: [mockConsoles[1], mockConsoles[2]],
    likes: 38,
    joinedDate: '2019-06-20'
  },
  {
    id: 'user3',
    username: 'PlayStationFan',
    bio: 'Sony PlayStation enthusiast. Love exclusives and AAA titles.',
    avatar: null,
    games: [mockGames[1], mockGames[3], mockGames[5], mockGames[7]],
    consoles: [mockConsoles[0]],
    likes: 56,
    joinedDate: '2021-03-10'
  },
  {
    id: 'user4',
    username: 'IndieLover',
    bio: 'Supporting indie developers and discovering hidden gems.',
    avatar: null,
    games: [mockGames[4], mockGames[6]],
    consoles: [mockConsoles[1]],
    likes: 29,
    joinedDate: '2022-08-05'
  },
  {
    id: 'user5',
    username: 'CollectionKing',
    bio: 'Building the ultimate game collection, one game at a time.',
    avatar: null,
    games: [...mockGames],
    consoles: [...mockConsoles],
    likes: 127,
    joinedDate: '2018-11-30'
  }
]

export const currentUserId = 'user1' // Simulated logged-in user

// User preferences and social data
export const userPreferences = {
  [currentUserId]: {
    wishlist: [
      { id: 'w1', gameTitle: 'God of War Ragnarök', console: 'PlayStation 5', addedDate: '2024-01-15' },
      { id: 'w2', gameTitle: 'Hogwarts Legacy', console: 'PlayStation 5', addedDate: '2024-01-20' }
    ],
    following: ['user2', 'user5'],
    followers: ['user3', 'user4'],
    collectionValue: 2450.99, // Estimated value in USD
    personalQuote: '🎮 Welcome to my collection! I\'m a passionate collector who loves both retro and modern games. Feel free to browse, tag, and comment on anything you like! Every game tells a story. 🎯'
  },
  'user2': {
    wishlist: [],
    following: ['user1'],
    followers: ['user1'],
    collectionValue: 1890.50
  },
  'user3': {
    wishlist: [],
    following: ['user1'],
    followers: [],
    collectionValue: 2100.00
  },
  'user4': {
    wishlist: [],
    following: [],
    followers: [],
    collectionValue: 950.25
  },
  'user5': {
    wishlist: [],
    following: ['user1'],
    followers: ['user1'],
    collectionValue: 3200.75
  }
}

