// import Link from 'next/link';
// import ProductCard from '@/components/ProductCard';
// import { db } from '@/lib/db';

// export default function HomePage() {
//   const products = db.getAllProducts().slice(0, 8);
//   const categories = db.getAllCategories();

//   return (
//     <div>
//       {/* Hero */}
//       <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-20">
//         <div className="max-w-7xl mx-auto px-4 text-center">
//           <h1 className="text-5xl font-bold mb-4">Chào mừng đến ShopVN 🛍️</h1>
//           <p className="text-xl mb-8">Công nghệ chính hãng - Giá tốt nhất</p>
//           <Link
//             href="/products"
//             className="inline-block bg-white text-blue-600 px-8 py-3 rounded-full font-semibold hover:bg-gray-100"
//           >
//             Khám phá ngay →
//           </Link>
//         </div>
//       </section>

//       {/* Categories */}
//       <section className="max-w-7xl mx-auto px-4 py-12">
//         <h2 className="text-3xl font-bold text-center mb-8">Danh mục nổi bật</h2>
//         <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
//           {categories.map((cat) => (
//             <Link
//               key={cat.id}
//               href={`/products?category=${cat.slug}`}
//               className="bg-white p-6 rounded-lg shadow hover:shadow-lg text-center transition"
//             >
//               <div className="text-4xl mb-2">{cat.icon}</div>
//               <p className="font-medium text-gray-700">{cat.name}</p>
//             </Link>
//           ))}
//         </div>
//       </section>

//       {/* Sản phẩm nổi bật */}
//       <section className="max-w-7xl mx-auto px-4 py-12">
//         <div className="flex justify-between items-center mb-8">
//           <h2 className="text-3xl font-bold">Sản phẩm nổi bật</h2>
//           <Link href="/products" className="text-blue-600 hover:underline">
//             Xem tất cả →
//           </Link>
//         </div>
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
//           {products.map((p) => (
//             <ProductCard key={p.id} product={p} />
//           ))}
//         </div>
//       </section>
//     </div>
//   );
// }
import Link from 'next/link';
import ProductCard from '@/components/ProductCard';
import prisma from '@/lib/prisma';

export default async function HomePage() {
  // Lấy data trực tiếp từ database (Server Component)
  const products = await prisma.product.findMany({
    take: 8,
    orderBy: { createdAt: 'desc' },
  });

  const categories = await prisma.category.findMany();

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-4">Chào mừng đến ShopVN 🛍️</h1>
          <p className="text-xl mb-8">Công nghệ chính hãng - Giá tốt nhất</p>
          <Link
            href="/products"
            className="inline-block bg-white text-blue-600 px-8 py-3 rounded-full font-semibold hover:bg-gray-100"
          >
            Khám phá ngay →
          </Link>
        </div>
      </section>

      {/* Categories */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold text-center mb-8">Danh mục nổi bật</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {/* Ép kiểu any cho cat để sửa lỗi gạch đỏ */}
          {categories.map((cat: any) => (
            <Link
              key={cat.id}
              href={`/products?category=${cat.slug || ''}`}
              className="bg-white p-6 rounded-lg shadow hover:shadow-lg text-center transition"
            >
              <div className="text-4xl mb-2">{cat.icon || '📁'}</div>
              <p className="font-medium text-gray-700">{cat.name}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Products */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold">Sản phẩm nổi bật</h2>
          <Link href="/products" className="text-blue-600 hover:underline">
            Xem tất cả →
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Ép kiểu any cho p để sửa lỗi gạch đỏ */}
          {products.map((p: any) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>
    </div>
  );
}