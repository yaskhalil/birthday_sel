import type { VercelRequest, VercelResponse } from '@vercel/node';

export default function handler(
  request: VercelRequest,
  response: VercelResponse
) {
  if (request.method !== 'POST') {
    return response.status(405).json({ error: 'Method Not Allowed' });
  }

  // The 'Prank' execution
  // We can pretend to log the address here or trigger a webhook notification
  console.log("Someone tried to submit an address!", request.body);

  return response.status(200).json({
    message: "Who enters their address on a random app?! 😂 Happy Birthday, Selena!"
  });
}
