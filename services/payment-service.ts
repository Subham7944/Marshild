declare global {
  interface Window {
    Razorpay: any;
  }
}

export interface PaymentOptions {
  amount: number;
  currency: string;
  orderId: string;
  key: string;
  name: string;
  description: string;
  prefill: {
    name: string;
    email: string;
    contact: string;
  };
  theme: {
    color: string;
  };
  handler: (response: any) => void;
  modal: {
    ondismiss: () => void;
  };
}

export class PaymentService {
  private static instance: PaymentService;
  private razorpayLoaded = false;

  private constructor() {}

  public static getInstance(): PaymentService {
    if (!PaymentService.instance) {
      PaymentService.instance = new PaymentService();
    }
    return PaymentService.instance;
  }

  async loadRazorpay(): Promise<boolean> {
    if (this.razorpayLoaded) {
      return true;
    }

    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => {
        this.razorpayLoaded = true;
        resolve(true);
      };
      script.onerror = () => {
        resolve(false);
      };
      document.body.appendChild(script);
    });
  }

  async createOrder(planType: string = 'premium'): Promise<any> {
    try {
      const response = await fetch('/api/payment/create-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ planType }),
      });

      if (!response.ok) {
        throw new Error('Failed to create order');
      }

      return await response.json();
    } catch (error) {
      console.error('Order creation failed:', error);
      throw error;
    }
  }

  async verifyPayment(paymentData: {
    razorpay_order_id: string;
    razorpay_payment_id: string;
    razorpay_signature: string;
  }): Promise<any> {
    try {
      const response = await fetch('/api/payment/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(paymentData),
      });

      if (!response.ok) {
        throw new Error('Payment verification failed');
      }

      return await response.json();
    } catch (error) {
      console.error('Payment verification failed:', error);
      throw error;
    }
  }

  async updateSubscriptionStatus(planType: string, status: string): Promise<any> {
    try {
      const response = await fetch('/api/subscription/status', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ planType, status }),
      });

      if (!response.ok) {
        throw new Error('Failed to update subscription');
      }

      return await response.json();
    } catch (error) {
      console.error('Subscription update failed:', error);
      throw error;
    }
  }

  async getSubscriptionStatus(): Promise<any> {
    try {
      const response = await fetch('/api/subscription/status');
      
      if (!response.ok) {
        throw new Error('Failed to get subscription status');
      }

      return await response.json();
    } catch (error) {
      console.error('Subscription status check failed:', error);
      throw error;
    }
  }

  async initiatePayment(
    orderData: any,
    userInfo: { name: string; email: string; contact: string },
    onSuccess: (response: any) => void,
    onFailure: () => void
  ): Promise<void> {
    // Check if this is demo mode
    if (orderData.demo) {
      // Simulate demo payment flow
      setTimeout(() => {
        const demoResponse = {
          razorpay_order_id: orderData.orderId,
          razorpay_payment_id: `pay_demo_${Date.now()}`,
          razorpay_signature: 'demo_signature_' + Date.now()
        };
        
        // Store demo subscription
        localStorage.setItem('marshild_subscription', JSON.stringify({
          planType: 'premium',
          status: 'active',
          paymentId: demoResponse.razorpay_payment_id,
          startDate: new Date().toISOString(),
          endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
          demo: true
        }));
        
        onSuccess({ success: true, demo: true, message: orderData.message });
      }, 1500);
      return;
    }
    
    const isLoaded = await this.loadRazorpay();
    
    if (!isLoaded) {
      throw new Error('Razorpay SDK failed to load');
    }

    const options: PaymentOptions = {
      key: orderData.key,
      amount: orderData.amount,
      currency: orderData.currency,
      name: 'Marshild',
      description: 'Premium Plan - Monthly Subscription',
      orderId: orderData.orderId,
      prefill: userInfo,
      theme: {
        color: '#3B82F6', // Primary color
      },
      handler: async (response: any) => {
        try {
          const verificationResult = await this.verifyPayment({
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
          });

          if (verificationResult.success) {
            // Update subscription status
            await this.updateSubscriptionStatus('premium', 'active');
            
            // Store subscription data locally for immediate UI updates
            localStorage.setItem('marshild_subscription', JSON.stringify({
              planType: 'premium',
              status: 'active',
              paymentId: response.razorpay_payment_id,
              startDate: new Date().toISOString(),
              endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
            }));

            onSuccess(verificationResult);
          } else {
            onFailure();
          }
        } catch (error) {
          console.error('Payment verification error:', error);
          onFailure();
        }
      },
      modal: {
        ondismiss: onFailure,
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  }

  // Check if user has premium access
  hasPremiumAccess(): boolean {
    try {
      const subscription = localStorage.getItem('marshild_subscription');
      if (!subscription) return false;

      const subData = JSON.parse(subscription);
      const now = new Date();
      const endDate = new Date(subData.endDate);

      return subData.status === 'active' && 
             subData.planType === 'premium' && 
             now < endDate;
    } catch (error) {
      console.error('Error checking premium access:', error);
      return false;
    }
  }

  // Get subscription details
  getSubscriptionDetails(): any {
    try {
      const subscription = localStorage.getItem('marshild_subscription');
      return subscription ? JSON.parse(subscription) : null;
    } catch (error) {
      console.error('Error getting subscription details:', error);
      return null;
    }
  }
}
