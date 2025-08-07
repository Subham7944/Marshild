import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { industry, location, audience, description } = await request.json();

    if (!industry || !location || !audience) {
      return NextResponse.json(
        { error: 'Industry, location, and audience are required' },
        { status: 400 }
      );
    }

    // Generate deterministic data based on inputs for consistency
    const generateHash = (str: string) => {
      let hash = 0;
      for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash; // Convert to 32bit integer
      }
      return Math.abs(hash);
    };

    const inputString = `${industry}-${location}-${audience}-${description || ''}`;
    const hash = generateHash(inputString);

    // Comprehensive Risk Analysis Functions
    
    // Legal Risk Analysis
    const generateLegalRisk = () => {
      const legalRisksByIndustry = {
        'fintech': {
          regulations: ['PSD2 (Payment Services Directive)', 'GDPR (Data Protection)', 'AML (Anti-Money Laundering)', 'KYC (Know Your Customer)', 'MiFID II', 'Basel III'],
          concerns: [
            'Financial services licensing requirements',
            'Cross-border payment regulations',
            'Consumer protection laws',
            'Data privacy and security compliance',
            'Regulatory capital requirements',
            'Open banking compliance'
          ],
          riskFactors: [
            'Regulatory changes can require significant system overhauls',
            'Non-compliance penalties can reach 4% of annual revenue',
            'Multiple jurisdictions mean complex compliance matrix',
            'Financial regulators have broad enforcement powers'
          ]
        },
        'healthcare': {
          regulations: ['HIPAA (Health Insurance Portability)', 'FDA Medical Device Regulations', 'HITECH Act', 'State Medical Board Requirements', 'Clinical Trial Regulations'],
          concerns: [
            'Patient data privacy and security',
            'Medical device approval processes',
            'Clinical trial compliance',
            'Healthcare provider licensing',
            'Telemedicine regulations',
            'Medical liability insurance'
          ],
          riskFactors: [
            'FDA approval can take 3-7 years for medical devices',
            'HIPAA violations can result in $1.5M+ fines',
            'Medical malpractice liability exposure',
            'State-by-state regulatory variations'
          ]
        },
        'technology': {
          regulations: ['GDPR (Data Protection)', 'CCPA (California Consumer Privacy)', 'COPPA (Children\'s Online Privacy)', 'Section 230 (Platform Liability)', 'Export Control Regulations'],
          concerns: [
            'Data privacy and user consent',
            'Intellectual property protection',
            'Software licensing compliance',
            'Cybersecurity standards',
            'Platform liability for user content',
            'International data transfer restrictions'
          ],
          riskFactors: [
            'Privacy regulations vary significantly by jurisdiction',
            'IP litigation can be costly and time-consuming',
            'Data breaches can result in massive fines',
            'Platform liability laws are evolving rapidly'
          ]
        },
        'ecommerce': {
          regulations: ['Consumer Protection Laws', 'FTC Guidelines', 'State Sales Tax Requirements', 'International Trade Regulations', 'Product Safety Standards'],
          concerns: [
            'Consumer protection compliance',
            'Product liability and safety',
            'Sales tax collection across jurisdictions',
            'International shipping regulations',
            'Advertising and marketing compliance',
            'Return and refund policies'
          ],
          riskFactors: [
            'Product liability can result in significant damages',
            'Sales tax compliance varies by state/country',
            'Consumer protection laws differ globally',
            'Product recalls can be extremely costly'
          ]
        }
      };

      const industryKey = industry.toLowerCase();
      const legalData = legalRisksByIndustry[industryKey] || {
        regulations: ['General Business Licensing', 'Tax Compliance', 'Employment Law', 'Contract Law'],
        concerns: ['Business licensing', 'Tax obligations', 'Employment compliance', 'Contract disputes'],
        riskFactors: ['Regulatory compliance costs', 'Legal liability exposure', 'Licensing requirements']
      };

      const legalHash = generateHash('legal' + inputString);
      const riskScore = 35 + (legalHash % 35); // Range 35-70
      
      return {
        category: 'Legal Risk',
        risk_score: riskScore,
        risk_level: riskScore >= 60 ? 'High' : riskScore >= 45 ? 'Medium' : 'Low',
        applicable_regulations: legalData.regulations,
        key_concerns: legalData.concerns,
        risk_factors: legalData.riskFactors,
        compliance_complexity: riskScore >= 55 ? 'High' : riskScore >= 40 ? 'Medium' : 'Low',
        estimated_compliance_cost: riskScore >= 55 ? '$50K-200K annually' : riskScore >= 40 ? '$20K-50K annually' : '$5K-20K annually',
        recommendations: [
          'Consult with specialized legal counsel early in development',
          'Implement compliance-by-design principles',
          'Regular legal reviews and updates',
          'Establish relationships with regulatory experts',
          'Budget 10-15% of revenue for compliance costs'
        ]
      };
    };

    // Technical Risk Analysis
    const generateTechnicalRisk = () => {
      const technicalRisksByIndustry = {
        'fintech': {
          technologies: ['Payment Processing APIs', 'Blockchain/DLT', 'AI/ML for Fraud Detection', 'Cloud Infrastructure', 'Mobile Security'],
          challenges: [
            'PCI DSS compliance for payment processing',
            'Real-time fraud detection and prevention',
            'High-availability system architecture',
            'Secure API design and management',
            'Regulatory reporting automation',
            'Multi-factor authentication implementation'
          ],
          patent_landscape: {
            crowded: true,
            patent_count: 15000,
            analysis: 'Highly crowded patent space with major players holding extensive portfolios in payment processing, fraud detection, and blockchain technologies.'
          }
        },
        'healthcare': {
          technologies: ['FHIR/HL7 Standards', 'Medical Imaging AI', 'IoT Medical Devices', 'Telemedicine Platforms', 'EHR Integration'],
          challenges: [
            'Medical device software validation (FDA 510k)',
            'Clinical data interoperability',
            'Real-time patient monitoring systems',
            'HIPAA-compliant data architecture',
            'Clinical decision support algorithms',
            'Medical device cybersecurity'
          ],
          patent_landscape: {
            crowded: true,
            patent_count: 8500,
            analysis: 'Moderately crowded space with significant patent activity in medical AI, diagnostic tools, and patient monitoring systems.'
          }
        },
        'technology': {
          technologies: ['Cloud Computing', 'AI/Machine Learning', 'Microservices Architecture', 'DevOps/CI-CD', 'Cybersecurity'],
          challenges: [
            'Scalable system architecture design',
            'Data security and privacy protection',
            'API rate limiting and management',
            'Cross-platform compatibility',
            'Performance optimization',
            'Third-party integration security'
          ],
          patent_landscape: {
            crowded: false,
            patent_count: 3200,
            analysis: 'Emerging technology space with moderate patent activity, indicating opportunities for innovation.'
          }
        },
        'ecommerce': {
          technologies: ['E-commerce Platforms', 'Payment Gateways', 'Inventory Management', 'Recommendation Engines', 'Mobile Commerce'],
          challenges: [
            'High-traffic website performance',
            'Secure payment processing',
            'Real-time inventory synchronization',
            'Mobile-first user experience',
            'Search and recommendation algorithms',
            'Supply chain integration'
          ],
          patent_landscape: {
            crowded: true,
            patent_count: 12000,
            analysis: 'Crowded patent landscape with established players holding patents in recommendation systems, payment processing, and logistics optimization.'
          }
        }
      };

      const industryKey = industry.toLowerCase();
      const techData = technicalRisksByIndustry[industryKey] || {
        technologies: ['Web Development', 'Database Management', 'Cloud Services', 'Mobile Development'],
        challenges: ['System scalability', 'Data security', 'Performance optimization', 'Integration complexity'],
        patent_landscape: { crowded: false, patent_count: 1500, analysis: 'Moderate patent activity in the space.' }
      };

      const techHash = generateHash('technical' + inputString);
      const riskScore = 30 + (techHash % 40); // Range 30-70
      
      return {
        category: 'Technical Risk',
        risk_score: riskScore,
        risk_level: riskScore >= 60 ? 'High' : riskScore >= 45 ? 'Medium' : 'Low',
        key_technologies: techData.technologies,
        technical_challenges: techData.challenges,
        patent_landscape: techData.patent_landscape,
        development_complexity: riskScore >= 55 ? 'High' : riskScore >= 40 ? 'Medium' : 'Low',
        estimated_dev_time: riskScore >= 55 ? '18-36 months' : riskScore >= 40 ? '12-18 months' : '6-12 months',
        recommendations: [
          'Conduct thorough technology stack evaluation',
          'Implement robust testing and QA processes',
          'Plan for scalability from day one',
          'Regular security audits and penetration testing',
          'Build strong technical advisory team'
        ]
      };
    };

    // Market Risk Analysis
    const generateMarketRisk = () => {
      const marketRisksByIndustry = {
        'fintech': {
          trends: {
            growing: ['Digital payments', 'Cryptocurrency adoption', 'Open banking', 'Embedded finance'],
            declining: ['Traditional banking', 'Cash transactions', 'Physical branches'],
            stable: ['Credit scoring', 'Investment management', 'Insurance products']
          },
          sentiment: 'positive',
          market_signals: [
            'Increased VC investment in fintech (+45% YoY)',
            'Regulatory support for open banking initiatives',
            'Growing consumer adoption of digital payments',
            'Major tech companies entering financial services'
          ],
          competitive_landscape: 'Highly competitive with both startups and established players'
        },
        'healthcare': {
          trends: {
            growing: ['Telemedicine', 'AI diagnostics', 'Personalized medicine', 'Digital therapeutics'],
            declining: ['Traditional in-person consultations', 'Paper-based records'],
            stable: ['Hospital management systems', 'Medical devices', 'Pharmaceutical research']
          },
          sentiment: 'positive',
          market_signals: [
            'Post-COVID acceleration in digital health adoption',
            'Increased healthcare IT spending (+12% annually)',
            'Growing acceptance of remote patient monitoring',
            'Regulatory support for digital health solutions'
          ],
          competitive_landscape: 'Fragmented market with opportunities for specialized solutions'
        },
        'technology': {
          trends: {
            growing: ['AI/ML', 'Cloud computing', 'Cybersecurity', 'Remote work tools'],
            declining: ['On-premise software', 'Legacy systems'],
            stable: ['Enterprise software', 'Mobile applications', 'Web development']
          },
          sentiment: 'positive',
          market_signals: [
            'Continued digital transformation across industries',
            'Strong demand for AI and automation solutions',
            'Increased cybersecurity spending',
            'Growth in remote work technology adoption'
          ],
          competitive_landscape: 'Highly competitive but with room for innovation'
        },
        'ecommerce': {
          trends: {
            growing: ['Mobile commerce', 'Social commerce', 'Sustainable products', 'Personalization'],
            declining: ['Traditional retail', 'Generic mass market approaches'],
            stable: ['Online marketplaces', 'Logistics and fulfillment', 'Payment processing']
          },
          sentiment: 'mixed',
          market_signals: [
            'Continued growth in online shopping (+8% annually)',
            'Increasing customer acquisition costs',
            'Supply chain challenges and inflation pressures',
            'Growing importance of sustainability and ethics'
          ],
          competitive_landscape: 'Extremely competitive with high customer acquisition costs'
        }
      };

      const industryKey = industry.toLowerCase();
      const marketData = marketRisksByIndustry[industryKey] || {
        trends: {
          growing: ['Digital adoption', 'Automation'],
          declining: ['Traditional methods'],
          stable: ['Core business functions']
        },
        sentiment: 'neutral',
        market_signals: ['Mixed market conditions'],
        competitive_landscape: 'Moderate competition'
      };

      const marketHash = generateHash('market' + inputString);
      const riskScore = 25 + (marketHash % 50); // Range 25-75
      
      return {
        category: 'Market Risk',
        risk_score: riskScore,
        risk_level: riskScore >= 60 ? 'High' : riskScore >= 45 ? 'Medium' : 'Low',
        trend_analysis: marketData.trends,
        market_sentiment: marketData.sentiment,
        market_signals: marketData.market_signals,
        competitive_landscape: marketData.competitive_landscape,
        market_timing: riskScore <= 40 ? 'Favorable' : riskScore <= 60 ? 'Moderate' : 'Challenging',
        customer_acquisition_difficulty: riskScore >= 55 ? 'High' : riskScore >= 40 ? 'Medium' : 'Low',
        recommendations: [
          'Conduct thorough competitive analysis',
          'Validate product-market fit early',
          'Monitor industry trends and adapt quickly',
          'Build strong customer relationships',
          'Develop differentiated value proposition'
        ]
      };
    };

    // Generate comprehensive risk assessment
    const legalRisk = generateLegalRisk();
    const technicalRisk = generateTechnicalRisk();
    const marketRisk = generateMarketRisk();

    // Calculate overall risk assessment
    const allRisks = [legalRisk, technicalRisk, marketRisk];
    const averageRisk = allRisks.reduce((sum, risk) => sum + risk.risk_score, 0) / allRisks.length;
    const overallRiskLevel = averageRisk >= 55 ? 'High' : averageRisk >= 40 ? 'Medium' : 'Low';

    // Find highest risk category
    const highestRisk = allRisks.reduce((highest, current) => 
      current.risk_score > highest.risk_score ? current : highest
    );

    // Generate overall recommendations
    const overallRecommendations = [
      `Priority focus: ${highestRisk.category} (${highestRisk.risk_level} risk)`,
      'Develop comprehensive risk management framework',
      'Establish regular risk monitoring and review processes',
      'Build advisory team with legal, technical, and market expertise',
      'Implement phased rollout strategy to minimize exposure',
      'Maintain contingency plans for high-risk scenarios'
    ];

    const riskAssessmentData = {
      industry,
      location,
      audience,
      description,
      timestamp: new Date().toISOString(),
      overall_risk_level: overallRiskLevel,
      overall_risk_score: Math.round(averageRisk),
      
      // Individual risk categories
      legal_risk: legalRisk,
      technical_risk: technicalRisk,
      market_risk: marketRisk,
      
      // Summary and recommendations
      risk_summary: {
        highest_risk_category: highestRisk.category,
        highest_risk_score: highestRisk.risk_score,
        total_risk_factors: [
          ...legalRisk.key_concerns,
          ...technicalRisk.technical_challenges,
          ...marketRisk.market_signals
        ].length,
        mitigation_priority: overallRiskLevel === 'High' ? 'Immediate action required' : 
                           overallRiskLevel === 'Medium' ? 'Plan mitigation strategies within 30 days' : 'Monitor and maintain current approach',
        confidence_level: 85 + (hash % 10), // Range 85-95%
        assessment_date: new Date().toLocaleDateString()
      },
      
      key_recommendations: overallRecommendations,
      
      // Additional insights
      risk_insights: {
        legal_complexity: legalRisk.compliance_complexity,
        technical_complexity: technicalRisk.development_complexity,
        market_timing: marketRisk.market_timing,
        estimated_compliance_cost: legalRisk.estimated_compliance_cost,
        estimated_development_time: technicalRisk.estimated_dev_time,
        customer_acquisition_difficulty: marketRisk.customer_acquisition_difficulty
      }
    };

    return NextResponse.json(riskAssessmentData);

  } catch (error) {
    console.error('Risk assessment API error:', error);
    return NextResponse.json(
      { error: 'Failed to generate risk assessment' },
      { status: 500 }
    );
  }
}