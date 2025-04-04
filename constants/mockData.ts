export interface Product {
    id: string;
    name: string;
    price: string;
    image: string;
    description?: string;
    category: 'cayTrong' | 'chauCayTrong' | 'phuKien' | 'comboChamSoc';
    label?: string;
    details?: {
        size: string;
        origin: string;
        status: string;
    };
}

export const products: Product[] = [
    // Cây trồng
    {
        id: '1',
        name: 'Spider Plant',
        price: '250.000đ',
        image: 'https://loremflickr.com/640/480/city',
        category: 'cayTrong',
        label: 'Ưa bóng',
        details: {
            size: 'Nhỏ',
            origin: 'Châu Phi',
            status: 'Còn 156 sp'
        }
    },
    {
        id: '2',
        name: 'Song of India',
        price: '250.000đ',
        image: 'https://loremflickr.com/640/480/city',
        category: 'cayTrong',
        label: 'Ưa sáng',
        details: {
            size: 'Trung bình',
            origin: 'Ấn Độ',
            status: 'Còn 89 sp'
        }
    },
    {
        id: '3',
        name: 'Grey Star Calarthea',
        price: '250.000đ',
        image: 'https://loremflickr.com/640/480/city',
        category: 'cayTrong',
        label: 'Ưa sáng',
        details: {
            size: 'Nhỏ',
            origin: 'Brazil',
            status: 'Còn 120 sp'
        }
    },
    {
        id: '4',
        name: 'Banana Plant',
        price: '250.000đ',
        image: 'https://loremflickr.com/640/480/city',
        category: 'cayTrong',
        label: 'Ưa sáng',
        details: {
            size: 'Lớn',
            origin: 'Đông Nam Á',
            status: 'Còn 45 sp'
        }
    },
    // Chậu cây trồng
    {
        id: '5',
        name: 'Planta Trắng',
        price: '250.000đ',
        image: 'https://loremflickr.com/640/480/city',
        category: 'chauCayTrong',
        details: {
            size: 'Trung bình',
            origin: 'Việt Nam',
            status: 'Còn 200 sp'
        }
    },
    {
        id: '6',
        name: 'Planta Lemon Balm',
        price: '250.000đ',
        image: 'https://loremflickr.com/640/480/city',
        category: 'chauCayTrong',
        details: {
            size: 'Nhỏ',
            origin: 'Việt Nam',
            status: 'Còn 150 sp'
        }
    },
    // Phụ kiện
    {
        id: '9',
        name: 'Bình tưới CB2 SAIC',
        price: '250.000đ',
        image: 'https://loremflickr.com/640/480/city',
        category: 'phuKien',
        details: {
            size: 'Trung bình',
            origin: 'Trung Quốc',
            status: 'Còn 78 sp'
        }
    },
    {
        id: '10',
        name: 'Bình xịt Xiaoda',
        price: '250.000đ',
        image: 'https://loremflickr.com/640/480/city',
        category: 'phuKien',
        details: {
            size: 'Nhỏ',
            origin: 'Trung Quốc',
            status: 'Còn 92 sp'
        }
    },
    // Combo chăm sóc
    {
        id: '13',
        name: 'Lemon Balm Grow Kit',
        price: '250.000đ',
        image: 'https://loremflickr.com/640/480/city',
        category: 'comboChamSoc',
        description: 'Gồm: hạt giống Lemon Balm, gói đất hữu cơ, chậu Planta, marker đánh dấu...',
        details: {
            size: 'Bộ combo',
            origin: 'Việt Nam',
            status: 'Còn 35 sp'
        }
    },
]; 