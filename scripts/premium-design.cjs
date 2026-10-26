/* Shared visual components for the premium design revision. */
const mark = `<svg viewBox="0 0 48 48" fill="none" aria-hidden="true"><rect x="1" y="1" width="46" height="46" rx="13" fill="currentColor"/><path d="M12 32V20l6-5 6 5 6-5 6 5v12" stroke="var(--logo-ink, white)" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/><path d="m16 28 8 7 8-7" stroke="var(--logo-detail, #D9BE87)" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
const heroImages = {
    about: [
        "hero-about",
        "Relocation coordinator welcoming a family at their new home",
        "People first. Every time.",
    ],
    services: [
        "hero-services",
        "An organized moving crew preparing a residential move",
        "The right care for your move.",
    ],
    "service-details": [
        "hero-service-details",
        "Protected furniture and packed boxes in a bright home",
        "Considered from door to door.",
    ],
    pricing: [
        "hero-pricing",
        "A customer and advisor planning a moving estimate",
        "Clear choices. Considered costs.",
    ],
    "how-it-works": [
        "hero-how-it-works",
        "A move coordinator discussing a plan with a homeowner",
        "A thoughtful plan changes everything.",
    ],
    "service-areas": [
        "hero-service-areas",
        "A moving truck traveling between Indian cities",
        "A new address. The same care.",
    ],
    blog: [
        "hero-blog",
        "A moving notebook and carefully arranged packing supplies",
        "Small ideas for a better move.",
    ],
    "blog-details": [
        "hero-blog-details",
        "Homeowner wrapping delicate ceramics with care",
        "A little knowledge goes a long way.",
    ],
    contact: [
        "hero-contact",
        "A friendly relocation advisor in a calm studio",
        "Good moves begin with a conversation.",
    ],
};
function pageHero(title, desc, eyebrow, { file, image, href, icon }) {
    const key = file.split("/").pop().replace(".html", "");
    const photo = heroImages[key];
    const notes = {
        about: ["people", "Meet the people behind your next chapter"],
        services: ["box", "Choose the support your move needs"],
        "service-details": ["shield", "Protection matched to your belongings"],
        pricing: ["wallet", "Review the scope before you decide"],
        "how-it-works": ["calendar", "One clear plan, from survey to settlement"],
        "service-areas": ["pin", "Find care along your moving route"],
        blog: ["leaf", "Practical reading for a calmer moving day"],
        "blog-details": ["box", "Useful advice to put into practice"],
        contact: ["mail", "Tell us where your next chapter begins"],
    };
    const note = notes[key] || ["home", "Make yourself at home"];
    return `<section class="page-hero page-hero-visual hero-layout-${key}"><div class="site-container"><nav class="breadcrumb" aria-label="Breadcrumb"><a href="${href("pages/home-1.html")}">Home</a>${icon("chevron")}<span>${title}</span></nav><div class="inner-hero-grid"><div class="inner-hero-copy"><span class="eyebrow">${eyebrow}</span><h1>${title}</h1><p>${desc}</p><span class="hero-signature">${icon(note[0])}${note[1]}</span></div>${photo ? `<div class="inner-hero-media">${image(photo[0], photo[1], "", true)}<div class="image-caption"><span class="caption-icon">${icon(note[0])}</span><span>${photo[2]}</span></div></div>` : ""}</div></div></section>`;
}
const steps = [
    [
        "step-quote",
        "file",
        "Request a quote",
        "Tell us about your home, your route and the things that need a little extra care.",
        "pages/contact.html",
        "Start a conversation",
    ],
    [
        "step-plan",
        "clock",
        "Plan your move",
        "Set a date, organize your inventory and agree on a plan that fits your day.",
        "pages/how-it-works.html",
        "Explore the plan",
    ],
    [
        "step-transport",
        "truck",
        "Pack & transport",
        "Purposeful protection, organized loading and a considered journey to your new address.",
        "pages/service-details.html?service=packing",
        "See our approach",
    ],
    [
        "step-delivery",
        "home",
        "Settle in, happily",
        "A careful handover, a final inventory check and a little room to feel at home.",
        "dashboard/move-tracking.html",
        "Explore tracking",
    ],
];
function process({ file, image, href, icon }) {
    if (file === "pages/home-1.html")
        return `<div class="process-gallery">${steps.map(([photo, ic, title, description, url, action], index) => `<article class="process-card"><div class="process-photo">${image(photo, title)}<span class="process-number">0${index + 1}</span></div><div class="process-body"><span class="process-icon">${icon(ic)}</span><h3>${title}</h3><p>${description}</p><a class="text-link" href="${href(url)}">${action}${icon("arrow")}</a></div></article>`).join("")}</div>`;
    if (file === "pages/how-it-works.html")
        return `<div class="journey-overview"><article><span class="round-icon">${icon("file")}</span><span class="eyebrow">Before your move</span><h3>Make space for a good plan.</h3><p>Choose your service, review the inventory and confirm access at both addresses.</p><ul class="check-list"><li>A written service scope</li><li>A practical moving schedule</li></ul></article><article><span class="round-icon">${icon("truck")}</span><span class="eyebrow">On moving day</span><h3>Keep every detail together.</h3><p>Meet your crew, check the loading list and follow the planned packing and transport sequence.</p><ul class="check-list"><li>Room-by-room organization</li><li>Clear progress milestones</li></ul></article><article><span class="round-icon">${icon("home")}</span><span class="eyebrow">At your new home</span><h3>Arrive with a little clarity.</h3><p>Match the delivered inventory, place boxes in the right rooms and settle the essentials first.</p><ul class="check-list"><li>A considered handover</li><li>A final walkthrough</li></ul></article></div>`;
    return `<div class="service-route">${[
        [
            "01",
            "Assess your inventory",
            "We identify access, volume and specialist handling before a vehicle is planned.",
            "file",
        ],
        [
            "02",
            "Prepare your protection",
            "Materials and labels are chosen for the belongings on your list.",
            "shield",
        ],
        [
            "03",
            "Coordinate the journey",
            "The loading sequence and delivery window are brought into one clear plan.",
            "truck",
        ],
        [
            "04",
            "Complete the handover",
            "Room placement and a final inventory review bring your service to a thoughtful close.",
            "check",
        ],
    ]
        .map(
            ([n, t, d, ic]) =>
                `<article><div class="service-route-top"><span>${n}</span>${icon(ic)}</div><h3>${t}</h3><p>${d}</p></article>`,
        )
        .join("")}</div>`;
}
function solutions({ href, icon }) {
    return `<div class="home-size-grid">${[
        [
            "home",
            "Studio / 1 BHK",
            "A considered move for a compact home.",
            "Bedroom essentials · Small furniture · Everyday belongings",
            "Less volume, the same thoughtful care.",
        ],
        [
            "box",
            "2–3 BHK",
            "Make room for your family’s next chapter.",
            "Room-by-room inventory · Furniture protection · Family essentials",
            "A clear plan for every room.",
        ],
        [
            "shield",
            "Large home / villa",
            "A little more planning for a larger move.",
            "Specialist pieces · Custom packing plan · Coordinated crew",
            "Carefully coordinated, down to the details.",
        ],
    ]
        .map(
            ([ic, t, d, list, note], i) =>
                `<article class="home-size-card"><div class="home-size-top"><span class="round-icon">${icon(ic)}</span><span class="small">0${i + 1} / Home collection</span></div><h3>${t}</h3><p>${d}</p><ul class="check-list">${list
                    .split(" · ")
                    .map((x) => `<li>${x}</li>`)
                    .join(
                        "",
                    )}</ul><p class="home-size-note">${note}</p><a class="text-link" href="${href("pages/pricing.html")}">Explore your estimate${icon("arrow")}</a></article>`,
        )
        .join("")}</div>`;
}
function cta(title, desc, { file, section, image, icon, btn, href }) {
    if (file === "pages/home-1.html")
        return section(
            `<div class="photo-cta">${image("cta-home", "A bright new home with open doors and neatly packed boxes")}<div class="photo-cta-copy"><span class="eyebrow">Your next chapter starts here</span><h2>${title}</h2><p>${desc}</p><div class="actions">${btn("Plan your move", "pages/contact.html", "btn-light")}${btn("Explore services", "pages/services.html", "btn-photo-outline")}</div></div><div class="photo-cta-seal">${icon("shield")}<span>A little care.<br>A better beginning.</span></div></div>`,
        );
    if (file === "pages/about.html")
        return section(
            `<div class="promise-cta"><div><span class="eyebrow">A promise worth keeping</span><h2>A little more human.<br>A whole lot more care.</h2><p>Bring us your questions, your plans and the details that matter to you. A good moving experience starts with people who listen.</p><div class="actions">${btn("Meet your next move", "pages/contact.html")}${btn("Explore our services", "pages/services.html", "btn-outline")}</div></div><div class="promise-art">${mark}<span>Thoughtful by nature.</span><div class="promise-points"><span>${icon("check")} Clear conversations</span><span>${icon("check")} Considered planning</span><span>${icon("check")} Careful handling</span></div></div></div>`,
            "soft",
        );
    if (file === "pages/services.html")
        return section(
            `<div class="service-consult"><div><span class="eyebrow">Not sure where to begin?</span><h2>Find the right kind<br>of help for your move.</h2><p>Start with a simple estimate or tell us about something that needs specialist attention.</p></div><div class="consult-options"><a href="${href("pages/pricing.html")}"><span class="round-icon">${icon("chart")}</span><div><h3>Understand your costs</h3><p>Explore an itemized, illustrative estimate.</p></div>${icon("arrow")}</a><a href="${href("pages/contact.html")}"><span class="round-icon">${icon("phone")}</span><div><h3>Talk through the details</h3><p>Share your route, inventory and questions.</p></div>${icon("arrow")}</a></div></div>`,
        );
    if (file === "pages/service-areas.html")
        return section(
            `<div class="route-cta"><div><span class="eyebrow">Across the street or across the country</span><h2>Your next address.<br>A thoughtfully planned route.</h2><p>Have a route outside the sample network? Tell us where life is taking you and explore the inquiry process.</p>${btn("Ask about your route", "pages/contact.html")}</div><div class="route-illustration" aria-label="Illustrative route from your current home to your next home"><span>${icon("home")}Your home</span><div class="route-line">${icon("truck")}</div><span>${icon("pin")}Your next chapter</span><small>Planning illustration · No live routing</small></div></div>`,
            "soft",
        );
    return section(
        `<div class="detail-cta"><div><span class="eyebrow">Let’s make the details work together</span><h2>Tell us what needs<br>a little extra care.</h2><p>Share your inventory, preferred date and access requirements. Bring the practical details into one clear conversation.</p><div class="actions">${btn("Discuss this service", "pages/contact.html")}${btn("Explore an estimate", "pages/pricing.html", "btn-outline")}</div></div><aside><span class="round-icon">${icon("file")}</span><h3>A useful first conversation</h3><ul class="check-list"><li>Your pickup and delivery locations</li><li>Home size and specialist belongings</li><li>Preferred date and building access</li></ul></aside></div>`,
        "soft",
    );
}
const benefits = {
    "pages/home-2.html": [
        ["file", "A written plan", "Your scope and inventory, clearly organized."],
        ["phone", "One familiar contact", "A coordinator who knows the details."],
        ["box", "Protection with purpose", "Materials chosen for each kind of belonging."],
        ["truck", "Considered loading", "An organized sequence for a smoother arrival."],
        ["clock", "Time to prepare", "Practical milestones before moving day."],
        ["home", "A careful handover", "A final check to help you settle in."],
    ],
    "pages/services.html": [
        ["home", "For every kind of address", "From compact apartments to shared offices."],
        ["shield", "For things that need care", "Appropriate protection for delicate pieces."],
        ["file", "For a clearer estimate", "An itemized scope before you decide."],
        ["people", "For a coordinated day", "Crew and loading plans that work together."],
        ["pin", "For near and far", "Local and intercity planning options."],
        ["phone", "For your questions", "A useful conversation before the first box."],
    ],
};
const priceFaqs = [
    [
        "Is this a confirmed moving quotation?",
        "No. The calculator provides an illustrative planning estimate using editable sample rules. A real provider must verify your inventory, route, access and availability.",
    ],
    [
        "Are taxes included in the estimate?",
        "Taxes are not applied in this front-end sample. A real quotation should show the applicable tax treatment and any clearly agreed additional charges.",
    ],
    [
        "How do floors and elevators affect the estimate?",
        "The sample adds a floor-based labour allowance when no elevator is available. Update the floor and elevator fields to see the difference in the itemized estimate.",
    ],
    [
        "Can I change the packing or additional services?",
        "Yes. Compare standard packing, premium protection and no packing, then add unpacking or furniture assembly. Each selection appears in the estimate breakdown.",
    ],
];
const contactFaqs = [
    [
        "What happens when I submit this form?",
        "Your inquiry is saved in this browser and appears in the admin sample inbox. No email, phone call or external message is sent.",
    ],
    [
        "What details help with planning a move?",
        "Share both locations, your preferred date, home size, building access and any items needing specialist protection. Please use fictional information in this sample.",
    ],
    [
        "Where can I find an existing sample booking?",
        "Open the customer dashboard to view booking details, tracking milestones and the matching invoice. New sample bookings remain available in the same browser and origin.",
    ],
];
const home2Reviews = [
    [
        "Rhea D.",
        "Apartment relocation",
        "The room labels made unpacking feel manageable. We found our first-night essentials without opening every box.",
    ],
    [
        "Kabir M.",
        "Office relocation",
        "The workstation plan and loading order gave our team a clear handover. Every department knew what to expect.",
    ],
];
module.exports = {
    mark,
    pageHero,
    process,
    solutions,
    cta,
    benefits,
    heroImages,
    priceFaqs,
    contactFaqs,
    home2Reviews,
};
