---
title: parse
date: '2020-10-26'
draft: true
---

这里主要讲讲 parse ，看看 Vue 怎么对模板进行初步的解析。 在 compile 中调用 baseParse 进行 parse，所以这里先看看 baseParse 。

在解析之前，会创建一个上下文，用于保存当前解析进度和一些配置项。

```js
export function baseParse(content: string, options: ParserOptions = {}): RootNode {
  const context = createParserContext(content, options);
  const start = getCursor(context);
  return createRoot(parseChildren(context, TextModes.DATA, []), getSelection(context, start));
}
```

options 中基本是用 parseOptions 传下来的 options 进行覆盖， column 表示第几行， line 表示第几列， offset 表示传入 content 的偏差，originalSource 表示原始字符串，在 parse 不会被修改，source 一开始代表原始字符串，在 parse 过程会被裁剪， inPre 表示是否在 pre 标签里面，inVPre 表示是否在 VPre 标签里面。

```js
function createParserContext(content: string, options: ParserOptions): ParserContext {
  return {
    options: {
      ...defaultParserOptions,
      ...options,
    },
    column: 1,
    line: 1,
    offset: 0,
    originalSource: content,
    source: content,
    inPre: false,
    inVPre: false,
  };
}
```

回到 baseParse，创建完 context 之后，我们首先获取一开始的字符串的坐标。 getCursor 返回当前的 行、列、偏差。

```js
function getCursor(context: ParserContext): Position {
  const { column, line, offset } = context;
  return { column, line, offset };
}
```

然后在调用 createRoot 返回根节点的 ast 之前，使用 parseChildren 对模板进行解析。一开始的 TextModes 为 DATA，正如我们在 compiler 里面曾经说过，不同的 TextModes 会影响解析。 从下面可以看出，DATA 可以包含 Elements、 Entities ，结束的标志是在 tags 栈中找到 关闭 tag，而对于 RCDATA，不包含 Elements，包含 Entities， 结束的标志是 tags 栈上一级有关闭 tag， 一般处于 textarea，RAWTEXT 不包含 Elements 和 Entities，结束的标志页数是 tags 栈上一级有关闭 tag，一般位于 style 和 script 内。可能在这里单独讲概念有点懵，后面结合解析过程来会加深理解。

```js
export const enum TextModes {
  //          | Elements | Entities | End sign              | Inside of
  DATA, //    | ✔        | ✔        | End tags of ancestors |
  RCDATA, //  | ✘        | ✔        | End tag of the parent | <textarea>
  RAWTEXT, // | ✘        | ✘        | End tag of the parent | <style>,<script>
  CDATA,
  ATTRIBUTE_VALUE
}
parseChildren(context, TextModes.DATA, [])
```

需要注意的是，对于 Dom 平台来说，对于 DOMNamespaces.HTML,包括在 iframe 和 noscript 标签里面，RCDATA 还包括 title。

```js
const isRawTextContainer = /*#__PURE__*/ makeMap(
  'style,iframe,script,noscript',
  true
)
getTextMode({ tag, ns }: ElementNode): TextModes {
    if (ns === DOMNamespaces.HTML) {
      if (tag === 'textarea' || tag === 'title') {
        return TextModes.RCDATA
      }
      if (isRawTextContainer(tag)) {
        return TextModes.RAWTEXT
      }
    }
    return TextModes.DATA
}
```

现在进行 parseChildren 的分析。首先获取父级 以及 父级的 Namespaces，nodes 是解析后的 AST 节点。可以看到，一个 while 循环判断是否解析结束了，同时会 传入去 mode、ancestors，对于根节点来说，ancestors 一开始为空数组。

```js
function parseChildren(
  context: ParserContext,
  mode: TextModes,
  ancestors: ElementNode[]
): TemplateChildNode[] {
  const parent = last(ancestors)
  const ns = parent ? parent.ns : Namespaces.HTML
  const nodes: TemplateChildNode[] = []

  while (!isEnd(context, mode, ancestors)) {
    ...
  }

  // Whitespace management for more efficient output
  // (same as v2 whitespace: 'condense')
  let removedWhitespace = false
  if (mode !== TextModes.RAWTEXT) {
    ...
  }

  return removedWhitespace ? nodes.filter(Boolean) : nodes
}
```

isEnd 用于判断是否应该要结束解析，但是不同 TextMode 下，对 end 的判断是不同的，其实这点在上面讲 TextModes 的时候已经讲了，TextModes.DATA 允许有标签没闭合，所以只要祖先有相同的标签就可以了，而 RCDATA、RAWTEXT 要求父级标签跟闭合标签一样才算结束，而对于 TextModes.CDATA ，则要求 `]]>` 结尾，如果都不符合这些条件，则看看 s 是否为空来决定是否到尽头了。

```js
function isEnd(context: ParserContext, mode: TextModes, ancestors: ElementNode[]): boolean {
  const s = context.source;

  switch (mode) {
    case TextModes.DATA:
      if (startsWith(s, '</')) {
        // probably bad performance
        for (let i = ancestors.length - 1; i >= 0; --i) {
          if (startsWithEndTagOpen(s, ancestors[i].tag)) {
            return true;
          }
        }
      }
      break;

    case TextModes.RCDATA:
    case TextModes.RAWTEXT: {
      const parent = last(ancestors);
      if (parent && startsWithEndTagOpen(s, parent.tag)) {
        return true;
      }
      break;
    }

    case TextModes.CDATA:
      if (startsWith(s, ']]>')) {
        return true;
      }
      break;
  }

  return !s;
}
```

回到 while 循环，如果 isEnd 为 false， 进入循环，如果 mode 为 `mode === TextModes.DATA || mode === TextModes.RCDATA` 则进入 if 里面，否者往下走，如果这时 node 还为空，则直接进行 parseText 操作。

```js
__TEST__ && assert(context.source.length > 0)
const s = context.source
let node: TemplateChildNode | TemplateChildNode[] | undefined = undefined
if (mode === TextModes.DATA || mode === TextModes.RCDATA) {
    ...
}
if (!node) {
  node = parseText(context, mode)
}
```

parseText, 看名字就知道用来干嘛的，首先利用 endTokens 去判断结尾，分别是标签的开头、左 delimiters， 如果是 TextModes.CDATA 模式下，还包括 `]]>`， 我们需要最小的 endIndex，即尽可能短的 Text，接着使用 parseTextData 对内容解析。

parseTextData 首先 slice source 得到 rawtext，然后 advanceBy 让 context 中 columin、 line 往前进同时对 context.source 进行切割。接下来的判断，就是决定要不要对 Entities 进行解码，对于 `mode === TextModes.RAWTEXT || mode === TextModes.CDATA` 这两种不需要解码，而如果是其他模式，但是里面没有 `&`， 也不需要解码，否则调用传进来的解码函数进行解码。

parseTextData 结束后，返回 AST 节点，其中类型为 NodeTypes.TEXT， 内容为 parseTextData 返回的内容，loc 代表这个节点开始位置、结束位置以及原始内容，其中位置用三个维度去表示 行、列、偏移，需要记住的是，结束位置是开区间。

```js
function parseText(context: ParserContext, mode: TextModes): TextNode {
  __TEST__ && assert(context.source.length > 0);

  const endTokens = ['<', context.options.delimiters[0]];
  if (mode === TextModes.CDATA) {
    endTokens.push(']]>');
  }

  let endIndex = context.source.length;
  for (let i = 0; i < endTokens.length; i++) {
    const index = context.source.indexOf(endTokens[i], 1);
    if (index !== -1 && endIndex > index) {
      endIndex = index;
    }
  }

  __TEST__ && assert(endIndex > 0);

  const start = getCursor(context);
  const content = parseTextData(context, endIndex, mode);

  return {
    type: NodeTypes.TEXT,
    content,
    loc: getSelection(context, start),
  };
}
function parseTextData(context: ParserContext, length: number, mode: TextModes): string {
  const rawText = context.source.slice(0, length);
  advanceBy(context, length);
  if (mode === TextModes.RAWTEXT || mode === TextModes.CDATA || rawText.indexOf('&') === -1) {
    return rawText;
  } else {
    // DATA or RCDATA containing "&"". Entity decoding required.
    return context.options.decodeEntities(rawText, mode === TextModes.ATTRIBUTE_VALUE);
  }
}
```

回到上面的判断，对于 `mode === TextModes.DATA || mode === TextModes.RCDATA` 模式下，记住根节点是 TextModes.DATA 模式，继续判断，如果不在 inVPre 下面，又是左 delimiters 开头的，对于默认 delimiters 对是 `{{` 和 `}}`，这些都满足，则进行插值 parseInterpolation 的解析。

```js
if (mode === TextModes.DATA || mode === TextModes.RCDATA) {
  if (!context.inVPre && startsWith(s, context.options.delimiters[0])) {
    // '{{'
    node = parseInterpolation(context, mode);
  } else if (mode === TextModes.DATA && s[0] === '<') {
  }
}
```

parseInterpolation 插值函数如下，拿到界定符，判断有没有结束界定符，没有的话，抛出错误，返回 undefined ，这样后续可以被上面解读的 parseText 进行处理。start 是插值符的开始位置， innerStart 是 插值内容开始的位置，这个会被进行二次修复，因为内容前面可能会有空格，同样 innerEnd 是指插值内容结束的位置，也会被二次修复，但是为什么 `const endOffset = rawContentLength - (preTrimContent.length - content.length - startOffset)` 这样算呢？

首先 rawContentLength 是原始插值的长度，里面可能包含前后空格以及内容可能需要解码，如果需要解码，解码后的内容是比没有解码前的内容长度要短的，`(preTrimContent.length - content.length - startOffset)` 拿到的是内容后面空格的长度，所以 endOffset 就是原始插值减去后面空格的长度，修复 innerEnd 之后，继续把 context 推向前 close 的长度，最后返回节点类型为 NodeTypes.INTERPOLATION，content 为 NodeTypes.SIMPLE_EXPRESSION 类型，其中 isConstant 会在 transformExpression 真正确定下来，这里默认为 false。

```js
function parseInterpolation(
  context: ParserContext,
  mode: TextModes
): InterpolationNode | undefined {
  const [open, close] = context.options.delimiters
  __TEST__ && assert(startsWith(context.source, open))

  const closeIndex = context.source.indexOf(close, open.length)
  if (closeIndex === -1) {
    emitError(context, ErrorCodes.X_MISSING_INTERPOLATION_END)
    return undefined
  }

  const start = getCursor(context)
  advanceBy(context, open.length)
  const innerStart = getCursor(context)
  const innerEnd = getCursor(context)
  const rawContentLength = closeIndex - open.length
  const rawContent = context.source.slice(0, rawContentLength)
  const preTrimContent = parseTextData(context, rawContentLength, mode)
  const content = preTrimContent.trim()
  const startOffset = preTrimContent.indexOf(content)
  if (startOffset > 0) {
    advancePositionWithMutation(innerStart, rawContent, startOffset)
  }
  const  =
    rawContentLength - (preTrimContent.length - content.length - startOffset)
  advancePositionWithMutation(innerEnd, rawContent, endOffset)
  advanceBy(context, close.length)

  return {
    type: NodeTypes.INTERPOLATION,
    content: {
      type: NodeTypes.SIMPLE_EXPRESSION,
      isStatic: false,
      // Set `isConstant` to false by default and will decide in transformExpression
      isConstant: false,
      content,
      loc: getSelection(context, innerStart, innerEnd)
    },
    loc: getSelection(context, start)
  }
}
```

回到循环，如果不是插值，看看是不是处于 TextModes.DATA 模式，以及第一个字符串是不是 '<'，需要注意的一点是，只要没有自定义的 onError 不是抛出错误的话，最后的都会被 parseText 兜底处理的。

下面继续看，如果 `s.length === 1` 则 上报错误，否则如果看看字符串第二位是不是 `!`，因为有可能是 html 注解`<!--`， 也有可能是 DOCTYPE `<!DOCTYPE`, 如果是 `<![CDATA[` 开头且 不是出于 Namespaces.HTML 命名空间下的话，则用 parseCDATA 解析，否则上报 `CDATA_IN_HTML_CONTENT` 错误，如果 `!` 都没有被处理的话，上报 `INCORRECTLY_OPENED_COMMENT` 错误，上面两个错误都用 parseBogusComment 兜底处理 如果上报没有抛出错误的话。

```js
else if (mode === TextModes.DATA && s[0] === '<') {
    // https://html.spec.whatwg.org/multipage/parsing.html#tag-open-state
    if (s.length === 1) {
      emitError(context, ErrorCodes.EOF_BEFORE_TAG_NAME, 1)
    } else if (s[1] === '!') {
      // https://html.spec.whatwg.org/multipage/parsing.html#markup-declaration-open-state
      if (startsWith(s, '<!--')) {
        node = parseComment(context)
      } else if (startsWith(s, '<!DOCTYPE')) {
        // Ignore DOCTYPE by a limitation.
        node = parseBogusComment(context)
      } else if (startsWith(s, '<![CDATA[')) {
        if (ns !== Namespaces.HTML) {
          node = parseCDATA(context, ancestors)
        } else {
          emitError(context, ErrorCodes.CDATA_IN_HTML_CONTENT)
          node = parseBogusComment(context)
        }
      } else {
        emitError(context, ErrorCodes.INCORRECTLY_OPENED_COMMENT)
        node = parseBogusComment(context)
      }
    } else if (s[1] === '/') {
        ...
    } else if (/[a-z]/i.test(s[1])) {
      ...
    } else if (s[1] === '?') {
     ...
    } else {
     ...
    }
}
```

接下来，先讲讲 `!` 开头用到的几个解析函数，parseComment 、parseBogusComment 和 parseCDATA。

先看看 parseComment， 先断言是否符合注释，接着用正则匹配注释的结尾，如果匹配不到，则消费完剩下的 source，同时上报 `EOF_IN_COMMENT` 错误。如果 `match.index <= 3`, 说明匹配到的 `--` 是注释开头的 `--`, 上报`ABRUPT_CLOSING_OF_EMPTY_COMMENT`,如果分组 1 有有值，上报 `INCORRECTLY_CLOSED_COMMENT`,注释结尾不允许有感叹号。接着判断注释里面有没有嵌套注释，有的话，也要上报 `NESTED_COMMENT`，至于`advanceBy(context, nestedIndex - prevIndex + 1)` 为什么要加 1 呢，因为 prevIndex 是 context 中位置的下一个位置，所以需要在修复正确的长度要加 1。最后返回 type 为 NodeTypes.COMMENT， content 为注释内容的 AST 节点。

```js
function parseComment(context: ParserContext): CommentNode {
  __TEST__ && assert(startsWith(context.source, '<!--'));

  const start = getCursor(context);
  let content: string;

  // Regular comment.
  const match = /--(\!)?>/.exec(context.source);
  if (!match) {
    content = context.source.slice(4);
    advanceBy(context, context.source.length);
    emitError(context, ErrorCodes.EOF_IN_COMMENT);
  } else {
    if (match.index <= 3) {
      emitError(context, ErrorCodes.ABRUPT_CLOSING_OF_EMPTY_COMMENT);
    }
    if (match[1]) {
      emitError(context, ErrorCodes.INCORRECTLY_CLOSED_COMMENT);
    }
    content = context.source.slice(4, match.index);

    // Advancing with reporting nested comments.
    const s = context.source.slice(0, match.index);
    let prevIndex = 1,
      nestedIndex = 0;
    while ((nestedIndex = s.indexOf('<!--', prevIndex)) !== -1) {
      advanceBy(context, nestedIndex - prevIndex + 1);
      if (nestedIndex + 4 < s.length) {
        emitError(context, ErrorCodes.NESTED_COMMENT);
      }
      prevIndex = nestedIndex + 1;
    }
    advanceBy(context, match.index + match[0].length - prevIndex + 1);
  }

  return {
    type: NodeTypes.COMMENT,
    content,
    loc: getSelection(context, start),
  };
}
```

再看看 parseBogusComment，也是一开始用正则去判断开头是否符合，这个正则有点意思，就是开头`<`, 中间或者是 `!` 或者 `?` 或者是 `/` 后面跟着不是 a 到 z。

```js
function parseBogusComment(context: ParserContext): CommentNode | undefined {
  __TEST__ && assert(/^<(?:[\!\?]|\/[^a-z>])/i.test(context.source));

  const start = getCursor(context);
  const contentStart = context.source[1] === '?' ? 1 : 2;
  let content: string;

  const closeIndex = context.source.indexOf('>');
  if (closeIndex === -1) {
    content = context.source.slice(contentStart);
    advanceBy(context, context.source.length);
  } else {
    content = context.source.slice(contentStart, closeIndex);
    advanceBy(context, closeIndex + 1);
  }

  return {
    type: NodeTypes.COMMENT,
    content,
    loc: getSelection(context, start),
  };
}
```

我们可以循环那里看看 bogusComment 的适用范围。DOCTYPE 、CDATA 在 Namespaces.HTML 命名空间时、`<！`开头的兜底、s[1] 为 `/` 且 s[2] 不为 `[a-z]`, `<?`开头的。这么一解释，是不是上面的正则就好理解了。

```js
else if (s[1] === '!') {
  // https://html.spec.whatwg.org/multipage/parsing.html#markup-declaration-open-state
  if (startsWith(s, '<!--')) {
    node = parseComment(context)
  } else if (startsWith(s, '<!DOCTYPE')) {
    // Ignore DOCTYPE by a limitation.
    node = parseBogusComment(context)
  } else if (startsWith(s, '<![CDATA[')) {
    if (ns !== Namespaces.HTML) {
      node = parseCDATA(context, ancestors)
    } else {
      emitError(context, ErrorCodes.CDATA_IN_HTML_CONTENT)
      node = parseBogusComment(context)
    }
  } else {
    emitError(context, ErrorCodes.INCORRECTLY_OPENED_COMMENT)
    node = parseBogusComment(context)
  }
} else if (s[1] === '/') {
  // https://html.spec.whatwg.org/multipage/parsing.html#end-tag-open-state
  if (s.length === 2) {
    emitError(context, ErrorCodes.EOF_BEFORE_TAG_NAME, 2)
  } else if (s[2] === '>') {
    emitError(context, ErrorCodes.MISSING_END_TAG_NAME, 2)
    advanceBy(context, 3)
    continue
  } else if (/[a-z]/i.test(s[2])) {
    emitError(context, ErrorCodes.X_INVALID_END_TAG)
    parseTag(context, TagType.End, parent)
    continue
  } else {
    emitError(
      context,
      ErrorCodes.INVALID_FIRST_CHARACTER_OF_TAG_NAME,
      2
    )
    node = parseBogusComment(context)
  }
} else if (/[a-z]/i.test(s[1])) {
  node = parseElement(context, ancestors)
} else if (s[1] === '?') {
  emitError(
    context,
    ErrorCodes.UNEXPECTED_QUESTION_MARK_INSTEAD_OF_TAG_NAME,
    1
  )
  node = parseBogusComment(context)
} else {
  emitError(context, ErrorCodes.INVALID_FIRST_CHARACTER_OF_TAG_NAME, 1)
}
```

那我们回到 parseBogusComment 继续讲解。对于 `context.source[1] === '?'` 为 true， 注释的内容包含 `?`，否则不包含。然后寻找结束标签`>`，找不到消费全部的 source。对于 closeIndex + 1, 因为这才是整个注释的长度。

接下来讲解 parseCDATA。一开始也是两个断言，祖先不能为空，祖先的命名空间不能是 Namespaces.HTML，然后也是要求 `<![CDATA[` 开头的。接着往前推进 context，在里面嵌套调用 parseChildren， 需要注意的是，这是的 `ancestors` 没有元素进栈，也就是没有改变命名空间，第二是解析模式是 `TextModes.CDATA`，这意味着这个嵌套 parseChildren 里面只是调用 parseText 去解析节点。同时返回来的内容可能包含多个节点，这也是 parseChildren 的循环里面需要判断返回的节点是否是数组的原因了。

```js
function parseCDATA(
  context: ParserContext,
  ancestors: ElementNode[]
): TemplateChildNode[] {
  __TEST__ &&
    assert(last(ancestors) == null || last(ancestors)!.ns !== Namespaces.HTML)
  __TEST__ && assert(startsWith(context.source, '<![CDATA['))

  advanceBy(context, 9)
  const nodes = parseChildren(context, TextModes.CDATA, ancestors)
  if (context.source.length === 0) {
    emitError(context, ErrorCodes.EOF_IN_CDATA)
  } else {
    __TEST__ && assert(startsWith(context.source, ']]>'))
    advanceBy(context, 3)
  }

  return nodes
}
```

回到循环, 当 `s[1]` 是 `/` 时， 如果长度就为 2，上报 `EOF_BEFORE_TAG_NAME` 错误，看英文都大概知道啥意思了，没找到 tag 就结束了。如果 `s[2] === '>'`， 上报 `MISSING_END_TAG_NAME` 错误， 往前推进 3 长度，如果 emitError 不抛出错误的话，相当于解析器容忍这个错误， continue 继续解析。如果 `/[a-z]/i.test(s[2])` 成立，就是类似 `</div>`，我们都知道 html 标签要么是成对出现或者 Void Tag,而这种情况会在下面 parseElement 被处理，在这里，我们上报 `X_INVALID_END_TAG` 错误， 并且调用 parseTag 解析节点。最后，如果前面的判断都不满足，就掉入前面所说的 parseBogusComment 中正则匹配的最后一项，同时上报 `INVALID_FIRST_CHARACTER_OF_TAG_NAME` 错误。

```js
else if (s[1] === '/') {
  // https://html.spec.whatwg.org/multipage/parsing.html#end-tag-open-state
  if (s.length === 2) {
    emitError(context, ErrorCodes.EOF_BEFORE_TAG_NAME, 2)
  } else if (s[2] === '>') {
    emitError(context, ErrorCodes.MISSING_END_TAG_NAME, 2)
    advanceBy(context, 3)
    continue
  } else if (/[a-z]/i.test(s[2])) {
    emitError(context, ErrorCodes.X_INVALID_END_TAG)
    parseTag(context, TagType.End, parent)
    continue
  } else {
    emitError(
      context,
      ErrorCodes.INVALID_FIRST_CHARACTER_OF_TAG_NAME,
      2
    )
    node = parseBogusComment(context)
  }
}
```

回到循环，`else if (s[1] === '/') {` 分支讲解完毕，接下来讲 `/[a-z]/i.test(s[1])` 分支。这个分支，就是整儿八经地处理标签的分支了。

```js
else if (/[a-z]/i.test(s[1])) {
  node = parseElement(context, ancestors)
}
```

下面就是 parseElement 函数。还是开局断言是不是符合 Element 的开头，wasInPre 、wasInVPre 都是为了保存当前的 pre 状态，因为下面解析 parseTag 的时候 context 上的值会改变，而如果解析后 inPre 或者 inVPre 变为 true，而以前是 false，就说明当前标签是 pre 或者 v-pre 的边界点，也就是由它开启的，在 parseElement 的最后也要恢复成原来的状态。我们看到 parseElement 用到了 parseTag 去解析标签，那么跟着步伐，去看看 parseTag。

```js
function parseElement(
  context: ParserContext,
  ancestors: ElementNode[]
): ElementNode | undefined {
  __TEST__ && assert(/^<[a-z]/i.test(context.source))

  // Start tag.
  const wasInPre = context.inPre
  const wasInVPre = context.inVPre
  const parent = last(ancestors)
  const element = parseTag(context, TagType.Start, parent)
  const isPreBoundary = context.inPre && !wasInPre
  const isVPreBoundary = context.inVPre && !wasInVPre

  ...

  if (isPreBoundary) {
    context.inPre = false
  }
  if (isVPreBoundary) {
    context.inVPre = false
  }
  return element
}

```

parseTag 不仅仅用于在 parseElement 中解析标签，同时我们在上面讲过一些情况进行兜底，就是只有结束标签的情况。

可以看到一上来也是先对我们的字符串进行断言，同时判断我们的字符串是否跟我们要解析的 TagType 模式是否匹配，总不能你传进来开始的 tag，告诉我这是结束模式。

接着拿到开始位置 start、正则去匹配标签、拿到 tag、拿到当前标签所处的命名空间（这个是 options 传进来的），需要注意正则中 tag 开头只能是 `[a-z]`, 干完这些，我们开始往前推进 context，消耗标签、消耗空格，目的就是为了我们下面进行标签属性的解析，然后保存当前的位置和字符串，因为如果后面解析属性过程中，如果遇到了 v-pre 标签，需要重新解析标签属性，至于为什么要这样做呢，后面会讲到。

可以看到，在 parseTag 里面，又调用了 parseAttributes 去解析标签的属性，props 是我们解析回来的属性数组。接着我们又校验是不是 isPreTag，这个校验方法是从 options 透传下来的，同时也可以看到 context 在解析过程中一直处于变化过程的。接下来关键的一步来了，如果以前不是 isInPre 但是解析出来的 props 有 v-pre 指令，如果有,context.isInPre 就为 true 状态，最重要的是，恢复解析 props 之前的 source 和 位置，我们要重新解析 props，可以透露的一点是，这个影响到我们需不需要对内置的一些指令进行二次转化，如果是处于 v-pre 环境下来，那么则不需要转化，这个后面细讲。

我们要看看这个标签是否正确关闭，source 没了，肯定不行，上报 `EOF_IN_TAG`, 如果我们解析的是结束标签，又碰到了自闭合的字符 `/>`，也不行啊，上报 `END_TAG_WITH_TRAILING_SOLIDUS`, 同时往前推进 context。

```js
/**
 * Parse a tag (E.g. `<div id=a>`) with that type (start tag or end tag).
 */
function parseTag(
  context: ParserContext,
  type: TagType,
  parent: ElementNode | undefined
): ElementNode {
  __TEST__ && assert(/^<\/?[a-z]/i.test(context.source))
  __TEST__ &&
    assert(
      type === (startsWith(context.source, '</') ? TagType.End : TagType.Start)
    )

  // Tag open.
  const start = getCursor(context)
  const match = /^<\/?([a-z][^\t\r\n\f />]*)/i.exec(context.source)!
  const tag = match[1]
  const ns = context.options.getNamespace(tag, parent)

  advanceBy(context, match[0].length)
  advanceSpaces(context)

  // save current state in case we need to re-parse attributes with v-pre
  const cursor = getCursor(context)
  const currentSource = context.source

  // Attributes.
  let props = parseAttributes(context, type)

  // check <pre> tag
  if (context.options.isPreTag(tag)) {
    context.inPre = true
  }

  // check v-pre
  if (
    !context.inVPre &&
    props.some(p => p.type === NodeTypes.DIRECTIVE && p.name === 'pre')
  ) {
    context.inVPre = true
    // reset context
    extend(context, cursor)
    context.source = currentSource
    // re-parse attrs and filter out v-pre itself
    props = parseAttributes(context, type).filter(p => p.name !== 'v-pre')
  }

  // Tag close.
  let isSelfClosing = false
  if (context.source.length === 0) {
    emitError(context, ErrorCodes.EOF_IN_TAG)
  } else {
    isSelfClosing = startsWith(context.source, '/>')
    if (type === TagType.End && isSelfClosing) {
      emitError(context, ErrorCodes.END_TAG_WITH_TRAILING_SOLIDUS)
    }
    advanceBy(context, isSelfClosing ? 2 : 1)
  }

  ...

  return {
    type: NodeTypes.ELEMENT,
    ns,
    tag,
    tagType,
    props,
    isSelfClosing,
    children: [],
    loc: getSelection(context, start),
    codegenNode: undefined // to be created during transform phase
  }
}

```

parseTag 解析完属性、标签，接下来就要判断这个 Tag 标签的 tagType 了，注意我们跟 AST 的 type 区别开来，type 只是区别这个 AST 大致是什么类型， tagType 是细分到我们这个属于 ElementTypes 的什么类型，这对于后续 diff 和 transform 等很多地方起到很大的作用。

康康下面，默认的 tagType 是 ElementTypes.ELEMENT，然后开启我们的判断，也是 v-pre 则跳过判断，但还有一个点就是 isCustomElement 自定义标签，这个常见的用法就是我们的自定义的 WebComponent。

如果进入了第一层判断，我们首先去搜寻有没有 is 指令，对于不是平台原生 tag 且没有 is 指令的，我们认为 tagType 是 ElementTypes.COMPONENT。对于 dom 平台，
原生 tag 就是 `isNativeTag: tag => isHTMLTag(tag) || isSVGTag(tag)`。

而如果有 is 指令 、框架核心组件、平台内建组件、大写开头的标签、tag 是 component 的，我们都认为是 ElementTypes.COMPONENT。大写开头的标签，这个我们写过 vue 都知道了，tag 是 component 更不要说了。框架核心组件就是包括了 Teleport、Suspense、KeepAlive、BaseTransition，你可以认为是与平台无关的内置组件，而平台内建组件就是 Transition、 TransitionGroup。

对于 tag 为 slot，我们标识为 ElementTypes.SLOT， 嗯要特殊处理。

而对于 tag 为 template 的，只有它有 `if,else,else-if,for,slot` 这些指令，我们在认为他是 ElementTypes.TEMPLATE。

```js
let tagType = ElementTypes.ELEMENT
const options = context.options
if (!context.inVPre && !options.isCustomElement(tag)) {
    const hasVIs = props.some(
      p => p.type === NodeTypes.DIRECTIVE && p.name === 'is'
    )
    if (options.isNativeTag && !hasVIs) {
      if (!options.isNativeTag(tag)) tagType = ElementTypes.COMPONENT
    } else if (
      hasVIs ||
      isCoreComponent(tag) ||
      (options.isBuiltInComponent && options.isBuiltInComponent(tag)) ||
      /^[A-Z]/.test(tag) ||
      tag === 'component'
    ) {
      tagType = ElementTypes.COMPONENT
    }

    if (tag === 'slot') {
      tagType = ElementTypes.SLOT
    } else if (
      tag === 'template' &&
      props.some(p => {
        return (
          p.type === NodeTypes.DIRECTIVE && isSpecialTemplateDirective(p.name)
        )
      })
    ) {
      tagType = ElementTypes.TEMPLATE
    }
}

export function isCoreComponent(tag: string): symbol | void {
  if (isBuiltInType(tag, 'Teleport')) {
    return TELEPORT
  } else if (isBuiltInType(tag, 'Suspense')) {
    return SUSPENSE
  } else if (isBuiltInType(tag, 'KeepAlive')) {
    return KEEP_ALIVE
  } else if (isBuiltInType(tag, 'BaseTransition')) {
    return BASE_TRANSITION
  }
}

isBuiltInComponent: (tag: string): symbol | undefined => {
    if (isBuiltInType(tag, `Transition`)) {
      return TRANSITION
    } else if (isBuiltInType(tag, `TransitionGroup`)) {
      return TRANSITION_GROUP
    }
},

const isSpecialTemplateDirective = /*#__PURE__*/ makeMap(
  `if,else,else-if,for,slot`
)

```

回到 parseTag 收尾，最后返回 AST 类型为 NodeTypes.ELEMENT，codegenNode 在 transform 阶段的 transformElement 时会生成， children 是他下一级的 node 的挂载点。对于 parseTag ，有两个点还需要补充，一个是 getNamespace ，另外一个是 parseAttributes。再次提醒的是，我们还在 parseElement 里面还没游出来呢。

```js
return {
  type: NodeTypes.ELEMENT,
  ns,
  tag,
  tagType,
  props,
  isSelfClosing,
  children: [],
  loc: getSelection(context, start),
  codegenNode: undefined, // to be created during transform phase
};
```

getNamespace 主要是对为了获取正确的命名空间，正如我们在上面一直说的，不同的命名空间会对解析是有影响的，对于 dom 平台来说，目前就三种命名空间，`DOMNamespaces.HTML` html 命名空间，`DOMNamespaces.MATH_ML` math ml 命名空间，`DOMNamespaces.SVG` svg 命名空间。

在 getNamespace 内部，首先拿到父级的命名空间，默认是 DOMNamespaces.HTML。需要注意的是，如果没有我们没有对 ns 变量进行覆盖或者提前 return，则说明当前 tag 的 ns 跟 父级的 ns 一样，因为函数最后的把 ns 返回去的。

接下来将针对父级存在的情况下进行解析，如果父级 ns 是 MATH_ML 且 父级标签是 `annotation-xml` ，这时当前标签是 `svg`，我们认为是处于 svg 的 ns，而这时标签不是 svg 但是父级 annotation-xml 标签的 属性里面有声明下面是 html 即 `text/html` 或 `application/xhtml+xml`， 我们也认为是 HTML 的 ns。对于父级标签 不是`annotation-xml` ，且`/^m(?:[ions]|text)$/.test(parent.tag) && tag !== 'mglyph' && tag !== 'malignmark'`,我们还是认为在 HTML 的 ns。如果上面条件都不满足， MATH_ML 这个 ns 讲传递给当前 tag。

而对于父级是 SVG 的 ns，只有父级 tag 是 `parent.tag === 'foreignObject' || parent.tag === 'desc' || parent.tag === 'title'` 这些 tag 的时候，当前 tag 才算在 HTML 的 ns，否则继续 SVG 的 ns。

最后对于父级 ns 为 HTML 的处理，主要当前 tag 是 `svg` 或者 `math`, 则会变化 ns 为 SVG 或者 MATH_ML。

```js
// https://html.spec.whatwg.org/multipage/parsing.html#tree-construction-dispatcher
getNamespace(tag: string, parent: ElementNode | undefined): DOMNamespaces {
    let ns = parent ? parent.ns : DOMNamespaces.HTML

    if (parent && ns === DOMNamespaces.MATH_ML) {
      if (parent.tag === 'annotation-xml') {
        if (tag === 'svg') {
          return DOMNamespaces.SVG
        }
        if (
          parent.props.some(
            a =>
              a.type === NodeTypes.ATTRIBUTE &&
              a.name === 'encoding' &&
              a.value != null &&
              (a.value.content === 'text/html' ||
                a.value.content === 'application/xhtml+xml')
          )
        ) {
          ns = DOMNamespaces.HTML
        }
      } else if (
        /^m(?:[ions]|text)$/.test(parent.tag) &&
        tag !== 'mglyph' &&
        tag !== 'malignmark'
      ) {
        ns = DOMNamespaces.HTML
      }
    } else if (parent && ns === DOMNamespaces.SVG) {
      if (
        parent.tag === 'foreignObject' ||
        parent.tag === 'desc' ||
        parent.tag === 'title'
      ) {
        ns = DOMNamespaces.HTML
      }
    }

    if (ns === DOMNamespaces.HTML) {
      if (tag === 'svg') {
        return DOMNamespaces.SVG
      }
      if (tag === 'math') {
        return DOMNamespaces.MATH_ML
      }
    }
    return ns
},
```

OK，那现在就讲讲 parseAttributes ，看看是怎么解析属性的，也在这里揭秘为什么 v-pre 要重新解析一次属性。 props 是最后返回去的属性数组，同时维护一个 attributeNames 用于解析属性过程中进行去重校验。接下来，也是一个 while 不断去读取字符串，如果 source 消耗完毕 又或者遇到了标签结束的符号 `>` 或 `/>`, 才退出循环。 进去循环后，如果一开波就给我们一个 `/`，上报 `UNEXPECTED_SOLIDUS_IN_TAG` 错误，往前推进 context 同时消耗空格。如果要开始解析具体属性了，但是 type 是 `TagType.End`，这也不行，不能在结束标签带属性，上报 `END_TAG_WITH_ATTRIBUTES` 错误。接着使用 parseAttribute 去解析具体某个属性，解析成功后，再次校验是否是 TagType.Start， 如果是，塞入 props 数组，同时对字符串进行校验，如果下个属性与当前属性没有 `[^\t\r\n\f />]` 这些做间隔，上报 `MISSING_WHITESPACE_BETWEEN_ATTRIBUTES` 错误，就是类似 `<div id="foo"class="bar"></div>`, id 和 class 之间没有间隔，循环最后消耗字符串中的空格。就这样的一个循环，把 Tag 上的全部标签解析出来，最后 return 出去。当然具体单个属性的解析在 parseAttribute 函数里面，下面就讲到。

```js
function parseAttributes(
  context: ParserContext,
  type: TagType
): (AttributeNode | DirectiveNode)[] {
  const props = []
  const attributeNames = new Set<string>()
  while (
    context.source.length > 0 &&
    !startsWith(context.source, '>') &&
    !startsWith(context.source, '/>')
  ) {
    if (startsWith(context.source, '/')) {
      emitError(context, ErrorCodes.UNEXPECTED_SOLIDUS_IN_TAG)
      advanceBy(context, 1)
      advanceSpaces(context)
      continue
    }
    if (type === TagType.End) {
      emitError(context, ErrorCodes.END_TAG_WITH_ATTRIBUTES)
    }

    const attr = parseAttribute(context, attributeNames)
    if (type === TagType.Start) {
      props.push(attr)
    }

    if (/^[^\t\r\n\f />]/.test(context.source)) {
      emitError(context, ErrorCodes.MISSING_WHITESPACE_BETWEEN_ATTRIBUTES)
    }
    advanceSpaces(context)
  }
  return props
}
```

对于具体属性解析，分成两部分，parseAttribute 和 parseAttributeValue，因为我们知道属性大部分有值。

闲话不多说，看看 parseAttribute。断言 source 已经思考见惯了，接着保存 name 的位置，同时尝试用正则去匹配字符串获取属性的名字 name，这个正则也是很宽泛，就是排除空白字符和结束字符，同时对于属性名字的第一位允许 `=`，虽然在下面会上报 `UNEXPECTED_EQUALS_SIGN_BEFORE_ATTRIBUTE_NAME` 错误，属性名字的后面就不允许 `=` 符号了，毕竟这是用来切割属性名和属性值的。

nameSet 就是我们在上面 parseAttributes 传下来的 set 集合，如果重复了，上报 DUPLICATE_ATTRIBUTE。记着把我们的属性名加入 set 集合里面。

除了等号不能出现在集合名， `/["'<]/g` 这些也不可以，对于检测到的，上报 `UNEXPECTED_CHARACTER_IN_ATTRIBUTE_NAME` 错误。

继续往前推进，接着开始解析属性值，对于一个属性而言，不一定有属性值，所以需要正则匹配判断一下，没问题之后，需要等号前面可能存在的空格、等号长度、等号后面的空格，做完这些预备动作，才开始真正调用 parseAttributeValue 去解析属性值，当然如果解析不到属性值，上报 `MISSING_ATTRIBUTE_VALUE` 错误。

在 返回 Attribute 之前，会对 directive 指令属性进行解析，这也是我们下面 parseAttribute 省略号的地方，假设我们的属性不是指令， 最后返回的 AST 结构就是类型为 `NodeTypes.ATTRIBUTE`, 名字是属性名字， value 是 属性值 AST 表示，也可能为空，如果不为空，类型是 `NodeTypes.TEXT`，value 里面的 value 用 parseAttribute 里面返回的 ast 表示。

```js
function parseAttribute(
  context: ParserContext,
  nameSet: Set<string>
): AttributeNode | DirectiveNode {
  __TEST__ && assert(/^[^\t\r\n\f />]/.test(context.source))

  // Name.
  const start = getCursor(context)
  const match = /^[^\t\r\n\f />][^\t\r\n\f />=]*/.exec(context.source)!
  const name = match[0]

  if (nameSet.has(name)) {
    emitError(context, ErrorCodes.DUPLICATE_ATTRIBUTE)
  }
  nameSet.add(name)

  if (name[0] === '=') {
    emitError(context, ErrorCodes.UNEXPECTED_EQUALS_SIGN_BEFORE_ATTRIBUTE_NAME)
  }
  {
    const pattern = /["'<]/g
    let m: RegExpExecArray | null
    while ((m = pattern.exec(name))) {
      emitError(
        context,
        ErrorCodes.UNEXPECTED_CHARACTER_IN_ATTRIBUTE_NAME,
        m.index
      )
    }
  }

  advanceBy(context, name.length)

  // Value
  let value:
    | {
        content: string
        isQuoted: boolean
        loc: SourceLocation
      }
    | undefined = undefined

  if (/^[\t\r\n\f ]*=/.test(context.source)) {
    advanceSpaces(context)
    advanceBy(context, 1)
    advanceSpaces(context)
    value = parseAttributeValue(context)
    if (!value) {
      emitError(context, ErrorCodes.MISSING_ATTRIBUTE_VALUE)
    }
  }
  const loc = getSelection(context, start)

  ...

  return {
    type: NodeTypes.ATTRIBUTE,
    name,
    value: value && {
      type: NodeTypes.TEXT,
      content: value.content,
      loc: value.loc
    },
    loc
  }
}
```

对于 parseAttribute ，上面我们忽略了两个点，第一个 parseAttributeValue ，第二是指令属性。

先看看 parseAttributeValue，首先保存开始位置，这都是为了最后 AST 的 loc，然后看看我们的属性值是不是被 `"` 或者 `'` 包起来了，如果包起来了，解析前先往前推进一位，同时寻找结束符，如果找不到，直接消费完整个字符串， parseTextData 我们在上面讲过了，如果找到了，消费 endIndex 长度个字符串，同时最后消费结束符。

如果我们的属性值没有被引号包住，首先正则匹配一下，基本就是不允许空白符和标签'`>`，如果匹配失败，直接返回，然后进行二次正则校验，不允许 `/["'<=`]`,需要注意 也不寻`<`和`=`，否则上报`UNEXPECTED_CHARACTER_IN_UNQUOTED_ATTRIBUTE_VALUE`。这些校验都没问题，就返回 value 的 AST 表示，注意`isQuoted` 也要返回去，在 parseAttribute 中修复内容 loc。

```js
function parseAttributeValue(
  context: ParserContext
):
  | {
      content: string
      isQuoted: boolean
      loc: SourceLocation
    }
  | undefined {
  const start = getCursor(context)
  let content: string

  const quote = context.source[0]
  const isQuoted = quote === `"` || quote === `'`
  if (isQuoted) {
    // Quoted value.
    advanceBy(context, 1)

    const endIndex = context.source.indexOf(quote)
    if (endIndex === -1) {
      content = parseTextData(
        context,
        context.source.length,
        TextModes.ATTRIBUTE_VALUE
      )
    } else {
      content = parseTextData(context, endIndex, TextModes.ATTRIBUTE_VALUE)
      advanceBy(context, 1)
    }
  } else {
    // Unquoted
    const match = /^[^\t\r\n\f >]+/.exec(context.source)
    if (!match) {
      return undefined
    }
    const unexpectedChars = /["'<=`]/g
    let m: RegExpExecArray | null
    while ((m = unexpectedChars.exec(match[0]))) {
      emitError(
        context,
        ErrorCodes.UNEXPECTED_CHARACTER_IN_UNQUOTED_ATTRIBUTE_VALUE,
        m.index
      )
    }
    content = parseTextData(context, match[0].length, TextModes.ATTRIBUTE_VALUE)
  }

  return { content, isQuoted, loc: getSelection(context, start) }
}
```

现在我们再来看看 parseAttribute 中对 指令属性的处理。如果出于 inVPre 环境，则我们不需要对指令进行处理，但是有可能我们父级不是 inVPre，但当前 tag 有 v-pre 指令，我们可能一开始进去这里处理了，后面解析完毕之后，发现不需要二次处理，所以需要重新重新解析属性。这个没办法做前置校验，因为只有解析完属性之后才知道有没有 v-pre 指令。

`/^(v-|:|@|#)/.test(name)` 这个正则是为了初步判断属性是不是指令，在进去 if 判断之后，会用正则做进一步的判断，`/(?:^v-([a-z0-9-]+))?(?:(?::|^@|^#)([^\.]+))?(.+)?$/i` 这个看起来很复杂的正则，就是为了提取属性名中的指令名、指令的参数以及执行的修饰符。

对于分组 2 前面的 `(?::|^@|^#)`，属于指令的语法糖，分别代表 bind、 click 和 slot，这个我们在返回指令 AST 的 name 那里也可以看到，我们需要解决的分组 2 的内容进行校验，分组 2 属于指令的参数，可以是动态的，像 `v-on:[event]`, event 就是动态参数，但是 `v-on:[event test]` 会上报 `X_MISSING_DYNAMIC_DIRECTIVE_ARGUMENT_END` 错误的，因为前面我们匹配属性名正则的时候，不包括空格，所以动态参数找不到结束符 `]`。参数也会返回一个 AST，类型是 SIMPLE_EXPRESSION，其中 isStatic 是由 参数是不是动态决定的。

接着指令还会对属性内容位置进行裁剪，如果是 isQuoted ，也会把能属性内容位置中的内容的引号去掉，同时修复里面的开始、结束位置。

最后提前返回指令的 AST，类型是 NodeTypes.DIRECTIVE， 其中 name 上面说过，exp 是讲属性内容转化成 AST 类型为 SIMPLE_EXPRESSION 的节点，其中这个节点 isConstant 会在 transformExpression 节点确定的，现在需要做的就是把这点记在本子上。arg 是指令参数，modifiers 是指令的修饰符，属于正则中的分组 3 里面的内容、

```js
if (!context.inVPre && /^(v-|:|@|#)/.test(name)) {
    const match = /(?:^v-([a-z0-9-]+))?(?:(?::|^@|^#)([^\.]+))?(.+)?$/i.exec(
      name
    )!

    let arg: ExpressionNode | undefined

    if (match[2]) {
      const startOffset = name.indexOf(match[2])
      const loc = getSelection(
        context,
        getNewPosition(context, start, startOffset),
        getNewPosition(context, start, startOffset + match[2].length)
      )
      let content = match[2]
      let isStatic = true

      if (content.startsWith('[')) {
        isStatic = false

        if (!content.endsWith(']')) {
          emitError(
            context,
            ErrorCodes.X_MISSING_DYNAMIC_DIRECTIVE_ARGUMENT_END
          )
        }

        content = content.substr(1, content.length - 2)
      }

      arg = {
        type: NodeTypes.SIMPLE_EXPRESSION,
        content,
        isStatic,
        isConstant: isStatic,
        loc
      }
    }

    if (value && value.isQuoted) {
      const valueLoc = value.loc
      valueLoc.start.offset++
      valueLoc.start.column++
      valueLoc.end = advancePositionWithClone(valueLoc.start, value.content)
      valueLoc.source = valueLoc.source.slice(1, -1)
    }

    return {
      type: NodeTypes.DIRECTIVE,
      name:
        match[1] ||
        (startsWith(name, ':')
          ? 'bind'
          : startsWith(name, '@')
            ? 'on'
            : 'slot'),
      exp: value && {
        type: NodeTypes.SIMPLE_EXPRESSION,
        content: value.content,
        isStatic: false,
        // Treat as non-constant by default. This can be potentially set to
        // true by `transformExpression` to make it eligible for hoisting.
        isConstant: false,
        loc: value.loc
      },
      arg,
      modifiers: match[3] ? match[3].substr(1).split('.') : [],
      loc
    }
}
```

终于把 parseAttribute 讲完了，parseAttribute 回到 parseAttributes，parseAttributes 回到 parseTag, parseTag 回到 parseElement，这个调用栈有点长，希望你们还没晕。

还记得我们在进去 parseTag 这个旋涡之前，parseElement 讲到那里了吗？我们讲到了 `const element = parseTag(context, TagType.Start, parent)` 这里，OK，这里我们终于拿到了我们解析的元素了。

isPreBoundary 为 true，说明我们这个元素就是 pre ，因为 wasInPre 为 false，同理 isVPreBoundary 是 v-pre 的标识。

对于元素自己关闭的，或者是平台的 isVoidTag ，直接返回 element，因为不需要下面的解析子元素和结束标签。

对于解析子元素前，首先把当前元素推入 ancestors 中，ancestors 影响到了我们怎么去结束 parseChildren、namespace 的判断等等，同时这也是解析中唯一入栈的地方，也就是说，对于其他解析来说，如 paeComment、paserBogusComment 等等，都是没有子元素的，我们从 parseTag 的 AST 看到 children 也可以大概猜到了。接着拿 mode，getTextMode 最上面讲过，我们可以看到，只有当前元素命名空间是 DOMNamespaces.HTML 时，getTextMode 才会返回其他的 TextModes，否则一律都是 TextModes.DATA，而我们也知道，parseChildren 只对 `mode === TextModes.DATA || mode === TextModes.RCDATA` 这两个模式有细致的解析，不然都是走粗暴的 parseText。 parseChildren 解析完毕之后，返回的 nodes 节点，塞入 element 的 children，同时把 element 从 ancestors 中弹出。然后我们看看我们的 element 有没有关闭标签，如果有，调用 parseTag 去解析，别忘记前面这个关闭标签不能有属性，这个返回的 AST 不需要保存，我们只是为了推进 context。如果没有关闭标签，上报 `X_MISSING_END_TAG`, 而如果甚至连 source 也没了，element 的 tag 是 script，且当前第一个元素是注释，上报 `EOF_IN_SCRIPT_HTML_COMMENT_LIKE_TEXT`,很懵圈是不，来，给你看测试用例,
`<script><!--console.log('hello')`, get ？

parseElement 修复结束标签的位置，同时重置 context 中的 inPre 和 inVPre, 可以看到 parseElement 相比于 parseTag 的 AST，就是添加了子元素的 AST，同时修复 loc，还有消费结束标签。

```js
function parseElement(context: ParserContext, ancestors: ElementNode[]): ElementNode | undefined {
  __TEST__ && assert(/^<[a-z]/i.test(context.source));

  // Start tag.
  const wasInPre = context.inPre;
  const wasInVPre = context.inVPre;
  const parent = last(ancestors);
  const element = parseTag(context, TagType.Start, parent);
  const isPreBoundary = context.inPre && !wasInPre;
  const isVPreBoundary = context.inVPre && !wasInVPre;

  if (element.isSelfClosing || context.options.isVoidTag(element.tag)) {
    return element;
  }

  // Children.
  ancestors.push(element);
  const mode = context.options.getTextMode(element, parent);
  const children = parseChildren(context, mode, ancestors);
  ancestors.pop();

  element.children = children;

  // End tag.
  if (startsWithEndTagOpen(context.source, element.tag)) {
    parseTag(context, TagType.End, parent);
  } else {
    emitError(context, ErrorCodes.X_MISSING_END_TAG, 0, element.loc.start);
    if (context.source.length === 0 && element.tag.toLowerCase() === 'script') {
      const first = children[0];
      if (first && startsWith(first.loc.source, '<!--')) {
        emitError(context, ErrorCodes.EOF_IN_SCRIPT_HTML_COMMENT_LIKE_TEXT);
      }
    }
  }

  element.loc = getSelection(context, element.loc.start);

  if (isPreBoundary) {
    context.inPre = false;
  }
  if (isVPreBoundary) {
    context.inVPre = false;
  }
  return element;
}
```

parseElment 的上一级调用栈是 parseChildren，还记得我们大明湖畔的 while 循环吗？parseElement 我们分析完了，`s[1] === '?'` 就是 `<?`，我们也讲过了。这些条件都不满足，上报 `INVALID_FIRST_CHARACTER_OF_TAG_NAME` 错误，就是 `<` 后面不知道跟着是什么字符串。反正最后有 parseText 兜底。

```js
else if (/[a-z]/i.test(s[1])) {
  node = parseElement(context, ancestors)
} else if (s[1] === '?') {
  emitError(
    context,
    ErrorCodes.UNEXPECTED_QUESTION_MARK_INSTEAD_OF_TAG_NAME,
    1
  )
  node = parseBogusComment(context)
} else {
  emitError(context, ErrorCodes.INVALID_FIRST_CHARACTER_OF_TAG_NAME, 1)
}
```

看看，parseText 兜底，接下来就是调用 pushNode 把返回的节点塞入 nodes，为什么 node 会是数组呢？ parseCDATA 里面调用 parseChildren ，而 parseCDATA 的解析都是同级的，所以你懂的。pushNode 的目的，就是为了合并相邻 NodeTypes.TEXT 节点，再拿 parseCDATA 举例，在解析过程中，parseText 会根据 endTokens 切割节点，所以会出现多个 NodeTypes.TEXT 不在同个 AST，同样还有注释中的例子，`a < b`。

```js
if (!node) {
  node = parseText(context, mode);
}

if (isArray(node)) {
  for (let i = 0; i < node.length; i++) {
    pushNode(nodes, node[i]);
  }
} else {
  pushNode(nodes, node);
}
function pushNode(nodes: TemplateChildNode[], node: TemplateChildNode): void {
  // ignore comments in production
  /* istanbul ignore next */
  if (!__DEV__ && node.type === NodeTypes.COMMENT) {
    return;
  }

  if (node.type === NodeTypes.TEXT) {
    const prev = last(nodes);
    // Merge if both this and the previous node are text and those are
    // consecutive. This happens for cases like "a < b".
    if (prev && prev.type === NodeTypes.TEXT && prev.loc.end.offset === node.loc.start.offset) {
      prev.content += node.content;
      prev.loc.end = node.loc.end;
      prev.loc.source += node.loc.source;
      return;
    }
  }

  nodes.push(node);
}
```

parseChildren 收尾部分，是要要对节点中的 NodeTypes.TEXT 中空白节点进行处理。对于 TextModes.RAWTEXT 模式就不进行处理了。

如果是其他模式，context.inPre 为 false，循环所有的节点。如果`!/[^\t\r\n\f ]/.test(node.content)` 为真， 表示这个节点是空白节点，对于空白节点，注释也写的很清楚了，对于第一个或者最后一个空白节点，可以忽略，同时如果移除注释前后的空白节点，而对于夹在两个元素中间的空白节点，如果这个空白节点是含有换行符，才才进行移除，如果要移除节点，就将 `removedWhitespace` 设为 true,这样在最后返回的时候，用 filter(Boolean) 过滤置空的空白节点，`nodes[i] = null as any` 就是这样置空。如果空白节点不满足上面的条件，把空白节点的内容缩减成一个空白。最后而对于不是空白节点的 NodeTypes.TEXT 节点，移除内容中的空白。

如果对于 context.inPre 为 true ，而父级就是 pre 元素的，移除第一个节点的换行符，也就是说，我们只关心 pre 下面第一个节点的开头不能是换行符，孙子节点不在在乎。

```js
// Whitespace management for more efficient output
  // (same as v2 whitespace: 'condense')
  let removedWhitespace = false
  if (mode !== TextModes.RAWTEXT) {
    if (!context.inPre) {
      for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i]
        if (node.type === NodeTypes.TEXT) {
          if (!/[^\t\r\n\f ]/.test(node.content)) {
            const prev = nodes[i - 1]
            const next = nodes[i + 1]
            // If:
            // - the whitespace is the first or last node, or:
            // - the whitespace is adjacent to a comment, or:
            // - the whitespace is between two elements AND contains newline
            // Then the whitespace is ignored.
            if (
              !prev ||
              !next ||
              prev.type === NodeTypes.COMMENT ||
              next.type === NodeTypes.COMMENT ||
              (prev.type === NodeTypes.ELEMENT &&
                next.type === NodeTypes.ELEMENT &&
                /[\r\n]/.test(node.content))
            ) {
              removedWhitespace = true
              nodes[i] = null as any
            } else {
              // Otherwise, condensed consecutive whitespace inside the text down to
              // a single space
              node.content = ' '
            }
          } else {
            node.content = node.content.replace(/[\t\r\n\f ]+/g, ' ')
          }
        }
      }
    } else if (parent && context.options.isPreTag(parent.tag)) {
      // remove leading newline per html spec
      // https://html.spec.whatwg.org/multipage/grouping-content.html#the-pre-element
      const first = nodes[0]
      if (first && first.type === NodeTypes.TEXT) {
        first.content = first.content.replace(/^\r?\n/, '')
      }
    }
  }

  return removedWhitespace ? nodes.filter(Boolean) : nodes

```

补充说一点，看看下面两个测试用例，为什么第一个测试用例要移除空白节点，第二个不用呢，因为第一个用例的空白节点是跟 span 同级的，移除第一个和最后空白节点，第二个用例中的空白节点，属于同级元素间的空白节点且没有换行符，所以不需要移除。

```js
it('should remove whitespaces at start/end inside an element', () => {
  const ast = baseParse(`<div>   <span/>    </div>`)
  expect((ast.children[0] as ElementNode).children.length).toBe(1)
})
it('should NOT remove whitespaces w/o newline between elements', () => {
  const ast = baseParse(`<div/> <div/> <div/>`)
  expect(ast.children.length).toBe(5)
  expect(ast.children.map(c => c.type)).toMatchObject([
    NodeTypes.ELEMENT,
    NodeTypes.TEXT,
    NodeTypes.ELEMENT,
    NodeTypes.TEXT,
    NodeTypes.ELEMENT
  ])
})
```

长呼一口气，parse 模块终于讲完了。只要是知道里面 parseChildren 是个嵌套调用的过程，里面还要进行一定的容错，同时 ns 和 mode 会影响解析，打完收工。

万万没想到，还没有，我竟然忘记最初的梦想了 `baseParse`。 最初我们是在 createParserContext 创建解析上下文 context ，然后保存开始的位置 start，接着使用 createRoot 去创建 AST 的 ROOT 根节点，最后返回这个根节点。

我们看看 createRoot 这个方法，children 就是我们前面用 parseChildren 解析的 AST 节点，即 baseParse 最上层节点是 NodeTypes.ROOT，对于 root 节点，在这里我们只需要理解 type、 children、 loc ，因为其他属性都是在 transform 时候赋值进去的，为了 codegen 、runtime 等时候起到关键作用。 ok，这次 parse 真的讲完了，后面开始讲 transform。

```js
export function baseParse(content: string, options: ParserOptions = {}): RootNode {
  const context = createParserContext(content, options);
  const start = getCursor(context);
  return createRoot(parseChildren(context, TextModes.DATA, []), getSelection(context, start));
}

export function createRoot(children: TemplateChildNode[], loc = locStub): RootNode {
  return {
    type: NodeTypes.ROOT,
    children,
    helpers: [],
    components: [],
    directives: [],
    hoists: [],
    imports: [],
    cached: 0,
    temps: 0,
    codegenNode: undefined,
    loc,
  };
}
```
