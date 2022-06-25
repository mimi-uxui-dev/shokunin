const bel = require('bel')
const csjs = require('csjs-inject')
const footer = require('footer')()
const start_page = require('start_page')()
const about_page = require('about')()
const proposals_page = require('proposals')()
const projects_page = require('projects')()

module.exports = page

function page () {

  // -------------------HTML ELEMENTS -------------------
  const about_btn = bel`<div class=${css.nav__link} onclick=${(e) => handle_click(e)}>About</div>`
  const proposals_btn = bel`<div class=${css.nav__link} onclick=${(e) => handle_click(e)}>Proposals</div>`
  const projects_btn = bel`<div class=${css.nav__link} onclick=${(e) => handle_click(e)}>Projects</div>`
  
  const nav = bel`
    <nav role="navigation">
      <img 
        onclick=${(e) => handle_click(e)}  
        class=${css.logo} 
        src="assets/imgs/Logo.png" 
        alt="Shokunin home" 
      />
      <div class=${css.nav__links}>
        ${about_btn}
        ${proposals_btn}
        ${projects_btn}
      </div>
    </nav>
  `

  const page_body = bel`<div>${start_page}</div>`
  
  const el = bel` 
    <div class="${css.container}">
      ${nav}
      ${page_body}
      ${footer}
    </div>
  `

  // -------------------JS LOGIC -------------------
  function handle_click (event) {
    // console.log('New click', event.target)
    const btn = event.target.innerText
    let new_page
    if (btn === 'About') new_page = about_page
    else if (btn === 'Proposals') new_page = proposals_page
    else if (btn === 'Projects') new_page = projects_page
    else if (event.target.alt === 'Shokunin home') new_page = start_page
    page_body.innerHTML = ''
    page_body.appendChild(new_page)
  }

  // -------------------RETURN ELEMENT -------------------
  return el
  
}

const css = csjs`
  :root {
    --bgColor: #110042;
    --textColor: #fff;
    --secondary: #C931FF;
    --transition: all ease 0.5s;
    --linkLineHeight: 31px;
    --linkSize: 25px;
    --nav__linksGAP: 32px;
    --btn-p: 18px 67px;
  }
  * {
    box-sizing: border-box;
    padding: 0;
    margin: 0;
    font-family: 'Space Grotesk';
  }
  body {
    background-color: var(--bgColor);
  }
  .container {
    max-width: 1512px;
    margin: 0 auto;
  }
  nav {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 24px 72px;
  }
  .nav__links {
    display: flex;
    flex-direction: row;
    gap: var(--nav__linksGAP);
  }
  .nav__links a:hover, .nav__link:hover {
    cursor: pointer;
    color: var(--secondary);
    transition: var(--transition);
  }
  .nav__link {
    font-style: normal;
    font-weight: 500;
    font-size: var(--linkSize);
    line-height: var(--linkLineHeight);
    color: var(--textColor);
    text-decoration: none;
  }
  ::-webkit-scrollbar {
    width: 8px;
  }
  ::-webkit-scrollbar-track {
    box-shadow: inset 0 0 5px grey;
    border-radius: 10px;
  }
  ::-webkit-scrollbar-thumb {
    background: var(--secondary);
    border-radius: 10px;
  }
  ::-webkit-scrollbar-thumb:hover {
    background: #6c3181;
  }
  @media screen and (max-width: 1440px) {
    :root {
        --linkSize: 18px;
        --btn-p: 15px 57px;
    }
    .logo {
        width: 165px;
    }
    nav {
        padding: 16px 72px;
    }
  }
  @media screen and (max-width: 768px) {
    :root {
        --linkSize: 18px;
        --linkLineHeight: 31px;
        --btn-p: 10px 57px;
    }
    nav {
        flex-direction: column;
    }
  }
`

document.body.append(page())