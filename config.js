module.exports = {
  /** Site MetaData (Required all)*/
  title: `DevJin-Blog`,                           // (* Required)
  description: `DevJin-Blog`, // (* Required)
  author: `Dojin Kim`,                         // (* Required)
  siteUrl: 'https://devjin-blog.com',       // (* Required) 

  /** Header */
  profileImageFileName: 'profile.png', // include filename extension ex.'profile.jpg'
  // The Profile image file is located at path "./images/"
  // If the file does not exist, it is replaced by a random image.

  /** Home > Bio information*/
  comment: 'Junior Server Developer @Rainist',
  name: 'Dojin Kim',
  company: '@Rainist',
  location: 'Korea',
  email: 'dojinkim119@gmail.com',
  website: 'https://devjin-blog.com',
  linkedin: 'https://www.linkedin.com/in/dojin-henry-kim-64080a158/',    
  facebook: 'https://www.facebook.com/dojin1',                                
  instagram: '',                                    // ex.'https://www.instagram.com/junhobaik'
  github: 'https://github.com/dojinkimm',

  /** Post */
  enablePostOfContents: true,     // TableOfContents activation (Type of Value: Boolean. Not String)
  disqusShortname: 'dojinkim',   // comments (Disqus sort-name)
  enableSocialShare: true,        // Social share icon activation (Type of Value: Boolean. Not String)

  /** Optional */
  googleAnalytics: '',                                  // Google Analytics TrackingID. ex.'UA-123456789-0'
  googleSearchConsole: '', // content value in HTML tag of google search console ownership verification 
  googleAdsenseSlot: '',                                    // Google Adsense Slot. ex.'5214956675'
  googleAdsenseClient: '',                     // Google Adsense Client. ex.'ca-pub-5001380215831339'
  // Please correct the adsense client number(ex.5001380215831339) in the './static/ads.txt' file.
};
