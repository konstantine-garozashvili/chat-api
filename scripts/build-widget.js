const esbuild = require('esbuild');
const { minify } = require('terser');
const fs = require('fs').promises;

async function buildWidget() {
  // Bundle widget code
  await esbuild.build({
    entryPoints: ['src/client/components/ChatWidget.js'],
    bundle: true,
    minify: true,
    outfile: 'dist/widget.js',
    format: 'iife',
    globalName: 'ChatWidget',
    define: {
      'process.env.NODE_ENV': '"production"'
    }
  });

  // Bundle CSS
  const css = await fs.readFile('src/public/css/widget.css', 'utf8');
  await fs.writeFile('dist/widget.css', css);

  // Create widget loader script
  const loaderScript = `
    (function(w,d,s,o,f,js,fjs){
      w['ChatWidget']=o;w[o]=w[o]||function(){
        (w[o].q=w[o].q||[]).push(arguments)};
      js=d.createElement(s),fjs=d.getElementsByTagName(s)[0];
      js.id=o;js.src=f;js.async=1;fjs.parentNode.insertBefore(js,fjs);
    }(window,document,'script','chatWidget','https://your-api-url/widget.js'));
  `;

  const minifiedLoader = await minify(loaderScript);
  await fs.writeFile('dist/widget-loader.js', minifiedLoader.code);
}

buildWidget().catch(console.error); 