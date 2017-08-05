const cheerio = require('cheerio')
const sass = require('node-sass')
const path = require('path')
const fs = require('fs')

const SCSS_IN = path.join(__dirname, 'src/style.scss')
const SCSS_OUT = path.join(__dirname, 'build/style.css')
const MDOC_IN = path.join(__dirname, 'build/kvnio.html')
const INDEX_IN = path.join(__dirname, 'src/index.html')
const INDEX_OUT = path.join(__dirname, 'build/index.html')

function inject($el) {
    const orig = $el('body').html()
    const script = `
    <script>
        document.addEventListener('DOMContentLoaded', () => {
            const os = document.querySelector('.foot-os')
            os.textContent = window.navigator.oscpu ||
                window.navigator.platform ||
                'BSD 4.4'
            os.textContent = os.textContent.toUpperCase()
        })
    </script>
    `
    $el('body').html(orig + script)
}

function build() {
    sass.render({
        file: SCSS_IN
    }, (err, result) => {
        if (err) {
            console.error(`node-sass failed: ${err}`)
            return
        }

        fs.writeFile(SCSS_OUT, result.css, (err, res) => {
            if (err) {
                console.error(`node-sass failed: ${err}`)
                return

                console.log(`\x1B[32;1mBuilt ${SCSS_OUT}\x1B[0m`)
            }
        })
    })

    const $mdoc = cheerio.load(fs.readFileSync(MDOC_IN))
    const $index = cheerio.load(fs.readFileSync(INDEX_IN))
    $index('body').html('<div class="manpage"></div>')
    $index('div.manpage').html($mdoc('body').html())
    inject($index)
    fs.writeFile(INDEX_OUT, $index.html(), (err, res) => {
        if (err) {
            console.error(`cheerio failed: ${err}`)
            return
        }

        console.log(`\x1B[32;1mBuilt ${INDEX_OUT}\x1B[0m`)
    })
}

if (require.main === module) {
    build()
}

module.exports = {
    build
}
