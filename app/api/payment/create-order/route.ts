import { NextRequest, NextResponse } from 'next/server';
import Razorpay from 'razorpay';
import { currentUser } from '@clerk/nextjs/server';

// Check if we have real Razorpay keys
const hasRealKeys = process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET && 
                   process.env.RAZORPAY_KEY_ID !== 'rzp_test_1234567890';

let razorpay: Razorpay | null = null;

if (hasRealKeys) {
  razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID!,
    key_secret: process.env.RAZORPAY_KEY_SECRET!,
  });
}

export async function POST(req: NextRequest) {
  try {
    const user = await currentUser();
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = user.id;

    const { planType } = await req.json();
    
    // Premium plan details
    const amount = 20000; // ₹200 in paise (Razorpay uses paise)
    const currency = 'INR';
    
    if (!hasRealKeys) {
      // Demo mode - return mock order data
      const mockOrder = {
        id: `order_demo_${Date.now()}`,
        amount,
        currency,
        status: 'created'
      };
      
      return NextResponse.json({
        orderId: mockOrder.id,
        amount: mockOrder.amount,
        currency: mockOrder.currency,
        key: 'rzp_test_demo_key',
        demo: true,
        message: 'Demo mode - Add real Razorpay keys to .env.local for live payments'
      });
    }
    
    const options = {
      amount,
      currency,
      receipt: `receipt_${userId}_${Date.now()}`,
      notes: {
        userId,
        planType: planType || 'premium',
        description: 'Marshild Premium Plan - Monthly Subscription'
      }
    };

    const order = await razorpay!.orders.create(options);
    
    return NextResponse.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      key: process.env.RAZORPAY_KEY_ID!
    });
    
  } catch (error) {
    console.error('Payment order creation failed:', error);
    return NextResponse.json(
      { error: 'Failed to create payment order' },
      { status: 500 }
    );
  }
}
