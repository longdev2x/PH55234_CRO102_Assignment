import { Product, ProductCategory } from '@/services/api';

export const products: Product[] = [
    // Cây trồng
    {
        id: '1',
        name: 'Spider Plant',
        description: 'Easy to grow, spider plants produce arched green and pale yellow stems.',
        price: '250.000đ',
        category: 'cayTrong' as ProductCategory,
        image: 'https://www.bonsaiempire.vn/images/gallery/large/A_028_Nov.jpg',
        quantity: '10'
    },
    {
        id: '2',
        name: 'Song of India',
        description: 'Song of India is a versatile, low-maintenance plant that can thrive in a variety of lighting conditions.',
        price: '250.000đ',
        category: 'cayTrong' as ProductCategory,
        image: 'https://loremflickr.com/640/480/city',
        quantity: '10'
    },
    {
        id: '3',
        name: 'Grey Star Calarthea',
        description: 'Grey Star Calarthea is a beautiful, low-maintenance plant that can add a touch of elegance to any room.',
        price: '250.000đ',
        category: 'cayTrong' as ProductCategory,
        image: 'https://loremflickr.com/640/480/city',
        quantity: '10'
    },
    {
        id: '4',
        name: 'Banana Plant',
        description: 'Banana Plant is a popular, low-maintenance plant that can thrive in a variety of lighting conditions.',
        price: '250.000đ',
        category: 'cayTrong' as ProductCategory,
        image: 'https://loremflickr.com/640/480/city',
        quantity: '10'
    },
    // Chậu cây trồng
    {
        id: '5',
        name: 'Planta Trắng',
        description: 'Planta Trắng is a beautiful, low-maintenance plant that can add a touch of elegance to any room.',
        price: '250.000đ',
        category: 'chauCayTrong' as ProductCategory,
        image: 'https://loremflickr.com/640/480/city',
        quantity: '10'
    },
    {
        id: '6',
        name: 'Planta Lemon Balm',
        description: 'Planta Lemon Balm is a popular, low-maintenance plant that can thrive in a variety of lighting conditions.',
        price: '250.000đ',
        category: 'chauCayTrong' as ProductCategory,
        image: 'https://loremflickr.com/640/480/city',
        quantity: '10'
    },
    // Phụ kiện
    {
        id: '9',
        name: 'Bình tưới CB2 SAIC',
        description: 'Bình tưới CB2 SAIC is a high-quality watering can that can help you keep your plants healthy and thriving.',
        price: '250.000đ',
        category: 'phuKien' as ProductCategory,
        image: 'https://loremflickr.com/640/480/city',
        quantity: '10'
    },
    {
        id: '10',
        name: 'Bình xịt Xiaoda',
        description: 'Bình xịt Xiaoda is a popular, low-maintenance plant spray that can help you keep your plants healthy and thriving.',
        price: '250.000đ',
        category: 'phuKien' as ProductCategory,
        image: 'https://loremflickr.com/640/480/city',
        quantity: '10'
    },
    // Combo chăm sóc
    {
        id: '13',
        name: 'Lemon Balm Grow Kit',
        description: 'Lemon Balm Grow Kit is a high-quality growing kit that can help you grow your own lemon balm plants.',
        price: '250.000đ',
        category: 'comboChamSoc' as ProductCategory,
        image: 'https://loremflickr.com/640/480/city',
        quantity: '10'
    },
];