import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { currentUser } from '@clerk/nextjs/server';

export async function POST(req: NextRequest) {
  try {
    const user = await currentUser();
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = user.id;

    const { 
      razorpay_order_id, 
      razorpay_payment_id, 
      razorpay_signature 
    } = await req.json();

    // Verify payment signature
    const body = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET || 'test_secret_key')
      .update(body.toString())
      .digest('hex');

    const isAuthentic = expectedSignature === razorpay_signature;

    if (isAuthentic) {
      // Payment successful - Update user subscription status
      // In a real app, you'd save this to your database
      const subscriptionData = {
        userId,
        planType: 'premium',
        status: 'active',
        paymentId: razorpay_payment_id,
        orderId: razorpay_order_id,
        amount: 200,
        currency: 'INR',
        startDate: new Date(),
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
        createdAt: new Date()
      };

      // Store subscription in localStorage for demo purposes
      // In production, save to database
      console.log('Subscription created:', subscriptionData);

      return NextResponse.json({
        success: true,
        message: 'Payment verified successfully',
        subscription: subscriptionData
      });
    } else {
      return NextResponse.json(
        { error: 'Payment verification failed' },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('Payment verification error:', error);
    return NextResponse.json(
      { error: 'Payment verification failed' },
      { status: 500 }
    );
  }
}