# Folio — working agreement

## Role
Act as an expert UX/UI designer, product designer, interaction designer,
graphic designer, motion designer and art director — not just a developer.

## Design references
Reference images supplied for this site are rough, not pixel-perfect.
Do not copy them literally. Fix spacing, alignment, proportion and colour
as needed, keeping the intent of the reference.

## Workflow
1. Design first: present the refined design (rendered mockup) and note
   what was changed from the reference and why.
2. Develop only after the design is approved.

## Fixed decisions (change only when told)
- Background `#121315`, stroke `#202123`.
- Fixed background: 6-column vertical grid lines, 2.75vw side gutters.
- Font: Inter, everywhere. PP Mondwest survives only as the shape of the
  contact page's "@" mark (an SVG path); its font files are no longer in the
  repository.
- Structure: `index.html` (home: hero → one section per case study → contact),
  `case-studies/<slug>/index.html` per case study, shared `styles.css`.

## Pages
- Home page: `index.html`, Home, Work and Contact on one page: the hero
  (`#home`), one section per case study (`#work`: GIFA, Fee management,
  Creating Automation, then Stamp, the one to come) and the contact page as the
  last section (`#contact`). Its styles are in `home.css`, on top of
  `styles.css`, the shared `case-studies/case-study.css` and
  `contact/contact.css`; its script is `home.js` (the form uses
  `contact/contact.js`).
  Wide windows: one scroll (wheel flick, arrow keys, Page Up/Down, Home/End)
  glides to the next section (the case studies' 850ms glide). Each section takes
  the top 85% of the window, so the last 15% shows the start of the next;
  Contact fills the window. Phones scroll freely.
  Header: fixed; HOME, WORK with one square per case study (Stamp included;
  the case-study squares' style, the current one blue), CONTACT; the section in
  view is lit. On phones the squares are hidden.
  Hero: on `--panel` (#0C0B0E, the glow image's base) with the column glow
  (`assets/hero-glow.webp`) along the bottom; "UX & Product Designer", sized so
  "UX & Product" ends on the frame's middle line; "I make complicated software
  feel obvious." in grey sentence case; the signature (`assets/home-bg2.webp`,
  a lossless WebP of the uploaded `homebackgroundimage2.png`; the PNG
  itself was removed as unused) large on the right (86% of the
  window wide, at most 1.26 window heights), its crossbar starting just left of
  where "UX & Product" ends, running off the right and up through the header,
  which stays clear while the hero is in view (the hero reaches up under it);
  the frame lines (the header's rule and the right frame line) run behind it,
  and the crossbar runs past the frame to the window's edge; "↓ Selected case studies" at the bottom left. On load the title,
  statement and label rise in and the signature fades in last.
  Case-study sections: the case study's opening composition on a light panel
  (`--surface`), laptops cut off at the bottom, with side padding so their outer
  edges line up with the text below (`--pad`); one laptop (`.solo`), two
  (`.duo`) or three (`.trio`), as on the case study. A section waiting below
  keeps its panel on the page colour until it is the current one (wide windows;
  phones scroll freely, so their panels are light from the start). Under it, on
  the plain `--panel` (the glow belongs to the hero alone): the title (weight 500), a large arrow and the
  description (`--text-body`; GIFA keeps its term tooltip). The whole section
  is the link; the cursor is a dark pill, the arrow in the brand gradient and
  "View case study" (`.cs-cursor`). Stamp (`.soon`) is not a link: "Soon" in
  the arrow's place, a light grey pill "Case study coming soon".
  WORK menu (pointer screens): hovering WORK or its squares drops a dark list
  of the four case studies under WORK (no border; title, description, arrow or
  "Soon"); the page behind blurs and darkens and the glow and signature go out.
  Menu type: titles 24px at 1440 (medium), descriptions 16px in the secondary
  grey, both scaling with --u. The item under the pointer turns light and a
  preview opens beside it: a fixed-height light panel centred on the item
  (kept within the list), holding the case study's main screen alone, standing on the panel's
  bottom edge (no gap below), so the
  two read as one light shape. Items open the case-study pages. Only WORK, the list and the open
  preview count as the menu: the pointer anywhere else (beside the list, below
  the preview) closes it after a short grace (250ms); so do Esc and a scroll. A click on WORK or a square closes it at
  once, and it stays shut until the pointer leaves them.
- Site header on every page: the name, then Home, Work with one square per
  case study, and Contact close beside it on the left. On the home page the
  section in view is lit; on a case study, Work and that case study's square.
  Work goes to the home page's case studies (`#work`), a square to its section,
  Contact to the home page's contact section (`#contact`).
  Phones: the name, and on the right a "Menu" button in its own cell behind a
  frame line (`site-menu.js`, loaded on every page; styles `.mm-*` in
  case-study.css). It opens a panel from the right over a dimmed page: Close
  in Menu's place, then Home, Work with the four case studies (a light
  thumbnail of the main screen standing on its bottom edge, title and a
  two-line description; Stamp dimmed with "Soon", not a link), Contact. The
  page you're on is lit with a blue square; on a case study its row's thumbnail
  is outlined. On the home page Home, Work and Contact scroll to their
  sections. Esc or the shade closes it; Tab stays inside. Desktop keeps its
  links; its styles live in the shared `case-studies/case-study.css`. On case studies it opens the first
  screen, then floats: hidden while scrolling down, shown when scrolling up,
  when the pointer reaches the top edge, or on keyboard focus (`case-study.js`).
- Case-study section index: a bar of section numbers on desktop; on phones one
  "Index" button (bottom right, a list icon, so it isn't mistaken for Menu) that opens the sections in a panel from the
  right, the current one marked, Close at the bottom (`.ix-*`, case-study.js).
- Case-study body copy (descriptions) uses `--text-body` (#B8B9BC), a step
  lighter than `--text-2`. On phones, small controls (header name and links,
  footer links, screen-switch squares) have tap areas of at least 44px, and the
  footer links use the small label style.
- Case-study footers: "Other projects" shows the other two case studies, each
  a link with its opening screen (the same shot as on the home page), title,
  description and arrow.
- Contact: the home page's last section (`#contact`), with
  `contact/contact.css` and `contact/contact.js`. `contact/index.html` only
  forwards to it, so old links keep working.
- Images: case-study screenshots are WebP (quality 88); the home page's images
  carry their width and height. Sharing: every page has Open Graph tags, the
  image `assets/og-image.jpg` (the hero as a 1200×630 card).
- Cache tags: every style sheet and script is loaded with one site-wide tag
  (`?v=r2`); bump it on every release.
- "Global Incentive Fee Awards case study":
  `case-studies/global-incentive-fee-awards/index.html`. A case study page,
  not the home page. Its images live in `GIFAcasestudyimages/`.
