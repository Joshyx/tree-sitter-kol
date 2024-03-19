module.exports = grammar({
    name: 'kol',

    word: $ => $.identifier,
    extras: $ => [
        $.comment,
        /[\s\p{Zs}\uFEFF\u2028\u2029\u2060\u200B]/,
    ],

    rules: {
        source_file: $ => repeat($._definition),

        _definition: $ => choice(
            $.function_definition,
            $._statement,
            $._expression,
            $.struct_definition,
        ),

        function_definition: $ => seq(
            'fun',
            field('name', $.identifier),
            field('parameters', $.parameter_list),
            optional(field('return_type', $.type)),
            field('body', $.block)
        ),
        parameter_list: $ => seq(
            '(',
            commaSep($.parameter_definition),
            ')',
        ),
        parameter_definition: $ => seq(
            field('name', $.identifier),
            ':',
            field('type', $.type),
        ),
        struct_definition: $ => seq(
            'struct',
            field('name', $.identifier),
            field('fields', $.field_declaration_list),
        ),
        field_declaration_list: $ => seq(
            '{',
            commaSep($.field_declaration),
            '}'
        ),
        field_declaration: $ => seq(
            field('name', $.identifier),
            ':',
            field('type', $.type),
        ),

        type: $ => choice(
            'bool',
            'int',
            'float',
            'str',
            'void',
            'array',
            'map',
            'fn',
        ),

        block: $ => seq(
            '{',
            repeat(choice($._definition)),
            '}'
        ),

        _statement: $ => choice(
            $.return_statement,
            $.break_statement,
            $.let_statement,
            $.reassign_statement,
        ),

        return_statement: $ => seq(
            'return',
            $._expression,
            optional(';'),
        ),
        break_statement: $ => seq(
            'break',
            $._expression,
            optional(';'),
        ),
        let_statement: $ => seq(
            'let',
            field('mutable', optional('mut')),
            field('name', $.identifier),
            '=',
            field('value', $._expression),
            optional(';'),
        ),
        reassign_statement: $ => seq(
            field('name', $.identifier),
            '=',
            field('value', $._expression),
            optional(';'),
        ),
        if_statement: $ => seq(
            'if',
            field('condition', $._expression),
            field('consequence', $.block),
            optional(seq(
                'else',
                field('alternative', $.block),
            )),
        ),
        for_statement: $ => seq(
            'for',
            field('condition', $._expression),
            field('consequence', $.block),
            optional(seq(
                'else',
                field('alternative', $.block),
            )),
        ),

        _expression: $ => choice(
            $.identifier,
            $.int,
            $.float,
            $.string,
            $._boolean,
            $.unary_expression,
            $.binary_expression,
            $.if_statement,
            $.for_statement,
            $.struct_instantiation,
        ),
        struct_instantiation: $ => prec.left(4, seq(
            field('type', $.identifier),
            '{',
            field('field', commaSep($.field_assignment)),
            '}',
        )),
        field_assignment: $ => seq(
            field('name', $.identifier),
            ':',
            field('value', $._expression),
        ),
        unary_expression: $ => prec(4, choice(
            seq('-', $._expression),
            seq('!', $._expression),
        )),
        binary_expression: $ => choice(
            prec.left(5, $.dot_expression),
            prec.left(4, $.call_expression),
            prec.left(3, seq($._expression, '*', $._expression)),
            prec.left(3, seq($._expression, '/', $._expression)),
            prec.left(3, seq($._expression, '%', $._expression)),
            prec.left(2, seq($._expression, '+', $._expression)),
            prec.left(2, seq($._expression, '-', $._expression)),
            prec.left(1, seq($._expression, '<', $._expression)),
            prec.left(1, seq($._expression, '>', $._expression)),
            prec.left(1, seq($._expression, '<=', $._expression)),
            prec.left(1, seq($._expression, '>=', $._expression)),
            prec.left(0, seq($._expression, '==', $._expression)),
            prec.left(0, seq($._expression, '!=', $._expression)),
            prec.left(0, seq($._expression, '&&', $._expression)),
            prec.left(0, seq($._expression, '||', $._expression)),
        ),
        dot_expression: $ => seq(
            field('object', $._expression),
            '.',
            field('property', $.identifier),
        ),
        call_expression: $ => seq(
            field('function', $._expression),
            '(',
            field('arguments', commaSep($._expression)),
            ')',
        ),

        identifier: $ => /[a-zA-Z][a-zA-Z_0-9]*/,

        int: $ => /\d+/,
        float: $ => /\d+\.\d+/,

        string: $ => /"([^"\\]|\\.)*"/,

        comment: $ => choice(
            token(choice(
                seq('//', /.*/),
                seq(
                    '/*',
                    /[^*]*\*+([^/*][^*]*\*+)*/,
                    '/',
                ),
            )),
        ),
        _boolean: $ => choice($.true, $.false),
        true: $ => 'true',
        false: $ => 'false',
    }
});

/**
 * Creates a rule to match one or more of the rules separated by a comma
 *
 * @param {Rule} rule
 *
 * @return {SeqRule}
 *
 */
function commaSep1(rule) {
    return seq(rule, repeat(seq(',', rule)), optional(','));
}

/**
 * Creates a rule to optionally match one or more of the rules separated by a comma
 *
 * @param {Rule} rule
 *
 * @return {ChoiceRule}
 *
 */
function commaSep(rule) {
    return optional(commaSep1(rule));
}
