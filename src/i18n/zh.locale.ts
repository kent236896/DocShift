/** 中文文案放在 .ts 中，避免 zh.json 在 Windows 上被存成系统 ANSI 编码导致乱码 */
export default {
  app: { title: 'DocShift', subtitle: '文档格式转换器' },
  dropzone: {
    title: '将文件拖放到这里',
    subtitle: '或点击浏览文件',
    hint: '支持 40+ 格式，包括 Word、PDF、Markdown、EPUB 等',
    active: '松开即可添加文件',
    unknown: '未知格式'
  },
  formats: {
    selectOutput: '输出格式',
    searchPlaceholder: '搜索格式...',
    common: '常用格式',
    groups: { documents: '文档', markup: '标记与文本', presentations: '演示文稿', data: '数据与其他' }
  },
  queue: {
    title: '队列',
    empty: '尚未添加文件',
    emptyHint: '在上方拖放文件开始转换',
    convertAll: '全部转换',
    clearAll: '清除已完成',
    cancel: '取消',
    retry: '重试',
    remove: '移除',
    summary: '共 {{total}} 个文件，完成 {{done}}，失败 {{failed}}',
    status: { pending: '等待中', converting: '转换中...', done: '已完成', error: '失败' },
    progress: '{{percent}}%',
    fileSize: '{{size}}'
  },
  history: {
    title: '历史记录',
    loading: '加载中…',
    empty: '暂无转换历史',
    convertAgain: '再次转换',
    clearAll: '清空历史',
    clearConfirm: '确定清空所有历史记录吗？此操作不可撤销。',
    filter: { all: '全部', success: '成功', failed: '失败' },
    groups: { today: '今天', yesterday: '昨天', older: '更早' }
  },
  presets: {
    title: '预设',
    save: '保存为预设',
    namePlaceholder: '预设名称',
    apply: '应用',
    delete: '删除',
    empty: '暂无保存的预设',
    saveSuccess: '预设已保存'
  },
  settings: {
    title: '设置',
    language: '语言',
    langAuto: '自动（随系统）',
    langEn: 'English',
    langZh: '中文',
    theme: '主题',
    themes: { light: '浅色', dark: '深色', system: '跟随系统' },
    outputDir: '输出文件夹',
    outputDirSame: '与输入文件相同目录',
    outputDirCustom: '自定义文件夹',
    browse: '浏览...',
    maxConcurrent: '最大并行转换数',
    openAfterDone: '完成后打开输出文件夹',
    pandocArgs: '额外 Pandoc 参数',
    pandocArgsHint:
      '可选。填写 pandoc 命令行参数（写在输入文件名之前）。例如 --toc 生成目录，--number-sections 给标题自动编号。不熟悉可留空。',
    about: '关于',
    version: '版本 {{version}}',
    pandocVersion: 'Pandoc {{version}}',
    license: '使用 Pandoc（GPL）。源码：github.com/jgm/pandoc'
  },
  actions: { ok: '确定', cancel: '取消', confirm: '确认', close: '关闭' },
  errors: {
    pandocNotFound: '未找到 Pandoc 可执行文件，请重新安装 DocShift。',
    inputNotFound: '输入文件不存在：{{path}}',
    conversionFailed: '转换失败：{{message}}',
    unknownFormat: '无法识别格式：{{filename}}',
    outputDirMissing: '输出目录不存在：{{path}}'
  },
  notifications: { allDone: '所有转换已完成', someFailed: '成功 {{success}}，失败 {{failed}}' },
  titlebar: { queue: '队列', history: '历史', settings: '设置', more: '更多', closePanel: '关闭' }
} as const;
