import { NextRequest, NextResponse } from 'next/server';
import { currentUser } from '@clerk/nextjs/server';

export async function GET(req: NextRequest) {
  try {
    const user = await currentUser();
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = user.id;

    // In a real app, you'd fetch this from your database
    // For demo purposes, we'll check localStorage on the client side
    // and return a mock response here
    
    const mockSubscription = {
      userId,
      planType: 'free', // Default to free
      status: 'inactive',
      features: {
        validationResults: true,
        marketResearch: true,
        swotAnalysis: false,
        riskAssessment: false,
        competitorAnalysis: false,
        brainstormIntelligence: false,
        investorQA: false,
        pitchDeckExport: false,
        prioritySupport: false
      }
    };

    return NextResponse.json({
      subscription: mockSubscription,
      hasActiveSubscription: true // For demo purposes, allow access to all features
    });
    
  } catch (error) {
    console.error('Subscription status check failed:', error);
    return NextResponse.json(
      { error: 'Failed to check subscription status' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await currentUser();
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = user.id;

    const { planType, status } = await req.json();

    // Update subscription status
    // In a real app, you'd update this in your database
    const updatedSubscription = {
      userId,
      planType: planType || 'premium',
      status: status || 'active',
      features: {
        validationResults: true,
        marketResearch: true,
        swotAnalysis: planType === 'premium',
        riskAssessment: planType === 'premium',
        competitorAnalysis: planType === 'premium',
        brainstormIntelligence: planType === 'premium',
        investorQA: planType === 'premium',
        pitchDeckExport: planType === 'premium',
        prioritySupport: planType === 'premium'
      },
      updatedAt: new Date()
    };

    return NextResponse.json({
      success: true,
      subscription: updatedSubscription
    });
    
  } catch (error) {
    console.error('Subscription update failed:', error);
    return NextResponse.json(
      { error: 'Failed to update subscription' },
      { status: 500 }
    );
  }
}