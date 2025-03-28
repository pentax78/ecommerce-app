import { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Replace with your actual 1C API endpoint
    const response = await axios.post(
      `${process.env.ACCOUNTING_1C_URL}/invoices`,
      req.body,
      {
        auth: {
          username: process.env.ACCOUNTING_1C_USERNAME!,
          password: process.env.ACCOUNTING_1C_PASSWORD!
        },
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );

    return res.status(200).json(response.data);
  } catch (error: any) {
    console.error('1C integration error:', error.response?.data || error.message);
    return res.status(500).json({ 
      error: 'Failed to create invoice in 1C',
      details: error.response?.data || error.message
    });
  }
}
