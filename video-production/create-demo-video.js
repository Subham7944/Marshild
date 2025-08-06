/**
 * Automated Demo Video Creation Script
 * This script helps automate the demo video creation process
 * Run with: node create-demo-video.js
 */

const fs = require('fs');
const path = require('path');

// Video configuration
const videoConfig = {
  title: "Marshild AI Startup Validator Demo",
  duration: "3-4 minutes",
  resolution: "1920x1080",
  fps: 30,
  format: "mp4"
};

// Demo script with timing
const demoScript = [
  {
    scene: 1,
    title: "Introduction",
    duration: "0:00 - 0:20",
    action: "Show homepage and hero section",
    voiceover: "Meet Marshild - the AI-powered platform that validates your startup idea in minutes, not months."
  },
  {
    scene: 2,
    title: "Idea Input",
    duration: "0:20 - 0:45",
    action: "Fill out validation form with sample data",
    voiceover: "Let's validate a real startup idea: AI-powered fitness app for busy professionals."
  },
  {
    scene: 3,
    title: "AI Analysis",
    duration: "0:45 - 1:10",
    action: "Show loading and progress indicators",
    voiceover: "Our AI processes your idea against thousands of data points in real-time."
  },
  {
    scene: 4,
    title: "Market Research",
    duration: "1:10 - 1:45",
    action: "Display market research results and charts",
    voiceover: "Google Trends shows 34% growth, with a $4.2B market opportunity identified."
  },
  {
    scene: 5,
    title: "Risk Assessment",
    duration: "1:45 - 2:10",
    action: "Show risk dashboard with color-coded risks",
    voiceover: "AI identifies moderate competition risk but low regulatory barriers."
  },
  {
    scene: 6,
    title: "Competitor Analysis",
    duration: "2:10 - 2:35",
    action: "Display competitor profiles and funding data",
    voiceover: "12 direct competitors found, including MyFitnessPal with $475M funding."
  },
  {
    scene: 7,
    title: "SWOT Analysis",
    duration: "2:35 - 2:55",
    action: "Show SWOT matrix with AI insights",
    voiceover: "AI-powered SWOT reveals key strengths and market opportunities."
  },
  {
    scene: 8,
    title: "Export Reports",
    duration: "2:55 - 3:20",
    action: "Demonstrate export functionality",
    voiceover: "Export professional reports, pitch decks, and investor presentations."
  },
  {
    scene: 9,
    title: "Call to Action",
    duration: "3:20 - 3:30",
    action: "Show pricing and get started",
    voiceover: "Ready to validate your startup idea? Start free or upgrade to premium."
  }
];

// Sample data for demo
const sampleData = {
  startup: {
    industry: "HealthTech, Fitness",
    location: "North America",
    audience: "Young professionals, Busy executives",
    description: "AI-powered fitness app that creates personalized workout plans for time-constrained professionals"
  },
  results: {
    marketSize: "$4.2B",
    growthRate: "23%",
    trendGrowth: "34%",
    competitorCount: 12,
    marketFitScore: 87
  }
};

// Generate video production checklist
function generateProductionChecklist() {
  const checklist = `
# Video Production Checklist

## Pre-Production
- [ ] Set up screen recording software (OBS Studio/Loom)
- [ ] Configure 1920x1080 resolution
- [ ] Prepare sample startup data: ${JSON.stringify(sampleData.startup, null, 2)}
- [ ] Test audio recording setup
- [ ] Clear browser cache and use incognito mode

## Recording Setup
- [ ] Enable cursor highlighting
- [ ] Set recording frame rate to 30fps
- [ ] Position browser window for optimal recording
- [ ] Test microphone levels
- [ ] Prepare script and practice timing

## Scene-by-Scene Recording
${demoScript.map(scene => `
### Scene ${scene.scene}: ${scene.title} (${scene.duration})
- [ ] Action: ${scene.action}
- [ ] Voiceover: "${scene.voiceover}"
- [ ] Duration check: ${scene.duration}
`).join('')}

## Post-Production
- [ ] Edit video segments together
- [ ] Add branded intro/outro (5 seconds each)
- [ ] Include captions for accessibility
- [ ] Add smooth transitions between scenes
- [ ] Highlight important UI elements
- [ ] Add subtle background music
- [ ] Color correction and audio leveling

## Export & Delivery
- [ ] Export as marshild-demo.mp4 (H.264, 1920x1080, 30fps)
- [ ] Create backup in WebM format
- [ ] Generate custom thumbnail
- [ ] Place files in /public/videos/ directory
- [ ] Test video playback in demo modal

## Quality Check
- [ ] Video plays smoothly without stuttering
- [ ] Audio is clear and synchronized
- [ ] All UI elements are clearly visible
- [ ] Captions are accurate and well-timed
- [ ] File size is optimized for web delivery
- [ ] Video works in both light and dark modes

## Alternative Quick Options
- [ ] Use Loom for quick 2-minute screen recording
- [ ] Use Synthesia for AI-generated presenter video
- [ ] Use Canva Video for template-based creation
- [ ] Use OBS Studio for professional screen capture
`;

  return checklist;
}

// Generate voiceover script
function generateVoiceoverScript() {
  const script = `
# Voiceover Script for Marshild Demo Video

## Instructions for Voice Talent
- **Tone:** Professional, friendly, confident
- **Pace:** Moderate (not too fast, not too slow)
- **Duration:** Approximately 3-4 minutes total
- **Style:** Educational and engaging

## Full Script with Timing

${demoScript.map(scene => `
### Scene ${scene.scene}: ${scene.title} (${scene.duration})
"${scene.voiceover}"

*[Pause for ${scene.duration.split(' - ')[1]} - ${scene.duration.split(' - ')[0]}]*
`).join('')}

## Recording Tips
1. Record in a quiet environment
2. Use a quality microphone (USB or XLR)
3. Record each scene separately for easier editing
4. Leave 1-2 seconds of silence at the beginning and end
5. Speak clearly and emphasize key numbers/features
6. Practice the script 2-3 times before recording

## Key Emphasis Points
- "AI-powered platform"
- "minutes, not months"
- "$4.2 billion market opportunity"
- "23% projected growth"
- "real-time analysis"
- "investor-ready insights"
`;

  return script;
}

// Create video production files
function createProductionFiles() {
  const videoDir = path.join(__dirname);
  
  // Ensure directory exists
  if (!fs.existsSync(videoDir)) {
    fs.mkdirSync(videoDir, { recursive: true });
  }

  // Create checklist file
  const checklist = generateProductionChecklist();
  fs.writeFileSync(path.join(videoDir, 'production-checklist.md'), checklist);
  
  // Create voiceover script
  const voiceoverScript = generateVoiceoverScript();
  fs.writeFileSync(path.join(videoDir, 'voiceover-script.md'), voiceoverScript);
  
  // Create sample data file
  const sampleDataJson = JSON.stringify(sampleData, null, 2);
  fs.writeFileSync(path.join(videoDir, 'sample-data.json'), sampleDataJson);
  
  // Create OBS Studio scene configuration
  const obsConfig = {
    scenes: [
      {
        name: "Marshild Demo",
        sources: [
          {
            name: "Browser Capture",
            type: "window_capture",
            settings: {
              window: "Google Chrome",
              capture_cursor: true
            }
          },
          {
            name: "Microphone",
            type: "audio_input_capture",
            settings: {
              device_id: "default"
            }
          }
        ]
      }
    ],
    settings: {
      output: {
        mode: "Simple",
        format: "mp4",
        video_bitrate: 2500,
        audio_bitrate: 160,
        resolution: "1920x1080",
        fps: 30
      }
    }
  };
  
  fs.writeFileSync(path.join(videoDir, 'obs-config.json'), JSON.stringify(obsConfig, null, 2));
  
  console.log('✅ Video production files created successfully!');
  console.log('📁 Files created:');
  console.log('   - production-checklist.md');
  console.log('   - voiceover-script.md');
  console.log('   - sample-data.json');
  console.log('   - obs-config.json');
  console.log('');
  console.log('🎬 Next steps:');
  console.log('1. Review the production checklist');
  console.log('2. Set up your recording software');
  console.log('3. Practice with the voiceover script');
  console.log('4. Record your demo video');
  console.log('5. Place final video at /public/videos/marshild-demo.mp4');
}

// Run the script
if (require.main === module) {
  createProductionFiles();
}

module.exports = {
  videoConfig,
  demoScript,
  sampleData,
  generateProductionChecklist,
  generateVoiceoverScript,
  createProductionFiles
};
