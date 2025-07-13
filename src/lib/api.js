export async function fetchIdeas({ pageNumber, pageSize, sort }) {
  const url = new URL('https://suitmedia-backend.suitdev.com/api/ideas');
  url.searchParams.set('page[number]', pageNumber);
  url.searchParams.set('page[size]', pageSize);
  url.searchParams.set('sort', sort);
  url.searchParams.append('append[]', 'small_image');
  url.searchParams.append('append[]', 'medium_image');

  try {
    const res = await fetch(url.toString(), {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || 'Gagal mengambil data');
    }

    return await res.json();
  } catch (error) {
    throw new Error(error.message);
  }
}
