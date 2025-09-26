/**
 * Personalized Welcome Letter Service
 * Serves personalized welcome letters based on user email and role
 */

export interface PersonalizedWelcomeData {
  exists: boolean;
  content: string;
  userEmail: string;
  fallbackUsed: boolean;
  error?: string;
}

export class PersonalizedWelcomeService {
  /**
   * Get personalized welcome letter content for a user
   */
  static async getPersonalizedWelcome(userEmail: string): Promise<PersonalizedWelcomeData> {
    try {
      console.log(`🎯 Loading personalized welcome letter for: ${userEmail}`);
      
      // Map email to first name for privacy-safe file names
      const firstName = this.getFirstNameFromEmail(userEmail);
      
      // Try to load the personalized letter first
      const personalizedPath = `/docs/platform-admin/welcome-letters/${firstName}.md`;
      
      try {
        const response = await fetch(personalizedPath);
        
        if (response.ok) {
          const content = await response.text();
          console.log(`✅ Found personalized welcome letter for ${userEmail} (${firstName})`);
          
          return {
            exists: true,
            content,
            userEmail,
            fallbackUsed: false
          };
        }
      } catch {
        console.log(`⚠️ Personalized letter not found for ${userEmail} (${firstName}), trying fallback`);
      }
      
      // Fallback to default welcome letter
      const defaultResponse = await fetch('/docs/platform-admin/welcome-letter.md');
      
      if (defaultResponse.ok) {
        const content = await defaultResponse.text();
        console.log(`📄 Using default welcome letter for ${userEmail}`);
        
        return {
          exists: false,
          content,
          userEmail,
          fallbackUsed: true
        };
      }
      
      throw new Error('Neither personalized nor default welcome letter found');
      
    } catch (error) {
      console.error(`❌ Error loading welcome letter for ${userEmail}:`, error);
      
      return {
        exists: false,
        content: this.getEmergencyFallback(userEmail),
        userEmail,
        fallbackUsed: true,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Get list of available personalized welcome letters (by first name)
   */
  static getAvailablePersonalizedLetters(): string[] {
    return [
      'joel',
      'marc',
      'alexander',
      'dominique',
      'doug',
      'sen',
      'christine',
      'zaffia',
      'morgan',
      'aryan',
      'gunnar',
      'jeff',
      'royaltri'
    ];
  }

  /**
   * Check if a personalized letter exists for a user
   */
  static hasPersonalizedLetter(userEmail: string): boolean {
    const firstName = this.getFirstNameFromEmail(userEmail);
    return this.getAvailablePersonalizedLetters().includes(firstName.toLowerCase());
  }

  /**
   * Get role-based greeting for personalized letters
   */
  static getRoleBasedGreeting(userEmail: string): string {
    const roleMap: { [key: string]: string } = {
      'joel.yaffe@gmail.com': 'Chief Technology Officer & Founder',
      'alaghetts@gmail.com': 'Product Design & Engineering Specialist', 
      'alexanderkline13@gmail.com': 'Operations & Partnerships Director',
      'deefactorial@gmail.com': 'Blockchain Engineer & AI Team Lead',
      'doug.kukura@gmail.com': 'DeFi, Payments & Partnerships Strategist',
      'senw@royaltri.com': 'Brand, Marketing & Publicity Director',
      'christinesavardmedia@gmail.com': 'Marketing, Outreach & Onboarding Specialist',
      'zaffialaplante@gmail.com': 'Public Relations, Onboarding & Partnerships Director',
      'morganhirtle@gmail.com': 'Participant Support Services & EcoSystem Specialist',
      'srivastavaaryan005@gmail.com': 'Data Analyst & Insights Specialist',
      'gunnar.blaze@gmail.com': 'Co-Founder & Strategic Visionary',
      'f.tjeff79@gmail.com': 'Blockchain Advisor & Networking Strategist',
      'admin@royaltri.com': 'Brand, Marketing & Publicity Specialist'
    };
    
    return roleMap[userEmail.toLowerCase()] || 'Platform Administrator';
  }

  /**
   * Emergency fallback content if all else fails
   */
  private static getEmergencyFallback(userEmail: string): string {
    const role = this.getRoleBasedGreeting(userEmail);
    
    return `# Welcome to SHELTR, ${this.extractFirstName(userEmail)}! 🚀

**${role}**

Hey there, amazing team member! Welcome to the SHELTR-AI Platform Administration Team! 

I hope this message finds you well and as excited as I am about what we're building together. I can barely contain my enthusiasm as I write this – we've just reached an incredible milestone with SHELTR-AI, and you're about to be part of something truly revolutionary.

## We're Ready for Internal Testing! 🎉

After months of intense development and countless iterations, **SHELTR-AI is now ready for internal testing and validation**. We're talking about a comprehensive platform that's going to change how we approach homelessness solutions forever – and you get to be among the first to experience it!

## Your Mission 🎯

Over the next **7 days**, I'd love for you to:

1. **Sign into your platform administrator account** – you should have received your credentials separately
2. **Explore the platform** like you're discovering a new city
3. **Test the features** relevant to your role and expertise
4. **Take notes** on anything that feels confusing or could be improved

## Where to Start?

Once you're logged in, head straight to the **Platform Administrator Guide** in your sidebar navigation. 

## Core Platform Links 🔗

- **🏠 Main Platform**: https://sheltr-ai.web.app
- **🎯 Dashboard Hub**: https://sheltr-ai.web.app/dashboard
- **💝 Donation Experience**: https://sheltr-ai.web.app/scan-give
- **📚 Documentation**: https://sheltr-ai.web.app/docs

## Why This Matters

Every person experiencing homelessness deserves dignity, transparency, and real solutions. We're not just managing homelessness – we're solving it. And you're now part of that solution.

Welcome to the team, welcome to the future, and welcome to SHELTR-AI! 🏠✨

Let's do this thing!

With endless gratitude and excitement,

**Joel Yaffe, CTO & Founder**

---

*This is an emergency fallback welcome letter. A personalized version should be available soon.*`;
  }

  /**
   * Get first name from email for privacy-safe file names
   */
  static getFirstNameFromEmail(email: string): string {
    const nameMap: { [key: string]: string } = {
      'joel.yaffe@gmail.com': 'joel',
      'alaghetts@gmail.com': 'marc', // Updated to Marc based on your edits
      'alexanderkline13@gmail.com': 'alexander',
      'deefactorial@gmail.com': 'dominique', // Updated to Dominique based on your edits
      'doug.kukura@gmail.com': 'doug',
      'senw@royaltri.com': 'sen',
      'christinesavardmedia@gmail.com': 'christine',
      'zaffialaplante@gmail.com': 'zaffia',
      'morganhirtle@gmail.com': 'morgan',
      'srivastavaaryan005@gmail.com': 'aryan',
      'gunnar.blaze@gmail.com': 'gunnar',
      'f.tjeff79@gmail.com': 'jeff',
      'admin@royaltri.com': 'royaltri'
    };
    
    return nameMap[email.toLowerCase()] || email.split('@')[0].split('.')[0];
  }

  /**
   * Extract first name from email for personalization (display purposes)
   */
  private static extractFirstName(email: string): string {
    const nameMap: { [key: string]: string } = {
      'joel.yaffe@gmail.com': 'Joel',
      'alaghetts@gmail.com': 'Marc', // Updated to Marc based on your edits
      'alexanderkline13@gmail.com': 'Alexander',
      'deefactorial@gmail.com': 'Dominique', // Updated to Dominique based on your edits
      'doug.kukura@gmail.com': 'Doug',
      'senw@royaltri.com': 'Sen',
      'christinesavardmedia@gmail.com': 'Christine',
      'zaffialaplante@gmail.com': 'Zaffia',
      'morganhirtle@gmail.com': 'Morgan',
      'srivastavaaryan005@gmail.com': 'Aryan',
      'gunnar.blaze@gmail.com': 'Gunnar',
      'f.tjeff79@gmail.com': 'Jeff',
      'admin@royaltri.com': 'Team'
    };
    
    return nameMap[email.toLowerCase()] || email.split('@')[0].split('.')[0];
  }

  /**
   * Get welcome letter statistics
   */
  static getWelcomeLetterStats() {
    const availableLetters = this.getAvailablePersonalizedLetters();
    
    return {
      totalPersonalizedLetters: availableLetters.length,
      availableEmails: availableLetters,
      hasDefaultFallback: true,
      hasEmergencyFallback: true
    };
  }
}
