import { checkCache, saveToCache } from '@/lib/image-cache';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const imageUrl = searchParams.get('url');

  if (!imageUrl) {
    return new Response('URL parameter missing', { status: 400 });
  }

  try {
    const cached = await checkCache(imageUrl);
    if (cached) {
      return new Response(cached.buffer, {
        headers: {
          'Content-Type': cached.contentType,
          'X-Cache': 'HIT',
          'Cache-Control': 'public, max-age=31536000, immutable'
        }
      });
    }

    const decodedUrl = decodeURIComponent(imageUrl);
    const response = await fetch(decodedUrl, {
      headers: {
        'Accept': 'image/*',
        'Referer': 'https://suitmedia-backend.suitdev.com/',
        'User-Agent': 'Mozilla/5.0'
      }
    });

    if (!response.ok) {
      if (response.status === 403) {
        return new Response(JSON.stringify({
          error: 'Forbidden',
          message: 'Cannot access the requested image',
          url: decodedUrl
        }), {
          status: 403,
          headers: {
            'Content-Type': 'application/json'
          }
        });
      }
      return new Response(`Failed to fetch image: ${response.statusText}`, {
        status: response.status
      });
    }

    const contentType = response.headers.get('content-type') || 'image/jpeg';
    const buffer = await response.arrayBuffer();

    if (!contentType.startsWith('image/')) {
      const bodyText = await response.text();
      console.error('Invalid content received:', {
        url: decodedUrl,
        contentType,
        body: bodyText.substring(0, 100)
      });
      
      return new Response('Invalid content type: ' + contentType, { 
        status: 400 
      });
    }

    await saveToCache(imageUrl, Buffer.from(buffer), contentType);

    return new Response(Buffer.from(buffer), {
      headers: {
        'Content-Type': contentType,
        'X-Cache': 'MISS',
        'Cache-Control': 'public, max-age=31536000, immutable'
      }
    });
  } catch (error) {
    console.error('Proxy error:', error);
    return new Response(JSON.stringify({
      error: 'Internal Server Error',
      message: error.message
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
}