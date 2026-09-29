# Regal Dental Clinic by Dental Solutions — Website

Static website in plain **HTML, CSS and vanilla JavaScript**. No framework, no build step, no `npm install`.
Design: deep navy and warm ivory with muted gold accents, a floating rounded navbar, and peach-cream service cards that pop in as you scroll.

## 1. Run it locally

Simplest: double-click `index.html`.

Or with a local server (closer to production):

```bash
cd regal-dental-clinic
python3 -m http.server 8000
# open http://localhost:8000
```

## 2. Files

```
index.html  about.html  services.html  gallery.html  contact.html
css/style.css        all styling (colours are variables at the top)
js/script.js         all behaviour + clinic settings (CLINIC object at the top)
images/              optimized clinic photos
images/_needs-consent/   NOT used on the site (see section 6)
robots.txt  sitemap.xml
```

## 3. The appointment inquiry form (read this)

A frontend-only form cannot send email by itself. This site is honest about that and supports two modes,
chosen in `js/script.js`:

**Mode B — WhatsApp (default, works today, no setup).**
With `web3formsKey` empty, submitting the form opens WhatsApp with the inquiry pre-filled to
`wa.me/923459477068`. Nothing reaches the clinic until the visitor presses Send in WhatsApp. The page tells the visitor this.

**Mode A — Email via Web3Forms (recommended once you have a key).**
1. Go to https://web3forms.com and create a free access key using the clinic email (`bilalbds11@gmail.com`).
2. Open `js/script.js` and paste it here:
   ```js
   web3formsKey: 'PASTE-YOUR-KEY-HERE',
   ```
3. Done. The form now emails inquiries to the clinic. The page text switches automatically.

The access key is designed by Web3Forms to be used in the browser, but do not share it publicly beyond the site.

In both modes the form states that an inquiry **is not a confirmed appointment**. There is no automated booking,
instant confirmation, chatbot or CRM. Do not advertise one.

## 4. Replace the domain placeholder (before going live)

Canonical URLs, Open Graph URLs, `robots.txt` and `sitemap.xml` use `https://YOUR-DOMAIN.com` because the real domain is unknown.
Once you have it (a Vercel URL is fine), run from the project folder:

```bash
grep -rl "YOUR-DOMAIN.com" . | xargs sed -i 's#https://YOUR-DOMAIN.com#https://your-real-domain.com#g'
```

## 5. Deploy to Vercel

**Option 1 — Dashboard:** push the folder to a GitHub repo, then in Vercel choose *Add New > Project*, import the repo,
leave *Framework Preset* as **Other**, leave Build Command empty, Output Directory `.` and click Deploy.

**Option 2 — CLI:**
```bash
npm i -g vercel
cd regal-dental-clinic
vercel        # follow prompts, accept defaults
vercel --prod
```

## 6. Photos and consent

Used on the site (real clinic photos you supplied): entrance, treatment room, waiting area.

**Not used:** `images/_needs-consent/before-after-restoration.jpeg` is a real patient's before/after treatment photo.
It is excluded from every page and blocked in `robots.txt`. Only publish it if the clinic has the patient's written consent,
then add it to the gallery. Patients' faces should be cropped out or covered.

**No AI-generated images were added.** The doctor's photo slot shows a neutral monogram with "Photo to be added by the clinic",
because generating a doctor portrait or a fake clinic interior would misrepresent the clinic. Send a real photo of Dr Bilal
and drop it into `images/`, then replace the monogram block in `index.html` and `about.html`.

## 7. Edit common things

| To change | Where |
|---|---|
| Phone / WhatsApp number | Search `923459477068`, `+923459477068`, `0345 9477068` in the HTML files, and `whatsapp:` in `js/script.js` |
| Email | Search `bilalbds11@gmail.com` |
| Services | `services.html` and the services block in `index.html` (each is a `.service-card`) |
| Colours | `:root { ... }` at the top of `css/style.css` |
| Facebook link | Search `dentalsolutionpwd` |

## 8. Things to confirm with the clinic owner

1. **Services list.** The Facebook page could not be read (Facebook blocks automated access) and none of the supplied photos list treatments,
   so the services shown are a general dental starting point, flagged on the Services page. Confirm which the clinic really offers, delete the rest, add any missing ones, then remove the yellow "Note for the clinic owner" box.
2. **Phone number.** The door signage in the entrance photo shows numbers beginning `031 00 00 68 89` and `033 00 00 68...`,
   which differ from `0345 9477068` supplied for this site. Confirm which number(s) patients should use and whether WhatsApp is on the supplied one.
3. **Dr Bilal's details.** Full name, qualifications, specialisations, years of practice, and a photo. None are invented; the site says they will be added.
4. **Clinic timings.** Not supplied, so the site says "Please call or message to confirm current clinic timings."
5. **Google Maps link.** Send the clinic's real Google Maps share link and it can be embedded. Until then a "search address" button is shown.
6. **Rating.** 4.8 stars from 13 online reviews is shown as supplied. Confirm it is current and which platform it comes from.
7. **Branding.** No logo was supplied, so the header uses a text treatment of the business name. Send the logo file if there is one.
8. **Domain.** Needed for canonical URLs and the sitemap (section 4).
9. **Patient photos.** Consent for the before/after image (section 6).
10. **Business name wording.** Confirm the preferred spelling and casing, and that the door's "REGAL DENTAL" and "by Dental Solutions" are the same clinic identity.

## 9. Design notes (redesign)

- **Colours** are CSS variables at the top of `css/style.css` (`--navy-*`, `--gold-*`, `--cream-*`). Change them there and the whole site follows.
- **Floating navbar:** a white rounded pill sitting 18px below the top edge, sticky while scrolling, with a Book Appointment button. On screens under 980px it collapses to a menu button that opens a slide-in panel.
- **Service cards:** cream-tinted with a rounded border. They fade in and rise slightly, one after another, when scrolled into view, and lift with a gold border on hover. The stagger delay is removed once the entrance finishes so hover responds instantly.
- **Reduced motion:** visitors whose device requests reduced motion see all cards immediately with no animation and no hover movement.
- **If JavaScript fails:** content is hidden for the entrance animation only after the page confirms its script is running. If the script never loads, everything is shown after 3 seconds.
- **Brand mark:** no logo was supplied, so the navbar uses a simple "R" monogram beside the business name. Send the real logo and it can replace the monogram.

## 10. What was tested

Links, anchors, alt text, heading structure and identical navigation on all five pages; no inline styles that could override responsive breakpoints; form validation (empty and invalid input blocked); WhatsApp URL generation (`92` country code, leading zero removed, per-service messages); email mode success and failure handling; mobile menu (open, close on link, close on Escape); active navigation state on every page; FAQ; lightbox; the scroll-triggered staggered card entrance (cards stay hidden until scrolled to, delays 0/90/180ms and so on); delay cleared after entrance; reduced-motion behaviour; the JavaScript-failure fallback; and a sweep confirming no content or photos from any other clinic are on the site.

**Not tested:** the site has not been viewed in a real browser (none was available in the build environment), so the layout and animation smoothness at desktop, tablet and phone widths have not been checked by eye. The responsive rules are written to breakpoints at 1040, 980, 960, 900, 860, 800, 600, 560, 520 and 380px. Please preview on a real phone and a laptop before showing the clinic.
