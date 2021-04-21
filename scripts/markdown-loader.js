/* eslint-disable */
const fs = require('fs');
const markdownItAnchor = require("markdown-it-anchor");
const markdownItTocDoneRight = require("markdown-it-toc-done-right");
const mdContainer = require('markdown-it-container');

const camelCase = require('camelcase');
const path = require('path');
const coverage = require('../config/test-coverage');
const md = require('markdown-it')({ html: true, }).use(markdownItAnchor, {
  permalink: true,
  permalinkSymbol: ""
}).use(markdownItTocDoneRight, {
  level: [2, 3],
  containerClass: "element-toc_container",
  listClass: "element-toc_list",
  itemClass: "element-toc_list_item",
  linkClass: "element-toc_list_item_a",
});

md.use(mdContainer, 'demo', {
  validate(params) {
    return params.trim().match(/^demo\s+([\\/.\w-]+)(\s+(.+?))?(\s+--dev)?$/);
  },
  render(tokens, idx) {
    if (tokens[idx].nesting === 1) {
      const match = tokens[idx].info.trim().match(/^demo\s+([\\/.\w-]+)(\s+(.+?))?(\s+--dev)?$/);
      const demoPath = match[1];
      const demoPathOnlyLetters = demoPath.replace(/[^a-zA-Z\d]/g, '');
      const demoName = path.basename(demoPath);
      const testOnly = match[4];
      const title = match[3] || '';
      const demoDefName = `Demo${demoPathOnlyLetters}`;
      const demoCodeDefName = `Demo${demoPathOnlyLetters}Code`;

      const tpl = `
      <element-demo :code="${demoCodeDefName}" title="${title}" demo-name="${demoName}" component-name="**">
        <template v-slot:demo>
          <${demoDefName}/>
        </template>
      </element-demo>`;

      tokens.tttpl = tpl;

      if (testOnly && process.env.NODE_ENV === 'production') {
        tokens.tttpl = '';
        return '';
      }

      return `<div class="element-demo-wrapper element-demo-**-${demoName} demo-** demo-**-${demoName}">`;
    }
    if (tokens.tttpl) {
      return `
      ${tokens.tttpl || ''}
    </div>`;
    }
    return '';
  },
});

md.use(mdContainer, 'doc', {
  validate(params) {
    return params.trim().match(/^doc\s+(.+)$/);
  },
  render(tokens, idx) {

    if (tokens[idx].nesting === 1) {
      const match = tokens[idx].info.trim().match(/^doc\s+(.+)$/);
      const componentPath = match[1];
      const componentName = path.basename(componentPath);
      const componentPathOnlyLetters = componentPath.replace(/[^a-zA-Z\d]/g, '');
      const pascalCaseComponentName = camelCase(componentName, { pascalCase: true });
      const docDefName = `Doc${componentPathOnlyLetters}`;

      return `
      <div class="element-cdoc-wrapper element-cdoc-${componentName}">
        <element-doc-tables :doc="${docDefName}" name="${pascalCaseComponentName}">
        </element-doc-tables>
      `;
    }
    return '</div>';
  },
});

module.exports = function (source) {
  this.sourceMap = false;

  const demoImports = {};
  const demoCodeImports = {};
  const docImports = {};
  const name = path.basename(this.resourcePath, '.md');
  const dirname = path.dirname(this.resourcePath);

  // 统一换成 iwiki 文档内容
  if (this.resourcePath.includes('examples')) {
    if (source.includes(':: BASE_DOC ::')) {
      const baseDoc = fs.readFileSync(path.resolve(`common/docs/web/${name}.md`), 'utf-8');
      source = source.replace(':: BASE_DOC ::', baseDoc);

      // 替换成对应 demo 文件
      source = source.replace(/\{\{\s+(.+)\s+\}\}/g, (demoStr, demoFileName) => {
        return `::: demo demos/${demoFileName}\n:::`;
      });
    }

    if (source.includes(':: BASE_PROPS ::')) {
      const apiDoc = fs.readFileSync(path.resolve(dirname, './api.md'), 'utf-8');
      source = source.replace(':: BASE_PROPS ::', apiDoc);
    }
  }

  const titleLocation = source.search(/[\r\n]/);
  const describeLocation = source.split(/[\r\n]#+\s|:::\s/)[0].length || titleLocation;
  const propsRegLocation = source.search(/#+\s*属性配置|(#+\s*\S*\s*props)/i);
  let title = '';
  let component_coverage = '';
  let describe = '';
  let demoMd = '';
  let apiMd = '';
  let mdResult = '';
  let demoResult = '';
  let apiResult = '';
  if (propsRegLocation !== -1) {
    title = source.slice(2, titleLocation)
    component_coverage = coverage[name.toLowerCase()];
    describe = source.slice(titleLocation, describeLocation).trim();
    demoMd = source.slice(describeLocation, propsRegLocation);
    apiMd = source.slice(propsRegLocation);
    apiResult = md.render('${toc}\r\n' + apiMd);

    demoResult = md.render('${toc}\r\n' + demoMd);
  } else {
    mdResult = md.render(source);
    mdResult = mdResult.replace(/\*\*/g, name);
  }

  source.replace(/:::\s*demo\s+([\\/.\w-]+)/g, (demoStr, demoPath) => {
    const demoPathOnlyLetters = demoPath.replace(/[^a-zA-Z\d]/g, '');
    const demoDefName = `Demo${demoPathOnlyLetters}`;
    const demoCodeDefName = `Demo${demoPathOnlyLetters}Code`;
    demoImports[demoDefName] = `import ${demoDefName} from './${demoPath}';`;
    demoCodeImports[demoCodeDefName] = `import ${demoCodeDefName} from '!!raw-loader!./${demoPath}';`;
  });

  source.replace(/:::\s*doc\s+(.+)/g, (docStr, componentPath) => {
    const componentPathOnlyLetters = componentPath.replace(/[^a-zA-Z\d]/g, '');
    const docDefName = `Doc${componentPathOnlyLetters}`;
    docImports[docDefName] = `import ${docDefName} from '!!doc-loader!./${componentPath.trim()}';`;
  });

  // demo import;
  let demoImportsStr;
  demoImportsStr = Object.keys(demoImports).map(demoDefName => demoImports[demoDefName])
    .join('\n');

  // demo definition
  let demoDefsStr;
  demoDefsStr = Object.keys(demoImports).join(',');

  // demo code import
  let demoCodeImportsStr;
  demoCodeImportsStr = Object.keys(demoCodeImports).map(demoCodeDefName => demoCodeImports[demoCodeDefName])
    .join('\n');

  let demoCodeDefsStr;
  demoCodeDefsStr = Object.keys(demoCodeImports).join(',');

  let docImportsStr;
  docImportsStr = Object.keys(docImports).map(docDefName => docImports[docDefName])
    .join('\n');
  let docImportsDefsStr;
  docImportsDefsStr = Object.keys(docImports).join(',');

  let docDefsStr;
  docDefsStr = Object.keys(docImports).join(',');
  // console.log(demoCodes);

  /*
   * console.log(demoImportsStr);
   * console.log(mdResult);
   */
  const vueSource = `

<template>
  <div class="element-document-wrapper">
  <div class="element-document element-document-no-code" v-if="${propsRegLocation === -1}">
    ${mdResult}
  </div>
    <div class="element-document-header" v-if="${propsRegLocation !== -1}">
      <div class="element-document-header__title">${title}
        <element-badge label="coverage" message="${component_coverage}" />
        <div class="element-document-header__title-describe" >${describe}</div>
      </div>
      <element-component-contributors thumbnail component-name="${name}"></element-component-contributors>

      <div class="element-document-tab" v-if="${propsRegLocation !== -1}">
      <div
        v-for="item in tabList"
        :key="item.name"
        :class="[{'element-document-tab-is-active' : activeName === item.name },'element-document-tab__nav-item']"
        @click="changeActive(item.name)"
        >
        {{item.label}}
      </div>
    </div>
    </div>
    <div v-if="${propsRegLocation !== -1}">
    <div class="element-document" v-show="activeName ==='demo'" name="demo">
      ${demoResult}
    </div>
    <div class="element-document" v-show="activeName === 'API'" name="API" >
      ${apiResult}
    </div>
    </div>
  </div>
</template>
<script>
${demoImportsStr}
${demoCodeImportsStr}
${docImportsStr}

// console.log(${demoCodeDefsStr});
// console.log(${docImportsDefsStr});
export default {
  data() {
    return {
      heightList: {
        demo: [],
        API: []
      },
      activeName: 'demo',
      tabList: [{
        name: 'demo',
        label: '示例'
      },
      {
        name: 'API',
        label: 'API'
      }],
      elem: {},
      ${demoCodeDefsStr}
      ${docDefsStr === '' ? '' : `,${docDefsStr},`}
    }
  },
  inject: ['doc'],
  components: {
    ${demoDefsStr}
  },
  mounted() {
    this.doc && this.doc.$emit('doc-loaded');

    if (${propsRegLocation === -1}) {
      return;
    }
    window.addEventListener("scroll", this.changeTocHeight);

    this.$nextTick(() => {

      const containers = document.getElementsByClassName("element-toc_container");
      const a = containers[0].querySelectorAll(".element-toc_list_item_a") || [];

      this.initHeight(a, this.activeName);


      Array.from(containers).forEach( (container, index) => {
        const a = container.querySelectorAll(".element-toc_list_item_a") || [];
        a[0] && a[0].classList.add("actived");


        container.addEventListener("click", (event) => {
          if (event.target.nodeName === "A") {
            a.forEach(function (aItem) {
              aItem.classList.remove("actived");
            });
            event.target.classList.add("actived");
          }
        });
      })
    })
  },
  destroyed() {
    window.removeEventListener('scroll', this.changeTocHeight);
  },
  methods: {
    changeTocHeight() {
      const containers = document.getElementsByClassName("element-toc_container");

      if (window.scrollY > 304) {
        Array.from(containers).forEach(container => {
          container.style.position = "fixed";
          container.style.top = "76px";
          container.style["z-index"] = 1;
        })
      } else {
        Array.from(containers).forEach(container => {
          container.style.position = "absolute";
          container.style.top = "380px";
          container.style["z-index"] = 0;
        })
      }

      this.computeScroll();
    },
    activeA() {
      const containers = document.getElementsByClassName("element-toc_container");

      Array.from(containers).forEach(container => {
        const a = container.querySelectorAll(".element-toc_list_item_a");
        a.forEach((aItem, index) => {
          if (index === 0) {
            aItem.classList.add("actived");
          } else {
            aItem.classList.remove("actived");
          }
        });
      })
    },
    findNestAnchor(list, y) {
      let lastIndex = list.length - 1;
      let resIndex = lastIndex;
      if (y < list[0]) {
        return 0;
      } else if (y === document.body.clientHeight - window.innerHeight) {
        return lastIndex;
      }

      list.forEach((item, index) => {
        if (resIndex === lastIndex && item > y) {
          resIndex = index - 1;
        }
      });

      return resIndex;
    },

    computeScroll() {
      const activeIndex = this.findNestAnchor(this.heightList[this.activeName], window.pageYOffset);
      const a = document.querySelector("div[name=" + this.activeName + "]").querySelectorAll(".element-toc_list_item_a");
      a.forEach(function (aItem, index) {
        if (index === activeIndex) {
          aItem.classList.add("actived");
        } else {
          aItem.classList.remove("actived");
        }
      });
    },

    initHeight(a, name) {
      this.heightList[name] = [];
      a.forEach((aItem) => {
        const title = document.getElementById(aItem.href.split("#")[1]);
        const height = title  && title.getBoundingClientRect() && title.getBoundingClientRect().y
        this.heightList[name].push(height || 0);
      });
    },

    changeActive(name) {
      this.activeName = name;
      this.activeA();
      const length = this.heightList[name].length;
      this.$nextTick(() => {
        if (!this.heightList[name][0] || this.heightList[name][0] === 0) {
          const a = document.querySelector("div[name=" + name + "]").querySelectorAll(".element-toc_list_item_a");
          this.initHeight(a, name);
        }
      });
    },
  }
};
</script>

  `;

  return vueSource;
};
