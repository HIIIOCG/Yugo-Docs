# Yugo Handbook

The English documentation website for Yugo Blender VTube. This first edition covers Yugo Node 0.10.0.

## Preview locally

Requires Node.js 22 or newer. There are no package dependencies to install.

```sh
node scripts/serve.mjs
```

Open http://127.0.0.1:4173. The server builds the site before starting. Restart it after editing content or assets.

You can also build the site and open `dist/index.html` directly in a browser. The local search index is loaded as a script, so search and navigation work without a preview server.

## Build and verify

```sh
node scripts/build.mjs
node scripts/check.mjs
```

The static site is written to `dist/`. The checks verify local links, images, anchors, search entries, English text, and work-in-progress markers. Both the source and generated site work without a framework or third-party runtime.

## Content

- `site.json`: handbook identity, main navigation, and top-level page order.
- `content/`: editable English Markdown pages.
- `content/nodes/`: eight frame-based category pages, with individual nodes explained on the same page.
- `data/nodes.json`: captured node interfaces and initial controls.
- `data/node-groups.json`: screenshot frame names and the nodes assigned to each group.
- `data/node-pages.json`: generated node navigation metadata.
- `assets/`: styles, browser behavior, icons, and rendered images.
- `ASSETS.md`: image provenance and the remaining asset wishlist.

Supported Markdown includes headings, paragraphs, links, images, bold text, inline code, ordered/unordered lists, tables, and callouts. Content is rendered to HTML at build time. Relative links work under a GitHub Pages repository subpath. Search uses a local index; no external search account is needed.

Yugo Layer, Camera, and Tutorials intentionally show **Page Work in Progress**.

## Reading layout

The interface defaults to dark mode and uses only black, white, and neutral grays. A manual theme choice is remembered. The header reads **Yugo - Blender Vtubing** without a logo. Sidebar sections are Welcome, Tutorials, User Guide, and Node Reference. Beneath navigation, a maker section introduces hiiio with its official website and public contact email. The supplied hiiio logo follows the selected theme, and the closing message encourages readers to combine nodes into their own unique effects.

The shared type scale is defined at the top of `assets/styles.css`: 18px body text, 16px tables, 15px navigation, 14px captions and table of contents, and 13px secondary labels. Headings use 40/28/22px on desktop, with a smaller page title on narrow screens. The reading column is limited to 800px.

The node reference follows the supplied editor frames: Inputs, Custom Inputs, Math / Mixer, Flow Control, Motion Operation, Expression Operation, Outputs, and Physics. Search finds all 52 documented nodes and jumps directly to their headings. Screenshot colors are retained so socket types remain recognizable; the surrounding website interface is grayscale.

## Update the node reference

Node interfaces were captured from an isolated Blender process with the development add-on registered. Regular site builds use the checked-in snapshot and do not require Blender or the development repository.

For an explicit reference refresh, run `scripts/capture-nodes.py` in background Blender with the sibling development repository available, then run:

```sh
node scripts/refresh-node-reference.mjs
```

**This refresh rewrites the node Markdown pages.** Keep reviewed prose changes and update the authoring script before refreshing. Verify the available menus and release scope against the package being documented.

## GitHub Pages

The workflow in `.github/workflows/pages.yml` builds, verifies, and deploys `dist/` when manually dispatched. To publish, push the reviewed source, select GitHub Actions as the repository's Pages source, and run **Publish handbook to GitHub Pages**. It does not publish on every push.

Workflow configuration follows the [GitHub Pages custom workflow documentation](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages).

## Design references

The information structure draws on [Warudo Handbook](https://docs.warudo.app/docs/) and [ProtoMotions Documentation](https://nvlabs.github.io/ProtoMotions/index.html). The styling, handbook copy, and sample renders in this repository were created for Yugo.
