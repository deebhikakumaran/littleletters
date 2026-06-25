# little letters

a private, no-database letter app. the whole letter is encoded into the share link — nothing is stored on a server.

## structure
```
app/
├── page.tsx          → landing page (cat + begin)
├── editor/page.tsx   → <LetterSender />
└── viewer/page.tsx   → <LetterViewer />
components/
├── LetterSender.tsx  → the editor (presets, controls, share)
├── LetterViewer.tsx  → renders a letter from the link
├── RichEditor.tsx    → contentEditable rich text (bold/italic/quote/bullet)
├── LetterPaper.tsx   → the shared paper surface
└── ui.tsx            → small controls + styles
lib/
└── letter.ts         → themes, presets, encode/decode
public/
└── cat.jpeg          → landing image
```

## run
```
npm install
npm run dev      # http://localhost:3000
```

## deploy
set `SHARE_BASE` in `lib/letter.ts` to your domain (or leave "" to auto-detect),
then deploy to vercel. links look like `https://your-site.com/viewer#l=...`

## next step
swap RichEditor for TipTap to have cleaner rich-text output.
