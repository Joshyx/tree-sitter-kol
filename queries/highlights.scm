; Variables
;----------

(identifier) @variable

; Function and method definitions
;--------------------------------

(function_definition
  name: (identifier) @function)
(parameter_definition
  name: (identifier) @variable @variable.parameter
  type: (type) @type)
(call_expression
  function: (binary_expression (dot_expression property: (identifier) @function.call)))
(call_expression
  function: (identifier) @function.call)

(let_statement
  name: (identifier) @function)
(reassign_statement
  name: (identifier) @function)

; Structs
;--------------------------------
(struct_definition
  name: (identifier) @type @type.definition)
(field_declaration
  name: (identifier) @property @variable.member
  type: (type) @type)

; Literals
;---------

[
  (true)
  (false)
] @constant.builtin

(type) @type @type.builtin

(comment) @comment

(string) @string

(int) @number
(float) @number

; Tokens
;-------

[
  ";"
  "."
  ","
] @punctuation.delimiter

[
  "break"
  "else"
  "for"
  "fun"
  "if"
  "mut"
  "return"
  "let"
  "for"
  "struct"
]  @keyword

"fun" @keyword.function
"if" @keyword.conditional
"else" @keyword.conditional
"return" @keyword.return

[
  "("
  ")"
  "{"
  "}"
]  @punctuation.bracket

[
  "-"
  "+"
  "*"
  "/"
  "%"
  "<"
  "<="
  "="
  "=="
  "!"
  "!="
  ">"
  ">="
  "&&"
  "||"
] @operator

