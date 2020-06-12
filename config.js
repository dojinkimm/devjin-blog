module.exports = {
  /** Site MetaData (Required all)*/
  title: `DevJin-Blog`,                           // (* Required)
  description: `DevJin-Blog`, // (* Required)
  author: `Junho Baik`,                         // (* Required)
  siteUrl: 'https://devjin-blog.com',       // (* Required) 
  // ex.'https://junhobaik.github.io'
  // ex.'https://junhobaik.github.io/' << X, Do not enter "/" at the end.

  /** Header */
  profileImageFileName: 'profile.png', // include filename extension ex.'profile.jpg'
  // The Profile image file is located at path "./images/"
  // If the file does not exist, it is replaced by a random image.

  /** Home > Bio information*/
  comment: 'Junior Server Developer',
  name: 'Dojin Kim',
  company: '',
  location: 'Korea',
  email: 'dojinkim119@gmail.com',
  website: 'https://devjin-blog.com',
  linkedin: '',                                     // ex.'https://www.linkedin.com/in/junho-baik-16073a19ab'
  facebook: '',                                     // ex.'https://www.facebook.com/zuck' or 'https://www.facebook.com/profile.php?id=000000000000000'
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
