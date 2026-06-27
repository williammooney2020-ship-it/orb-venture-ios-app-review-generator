// App Store Review Response Generator — template engine, no API required.

const CRASH_WORDS   = /crash|crashing|crashes|freeze|frozen|hang|stuck|close|quit|exit|force\s*quit|not\s*open|won.t\s*launch|won.t\s*open/i;
const BUG_WORDS     = /bug|glitch|broken|doesn.t\s*work|not\s*working|error|issue|problem|fail|failed|disappear|missing|lost/i;
const FEATURE_WORDS = /wish|want|need|add|please|request|would\s*(be\s*)?great|should\s*have|why\s*(isn.t|don.t|can.t)|love\s*(to\s*see|if)/i;
const PRICE_WORDS   = /price|priced|expensive|costly|cost|paid|pay|paying|subscription|worth|value|cheap|free|refund/i;
const PRAISE_WORDS  = /love|great|amazing|excellent|awesome|perfect|best|fantastic|wonderful|brilliant|incredible|favourite|favorite|five\s*star/i;
const COMPARE_WORDS = /better than|compared|alternative|instead of|used to|switched|competitor/i;
const DATA_WORDS    = /data|account|login|sign\s*in|password|restore|purchase|subscription|sync|backup/i;

function detectIntent(text) {
  const intents = [];
  if (CRASH_WORDS.test(text))   intents.push("crash");
  if (BUG_WORDS.test(text))     intents.push("bug");
  if (FEATURE_WORDS.test(text)) intents.push("feature");
  if (PRICE_WORDS.test(text))   intents.push("price");
  if (PRAISE_WORDS.test(text))  intents.push("praise");
  if (COMPARE_WORDS.test(text)) intents.push("compare");
  if (DATA_WORDS.test(text))    intents.push("data");
  return intents;
}

function buildResponses(reviewText, appName, stars, tone) {
  const intents = detectIntent(reviewText);
  const isPositive = stars >= 4;
  const isNeutral  = stars === 3;
  const isNegative = stars <= 2;

  const a = appName;

  if (isPositive && intents.includes("praise") && intents.length <= 1) {
    return positivePraiseResponses(a, tone);
  }
  if (isPositive && intents.includes("feature")) {
    return positiveWithFeatureResponses(a, tone);
  }
  if (isNegative && intents.includes("crash")) {
    return crashResponses(a, tone);
  }
  if (isNegative && intents.includes("bug")) {
    return bugResponses(a, tone);
  }
  if (isNegative && intents.includes("price")) {
    return priceResponses(a, tone);
  }
  if (intents.includes("data") || intents.includes("bug")) {
    return dataOrAccountResponses(a, tone, stars);
  }
  if (intents.includes("feature")) {
    return featureResponses(a, tone, stars);
  }
  if (isNeutral) {
    return neutralResponses(a, tone);
  }
  if (isNegative) {
    return genericNegativeResponses(a, tone);
  }
  return positivePraiseResponses(a, tone);
}

// ── Openings by tone ─────────────────────────────────────────────────────────
function open(tone, stars) {
  if (tone === "professional") {
    if (stars >= 4) return "Thank you for your kind review — it means a great deal to us.";
    if (stars === 3) return "Thank you for taking the time to share your feedback.";
    return "Thank you for letting us know about your experience.";
  }
  if (tone === "friendly") {
    if (stars >= 4) return "Wow, thank you so much — this honestly made our day! 🙌";
    if (stars === 3) return "Thanks for leaving us a review — we really appreciate the honest feedback!";
    return "Hey, thanks for the honest feedback — we're really sorry to hear this happened.";
  }
  if (tone === "apologetic") {
    if (stars >= 4) return "Thank you so much for the wonderful review!";
    return "We're truly sorry to hear you had this experience — you deserve better.";
  }
  return "";
}

function close(tone, appName) {
  if (tone === "professional") return `If there is anything we can do to help, please reach out to our support team — we are committed to making ${appName} the best it can be.`;
  if (tone === "friendly")     return `If there's anything we can do to help, don't hesitate to reach out! We're a small team but we genuinely care. 💙`;
  if (tone === "apologetic")   return `Please reach out to our support team — fixing this for you is our top priority, and we don't want you to leave unhappy.`;
  return "";
}

// ── Response families ─────────────────────────────────────────────────────────
function positivePraiseResponses(a, tone) {
  return [
    `${open(tone, 5)}\n\nReviews like yours keep us going and remind us why we build ${a}. We'll keep working hard to maintain the quality you've come to expect.\n\n${close(tone, a)}`,
    `${open(tone, 5)}\n\nWe're so glad ${a} is hitting the mark for you. Your support motivates the whole team. If there's ever a feature you'd love to see added, we're always listening.\n\n${close(tone, a)}`,
    `${open(tone, 5)}\n\nWe pour a lot of love into ${a}, and it's incredibly rewarding to know it's making a difference. Thank you for being part of our community.\n\n${close(tone, a)}`,
  ];
}

function positiveWithFeatureResponses(a, tone) {
  return [
    `${open(tone, 4)}\n\nWe love hearing what our users would like to see next. Your feature suggestion has been noted and passed along to our product team. We can't promise timelines, but we genuinely evaluate every request.\n\n${close(tone, a)}`,
    `${open(tone, 4)}\n\nThank you for the suggestion alongside your kind words! We're always working to improve ${a}, and user feedback like yours shapes our roadmap. Keep an eye out for future updates.\n\n${close(tone, a)}`,
    `${open(tone, 4)}\n\nWe really appreciate you sharing that idea. Requests from real users are the best source of inspiration for what to build next. We'll take this on board as we plan upcoming releases.\n\n${close(tone, a)}`,
  ];
}

function crashResponses(a, tone) {
  return [
    `${open(tone, 1)}\n\nA crash like this is completely unacceptable, and we sincerely apologise. Our team would love to investigate what's happening on your device. Please reach out to us with your device model and iOS version so we can pinpoint the cause and push a fix as quickly as possible.\n\n${close(tone, a)}`,
    `${open(tone, 1)}\n\nWe take crashes in ${a} very seriously. This sounds like something specific to your setup that we need to track down. Could you contact our support team with details about when the crash happens? Your report helps us protect every user from the same issue.\n\n${close(tone, a)}`,
    `${open(tone, 1)}\n\nCrashes are our highest priority to fix. We'd like to get the specifics from you — your iOS version, device, and the exact steps that trigger the crash — so we can reproduce and resolve it. Please reach out and we'll make this right.\n\n${close(tone, a)}`,
  ];
}

function bugResponses(a, tone) {
  return [
    `${open(tone, 1)}\n\nWe're sorry the issue you encountered got in the way of your experience. Our team actively monitors bug reports and we'd like to investigate this one directly. Please get in touch with the steps to reproduce it — your report will help us prioritise a fix.\n\n${close(tone, a)}`,
    `${open(tone, 1)}\n\nThank you for flagging this. Bugs like this slip through despite testing and we appreciate you taking the time to report it. If you can share more details via our support channel, we'll look into it right away.\n\n${close(tone, a)}`,
    `${open(tone, 1)}\n\nWe're sorry ${a} let you down here. We've noted the issue and would love more information so we can reproduce and fix it quickly. Please reach out to support — we read every message.\n\n${close(tone, a)}`,
  ];
}

function priceResponses(a, tone) {
  return [
    `${open(tone, 2)}\n\nWe understand pricing is an important factor and we appreciate you sharing your thoughts. Pricing decisions are never easy as an independent developer, and we strive to ensure ${a} delivers lasting value. If you'd like to discuss your specific situation, please reach out to our support team.\n\n${close(tone, a)}`,
    `${open(tone, 2)}\n\nThank you for the honest feedback on pricing. We continually review how we structure ${a}'s costs and feedback like yours helps us make that decision thoughtfully. We hope you'll give us another look if that changes.\n\n${close(tone, a)}`,
    `${open(tone, 2)}\n\nWe hear you. Building a sustainable indie app is a challenge, and we know not every pricing model suits every user. If you have questions about what's included or need help, please reach out — we're happy to make sure you're getting the most from ${a}.\n\n${close(tone, a)}`,
  ];
}

function dataOrAccountResponses(a, tone, stars) {
  return [
    `${open(tone, stars)}\n\nAccount and data issues are our top priority to resolve. We'd hate for you to lose access to anything important in ${a}. Please contact our support team directly — we'll investigate your account and do everything we can to restore things to how they should be.\n\n${close(tone, a)}`,
    `${open(tone, stars)}\n\nWe're sorry to hear you ran into this. Issues like this are best handled one-on-one with our support team who have the access needed to look into your account. Please reach out as soon as you can and we'll sort this out together.\n\n${close(tone, a)}`,
    `${open(tone, stars)}\n\nThis isn't the experience we want for you. Our support team is ready to investigate what happened with your account and data. Please reach out with your details and we'll make resolving this our immediate priority.\n\n${close(tone, a)}`,
  ];
}

function featureResponses(a, tone, stars) {
  return [
    `${open(tone, stars)}\n\nThank you for taking the time to share your idea. We can't commit to specific features or timelines in this reply, but every suggestion is reviewed by our team when planning upcoming updates. Keep an eye out for new releases.\n\n${close(tone, a)}`,
    `${open(tone, stars)}\n\nWe really appreciate feature requests — they help us build what our users actually need. Your idea has been noted and will be considered in our roadmap discussions. We hope to have something worth checking out in a future update.\n\n${close(tone, a)}`,
    `${open(tone, stars)}\n\nLove the idea — thank you for sharing it. Building the right things for our users is core to how we develop ${a}, and feedback like yours goes straight into our planning process.\n\n${close(tone, a)}`,
  ];
}

function neutralResponses(a, tone) {
  return [
    `${open(tone, 3)}\n\nWe appreciate the balanced review. If there are specific areas where ${a} fell short for you, we'd genuinely like to hear them. Your feedback helps us improve with every update.\n\n${close(tone, a)}`,
    `${open(tone, 3)}\n\nThank you for sharing your honest thoughts. We're always working to make ${a} better and reviews like yours help us understand where to focus. If anything specific frustrated you, please let us know.\n\n${close(tone, a)}`,
    `${open(tone, 3)}\n\nWe take three-star reviews seriously — they tell us there's room to improve. If you're willing to share what held you back from a higher rating, we'd love to address it in a future update.\n\n${close(tone, a)}`,
  ];
}

function genericNegativeResponses(a, tone) {
  return [
    `${open(tone, 1)}\n\nWe're truly sorry to hear ${a} didn't meet your expectations. We want to understand exactly what went wrong and make it right. Please reach out to our support team with more details so we can investigate.\n\n${close(tone, a)}`,
    `${open(tone, 1)}\n\nThank you for leaving your review, even if your experience was disappointing. We don't want any user to feel let down by ${a}. Please contact us directly — we'd like a chance to turn this around.\n\n${close(tone, a)}`,
    `${open(tone, 1)}\n\nWe're sorry. Feedback like this helps us see where we've failed to deliver the experience our users deserve. Please reach out to our support team — we're committed to finding a resolution for you.\n\n${close(tone, a)}`,
  ];
}
