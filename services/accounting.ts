import axios from 'axios';
import { parseStringPromise } from 'xml2js';

class AccountingService {
  private baseUrl: string;
  private credentials: {
    username: string;
    password: string;
  };

  constructor() {
    this.baseUrl = process.env.ACCOUNTING_1C_URL!;
    this.credentials = {
      username: process.env.ACCOUNTING_1C_USERNAME!,
      password: process.env.ACCOUNTING_1C_PASSWORD!
    };
  }

  /**
   * Authenticate with 1C API
   * @returns Promise with auth token
   */
  async authenticate(): Promise<string> {
    try {
      const response = await axios.post(`${this.baseUrl}/auth`, this.credentials);
      return response.data.token;
    } catch (error) {
      console.error('Authentication failed:', error);
      throw new Error('1C authentication error');
    }
  }

  /**
   * Create new invoice in 1C
   * @param invoiceData Invoice data to create
   * @returns Promise with creation result
   */
  async createInvoice(invoiceData: any): Promise<any> {
    try {
      const token = await this.authenticate();
      
      const response = await axios.post(
        `${this.baseUrl}/document/invoice`,
        invoiceData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      return response.data;
    } catch (error) {
      console.error('Invoice creation failed:', error);
      throw error;
    }
  }

  /**
   * Update invoice status in 1C
   * @param updateData Status update data
   * @returns Promise with update result
   */
  async updateInvoiceStatus(updateData: {
    payment_id: string;
    status: string;
    payment_date: string;
  }): Promise<any> {
    try {
      const token = await this.authenticate();
      
      const response = await axios.patch(
        `${this.baseUrl}/document/invoice/status`,
        updateData,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      return response.data;
    } catch (error) {
      console.error('Status update failed:', error);
      throw error;
    }
  }
}

export const accountingService = new AccountingService();
