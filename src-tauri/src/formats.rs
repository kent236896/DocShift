use std::collections::HashMap;

#[allow(dead_code)]
pub fn get_extension_to_format_map() -> HashMap<&'static str, &'static str> { let mut map = HashMap::new(); map.insert("docx", "docx"); map.insert("odt", "odt"); map.insert("rtf", "rtf"); map.insert("epub", "epub"); map.insert("pdf", "pdf"); map.insert("md", "markdown"); map.insert("markdown", "markdown"); map.insert("html", "html"); map.insert("htm", "html"); map.insert("rst", "rst"); map.insert("tex", "latex"); map.insert("org", "org"); map.insert("textile", "textile"); map.insert("adoc", "asciidoc"); map.insert("asciidoc", "asciidoc"); map.insert("wiki", "mediawiki"); map.insert("pptx", "pptx"); map.insert("json", "json"); map.insert("csv", "csv"); map.insert("xml", "docbook"); map }
/// Pandoc reader/writer names we pass to `-f` / `-t`: conservative ASCII subset (no path chars).
pub fn is_valid_pandoc_format_id(fmt: &str) -> bool {
  let t = fmt.trim();
  if t.is_empty() || t.len() > 80 {
    return false;
  }
  t.chars().all(|c| c.is_ascii_alphanumeric() || c == '_' || c == '-' || c == '+')
}

pub fn is_valid_output_format(fmt: &str) -> bool {
  matches!(
    fmt,
    "docx" | "odt" | "rtf" | "epub" | "pdf" | "html" | "markdown" | "rst" | "latex" | "org" | "textile" | "asciidoc"
      | "mediawiki" | "pptx" | "beamer" | "revealjs" | "json" | "docbook" | "jats" | "man" | "plain" | "gfm" | "commonmark"
  ) || is_valid_pandoc_format_id(fmt)
}

pub fn is_valid_input_format(fmt: &str) -> bool {
  is_valid_pandoc_format_id(fmt)
}
