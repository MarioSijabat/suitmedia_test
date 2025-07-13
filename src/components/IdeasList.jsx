'use client';
import { useEffect, useState } from 'react';
import { fetchIdeas } from '@/lib/api';
import Pagination from './Pagination';
import Image from 'next/image';
import { useSearchParams, useRouter } from 'next/navigation';

export default function IdeasList() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    links: {},
    meta: {}
  });
  const searchParams = useSearchParams();
  const router = useRouter();

  const page = searchParams.get('page') || '1';
  const perPage = searchParams.get('perPage') || '10';
  const sort = searchParams.get('sort') || '-published_at';

  const loadData = async () => {
    try {
      setLoading(true);
      const result = await fetchIdeas({
        pageNumber: page,
        pageSize: perPage,
        sort: sort
      });

      if (!result.data) throw new Error('No data received');

      setData(result.data);
      setPagination({
        links: result.links,
        meta: result.meta
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [page, perPage, sort]);

  const handlePageChange = (url) => {
    if (!url) return;
    const urlObj = new URL(url);
    const pageNumber = urlObj.searchParams.get('page[number]');
    const params = new URLSearchParams(searchParams);
    params.set('page', pageNumber);
    router.push(`?${params.toString()}`);
  };

  const handleItemsPerPageChange = (newPerPage) => {
    const params = new URLSearchParams(searchParams);
    params.set('perPage', newPerPage);
    params.set('page', '1');
    router.push(`?${params.toString()}`);
  };

  if (loading) return <div className="text-center py-8 text-gray-300">Loading...</div>;

  if (error) return (
    <div className="bg-red-900 border-l-4 border-red-600 p-4 my-4 text-white">
      <p>{error}</p>
    </div>
  );

  return (
    <div className="text-gray-100 p-4 mx-36 rounded-md">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div className="flex items-center gap-2">
          <div className="text-sm text-gray-900">
            Showing {pagination.meta.from || 1} - {pagination.meta.to || perPage} of {pagination.meta.total || 0}
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-900">Show per page:</span>
            <select
              value={perPage}
              onChange={(e) => handleItemsPerPageChange(e.target.value)}
              className="border border-gray-600 rounded-md px-3 py-2 text-sm text-gray-900"
            >
              {[10, 20, 50].map(size => (
                <option key={size} value={size}>{size}</option>
              ))}
            </select>
          </div>
          <span className="text-sm text-gray-900">Sort by:</span>
          <select
            value={sort}
            onChange={(e) => {
              const params = new URLSearchParams(searchParams);
              params.set('sort', e.target.value);
              params.set('page', '1');
              router.push(`?${params.toString()}`);
            }}
            className="border border-gray-600 rounded-md px-3 py-2 text-sm text-gray-900"
          >
            <option value="-published_at">Newest</option>
            <option value="published_at">Oldest</option>
          </select>
        </div>
      </div>

      <div className="grid sm:grid-cols-1 grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-6">
        {data.map((item) => (
          <div key={item.id} className="bg-white border-2 shadow-md border-gray-100 rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
            {item.small_image?.[0]?.url && (
              <div className="aspect-w-16 aspect-h-9 bg-white">
              <Image
                src="/placeholder.jpg" // Langsung gunakan placeholder
                alt={item.title}
                width={300}
                height={169}
                className="w-full h-48 object-cover"
                loading="lazy"
              />
                {/* <Image
                  src={`/api/proxy-image?url=${encodeURIComponent(item.small_image[0].url)}`} // Proxy untuk mengambil gambar
                  alt={item.title}
                  width={300}
                  height={169}
                  className="w-full h-48 object-cover"
                  loading="lazy"
                  onError={(e) => {
                    e.currentTarget.src = '/fallback-image.jpg';
                    e.currentTarget.onerror = null; // Prevent infinite loop
                  }}
                  onLoad={(e) => {
                    if (!e.target.naturalWidth) {
                      console.log('Image failed to load:', item.small_image[0].url);
                      e.target.src = '/placeholder.jpg'; // Fallback jika gambar gagal dimuat
                    }
                  }}
                /> */}
              </div>
            )}
            <div className="p-4">
              <p className="text-gray-600 text-sm">
                {new Date(item.published_at).toLocaleDateString('id-ID', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })}
              </p>
              <h2 className="font-bold text-lg mb-2 line-clamp-3 text-gray-900" title={item.title}>
                {item.title}
              </h2>
            </div>
          </div>
        ))}
      </div>

      <Pagination 
        links={pagination.links}
        meta={pagination.meta}
        onPageChange={handlePageChange}
      />
    </div>
  );
}
